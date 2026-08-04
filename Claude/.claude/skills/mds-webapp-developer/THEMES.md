# MDS Web Components v2.0 — Theme Variants

Giá trị màu đọc trực tiếp từ Figma `🎨 Themes` collection, node `23274:37787`.  
**NGHIÊM CẤM tự tính toán / sinh ra bất kỳ giá trị nào không có trong bảng này.**

---

## Cách dùng

Thêm `[data-theme="tên-theme"]` vào thẻ `<html>` hoặc root container:

```html
<html data-theme="teal">
```

Rồi override CSS variables trong `:root[data-theme="..."]`.

---

## Bảng màu brand theo từng theme

| Theme      | `--bg-brand` | `--bg-brand-light` | `--text-brand` | `--text-link` | `--icon-brand` | `--stroke-brand` |
|------------|-------------|-------------------|---------------|--------------|---------------|-----------------|
| **blue** *(default)* | `:root` | `:root` | `:root` | `:root` | `:root` | `:root` |
| **green**  | `#0e9a62` | `#e6f5ef` | `#0e9a62` | `#0e9a62` | `#0e9a62` | `#0e9a62` |
| **blue-gray** | `#4e5ba6` | `#fcfcfd` | `#4e5ba6` | `#1570ef` | `#4e5ba6` | `#4e5ba6` |
| **teal**   | `#0e9384` | `#f0fdfa` | `#0e9384` | `#0e9384` | `#0e9384` | `#0e9384` |
| **cyan**   | `#00a2cf` | `#f0fbff` | `#00a2cf` | `#00a2cf` | `#00a2cf` | `#00a2cf` |
| **indigo** | `#4155f5` | `#ecf4ff` | `#4155f5` | `#4155f5` | `#4155f5` | `#4155f5` |
| **purple** | `#744ec7` | `#f7f5fd` | `#744ec7` | `#744ec7` | `#744ec7` | `#744ec7` |
| **pink**   | `#c64691` | `#fcf3f9` | `#c64691` | `#c64691` | `#c64691` | `#c64691` |
| **red**    | `#c34266` | `#fbf4f7` | `#c34266` | `#c34266` | `#c34266` | `#c34266` |
| **orange** | `#ea580c` | `#fff7ed` | `#ea580c` | `#ea580c` | `#ea580c` | `#ea580c` |

> **Chú ý:** `--bg-brand-hover`, `--bg-brand-disable`, `--stroke-brand-light` chưa đọc được từ Figma cho tất cả theme.  
> Khi cần, đọc từ node Figma với theme đó đang active → KHÔNG tự tính.

---

## CSS Override template

```css
/* Paste vào :root hoặc dùng [data-theme] selector */

:root[data-theme="green"] {
  --bg-brand:       #0e9a62;
  --bg-brand-light: #e6f5ef;
  --text-brand:     #0e9a62;
  --text-link:      #0e9a62;
  --icon-brand:     #0e9a62;
  --stroke-brand:   #0e9a62;
}

:root[data-theme="blue-gray"] {
  --bg-brand:       #4e5ba6;
  --bg-brand-light: #fcfcfd;
  --text-brand:     #4e5ba6;
  --text-link:      #1570ef;
  --icon-brand:     #4e5ba6;
  --stroke-brand:   #4e5ba6;
}

:root[data-theme="teal"] {
  --bg-brand:       #0e9384;
  --bg-brand-light: #f0fdfa;
  --text-brand:     #0e9384;
  --text-link:      #0e9384;
  --icon-brand:     #0e9384;
  --stroke-brand:   #0e9384;
}

:root[data-theme="cyan"] {
  --bg-brand:       #00a2cf;
  --bg-brand-light: #f0fbff;
  --text-brand:     #00a2cf;
  --text-link:      #00a2cf;
  --icon-brand:     #00a2cf;
  --stroke-brand:   #00a2cf;
}

:root[data-theme="indigo"] {
  --bg-brand:       #4155f5;
  --bg-brand-light: #ecf4ff;
  --text-brand:     #4155f5;
  --text-link:      #4155f5;
  --icon-brand:     #4155f5;
  --stroke-brand:   #4155f5;
}

:root[data-theme="purple"] {
  --bg-brand:       #744ec7;
  --bg-brand-light: #f7f5fd;
  --text-brand:     #744ec7;
  --text-link:      #744ec7;
  --icon-brand:     #744ec7;
  --stroke-brand:   #744ec7;
}

:root[data-theme="pink"] {
  --bg-brand:       #c64691;
  --bg-brand-light: #fcf3f9;
  --text-brand:     #c64691;
  --text-link:      #c64691;
  --icon-brand:     #c64691;
  --stroke-brand:   #c64691;
}

:root[data-theme="red"] {
  --bg-brand:       #c34266;
  --bg-brand-light: #fbf4f7;
  --text-brand:     #c34266;
  --text-link:      #c34266;
  --icon-brand:     #c34266;
  --stroke-brand:   #c34266;
}

:root[data-theme="orange"] {
  --bg-brand:       #ea580c;
  --bg-brand-light: #fff7ed;
  --text-brand:     #ea580c;
  --text-link:      #ea580c;
  --icon-brand:     #ea580c;
  --stroke-brand:   #ea580c;
}
```
