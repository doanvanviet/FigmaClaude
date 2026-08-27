import type { CheckMode, IssueType, TextIssue } from "./types";
import { isRuleEnabled, type RulesConfig } from "./rulesConfig";
import { getLocale, t } from "./i18n";

const MODEL = "gemini-2.5-flash";
const BATCH_SIZE = 25;

const EN_INTRO = `Bạn là công cụ kiểm tra chính tả và ngữ pháp tiếng Anh cho nội dung thiết kế UI (Figma).
Đầu vào là một mảng JSON, mỗi phần tử có "id" và "text" lấy từ một text layer trong bản thiết kế.
Với mỗi phần tử, phân tích "text" và liệt kê các lỗi thuộc các loại sau (field "type"):`;

const VI_INTRO = `Bạn là công cụ kiểm tra chính tả và ngữ nghĩa tiếng Việt cho nội dung thiết kế UI (Figma).
Đầu vào là một mảng JSON, mỗi phần tử có "id" và "text" lấy từ một text layer trong bản thiết kế.
Với mỗi phần tử, phân tích "text" và liệt kê các lỗi thuộc các loại sau (field "type"):`;

const PROMPT_OUTRO_EN = `
Cốt lõi công việc của bạn CHỈ có 2 việc: (1) phát hiện lỗi đánh máy rõ ràng (1 từ bị gõ sai vài ký tự so với từ tiếng Anh đúng, không phải từ nào tồn tại trong tiếng Anh cả), và (2) phát hiện cụm từ hoàn toàn KHÔNG CÓ NGHĨA (các từ ghép lại không tạo thành ý nghĩa nào cả, kể cả nghĩa khác thường/informal). Nếu 1 từ/cụm từ CÓ THỂ là điều tác giả cố ý viết như vậy (dù lạ, viết tắt, thuật ngữ riêng, cách diễn đạt khác thường nhưng vẫn có nghĩa) thì ĐỪNG báo lỗi — thà bỏ sót còn hơn báo sai/báo linh tinh khiến người dùng phải xử lý quá nhiều gợi ý không cần thiết.
Chỉ báo cáo lỗi thực sự chắc chắn, không suy đoán khi không rõ ràng. Bỏ qua tên riêng thương hiệu, thuật ngữ kỹ thuật, placeholder dạng {variable} hoặc %s — NHƯNG CHỈ khi chúng được viết đúng chính tả/nguyên vẹn. Nếu một thuật ngữ/tên control bị khoảng trắng thừa chèn vào giữa khiến nó không còn là một từ có nghĩa (ví dụ "Textb ox" — đây không phải từ tiếng Anh nào cả, trong khi "Textbox" mới là tên control đúng và có nghĩa), đây VẪN LÀ LỖI CẦN BÁO CÁO (type "spelling"), không được bỏ qua chỉ vì nó "giống" thuật ngữ kỹ thuật.
Một từ đã được viết HOA TOÀN BỘ các chữ cái (ví dụ "API", "ID") luôn được coi là tên viết tắt/thương hiệu có chủ đích, dù không nằm trong từ điển hay danh sách thuật ngữ đã biết — KHÔNG được báo bất kỳ lỗi nào (chính tả, viết hoa/thường...) liên quan đến từ đó.
Phạm vi công cụ CHỈ là phát hiện lỗi khách quan (sai chính tả, dấu câu, từ/cụm từ vô nghĩa, ngữ pháp sai rõ ràng) — KHÔNG phải công cụ cải thiện văn phong/cách hành văn. Do đó: (1) không gợi ý viết lại từ viết tắt thành dạng đầy đủ nếu từ viết tắt đó không sai chính tả — ví dụ không đề xuất đổi "SL" thành "Số lượng" chỉ vì "SL" là viết tắt; (2) không báo lỗi hay gợi ý sửa chỉ vì cách diễn đạt có thể hay hơn/rõ ràng hơn — nếu câu/từ đã đúng chính tả và đúng ngữ pháp thì để nguyên, dù văn phong không phải lựa chọn bạn sẽ chọn.
KHÔNG báo cáo bất kỳ lỗi nào về khoảng trắng thừa/thiếu (đầu văn bản, cuối văn bản, cuối câu, hay bất kỳ vị trí nào) — việc này đã có 1 công cụ khác xử lý riêng, không thuộc phạm vi của bạn, TRỪ trường hợp khoảng trắng chèn vào GIỮA 1 từ khiến từ đó không còn nghĩa (ví dụ "Textb ox") như mô tả bên trên.
Với mỗi lỗi, "original" PHẢI là một chuỗi con xuất hiện chính xác (nguyên văn, đúng ký tự) trong "text" gốc của phần tử đó — đây là điều kiện bắt buộc để hệ thống có thể tìm và thay thế tự động.
"suggestion" là đề xuất sửa (chuỗi thay thế cho "original"), để rỗng "" nếu không có đề xuất cụ thể.
{messageLangInstruction}
Nếu một phần tử không có lỗi, trả về issues là mảng rỗng. Trả về đầy đủ tất cả "id" đã nhận, không được bỏ sót.`;

