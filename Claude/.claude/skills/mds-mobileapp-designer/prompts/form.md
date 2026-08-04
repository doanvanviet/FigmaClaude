# Prompt: Mobile Form Screen — MDS Mobile App

Màn hình form thêm/sửa dữ liệu mobile chuẩn MDS. Frame 390×844 (iPhone 14 Pro).

---

## Layout tổng thể

```
Frame: [Tên Form] (390×844, VERTICAL, bg BG/Page)
├── Status Bar (component)
├── Navigation Bar (component) — back + title + Save button
├── Content (FILL×FILL, VERTICAL, gap 0, scrollable)
│   ├── Section 1 (bg white, VERTICAL, padding 16, gap 16, margin-bottom 8)
│   │   ├── Section title (Inter Semi Bold 14, Brand)
│   │   ├── Field 1 (VERTICAL, gap 8: Label + Input)
│   │   ├── Divider (component)
│   │   └── Field 2 ...
│   ├── Section 2 (tương tự)
│   └── Section 3 (Toggles, Checkboxes...)
└── Bottom Actions (bg white, border-top, padding 16 16 34, HORIZONTAL)
    ├── Cancel (Button Medium Gray/Outline, FILL)
    └── Save (Button Medium Brand/Solid, FILL)
```

---

## Script mẫu

