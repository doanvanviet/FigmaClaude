# Component API Rules — MDS Web App Designer

> Đọc file này khi làm việc với component properties, fills, icon slots, traversal trong Figma plugin.

---

## ⛔ QUY TẮC SỐ 3 — DÙNG COMPONENT PROPERTIES, KHÔNG TỰ ĐỔI MÀU/STYLE

```
⛔⛔⛔ TUYỆT ĐỐI NGHIÊM CẤM: SET FILLS TRỰC TIẾP VÀO BẤT KỲ INSTANCE NÀO ⛔⛔⛔

  KHÔNG BAO GIỜ được viết:
    instance.fills = [...]                        // ← NGHIÊM CẤM TUYỆT ĐỐI
    instance.fills = [setBoundVariableForPaint()]  // ← NGHIÊM CẤM TUYỆT ĐỐI
    instance.children[0].fills = [...]            // ← NGHIÊM CẤM TUYỆT ĐỐI
    nestedNode.fills = [...] (node bên trong instance) // ← NGHIÊM CẤM TUYỆT ĐỐI

  Bất kỳ node nào là INSTANCE hoặc nằm bên trong INSTANCE đều được component
  tự quản lý màu sắc thông qua variant/style. KHÔNG ĐƯỢC CAN THIỆP.

  QUY TẮC ĐỂ NHỚ: Nếu node.type === "INSTANCE" → KHÔNG SET FILLS. Hết.

Khi component đã có sẵn thuộc tính (Boolean, Variant, InstanceSwap):
  NGHIÊM CẤM tự tay đổi fills/strokes/opacity để "giống ảnh"
  NGHIÊM CẤM pick màu riêng ngoài những gì component đã cung cấp.

QUY TRÌNH BẮT BUỘC:
  1. Sau createInstance(), gọi ngay:
       const props = inst.componentProperties;
       // xem toàn bộ properties
  2. Dùng inst.setProperties({ key: value }) để bật/tắt:
       - Boolean prop (icon, badge, divider, label...): true/false
       - Variant prop (Color, Style, State, Size): đúng tên giá trị
       - InstanceSwap prop (icon slot): swap component icon phù hợp
  3. CHỈ thay đổi fills/colors khi:
       a. Đó là frame/shape tự tạo (không phải instance thư viện)
       b. Đã kiểm tra node.type !== "INSTANCE"

VÍ DỤ ĐÚNG:
  // Sidebar item active state
  inst.setProperties({ "State": "Actived", "Color": "Brand", "Style": "Filled" });

  // Button với icon
  inst.setProperties({ "Icon Left#789:0": true, "Label#012:0": "Lưu" });
  await swapIconInSlot(inst, "Icon Left", iconComponentKey);

VÍ DỤ SAI — NGHIÊM CẤM:
  inst.fills = [{ type: "SOLID", color: { r: 0.02, g: 0.6, b: 0.9 } }]; // ← SAI
  inst.fills = [setBoundVariableForPaint(...)];  // ← SAI dù dùng variable
  inst.children[0].fills = [...];    // ← SAI, đổi màu thủ công
  inst.layoutSizingVertical = "HUG"; // ← SAI, thay đổi kích thước component
  inst.resize(w, h);                 // ← SAI, hardcode kích thước
  inst.paddingLeft = 12;             // ← SAI, padding chỉ áp dụng cho frame tự tạo
  const headerText = colHeaderInst.findOne(t => t.name === "Header");
  headerText.fills = [setBoundVariable(...)]; // NGHIÊM CẤM — component tự quản lý màu rồi

NGUYÊN TẮC GỐC: instance = bản sao y hệt component gốc.
  Chỉ được thay đổi thông qua setProperties() — không được chỉnh bất kỳ thuộc tính lẻ nào khác.
  Ngoại lệ duy nhất: layoutSizingHorizontal = "FILL" khi cần fill trong auto-layout cha.
  Text override (characters) được phép — nhưng KHÔNG được kèm theo đổi fills/color.

NẾU ĐÃ LỠ SET fills SAI trên nested text node trong instance:
  ⚠️ resetOverrides() XÓA TOÀN BỘ overrides — kể cả icon đang set đúng.
  PHẢI lưu lại tất cả trước, rồi restore sau.

  QUY TRÌNH BẮT BUỘC khi dùng resetOverrides():
    // 1. Lưu text characters
    const savedLabel = inst.findOne(t => t.name === "Header")?.characters;
    // 2. Lưu TẤT CẢ icon slots (◇ Icon props) trên các child instances
    const iconSlots = [];
    const iconContainers = inst.findAll(n => n.type === "INSTANCE" && n.name === "Icon Left");
    for (const ic of iconContainers) {
      const pk = Object.keys(ic.componentProperties).find(k => k.startsWith("◇ Icon"));
      if (pk) iconSlots.push({ node: ic, propKey: pk, value: ic.componentProperties[pk].value });
    }
    // 3. Reset
    inst.resetOverrides();
    // 4. Set variant props
    inst.setProperties({ "State": "Actived", "Color": "Brand", "Style": "Filled" });
    // 5. Restore text
    const restoredText = inst.findOne(t => t.name === "Header");
    if (restoredText && savedLabel) restoredText.characters = savedLabel;
    // 6. Restore icon slots — BẮT BUỘC, không bỏ qua
    for (const slot of iconSlots) {
      if (slot.value && slot.value !== "38:12") { // 38:12 = Icon Placeholder = mặc định xấu
        slot.node.setProperties({ [slot.propKey]: slot.value });
      }
    }

KHI COMPONENT CHỈ CÓ MỘT VARIANT (không có Dark/Light):
  → Dùng component đúng theo màu mặc định của nó, KHÔNG tự vẽ thêm
  → Ví dụ: Sidebar LUÔN dùng BG/White (nền trắng) — KHÔNG override fills để "giả" dark sidebar
  → Nếu cần override: dùng setBoundVariableForPaint() với đúng variable từ MDS library

SIDEBAR ICON COLOR — BẮT BUỘC:
  → Item State=Actived   → Icon Left Color = "Brand"   (variant: "Size=20, Color=Brand, Filled=No")
  → Item State=Inactived → Icon Left Color = "Neutral" (variant: "Size=20, Color=Neutral, Filled=No")
  → KHÔNG để icon inactive dùng Brand color
  → Cách đổi color variant — dùng swapComponent() lên Icon Left:
      const iconSwapSet = await figma.importComponentSetByKeyAsync("f706505f3a7fca403f3418145c791c4bd56e24f9");
      const neutralVariant = iconSwapSet.children.find(c => c.name === "Size=20, Color=Neutral, Filled=No");
      const brandVariant   = iconSwapSet.children.find(c => c.name === "Size=20, Color=Brand, Filled=No");
      for (const item of navItems) {
        const iconLeft = item.findOne(n => n.name === "Icon Left");
        if (!iconLeft) continue;
        const isActive = item.componentProperties?.["State"]?.value === "Actived";
        iconLeft.swapComponent(isActive ? brandVariant : neutralVariant);
      }

WHITE PANEL TRÊN NỀN BG/Page — BẮT BUỘC đặt Drop Shadow:
  → Mọi frame/panel nền BG/White đặt trên nền BG/Page đều PHẢI có effect:
      "Drop Shadow/Neutral/All 2" (MDS Web Components v2.0)
      Style key: 39c25872f83571d7823aff2ac30389e9d683a499
  → const shadowStyle = await figma.importStyleByKeyAsync("39c25872f83571d7823aff2ac30389e9d683a499");
    node.effectStyleId = shadowStyle.id;
  → Áp dụng cho: Tab Area, Table Panel, Summary Bar, Detail Section, Card, Modal, Popover
```

