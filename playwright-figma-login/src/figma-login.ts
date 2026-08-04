import { chromium, Browser, BrowserContext, Page } from 'playwright-core';
import { authenticator } from 'otplib';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { saveCookiesToDoc, CookieRow } from './google-docs';

// pkg exe → thư mục chứa exe
// bundle.js → __dirname = thư mục chứa bundle.js (cùng chỗ config.enc)
// ts-node src/figma-login.ts → __dirname = src/, config.enc ở ..
const ROOT = (process as any).pkg
  ? path.dirname(process.execPath)
  : fs.existsSync(path.join(__dirname, 'config.enc'))
    ? __dirname
    : path.resolve(__dirname, '..');

// ── Lock file ──────────────────────────────────────────────────────────────
const LOCK_FILE       = path.join(ROOT, 'figma-login.lock');
const LOCK_TIMEOUT_MS = 30 * 60 * 1000; // 30 phút

function acquireLock(): void {
  if (fs.existsSync(LOCK_FILE)) {
    const stats = fs.statSync(LOCK_FILE);
    const ageMs = Date.now() - stats.mtimeMs;
    if (ageMs < LOCK_TIMEOUT_MS) {
      const startedAt = new Date(stats.mtimeMs).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      console.error(`\n[LOI] Chuong trinh dang duoc chay boi nguoi khac (bat dau luc ${startedAt}).`);
      console.error('Vui long doi cho den khi hoan thanh roi thu lai.');
      process.exit(1);
    }
    // Lock cũ (> 30 phút) → coi như stale, xóa và tiếp tục
    console.log('[WARN] Phat hien lock file cu (> 30 phut), bo qua va tiep tuc...');
    fs.unlinkSync(LOCK_FILE);
  }
  fs.writeFileSync(LOCK_FILE, new Date().toISOString(), 'utf8');
}

function releaseLock(): void {
  try { if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE); } catch {}
}

// ── Config ─────────────────────────────────────────────────────────────────
const _KEY = crypto.createHash('sha256').update('F1gm@L0g1nT00l-2026-M1SA').digest();

function loadConfig(): void {
  const encPath = path.join(ROOT, 'config.enc');
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(encPath)) {
    const raw   = fs.readFileSync(encPath, 'utf8').trim();
    const colon = raw.indexOf(':');
    const iv    = Buffer.from(raw.slice(0, colon), 'hex');
    const enc   = raw.slice(colon + 1);
    const dec   = crypto.createDecipheriv('aes-256-cbc', _KEY, iv);
    let plain   = dec.update(enc, 'base64', 'utf8');
    plain      += dec.final('utf8');
    const parsed = dotenv.parse(plain);
    for (const [k, v] of Object.entries(parsed)) process.env[k] = v;
  } else if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.error('Khong tim thay config.enc hoac .env!');
    process.exit(1);
  }
}

loadConfig();

// ── Accounts ───────────────────────────────────────────────────────────────
interface Account {
  email: string;
  password: string;
  totpSecret: string;
}

interface LoginResult {
  account: Account;
  cookies: CookieRow[];
  success: boolean;
  error?: string;
}

