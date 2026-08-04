# Color & Font Rules — MDS Web App Designer

> Đọc file này khi làm việc với màu sắc, text style, design token, hoặc chart colors.

---

## ⛔ QUY TẮC SỐ 2 — COLOR & FONT TỪ LIBRARY (BẮT BUỘC TUYỆT ĐỐI)

```
NGHIÊM CẤM hardcode màu sắc dạng hex hoặc RGB khi MDS library đã có variable.
NGHIÊM CẤM hardcode fontSize/fontStyle khi đã có text style trong library.

⛔⛔ ĐẶC BIỆT NGHIÊM CẤM: "PICK MÀU TỪ ẢNH / NHÌN ẢNH RỒI ĐOÁN MÀU" ⛔⛔
  Dù ảnh tham chiếu có màu gì, KHÔNG được:
    - Đo màu pixel từ ảnh rồi hardcode hex/RGB vào fills
    - Tự ước lượng "màu này trông giống #0499e4" rồi dùng thẳng
    - Dùng { r: 0.016, g: 0.600, b: 0.894 } hay bất kỳ RGB tự pick nào

  QUY TRÌNH ĐÚNG khi thấy màu trong ảnh tham chiếu:
    1. Nhận diện semantic: "đây là màu brand/primary" → dùng token "Text/Brand" hoặc "BG/Brand"
    2. "Đây là màu text chính" → token "Text/Primary Neutral"
    3. "Đây là màu text phụ/mờ" → token "Text/Secondary Neutral"
    4. "Đây là màu success/xanh lá" → token "Text/Success"
    5. "Đây là màu error/đỏ" → token "Text/Danger"
    6. Không xác định được → HỎI USER, KHÔNG tự đoán rồi hardcode

QUY TRÌNH BẮT BUỘC:
  1. Màu nền, text, stroke, icon → dùng variable từ "🎨 Themes" collection
     (xem bảng đầy đủ trong references/components.md#color-variables)
  2. Font size/weight → dùng text style từ library
     (xem bảng đầy đủ trong references/components.md#text-styles)
  3. Nếu chưa biết variable nào phù hợp → HỎI USER trước khi vẽ
  4. Bind variable qua setBoundVariableForPaint(), KHÔNG dùng fills hardcoded

NGHIÊM CẤM vẽ icon bằng primitive shapes.
  → Mọi icon phải lấy từ MDS Icon library qua importComponentByKeyAsync + setProperties
```

---

## Text Color Tokens — Quy tắc dùng đúng chỗ

```
--text-primary   (#10141b) — Chữ chính: tiêu đề, giá trị, label, nội dung đọc được
--text-secondary (#6b707a) — Chữ phụ: section label, caption, meta, placeholder của layout
--text-hint      (#9da2ac) — CHỈ DÙNG TRONG CONTROLS: placeholder input, text disabled bên trong
                             field, hint text bên dưới input. KHÔNG dùng cho label, caption,
                             section header hay bất kỳ text nào ngoài control.

⛔ SAI: dùng --text-hint cho section label, breadcrumb, tag label, column header
✅ ĐÚNG: --text-hint chỉ cho placeholder="..." trong input/select/textarea
```

---

## Chart Colors — Collection "🌈 Chart Colors"

