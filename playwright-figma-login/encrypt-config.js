/**
 * Mã hóa .env → config.enc
 * Chạy: node encrypt-config.js
 */
const crypto = require('crypto');
const fs     = require('fs');
const path   = require('path');

const PASSPHRASE = 'F1gm@L0g1nT00l-2026-M1SA';
const KEY = crypto.createHash('sha256').update(PASSPHRASE).digest();

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('[ERR] Không tìm thấy .env');
  process.exit(1);
}

const plaintext = fs.readFileSync(envPath, 'utf8');
const iv        = crypto.randomBytes(16);
const cipher    = crypto.createCipheriv('aes-256-cbc', KEY, iv);
let enc = cipher.update(plaintext, 'utf8', 'base64');
enc    += cipher.final('base64');

const output = iv.toString('hex') + ':' + enc;
fs.writeFileSync(path.join(__dirname, 'config.enc'), output, 'utf8');
console.log('✅ config.enc đã được tạo (AES-256-CBC)');
