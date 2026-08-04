# Prompt: Web Table/List Screen — MDS Web App

Màn hình danh sách dạng bảng, chuẩn MDS Web. Frame 1440×900.

---

## Layout tổng thể

```
Frame: [Tên danh sách] (1440×900, HORIZONTAL)
├── Sidebar (240×900)
└── Main Content (FILL×900, VERTICAL)
    ├── Top Bar (FILL×64)
    └── Content Area (FILL×FILL, padding 24, gap 20)
        ├── Page Header (HORIZONTAL, SPACE_BETWEEN)
        │   ├── Title + Breadcrumb
        │   └── Action buttons (Add, Export...)
        ├── Filter Bar (bg white, radius 12, padding 16, HORIZONTAL, gap 12)
        │   ├── Search input (w240)
        │   ├── Chip filters (Chip Medium component)
        │   └── Button Outline (Sort/Filter)
        └── Table Container (bg white, radius 12, VERTICAL)
            ├── Table Header (h48, bg #F9FAFB, HORIZONTAL)
            ├── Table Row × N (h52, bg white, border-bottom)
            └── Pagination (h56, border-top, HORIZONTAL, SPACE_BETWEEN)
```

---

## Script mẫu — Filter Bar với Chip

```js
// Filter bar
const filterBar = figma.createAutoLayout("HORIZONTAL");
filterBar.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
filterBar.cornerRadius = 12;
filterBar.paddingTop = 12; filterBar.paddingBottom = 12;
filterBar.paddingLeft = 16; filterBar.paddingRight = 16;
filterBar.itemSpacing = 12;
filterBar.counterAxisAlignItems = "CENTER";
filterBar.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
filterBar.strokeWeight = 1;
filterBar.strokeAlign = "INSIDE";
content.appendChild(filterBar);
filterBar.layoutSizingHorizontal = "FILL";

// Search input (custom — search_design_system("Search", fileKey) nếu có component)
const searchInput = figma.createAutoLayout("HORIZONTAL");
searchInput.fills = [{ type: "SOLID", color: { r: 0.976, g: 0.980, b: 0.988 } }];
searchInput.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
searchInput.strokeWeight = 1;
searchInput.cornerRadius = 8;
searchInput.paddingLeft = 12; searchInput.paddingRight = 12;
searchInput.paddingTop = 8; searchInput.paddingBottom = 8;
searchInput.itemSpacing = 8;
searchInput.counterAxisAlignItems = "CENTER";
searchInput.resize(240, 36);
searchInput.primaryAxisSizingMode = "FIXED";
searchInput.counterAxisSizingMode = "FIXED";
filterBar.appendChild(searchInput);

const searchText = figma.createText();
searchText.characters = "Tìm kiếm...";
searchText.fontSize = 14;
searchText.fontName = { family: "Inter", style: "Regular" };
searchText.fills = [{ type: "SOLID", color: { r: 0.612, g: 0.639, b: 0.686 } }];
searchText.layoutGrow = 1;
searchInput.appendChild(searchText);

// Chip filters
const chipSet = await figma.importComponentSetByKeyAsync("42e695453334e442868c5822a88a40355048ca31");
const chipFilters = ["Tất cả", "Đang hoạt động", "Tạm dừng", "Đã đóng"];
for (let i = 0; i < chipFilters.length; i++) {
  const chipVariant = chipSet.children.find(c =>
    c.name.includes(i === 0 ? "Selected=True" : "Selected=False") &&
    c.name.includes("Style=Outline")
  ) || chipSet.defaultVariant;
  const chipInst = chipVariant.createInstance();
  filterBar.appendChild(chipInst);
}
```

---

## Script mẫu — Table

