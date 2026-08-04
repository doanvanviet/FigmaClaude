# Screen Patterns — MDS Mobile App

Patterns layout cho các loại màn hình mobile phổ biến. Luôn dùng component từ thư viện cho mọi control.

---

## 1. Frame Wrapper Chuẩn

```js
const wrapper = figma.createAutoLayout("VERTICAL");
wrapper.name = "Tên Màn Hình";
wrapper.resize(390, 844); // iPhone 14 Pro
wrapper.layoutSizingHorizontal = "FIXED";
wrapper.layoutSizingVertical = "FIXED";
wrapper.fills = [{ type: "SOLID", color: { r: 0.953, g: 0.957, b: 0.965 } }]; // BG/Page
wrapper.primaryAxisAlignItems = "MIN";
wrapper.counterAxisAlignItems = "MIN";
wrapper.itemSpacing = 0;
wrapper.clipsContent = true;
// Đặt xa vùng hiện tại
wrapper.x = maxX + 200;
wrapper.y = 0;
```

---

## 2. Status Bar (luôn dùng component)

```js
const sbSet = await figma.importComponentSetByKeyAsync("600b05b4627ac58c286648585bc9c2329138a2b4");
const sb = sbSet.children.find(c =>
  c.name.includes("Theme=Default") &&
  c.name.includes("Device=iPhone (Notch)") &&
  c.name.includes("Portrait")
) || sbSet.defaultVariant;
const sbInst = sb.createInstance();
wrapper.appendChild(sbInst);
sbInst.layoutSizingHorizontal = "FILL";
```

---

## 3. Navigation Bar (luôn dùng component)

```js
const navSet = await figma.importComponentSetByKeyAsync("4b5da0776732037162e819057c4a274224efac84");
const nav = navSet.children.find(c => c.name.includes("Style Brand=False")) || navSet.defaultVariant;
const navInst = nav.createInstance();
wrapper.appendChild(navInst);
navInst.layoutSizingHorizontal = "FILL";
// Override title nếu component có TEXT property
const props = Object.keys(navInst.componentProperties);
// Tìm prop tên title và set
```

---

## 4. Home Indicator (luôn dùng component)

```js
const hiSet = await figma.importComponentSetByKeyAsync("a3d0ec72f838dc7ce3241e4d54e2d2b7070e9029");
const hi = hiSet.children.find(c =>
  c.name.includes("Device=iPhone") && c.name.includes("Portrait")
) || hiSet.defaultVariant;
const hiInst = hi.createInstance();
wrapper.appendChild(hiInst);
hiInst.layoutSizingHorizontal = "FILL";
```

---

## 5. Content Area (tự build)

```js
const content = figma.createAutoLayout("VERTICAL");
content.name = "Content";
content.fills = [];
content.paddingTop = 16; content.paddingBottom = 16;
content.paddingLeft = 16; content.paddingRight = 16;
content.itemSpacing = 16;
content.primaryAxisAlignItems = "MIN";
wrapper.appendChild(content);
content.layoutSizingHorizontal = "FILL";
content.layoutSizingVertical = "FILL";
```

---

## 6. Card (tự build)

```js
const card = figma.createAutoLayout("VERTICAL");
card.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
card.cornerRadius = 12;
card.paddingTop = 16; card.paddingBottom = 16;
card.paddingLeft = 16; card.paddingRight = 16;
card.itemSpacing = 12;
content.appendChild(card);
card.layoutSizingHorizontal = "FILL";
```

---

## 7. List Item Row (tự build + components)

```
List Item (HORIZONTAL, h60, gap 12, paddingH 16, bg white, border-bottom)
├── Avatar (dùng Avatar component)
├── Text Group (VERTICAL, gap 4, FILL)
│   ├── Title (Inter Semi Bold 14)
│   └── Subtitle (Inter Regular 13, text secondary)
└── Right Side (Badge hoặc Chevron)
```

```js
const item = figma.createAutoLayout("HORIZONTAL");
item.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
item.resize(390, 64);
item.paddingLeft = 16; item.paddingRight = 16;
item.counterAxisAlignItems = "CENTER";
item.itemSpacing = 12;
item.primaryAxisSizingMode = "FIXED";
item.counterAxisSizingMode = "FIXED";
```

---

## 8. Section Header (tự build)

