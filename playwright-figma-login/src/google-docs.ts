import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const ROOT     = (process as any).pkg
  ? path.dirname(process.execPath)
  : fs.existsSync(path.join(__dirname, 'service-account.json'))
    ? __dirname
    : path.resolve(__dirname, '..');
const KEY_PATH = path.join(ROOT, 'service-account.json');

export interface CookieRow {
  domain: string;
  expirationDate?: number;
  hostOnly: boolean;
  httpOnly: boolean;
  name: string;
  path: string;
  sameSite: string | null;
  secure: boolean;
  session: boolean;
  storeId: null;
  value: string;
}

function getAuth() {
  if (!fs.existsSync(KEY_PATH)) {
    throw new Error(`Không tìm thấy service-account.json\nĐặt file vào: ${KEY_PATH}`);
  }
  return new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/documents'],
  });
}

function toUsername(email: string): string {
  return email.split('@')[0];
}

function buildTabName(username: string, now: Date): string {
  const dd   = String(now.getDate()).padStart(2, '0');
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh   = String(now.getHours()).padStart(2, '0');
  const min  = String(now.getMinutes()).padStart(2, '0');
  return `${username} - [${dd}/${mm}/${yyyy} ${hh}:${min}]`;
}

/**
 * clearAll=true  → xóa TẤT CẢ tab cũ trước khi tạo tab mới (dùng cho account đầu tiên)
 * clearAll=false → chỉ thêm tab mới, không xóa gì (dùng cho các account tiếp theo)
 */
export async function saveCookiesToDoc(
  docId: string,
  cookies: CookieRow[],
  accountEmail: string,
  clearAll = false
): Promise<void> {
  const auth = getAuth();
  const docs = google.docs({ version: 'v1', auth });

  const username = toUsername(accountEmail);
  const now      = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const tabName  = buildTabName(username, now);
  const content  = JSON.stringify(cookies, null, 4);

  // ── 1. Lấy danh sách tất cả tab hiện có ──────────────────────────────────
  const doc = await docs.documents.get({ documentId: docId, includeTabsContent: true });
  const oldTabIds = (doc.data.tabs ?? [])
    .map(t => t.tabProperties?.tabId)
    .filter((id): id is string => !!id);

  // ── 2. Tạo tab mới cho account này ───────────────────────────────────────
  console.log(`[Docs] Tạo tab "${tabName}"...`);
  const createRes = await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: { requests: [{ addDocumentTab: { tabProperties: { title: tabName } } }] }
  });
  const newTabId = createRes.data.replies?.[0]?.addDocumentTab?.tabProperties?.tabId;
  if (!newTabId) throw new Error('Không lấy được tabId sau khi tạo tab');

  // ── 3. Xóa tab cũ (clearAll: xóa hết; còn lại: không xóa) ───────────────
  if (clearAll && oldTabIds.length > 0) {
    console.log(`[Docs] Xóa ${oldTabIds.length} tab cũ...`);
    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests: oldTabIds.map(tabId => ({ deleteTab: { tabId } })) }
    });
  }

  // ── 4. Ghi JSON vào tab mới ───────────────────────────────────────────────
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: { requests: [{ insertText: { location: { index: 1, tabId: newTabId }, text: content } }] }
  });

  console.log(`[Google Docs] ✅ Đã lưu ${cookies.length} cookies vào tab "${tabName}"`);
  console.log(`[Google Docs] 🔗 https://docs.google.com/document/d/${docId}`);
}
