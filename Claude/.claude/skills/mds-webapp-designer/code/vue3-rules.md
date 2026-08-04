# Vue 3 Code Rules — MDS Web App

> Áp dụng khi task là **build/sửa code Vue 3 app**. Đọc file này TRƯỚC khi viết bất kỳ dòng HTML nào.

---

## BƯỚC 1 — INVENTORY TRƯỚC KHI VIẾT BẤT KỲ DÒNG HTML NÀO

```
Glob *.vue → D:\Figma\mds-ui\src\components\
```
→ Đọc kết quả. Với MỖI UI element cần dùng (header, sidebar, table, pagination, input...) phải tìm component tương ứng, **đọc file đó để hiểu TOÀN BỘ props/slots/emits** — không được đoán mò hay tự bịa prop.

---

## Props/Slots cốt lõi — PHẢI nắm trước khi dùng

| Component | Props/slots phải nắm |
|-----------|----------------------|
| `DataTable.vue` | `:row-actions` (hover-only), `v-model:selected`, `@row-click`; column types: `avatar-text`→`{text}`, `tag`→`[{label,color}]`, `status`→`{label,color}`; checkbox col: `{key:'_cb',type:'checkbox',width:40,noFilter:true}` — **KHÔNG dùng `type:'action-icon'`**; **`@click.stop` phải đặt trên `<div>` bọc ngoài AppCheckbox, KHÔNG đặt thẳng trên AppCheckbox** |
| `AppPagination.vue` | `:total`, `v-model:current-page`, `v-model:page-size` — **KHÔNG truyền `:sums`**. Component tự hiện range `1-10 / total`. |
| `TableHeader.vue` | `:main-function-button`, `:bulk-action="selected.length > 0"`, `:selected-count="selected.length"`, `@deselect-all`, slot `#filters`, slot `#main-buttons`, slot `#bulk-buttons` — wrapper `.th-wrapper` chỉ cần `padding:0`, **KHÔNG thêm `border-bottom`** (DataTable `.dt-row--header` đã có `border-top` rồi) |
| `AppDatebox.vue` | `v-model`, `:type` (date/datetime-local/time) — component tự có icon bên trái; **KHÔNG thêm icon thủ công** |
| `ControlHeader.vue` | `:app-name`, `:app-tag`, `:no-meta` (ẩn branch/company khi true) |
| `AppCombobox.vue` | `:options=[{value,label}]`, `:multiple`, `v-model` |
| `AppSidebar.vue` | `:items=[{id,label,icon}]`, `:active-id`, `@nav` |

---

## BƯỚC 2 — NGUYÊN TẮC

- Component có trong `mds-ui` → **IMPORT VÀ DÙNG**, tuyệt đối không tự viết HTML thay thế.
- Không có → **BỎ TRỐNG**, hỏi user trước khi tự build.
- **NGHIÊM CẤM** viết custom `<header>`, `<button>`, `.card`, table thủ công khi đã có component chuẩn.

### Components bắt buộc phải dùng (không được tự vẽ)

| Element | Component | File |
|---------|-----------|------|
| Global Header | `ControlHeader` | `ControlHeader.vue` — props: `app-name`, `app-tag`, `:no-meta="true"` (ẩn branch) |
| Sidebar | `AppSidebar` | `AppSidebar.vue` |
| Bảng dữ liệu | `DataTable` | `DataTable.vue` |
| Table toolbar | `TableHeader` | `TableHeader.vue` |
| Phân trang | `AppPagination` | `AppPagination.vue` |
| Button | `AppButton` | `AppButton.vue` |
| Input text | `AppTextbox` | `AppTextbox.vue` |
| Combobox/Select | `AppCombobox` | `AppCombobox.vue` |
| Number input | `AppNumberbox` | `AppNumberbox.vue` |
| Date input | `AppDatebox` | `AppDatebox.vue` |
| Textarea | `AppTextarea` | `AppTextarea.vue` |
| Icon | `TIcon` | `TIcon.vue` |
| Form label wrapper | `AppInput` | `AppInput.vue` |

---

## Theme init — bắt buộc trong App.vue

```js
import { applyTheme } from '@mds/theme.js'
if (!localStorage.getItem('mds-theme')) applyTheme('pink') // đổi màu phù hợp
else applyTheme(localStorage.getItem('mds-theme'))
```

---

