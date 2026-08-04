const { Jimp } = require('jimp');
const QrCode = require('qrcode-reader');

const imagePath = process.argv[2] || 'D:\\Figma\\qr.png';

async function decodeQR() {
  try {
    const image = await Jimp.read(imagePath);
    const qr = new QrCode();
    qr.callback = (err, value) => {
      if (err) {
        console.error('Không decode được QR:', err.message);
        process.exit(1);
      }
      const url = value.result;
      console.log('QR content:', url);
      const match = url.match(/secret=([A-Z2-7]+)/i);
      if (match) {
        console.log('\n TOTP Secret Key:', match[1]);
        console.log('\nCopy chuỗi trên vào FIGMA_2FA_SECRET trong file .env');
      }
    };
    qr.decode(image.bitmap);
  } catch (err) {
    console.error('Lỗi:', err.message);
  }
}

decodeQR();