---

## ⛔ QUY TẮC SỐ 5 — TRAVERSAL VÀO COMPONENT INSTANCE (BẮT BUỘC)

```
⛔ NGHIÊM CẤM: findAll / findOne bên trong instance của thư viện MDS
   Lý do: một số node bên trong instance có ID không hợp lệ → callback crash
   Error dạng: "in get_name/get_visible: Node with id 'IXXX' not found"

QUY TẮC AN TOÀN TUYỆT ĐỐI khi làm việc với instance component:
  1. Thay đổi → dùng setProperties({ key: value }) ONLY
  2. Tìm node con → dùng instance.query("SELECTOR") thay vì findAll/findOne
  3. KHÔNG BAO GIỜ đọc/ghi .visible, .fills, .opacity, .resize() trên node
     tìm thấy bên trong instance — chỉ được gọi setProperties() hoặc .characters

DUY NHẤT 2 THAO TÁC AN TOÀN trên node tìm thấy bên trong instance:
  ✅ node.setProperties({ key: value })
  ✅ node.characters = "text"

  ❌ node.visible = false/true            ← CRASH nếu node ID không hợp lệ
  ❌ node.fills = [...]                   ← CRASH hoặc vi phạm Rule 3
  ❌ node.resize(w, h)                    ← CRASH hoặc phá layout
  ❌ findAll/findOne(n => n.name ...)     ← CRASH khi callback truy cập n.name

CÁCH TÌM NODE TRONG INSTANCE (ƯU TIÊN THEO THỨ TỰ):
  1. query() — an toàn nhất:
       const item = inst.query("INSTANCE[name=_Tab Vertical Item]").first();
       const texts = inst.query("TEXT").toArray();
  2. Lặp thủ công với try-catch:
       for (const child of (inst.children || [])) {
         let name; try { name = child.name; } catch(e) { continue; }
         // chỉ đọc .name trong try-catch, không đọc .visible/.fills
       }
  3. setProperties với key đã biết — không cần tìm gì cả:
       inst.setProperties({ "Tab 4#1248:19": false }); // dùng key từ inspection

VÍ DỤ ĐÚNG:
  thInst.setProperties({ "Tab 4#1248:19": false }); // ← ĐÚNG, trust it

VÍ DỤ SAI — NGHIÊM CẤM:
  const tab04 = thInst.findOne(n => n.name === "Tab 04"); // ← CRASH
  if (tab04 && !tab04.visible) tab04.visible = false;     // ← CRASH

TABLE COLUMN — BOOLEAN FOOTER:
  → Nếu không được yêu cầu vẽ Footer → LUÔN tắt Boolean Footer trên mỗi cột.
  BẮT BUỘC sau khi tạo/clone mỗi cột:
    col.setProperties({ "◐ Footer#...": false });
    // Hoặc tìm đúng key:
    const footerKey = Object.keys(col.componentProperties).find(k => k.toLowerCase().includes("footer"));
    if (footerKey) col.setProperties({ [footerKey]: false });
  Chỉ bật Footer khi user yêu cầu hiển thị tổng / summary dưới cùng bảng.
```