const PROMPT_OUTRO_VI = `
Cốt lõi công việc của bạn CHỈ có 2 việc: (1) phát hiện lỗi đánh máy rõ ràng (gõ nhầm dấu, telex/vni sai, thiếu/thừa vài ký tự so với từ tiếng Việt đúng), và (2) phát hiện cụm từ/các từ đặt cạnh nhau hoàn toàn KHÔNG CÓ NGHĨA GÌ CẢ. Nếu 1 từ/cụm từ CÓ THỂ là điều tác giả cố ý viết như vậy (dù lạ, viết tắt, thuật ngữ nội bộ, tiếng địa phương, cách diễn đạt khác thường nhưng vẫn có nghĩa) thì ĐỪNG báo lỗi — thà bỏ sót còn hơn báo sai/báo linh tinh khiến người dùng phải xử lý quá nhiều gợi ý không cần thiết mà không đúng ý họ muốn viết.
Chỉ báo cáo lỗi thực sự chắc chắn, không suy đoán khi không rõ ràng. Bỏ qua thuật ngữ kỹ thuật, từ tiếng Anh chêm vào có chủ đích, placeholder dạng {variable} hoặc %s — NHƯNG CHỈ khi chúng được viết đúng chính tả/nguyên vẹn. Nếu một thuật ngữ/tên control (kể cả tiếng Anh) bị khoảng trắng thừa chèn vào giữa khiến nó không còn là một từ có nghĩa (ví dụ "Textb ox" — cụm này vô nghĩa, trong khi "Textbox" mới là tên control đúng và có nghĩa), đây VẪN LÀ LỖI CẦN BÁO CÁO (type "nonsense"), không được bỏ qua chỉ vì nó "giống" thuật ngữ kỹ thuật tiếng Anh.
Một từ đã được viết HOA TOÀN BỘ các chữ cái (ví dụ "API", "ID") luôn được coi là tên viết tắt/thương hiệu có chủ đích, dù không nằm trong từ điển hay danh sách thuật ngữ đã biết — KHÔNG được báo bất kỳ lỗi nào (chính tả, ngữ pháp, "proper_noun" viết hoa/thường...) liên quan đến từ đó.
Phạm vi công cụ CHỈ là phát hiện lỗi khách quan (sai chính tả, dấu câu, từ/cụm từ vô nghĩa, ngữ pháp/dùng từ sai ngữ cảnh rõ ràng) — KHÔNG phải công cụ cải thiện văn phong/cách hành văn. Do đó: (1) không gợi ý viết lại từ viết tắt thành dạng đầy đủ nếu từ viết tắt đó không sai chính tả — ví dụ không đề xuất đổi "SL" thành "Số lượng" chỉ vì "SL" là viết tắt; (2) không báo lỗi hay gợi ý sửa chỉ vì cách diễn đạt có thể hay hơn/rõ ràng hơn — nếu câu/từ đã đúng chính tả, đúng ngữ pháp và có nghĩa thì để nguyên, dù văn phong không phải lựa chọn bạn sẽ chọn.
KHÔNG báo cáo bất kỳ lỗi nào về khoảng trắng thừa/thiếu (đầu văn bản, cuối văn bản, cuối câu, hay bất kỳ vị trí nào) — việc này đã có 1 công cụ khác xử lý riêng, không thuộc phạm vi của bạn, TRỪ trường hợp khoảng trắng chèn vào GIỮA 1 từ/âm tiết khiến nó không còn nghĩa (ví dụ "Ng ày") như mô tả bên trên.
Với mỗi lỗi, "original" PHẢI là một chuỗi con xuất hiện chính xác (nguyên văn, đúng ký tự) trong "text" gốc của phần tử đó — đây là điều kiện bắt buộc để hệ thống có thể tìm và thay thế tự động.
"suggestion" là đề xuất sửa (chuỗi thay thế cho "original"), để rỗng "" nếu không có đề xuất cụ thể.
{messageLangInstruction}
Nếu một phần tử không có lỗi, trả về issues là mảng rỗng. Trả về đầy đủ tất cả "id" đã nhận, không được bỏ sót.`;

