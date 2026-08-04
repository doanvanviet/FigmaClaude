# Figma Workflow Rules — MDS Web App Designer

> Đọc file này khi task là **vẽ thiết kế trong Figma**. Áp dụng cho mọi màn hình/component.

---

## ⛔ QUY TẮC WORKFLOW — BẮT BUỘC TUYỆT ĐỐI

```
1. UI GRAPHIC / SƠ ĐỒ (workflow diagram, flowchart, data viz):
   → Vẽ đường nét, hình dạng, màu sắc, layout GIỐNG ảnh tham chiếu tối đa có thể.
   → Dùng đúng primitive shapes (rectangle, line, polygon) với đúng bán kính, kiểu nét (dash/solid).
   → Không đơn giản hóa hay bỏ bớt chi tiết so với ảnh.

   ⛔ ĐƯỜNG KẾT NỐI TRONG SƠ ĐỒ — NGHIÊM CẤM VẼ ĐƯỜNG CHÉO:
   → CHỈ được vẽ đường ngang (horizontal) hoặc đường dọc (vertical)
   → Nếu cần rẽ góc → dùng L-shape: 1 đoạn ngang + 1 đoạn dọc (hoặc ngược lại)
   → NGHIÊM CẤM tính line từ điểm A đến điểm B theo tọa độ thẳng khi A và B không cùng hàng/cột
   → NGHIÊM CẤM dùng SVG arc command "A" trong vectorPaths — Figma không hỗ trợ

   Cách vẽ đúng (chỉ dùng hLine + vLine):
     const hLine = (x, y, len) => { /* horizontal */ };
     const vLine = (x, y, len) => { /* vertical */ };
     // L-shape: đường xuống rồi sang ngang
     vLine(fromX, fromY, toY - fromY);
     hLine(fromX, toY, toX - fromX);

   ⛔ ICON CONTAINER TRONG SƠ ĐỒ — KHÔNG dùng Ellipse:
   → figma.createEllipse() KHÔNG hỗ trợ appendChild
   → PHẢI dùng figma.createFrame() với cornerRadius = width/2 để tạo hình tròn chứa icon

2. ĐỌC KỸ INPUT TRƯỚC KHI BẮT ĐẦU VẼ — BẮT BUỘC TUYỆT ĐỐI:
   → TRƯỚC KHI viết bất kỳ dòng code nào, PHẢI đọc và ghi nhớ toàn bộ:
       • Tên app (App name) chính xác từ yêu cầu — NGHIÊM CẤM để "App name" placeholder
       • Tên các tab, sidebar items, page headers — copy y hệt từ input/ảnh
       • Tên công ty / chi nhánh (nếu có) → điền vào Global Header With Branch
       • Tên các KPI, cột bảng, label — đọc từ ảnh hoặc mô tả, không tự bịa
   → NGHIÊM CẤM bắt đầu vẽ khi chưa xác định được tên app
   → Nếu input không rõ tên → HỎI USER ngay, đừng để placeholder

3. QUY TRÌNH "LÀM TỚI ĐÂU CHẮC TỚI ĐÓ" — MÀN HÌNH ĐẦU TIÊN LÀ CHUẨN:
   ┌─────────────────────────────────────────────────────────────────────┐
   │  BƯỚC 1: Vẽ khung layout (header, sidebar, tab area, main content) │
   │  BƯỚC 2: Điền TEXT NGAY — app name, tabs, sidebar labels, headers  │
   │  BƯỚC 3: Apply ICON NGAY — tìm và chèn icon vào mọi slot có icon  │
   │  BƯỚC 4: Screenshot + rà soát → fix hết lỗi text/icon/màu sắc     │
   │  BƯỚC 5: Chỉ sau khi màn 1 đã 100% chính xác → dùng làm căn bản  │
   │          clone sang màn 2, 3... (tránh copy lỗi sang màn khác)     │
   └─────────────────────────────────────────────────────────────────────┘
   → NGHIÊM CẤM vẽ màn hình 2 khi màn hình 1 còn sai text / thiếu icon
   → NGHIÊM CẤM clone màn hình có placeholder chưa được thay thế
   → Mỗi control khi tạo ra: set text + icon TRONG CÙNG SCRIPT đó, không để sau

4. HOÀN THIỆN TỪNG MÀN HÌNH TRƯỚC KHI CHUYỂN SANG MÀN TIẾP THEO:
   → Sau khi vẽ xong 1 màn hình: rà soát lại toàn bộ màu sắc, icon, text.
   → Đảm bảo tất cả icon slots đã được điền (không để placeholder nếu có thể tìm được).
   → Đảm bảo màu sắc đúng token (Brand, Neutral, Success, Danger...) — không hardcode.
   → CHỈ chuyển sang vẽ màn hình mới sau khi màn hiện tại đã hoàn chỉnh.

5. SAU KHI VẼ XONG — ĐỌC LẠI SKILL RÀ FIX LỖI (BẮT BUỘC TUYỆT ĐỐI):
   ┌─────────────────────────────────────────────────────────────────────┐
   │  BƯỚC 1: Đọc lại TOÀN BỘ skill từ đầu đến cuối                    │
   │  BƯỚC 2: Đối chiếu từng quy tắc với màn hình vừa vẽ               │
   │  BƯỚC 3: Liệt kê MỌI vi phạm tìm thấy (component, padding, màu)   │
   │  BƯỚC 4: Fix từng vi phạm trước khi báo cáo xong                   │
   │  BƯỚC 5: Screenshot lại để xác nhận sau khi fix                    │
   └─────────────────────────────────────────────────────────────────────┘

   CHECKLIST RÀ SOÁT BẮT BUỘC (áp dụng sau mỗi màn hình / mỗi section):
   □ Tất cả button, input, dropdown... có dùng MDS component không?
   □ Separator, divider có dùng MDS Divider component không (không dùng Rectangle)?
   □ Pagination có dùng MDS Paging component không?
   □ Toolbar có dùng MDS Table Header component không?
   □ Có hardcode màu hex/RGB nào không (kể cả trong fills của frame tự tạo)?
   □ Content Area có padding đúng (paddingLeft=16, paddingRight=16, paddingTop=16)?
   □ Table Header có nằm trong Table Header Wrapper (paddingLeft=12, paddingRight=12)?
   □ Có set fills trực tiếp lên instance nào không?
   □ Có tự vẽ icon bằng primitive shapes không?
   □ Tất cả text node có dùng text style từ library không (không hardcode fontSize)?
   → NGHIÊM CẤM báo cáo "xong" khi chưa chạy checklist này

6. SO SÁNH VỚI ẢNH ĐẦU VÀO SAU KHI VẼ XONG (BẮT BUỘC TUYỆT ĐỐI):
   ┌─────────────────────────────────────────────────────────────────────┐
   │  BƯỚC 1: Chụp screenshot màn hình vừa vẽ                           │
   │  BƯỚC 2: Đặt cạnh ảnh đầu vào / mô tả ban đầu → so sánh trực tiếp │
   │  BƯỚC 3: Liệt kê từng điểm KHÁC BIỆT (thông tin, layout, spacing)  │
   │  BƯỚC 4: Điều chỉnh từng điểm cho đến khi khớp ảnh gốc             │
   │  BƯỚC 5: Screenshot lại xác nhận — CHỈ báo cáo xong sau bước này   │
   └─────────────────────────────────────────────────────────────────────┘

   CÁC ĐIỂM SO SÁNH BẮT BUỘC:
   □ Tên app, tên màn hình, tên tab — có khớp đúng với input không?
   □ Số lượng và tên của sidebar items — đúng thứ tự, đúng label?
   □ Số lượng và tên cột bảng — không thừa, không thiếu?
   □ Nội dung toolbar: số lượng button, tên button, loại filter?
   □ Khoảng cách giữa các phần tử — spacing có nhìn tương đương ảnh gốc?
   □ Màu sắc tổng thể — brand color, neutral, header background?
   □ Dữ liệu mẫu trong bảng — có khớp với ảnh tham chiếu?
   □ Các thành phần đặc biệt (KPI card, chart, badge...) — đủ số lượng?
   → NGHIÊM CẤM báo cáo "đã giống ảnh gốc" mà không chụp screenshot và đối chiếu thực tế
```

