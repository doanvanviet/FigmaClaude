import { google, sheets_v4 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { URL } from 'url';

const SCOPES    = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = path.resolve(__dirname, '../tokens.json');
const CREDS_PATH = path.resolve(__dirname, '../credentials.json');

export async function getAuthClient() {
  if (!fs.existsSync(CREDS_PATH)) {
    throw new Error(`Không tìm thấy credentials.json.\nĐặt file vào: ${CREDS_PATH}\nXem hướng dẫn trong README.`);
  }

  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf-8'));
  const { client_id, client_secret } = creds.installed ?? creds.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3000/callback');

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8')));
    return oAuth2Client;
  }

  // Lần đầu: xác thực OAuth2
  console.log('\n[Google Auth] Cần xác thực Google lần đầu...');
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

  const { exec } = await import('child_process');
  exec(`start "" "${authUrl}"`);
  console.log('Trình duyệt đang mở trang xác thực Google...');

  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url!, 'http://localhost:3000');
      const code = url.searchParams.get('code');
      if (code) {
        res.end('<h2 style="font-family:sans-serif;color:green">✅ Xác thực thành công! Đóng tab này.</h2>');
        server.close();
        resolve(code);
      } else {
        res.end('Không tìm thấy code.');
        reject(new Error('No code'));
      }
    });
    server.listen(3000, () => console.log('Đang đợi callback tại http://localhost:3000 ...'));
    setTimeout(() => { server.close(); reject(new Error('Timeout sau 2 phút')); }, 120_000);
  });

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('[Google Auth] ✅ Token đã lưu vào tokens.json — lần sau không cần xác thực lại.');

  return oAuth2Client;
}

export interface CookieRow {
  name: string; value: string; domain: string; path: string;
  expires: string; httpOnly: boolean; secure: boolean; sameSite: string;
}

async function ensureSheet(
  sheets: sheets_v4.Sheets,
  spreadsheetId: string,
  sheetTitle: string
): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existing = meta.data.sheets ?? [];
  const found = existing.find(s => s.properties?.title === sheetTitle);

  if (found) {
    // Sheet đã tồn tại → xóa dữ liệu cũ
    await sheets.spreadsheets.values.clear({ spreadsheetId, range: `'${sheetTitle}'` });
    console.log(`[Sheets] Sheet "${sheetTitle}" đã tồn tại, dữ liệu cũ sẽ bị ghi đè.`);
    return;
  }

  // Kiểm tra Sheet1 có đang rỗng không → rename thay vì tạo mới
  const sheet1 = existing.find(s => s.properties?.title === 'Sheet1');
  if (sheet1 && existing.length === 1) {
    const check = await sheets.spreadsheets.values.get({
      spreadsheetId, range: 'Sheet1!A1'
    }).catch(() => null);
    const isEmpty = !check?.data?.values?.length;

    if (isEmpty) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{
            updateSheetProperties: {
              properties: { sheetId: sheet1.properties!.sheetId, title: sheetTitle },
              fields: 'title'
            }
          }]
        }
      });
      console.log(`[Sheets] Đổi tên Sheet1 → "${sheetTitle}"`);
      return;
    }
  }

  // Tạo sheet mới
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: { requests: [{ addSheet: { properties: { title: sheetTitle } } }] }
  });
  console.log(`[Sheets] Tạo sheet mới "${sheetTitle}"`);
}

export async function saveCookiesToSheet(
  spreadsheetId: string,
  cookies: CookieRow[],
  accountEmail: string
): Promise<void> {
  const auth = await getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  // Tên sheet = tên tài khoản (email)
  const sheetTitle = accountEmail;
  await ensureSheet(sheets, spreadsheetId, sheetTitle);

  const updatedAt = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  const header = [['Tên cookie', 'Giá trị', 'Domain', 'Path', 'Hết hạn', 'HttpOnly', 'Secure', 'SameSite', 'Cập nhật lúc']];
  const rows   = cookies.map(c => [
    c.name, c.value, c.domain, c.path, c.expires,
    c.httpOnly ? 'Yes' : 'No',
    c.secure   ? 'Yes' : 'No',
    c.sameSite, updatedAt
  ]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${sheetTitle}'!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [...header, ...rows] }
  });

  // In đậm hàng header
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetId = meta.data.sheets?.find(s => s.properties?.title === sheetTitle)?.properties?.sheetId ?? 0;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [{
        repeatCell: {
          range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
          cell: { userEnteredFormat: { textFormat: { bold: true } } },
          fields: 'userEnteredFormat.textFormat.bold'
        }
      }]
    }
  });

  console.log(`[Google Sheets] ✅ Đã lưu ${cookies.length} cookies vào sheet "${sheetTitle}"`);
  console.log(`[Google Sheets] 🔗 https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
}