## ⛔ CHECKLIST BẮT BUỘC — SAI LỖI LẶP LẠI NHIỀU LẦN

> **Phải kiểm tra TOÀN BỘ checklist này trước khi submit mọi page/component.**

| # | Kiểm tra | ✅ Đúng | ❌ Sai hay mắc |
|---|----------|---------|----------------|
| 1 | **Action buttons trên DataTable** | `:row-actions="[{icon,emit,title,danger}]"` — hiện khi hover | `type:'action-icon'` trong columns — luôn hiện hết |
| 1b | **Checkbox trong DataTable body** | `<div @click.stop><AppCheckbox .../></div>` — wrapper chặn click | `@click.stop` thẳng trên AppCheckbox — chặn luôn change event |
| 2 | **AppButton trong TableHeader #main-buttons** | Không ghi `size` (= md = 32px) | `size="sm"` → 28px, thấp hơn search/filter/icon-button 4px |
| 3 | **Global Header** | `<ControlHeader app-name="..." :no-meta="true" />` | Tự viết `<header>` HTML thủ công |
| 4 | **Padding danh sách** | `margin: 16px` cho `.table-panel`; `padding: 0 16px` cho `.page-header` / `.tab-area` | Tự chọn 20px hoặc số khác |
| 5 | **`.th-wrapper`** | Chỉ `padding: 0` — DataTable header row đã có `border-top` tự tạo separator | Thêm `border-bottom` → double line; thêm padding ngang → double padding |
| 6 | **Danh sách CÓ tab** | Không có `.page-header`; tab ngay trên cùng; `:main-function-button="true"` + `#main-buttons` trong TableHeader | Đặt `.page-header` + tab bên dưới |
| 6b | **Danh sách KHÔNG có tab** | Có `.page-header` với Primary Button; TableHeader **không có** `:main-function-button` và không có `#main-buttons` | Để `:main-function-button="true"` → nút xuất hiện 2 lần |
| 7 | **DataTable column type avatar-text** | `{ text: row.name }` — object `{ text }` | Dùng `render:` function hoặc truyền string thẳng |
| 8 | **DataTable column type tag** | `[{ label, color }]` — mảng objects | Dùng `render:` function |
| 9 | **Sidebar icon** | Icon phải có trong MAP của `TIcon.vue` — thêm module = thêm icon ngay | Dùng icon tên tự đặt → TIcon render rỗng |
| 10 | **AppPagination** | Chỉ truyền `:total`, `v-model:current-page`, `v-model:page-size` | Thêm `:sums="[{label:'Tổng...', value:...}]"` tự bịa |
| 11 | **vite build** | Chạy `npm run build` trước khi báo xong | Chỉ check dev server, không build |
| 12 | **Màu text trung tính** | `var(--text-primary)` nội dung chính; `var(--text-secondary)` label phụ/caption/meta; `var(--text-hint)` **CHỈ** cho placeholder bên trong control (input, select, textarea) | Dùng `--text-hint` cho section label, breadcrumb, header → phải dùng `--text-secondary`; hoặc hardcode hex |
| 13 | **Spacing & sizing — bội số 4** | Mọi `width`, `height`, `padding`, `margin`, `gap`, `border-radius` phải là bội số của 4 (4, 8, 12, 16, 20, 24, 28, 32…) | Dùng số lẻ như 3px, 5px, 6px, 10px, 14px, 22px — trừ `font-size` được dùng giá trị tự do |
| 15 | **Text giá trị đã chọn/đã điền** | Mọi giá trị sau khi được chọn/điền (ngày, tên người, trạng thái, tag…) phải dùng `var(--text-primary)` | Dùng `--text-secondary` hay `--text-hint` cho giá trị đã có — chỉ dùng secondary/hint cho placeholder và label phụ |
| 14 | **Trạng thái hoàn thành (done)** | Checkbox/circle done: **nền fill success** (`#16a34a`), **icon `check` stroke-width 2.5 màu trắng**; text done: **`text-decoration:line-through`** + **giữ `--text-primary`** (không đổi sang secondary) | Dùng nền nhạt (`#dcfce7`), icon màu xanh, icon `circle-check`, hoặc đổi text sang secondary khi done |
| 16 | **Card / panel styling** | Chỉ dùng `box-shadow: var(--shadow-card)` — **KHÔNG** thêm `border` | Thêm `border: 1px solid var(--stroke-neutral-light)` → double visual cue, không đúng design system |
| 17 | **Sidebar label dài** | Thêm `overflow: hidden; text-overflow: ellipsis` trên `.sidebar-item__label`; tooltip qua `:title` trên button | Text tràn ra ngoài sidebar khi expanded |
| 18 | **Sidebar CSS** | Dùng classes có sẵn: `sidebar-host`, `sidebar`, `sidebar-inner`, `sidebar-nav`, `sidebar-item`, `sidebar-item__label`, `btn-collapse` từ mds-ui; chỉ thêm CSS cho phần mở rộng (group label, badge) | Tự viết `.c360-sidebar`, `.sb-item`, `.sb-nav` riêng — icon lệch, font-size sai, expand/collapse sai |

