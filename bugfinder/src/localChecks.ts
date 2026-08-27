import type { TextIssue } from "./types";
import { t } from "./i18n";
import {
  defaultRulesConfig,
  defaultRuleValues,
  getRuleValue,
  isRuleEnabled,
  type RulesConfig,
  type RuleValues,
} from "./rulesConfig";

function pushIssue(
  out: TextIssue[],
  seen: Set<string>,
  issue: Omit<TextIssue, "source">
) {
  const key = `${issue.type}|${issue.original}`;
  if (seen.has(key)) return;
  seen.add(key);
  out.push({ ...issue, source: "local" });
}

/**
 * Common UI control/component names — long/distinctive enough that requiring
 * every one of their letters to appear consecutively (only whitespace
 * allowed between letters) won't false-positive on ordinary sentences. Used
 * to deterministically catch "Textb      ox" (should be "Textbox") without
 * needing AI/a dictionary: we don't need to know what the word IS, just that
 * removing the stray whitespace reproduces a known term.
 */
const SPLITTABLE_TERM_LIST = [
  "button",
  "textbox",
  "textarea",
  "numberbox",
  "datetimebox",
  "combobox",
  "dropdown",
  "checkbox",
  "searchbox",
  "tooltip",
  "datatable",
  "pagination",
  "scorecard",
  "sidebar",
  "modal",
  "dialog",
  "popup",
  "avatar",
];

function buildSplitTermRegex(term: string): RegExp {
  const spaced = term.split("").join("\\s*");
  return new RegExp(`(?<![a-zA-Z])${spaced}(?![a-zA-Z])`, "gi");
}

const SPLIT_TERM_REGEXES = SPLITTABLE_TERM_LIST.map(
  (term) => [term, buildSplitTermRegex(term)] as const
);

function checkSplitKnownTerms(text: string): TextIssue[] {
  const issues: TextIssue[] = [];
  const seen = new Set<string>();
  for (const [, regex] of SPLIT_TERM_REGEXES) {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text))) {
      const original = match[0];
      if (!/\s/.test(original)) continue; // already written correctly, nothing to fix
      const suggestion = original.replace(/\s+/g, "");
      const key = `spelling|${original}`;
      if (!seen.has(key)) {
        seen.add(key);
        issues.push({
          type: "spelling",
          original,
          suggestion,
          message: t("localCheck.splitKnownTerm", { original, suggestion }),
          source: "local",
          fixable: true,
        });
      }
    }
  }
  return issues;
}

/**
 * Fast, deterministic checks that don't need AI: double spaces, leading/trailing
 * spaces, space-before-punctuation, missing space after punctuation, repeated
 * punctuation marks, Design System number formatting. Runs for both EN and VI modes so
 * results show up even without an API key configured. Each check is gated by
 * `config` so the plugin's rule panel can turn individual ones off.
 */
