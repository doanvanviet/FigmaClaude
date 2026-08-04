# Layout Rules — MDS Web App Designer

> Đọc file này khi tạo màn hình mới, cấu trúc layout, hoặc xử lý sizing/alignment trong Figma.

---

## ⛔ QUY TẮC SỐ 10 — KHỞI TẠO SCREEN FRAME (BẮT BUỘC TUYỆT ĐỐI)

```
BƯỚC 1 — Screen frame: 1366×768 + BG/Page fill
  // ⚠️ MỌI màu nền (screen, bodyRow, main...) PHẢI bind variable từ Themes collection
  //    — KHÔNG hardcode hex/rgb. Màu render thực tế do theme quyết định (light/dark).
  //    — { r:..., g:..., b:... } trong setBoundVariableForPaint chỉ là seed/fallback,
  //      không phải màu thực. Màu thực = giá trị biến theme tại runtime.
  const screen = figma.createFrame();
  screen.resize(1366, 768);
  screen.layoutMode = "VERTICAL";
  // Import biến BG/Page từ MDS Web v2.0 (theo theme, không hardcode)
  const bgPageVar = await figma.variables.importVariableByKeyAsync("d2e4f5bfe4f3f4ff3ea89ee4b639bc3b6ac5f6e6");
  screen.fills = [figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.97 } }, "color", bgPageVar
    // ↑ seed color không quan trọng — theme variable override toàn bộ
  )];

BƯỚC 2 — Global Header: PHẢI setProperties({ "Type": "..." }) ngay sau khi tạo
  // Component set key: a73126feab6a3724986a5912e8bbb599c301d77a
  // ⚠️ defaultVariant LÀ Type=Default (nền xanh đậm brand) — PHẢI override ngay
  //
  // 4 Type chính:
  //   "Default"          → nền xanh đậm, không branch  (landing/dashboard)
  //   "White"            → nền trắng, không branch     ← THÔNG DỤNG NHẤT (app có sidebar)
  //   "With Branch"      → nền xanh đậm, có branch
  //   "With Branch White"→ nền trắng, có branch        ← app có thông tin chi nhánh
  //
  // Search Type: "Box" (mặc định, ô tìm kiếm to) | "Icon" (thu gọn thành icon)
  //
  // ▶ Bảng đầy đủ 8 variants → references/components.md#global-header
  
  const headerSet = await figma.importComponentSetByKeyAsync("a73126feab6a3724986a5912e8bbb599c301d77a");
  const headerInst = headerSet.defaultVariant.createInstance();
  headerInst.setProperties({ "Type": "White" }); // đổi sang đúng loại app
  screen.appendChild(headerInst);
  headerInst.layoutSizingHorizontal = "FILL";

BƯỚC 3 — Body Row (sidebar + main): HORIZONTAL auto-layout
  const bodyRow = figma.createFrame();
  bodyRow.name = "Body Row";
  bodyRow.layoutMode = "HORIZONTAL";
  bodyRow.paddingTop = bodyRow.paddingBottom = bodyRow.paddingLeft = bodyRow.paddingRight = 0;
  bodyRow.itemSpacing = 0;
  bodyRow.fills = [figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.97 } }, "color", bgPageVar
    // seed color không quan trọng — bind BG/Page variable theo theme
  )];
  screen.appendChild(bodyRow);
  bodyRow.layoutSizingHorizontal = "FILL";
  bodyRow.layoutSizingVertical = "FILL";

BƯỚC 4 — Sidebar: import component, KHÔNG set layoutSizingVertical
  const sidebarSet = await figma.importComponentSetByKeyAsync("...");
  const sidebarInst = (sidebarSet.children.find(c => c.name === "Expand=True") || sidebarSet.defaultVariant).createInstance();
  bodyRow.appendChild(sidebarInst);
  // CHỈ set horizontal — KHÔNG set vertical (chiều cao tự fill theo body)
  // sidebarInst.layoutSizingHorizontal không cần set — sidebar FIXED width

BƯỚC 5 — Main Content: VERTICAL auto-layout, FILL × FILL, BG/Page
  const main = figma.createFrame();
  main.name = "Main Content";
  main.layoutMode = "VERTICAL";
  main.paddingTop = main.paddingBottom = main.paddingLeft = main.paddingRight = 0;
  main.itemSpacing = 0;
  main.fills = [figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.97 } }, "color", bgPageVar
    // bind BG/Page variable — màu theo theme, không hardcode
  )];
  bodyRow.appendChild(main);
  main.layoutSizingHorizontal = "FILL";
  main.layoutSizingVertical = "FILL";
```

---

## ⛔ QUY TẮC SỐ 6 — CẤU TRÚC LAYOUT MÀN HÌNH DANH SÁCH