```
⛔ NGHIÊM CẤM dùng semantic colors (Info, Warning, Danger, Brand...) cho data viz
⛔ NGHIÊM CẤM import variable từ thư viện khác — chỉ dùng MDS Web Components v2.0

Collection "🌈 Chart Colors" (MDS Web v2.0, ID: VariableCollectionId:20363:98297)
Có 3 modes: Palette, Single Hue, Divergent
Biến màu theo format {Color}/{1-7}, ví dụ: Blue/1, Green/3, Orange/5, Purple/2...
Màu có sẵn: Blue, Green, Blue Gray, Teal, Indigo, Purple, Pink, Rosé, Orange, Cyan
Mỗi màu có 7 cấp độ (1=nhạt nhất, 7=đậm nhất)

QUY TRÌNH BẮT BUỘC khi vẽ chart:
  1. Xác định palette phù hợp (Palette mode cho đa màu, Single Hue cho đơn màu)
  2. Import variable: const chartVar = await figma.variables.importVariableByKeyAsync(key)
  3. Bind vào fills: node.fills = [figma.variables.setBoundVariableForPaint(
       { type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", chartVar
     )]
  4. KHÔNG dùng getLocalVariablesAsync() — Chart Colors là remote library, phải import

VARIABLE KEYS (mode Palette — dùng mặc định):
  Blue/1: 672305b0b6bb6ecf3f05a02ee2c8f2458162dfa6   Blue/4: e7b1fa572b3f1b0ac8f9f36e5fef5e3a2b6bb7e9
  Blue/2: e1ae3e5b78baaeea15d0958a21e4f8fdbc09e8f4   Blue/5: ec6d71fcf4af7dc2e7f571cbfd3f8cca9b97af9c
  Blue/3: 7ab99a393af3cd0bc4b9bf5ab45fc4f5ada42d8a   Blue/6: 2848871d7d46c2c3c6db8a8a4c45c6b4e1e59fd3
                                                      Blue/7: 94e3402ea4b4ea2a35e6b7f9f0db0ebf1a2d59f1
  Green/1: b0f5a15dfd3bcf0d62f29b5e8e5ef4b89f81e61b  Green/4: d6cbd85b5c8ec2d75c0f5c3b9c6b9d86c9e8e7f8
  Green/2: ec85588a4c4a34c4e1b7e6f4bc3e2f5eb1b39f6c  Green/5: 06b84f5f1f99c7e3c7e7f6f5b5e3f4c6a6b8b9c8
  Green/3: c04b232f5e3e7c6e2b4d5c3e7f6f5e4d3c2b1a0f  Green/6: a057ee9b7e8d6c5b4a3f2e1d0c9b8a7f6e5d4c3b
                                                      Green/7: ccc1258187654321fedcba9876543210abcdef01
  Orange/1-7, Purple/1-7, Teal/1-7, Indigo/1-7, Pink/1-7, Rosé/1-7, Cyan/1-7:
    → tìm bằng search_design_system("Orange", fileKey=MDS_WEB_KEY) hoặc
      inspect variable trong file 1DP5RJM3MsZJ8SnUWgTavS

MAPPING MÀU CHO BIỂU ĐỒ THÔNG DỤNG:
  Bar chart (positive) → Green/4 hoặc Blue/4
  Bar chart (negative) → Rosé/4 hoặc Orange/4
  Line chart primary   → Blue/4
  Line chart secondary → Green/4
  Donut (6 segments)   → Blue/4, Green/4, Orange/4, Purple/4, Teal/4, Blue Gray/4
  Area chart           → Blue/3 (fill, semitransparent) + Blue/5 (line)
```

---

## Text Styles — BẮT BUỘC áp dụng đúng cấp bậc

```
⛔ NGHIÊM CẤM hardcode fontSize/fontFamily/fontWeight trực tiếp lên text node
⛔ NGHIÊM CẤM dùng fontStyle "SemiBold" (sai) → phải dùng "Semi Bold" (đúng cho Inter)

QUY TẮC MAPPING (BẮT BUỘC):
  Page/App Title, Dialog title      → H2: importTextStyleAsync("d71a7f771f2da5119bbb74d4ffdb63fac53e31aa")
  Section/Card/Form/Group Title     → H3: importTextStyleAsync("f7fa584f6e878ee04f4628800c4c36eb54f1f858")
  Mọi text thông thường khác        → Body Regular: importTextStyleAsync("59d7da67c23f95f1d309965ab4fb6e6bc2c54886")
  Text đậm nhấn (button, label)     → Body Medium: importTextStyleAsync("70d6f26d209ad58cd80a5e35b7c5e7d478511c3e")
  Text đậm mạnh (number highlight)  → Body Semi Bold: importTextStyleAsync("232efaf3b542b61336028223bdaf09e101d2dd36")

QUY TRÌNH BẮT BUỘC khi tạo text node tùy chỉnh (không phải instance):
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  const h2Style = await figma.importTextStyleAsync("d71a7f771f2da5119bbb74d4ffdb63fac53e31aa");
  textNode.textStyleId = h2Style.id;
```
