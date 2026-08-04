# Prompt: Web Dashboard Screen — MDS Web App

Màn hình dashboard/home web app chuẩn MDS. Frame 1440×900.

---

## Layout tổng thể

```
Frame: Dashboard (1440×900, HORIZONTAL)
├── Sidebar (240×900) — xem screen-patterns.md
└── Main Content (FILL×900, VERTICAL)
    ├── Top Bar (FILL×64) — xem screen-patterns.md
    └── Content Area (FILL×FILL, padding 24, gap 20)
        ├── Page Header (HORIZONTAL, SPACE_BETWEEN)
        ├── Stats Row (4 cards, HORIZONTAL, gap 16)
        ├── Charts/Tables Row (HORIZONTAL, gap 16)
        └── Recent Activity Section
```

---

## Script mẫu — Stats Row

```js
// Sau khi đã tạo wrapper, sidebar, main, topBar, content (xem screen-patterns.md)

// Page header
const pageHeader = figma.createAutoLayout("HORIZONTAL");
pageHeader.fills = [];
pageHeader.primaryAxisAlignItems = "SPACE_BETWEEN";
pageHeader.counterAxisAlignItems = "CENTER";
content.appendChild(pageHeader);
pageHeader.layoutSizingHorizontal = "FILL";

const pageTitle = figma.createText();
pageTitle.characters = "Dashboard";
pageTitle.fontSize = 22;
pageTitle.fontName = { family: "Inter", style: "Semi Bold" };
pageTitle.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];
pageHeader.appendChild(pageTitle);

// Nút "Thêm mới" — Button Medium Brand/Solid
const btnSet = await figma.importComponentSetByKeyAsync("1127e80302210bea3d222691252f2a630ce7cbef");
const addBtn = btnSet.children.find(c =>
  c.name.includes("Color=Brand") && c.name.includes("Style=Solid") && c.name.includes("State=Default")
) || btnSet.defaultVariant;
const addBtnInst = addBtn.createInstance();
pageHeader.appendChild(addBtnInst);

// Stats row (4 cards)
const statsRow = figma.createAutoLayout("HORIZONTAL");
statsRow.fills = [];
statsRow.itemSpacing = 16;
content.appendChild(statsRow);
statsRow.layoutSizingHorizontal = "FILL";

const stats = [
  { label: "Doanh thu", value: "₫1.24 tỷ", change: "+12.5%", type: "success" },
  { label: "Đơn hàng", value: "3,842", change: "+8.2%", type: "info" },
  { label: "Khách hàng", value: "1,247", change: "+3.1%", type: "success" },
  { label: "Hoàn thành", value: "94.2%", change: "-1.3%", type: "danger" },
];

for (const stat of stats) {
  const card = figma.createAutoLayout("VERTICAL");
  card.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  card.cornerRadius = 12;
  card.paddingTop = 20; card.paddingBottom = 20;
  card.paddingLeft = 20; card.paddingRight = 20;
  card.itemSpacing = 8;
  card.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
  card.strokeWeight = 1;
  card.strokeAlign = "INSIDE";
  statsRow.appendChild(card);
  card.layoutSizingHorizontal = "FILL";

  const lbl = figma.createText();
  lbl.characters = stat.label;
  lbl.fontSize = 13;
  lbl.fontName = { family: "Inter", style: "Medium" };
  lbl.fills = [{ type: "SOLID", color: { r: 0.420, g: 0.447, b: 0.502 } }];
  card.appendChild(lbl);
  lbl.layoutSizingHorizontal = "FILL";

  const val = figma.createText();
  val.characters = stat.value;
  val.fontSize = 24;
  val.fontName = { family: "Inter", style: "Bold" };
  val.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];
  card.appendChild(val);
}
```

---

## Sidebar Nav Items (tự build — không có component)

```js
const navItems = [
  { label: "Dashboard", active: true },
  { label: "Đơn hàng", active: false },
  { label: "Khách hàng", active: false },
  { label: "Sản phẩm", active: false },
  { label: "Báo cáo", active: false },
  { label: "Cài đặt", active: false },
];

for (const item of navItems) {
  const navItem = figma.createAutoLayout("HORIZONTAL");
  navItem.resize(240, 44);
  navItem.paddingLeft = 12; navItem.paddingRight = 12;
  navItem.counterAxisAlignItems = "CENTER";
  navItem.itemSpacing = 10;
  navItem.cornerRadius = 8;
  navItem.fills = item.active
    ? [{ type: "SOLID", color: { r: 0.016, g: 0.600, b: 0.894 }, opacity: 0.15 }]
    : [];
  navMenu.appendChild(navItem);
  navItem.layoutSizingHorizontal = "FILL";
  navItem.layoutSizingVertical = "FIXED";

  // Icon Swap component
  const iconSet = await figma.importComponentSetByKeyAsync("30d866c255d2558edef08b5e9967519f5c83af92");
  const icon = iconSet.children.find(c =>
    c.name.includes("Size=20") &&
    c.name.includes(item.active ? "Color=Brand" : "Color=Neutral") &&
    c.name.includes("Hierarchy=Primary")
  ) || iconSet.defaultVariant;
  const iconInst = icon.createInstance();
  navItem.appendChild(iconInst);

  const navLabel = figma.createText();
  navLabel.characters = item.label;
  navLabel.fontSize = 14;
  navLabel.fontName = { family: "Inter", style: item.active ? "Semi Bold" : "Regular" };
  navLabel.fills = [{ type: "SOLID", color: item.active
    ? { r: 0.016, g: 0.600, b: 0.894 }
    : { r: 1, g: 1, b: 1, a: 0.75 }
  }];
  navItem.appendChild(navLabel);
  navLabel.layoutGrow = 1;
}
```

---

## Checklist

- [ ] Sidebar với logo, nav items, user profile
- [ ] Top bar với breadcrumb/page title, search, user avatar
- [ ] Stats row: 4 KPI cards
- [ ] Chart section (placeholder hoặc bar/line chart)
- [ ] Recent orders table (xem table-list.md)
- [ ] Quick actions panel