```
HAI DẠNG CẤU TRÚC — chọn đúng loại màn hình:

━━━ DẠNG A: CÓ TAB (màn hình có Tabs Horizontal ở trên cùng) ━━━
Tham chiếu chuẩn: node 23274:47801 trong file 1DP5RJM3MsZJ8SnUWgTavS

Main Content (VERTICAL auto-layout, FILL width, FILL height)
  ├── Tab Area       (HORIZONTAL auto-layout, FILL width, height=48 FIXED, paddingTop=12)
  │     └── Tabs Horizontal instance  (FILL width, FIXED height=36)
  └── Content Area   (VERTICAL auto-layout, FILL width, FILL height,
                      paddingLeft=16, paddingRight=16, paddingTop=16, paddingBottom=0)
        ├── Summary Bar / KPI cards
        ├── Table Panel (FILL width, FILL height)
        └── ... các section khác

━━━ DẠNG B: KHÔNG CÓ TAB (màn hình danh sách đơn giản) ━━━

Main Content (VERTICAL auto-layout, FILL width, FILL height)
  └── Content Area   (VERTICAL auto-layout, FILL width, FILL height,
                      paddingLeft=16, paddingRight=16, paddingTop=0, paddingBottom=16)
        ├── Page Header instance  (FILL width, FIXED height — KHÔNG set layoutSizingVertical)
        ├── Table Panel (FILL width, FILL height — BG/White + Drop Shadow)
        │     ├── Table Header Wrapper  (paddingLeft=12, paddingRight=12)
        │     │     └── Table Header instance + Filter controls
        │     ├── Table Frame  (columns, FILL width, FILL height)
        │     └── Paging instance  (FILL width — KHÔNG set layoutSizingVertical)
        └── ... các section khác

⛔ BẮT BUỘC Content Area paddingTop = 0 (KHÔNG phải 16)
   → Page Header component tự có padding top bên trong rồi
⛔ BẮT BUỘC Table Header Wrapper paddingLeft=12, paddingRight=12

⛔ QUY TẮC TUYỆT ĐỐI VỚI MỌI COMPONENT INSTANCE:
  Sau createInstance() + appendChild(), CHỈ được:
    1. inst.setProperties({ key: value })
    2. inst.layoutSizingHorizontal = "FILL"
  
  NGHIÊM CẤM hoàn toàn — không ngoại lệ:
    inst.layoutSizingVertical = bất kỳ giá trị gì  // phá vỡ chiều cao gốc component
    inst.resize(w, h)                               // hardcode kích thước
    inst.width = ...  /  inst.height = ...          // ghi đè kích thước
    inst.paddingTop / paddingLeft / ...             // chỉ áp dụng cho frame tự tạo
```

---

## QUY TRÌNH BẮT BUỘC — Dạng A (có Tab)

```js
// 1. Tạo Tab Area wrapper frame:
const tabArea = figma.createFrame();
tabArea.name = "Tab Area";
tabArea.layoutMode = "HORIZONTAL";
tabArea.paddingTop = 12; tabArea.paddingBottom = 0;
tabArea.paddingLeft = 0; tabArea.paddingRight = 0;
tabArea.itemSpacing = 0;
// Màu nền ăn theo theme — bind BG/White variable, không hardcode hex/rgb
const bgWhite = await figma.variables.getVariableByIdAsync(varMap["BG/White"]);
tabArea.fills = [figma.variables.setBoundVariableForPaint(
  { type: "SOLID", color: { r: 1, g: 1, b: 1 } }, "color", bgWhite
  // seed { r:1,g:1,b:1 } chỉ là fallback — màu thực do BG/White variable quyết định
)];
mainContent.insertChild(0, tabArea);
tabArea.layoutSizingHorizontal = "FILL";
tabArea.layoutSizingVertical = "FIXED";
tabArea.resize(tabArea.width, 48);

// 2. Tab Area counterAxisAlignItems = "MAX" → tabs "mọc" từ dưới lên
tabArea.counterAxisAlignItems = "MAX";

// 3. Tạo Content Area với padding đúng:
const contentArea = figma.createFrame();
contentArea.name = "Content Area";
contentArea.layoutMode = "VERTICAL";
contentArea.paddingTop = 16; contentArea.paddingBottom = 0;
contentArea.paddingLeft = 16; contentArea.paddingRight = 16;
contentArea.itemSpacing = 0;
contentArea.fills = [];
mainContent.appendChild(contentArea);
contentArea.layoutSizingHorizontal = "FILL";
contentArea.layoutSizingVertical = "FILL";
```

---

## Tab Area — Quy tắc bổ sung

```
TAB ACTIVE — QUY TẮC BẮT BUỘC:
  ✅ Tab active = State=Actived, Color=Brand, Underline=True
  ✅ Tab inactive = State=Inactived, Color=Neutral, Underline=False
  ⛔ KHÔNG dùng Color=Neutral cho tab active

⛔ DOUBLE BORDER — NGHIÊM CẤM 2 border liền kề nhau:
  → Global Header đã có strokeBottom → Tab Area KHÔNG được có strokeTop
  → Quy tắc: khi A trên B: nếu A có border-bottom → B KHÔNG được có border-top
  → Cách fix: tabArea.strokes = []  (xóa stroke nếu đã vô tình thêm)
  → KHÔNG padding trái/phải ở Tab Area — chỉ Content Area mới có padding ngang

⛔ GLOBAL HEADER — CHỌN ĐÚNG VARIANT:
  → App MISA thông thường + có Sidebar      → Type="White"
  → App có chi nhánh + có Sidebar           → Type="With Branch White"
  → App không có Sidebar (landing/dashboard) → Type="Default"
  → App không có Sidebar + có chi nhánh     → Type="With Branch"
  → Search Type="Box" (default) hoặc "Icon" (nếu muốn thu gọn)
  → ⚠️ defaultVariant là Type=Default (nền xanh đậm) — LUÔN override
  → ▶ Chi tiết 8 variants đầy đủ → references/components.md#global-header
```

