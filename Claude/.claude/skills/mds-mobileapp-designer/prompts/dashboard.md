# Prompt: Mobile Dashboard/Home Screen — MDS Mobile App

Màn hình home/dashboard mobile chuẩn MDS. Frame 390×844 (iPhone 14 Pro).

---

## Layout tổng thể

```
Frame: Home (390×844, VERTICAL, bg BG/Page)
├── Status Bar (component)
├── Navigation Bar (component, FILL) — title "Trang chủ"
├── Content (FILL×FILL, VERTICAL, padding 16, gap 16, scrollable)
│   ├── Banner/Welcome card (FILL, radius 16, gradient)
│   ├── Stats Row (HORIZONTAL, gap 12, FILL)
│   │   ├── Stat Card × 2–3 (FILL)
│   ├── Section: "Gần đây" (section header + list items)
│   │   ├── Section Header (HORIZONTAL, SPACE_BETWEEN)
│   │   └── List Items × 3–4 (Card + Avatar + text)
│   └── Section: "Hoạt động" hoặc Quick Actions
└── Tab Bar (HORIZONTAL, h83, bg white, SPACE_AROUND)
    └── Tab Item × 4–5
```

---

## Script mẫu

```js
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

let maxX = 0;
for (const c of figma.currentPage.children) maxX = Math.max(maxX, c.x + c.width);

// 1. Wrapper
const wrapper = figma.createAutoLayout("VERTICAL");
wrapper.name = "Home";
wrapper.resize(390, 844);
wrapper.layoutSizingHorizontal = "FIXED";
wrapper.layoutSizingVertical = "FIXED";
wrapper.fills = [{ type: "SOLID", color: { r: 0.953, g: 0.957, b: 0.965 } }];
wrapper.primaryAxisAlignItems = "MIN";
wrapper.counterAxisAlignItems = "MIN";
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

// 4. Content area
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

// 5. Welcome banner card
const banner = figma.createAutoLayout("VERTICAL");
banner.name = "Banner";
banner.fills = [{ type: "SOLID", color: { r: 0.016, g: 0.600, b: 0.894 } }];
banner.cornerRadius = 16;
banner.paddingTop = 20; banner.paddingBottom = 20;
banner.paddingLeft = 20; banner.paddingRight = 20;
banner.itemSpacing = 8;
content.appendChild(banner);
banner.layoutSizingHorizontal = "FILL";

const bannerTitle = figma.createText();
bannerTitle.characters = "Xin chào, Nguyễn Văn A!";
bannerTitle.fontSize = 18;
bannerTitle.fontName = { family: "Inter", style: "Semi Bold" };
bannerTitle.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
banner.appendChild(bannerTitle);
bannerTitle.layoutSizingHorizontal = "FILL";

const bannerSub = figma.createText();
bannerSub.characters = "Hôm nay bạn có 12 công việc cần xử lý";
bannerSub.fontSize = 13;
bannerSub.fontName = { family: "Inter", style: "Regular" };
bannerSub.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1, a: 0.8 } }];
banner.appendChild(bannerSub);
bannerSub.layoutSizingHorizontal = "FILL";

// 6. Stats row
const statsRow = figma.createAutoLayout("HORIZONTAL");
statsRow.name = "Stats Row";
statsRow.fills = [];
statsRow.itemSpacing = 12;
content.appendChild(statsRow);
statsRow.layoutSizingHorizontal = "FILL";

const statsData = [
  { label: "Đơn hàng", value: "142", color: { r: 0.016, g: 0.600, b: 0.894 } },
  { label: "Doanh thu", value: "₫48M", color: { r: 0.086, g: 0.639, b: 0.290 } },
  { label: "Khách hàng", value: "38", color: { r: 0.851, g: 0.467, b: 0.024 } },
];

for (const stat of statsData) {
  const statCard = figma.createAutoLayout("VERTICAL");
  statCard.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  statCard.cornerRadius = 12;
  statCard.paddingTop = 14; statCard.paddingBottom = 14;
  statCard.paddingLeft = 12; statCard.paddingRight = 12;
  statCard.itemSpacing = 4;
  statsRow.appendChild(statCard);
  statCard.layoutSizingHorizontal = "FILL";

  const valT = figma.createText();
  valT.characters = stat.value;
  valT.fontSize = 20;
  valT.fontName = { family: "Inter", style: "Bold" };
  valT.fills = [{ type: "SOLID", color: stat.color }];
  statCard.appendChild(valT);

  const lblT = figma.createText();
  lblT.characters = stat.label;
  lblT.fontSize = 12;
  lblT.fontName = { family: "Inter", style: "Regular" };
  lblT.fills = [{ type: "SOLID", color: { r: 0.420, g: 0.447, b: 0.502 } }];
  statCard.appendChild(lblT);
}

// 7. Recent section
const recentSection = figma.createAutoLayout("VERTICAL");
recentSection.fills = [];
recentSection.itemSpacing = 0;
content.appendChild(recentSection);
recentSection.layoutSizingHorizontal = "FILL";

// Section header
const sectionHeader = figma.createAutoLayout("HORIZONTAL");
sectionHeader.fills = [];
sectionHeader.paddingTop = 4; sectionHeader.paddingBottom = 12;
sectionHeader.primaryAxisAlignItems = "SPACE_BETWEEN";
sectionHeader.counterAxisAlignItems = "CENTER";
recentSection.appendChild(sectionHeader);
sectionHeader.layoutSizingHorizontal = "FILL";

const sTitle = figma.createText();
sTitle.characters = "Gần đây";
sTitle.fontSize = 16;
sTitle.fontName = { family: "Inter", style: "Semi Bold" };
sTitle.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];
sectionHeader.appendChild(sTitle);

const seeAll = figma.createText();
seeAll.characters = "Xem thêm";
seeAll.fontSize = 13;
seeAll.fontName = { family: "Inter", style: "Medium" };
seeAll.fills = [{ type: "SOLID", color: { r: 0.016, g: 0.600, b: 0.894 } }];
sectionHeader.appendChild(seeAll);

// List items card
const listCard = figma.createAutoLayout("VERTICAL");
listCard.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
listCard.cornerRadius = 12;
listCard.itemSpacing = 0;
listCard.clipsContent = true;
recentSection.appendChild(listCard);
listCard.layoutSizingHorizontal = "FILL";

const recentItems = [
  { name: "Đơn hàng #1234", sub: "Nguyễn Văn A — ₫2,400,000", status: "Hoàn thành" },
  { name: "Đơn hàng #1235", sub: "Trần Thị B — ₫1,800,000", status: "Đang xử lý" },
  { name: "Đơn hàng #1236", sub: "Lê Văn C — ₫950,000", status: "Chờ duyệt" },
];

for (let i = 0; i < recentItems.length; i++) {
  const item = recentItems[i];
  const row = figma.createAutoLayout("HORIZONTAL");
  row.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  row.paddingLeft = 16; row.paddingRight = 16;
  row.paddingTop = 14; row.paddingBottom = 14;
  row.counterAxisAlignItems = "CENTER";
  row.itemSpacing = 12;
  if (i < recentItems.length - 1) {
    row.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
    row.strokeBottomWeight = 1;
    row.strokeAlign = "INSIDE";
  }
  listCard.appendChild(row);
  row.layoutSizingHorizontal = "FILL";

  // Avatar
  const avatarSet = await figma.importComponentSetByKeyAsync("02ccfd66c8ad8b1999e59fa4c4f0e457a1008e78");
  const av = avatarSet.children.find(c => c.name.includes("Size=40")) || avatarSet.defaultVariant;
  const avInst = av.createInstance();
  row.appendChild(avInst);

  // Text group
  const textGroup = figma.createAutoLayout("VERTICAL");
  textGroup.fills = [];
  textGroup.itemSpacing = 3;
  row.appendChild(textGroup);
  textGroup.layoutSizingHorizontal = "FILL";

  const nameT = figma.createText();
  nameT.characters = item.name;
  nameT.fontSize = 14;
  nameT.fontName = { family: "Inter", style: "Semi Bold" };
  nameT.fills = [{ type: "SOLID", color: { r: 0.067, g: 0.094, b: 0.153 } }];
  textGroup.appendChild(nameT);
  nameT.layoutSizingHorizontal = "FILL";

  const subT = figma.createText();
  subT.characters = item.sub;
  subT.fontSize = 12;
  subT.fontName = { family: "Inter", style: "Regular" };
  subT.fills = [{ type: "SOLID", color: { r: 0.420, g: 0.447, b: 0.502 } }];
  textGroup.appendChild(subT);
  subT.layoutSizingHorizontal = "FILL";
}

// 8. Tab bar
const tabBar = figma.createAutoLayout("HORIZONTAL");
tabBar.name = "Tab Bar";
tabBar.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
tabBar.resize(390, 83);
tabBar.layoutSizingHorizontal = "FIXED";
tabBar.layoutSizingVertical = "FIXED";
tabBar.primaryAxisSizingMode = "FIXED";
tabBar.counterAxisSizingMode = "FIXED";
tabBar.primaryAxisAlignItems = "SPACE_AROUND";
tabBar.counterAxisAlignItems = "MIN";
tabBar.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
tabBar.strokeTopWeight = 1;
tabBar.strokeAlign = "INSIDE";
wrapper.appendChild(tabBar);
tabBar.layoutSizingHorizontal = "FILL";

const tabs = ["Trang chủ", "Danh sách", "Thêm", "Thông báo", "Cài đặt"];
const iconSet = await figma.importComponentSetByKeyAsync("30d866c255d2558edef08b5e9967519f5c83af92");

for (let i = 0; i < tabs.length; i++) {
  const tabItem = figma.createAutoLayout("VERTICAL");
  tabItem.fills = [];
  tabItem.paddingTop = 12; tabItem.paddingBottom = 12;
  tabItem.counterAxisAlignItems = "CENTER";
  tabItem.itemSpacing = 4;
  tabBar.appendChild(tabItem);

  const icon = iconSet.children.find(c =>
    c.name.includes("Size=24") &&
    c.name.includes(i === 0 ? "Color=Brand" : "Color=Neutral") &&
    c.name.includes("Hierarchy=Primary")
  ) || iconSet.defaultVariant;
  const iconInst = icon.createInstance();
  tabItem.appendChild(iconInst);

  const tabLabel = figma.createText();
  tabLabel.characters = tabs[i];
  tabLabel.fontSize = 10;
  tabLabel.fontName = { family: "Inter", style: i === 0 ? "Medium" : "Regular" };
  tabLabel.fills = [{ type: "SOLID", color: i === 0
    ? { r: 0.016, g: 0.600, b: 0.894 }
    : { r: 0.612, g: 0.639, b: 0.686 }
  }];
  tabItem.appendChild(tabLabel);
}

return { success: true, wrapperId: wrapper.id };
```

---

## Checklist

- [ ] Status Bar (component)
- [ ] Navigation Bar (component) với title "Trang chủ"
- [ ] Welcome banner card (bg Brand, radius 16)
- [ ] Stats row: 2–3 KPI mini cards
- [ ] Section header "Gần đây" + "Xem thêm"
- [ ] List items: Avatar + tên + phụ đề (3–4 items)
- [ ] Tab bar: 4–5 tabs, active tab dùng Brand color, Icon Swap component
- [ ] Home Indicator (nếu thêm phía dưới tab bar)