const EN_RULE_BULLETS: [string, string][] = [
  [
    "ai-non-english",
    '- "non_english": có từ hoặc cụm từ không phải tiếng Anh (ví dụ tiếng Việt, hoặc ngôn ngữ khác) lẫn vào trong văn bản lẽ ra phải hoàn toàn là tiếng Anh.',
  ],
  [
    "ai-spelling-en",
    '- "spelling": từ bị sai chính tả tiếng Anh. Bao gồm cả trường hợp một từ bị tách rời bởi khoảng trắng thừa chèn ở giữa (ví dụ "Textb      ox" thực chất là "Textbox" bị gõ dính khoảng trắng thừa) — với trường hợp này, "original" phải là toàn bộ đoạn bị tách (kể cả khoảng trắng thừa ở giữa), "suggestion" là từ đúng đã nối lại liền mạch, không phải chỉ rút gọn khoảng trắng còn 1 dấu cách.',
  ],
  ["ai-grammar-en", '- "grammar": lỗi ngữ pháp tiếng Anh rõ ràng.'],
];

const VI_RULE_BULLETS: [string, string][] = [
  [
    "ai-nonsense-vi",
    '- "nonsense": từ hoặc cụm từ vô nghĩa, sai chính tả tiếng Việt, gõ nhầm dấu, sai lỗi telex/vni rõ ràng. Bao gồm cả trường hợp một từ/âm tiết bị tách rời bởi khoảng trắng thừa chèn ở giữa (ví dụ "Ng ày" thực chất là "Ngày" bị gõ dính khoảng trắng thừa) — với trường hợp này, "original" phải là toàn bộ đoạn bị tách (kể cả khoảng trắng thừa ở giữa), "suggestion" là từ đúng đã nối lại liền mạch.',
  ],
  [
    "ai-proper-noun-vi",
    '- "proper_noun": danh từ riêng (tên người, địa danh, tên thương hiệu, tên công ty...) đang viết THƯỜNG HOÀN TOÀN ở chữ cái đầu (chưa viết hoa chút nào). Chỉ áp dụng cho trường hợp này — từ đã viết hoa chữ cái đầu, hoặc viết hoa toàn bộ (như tên viết tắt "API"), không phải lỗi.',
  ],
  [
    "ai-grammar-vi",
    '- "grammar": lỗi ngữ pháp, hoặc dùng từ SAI HOÀN TOÀN so với ngữ cảnh (từ đó không có nghĩa/không đúng ở vị trí đó, một người đọc bình thường sẽ thấy rõ ràng là sai). KHÔNG bao gồm: gợi ý viết từ viết tắt thành dạng đầy đủ (ví dụ không đổi "SL" thành "Số lượng"), hay gợi ý 1 từ/cách diễn đạt khác "hay hơn" trong khi từ hiện tại vẫn đúng nghĩa và đúng ngữ pháp — đó là cải thiện văn phong, không phải lỗi.',
  ],
];

function buildCustomRulesSection(customRules: string): string {
  const lines = customRules
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return "";
  return `\n\nNgoài các loại lỗi trên, người dùng còn định nghĩa thêm các rule tùy chỉnh sau đây. Kiểm tra "text" với từng rule tùy chỉnh; nếu vi phạm, trả về issue với "type": "custom":\n${lines
    .map((line) => `- ${line}`)
    .join("\n")}`;
}

// The prompt's own instructions (how to check EN/VI content) stay in
// Vietnamese regardless of UI language — the model never shows those to the
// user. Only the requested OUTPUT language for "message" (which IS shown to
// the user as the finding's explanation) needs to track the UI locale.
const MESSAGE_LANG_INSTRUCTION: Record<"vi" | "en", string> = {
  vi: '"message" là giải thích ngắn gọn bằng tiếng Việt.',
  en: '"message" is a brief explanation written in English.',
};