---

## Layout khi có Side Panel

```
Khi màn hình cần hiển thị bảng + panel bên cạnh (filter panel, detail panel):
→ Bọc Table Panel và Side Panel trong một "Main Area" frame HORIZONTAL
→ Main Area: itemSpacing = 16  ← khoảng cách giữa bảng và panel
→ Main Area: paddingLeft=0, paddingRight=0 (Content Area đã có padding ngang rồi)
→ Table Panel: layoutSizingHorizontal = "FILL"    ← chiếm phần còn lại
→ Side Panel: width cố định, layoutSizingVertical = "FILL"

Cấu trúc:
  Content Area (VERTICAL, padding 16px ngang)
    ├── Summary Bar / KPI cards  (nếu có)
    └── Main Area (HORIZONTAL, itemSpacing=16, FILL width, FILL height)
          ├── Table Panel  (FILL width, FILL height)
          └── Side Panel   (FIXED width, FILL height)

⛔ ROW CONTAINER FILL — NGHIÊM CẤM HARDCODE WHITE:
  → Các row chứa nhiều card (KPI row, Chart row...) PHẢI có fills = []
  → KHÔNG được set fills = BG/White lên row container
  → Lý do: row container có fill trắng → gap itemSpacing giữa các card cũng thành trắng
           → các card trắng blend vào nhau, mất visual separation trên nền BG/Page
  → Chỉ từng card con mới có fills = BG/White + drop shadow riêng
```

---

## ⛔ QUY TẮC SỐ 11 — ALIGNMENT & AUTO-LAYOUT (BẮT BUỘC TUYỆT ĐỐI)

```
⛔⛔⛔ NGHIÊM CẤM tự set x/y trên node con của auto-layout frame ⛔⛔⛔
Auto-layout tự tính toán vị trí — can thiệp bằng .x / .y sẽ gây xô lệch.

QUY TẮC 1 — LUÔN DÙNG AUTO-LAYOUT CHO MỌI CONTAINER:
  → Row của phần tử → HORIZONTAL auto-layout
  → Column của phần tử → VERTICAL auto-layout
  → KHÔNG dùng frame thường (layoutMode = "NONE") để chứa nhiều phần tử → gây overlap

QUY TẮC 2 — CĂN CHỈNH TRỤC ĐÚNG (BẮT BUỘC PHẢI SET):
  HORIZONTAL layout (row):
    primaryAxisAlignItems   = "MIN"           ← phần tử bắt đầu từ trái
                            = "SPACE_BETWEEN" ← title trái + action phải (header pattern)
    counterAxisAlignItems   = "CENTER"         ← căn giữa dọc (BẮT BUỘC cho mọi row)

  VERTICAL layout (column):
    primaryAxisAlignItems   = "MIN"
    counterAxisAlignItems   = "MIN"           ← căn trái (BẮT BUỘC cho mọi column)

QUY TẮC 3 — KHÔNG SET x/y SAU KHI appendChild VÀO AUTO-LAYOUT:
  ❌ SAI: parent.appendChild(child); child.x = 100; child.y = 50;
  ✅ ĐÚNG: parent.appendChild(child); child.layoutSizingHorizontal = "FILL";

QUY TẮC 4 — itemSpacing ĐỒNG NHẤT trong cùng container:
  → Spacing chuẩn: 8px (dense), 12px (default), 16px (spacious), 24px (section gap)
  → KHÔNG mix margin thủ công với itemSpacing

CHECKLIST ALIGNMENT — kiểm tra sau mỗi section:
  □ Mọi container chứa nhiều phần tử đều là auto-layout
  □ counterAxisAlignItems = "CENTER" cho HORIZONTAL layout
  □ counterAxisAlignItems = "MIN" cho VERTICAL layout
  □ Không có node con nào có .x hoặc .y bị set thủ công trong auto-layout cha
  □ Screenshot sau khi xong section → xác nhận không bị xô lệch
```

---

## Collapse/Expand Panel Component

```
Component set: "Collapse Expand Pannel"
Set key: 9470284e2509fcd122ca6bec03009b8a041c561d
Variants: Type = Collapse | Expand; Position = Top | Bottom | Left | Right; Bg Color = Gray | White

const collapseSet = await figma.importComponentSetByKeyAsync("9470284e2509fcd122ca6bec03009b8a041c561d");
const handle = collapseSet.children.find(c =>
  c.name === "Type=Collapse, Position=Top, Bg Color=White"
).createInstance();

Chọn variant: bảng + detail panel ngang → Position=Top/Bottom; sidebar → Position=Left/Right
NGHIÊM CẤM tự vẽ thanh collapse bằng rectangle + icon.
```
