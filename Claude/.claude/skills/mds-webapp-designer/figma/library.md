# Figma Library Rules — MDS Web App Designer

> Đọc file này khi cần import component, search design system, hoặc xử lý icon.

---

## ⛔ QUY TẮC NGUỒN GỐC COMPONENT — BẮT BUỘC TUYỆT ĐỐI

```
⛔⛔⛔ CHỈ ĐƯỢC DÙNG MDS Web Components v2.0 (file key: 1DP5RJM3MsZJ8SnUWgTavS) ⛔⛔⛔

NGHIÊM CẤM import component, variable, text style, effect style từ bất kỳ thư viện nào khác.
NGHIÊM CẤM tự động rà tìm hoặc importComponentByKeyAsync từ file thư viện khác.
NGHIÊM CẤM dùng includeLibraryKeys với file key của thư viện MOBILE hoặc thư viện khác.

Duy nhất 2 file được phép dùng:
  1. MDS Web Components v2.0 → file key: 1DP5RJM3MsZJ8SnUWgTavS
     - Mọi component, variable, text style, effect style
  2. MDS Logo App MISA → file key: DxJfoNpKGaw6JvJcJn8RHT
     - Chỉ dùng khi cần logo của sản phẩm MISA

Nếu component cần dùng không có trong 2 file này:
  → search_design_system(query, fileKey=WORKING_FILE_KEY) — tìm trong working file
  → Nếu vẫn không có → HỎI USER, KHÔNG tự đi tìm từ nguồn khác
```

---

## ⛔ LỌC KẾT QUẢ search_design_system — BẮT BUỘC

```
search_design_system trả về kết quả từ NHIỀU thư viện khác nhau trong Figma.
Sau khi nhận kết quả, PHẢI lọc trước khi dùng:

QUY TẮC LỌC BẮT BUỘC:
  ✅ CHỈ dùng kết quả có: libraryName === "MDS Web Components - v2.0"
  ⛔ BỎ QUA hoàn toàn mọi kết quả có libraryName khác (kể cả null)
  ⛔ BỎ QUA kết quả từ: "AMIS Kho", "TCB - Component", "Design system v2",
     "EMIS Style Guide", "MISA aiSell Concept", "Icons", hoặc bất kỳ tên nào khác

VÍ DỤ — search "rotate" trả về:
  ✅ { name: "Icon rotate-clockwise", libraryName: "MDS Web Components - v2.0", key: "30b7cba2..." } → DÙNG
  ⛔ { name: "Rotate", libraryName: "AMIS Kho - Component", key: "b4f5abe6..." }         → BỎ QUA
  ⛔ { name: "Icon rotate-2", libraryName: null, key: "..." }                            → BỎ QUA

NẾU sau khi lọc không còn kết quả nào từ "MDS Web Components - v2.0":
  → Thử lại với query khác (đồng nghĩa tiếng Anh)
  → Sau 2–3 lần thử → HỎI USER, KHÔNG dùng kết quả từ thư viện khác
```

---

## ⛔ QUY TẮC SỐ 1 — COMPONENT FIRST (NGUYÊN TẮC CỐT LÕI)

```
⛔⛔⛔ MỌI ELEMENT đều phải BẮT ĐẦU TỪ COMPONENT.
CHỈ tự vẽ primitive (frame/rectangle/text tự tạo) khi đã xác nhận KHÔNG có component.
TUYỆT ĐỐI NGHIÊM CẤM: vẽ custom trước → screenshot → rồi mới "sửa lại bằng component"

❌ SAI — quy trình vi phạm:
  1. Vẽ filter dropdown bằng Frame + Text → 2. Chạy screenshot → 3. User phàn nàn → 4. Mới sửa

✅ ĐÚNG — quy trình bắt buộc:
  1. Nhận diện element cần làm (button, input, dropdown, checkbox, toolbar item...)
  2. Search MDS: search_design_system("tên component", fileKey=WORKING_FILE)
  3. Nếu tìm thấy → importComponentSetByKeyAsync(key) → createInstance() → DÙNG NGAY
  4. Nếu KHÔNG tìm thấy (sau 2–3 lần thử tên khác nhau) → mới được tự vẽ, và PHẢI ghi chú lý do

QUY TRÌNH BẮT BUỘC cho mọi control:
  1. Tra cứu references/components.md — nếu có key → dùng ngay
  2. Nếu không có trong docs → search_design_system(query, fileKey=WORKING_FILE)
     ⚠️ search_design_system KHÔNG truyền includeLibraryKeys từ thư viện khác
     ⚠️ Chỉ tìm trong WORKING_FILE hoặc MDS Web v2.0 (1DP5RJM3MsZJ8SnUWgTavS)
  3. Nếu tìm thấy → importComponentSetByKeyAsync(key) → createInstance()
     ⚠️ key PHẢI thuộc MDS Web v2.0 — KHÔNG import từ file thư viện khác
  4. Chọn đúng variant theo thông số (Color, Style, State, Size...)
  5. Chỉ tự vẽ custom khi xác nhận không có trong thư viện → ghi chú lý do

NGHIÊM CẤM tự vẽ button, input, checkbox, badge, chip, divider,
avatar, alert, tag, notification... bằng primitive shapes
khi chưa tìm kiếm trong thư viện MDS Web.
```