/** Returns null when there's nothing to check for this mode — caller should skip the API call entirely. */
function buildSystemPrompt(
  mode: CheckMode,
  config: RulesConfig,
  customRules: string
): string | null {
  const bullets = mode === "en" ? EN_RULE_BULLETS : VI_RULE_BULLETS;
  const enabled = bullets.filter(([id]) => isRuleEnabled(config, id));
  const customSection = buildCustomRulesSection(customRules);
  if (enabled.length === 0 && !customSection) return null;

  const intro = mode === "en" ? EN_INTRO : VI_INTRO;
  const outro = (mode === "en" ? PROMPT_OUTRO_EN : PROMPT_OUTRO_VI).replace(
    "{messageLangInstruction}",
    MESSAGE_LANG_INSTRUCTION[getLocale()]
  );
  const bulletLines = enabled.length > 0 ? `\n${enabled.map(([, text]) => text).join("\n")}` : "";
  return `${intro}${bulletLines}${customSection}\n${outro}`;
}

const RESPONSE_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      id: { type: "STRING" },
      issues: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            type: { type: "STRING" },
            original: { type: "STRING" },
            suggestion: { type: "STRING" },
            message: { type: "STRING" },
          },
          required: ["type", "original", "message"],
        },
      },
    },
    required: ["id", "issues"],
  },
};

interface AiIssueRaw {
  type: string;
  original: string;
  suggestion?: string;
  message: string;
}

interface AiResultRaw {
  id: string;
  issues: AiIssueRaw[];
}

const VALID_TYPES: ReadonlySet<string> = new Set<IssueType>([
  "non_english",
  "spelling",
  "spacing",
  "punctuation",
  "grammar",
  "nonsense",
  "proper_noun",
  "custom",
]);

function normalizeIssueType(type: string): IssueType {
  return VALID_TYPES.has(type) ? (type as IssueType) : "grammar";
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export class GeminiError extends Error {}

async function callBatch(
  apiKey: string,
  systemPrompt: string,
  batch: { id: string; text: string }[]
): Promise<AiResultRaw[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const body = {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        parts: [{ text: JSON.stringify(batch) }],
      },
    ],
    generationConfig: {
      // As low as it goes — this task wants the model's most conservative,
      // least speculative reading every time, not a creative one that
      // second-guesses word choices the author made on purpose.
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      // 2.5 Flash spends extra latency on internal "thinking" by default —
      // not worth it for a bounded classification task with a fixed schema,
      // so turn it off explicitly.
      thinkingConfig: { thinkingBudget: 0 },
    },
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new GeminiError(t("gemini.networkError"));
  }

  if (!res.ok) {
    if (res.status === 400 || res.status === 403) {
      throw new GeminiError(t("gemini.invalidApiKey"));
    }
    if (res.status === 429) {
      throw new GeminiError(t("gemini.rateLimited"));
    }
    throw new GeminiError(t("gemini.httpError", { status: res.status }));
  }

  const data = await res.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiError(t("gemini.noContent"));
  }

  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("not an array");
    return parsed as AiResultRaw[];
  } catch {
    throw new GeminiError(t("gemini.badJson"));
  }
}


// How many batches to have in flight at once. Sequential batches (1 at a
// time) meant total wait time scaled linearly with node count — a file with
// 200 text layers took 8 full round-trips back to back. Purely parallel (all
// batches at once) risks tripping the free tier's per-minute rate limit, so
// this caps concurrency instead of removing it entirely.
const CONCURRENCY = 4;

function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[rows - 1][cols - 1];
}

/**
 * A genuine typo fix reads as a SMALL edit away from the real word (one
 * wrong/missing/transposed letter) — a "use this word instead" suggestion
 * looks like an almost entirely different string, since it's swapping in a
 * different lexical item rather than correcting a slip of the keyboard.
 */
function isLikelyDifferentWord(original: string, suggestion: string): boolean {
  const a = original.toLowerCase();
  const b = suggestion.toLowerCase();
  const distance = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  const allowedDistance = Math.max(2, Math.ceil(maxLen * 0.4));
  return distance > allowedDistance;
}