```js
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

let maxX = 0;
for (const c of figma.currentPage.children) maxX = Math.max(maxX, c.x + c.width);

// 1. Wrapper
const wrapper = figma.createAutoLayout("VERTICAL");
wrapper.name = "Thêm khách hàng";
wrapper.resize(390, 844);
wrapper.layoutSizingHorizontal = "FIXED";
wrapper.layoutSizingVertical = "FIXED";
wrapper.fills = [{ type: "SOLID", color: { r: 0.953, g: 0.957, b: 0.965 } }];
wrapper.primaryAxisAlignItems = "MIN";
wrapper.itemSpacing = 0;
wrapper.clipsContent = true;
wrapper.x = maxX + 200; wrapper.y = 0;

// 2. Status Bar
const sbSet = await figma.importComponentSetByKeyAsync("600b05b4627ac58c286648585bc9c2329138a2b4");
const sb = sbSet.children.find(c =>
  c.name.includes("Theme=Default") && c.name.includes("Device=iPhone (Notch)") && c.name.includes("Portrait")
) || sbSet.defaultVariant;
wrapper.appendChild(sb.createInstance());
sb.createInstance(); // already done above — fix below
const sbInst = sbSet.defaultVariant.createInstance();
// NOTE: Dùng đúng variant đã find ở trên:
// wrapper.appendChild(sbInst); sbInst.layoutSizingHorizontal = "FILL";

// 3. Navigation Bar
const navSet = await figma.importComponentSetByKeyAsync("4b5da0776732037162e819057c4a274224efac84");
const nav = navSet.children.find(c => c.name.includes("Style Brand=False")) || navSet.defaultVariant;
const navInst = nav.createInstance();
wrapper.appendChild(navInst);
navInst.layoutSizingHorizontal = "FILL";

// 4. Content scroll area
const content = figma.createAutoLayout("VERTICAL");
content.name = "Content";
content.fills = [];
content.itemSpacing = 8;
content.primaryAxisAlignItems = "MIN";
wrapper.appendChild(content);
content.layoutSizingHorizontal = "FILL";
content.layoutSizingVertical = "FILL";

// Helper: create custom input
function createCustomInput(placeholder) {
  const box = figma.createAutoLayout("HORIZONTAL");
  box.fills = [{ type: "SOLID", color: { r: 0.976, g: 0.980, b: 0.988 } }];
  box.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
  box.strokeWeight = 1.5;
  box.cornerRadius = 12;
  box.paddingLeft = 16; box.paddingRight = 16;
  box.paddingTop = 14; box.paddingBottom = 14;
  box.counterAxisAlignItems = "CENTER";
  const t = figma.createText();
  t.characters = placeholder;
  t.fontSize = 15;
  t.fontName = { family: "Inter", style: "Regular" };
  t.fills = [{ type: "SOLID", color: { r: 0.612, g: 0.639, b: 0.686 } }];
  t.layoutGrow = 1;
  box.appendChild(t);
  return box;
}

// Helper: create form field
async function createField(label, placeholder, parent, required) {
  const divSet = await figma.importComponentSetByKeyAsync("116bc5d9d9475271ebfe0aef292c0c54c98831c9");
  const divV = divSet.children.find(c =>
    c.name.includes("Size=1") && c.name.includes("Horizontal=True")
  ) || divSet.defaultVariant;

  const group = figma.createAutoLayout("VERTICAL");
  group.fills = [];
  group.itemSpacing = 8;
  parent.appendChild(group);
  group.layoutSizingHorizontal = "FILL";

  const lbl = figma.createText();
  lbl.characters = label + (required ? " *" : "");
  lbl.fontSize = 13;
  lbl.fontName = { family: "Inter", style: "Medium" };
  lbl.fills = [{ type: "SOLID", color: { r: 0.157, g: 0.204, b: 0.294 } }];
  group.appendChild(lbl);
  lbl.layoutSizingHorizontal = "FILL";

  try {
    const tfSet = await figma.importComponentSetByKeyAsync("cec0aa5278edf04622d2f6de6eb1ae7f4ede92ea");
    const tf = tfSet.children.find(c =>
      c.name.includes("Type=Default") && c.name.includes("State=Placeholder")
    ) || tfSet.defaultVariant;
    const tfInst = tf.createInstance();
    group.appendChild(tfInst);
    tfInst.layoutSizingHorizontal = "FILL";
  } catch(e) {
    const input = createCustomInput(placeholder || "Nhập " + label.toLowerCase());
    group.appendChild(input);
    input.layoutSizingHorizontal = "FILL";
  }

  // Divider sau field
  const divInst = divV.createInstance();
  parent.appendChild(divInst);
  divInst.layoutSizingHorizontal = "FILL";
}

// Helper: create form section
function createSection(title) {
  const section = figma.createAutoLayout("VERTICAL");
  section.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  section.paddingTop = 16; section.paddingBottom = 8;
  section.paddingLeft = 16; section.paddingRight = 16;
  section.itemSpacing = 0;
  content.appendChild(section);
  section.layoutSizingHorizontal = "FILL";

  if (title) {
    const sTitle = figma.createText();
    sTitle.characters = title;
    sTitle.fontSize = 13;
    sTitle.fontName = { family: "Inter", style: "Semi Bold" };
    sTitle.fills = [{ type: "SOLID", color: { r: 0.016, g: 0.600, b: 0.894 } }];
    section.appendChild(sTitle);
    sTitle.layoutSizingHorizontal = "FILL";

    // Padding sau title
    const spacer = figma.createAutoLayout("HORIZONTAL");
    spacer.fills = [];
    spacer.resize(1, 12);
    section.appendChild(spacer);
  }

  return section;
}

// 5. Section 1: Thông tin cơ bản
const section1 = createSection("Thông tin cơ bản");
await createField("Tên khách hàng", "Nhập tên khách hàng", section1, true);
await createField("Mã khách hàng", "VD: KH001", section1, false);
await createField("Email", "email@example.com", section1, true);
await createField("Số điện thoại", "0901 234 567", section1, false);

// 6. Section 2: Địa chỉ
const section2 = createSection("Địa chỉ");
await createField("Tỉnh/Thành phố", "Chọn tỉnh/thành phố", section2, false);
await createField("Quận/Huyện", "Chọn quận/huyện", section2, false);
await createField("Địa chỉ chi tiết", "Số nhà, tên đường...", section2, false);

// 7. Section 3: Cài đặt (Toggle)
const section3 = createSection("Cài đặt");

const toggleRow = figma.createAutoLayout("HORIZONTAL");
toggleRow.fills = [];
toggleRow.primaryAxisAlignItems = "SPACE_BETWEEN";
toggleRow.counterAxisAlignItems = "CENTER";
toggleRow.paddingBottom = 16;
section3.appendChild(toggleRow);
toggleRow.layoutSizingHorizontal = "FILL";

const toggleLabel = figma.createText();
toggleLabel.characters = "Gửi thông báo";
toggleLabel.fontSize = 14;
toggleLabel.fontName = { family: "Inter", style: "Regular" };
toggleLabel.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];
toggleLabel.layoutGrow = 1;
toggleRow.appendChild(toggleLabel);

const toggleSet = await figma.importComponentSetByKeyAsync("39678ea920b3f52d8f52824a441b6922717ee0f7");
const toggle = toggleSet.children.find(c => c.name.includes("Status=On")) || toggleSet.defaultVariant;
const toggleInst = toggle.createInstance();
toggleRow.appendChild(toggleInst);

// 8. Bottom actions
const bottomActions = figma.createAutoLayout("HORIZONTAL");
bottomActions.name = "Bottom Actions";
bottomActions.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
bottomActions.paddingTop = 16; bottomActions.paddingBottom = 34;
bottomActions.paddingLeft = 16; bottomActions.paddingRight = 16;
bottomActions.itemSpacing = 12;
bottomActions.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
bottomActions.strokeTopWeight = 1;
bottomActions.strokeAlign = "INSIDE";
wrapper.appendChild(bottomActions);
bottomActions.layoutSizingHorizontal = "FILL";

const btnSet = await figma.importComponentSetByKeyAsync("1127e80302210bea3d222691252f2a630ce7cbef");

const cancelV = btnSet.children.find(c =>
  c.name.includes("Color=Gray") && c.name.includes("Style=Outline") && c.name.includes("State=Default")
) || btnSet.defaultVariant;
const cancelBtn = cancelV.createInstance();
bottomActions.appendChild(cancelBtn);
cancelBtn.layoutSizingHorizontal = "FILL";

const saveV = btnSet.children.find(c =>
  c.name.includes("Color=Brand") && c.name.includes("Style=Solid") && c.name.includes("State=Default")
) || btnSet.defaultVariant;
const saveBtn = saveV.createInstance();
bottomActions.appendChild(saveBtn);
saveBtn.layoutSizingHorizontal = "FILL";

return { success: true, wrapperId: wrapper.id };
```

---

## Checklist

- [ ] Status Bar (component)
- [ ] Navigation Bar (component) với back button + title + Save link
- [ ] Form sections với section title màu Brand
- [ ] Fields: Label + TextField component (hoặc custom fallback)
- [ ] Divider giữa các fields (Divider component, Size=1)
- [ ] Required fields có dấu * sau label
- [ ] Toggle/Checkbox section cho cài đặt on/off
- [ ] Bottom actions: Cancel (Gray/Outline) + Save (Brand/Solid)
- [ ] Padding bottom 34px để không bị home indicator che