```js
const sectionHeader = figma.createAutoLayout("HORIZONTAL");
sectionHeader.fills = [];
sectionHeader.paddingTop = 12; sectionHeader.paddingBottom = 8;
sectionHeader.paddingLeft = 16; sectionHeader.paddingRight = 16;
sectionHeader.primaryAxisAlignItems = "SPACE_BETWEEN";
sectionHeader.counterAxisAlignItems = "CENTER";

const title = figma.createText();
title.characters = "Tên section";
title.fontSize = 16;
title.fontName = { family: "Inter", style: "Semi Bold" };
title.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];

const seeAll = figma.createText();
seeAll.characters = "Xem thêm";
seeAll.fontSize = 13;
seeAll.fontName = { family: "Inter", style: "Medium" };
seeAll.fills = [{ type: "SOLID", color: { r: 0.016, g: 0.600, b: 0.894 } }];
```

---

## 9. Form Field Group (tự build + TextField component)

```
Field Group (VERTICAL, gap 8, bg white, padding 16, border-bottom)
├── Label (Inter Medium 13, text primary)
└── [TextField component hoặc custom input]
```

```js
async function createFormField(label, placeholder, parent) {
  const group = figma.createAutoLayout("VERTICAL");
  group.fills = [];
  group.itemSpacing = 8;
  group.primaryAxisAlignItems = "MIN";

  const lbl = figma.createText();
  lbl.characters = label;
  lbl.fontSize = 13;
  lbl.fontName = { family: "Inter", style: "Medium" };
  lbl.fills = [{ type: "SOLID", color: { r: 0.157, g: 0.204, b: 0.294 } }];
  group.appendChild(lbl);

  // Thử dùng TextField component trước
  try {
    const tfSet = await figma.importComponentSetByKeyAsync("cec0aa5278edf04622d2f6de6eb1ae7f4ede92ea");
    const tf = tfSet.children.find(c =>
      c.name.includes("Type=Default") && c.name.includes("State=Placeholder")
    ) || tfSet.defaultVariant;
    const tfInst = tf.createInstance();
    group.appendChild(tfInst);
    tfInst.layoutSizingHorizontal = "FILL";
  } catch (e) {
    // Fallback custom input nếu font lỗi
    group.appendChild(createCustomInput(placeholder));
  }

  parent.appendChild(group);
  group.layoutSizingHorizontal = "FILL";
}
```

---

## 10. Custom Input Field (fallback khi SF Pro Text không available)

```js
function createCustomInput(placeholder, hasEye) {
  const box = figma.createAutoLayout("HORIZONTAL");
  box.fills = [{ type: "SOLID", color: { r: 0.976, g: 0.980, b: 0.988 } }];
  box.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
  box.strokeWeight = 1.5;
  box.cornerRadius = 12;
  box.paddingLeft = 16; box.paddingRight = 16;
  box.paddingTop = 14;  box.paddingBottom = 14;
  box.itemSpacing = 10;
  box.counterAxisAlignItems = "CENTER";
  box.primaryAxisSizingMode = "FIXED";
  box.resize(342, 52);

  const t = figma.createText();
  t.characters = placeholder;
  t.fontSize = 15;
  t.fontName = { family: "Inter", style: "Regular" };
  t.fills = [{ type: "SOLID", color: { r: 0.612, g: 0.639, b: 0.686 } }];
  t.layoutGrow = 1;
  box.appendChild(t);

  if (hasEye) {
    const eye = figma.createText();
    eye.characters = "◎";
    eye.fontSize = 16;
    eye.fontName = { family: "Inter", style: "Regular" };
    eye.fills = [{ type: "SOLID", color: { r: 0.459, g: 0.498, b: 0.580 } }];
    box.appendChild(eye);
  }
  return box;
}
```

---

## 11. Bottom Tab Bar (tự build)

```
Tab Bar (HORIZONTAL, h83, bg white, border-top, SPACE_AROUND)
├── Tab Item × 4–5 (VERTICAL, CENTER, gap 4, h83)
│   ├── Icon (24×24 hoặc Icon Swap component)
│   └── Label (Inter Regular 10)
```

---

## 12. Divider (luôn dùng component)

```js
const divSet = await figma.importComponentSetByKeyAsync("116bc5d9d9475271ebfe0aef292c0c54c98831c9");
const div = divSet.children.find(c =>
  c.name.includes("Size=1") && c.name.includes("Horizontal=True")
) || divSet.defaultVariant;
const divInst = div.createInstance();
parent.appendChild(divInst);
divInst.layoutSizingHorizontal = "FILL";
```