export async function checkWithGemini(
  apiKey: string,
  mode: CheckMode,
  items: { id: string; text: string }[],
  config: RulesConfig,
  customRules: string,
  onProgress?: (done: number, total: number) => void
): Promise<Map<string, TextIssue[]>> {
  const result = new Map<string, TextIssue[]>();

  const builtPrompt = buildSystemPrompt(mode, config, customRules);
  if (!builtPrompt) return result;
  const systemPrompt: string = builtPrompt;

  const batches = chunk(items, BATCH_SIZE);
  const sourceTextById = new Map(items.map((item) => [item.id, item.text]));

  let done = 0;
  let nextBatchIndex = 0;

  async function worker() {
    while (nextBatchIndex < batches.length) {
      const batch = batches[nextBatchIndex++];
      const raw = await callBatch(apiKey, systemPrompt, batch);
      for (const entry of raw) {
        const sourceText = sourceTextById.get(entry.id) ?? "";
        const issues: TextIssue[] = [];
        for (const issue of entry.issues || []) {
          // The model is told "original" must be a literal, case-exact
          // substring of the source text, but doesn't always comply — it can
          // echo an acronym back lowercased even though the real text is
          // ALL CAPS. Re-anchor to the real on-canvas casing (case-
          // insensitive lookup) so the issue card shows what's actually
          // there, and so the eventual fix's exact-match search still finds
          // the right spot instead of silently failing.
          let original = issue.original;
          if (!sourceText.includes(original)) {
            const idx = sourceText.toLowerCase().indexOf(original.toLowerCase());
            if (idx !== -1) original = sourceText.slice(idx, idx + original.length);
          }
          const type = normalizeIssueType(issue.type);
          const suggestion = issue.suggestion ?? "";

          // Spacing is exclusively the local (non-AI) checks' job — the
          // model isn't always reliable about staying out of that lane
          // despite the prompt saying so, so enforce it here too: a finding
          // whose entire flagged span is whitespace is never valid from AI.
          if (original.trim() === "") continue;

          // A deterministic verification pass over the model's own findings —
          // the prompt alone hasn't reliably stopped these, since an LLM
          // can't be trusted 100% to follow instructions on every call:

          // 1. A "fix" that doesn't change anything is never a valid finding
          // (seen literally: the model flagging "SalaGov" and "fixing" it to
          // "SalaGov").
          if (suggestion === original) continue;

          // 2. "chưa viết hoa" (zero capitalization) can only be true of a
          // word that has NO uppercase letter anywhere. "iGOV", "SalaGov",
          // "API" or "ID" already contain uppercase letters — however they're
          // styled — so they don't fit that definition at all, regardless of
          // what the model concluded. Same idea for any OTHER type that
          // sneaks in a same-word-different-case suggestion (e.g. "Misa" for
          // an acronym filed as "grammar" instead of "proper_noun").
          const hasAnyUppercase = original !== original.toLowerCase();
          const isRecapitalizationOnly =
            suggestion !== "" && suggestion.toLowerCase() === original.toLowerCase();
          if (hasAnyUppercase && (type === "proper_noun" || isRecapitalizationOnly)) continue;

          // 3. An abbreviation spelled out into a much longer multi-word
          // phrase (e.g. "SL" → "Số lượng") is a wording/style suggestion,
          // not a spelling fix — out of scope regardless of type.
          const isAbbreviationExpansion =
            !original.includes(" ") && suggestion.includes(" ") && suggestion.length >= original.length * 2;
          if (isAbbreviationExpansion) continue;

          // 4. "spelling"/"nonsense" are meant for actual typos, which read as
          // a SMALL edit away from the real word (a wrong/missing/swapped
          // letter) — not a wholesale swap for a different, equally-valid
          // word (that's a wording preference, out of scope regardless of
          // what type the model filed it under). A real fix and a "better"
          // word choice both LOOK like a "correction" to the model, so this
          // measures how close the two strings actually are instead of
          // trusting the label.
          if (
            (type === "spelling" || type === "nonsense") &&
            suggestion &&
            isLikelyDifferentWord(original, suggestion)
          ) {
            continue;
          }

          issues.push({
            type,
            original,
            suggestion,
            message: issue.message,
            source: "ai",
            // Unlike local rules, an empty AI suggestion means "flagged, but no
            // specific fix" (per the prompt) — not "delete `original`" — so don't
            // let the UI offer a delete-shaped fix button for it.
            fixable: !!suggestion.trim(),
          });
        }
        result.set(entry.id, issues);
      }
      done += batch.length;
      onProgress?.(done, items.length);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, batches.length) }, () => worker())
  );

  return result;
}