---

## ⛔ QUY TẮC NỘI DUNG VÀ CẤU TRÚC THEO ẢNH / YÊU CẦU

```
⛔⛔⛔ NGHIÊM CẤM tự bịa đặt hoặc tái sử dụng dữ liệu từ dự án cũ ⛔⛔⛔

1. VĂN BẢN (text) trong sidebar, tab, header, label, table, form...
   → PHẢI lấy ĐÚNG từ ảnh tham chiếu hoặc yêu cầu của user.
   → KHÔNG dùng tên module/label từ dự án khác hoặc tự đặt tên.
   → Ví dụ: sidebar có 8 item trong ảnh → chỉ tạo đúng 8 item với đúng tên đó.
   → Chưa nhìn thấy label → HỎI USER, KHÔNG tự điền.

2. CẤU TRÚC LAYOUT phải theo đúng ảnh:
   → Bố cục panels, vị trí elements, kích thước tương đối → theo ảnh.
   → Không thêm/bớt section, panel, tab, cột so với ảnh.
   → Thứ tự phần tử trong layout phải đúng thứ tự trong ảnh.

3. ICON — BẮT BUỘC TÌM KIẾM TRƯỚC, PLACEHOLDER LÀ BIỆN PHÁP CUỐI:
   ⛔ NGHIÊM CẤM để trống icon slot hoặc dùng hình vuông/tròn tự vẽ thay icon
   ⛔ NGHIÊM CẤM skip tìm kiếm rồi thẳng tay đặt placeholder
   ⛔ NGHIÊM CẤM dùng ký tự text "v", "›", "∨", "▾", "↑", "↓" hay bất kỳ ký tự Unicode nào để giả icon
      → Mọi chevron/arrow/expand icon PHẢI dùng từ MDS library qua Icon Swap

   QUY TRÌNH BẮT BUỘC cho MỌI icon slot:
     BƯỚC 1 — search_design_system tên icon (tiếng Anh Tabler style)
     BƯỚC 2 — Nếu tìm thấy → importComponentByKeyAsync(key) → apply vào slot
     BƯỚC 3 — CHỈ khi search KHÔNG tìm thấy → mới dùng Icon Swap placeholder
     BƯỚC 4 — Báo cáo rõ: "icon [X] không tìm thấy trong library → đặt placeholder"

   TÊN ICON TABLER THƯỜNG DÙNG:
     Bàn làm việc → "home"           Tiền mặt → "cash"
     Tiền gửi     → "building-bank"  Mua hàng → "shopping-cart"
     Bán hàng     → "shopping-bag"   Kết nối  → "plug"
     Kho          → "building-warehouse"       Công cụ → "tool"
     Tiền lương   → "users"          Thuế     → "receipt-tax"
     Báo cáo      → "report"         Kế toán  → "calculator"
     Danh mục     → "list"           Số dư    → "database"

4. DỮ LIỆU SAMPLE (table, card, chart) → lấy từ ảnh tham chiếu.
   → Nếu ảnh có số liệu cụ thể → dùng đúng số đó (không round/đổi).
   → Nếu ảnh không rõ → ghi "..." hoặc "[Dữ liệu]" thay vì bịa số.
```

