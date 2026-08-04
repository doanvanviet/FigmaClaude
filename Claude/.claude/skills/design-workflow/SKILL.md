# Design Workflow — Quy trình làm việc thiết kế UI

Skill quy định **quy trình bắt buộc** khi thực hiện bất kỳ tác vụ thiết kế UI nào trong Figma.
Áp dụng cho mọi file, mọi design system, mọi loại màn hình.

---

## QUY TẮC 1 — SCAN TRƯỚC KHI VẼ

```
Khi có yêu cầu vẽ màn hình mới:

BƯỚC BẮT BUỘC TRƯỚC TIÊN:
  1. Scan toàn bộ file — tìm màn hình đã có chưa
  2. Có màn hình tương tự (cùng module, cùng layout type) → CLONE + SỬA
  3. Chưa có màn hình nào → Build từ đầu theo đúng cấu trúc

KHI CLONE:
  → Clone màn hình gần nhất về mặt nội dung/layout
  → Chỉ thay đổi những gì yêu cầu đề cập — giữ nguyên phần còn lại
  → Đặt frame clone sang phải frame gốc (cách 100px)
  → Đổi tên frame rõ ràng

SAU KHI CLONE — CHỈ CẬP NHẬT:
  ✅ TEXT — đổi nội dung text theo yêu cầu
  ✅ TRẠNG THÁI ACTIVE của icon/sidebar item (active ↔ inactive)
  ❌ KHÔNG đụng các icon khác → cực kỳ dễ mất icon
  ❌ KHÔNG thêm/xóa/swap icon ngoài những gì được yêu cầu rõ ràng

THÊM TRẠNG THÁI / BIẾN THỂ của màn hình đã có:
  → Clone ĐÚNG màn hình đó — không clone màn hình khác
  → Tên: "<Tên gốc> (<Trạng thái>)"
     Ví dụ: "Danh sách X (Bộ lọc)", "Danh sách X (Chi tiết)"
  → Chỉ chỉnh phần liên quan đến trạng thái mới
  → Không đụng: Global Header, Sidebar, data không liên quan

KHÔNG ĐƯỢC:
  ❌ Vẽ lại từ đầu khi đã có màn hình tương tự trong file
  ❌ Clone màn hình sai module / sai layout type
  ❌ Clone màn hình có Global Header chưa set branding ("App name")
```

---

## QUY TẮC 2 — SEARCH TRƯỚC KHI BUILD BẤT KỲ ELEMENT NÀO

```
⛔ NGHIÊM CẤM tự build bất kỳ UI element/pattern nào khi chưa search thư viện.

Áp dụng cho MỌI thứ — không chỉ button, input, mà còn:
  Panel, Dialog, Sidebar, Filter, Toolbar, Card, Header, Footer,
  Notification tray, Settings panel, Detail view, Empty state, v.v.

QUY TRÌNH BẮT BUỘC trước khi build bất kỳ element nào:
  1. Tra cứu library-info.txt — nếu có key → dùng ngay
  2. Không có → search_design_system(tên element, fileKey=WORKING_FILE)
  3. Vẫn không có → HỎI USER — chỉ rõ "tôi không tìm thấy component X,
     bạn có biết nó ở đâu trong thư viện không?"
  4. User xác nhận không có → Mới được phép tự build bằng primitive

KHÔNG ĐƯỢC:
  ❌ Tự build "vì nghĩ nhanh hơn"
  ❌ Tự build rồi mới hỏi "có component không?"
  ❌ Giả sử không có component chỉ vì không thấy trong library-info.txt
     (library-info chỉ là shortcut, không phải full catalog)
```

---

## QUY TẮC 3 — COMPONENT & VARIABLE — KHÔNG TỰ CHỈNH INSTANCE