function loadAccounts(): Account[] {
  const emails    = (process.env.FIGMA_EMAILS    ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const passwords = (process.env.FIGMA_PASSWORDS ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const secrets   = (process.env.FIGMA_2FA_SECRETS ?? '').split(',').map(s => s.trim()).filter(Boolean);
  if (!emails.length) { console.error('Thieu FIGMA_EMAILS trong config'); process.exit(1); }
  if (passwords.length !== emails.length || secrets.length !== emails.length) {
    console.error('So luong FIGMA_EMAILS / FIGMA_PASSWORDS / FIGMA_2FA_SECRETS phai bang nhau.');
    process.exit(1);
  }
  return emails.map((email, i) => ({ email, password: passwords[i], totpSecret: secrets[i] }));
}

const DOC_ID   = process.env.GOOGLE_DOC_ID ?? '';
const accounts = loadAccounts();

const sameSiteMap: Record<string, string> = { Strict: 'strict', Lax: 'lax', None: 'no_restriction' };

// ── Login từng tài khoản (chạy song song) ─────────────────────────────────
async function loginAccount(browser: Browser, account: Account): Promise<LoginResult> {
  const { email, password, totpSecret } = account;
  const tag = `[${email.split('@')[0]}]`;
  let context: BrowserContext | null = null;

  try {
    context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page: Page = await context.newPage();

    console.log(`${tag} Truy cap figma.com/login...`);
    await page.goto('https://www.figma.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    console.log(`${tag} Dien email va password...`);
    await page.locator('input[type="email"], input[name="email"]').first().fill(email);
    await page.locator('input[type="password"], input[name="password"]').first().fill(password);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(3000);

    const bodyText = (await page.locator('body').textContent()) ?? '';
    if (bodyText.toLowerCase().includes('authentication code') || bodyText.toLowerCase().includes('recovery code')) {
      console.log(`${tag} Man 2FA - generate OTP...`);
      const otp = authenticator.generate(totpSecret);
      await page.getByRole('textbox').first().fill(otp);
      await page.waitForTimeout(300);
      await page.locator('button[type="submit"]').first().click();
      await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 }).catch(() => {});
    }

    const finalUrl = page.url();
    if (!finalUrl.includes('/login')) {
      console.log(`${tag} Dang nhap thanh cong!`);
      const rawCookies = await context.cookies();
      const cookies: CookieRow[] = rawCookies.map(c => {
        const isSession = !c.expires || c.expires <= 0;
        const row: CookieRow = {
          domain:   c.domain,
          hostOnly: !c.domain.startsWith('.'),
          httpOnly: c.httpOnly,
          name:     c.name,
          path:     c.path,
          sameSite: c.sameSite ? (sameSiteMap[c.sameSite] ?? c.sameSite.toLowerCase()) : null,
          secure:   c.secure,
          session:  isSession,
          storeId:  null,
          value:    c.value,
        };
        if (!isSession) row.expirationDate = c.expires;
        return row;
      });
      console.log(`${tag} Lay duoc ${cookies.length} cookies.`);
      return { account, cookies, success: true };
    } else {
      const errMsg = await page.locator('[role="alert"], [class*="error"]').first()
        .textContent({ timeout: 2000 }).catch(() => '');
      const msg = errMsg?.trim() || `Dang nhap that bai (URL: ${finalUrl})`;
      console.error(`${tag} THAT BAI: ${msg}`);
      return { account, cookies: [], success: false, error: msg };
    }
  } catch (err: any) {
    console.error(`${tag} LOI: ${err?.message ?? err}`);
    return { account, cookies: [], success: false, error: err?.message ?? String(err) };
  } finally {
    await context?.close();
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  acquireLock();
  let browser: Browser | null = null;
  try {
    console.log('Khoi dong Chrome...');
    browser = await chromium.launch({ channel: 'chrome', headless: false, slowMo: 100 });

    // Bước 1: Login tất cả tài khoản song song
    console.log(`\nDang nhap ${accounts.length} tai khoan cung luc...\n`);
    const results = await Promise.all(accounts.map(a => loginAccount(browser!, a)));

    // Bước 2: Ghi Google Docs tuần tự (tránh race condition khi xóa/tạo tab)
    const successful = results.filter(r => r.success);
    if (DOC_ID && successful.length > 0) {
      console.log(`\n[Google Docs] Luu ${successful.length} tai khoan vao Doc...\n`);
      for (let i = 0; i < successful.length; i++) {
        await saveCookiesToDoc(DOC_ID, successful[i].cookies, successful[i].account.email, i === 0);
      }
    }

    // Tổng kết
    const failed = results.filter(r => !r.success);
    console.log('\n' + '='.repeat(60));
    console.log(`HOAN THANH: ${successful.length}/${accounts.length} tai khoan thanh cong.`);
    if (failed.length > 0) {
      console.log(`THAT BAI (${failed.length}): ${failed.map(r => r.account.email.split('@')[0]).join(', ')}`);
    }
    console.log('='.repeat(60));

    process.exitCode = failed.length > 0 ? 1 : 0;
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    if (msg.includes('chrome') || msg.includes('Chromium') || msg.includes('executable')) {
      console.error('\n[LOI] Khong tim thay Google Chrome. Cai dat tai: https://www.google.com/chrome');
    } else {
      console.error('\n[LOI]', msg);
    }
    process.exitCode = 1;
  } finally {
    releaseLock();
    await browser?.close();
  }
}

process.on('uncaughtException', (err) => {
  console.error('\n[LOI KHOI DONG]', err.message ?? err);
  releaseLock();
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n[LOI KHONG XU LY DUOC]', reason);
  releaseLock();
  process.exit(1);
});

main();