---

## ⛔ QUY TẮC SỐ 7 — ĐIỀN DỮ LIỆU THỰC TẾ VÀO MỌI COMPONENT

```
Sau khi createInstance() và setProperties(), PHẢI override toàn bộ text content
bằng nội dung thực tế — KHÔNG được để nguyên placeholder.

Ví dụ BỊ CẤM — để nguyên placeholder:
  Button:      "Text"         Tab:         "Tab 1", "Tab 2"
  Chip/Tag:    "Text"         Page Header: "Page title"
  Table col:   "Column header"             Inline Alert: "Title", "Description"

QUY TRÌNH BẮT BUỘC sau mỗi createInstance():
  1. Xác định toàn bộ text nodes / text props trong component
  2. Map từng text prop sang nội dung thực tế của màn hình đang vẽ
  3. Override bằng setProperties() hoặc node.characters = "nội dung thực"
  4. Với Table: phải có ít nhất 5 hàng dữ liệu mẫu thực tế

CÁCH OVERRIDE TEXT:
  // Qua setProperties (text prop)
  inst.setProperties({ "🅃 Label#123:0": "Danh sách cơ hội" });
  // Qua node.characters (text node trực tiếp)
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  const titleNode = inst.findOne(n => n.type === "TEXT" && n.name === "Title");
  if (titleNode) titleNode.characters = "Danh sách cơ hội";
```

---

## ⛔ QUY TẮC SỐ 8 — POST-DRAW CHECKLIST (BẮT BUỘC)

```
□ 1. TEXT đầy đủ và đúng nội dung — ƯU TIÊN CAO NHẤT
     ⛔ NGHIÊM CẤM còn bất kỳ placeholder: "Text", "Label", "Tab 1", "Tab 2",
        "App name", "Column header", "Page title", "Description", "Title", "Button"
     → App name trong Global Header → phải là tên app thật từ yêu cầu

□ 2. ICON đã import và apply — KHÔNG được để trống
     → Sidebar items: MỖI item phải có icon (search → import → apply)
     → Button, Tab, Header action nếu ảnh có icon → phải có icon

□ 3. MÀU đúng — KHÔNG hardcode RGB/hex
     → Mọi fill/stroke text/background → dùng variable từ "🎨 Themes" collection
     → Data viz → BẮT BUỘC dùng collection "🌈 Chart Colors" (xem figma/color-font.md)

□ 4. LAYOUT / SIZING & ALIGNMENT đúng — THẲNG HÀNG
     → FILL/HUG sizing đúng; Shadow đã apply cho BG/White panel trên BG/Page
     → Mọi row/column dùng auto-layout — không dùng frame thường
     → PHẢI take screenshot sau mỗi section để confirm trước khi tiếp tục

□ 5. BG/Page fill — KHÔNG được để nền trắng hoặc transparent
     → Screen frame + Main Content: PHẢI bind BG/Page variable
     → Variable key: "d2e4f5bfe4f3f4ff3ea89ee4b639bc3b6ac5f6e6"

□ 6. PADDING Main Content — PHẢI 16px cả 4 phía
     → paddingTop = paddingBottom = paddingLeft = paddingRight = 16
```