```
Toàn bộ quá trình vẽ PHẢI dùng component và variable từ thư viện.

VỚI COMPONENT INSTANCE — CHỈ ĐƯỢC PHÉP:
  ✅ setProperties({ variantProp: value })   — đổi variant
  ✅ setProperties({ booleanProp: true/false }) — bật/tắt boolean
  ✅ setProperties({ instanceSwapProp: nodeId }) — swap icon/component
  ✅ layoutSizingHorizontal = "FILL"          — fill ngang trong auto-layout cha
  ✅ node.characters = "text"                 — override text content

TUYỆT ĐỐI KHÔNG ĐƯỢC:
  ❌ instance.fills = [...]         — component tự quản lý màu
  ❌ instance.strokes = [...]       — component tự quản lý stroke
  ❌ instance.resize(w, h)          — component tự quản lý kích thước
  ❌ instance.width / height = ...  — component tự quản lý kích thước
  ❌ instance.layoutSizingVertical = ... — phá vỡ chiều cao gốc
  ❌ instance.paddingTop/Left/... = ... — chỉ dùng cho frame tự tạo
  ❌ nestedNode.fills = [...] (node bên trong instance) — component tự quản lý

  QUY TẮC ĐỂ NHỚ:
    node.type === "INSTANCE"  →  KHÔNG SET FILLS / STROKES / KÍCH THƯỚC

VỚI MÀU SẮC — CHỈ DÙNG VARIABLE TỪ LIBRARY:
  ✅ setBoundVariableForPaint() với variable từ collection "🎨 Themes"
  ❌ fills = [{ color: { r, g, b } }]  — KHÔNG hardcode RGB
  ❌ Đoán màu từ ảnh tham chiếu rồi hardcode hex

VỚI ICON:
  ✅ Lấy từ MDS Icon library qua importComponentByKeyAsync + setProperties
  ❌ Tự vẽ icon bằng rectangle / ellipse / vector

NẾU COMPONENT KHÔNG CÓ VARIANT PHÙ HỢP:
  → Tìm component khác qua search_design_system()
  → Không tìm thấy → HỎI USER — không tự vẽ thay thế
```

---

## QUY TẮC 4 — QUY TRÌNH LÀM VIỆC VỚI COMPONENT: KÉO → LAYOUT → TEXT

```
NGHIÊM CẤM tự ý chỉnh sửa nội dung bên trong component khi chưa xử lý layout.

THỨ TỰ BẮT BUỘC — KHÔNG ĐƯỢC ĐẢO:

  Bước 1 — KÉO COMPONENT RA
    → Import component từ library / clone từ màn hình hiện có
    → Để component ở trạng thái default sau khi kéo ra

  Bước 2 — XỬ LÝ LAYOUT VÀ BẬT/TẮT THUỘC TÍNH
    → Đặt đúng variant (State, Size, Color...)
    → Bật/tắt boolean props (icon, badge, checkbox, divider...)
    → Đặt layoutSizing, resize nếu cần
    → Hoàn thiện cấu trúc TRƯỚC KHI đụng text

  Bước 3 — RÀ SOÁT VÀ CẬP NHẬT TEXT
    → Liệt kê tất cả text label cần cập nhật
    → Dùng setProperties() cho text prop / node.characters cho TEXT node
    → Chỉ cập nhật đúng những gì yêu cầu đề cập

  Bước 4 — NẾU THIẾU THÔNG TIN → BÁO USER
    → Liệt kê rõ: "Cần nội dung cho: X, Y, Z"
    → Chờ user confirm trước khi điền

KHÔNG ĐƯỢC:
  ❌ Cập nhật text trước khi layout/variant đã đúng → phải làm lại
  ❌ Ẩn/xóa element (checkbox, icon, badge...) mà không được yêu cầu
  ❌ Tự đoán nội dung khi chưa có trong yêu cầu
```

---

## QUY TẮC 5 — CẬP NHẬT SKILL CẦN PHÊ DUYỆT

```
Khi phát hiện cần bổ sung hoặc sửa đổi nội dung skill:

QUY TRÌNH BẮT BUỘC:
  1. DỪNG — không tự ý ghi vào file skill
  2. Trình bày với user:
       - Skill nào / file nào cần update
       - Nội dung cụ thể cần thêm/sửa/xóa (trích dẫn đoạn cũ nếu có)
       - Lý do cần update
  3. Chờ user XÁC NHẬN đồng ý
  4. Sau khi được duyệt → ghi vào skill

NGUYÊN TẮC KHI VIẾT VÀO SKILL:
  → Viết tổng quát — không tham chiếu tên màn hình / module cụ thể
  → Dùng ví dụ generic: "Màn hình X", "Module Y", "Danh sách Z"
  → Rule phải áp dụng được cho bất kỳ file thiết kế nào, không chỉ file hiện tại
  → Không ghi lịch sử lỗi / incident cụ thể vào skill
     (ghi nguyên tắc rút ra, không ghi "lần trước bị lỗi X ở màn hình CRM")

NGOẠI LỆ — không cần confirm khi:
  → Sửa lỗi chính tả / typo rõ ràng
  → Cập nhật component key đã được user cung cấp trực tiếp
```