export function runLocalChecks(
  text: string,
  config: RulesConfig = defaultRulesConfig(),
  values: RuleValues = defaultRuleValues()
): TextIssue[] {
  const issues: TextIssue[] = [];
  const seen = new Set<string>();

  const splitTermIssues = isRuleEnabled(config, "spacing-split-known-term")
    ? checkSplitKnownTerms(text)
    : [];

  if (isRuleEnabled(config, "spacing-double-space")) {
    const doubleSpace = text.match(/ {2,}/g);
    if (doubleSpace) {
      for (const m of doubleSpace) {
        // Already covered by a "known term split apart" finding (e.g. the run of
        // spaces inside "Textb      ox") — that fix (remove entirely) is correct;
        // collapsing to one space here would just produce a different wrong result.
        if (splitTermIssues.some((i) => i.original.includes(m))) continue;
        pushIssue(issues, seen, {
          type: "spacing",
          original: m,
          suggestion: " ",
          message: t("localCheck.doubleSpace", { count: m.length }),
        });
      }
    }
  }

  // Trailing whitespace is deliberately NOT checked — not important enough
  // to flag (unlike leading, which usually indicates a real mistake).
  if (isRuleEnabled(config, "spacing-edge")) {
    const leadingSpace = text.match(/^[ \t]+/);
    if (leadingSpace) {
      pushIssue(issues, seen, {
        type: "spacing",
        original: leadingSpace[0],
        suggestion: "",
        message: t("localCheck.leadingSpace"),
      });
    }
  }

  if (isRuleEnabled(config, "spacing-before-punct")) {
    const spaceBeforePunct = text.match(/ +[,.;:!?]/g);
    if (spaceBeforePunct) {
      for (const m of spaceBeforePunct) {
        pushIssue(issues, seen, {
          type: "spacing",
          original: m,
          suggestion: m.trim(),
          message: t("localCheck.spaceBeforePunct"),
        });
      }
    }
  }

  if (isRuleEnabled(config, "spacing-after-punct")) {
    const missingSpaceAfterPunct = text.match(/[,;:!?][A-Za-zÀ-ỹ]/g);
    if (missingSpaceAfterPunct) {
      for (const m of missingSpaceAfterPunct) {
        pushIssue(issues, seen, {
          type: "spacing",
          original: m,
          suggestion: `${m[0]} ${m[1]}`,
          message: t("localCheck.missingSpaceAfterPunct"),
        });
      }
    }
  }

  if (isRuleEnabled(config, "punct-repeated")) {
    // Simple punctuation (,;:!?) repeated back-to-back — always unintentional.
    const repeatedSimple = text.match(/([,;:!?])\1+/g);
    if (repeatedSimple) {
      for (const m of repeatedSimple) {
        pushIssue(issues, seen, {
          type: "punctuation",
          original: m,
          suggestion: m[0],
          message: t("localCheck.repeatedPunctSimple", { char: m[0], count: m.length, run: m }),
        });
      }
    }
    // Dots are separate: exactly 3 in a row is the standard "..." ellipsis,
    // not a typo, so only 2 (probably meant 1 or a full "...") or 4+
    // (too many) count as an error. Matched as one full run via a greedy
    // quantifier so a legit "..." can't get mistaken for a trailing ".."
    // (a non-greedy/lookahead check on 2 dots would still match dots 2-3 of
    // a real 3-dot run since the engine retries from the next position).
    const dotRuns = text.match(/\.{2,}/g);
    if (dotRuns) {
      for (const run of dotRuns) {
        if (run.length === 3) continue;
        pushIssue(issues, seen, {
          type: "punctuation",
          original: run,
          suggestion: "...",
          message:
            run.length === 2
              ? t("localCheck.repeatedDots2", { run })
              : t("localCheck.repeatedDotsMany", { count: run.length, run, extra: run.length - 3 }),
        });
      }
    }
  }

  if (isRuleEnabled(config, "number-thousand-separator")) {
    const separator = getRuleValue(values, "number-thousand-separator") || ".";
    const commaGroupedNumbers = text.match(/\b\d{1,3}(,\d{3})+(\.\d+)?\b/g);
    if (commaGroupedNumbers) {
      for (const m of commaGroupedNumbers) {
        pushIssue(issues, seen, {
          type: "punctuation",
          original: m,
          suggestion: m.replace(/,/g, separator),
          message: t("localCheck.thousandSeparator", { separator }),
        });
      }
    }
  }

  return [...issues, ...splitTermIssues];
}

/**
 * A capital letter ONLY on the very first character, with everything else
 * lowercase, is indistinguishable from ordinary heading/sentence-start
 * capitalization (e.g. "Kế toán" as a title vs "kế toán" used lowercase
 * elsewhere) — normal, not an error. Only once some variant shows
 * capitalization that convention can't explain (a later word capitalized, or
 * an internal pattern like "iGOV") is a term treated as a fixed name that
 * must read identically everywhere it's used.
 */
function isExplainableByLeadingCapital(variant: string): boolean {
  const lower = variant.toLowerCase();
  if (variant === lower) return true;
  return variant.slice(1) === lower.slice(1) && variant.charAt(0) === lower.charAt(0).toUpperCase();
}

/** A user who deliberately types something in ALL CAPS (e.g. an acronym) means it — never the one treated as "wrong" in a case-consistency mismatch. */
function isAllCaps(variant: string): boolean {
  return /[A-Za-zÀ-ỹ]/.test(variant) && variant === variant.toUpperCase();
}