---

## ⛔ QUY TẮC SỐ 4 — RÀ SOÁT ICON SLOTS ĐẦY ĐỦ

```
QUY TRÌNH BẮT BUỘC sau khi createInstance():
  1. Đọc componentProperties để tìm InstanceSwap props chứa "Icon"/"Prefix"/"Suffix"
  2. Bật Boolean prop ẩn icon trước: inst.setProperties({ "◐ Icon Left#698:77": true })
  3. Search icon: search_design_system("Icon tên", fileKey=..., includeLibraryKeys=[MDS_KEY])
  4. Import icon: const iconComp = await figma.importComponentByKeyAsync(iconKey)
  5. Tìm INSTANCE node tên "Icon Left" trong inst
  6. Dùng setProperties() với node ID — KHÔNG dùng swapComponent() trực tiếp:
       const iconLeft = inst.findOne(n => n.name === "Icon Left");
       const propKey = Object.keys(iconLeft.componentProperties).find(k => k.startsWith("◇ Icon"));
       iconLeft.setProperties({ [propKey]: iconComp.id }); // ← ĐÚNG: pass node ID (string)

⛔ NGHIÊM CẤM swapComponent() trực tiếp lên icon slot:
  iconLeft.swapComponent(iconComp); // ← SAI — phá vỡ container, mất Color/Size/Filled props

NẾU Icon Left bị mất container (bị swapComponent sai):
  const iconSwapSet = await figma.importComponentSetByKeyAsync("f706505f3a7fca403f3418145c791c4bd56e24f9");
  const container = iconSwapSet.children.find(c => c.name === "Size=20, Color=Brand, Filled=No");
  iconLeft.swapComponent(container); // Restore container (một lần duy nhất)
  const propKey = Object.keys(iconLeft.componentProperties).find(k => k.startsWith("◇ Icon"));
  iconLeft.setProperties({ [propKey]: iconComp.id }); // Sau đó set icon đúng cách

⛔ SCORECARD / KPI TREND ICON — BẮT BUỘC:
  → Dùng Icon "trending-up" hoặc "trending-down" từ MDS Web v2.0
     Icon trending-up key:   3afed7208e0bf69de0d93d394cf54e363da4d371
     Icon trending-down key: 0f05401c3b45ef2257d6bae80457ec684f00f07c
  → KHÔNG ĐƯỢC dùng text "↑ +50.4%" — PHẢI tách icon + text riêng biệt

DANH SÁCH ICON SLOTS PHỔ BIẾN CẦN KIỂM TRA:
  Component              | Slots cần check
  ----------------------|------------------------------------------
  Button Medium/Small   | Icon Left, Icon Right
  _Tab Vertical Item    | Icon Left, Icon Right, Collapse Expand Icon
  Tabs Horizontal       | Tab 01..10 (mỗi tab có Icon slot)
  Page Header List      | Action buttons (Add, Export, Settings...)
  Chip/Tag              | Prefix icon, Suffix/Remove icon
  Alert / Inline Alert  | Icon (loại cảnh báo)
  Sidebar Item          | Icon Left (module icon), Icon Right (badge)
  Input / TextField     | Prefix icon, Suffix icon, Clear icon

ICON SEARCH — dùng MDS Web Components library key:
  search_design_system("Icon coin", fileKey=...,
    includeLibraryKeys=["lk-55db5b61bb9abd728407daf93bb7fc272f8bda0..."])
  Tên icon theo chuẩn Tabler: coin, coins, report, report-money, report-analytics,
  chart-bar, chart-line, chart-dots, calculator, building-warehouse, home-check,
  file-percent, pig, arrows-left-right, settings, search, filter, bell, plus...
```
