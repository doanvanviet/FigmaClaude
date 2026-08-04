# Kế Toán Dashboard

## Khởi động
```
npm install
npm run dev
```
Mở http://localhost:3000/ketoan-dashboard

## Cấu trúc
- `src/components/ControlHeader.vue` — Header dùng chung cho mọi project (có Thiết lập màu sắc)
- `src/pages/KetoanDashboard.vue` — Trang tổng quan kế toán
- `src/theme.js` — Quản lý theme màu sắc (lưu localStorage)
- `src/style.css` — MDS Design Tokens

## Thêm vào project khác
Copy `ControlHeader.vue` và `theme.js`, import vào App.vue.
