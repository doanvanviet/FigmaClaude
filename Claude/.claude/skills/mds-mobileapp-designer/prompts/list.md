# Prompt: Mobile List Screen — MDS Mobile App

Màn hình danh sách mobile chuẩn MDS. Frame 390×844 (iPhone 14 Pro).

---

## Layout tổng thể

```
Frame: [Tên danh sách] (390×844, VERTICAL, bg BG/Page)
├── Status Bar (component)
├── Navigation Bar (component, FILL) — với back button + title
├── Search/Filter Bar (bg white, padding 12 16, HORIZONTAL, gap 8)
│   ├── Search input (FILL, h36)
│   └── Filter button (Button Icon Small hoặc icon)
├── Chip filters (HORIZONTAL, paddingH 16, gap 8)
│   └── Chip Medium × 3–4 (Selected/Outline variants)
├── Content (FILL×FILL, VERTICAL, gap 0)
│   ├── Section header (optional)
│   └── List Items (Card VERTICAL hoặc rows)
│       └── List Item × N (bg white, h64, HORIZONTAL, border-bottom)
│           ├── Avatar/Icon
│           ├── Text Group (VERTICAL, FILL)
│           └── Right side (Badge/Chevron)
└── (Home Indicator)
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
wrapper.name = "Danh sách khách hàng";
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
const sbInst = sb.createInstance();
wrapper.appendChild(sbInst);
sbInst.layoutSizingHorizontal = "FILL";

// 3. Navigation Bar
const navSet = await figma.importComponentSetByKeyAsync("4b5da0776732037162e819057c4a274224efac84");
const nav = navSet.children.find(c => c.name.includes("Style Brand=False")) || navSet.defaultVariant;
const navInst = nav.createInstance();
wrapper.appendChild(navInst);
navInst.layoutSizingHorizontal = "FILL";

// 4. Search bar
const searchBar = figma.createAutoLayout("HORIZONTAL");
searchBar.name = "Search Bar";
searchBar.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
searchBar.paddingTop = 12; searchBar.paddingBottom = 12;
searchBar.paddingLeft = 16; searchBar.paddingRight = 16;
searchBar.itemSpacing = 8;
searchBar.counterAxisAlignItems = "CENTER";
searchBar.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
searchBar.strokeBottomWeight = 1;
searchBar.strokeAlign = "INSIDE";
wrapper.appendChild(searchBar);
searchBar.layoutSizingHorizontal = "FILL";

const searchInput = figma.createAutoLayout("HORIZONTAL");
searchInput.fills = [{ type: "SOLID", color: { r: 0.976, g: 0.980, b: 0.988 } }];
searchInput.cornerRadius = 10;
searchInput.paddingLeft = 12; searchInput.paddingRight = 12;
searchInput.paddingTop = 9; searchInput.paddingBottom = 9;
searchInput.counterAxisAlignItems = "CENTER";
searchInput.itemSpacing = 8;
searchBar.appendChild(searchInput);
searchInput.layoutSizingHorizontal = "FILL";

const searchT = figma.createText();
searchT.characters = "Tìm kiếm...";
searchT.fontSize = 14;
searchT.fontName = { family: "Inter", style: "Regular" };
searchT.fills = [{ type: "SOLID", color: { r: 0.612, g: 0.639, b: 0.686 } }];
searchT.layoutGrow = 1;
searchInput.appendChild(searchT);

// 5. Chip filters
const chipRow = figma.createAutoLayout("HORIZONTAL");
chipRow.name = "Chip Filters";
chipRow.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
chipRow.paddingTop = 10; chipRow.paddingBottom = 10;
chipRow.paddingLeft = 16; chipRow.paddingRight = 16;
chipRow.itemSpacing = 8;
chipRow.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
chipRow.strokeBottomWeight = 1;
chipRow.strokeAlign = "INSIDE";
wrapper.appendChild(chipRow);
chipRow.layoutSizingHorizontal = "FILL";

const chipSet = await figma.importComponentSetByKeyAsync("42e695453334e442868c5822a88a40355048ca31");
const chipFilters = [
  { label: "Tất cả", selected: true },
  { label: "Hoạt động", selected: false },
  { label: "Tạm dừng", selected: false },
  { label: "Đã đóng", selected: false },
];
for (const f of chipFilters) {
  const cv = chipSet.children.find(c =>
    c.name.includes(f.selected ? "Selected=True" : "Selected=False") &&
    c.name.includes("Style=Outline") &&
    c.name.includes("State=Default")
  ) || chipSet.defaultVariant;
  const chipInst = cv.createInstance();
  chipRow.appendChild(chipInst);
}

// 6. List content card
const listCard = figma.createAutoLayout("VERTICAL");
listCard.name = "List";
listCard.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
listCard.itemSpacing = 0;
wrapper.appendChild(listCard);
listCard.layoutSizingHorizontal = "FILL";
listCard.layoutSizingVertical = "FILL";

// List items
const avatarSet = await figma.importComponentSetByKeyAsync("02ccfd66c8ad8b1999e59fa4c4f0e457a1008e78");
const badgeSet = await figma.importComponentSetByKeyAsync("f28262364c34bc10e4104134b8358f4f91d1d0f7");

const mockItems = [
  { name: "Nguyễn Văn A", sub: "vana@misa.com.vn", badgeCount: "3", badgeColor: "Danger" },
  { name: "Trần Thị B", sub: "thib@misa.com.vn", badgeCount: "1", badgeColor: "Info" },
  { name: "Lê Văn C", sub: "vanc@misa.com.vn", badgeCount: null, badgeColor: null },
  { name: "Phạm Thị D", sub: "thid@misa.com.vn", badgeCount: "7", badgeColor: "Danger" },
  { name: "Hoàng Văn E", sub: "vane@misa.com.vn", badgeCount: null, badgeColor: null },
  { name: "Đặng Thị F", sub: "thif@misa.com.vn", badgeCount: "2", badgeColor: "Warning" },
];

for (let i = 0; i < mockItems.length; i++) {
  const it = mockItems[i];
  const row = figma.createAutoLayout("HORIZONTAL");
  row.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  row.paddingLeft = 16; row.paddingRight = 16;
  row.paddingTop = 14; row.paddingBottom = 14;
  row.counterAxisAlignItems = "CENTER";
  row.itemSpacing = 12;
  if (i < mockItems.length - 1) {
    row.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
    row.strokeBottomWeight = 1;
    row.strokeAlign = "INSIDE";
  }
  listCard.appendChild(row);
  row.layoutSizingHorizontal = "FILL";

  // Avatar
  const av = avatarSet.children.find(c => c.name.includes("Size=40")) || avatarSet.defaultVariant;
  const avInst = av.createInstance();
  row.appendChild(avInst);

  // Text group
  const tg = figma.createAutoLayout("VERTICAL");
  tg.fills = [];
  tg.itemSpacing = 3;
  row.appendChild(tg);
  tg.layoutSizingHorizontal = "FILL";

  const nameT = figma.createText();
  nameT.characters = it.name;
  nameT.fontSize = 14;
  nameT.fontName = { family: "Inter", style: "Semi Bold" };
  nameT.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];
  tg.appendChild(nameT);
  nameT.layoutSizingHorizontal = "FILL";

  const subT = figma.createText();
  subT.characters = it.sub;
  subT.fontSize = 12;
  subT.fontName = { family: "Inter", style: "Regular" };
  subT.fills = [{ type: "SOLID", color: { r: 0.612, g: 0.639, b: 0.686 } }];
  tg.appendChild(subT);
  subT.layoutSizingHorizontal = "FILL";

  // Badge (nếu có)
  if (it.badgeCount) {
    const badge = badgeSet.children.find(c =>
      c.name.includes("Size=20") &&
      c.name.includes(`Color=${it.badgeColor}`) &&
      c.name.includes("Style=Solid")
    ) || badgeSet.defaultVariant;
    const badgeInst = badge.createInstance();
    row.appendChild(badgeInst);
  }
}

// 7. Home Indicator
const hiSet = await figma.importComponentSetByKeyAsync("a3d0ec72f838dc7ce3241e4d54e2d2b7070e9029");
const hi = hiSet.children.find(c =>
  c.name.includes("Device=iPhone") && c.name.includes("Portrait")
) || hiSet.defaultVariant;
const hiInst = hi.createInstance();
wrapper.appendChild(hiInst);
hiInst.layoutSizingHorizontal = "FILL";

return { success: true, wrapperId: wrapper.id };
```

---

## Checklist

- [ ] Status Bar (component)
- [ ] Navigation Bar (component) với back button + title danh sách
- [ ] Search bar (input + filter icon)
- [ ] Chip filters (Chip Medium component, Tất cả/Active/...)
- [ ] List items: Avatar + Name + Subtitle (6–8 items)
- [ ] Badge phía phải khi có notification (Badge component)
- [ ] Chevron right cho các item navigable
- [ ] Empty State component khi danh sách rỗng
- [ ] Home Indicator (component)