```js
const COLS = ["Tên", "Email", "Trạng thái", "Ngày tạo", "Hành động"];
const COL_WIDTHS = [200, 220, 130, 130, 120];
const TABLE_W = COL_WIDTHS.reduce((a, b) => a + b, 0) + 40; // + 2×paddingH

// Table container
const tableContainer = figma.createAutoLayout("VERTICAL");
tableContainer.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
tableContainer.cornerRadius = 12;
tableContainer.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
tableContainer.strokeWeight = 1;
tableContainer.strokeAlign = "OUTSIDE";
tableContainer.clipsContent = true;
content.appendChild(tableContainer);
tableContainer.layoutSizingHorizontal = "FILL";

// Header row
function createRow(isHeader, cells) {
  const row = figma.createAutoLayout("HORIZONTAL");
  row.fills = isHeader
    ? [{ type: "SOLID", color: { r: 0.976, g: 0.980, b: 0.988 } }]
    : [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  row.paddingLeft = 20; row.paddingRight = 20;
  row.counterAxisAlignItems = "CENTER";
  row.resize(TABLE_W, isHeader ? 48 : 52);
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "FIXED";
  if (!isHeader) {
    row.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
    row.strokeBottomWeight = 1;
    row.strokeAlign = "INSIDE";
  }

  for (let i = 0; i < cells.length; i++) {
    const cell = figma.createAutoLayout("HORIZONTAL");
    cell.fills = [];
    cell.paddingLeft = 6; cell.paddingRight = 6;
    cell.counterAxisAlignItems = "CENTER";
    cell.resize(COL_WIDTHS[i], isHeader ? 48 : 52);
    cell.primaryAxisSizingMode = "FIXED";
    cell.counterAxisSizingMode = "FIXED";
    row.appendChild(cell);

    const t = figma.createText();
    t.characters = cells[i];
    t.fontSize = isHeader ? 13 : 14;
    t.fontName = { family: "Inter", style: isHeader ? "Medium" : "Regular" };
    t.fills = [{ type: "SOLID", color: isHeader
      ? { r: 0.420, g: 0.447, b: 0.502 }
      : { r: 0.067, g: 0.094, b: 0.153 }
    }];
    cell.appendChild(t);
  }
  return row;
}

tableContainer.appendChild(createRow(true, COLS));

// 5 data rows
const mockRows = [
  ["Nguyễn Văn A", "vana@misa.com.vn", "Hoạt động", "14/05/2026", "···"],
  ["Trần Thị B", "thib@misa.com.vn", "Hoạt động", "13/05/2026", "···"],
  ["Lê Văn C", "vanc@misa.com.vn", "Tạm dừng", "12/05/2026", "···"],
  ["Phạm Thị D", "thid@misa.com.vn", "Hoạt động", "11/05/2026", "···"],
  ["Hoàng Văn E", "vane@misa.com.vn", "Đã đóng", "10/05/2026", "···"],
];
for (const row of mockRows) tableContainer.appendChild(createRow(false, row));

// Pagination
const pagination = figma.createAutoLayout("HORIZONTAL");
pagination.fills = [];
pagination.paddingLeft = 20; pagination.paddingRight = 20;
pagination.resize(TABLE_W, 56);
pagination.primaryAxisSizingMode = "FIXED";
pagination.counterAxisSizingMode = "FIXED";
pagination.primaryAxisAlignItems = "SPACE_BETWEEN";
pagination.counterAxisAlignItems = "CENTER";
pagination.strokes = [{ type: "SOLID", color: { r: 0.898, g: 0.906, b: 0.922 } }];
pagination.strokeTopWeight = 1;
pagination.strokeAlign = "INSIDE";
tableContainer.appendChild(pagination);

const pageInfo = figma.createText();
pageInfo.characters = "Hiển thị 1–5 trong 124 kết quả";
pageInfo.fontSize = 13;
pageInfo.fontName = { family: "Inter", style: "Regular" };
pageInfo.fills = [{ type: "SOLID", color: { r: 0.420, g: 0.447, b: 0.502 } }];
pagination.appendChild(pageInfo);

// Prev/Next buttons
const btnSmSet = await figma.importComponentSetByKeyAsync("4d3f1adf2e8ae2e51f574ef247a6a8847278e503");
const paginationBtns = figma.createAutoLayout("HORIZONTAL");
paginationBtns.fills = [];
paginationBtns.itemSpacing = 8;
pagination.appendChild(paginationBtns);

for (const label of ["← Trước", "Sau →"]) {
  const btnV = btnSmSet.children.find(c =>
    c.name.includes("Color=Gray") && c.name.includes("Style=Outline")
  ) || btnSmSet.defaultVariant;
  const b = btnV.createInstance();
  paginationBtns.appendChild(b);
}
```

---

## Checklist

- [ ] Page header: title + breadcrumb + action buttons
- [ ] Filter bar: search + chip filters + sort button
- [ ] Table header row (bg #F9FAFB, Medium 13, text secondary)
- [ ] 5–8 data rows với mock data
- [ ] Status badge trong cột trạng thái (createStatusBadge từ screen-patterns.md)
- [ ] Pagination: info text + prev/next buttons (Button Small Outline)
- [ ] Empty state (Empty State component nếu không có dữ liệu)