---

## Design Tokens — màu chữ trung tính

> ⛔ **TUYỆT ĐỐI không tự đặt màu chữ bằng hex hoặc rgba.** Chỉ dùng 4 biến dưới đây.

| Biến | Giá trị | Khi dùng |
|------|---------|----------|
| `var(--text-primary)` | `#10141b` | Nội dung chính, tiêu đề, label input |
| `var(--text-secondary)` | `#6b707a` | Nhãn phụ, supporting text, icon label, ngày tháng |
| `var(--text-hint)` | `#9da2ac` | Placeholder của input/field chưa điền |
| `var(--text-disabled)` | `#9da2ac` | Text bị disabled (control bị khóa) |

## Neutral Color Scale — `--neutral-*`

> Dùng cho nền panel, footer, divider, border. KHÔNG dùng cho text (dùng `--text-*`).

| Token | Hex | Tương đương |
|-------|-----|-------------|
| `--neutral-50`  | `#fbfbfc` | Nền app rất nhạt |
| `--neutral-100` | `#f7f7f8` | Nền footer, panel phụ (như `--bg-neutral-light` nhạt hơn) |
| `--neutral-150` | `#f2f2f4` | = `--bg-neutral-light` |
| `--neutral-200` | `#ecedef` | = `--bg-neutral-hover`, `--bg-page` |
| `--neutral-250` | `#e6e7ea` | Border nhẹ |
| `--neutral-300` | `#e9eaeb` | = `--stroke-neutral-light`, `--stroke-divider` |
| `--neutral-350` | `#d7dade` | Border rõ hơn |
| `--neutral-400` | `#ced1d6` | = `--stroke-neutral` |
| `--neutral-500` | `#9da2ac` | = `--text-hint`, `--text-disabled` |
| `--neutral-600` | `#8f949d` | Icon phụ |
| `--neutral-700` | `#6b707a` | = `--text-secondary` |
| `--neutral-800` | `#484e59` | Text đậm phụ |
| `--neutral-900` | `#303642` | Text tối |
| `--neutral-950` | `#10141b` | = `--text-primary` |

**⚠️ Phân biệt `hint` vs `secondary` — hay mắc nhất:**
- `text-hint` → **CHỈ** cho `::placeholder` hoặc text hiển thị bên trong control khi chưa có giá trị
- `text-secondary` → mọi text phụ/mờ còn lại: section label, caption, breadcrumb, date, subtitle, icon label, column header phụ

**⚠️ AI_Primary — KHÔNG phải solid color, là gradient:**
```css
/* Text dùng gradient clip */
background: linear-gradient(98deg, #1482ff 8.87%, #cf11ff 100%);
-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;

/* Border/stroke: double background technique — CHUẨN, không artifact, border đều tuyệt đối */
.ai-input {
  border: 1px solid transparent;
  border-radius: 8px;
  background-image: linear-gradient(var(--bg-white), var(--bg-white)),
                    linear-gradient(98deg, #1482ff 8.87%, #cf11ff 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}
/* Giải thích: layer 1 (white) clip vào padding-box che phần giữa,
   layer 2 (gradient) clip vào border-box, chỉ phần viền 1px lộ gradient.
   Browser dùng border thật nên đều 4 cạnh — không dùng pseudo-element. */
```
⛔ KHÔNG dùng `var(--text-ai)` hay `var(--stroke-ai)` làm solid color cho AI elements — phải dùng gradient.
⛔ KHÔNG dùng wrapper padding hay ::after mask technique cho gradient border — không đều, có artifact.