/**
 * Cross-node check (unlike everything above, which looks at one text string
 * in isolation): the same label/term typed with inconsistent capitalization
 * in different layers of the same selection — e.g. "iGOV Kế toán" vs "IGOV
 * Kế toán" vs "iGOV kế toán". Groups whole (trimmed) text values that are
 * equal case-INsensitively; if the only variation across them is explainable
 * by normal capitalization (see isExplainableByLeadingCapital), skips the
 * group entirely. Otherwise every variant besides whichever appears most
 * often (used only to decide which layers get flagged, not forced as THE
 * answer) is flagged, offering every other existing casing as a pick so the
 * user decides which one becomes the standard rather than the plugin
 * guessing.
 */
export function checkCaseConsistency(
  textNodes: { id: string; text: string }[],
  config: RulesConfig = defaultRulesConfig()
): Map<string, TextIssue[]> {
  const result = new Map<string, TextIssue[]>();
  if (!isRuleEnabled(config, "text-case-consistency")) return result;

  // Vietnamese diacritics can be encoded two ways that render identically but
  // are different bytes — one precomposed code point (NFC) vs. a base letter
  // plus separate combining accent marks (NFD), depending on how the text was
  // typed/pasted. Comparing raw strings would treat those as two unrelated
  // words instead of the same term, so grouping/matching happens on the
  // NFC-normalized form; `raw` (the actual on-canvas bytes) is kept alongside
  // so the eventual Fix still finds the right substring in the live node.
  const groups = new Map<string, { id: string; raw: string; normalized: string }[]>();
  for (const node of textNodes) {
    const trimmed = node.text.trim();
    // A single word/character is too likely to legitimately vary by sentence
    // position (start of a sentence vs. mid-sentence) to be worth flagging —
    // this rule is really about multi-word labels/names.
    if (!trimmed || !/\s/.test(trimmed)) continue;
    const normalized = trimmed.normalize("NFC");
    const key = normalized.toLowerCase();
    const entry = { id: node.id, raw: trimmed, normalized };
    const group = groups.get(key);
    if (group) group.push(entry);
    else groups.set(key, [entry]);
  }

  for (const entries of groups.values()) {
    // Counted/compared by the NORMALIZED form so two nodes using the exact
    // same casing but different Unicode encodings aren't mistaken for a
    // "different variant" (a false positive on the flip side of the bug
    // above). `representative` remembers one real raw string per normalized
    // variant to actually insert when a fix is applied.
    const counts = new Map<string, number>();
    const representative = new Map<string, string>();
    for (const e of entries) {
      counts.set(e.normalized, (counts.get(e.normalized) || 0) + 1);
      if (!representative.has(e.normalized)) representative.set(e.normalized, e.raw);
    }
    if (counts.size < 2) continue; // every occurrence already uses the same exact casing

    const variants = [...counts.keys()];
    if (variants.every(isExplainableByLeadingCapital)) continue;

    // An ALL CAPS variant always wins regardless of how often each casing
    // shows up — a majority of typos elsewhere shouldn't outvote a
    // deliberately-styled acronym/brand name into being "corrected" away.
    const allCapsVariant = variants.find(isAllCaps);
    let canonical = allCapsVariant ?? variants[0];
    if (!allCapsVariant) {
      let bestCount = 0;
      for (const v of variants) {
        const count = counts.get(v)!;
        if (count > bestCount) {
          bestCount = count;
          canonical = v;
        }
      }
    }
    const canonicalText = representative.get(canonical)!;

    // Every distinct casing in the group, own included — presented as equal
    // options rather than just "the other ones" so the picker always shows
    // the full picture (2 variants total still means 2 buttons to choose
    // between, not 1 that looks like a forced direction).
    const allVariantTexts = variants.map((v) => representative.get(v)!);

    for (const e of entries) {
      if (e.normalized === canonical) continue;
      const issues = result.get(e.id) || [];
      issues.push({
        type: "case_inconsistency",
        original: e.raw,
        suggestion: canonicalText,
        message: t("localCheck.caseInconsistent", {
          text: e.raw,
          variants: allVariantTexts.map((v) => `"${v}"`).join(", "),
        }),
        source: "local",
        fixable: true,
        textFixOptions: allVariantTexts.map((v) => ({ label: v, suggestion: v })),
      });
      result.set(e.id, issues);
    }
  }

  return result;
}
