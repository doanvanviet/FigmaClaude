# MDS Web App Developer

Skill build UI **Vue.js + HTML/CSS** theo chuẩn design system **MDS Web Components v2.0**.

> Skill này tách biệt hoàn toàn khỏi Figma. Dùng khi prompt build thẳng ra HTML/CSS/Vue — không cần mở Figma.

**MANDATORY — Load ngay khi bắt đầu:**
- [vue-controls.md](references/vue-controls.md) — Danh sách Vue components, button classes, datatable structure, master-detail layout đã được duyệt. Đọc trước khi code bất kỳ màn hình nào.
- [LIST-PAGE.md](LIST-PAGE.md) — Layout pattern màn hình danh sách.
- [echarts-dashboard.md](references/echarts-dashboard.md) — ECharts patterns chuẩn hóa: line, bar, cashflow, donut; gradient palette, dark mode, tooltip preset, lifecycle management. Đọc khi build màn hình dashboard có biểu đồ.
- [widget-grid.md](references/widget-grid.md) — Widget grid kéo thả: 24-col square cells, edit mode, drag & drop với offset chuột, push-aside, resize handle, ghost tile, CSS states & animations. Đọc khi build dashboard có widget tùy chỉnh.
- [drag-drop.md](references/drag-drop.md) — Kanban card drag & drop: ghost placeholder đẩy card, chống jitter, setTimeout trick, pointer-events none, 4 state bắt buộc. Đọc khi build bất kỳ giao diện kéo thả card/item nào.
- [viewport-scroll.md](references/viewport-scroll.md) — **VIEWPORT MIN-WIDTH SCROLL**: Khi toàn bộ trang (header+sidebar+content) cần scroll ngang ở cấp viewport thay vì responsive. 3 rules bắt buộc (html/body/app-shell), CSS variable cho resizable panel. Đọc khi app cần min-width cứng không co giao diện.

---

## 🔴 LUỒNG BẮT BUỘC — CHẠY TRƯỚC KHI VIẾT BẤT KỲ DÒNG CODE NÀO

> Đây là bước PRE-FLIGHT. Không được skip dù yêu cầu đơn giản hay có ảnh mockup rõ ràng.

```
╔══════════════════════════════════════════════════════════╗
║  Nhận yêu cầu vẽ màn hình / component / UI element      ║
╚══════════════════════════════════════════════════════════╝
                          ↓
╔══════════════════════════════════════════════════════════╗
║  BƯỚC 1 — Đọc vue-controls.md                           ║
║  Xác định toàn bộ UI elements cần dùng trong màn hình   ║
╚══════════════════════════════════════════════════════════╝
                          ↓
╔══════════════════════════════════════════════════════════╗
║  BƯỚC 2 — Với MỖI element, hỏi: "Có trong danh sách     ║
║  vue-controls.md chưa?"                                  ║
╚══════════════════════════════════════════════════════════╝
           ↙ CÓ                              ↘ CHƯA CÓ
╔═══════════════════╗              ╔═══════════════════════╗
║  BÊ NGUYÊN ra     ║              ║  DỪNG — ĐỂ TRỐNG      ║
║  CHỈ thay         ║              ║  Báo user: "Chưa có   ║
║  text/label/data  ║              ║  [tên element] trong  ║
╚═══════════════════╝              ║  danh sách. Cần bổ    ║
                                   ║  sung trước."         ║
                                   ╚═══════════════════════╝
```

**⛔ NGHIÊM CẤM tuyệt đối:**
- Tự vẽ HTML/CSS cho element đã có trong vue-controls.md (dù "sửa cho nhanh")
- Tự vẽ element chưa có khi chưa được user cho phép tường minh
- Dùng ảnh mockup / Figma làm lý do để bỏ qua danh sách đã duyệt
- Thêm prop/slot/CSS override lên component gốc để "bổ sung tính năng"

**✓ Chỉ được phép xây control mới khi:**
1. User xác nhận tường minh "hãy build control mới" hoặc cung cấp Figma link
2. Control đó thực sự KHÔNG CÓ trong vue-controls.md (đã kiểm tra kỹ)
3. Sau khi build xong và được duyệt → cập nhật ngay vào vue-controls.md

---

## ⛔ QUY TẮC BẮT BUỘC TUYỆT ĐỐI

```
1. CHỈ dùng token màu, spacing, radius, typography từ file này.
   NGHIÊM CẤM hardcode hex màu, px tùy ý ngoài bảng token.

2. MỌI component PHẢI dùng đúng class/token tương ứng với MDS design.
   Không được tự đặt tên class random.

3. Đọc kỹ input trước khi viết code — không tự đoán label, tên field, cột bảng.

4. Output phải là code chạy được ngay — không để placeholder "//TODO" hay "..."

5. Vue component: dùng Composition API (<script setup>) trừ khi user yêu cầu Options API.

6. Sau khi viết xong: đối chiếu lại checklist cuối file trước khi trả kết quả.

7. CARD/PANEL trắng trên nền --bg-page: PHẢI dùng box-shadow: var(--shadow-card).
   ⛔ NGHIÊM CẤM TUYỆT ĐỐI dùng border để tạo viền cho card/panel nền trắng đặt trên nền xám (--bg-page).
   Áp dụng với MỌI loại card: .card, .tnm-hero, .tnm-grid3-card, .tnm-alt-row, stat card, KPI card, và bất kỳ block nền trắng nào trên nền xám.
   PRE-SUBMIT SCAN: trước khi trả code, bắt buộc grep toàn bộ style block — nếu thấy bất kỳ selector nào vừa có background: var(--bg-white) vừa có border: ... → XÓA border đó ngay.
   TIÊU ĐỀ CARD — phân biệt theo loại card:
   • Scorecard / KPI card (nhỏ, chỉ hiện 1 chỉ số): tiêu đề font-size: var(--text-body) 13px; font-weight: var(--fw-semibold); color: var(--text-secondary). Số value: font-size: var(--text-h2) 20px; font-weight: var(--fw-bold); color: var(--text-primary).
   • Card lớn (biểu đồ, danh sách, bảng, nội dung phong phú): tiêu đề PHẢI dùng H3 — font-size: var(--text-h3) 16px; font-weight: var(--fw-semibold); line-height: var(--text-h3-lh); color: var(--text-primary).
   NGHIÊM CẤM nhầm lẫn giữa hai loại: Scorecard KHÔNG dùng H3 cho title, Card lớn KHÔNG dùng 13px cho title.

8. FONT CHỮ: LUÔN LUÔN CHỈ dùng Inter Variable (InterVariable) — NGHIÊM CẤM TUYỆT ĐỐI dùng bất kỳ font nào khác.
   ⛔ NGHIÊM CẤM: Arial, Helvetica, system-ui, Segoe UI, Roboto, Google Fonts, hay bất kỳ font nào ngoài Inter.
   ⛔ NGHIÊM CẤM: hardcode font-family trực tiếp trong code — chỉ được dùng var(--font-family).
   ✓ Font self-hosted trong mds-ui/src/fonts/ — KHÔNG cần CDN, KHÔNG cần thêm <link> vào index.html.
   CSS var: --font-family: InterVariable, 'Inter var', sans-serif;
   Tên font-family đúng (v4.1): InterVariable  (KHÔNG dùng 'Inter var', KHÔNG dùng 'Inter')
   body phải có: font-optical-sizing: auto; font-feature-settings: 'liga' 1,'calt' 1,'cv02','cv03','cv04','cv11'; -webkit-font-smoothing: antialiased;
   Cho JavaScript/ECharts: const FONT = 'InterVariable, "Inter var", sans-serif' — KHÔNG ĐƯỢC thay bằng bất kỳ font nào khác.
   ⚠️ VITE DEV SERVER: Font file nằm trong mds-ui/src/fonts/ (ngoài project root) — bắt buộc thêm fs.allow vào vite.config.js:
     server: { fs: { allow: [path.resolve(__dirname, '..')] } }
   Thiếu dòng này → Vite chặn font file → browser fallback sang Arial.

9. BIỂU ĐỒ: CHỈ dùng Apache ECharts (https://echarts.apache.org/examples).
   CDN: <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
   NGHIÊM CẤM dùng Chart.js, D3, Recharts hay bất kỳ thư viện chart nào khác.
   - Container là <div> (không phải <canvas>), phải có width/height tường minh.
   - Màu sắc đọc từ CSS variable qua cssVar() helper, KHÔNG hardcode hex trong setOption().
   - Khởi tạo lazy khi panel/tab hiển thị, gọi chart.resize() khi window resize.

9. MÀU SẮC THEME: MỌI giá trị màu PHẢI lấy từ file THEMES.md (cùng thư mục — đã cache sẵn từ Figma).
   NGHIÊM CẤM tự tính toán / sinh ra hover, disable, pressed, light từ màu gốc.
   NGHIÊM CẤM lên Figma đọc lại khi đã có trong THEMES.md.
   Ví dụ SAI: lấy #0e9384 rồi tự tối hơn 10% để làm hover, hoặc gọi Figma MCP để lấy màu đã có sẵn.
   Ví dụ ĐÚNG: mở THEMES.md → copy đúng giá trị → paste vào code.
   Nếu biến cần chưa có trong THEMES.md → hỏi user bổ sung, KHÔNG tự bịa.
   → Xem toàn bộ 10 theme và CSS override template tại: THEMES.md (cùng thư mục)

10. BORDER-RADIUS THEO DENSITY MODE:
    • Compact  (data-density="compact"):              border-radius: var(--radius-inner)   = 6px
    • Medium   (mặc định, không có data-density):    border-radius: var(--radius-default) = 8px
    • Comfortable (data-density="comfortable"):       border-radius: var(--radius-default) = 8px
    Áp dụng cho MỌI control: input, button, card, combobox, datebox, tag, badge, dropdown, panel...
    CSS override chuẩn cho compact:
    ```css
    :root[data-density="compact"] .ibox,
    :root[data-density="compact"] .btn,
    :root[data-density="compact"] .card { border-radius: var(--radius-inner) !important; }
    ```
    NGHIÊM CẤM hardcode 6px hay 8px — luôn dùng token --radius-inner / --radius-default.

11. MÀU TEXT TRUNG TÍNH — chỉ có 3 loại, KHÔNG ĐƯỢC tự sinh mã hex từ bất kỳ nguồn nào:
    • Text Primary   = var(--text-primary)   → heading, nội dung chính, label, title, body text
    • Text Secondary = var(--text-secondary) → mô tả phụ, metadata, ngày tháng, lượt xem, caption
    • Text Hint      = var(--text-hint)      → placeholder trong input, watermark
    NGHIÊM CẤM đọc màu từ ảnh/Figma/screenshot rồi hardcode hex vào color text.

12. CONTROLS & LAYOUT: CHỈ dùng components và patterns đã được duyệt trong vue-controls.md.
    NGHIÊM CẤM tự thi công control mới khi chưa được phép — dù ảnh mockup hay Figma mô tả khác đi.
    Thiếu control → bỏ trống, báo user. Xem đầy đủ tại: references/vue-controls.md

11. MÀU TEXT TRUNG TÍNH — chỉ có 3 loại, KHÔNG ĐƯỢC tự sinh mã hex từ bất kỳ nguồn nào:
    • Text Primary   = var(--text-primary)   → heading, nội dung chính, label, title, body text
    • Text Secondary = var(--text-secondary) → mô tả phụ, metadata, ngày tháng, lượt xem, caption
    • Text Hint      = var(--text-hint)      → placeholder trong input, watermark
    NGHIÊM CẤM đọc màu từ ảnh/Figma/screenshot rồi hardcode hex vào color text.
    NGHIÊM CẤM dùng token màu khác (brand, accent, success, warning...) cho text trung tính.
    NGHIÊM CẤM tự ý sinh màu trung tính thứ 4 ngoài 3 loại trên.
    Ngoại lệ DUY NHẤT: user cung cấp đúng hex và yêu cầu rõ ràng → mới được dùng hex đó.

12. ⛔ FORBIDDEN PATTERNS — CẤM TUYỆT ĐỐI VIẾT CÁC PATTERN SAU TRONG CODE NGƯỜI DÙNG:

    Bảng "nếu mày nghĩ X → phải dùng Y":

    | ❌ NGHIÊM CẤM viết thủ công | ✅ PHẢI dùng component | Lý do |
    |---|---|---|
    | `<input class="ibox__native"` | `<AppTextbox>` | AppTextbox đã xử lý đúng |
    | `<select class="ibox__native` | `<AppCombobox>` | AppCombobox tự render chevron |
    | `<button class="ibox__icon ibox__icon--action"` | không tồn tại độc lập — nằm trong App* | icon-action button chỉ được render bởi AppTextbox/AppCombobox nội bộ |
    | `<i class="ti ti-` | `<TIcon name="...">` | Font icon không được load — chỉ TIcon SVG hoạt động |
    | `class="ibox__icon--action"` trên button do user viết | N/A | Button ngoài App* → dùng `btn-icon btn-icon--outline` |
    | `type="text" v-model` trong raw `<input>` | `<AppTextbox v-model>` | |
    | `type="number"` trong raw `<input>` (standalone) | `<AppNumberbox v-model>` | |
    | `type="date"` trong raw `<input>` | `<AppDatebox v-model>` | |
    | `<textarea class=` | `<AppTextarea v-model>` | |
    | `type="text" placeholder="Tìm"` kèm icon search | `<AppSearchbox v-model>` | |

    **Trường hợp được phép dùng raw ibox (không thay bằng App*):**
    - Composite control: label text + input + separator + text label (VD: "Kèm theo N chứng từ gốc") — KHÔNG có component nào cover case này
    - Inline currency selector trong tab bar: ibox wrap {label + select + TIcon chevron} — native select, TIcon là span không phải button
    - Trong nội bộ chính các AppXxx component (mds-ui source) — đương nhiên

    **PRE-SUBMIT SCAN — trước khi trả code, grep ngay trong file vừa viết:**
    ```
    Grep cho: ibox__native   → nếu thấy → thay bằng App*
    Grep cho: ibox__icon--action → nếu thấy → chỉ hợp lệ trong App* source, không trong user code
    Grep cho: <i class="ti  → nếu thấy → thay bằng <TIcon name="...">
    Grep cho: <input type=  → nếu thấy ngoài composite ibox → thay bằng App*
    ```

11. QUY TRÌNH BẮT BUỘC KHI NHẬN YÊU CẦU VẼ MÀN HÌNH:
    BƯỚC 1 — Xác định loại màn hình: danh sách / form / dashboard / detail...
    BƯỚC 2 — Glob mds-ui/src/components/*.vue để liệt kê toàn bộ components hiện có.
    BƯỚC 3 — Với mỗi vùng UI: lấy component tương ứng từ mds-ui, BÊ NGUYÊN vào, CHỈ thay đổi text/label/data theo yêu cầu.
    BƯỚC 4 — Vùng nào không có component phù hợp → ĐỂ TRỐNG, liệt kê cho user biết. KHÔNG tự vẽ HTML thay thế.
    ⛔ NGHIÊM CẤM: Thêm slot/prop/CSS không có trong component gốc để "bổ sung tính năng".
    ⛔ NGHIÊM CẤM: Dùng :deep() hay scoped CSS để override built-in của component.
    ⛔ NGHIÊM CẤM: Tự ý cập nhật skill/vue-controls.md trừ khi user yêu cầu tường minh.
    ✓ Mỗi component luôn lấy trạng thái/variant mặc định (default) khi không có yêu cầu cụ thể.
    ✓ User sẽ tự prompt thêm cho từng app — không đoán trước hay bổ sung ngoài yêu cầu.
```

---

## 1. CSS DESIGN TOKENS — COPY VÀO `:root`

```css
:root {
  /* ── COLORS ── */
  /* ── TEXT ── */
  /* Neutral */
  --text-primary:          #101828;
  --text-secondary:        #717680;
  --text-hint:             #a4a7ae;
  --text-disabled:         #cecfd2;
  --text-white:            #ffffff;
  --text-white-disabled:   rgba(255,255,255,0.70);
  /* Brand (Blue mode mặc định — override khi dùng theme khác) */
  --text-brand:            #245fdf;
  --text-link:             #245fdf;
  /* Semantic */
  --text-danger:           #f04438;
  --text-warning:          #f79009;
  --text-success:          #12b76a;
  --text-info:             #0ba5ec;
  --text-accent:           #7a5af8;

  /* ── ICON ── */
  --icon-neutral:          #6b707a;
  --icon-neutral-disabled: #d5d7da;
  --icon-brand:            #245fdf;
  --icon-white:            #ffffff;
  --icon-white-disabled:   rgba(255,255,255,0.70);
  --icon-danger:           #f04438;
  --icon-success:          #12b76a;
  --icon-warning:          #f79009;
  --icon-info:             #0ba5ec;

  /* ── BACKGROUND ── */
  --bg-page:               #f0f2f4;
  --bg-white:              #ffffff;
  /* Brand */
  --bg-brand:              #245fdf;
  --bg-brand-light:        #f0f6fe;
  --bg-brand-hover:        #c8eefb;
  --bg-brand-pressed:      #026fa8;
  --bg-brand-disable:      #b2dff5;
  /* Neutral */
  --bg-neutral-light:      #f5f5f5;
  --bg-neutral-hover:      #f0f2f4;
  /* Danger */
  --bg-danger:             #f04438;
  --bg-danger-light:       #fef3f2;
  /* Success */
  --bg-success:            #12b76a;
  --bg-success-light:      #ecfdf3;
  /* Warning */
  --bg-warning:            #f79009;
  --bg-warning-light:      #fffaeb;
  /* Info */
  --bg-info-light:         #f0f9ff;
  /* Accent */
  --bg-accent-light:       #f4f3ff;

  /* ── STROKE ── */
  --stroke-neutral:        #ced1d6;
  --stroke-neutral-light:  #e9eaeb;
  --stroke-neutral-disable:#ecedef;
  --stroke-divider:        #e9eaeb;
  --stroke-white:          #ffffff;
  --stroke-brand:          #245fdf;
  --stroke-brand-light:    #7dd3f8;
  --stroke-danger:         #f04438;
  --stroke-danger-light:   #fecdca;
  --stroke-warning:        #f79009;
  --stroke-success:        #12b76a;
  --stroke-success-light:  #a6f4c5;
  --stroke-info:           #0ba5ec;

  /* Neutral scale — thang màu đầy đủ (nguồn: MDS Web Components v2.0) */
  --neutral-50:  #fafafa;
  --neutral-100: #f5f5f5;
  --neutral-200: #e9eaeb;
  --neutral-300: #d5d7da;
  --neutral-400: #a4a7ae;
  --neutral-500: #717680;
  --neutral-600: #535760;
  --neutral-700: #383c40;
  --neutral-800: #22262a;
  --neutral-900: #101828;

  /* ── RADIUS ── */
  --radius-sm:      4px;   /* tag, badge nhỏ */
  --radius-inner:   6px;   /* inner element */
  --radius-default: 8px;   /* panel, card, table */
  --radius-focus:   12px;  /* focus ring */
  --radius-dialog:  12px;  /* modal, dialog, popover */
  --radius-pill:    9999px;

  /* ── SPACING ── */
  /* Button (Medium) */
  --btn-height:       32px;
  --btn-min-width:    80px;
  --btn-px:           12px;
  --btn-icon-px:      8px;
  --btn-gap:          8px;
  --btn-group-gap:    8px;

  /* Input */
  --input-height:     36px;
  --input-px:         12px;
  --input-py:         8px;
  --input-gap:        8px;
  --input-row-gap:    16px;  /* gap giữa các input trong group */
  --input-col-gap:    12px;
  --input-label-gap:  8px;
  --input-group-gap:  24px;  /* gap giữa các Input Group */

  /* Card */
  --card-px:     16px;
  --card-py:     16px;
  --card-gap:    12px;  /* gap title → content */
  --card-col-gap:16px;  /* gap giữa các card — CŨNG là padding lề tổng quan (trái/phải/trên) */

  /* Form */
  --form-px:          24px;
  --form-py:          16px;
  --form-py-footer:   12px;
  --form-row-gap:     16px;
  --form-col-gap:     32px;
  --form-col-gap-sm:  16px;

  /* Dialog / Modal */
  --dialog-px: 24px;
  --dialog-py: 16px;
  --dialog-gap: 12px;

  /* Button Bar / Footer */
  --footer-px:  16px;
  --footer-py:  12px;
  --footer-gap: 16px;

  /* Sidebar */
  --sidebar-px: 16px;
  --sidebar-py: 16px;
  --sidebar-gap: 8px;

  /* DataTable */
  --table-row-height-1:  36px;
  --table-row-height-2:  56px;  /* chuẩn */
  --table-row-height-3:  72px;
  --table-header-height: 56px;  /* chuẩn 2 hàng */
  --table-footer-height: 36px;
  --table-cell-px:       4px;
  --table-paging-px:     16px;
  --table-col-min:       40px;

  /* Layout tổng thể — KHÔNG dùng fixed width màn hình, dùng 100vw/100vh */
  --layout-header-h:      48px;
  --layout-sidebar-w:     200px;   /* desktop expanded */
  --layout-sidebar-sm-w:  64px;    /* collapsed hoặc tablet */
  --layout-page-header-h: 56px;
  --layout-paging-h:      48px;

  /* ── TYPOGRAPHY ── */
  --font-family: InterVariable, 'Inter var', sans-serif;  /* KHÔNG sửa dòng này */

  /* Heading */
  --text-h1:       24px; --text-h1-lh:       36px;  /* H1 — ÍT DÙNG, chỉ cho graphic/display text cần to đặc biệt */
  --text-h2:       20px; --text-h2-lh:       28px;  /* H2 — App Title, Page Title, Dialog Welcome title */
  --text-h3:       16px; --text-h3-lh:       22px;  /* H3 — Form title, Card title, Section title, Group title */

  /* Body Regular (13px) */
  --text-body:     13px; --text-body-lh:     20px;

  /* Body Medium (14px) */
  --text-body-md:  14px; --text-body-md-lh:  20px;

  /* Body Large (16px) */
  --text-body-lg:  16px; --text-body-lg-lh:  20px;

  /* Body Small / Caption / Overline (12px) */
  --text-sm:       12px; --text-sm-lh:       16px;
  --text-caption:  12px; --text-caption-lh:  16px;
  --text-overline: 12px; --text-overline-lh: 16px;  /* uppercase + letter-spacing */

  /* Font weight */
  --fw-regular:   400;
  --fw-medium:    500;
  --fw-semibold:  600;
  --fw-bold:      700;

  /* ── ALPHA TOKENS ── */
  --alpha-black-100: rgba(0,0,0,0.10);
  --alpha-black-200: rgba(0,0,0,0.20);

  /* ── SHADOW ── */
  --shadow-sm:     0 1px 2px rgba(16,24,40,0.05);
  --shadow-md:     0 4px 8px -2px rgba(16,24,40,0.10), 0 2px 4px -2px rgba(16,24,40,0.06);
  --shadow-lg:     0 12px 16px -4px rgba(16,24,40,0.08), 0 4px 6px -2px rgba(16,24,40,0.03);
  --shadow-dialog: 0 8px 24px rgba(16,24,40,0.15);
  /* Drop Shadow / Neutral / All 2 — card/panel trắng trên --bg-page, KHÔNG dùng border */
  --shadow-card:   0 0 2px 0 var(--alpha-black-100);
}
```

---

## 2. UTILITY CSS BASE

```css
/* Reset nhẹ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font-family); font-size: var(--text-body); line-height: var(--text-body-lh); color: var(--text-primary); background: var(--bg-page); font-feature-settings: 'cv02','cv03','cv04','cv11'; -webkit-font-smoothing: antialiased; }

/* ── Heading ── */
/* .h1 — ÍT DÙNG: chỉ cho graphic/display text cần kích thước to đặc biệt */
.h1 { font-size: var(--text-h1); font-weight: var(--fw-semibold); line-height: var(--text-h1-lh); }
/* .h2 — App Title, Page Title, Dialog Welcome title */
.h2 { font-size: var(--text-h2); font-weight: var(--fw-semibold); line-height: var(--text-h2-lh); }
/* .h3 — Form title, Card title, Section title, Group title */
.h3 { font-size: var(--text-h3); font-weight: var(--fw-semibold); line-height: var(--text-h3-lh); }

/* ── Body Regular (13px) — khớp MDS "Body Regular/*" ── */
.body-regular  { font-size: var(--text-body); font-weight: var(--fw-regular);  line-height: var(--text-body-lh); }
.body-medium   { font-size: var(--text-body); font-weight: var(--fw-medium);   line-height: var(--text-body-lh); }
.body-semibold { font-size: var(--text-body); font-weight: var(--fw-semibold); line-height: var(--text-body-lh); }
.body-bold     { font-size: var(--text-body); font-weight: var(--fw-bold);     line-height: var(--text-body-lh); }

/* ── Body Medium (14px) — khớp MDS "Body Medium/*" ── */
.body-md-regular  { font-size: var(--text-body-md); font-weight: var(--fw-regular);  line-height: var(--text-body-md-lh); }
.body-md-medium   { font-size: var(--text-body-md); font-weight: var(--fw-medium);   line-height: var(--text-body-md-lh); }
.body-md-semibold { font-size: var(--text-body-md); font-weight: var(--fw-semibold); line-height: var(--text-body-md-lh); }
.body-md-bold     { font-size: var(--text-body-md); font-weight: var(--fw-bold);     line-height: var(--text-body-md-lh); }

/* ── Body Large (16px) — khớp MDS "Body Large/*" ── */
.body-lg-regular  { font-size: var(--text-body-lg); font-weight: var(--fw-regular);  line-height: var(--text-body-lg-lh); }
.body-lg-medium   { font-size: var(--text-body-lg); font-weight: var(--fw-medium);   line-height: var(--text-body-lg-lh); }
.body-lg-semibold { font-size: var(--text-body-lg); font-weight: var(--fw-semibold); line-height: var(--text-body-lg-lh); }
.body-lg-bold     { font-size: var(--text-body-lg); font-weight: var(--fw-bold);     line-height: var(--text-body-lg-lh); }

/* ── Body Small (12px) — khớp MDS "Body Small/*" ── */
.body-sm-regular  { font-size: var(--text-sm); font-weight: var(--fw-regular);  line-height: var(--text-sm-lh); }
.body-sm-medium   { font-size: var(--text-sm); font-weight: var(--fw-medium);   line-height: var(--text-sm-lh); }
.body-sm-semibold { font-size: var(--text-sm); font-weight: var(--fw-semibold); line-height: var(--text-sm-lh); }
.body-sm-bold     { font-size: var(--text-sm); font-weight: var(--fw-bold);     line-height: var(--text-sm-lh); }

/* ── Caption (12px) — khớp MDS "Caption/*" ── */
.caption          { font-size: var(--text-caption); font-weight: var(--fw-regular);  line-height: var(--text-caption-lh); }
.caption-medium   { font-size: var(--text-caption); font-weight: var(--fw-medium);   line-height: var(--text-caption-lh); }
.caption-semibold { font-size: var(--text-caption); font-weight: var(--fw-semibold); line-height: var(--text-caption-lh); }

/* ── Overline (12px uppercase) — khớp MDS "Overline/*" ── */
.overline          { font-size: var(--text-overline); font-weight: var(--fw-regular);  line-height: var(--text-overline-lh); text-transform: uppercase; letter-spacing: 0.06em; }
.overline-medium   { font-size: var(--text-overline); font-weight: var(--fw-medium);   line-height: var(--text-overline-lh); text-transform: uppercase; letter-spacing: 0.06em; }
.overline-semibold { font-size: var(--text-overline); font-weight: var(--fw-semibold); line-height: var(--text-overline-lh); text-transform: uppercase; letter-spacing: 0.06em; }
.overline-bold     { font-size: var(--text-overline); font-weight: var(--fw-bold);     line-height: var(--text-overline-lh); text-transform: uppercase; letter-spacing: 0.06em; }

/* ── Color helpers ── */
.text-secondary { color: var(--text-secondary); }
.text-hint      { color: var(--text-hint); }
.text-disabled  { color: var(--text-disabled); }
.text-brand     { color: var(--text-brand); }
.text-danger    { color: var(--text-danger); }
.text-success   { color: var(--text-success); }
.text-warning   { color: var(--text-warning); }
.text-info      { color: var(--text-info); }
.text-accent    { color: var(--text-accent); }
.text-white     { color: var(--text-white); }

/* Aliases (tương thích ngược) */
.text-body    { font-size: var(--text-body);    font-weight: var(--fw-regular); line-height: var(--text-body-lh); }
.text-body-md { font-size: var(--text-body-md); font-weight: var(--fw-regular); line-height: var(--text-body-md-lh); }
.text-sm      { font-size: var(--text-sm);      line-height: var(--text-sm-lh); }

/* Flex helpers */
.flex       { display: flex; }
.flex-col   { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-end  { justify-content: flex-end; }
.flex-1       { flex: 1; }
.gap-8        { gap: 8px; }
.gap-12       { gap: 12px; }
.gap-16       { gap: 16px; }

/* Divider */
.divider-h { width: 100%; height: 1px; background: var(--stroke-divider); }
.divider-v { width: 1px; align-self: stretch; background: var(--stroke-divider); }
```

---

## 3. LAYOUT CHUẨN — HTML SKELETON

### 3.1 App Shell (Responsive — chiếm toàn bộ viewport)

> ⛔ KHÔNG cứng kích thước `width: 1366px` hay `height: 768px`.  
> App shell chiếm `100vw × 100vh`, sidebar + header fixed, main content scroll nội bộ.

**QUY TẮC LAYOUT BẮT BUỘC:**
```
1. Global Header luôn ở trên cùng, chiều cao 48px (--layout-header-h).
2. .body-row nằm ngay sau header — chứa sidebar + main-content.
3. Sidebar luôn nằm sát lên đến header, KHÔNG có bất kỳ element nào chen giữa header và sidebar.
4. Sub-navigation tabs (nếu có) luôn nằm BÊN TRONG main-content (phía trên page-header),
   KHÔNG ĐƯỢC đặt giữa header và body-row, cũng KHÔNG ĐƯỢC đặt ngang hàng sidebar.
5. Cấu trúc đúng: app-shell → [header] → [body-row → [sidebar] + [main-content → [sub-nav?] + [page-header] + [content-wrapper]]]
```

```html
<div class="app-shell">
  <!-- Global Header — luôn ở trên cùng, full width -->
  <header class="global-header">
    <div class="header-left">
      <img class="app-logo" src="..." alt="Logo" />
      <span class="app-name h3">Tên App</span>
    </div>
    <div class="header-center">
      <div class="search-box">
        <i class="icon-search"></i>
        <input type="text" placeholder="Tìm kiếm..." />
      </div>
    </div>
    <div class="header-right">
      <button class="btn-icon"><i class="icon-bell"></i></button>
      <div class="avatar">VT</div>
    </div>
  </header>

  <!-- body-row nằm ngay sau header — sidebar PHẢI nằm sát header -->
  <div class="body-row">
    <!-- Sidebar host (flex item) → sidebar absolute bên trong — xem Section 3.2 -->
    <div class="sidebar-host sidebar-host--expanded">
      <aside class="sidebar expanded"><!-- ... --></aside>
    </div>

    <!-- Main Content — chứa tất cả tab/page-header/content -->
    <main class="main-content">
      <!-- Sub-nav tabs (nếu có, cao 48px) — nằm TRONG main-content, KHÔNG đặt ngoài body-row -->
      <div class="sub-nav"><!-- xem Section 3.3 --></div>

      <!-- Page Header -->
      <div class="page-header">
        <!-- xem Section 3.4 -->
      </div>

      <!-- Nội dung trang -->
      <div class="content-wrapper">
        <!-- table / form / dashboard -->
      </div>
    </main>
  </div>
</div>
```

```css
.app-shell {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-page);
}

/* Global Header */
.global-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--layout-header-h);   /* 48px */
  padding: 0 16px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
  gap: 16px;
}
.header-left  { display: flex; align-items: center; gap: 8px; }
.header-right { display: flex; align-items: center; gap: 8px; }
.app-name { font-size: 16px; font-weight: 600; color: var(--text-primary); }

/* Search box in header */
.search-box {
  display: flex; align-items: center; gap: 8px;
  height: 32px; padding: 0 12px;
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
  background: var(--bg-white);
  min-width: 240px;
}
.search-box input { border: none; outline: none; flex: 1; font-size: 13px; color: var(--text-primary); }
.search-box input::placeholder { color: var(--text-hint); }

/* Body Row */
.body-row {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;  /* fix flex child overflow */
}

/* Main Content — chiếm phần còn lại, overflow nội bộ */
.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;  /* fix text overflow trong flex */
  overflow: hidden;
  background: var(--bg-page);
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .sidebar-host { display: none; }  /* ẩn sidebar-host, dùng mobile nav */
  .form-grid--2col, .form-grid--3col { grid-template-columns: 1fr; }
  .table-toolbar { flex-wrap: wrap; gap: 8px; height: auto; padding: 12px 16px; }
}
```

---

### 3.2 Sidebar

> Chuẩn MDS Web Components v2.0 — import `AppSidebar` từ `@mds/components/AppSidebar.vue`.  
> Collapsed = 64px, padding trái/phải 16px.  Expanded (pinned) = 200px.  
> Hover-expand là CSS `:hover` — **KHÔNG dùng JS mouseenter/mouseleave** (gây jitter khi transition).

**Quy tắc bắt buộc:**
```
1. .sidebar-host là flex item (reserved 64px/200px trong layout).
2. .sidebar luôn position:absolute bên trong host — width animation không làm xô lệch main-content.
3. Hover mở rộng sidebar thành overlay (z-index:100, box-shadow) — dùng CSS :hover trên .sidebar.
4. Click btn-collapse → pin/unpin (.expanded class) — chỉ cần 1 ref isExpanded.
5. Label sidebar-item dùng class .sidebar-item__label — KHÔNG dùng <span> thuần (TIcon cũng render span).
6. Icon .sidebar-item: color = --icon-neutral (KHÔNG inherit từ text).
7. Label .sidebar-item: color = --text-primary (không dùng --text-secondary).
8. btn-add-quick collapsed: icon-only, căn giữa, width 100%, max-width 0 cho text (KHÔNG dùng opacity:0 — giữ nguyên space).
```

```html
<!-- sidebar-host: flex item giữ chỗ trong .body-row -->
<div class="sidebar-host">  <!-- thêm sidebar-host--expanded khi pinned -->
  <aside class="sidebar">   <!-- thêm .expanded khi pinned -->
    <div class="sidebar-inner">
      <button class="btn-add-quick">
        <i class="ti ti-plus"></i>
        <span class="btn-add-text">Thêm nhanh</span>
      </button>
      <nav class="sidebar-nav">
        <button class="sidebar-item active">
          <i class="ti ti-layout-dashboard"></i>
          <span class="sidebar-item__label">Tổng quan</span>
        </button>
        <button class="sidebar-item">
          <i class="ti ti-shopping-cart"></i>
          <span class="sidebar-item__label">Bán hàng</span>
        </button>
      </nav>
    </div>
    <button class="btn-collapse" title="Thu gọn / Mở rộng">
      <!-- show collapse SVG when expanded, expand SVG when collapsed -->
    </button>
  </aside>
</div>
```

```css
/* ── Sidebar host: flex item — giữ chỗ cố định, sidebar absolute bên trong ── */
.sidebar-host {
  flex-shrink: 0; width: var(--layout-sidebar-sm-w); /* 64px */
  height: 100%; position: relative;
  transition: width 0.22s ease;
}
.sidebar-host--expanded { width: var(--layout-sidebar-w); } /* 200px — chỉ khi pinned */

/* ── Sidebar: luôn absolute, transition không ảnh hưởng layout ── */
.sidebar {
  display: flex; flex-direction: column;
  position: absolute; top: 0; left: 0; bottom: 0;
  width: var(--layout-sidebar-sm-w);
  background: var(--bg-white);
  border-right: 1px solid var(--stroke-neutral-light);
  overflow: hidden; z-index: 1;
  transition: width 0.22s ease, box-shadow 0.22s ease;
}
/* Pinned expanded */
.sidebar.expanded { width: var(--layout-sidebar-w); }
/* Hover overlay (CSS :hover — KHÔNG dùng JS events) */
.sidebar:not(.expanded):hover {
  width: var(--layout-sidebar-w);
  z-index: 100; box-shadow: 4px 0 20px rgba(16,24,40,0.12);
}

/* ── Inner scrollable area ── */
.sidebar-inner {
  display: flex; flex-direction: column; flex: 1; min-height: 0;
  padding: 12px 16px 52px; gap: 8px;  /* 16px horizontal padding */
  overflow-y: auto; overflow-x: hidden;
}
.sidebar.expanded .sidebar-inner,
.sidebar:not(.expanded):hover .sidebar-inner { padding: 12px 12px 52px; }

/* ── btn-add-quick: collapsed = icon-only square; expanded = icon + label centered ── */
.btn-add-quick {
  display: flex; align-items: center; justify-content: center;
  gap: 0; width: 100%; height: var(--btn-height); padding: 0;
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
  background: var(--bg-white); cursor: pointer;
  color: var(--text-primary); font-size: 13px; font-weight: var(--fw-medium);
  white-space: nowrap; overflow: hidden; flex-shrink: 0;
  transition: background 0.15s;
}
.btn-add-quick:hover { background: var(--bg-neutral-light); }
.btn-add-quick .ti { font-size: 16px; flex-shrink: 0; }
/* Text: max-width:0 hides without keeping layout space (opacity:0 would keep space) */
.btn-add-quick .btn-add-text {
  opacity: 0; max-width: 0; overflow: hidden; white-space: nowrap;
  transition: opacity 0.15s 0s, max-width 0.15s 0s; /* no delay on hide */
}
.sidebar.expanded .btn-add-quick,
.sidebar:not(.expanded):hover .btn-add-quick { gap: 8px; justify-content: center; }
.sidebar.expanded .btn-add-quick .btn-add-text,
.sidebar:not(.expanded):hover .btn-add-quick .btn-add-text {
  opacity: 1; max-width: 160px;
  transition: opacity 0.18s 0.1s, max-width 0.18s 0.1s; /* 0.1s delay on show — icon settles first */
}

/* ── Sidebar nav items ── */
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.sidebar-item {
  display: flex; align-items: center; gap: 8px; justify-content: center;
  height: 36px; padding: 0; width: 100%;
  border-radius: var(--radius-default); border: none; background: transparent;
  font-size: 13px; font-weight: var(--fw-medium);
  color: var(--text-primary);      /* --text-primary, KHÔNG dùng secondary */
  cursor: pointer; white-space: nowrap; transition: background 0.15s;
}
.sidebar.expanded .sidebar-item,
.sidebar:not(.expanded):hover .sidebar-item { justify-content: flex-start; padding: 0 12px; }
.sidebar-item:hover  { background: var(--bg-neutral-hover); }
.sidebar-item.active { background: var(--bg-brand-light); color: var(--text-brand); font-weight: var(--fw-semibold); }
.sidebar-item .ti         { font-size: 20px; flex-shrink: 0; color: var(--icon-neutral); }
.sidebar-item.active .ti  { color: var(--text-brand); } /* active: icon phải đổi sang brand */
.sidebar-item .sidebar-item__label { display: none; } /* dùng class riêng, không dùng span */
.sidebar.expanded .sidebar-item .sidebar-item__label,
.sidebar:not(.expanded):hover .sidebar-item .sidebar-item__label { display: block; }

/* ── Collapse/Expand button — absolute bottom ── */
.btn-collapse {
  position: absolute; bottom: 0; right: 0;
  width: 40px; height: 40px;
  background: var(--neutral-50);
  border: none; border-top: 1px solid var(--stroke-neutral-light);
  border-left: 1px solid var(--stroke-neutral-light); border-radius: 8px 0 0 0;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-secondary); transition: background 0.15s;
}
/* Collapsed (and not hovering): full-width button */
.sidebar:not(.expanded):not(:hover) .btn-collapse {
  left: 0; right: 0; width: auto;
  border-left: none; border-right: 1px solid var(--stroke-neutral-light); border-radius: 0;
}
.btn-collapse:hover { background: var(--bg-neutral-hover); }
```

**Vue `AppSidebar.vue` (component chuẩn tại `@mds/components/AppSidebar.vue`):**
```vue
<template>
  <div class="sidebar-host" :class="{ 'sidebar-host--expanded': isExpanded }">
    <aside class="sidebar" :class="{ expanded: isExpanded }">
      <div class="sidebar-inner">
        <button class="btn-add-quick" @click="$emit('quick-add')">
          <TIcon name="plus" />
          <span class="btn-add-text">Thêm nhanh</span>
        </button>
        <nav class="sidebar-nav">
          <button v-for="item in items" :key="item.id"
            class="sidebar-item" :class="{ active: activeId === item.id }"
            :title="item.label" @click="$emit('nav', item.id)">
            <TIcon :name="item.icon" />
            <span class="sidebar-item__label">{{ item.label }}</span>
          </button>
        </nav>
      </div>
      <button class="btn-collapse" @click="onCollapseClick"
        :title="isExpanded ? 'Thu gọn' : 'Ghim mở rộng'">
        <!-- expanded: collapse icon; collapsed: expand icon -->
      </button>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TIcon from './TIcon.vue'

const props = defineProps({
  items:           { type: Array,   default: () => [] },
  activeId:        { type: String,  default: '' },
  defaultExpanded: { type: Boolean, default: false },
})
defineEmits(['nav', 'quick-add'])

const isExpanded = ref(props.defaultExpanded)
// Hover-expand handled by CSS :hover — no JS mouseenter/mouseleave needed
function onCollapseClick() { isExpanded.value = !isExpanded.value }
</script>
```

---

### 3.3 Sub-Nav Tabs

> Sub-nav luôn nằm **trong** `.main-content`, KHÔNG bao giờ đặt ngoài `.body-row`.  
> **Chiều cao cố định 48px.**

```html
<div class="sub-nav">
  <button class="sub-nav-tab active">Tình hình tài chính</button>
  <button class="sub-nav-tab">Bàn làm việc</button>
  <button class="sub-nav-tab">
    <i class="ti ti-cpu"></i> Trợ lý AI
  </button>
</div>
```

```css
.sub-nav {
  display: flex; align-items: center; gap: 0;
  height: 48px; padding: 0 16px; flex-shrink: 0;
  border-bottom: 1px solid var(--stroke-neutral-light);
  background: var(--bg-white);
}
.sub-nav-tab {
  display: flex; align-items: center; gap: 6px;
  height: 48px; padding: 0 16px;
  font-size: 13px; font-weight: var(--fw-medium);
  color: var(--text-secondary);
  border: none; background: transparent; cursor: pointer;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  white-space: nowrap; transition: color 0.15s;
}
.sub-nav-tab:hover { color: var(--text-primary); }
.sub-nav-tab.active {
  color: var(--text-brand); font-weight: var(--fw-semibold);
  border-bottom-color: var(--stroke-brand);
}
.sub-nav-tab .ti { font-size: 16px; }

---

### 3.4 Page Header

```html
<!-- List Page Header -->
<div class="page-header">
  <div class="page-header__left">
    <button class="btn-icon btn-icon--sm" aria-label="Quay lại">
      <i class="icon-arrow-left"></i>
    </button>
    <h1 class="page-header__title h2">Danh sách Khách hàng</h1>
  </div>
  <div class="page-header__right">
    <button class="btn btn--outline btn--sm">
      <i class="icon-upload"></i> Nhập từ Excel
    </button>
    <button class="btn btn--primary btn--sm">
      <i class="icon-plus"></i> Thêm
    </button>
  </div>
</div>
```

```css
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  height: var(--layout-page-header-h);  /* 56px */
  padding: 0 0;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
.page-header__left  { display: flex; align-items: center; gap: 8px; }
.page-header__right { display: flex; align-items: center; gap: 8px; }
.page-header__title { font-size: 20px; font-weight: 600; color: var(--text-primary); }
```

---

## 4. BUTTON — HTML/CSS

```html
<!-- Button variants -->
<button class="btn btn--primary">Lưu</button>
<button class="btn btn--outline">Hủy</button>
<button class="btn btn--ghost">Bỏ qua</button>
<button class="btn btn--danger">Xóa</button>
<button class="btn btn--primary" disabled>Disabled</button>

<!-- Với icon -->
<button class="btn btn--primary">
  <i class="icon-plus"></i>
  Thêm mới
</button>

<!-- Button icon only -->
<button class="btn-icon"><i class="icon-refresh"></i></button>
<button class="btn-icon btn-icon--danger"><i class="icon-trash"></i></button>

<!-- Button Small -->
<button class="btn btn--primary btn--sm">Lưu</button>

<!-- Button Group — nhiều button cạnh nhau dùng gap: 8px -->
<div style="display:flex; align-items:center; gap:8px">
  <button class="btn btn--outline">Hủy</button>
  <button class="btn btn--primary">Lưu</button>
</div>
```

> **Rule: Button group gap = 8px** (`--btn-group-gap`). Áp dụng mọi nơi có nhiều button cạnh nhau: form footer, toolbar, action bar, inline actions.

```css
/* ── Base button ── */
.btn {
  display: inline-flex; align-items: center; gap: var(--btn-gap);
  height: var(--btn-height);         /* 32px */
  min-width: var(--btn-min-width);   /* 80px */
  padding: 0 var(--btn-px);          /* 0 12px */
  font-family: var(--font-family);
  font-size: 13px; font-weight: 500;
  border-radius: var(--radius-default);
  border: 1px solid transparent;
  cursor: pointer; white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.btn i { width: 16px; height: 16px; }

/* Primary (Brand Solid) */
.btn--primary {
  background: var(--bg-brand);
  border-color: var(--bg-brand);
  color: var(--text-white);
}
.btn--primary:hover   { background: #0384c8; border-color: #0384c8; }
.btn--primary:active  { background: #026fa8; }
.btn--primary:disabled { background: var(--bg-brand-disable); border-color: var(--bg-brand-disable); cursor: not-allowed; }

/* Outline (Brand Outline) */
.btn--outline {
  background: var(--bg-white);
  border-color: var(--stroke-brand);
  color: var(--text-brand);
}
.btn--outline:hover  { background: var(--bg-brand-light); }
.btn--outline:disabled { border-color: var(--stroke-neutral-disable); color: var(--text-disabled); cursor: not-allowed; }

/* Ghost / Text */
.btn--ghost {
  background: transparent;
  border-color: transparent;
  color: var(--text-secondary);
}
.btn--ghost:hover { background: var(--bg-neutral-hover); }

/* Neutral Outline */
.btn--neutral {
  background: var(--bg-white);
  border-color: var(--stroke-neutral);
  color: var(--text-primary);
}
.btn--neutral:hover { background: var(--bg-neutral-light); }

/* Danger */
.btn--danger {
  background: var(--bg-danger);
  border-color: var(--bg-danger);
  color: var(--text-white);
}
.btn--danger:hover { background: #d73535; }

/* Small variant */
.btn--sm { height: 28px; font-size: 12px; padding: 0 10px; min-width: 64px; }

/* Button Icon Only */
.btn-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border-radius: var(--radius-default);
  border: 1px solid transparent;
  background: transparent; cursor: pointer;
  color: var(--icon-neutral);
  transition: background 0.15s;
}
.btn-icon:hover       { background: var(--bg-neutral-hover); }
.btn-icon--sm         { width: 28px; height: 28px; }
.btn-icon--danger     { color: var(--icon-danger); }
.btn-icon--danger:hover { background: var(--bg-danger-light); }
.btn-icon--outline    { border-color: var(--stroke-neutral); }
```

---

## 5. INPUT / FORM FIELD — HTML/CSS

```html
<!-- Input field với label -->
<div class="field">
  <label class="field__label">Tên khách hàng <span class="field__required">*</span></label>
  <input class="input" type="text" placeholder="Nhập tên khách hàng" />
  <span class="field__hint">Nhập đầy đủ tên khách hàng</span>
</div>

<!-- Input error state -->
<div class="field field--error">
  <label class="field__label">Email</label>
  <input class="input input--error" type="email" value="invalid" />
  <span class="field__error-msg">Email không đúng định dạng</span>
</div>

<!-- Input với prefix icon -->
<div class="input-wrapper">
  <i class="input-prefix-icon icon-search"></i>
  <input class="input input--has-prefix" type="text" placeholder="Tìm kiếm..." />
</div>

<!-- Textarea -->
<div class="field">
  <label class="field__label">Ghi chú</label>
  <textarea class="input input--textarea" rows="3" placeholder="Nhập ghi chú..."></textarea>
</div>

<!-- Select / Dropdown -->
<div class="field">
  <label class="field__label">Trạng thái</label>
  <select class="input input--select">
    <option value="">Chọn trạng thái</option>
    <option>Đang hoạt động</option>
    <option>Tạm ngưng</option>
  </select>
</div>
```

```css
/* Field wrapper */
.field {
  display: flex; flex-direction: column;
  gap: var(--input-label-gap);  /* 8px */
}
.field__label {
  font-size: 13px; font-weight: 500;
  color: var(--text-primary); line-height: 20px;
}
.field__required { color: var(--text-danger); margin-left: 2px; }
.field__hint     { font-size: 12px; color: var(--text-secondary); line-height: 16px; }
.field__error-msg { font-size: 12px; color: var(--text-danger); line-height: 16px; }

/* Input base */
/* line-height = height (không trừ border) — bắt buộc để dấu thanh tiếng Việt (Ổ, Ầ, Ắ...) không bị clip trên mọi DPI */
.input {
  display: flex; align-items: center;
  width: 100%;
  height: var(--input-height);
  padding: 0 var(--input-px);
  line-height: var(--input-height);
  font-family: var(--font-family);
  font-size: 13px; color: var(--text-primary);
  background: var(--bg-white);
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input::placeholder { color: var(--text-hint); }
.input:focus        { border-color: var(--stroke-brand); box-shadow: 0 0 0 3px rgba(4,153,228,0.12); }
.input:disabled     { background: var(--bg-neutral-light); color: var(--text-disabled); cursor: not-allowed; }
.input--error       { border-color: var(--stroke-danger); }
.input--error:focus { box-shadow: 0 0 0 3px rgba(240,68,56,0.12); }
.input--textarea    { height: auto; min-height: 80px; resize: vertical; }
.input--select      { appearance: none; background-image: url("data:image/svg+xml,..."); background-repeat: no-repeat; background-position: right 10px center; padding-right: 32px; cursor: pointer; }

/* Input with prefix icon */
.input-wrapper { position: relative; }
.input-prefix-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--icon-neutral); width: 16px; height: 16px; pointer-events: none; }
.input--has-prefix  { padding-left: 34px; }
```

---

## 6. TABLE — HTML/CSS

```html
<div class="table-panel">
  <!-- Table Header Toolbar -->
  <div class="table-toolbar">
    <div class="table-toolbar__left">
      <div class="input-wrapper">
        <i class="input-prefix-icon icon-search"></i>
        <input class="input input--has-prefix" type="text" placeholder="Tìm kiếm..." style="width:240px" />
      </div>
      <select class="input input--select" style="width:160px">
        <option>Trạng thái: Tất cả</option>
        <option>Đang hoạt động</option>
      </select>
    </div>
    <div class="table-toolbar__right">
      <button class="btn-icon btn-icon--outline" title="Làm mới"><i class="icon-refresh"></i></button>
      <button class="btn-icon btn-icon--outline" title="Xuất Excel"><i class="icon-upload"></i></button>
      <button class="btn btn--outline btn--sm"><i class="icon-upload"></i> Nhập từ Excel</button>
      <button class="btn btn--primary btn--sm"><i class="icon-plus"></i> Thêm</button>
    </div>
  </div>

  <!-- Table -->
  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th class="table__th table__th--checkbox">
            <input type="checkbox" class="checkbox" />
          </th>
          <th class="table__th">Tên khách hàng</th>
          <th class="table__th">Mã khách hàng</th>
          <th class="table__th table__th--right">Công nợ</th>
          <th class="table__th">Trạng thái</th>
          <th class="table__th table__th--action"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="table__row">
          <td class="table__td table__td--checkbox">
            <input type="checkbox" class="checkbox" />
          </td>
          <td class="table__td">
            <a href="#" class="text-brand">Công ty TNHH ABC</a>
            <div class="text-sm text-secondary">abc@example.com</div>
          </td>
          <td class="table__td">KH-001</td>
          <td class="table__td table__td--right">10.500.000</td>
          <td class="table__td"><span class="badge badge--success">Hoạt động</span></td>
          <td class="table__td table__td--action">
            <button class="btn-icon btn-icon--sm"><i class="icon-edit"></i></button>
            <button class="btn-icon btn-icon--sm btn-icon--danger"><i class="icon-trash"></i></button>
          </td>
        </tr>
        <!-- more rows... -->
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <div class="paging">
    <span class="text-sm text-secondary">Tổng số: <strong>48</strong></span>
    <div class="paging__right">
      <span class="text-sm text-secondary">Số dòng/trang</span>
      <select class="input input--select" style="width:72px;height:28px;font-size:12px">
        <option>10</option><option>20</option><option>50</option>
      </select>
      <span class="text-sm text-secondary">1 - 10</span>
      <div class="paging__nav">
        <button class="btn-icon btn-icon--sm" disabled><i class="icon-chevrons-left"></i></button>
        <button class="btn-icon btn-icon--sm" disabled><i class="icon-chevron-left"></i></button>
        <button class="btn-icon btn-icon--sm"><i class="icon-chevron-right"></i></button>
        <button class="btn-icon btn-icon--sm"><i class="icon-chevrons-right"></i></button>
      </div>
    </div>
  </div>
</div>
```

```css
/* Table Panel */
.table-panel {
  display: flex; flex-direction: column;
  flex: 1; overflow: hidden;
  background: var(--bg-white);
  border-radius: var(--radius-default);  /* 8px */
}

/* Toolbar */
.table-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  height: 56px; padding: 0 16px; flex-shrink: 0;
  border-bottom: 1px solid var(--stroke-neutral-light);
}
.table-toolbar__left  { display: flex; align-items: center; gap: 8px; }
.table-toolbar__right { display: flex; align-items: center; gap: 8px; }

/* Table scroll wrapper */
.table-wrap { flex: 1; overflow: auto; }

/* Table */
.table { width: 100%; border-collapse: collapse; }

.table__th {
  height: var(--table-header-height);  /* 56px */
  padding: 0 var(--table-cell-px);     /* 0 4px */
  text-align: left;
  font-size: 13px; font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  white-space: nowrap;
  position: sticky; top: 0; z-index: 1;
}
.table__th--checkbox { width: 48px; padding: 0 12px; }
.table__th--action   { width: 96px; }
.table__th--right    { text-align: right; }

.table__row { transition: background 0.1s; }
.table__row:hover { background: var(--bg-neutral-light); }
.table__row--selected { background: var(--bg-brand-light); }

.table__td {
  height: var(--table-row-height-2);   /* 56px */
  padding: 0 var(--table-cell-px);     /* 0 4px */
  font-size: 13px; color: var(--text-primary);
  border-bottom: 1px solid var(--stroke-neutral-light);
  vertical-align: middle;
}
.table__td--checkbox { width: 48px; padding: 0 12px; }
.table__td--action   { width: 96px; }
.table__td--right    { text-align: right; }

/* Checkbox */
.checkbox {
  width: 16px; height: 16px; cursor: pointer;
  accent-color: var(--bg-brand);
}

/* Pagination */
.paging {
  display: flex; align-items: center; justify-content: space-between;
  height: var(--layout-paging-h);  /* 48px */
  padding: 0 var(--table-paging-px);  /* 0 16px */
  border-top: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
.paging__right { display: flex; align-items: center; gap: 8px; }
.paging__nav   { display: flex; align-items: center; gap: 2px; }
```

---

## 7. FORM PAGE — HTML/CSS

```html
<div class="form-page">
  <!-- Form Content (scrollable) -->
  <div class="form-content">
    <!-- Section Card -->
    <div class="form-section">
      <h3 class="form-section__title h3">Thông tin chung</h3>
      <div class="form-grid form-grid--2col">
        <!-- Field -->
        <div class="field">
          <label class="field__label">Tên khách hàng <span class="field__required">*</span></label>
          <input class="input" type="text" placeholder="Nhập tên..." />
        </div>
        <div class="field">
          <label class="field__label">Mã khách hàng</label>
          <input class="input" type="text" placeholder="Tự động" />
        </div>
        <div class="field">
          <label class="field__label">Email</label>
          <input class="input" type="email" placeholder="email@example.com" />
        </div>
        <div class="field">
          <label class="field__label">Số điện thoại</label>
          <input class="input" type="tel" placeholder="0901234567" />
        </div>
        <div class="field form-grid__full">
          <label class="field__label">Địa chỉ</label>
          <input class="input" type="text" placeholder="Nhập địa chỉ..." />
        </div>
      </div>
    </div>

    <!-- Section 2 -->
    <div class="form-section">
      <h3 class="form-section__title h3">Thông tin bổ sung</h3>
      <div class="form-grid form-grid--2col">
        <!-- more fields -->
      </div>
    </div>
  </div>

  <!-- Action Bar -->
  <div class="form-action-bar">
    <button class="btn btn--ghost">Hủy</button>
    <button class="btn btn--outline">Lưu và thêm</button>
    <button class="btn btn--primary">Lưu</button>
  </div>
</div>
```

```css
.form-page {
  display: flex; flex-direction: column;
  flex: 1; overflow: hidden;
}

.form-content {
  flex: 1; overflow-y: auto;
  display: flex; flex-direction: column;
  gap: 16px;
  padding: var(--form-py) var(--form-px);  /* 16px 24px */
  background: var(--bg-page);
}

.form-section {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  padding: 20px var(--form-px);  /* 20px 24px */
  display: flex; flex-direction: column; gap: 16px;
}
.form-section__title { font-size: 16px; font-weight: 600; color: var(--text-primary); }

.form-grid {
  display: grid;
  gap: var(--form-row-gap) var(--form-col-gap);  /* 16px 32px */
}
.form-grid--2col    { grid-template-columns: 1fr 1fr; }
.form-grid--3col    { grid-template-columns: 1fr 1fr 1fr; }
.form-grid__full    { grid-column: 1 / -1; }

.form-action-bar {
  display: flex; align-items: center; justify-content: flex-end;
  gap: var(--btn-group-gap);       /* 8px — button group gap */
  height: 56px;
  padding: 0 var(--footer-px);     /* 0 16px */
  background: var(--bg-white);
  border-top: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
```

---

## 8. MODAL / DIALOG — HTML/CSS

```html
<!-- Overlay -->
<div class="modal-overlay" @click.self="close">
  <div class="modal" style="width: 520px">
    <!-- Modal Header -->
    <div class="modal__header">
      <h3 class="h3">Thêm khách hàng</h3>
      <button class="btn-icon" @click="close"><i class="icon-x"></i></button>
    </div>

    <!-- Modal Body -->
    <div class="modal__body">
      <div class="field">
        <label class="field__label">Tên khách hàng <span class="field__required">*</span></label>
        <input class="input" type="text" />
      </div>
      <!-- more fields... -->
    </div>

    <!-- Modal Footer -->
    <div class="modal__footer">
      <button class="btn btn--ghost" @click="close">Hủy</button>
      <button class="btn btn--primary" @click="save">Lưu</button>
    </div>
  </div>
</div>
```

```css
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(16, 24, 40, 0.4);
  display: flex; align-items: center; justify-content: center;
}
.modal {
  background: var(--bg-white);
  border-radius: var(--radius-dialog);  /* 12px */
  box-shadow: var(--shadow-dialog);
  display: flex; flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}
.modal__header {
  display: flex; align-items: center; justify-content: space-between;
  height: 52px; padding: 0 var(--dialog-px) 0 var(--dialog-px);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
.modal__body {
  flex: 1; overflow-y: auto;
  padding: var(--dialog-py) var(--dialog-px);
  display: flex; flex-direction: column;
  gap: var(--input-row-gap);  /* 16px */
}
.modal__footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: var(--footer-gap);
  height: 52px; padding: 0 var(--footer-px);
  border-top: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
```

---

## 9. BADGE / TAG / STATUS

```html
<!-- Badge -->
<span class="badge badge--success">Hoạt động</span>
<span class="badge badge--danger">Đã hủy</span>
<span class="badge badge--warning">Chờ duyệt</span>
<span class="badge badge--info">Mới</span>
<span class="badge badge--neutral">Nháp</span>

<!-- Tag / Chip (có thể xóa) -->
<div class="tag tag--brand">
  <span>Nhóm A</span>
  <button class="tag__remove"><i class="icon-x"></i></button>
</div>
```

```css
.badge {
  display: inline-flex; align-items: center;
  height: 20px; padding: 0 6px;
  font-size: 12px; font-weight: 500; line-height: 16px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}
.badge--success { background: var(--bg-success-light); color: var(--text-success); }
.badge--danger  { background: var(--bg-danger-light);  color: var(--text-danger); }
.badge--warning { background: var(--bg-warning-light); color: var(--text-warning); }
.badge--info    { background: var(--bg-info-light);    color: var(--text-info); }
.badge--neutral { background: var(--bg-neutral-light); color: var(--text-secondary); }
.badge--brand   { background: var(--bg-brand-light);   color: var(--text-brand); }

/* Badge dot variant */
.badge--dot::before {
  content: ""; display: inline-block;
  width: 6px; height: 6px; border-radius: 50%;
  margin-right: 5px; background: currentColor;
}

/* Tag / Chip */
.tag {
  display: inline-flex; align-items: center; gap: 4px;
  height: 24px; padding: 0 8px;
  font-size: 12px; font-weight: 500;
  border-radius: var(--radius-pill);
  border: 1px solid currentColor;
}
.tag--brand  { background: var(--bg-brand-light);   color: var(--text-brand); }
.tag--neutral { background: var(--bg-neutral-light); color: var(--text-secondary); border-color: var(--stroke-neutral-light); }
.tag__remove { display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: inherit; width: 14px; height: 14px; padding: 0; }
```

---

## 10. VUE COMPONENT PATTERNS

### 10.1 Cấu trúc Vue Component chuẩn

```vue
<template>
  <div class="component-name">
    <!-- Template content -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
const props = defineProps<{
  title: string
  items: Item[]
  loading?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'add'): void
  (e: 'delete', id: number): void
  (e: 'update', item: Item): void
}>()

// State
const searchQuery = ref('')
const selectedIds = ref<number[]>([])

// Computed
const filteredItems = computed(() =>
  props.items.filter(i => i.name.includes(searchQuery.value))
)
</script>

<style scoped>
/* Component-specific styles — import tokens từ global */
.component-name { }
</style>
```

---

### 10.2 DataTable Vue Component

```vue
<template>
  <div class="table-panel">
    <!-- Toolbar -->
    <div class="table-toolbar">
      <div class="table-toolbar__left">
        <div class="input-wrapper">
          <i class="input-prefix-icon icon-search" />
          <input
            v-model="searchQuery"
            class="input input--has-prefix"
            placeholder="Tìm kiếm..."
            style="width: 240px"
          />
        </div>
        <select v-model="statusFilter" class="input input--select" style="width: 160px">
          <option value="">Trạng thái: Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Tạm ngưng</option>
        </select>
      </div>
      <div class="table-toolbar__right">
        <button class="btn-icon btn-icon--outline" @click="refresh"><i class="icon-refresh" /></button>
        <button class="btn btn--outline btn--sm"><i class="icon-upload" /> Nhập từ Excel</button>
        <button class="btn btn--primary btn--sm" @click="emit('add')">
          <i class="icon-plus" /> Thêm
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th class="table__th table__th--checkbox">
              <input type="checkbox" class="checkbox" v-model="allChecked" @change="toggleAll" />
            </th>
            <th v-for="col in columns" :key="col.key" class="table__th"
                :class="{ 'table__th--right': col.align === 'right' }">
              {{ col.label }}
            </th>
            <th class="table__th table__th--action"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in filteredItems"
            :key="row.id"
            class="table__row"
            :class="{ 'table__row--selected': selectedIds.includes(row.id) }"
          >
            <td class="table__td table__td--checkbox">
              <input type="checkbox" class="checkbox" :value="row.id" v-model="selectedIds" />
            </td>
            <td v-for="col in columns" :key="col.key" class="table__td"
                :class="{ 'table__td--right': col.align === 'right' }">
              <!-- Status badge -->
              <template v-if="col.type === 'status'">
                <span class="badge" :class="`badge--${row[col.key]?.color}`">
                  {{ row[col.key]?.label }}
                </span>
              </template>
              <!-- Link -->
              <template v-else-if="col.type === 'link'">
                <a href="#" class="text-brand" @click.prevent="emit('view', row)">
                  {{ row[col.key] }}
                </a>
              </template>
              <!-- Default text -->
              <template v-else>{{ row[col.key] ?? '—' }}</template>
            </td>
            <td class="table__td table__td--action">
              <button class="btn-icon btn-icon--sm" @click="emit('edit', row)">
                <i class="icon-edit" />
              </button>
              <button class="btn-icon btn-icon--sm btn-icon--danger" @click="emit('delete', row.id)">
                <i class="icon-trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="paging">
      <span class="text-sm text-secondary">Tổng số: <strong>{{ total }}</strong></span>
      <div class="paging__right">
        <span class="text-sm text-secondary">Số dòng/trang</span>
        <select v-model="pageSize" class="input input--select" style="width:72px;height:28px;font-size:12px">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
        <span class="text-sm text-secondary">{{ pageStart }} - {{ pageEnd }}</span>
        <div class="paging__nav">
          <button class="btn-icon btn-icon--sm" :disabled="currentPage === 1" @click="currentPage = 1">
            <i class="icon-chevrons-left" />
          </button>
          <button class="btn-icon btn-icon--sm" :disabled="currentPage === 1" @click="currentPage--">
            <i class="icon-chevron-left" />
          </button>
          <button class="btn-icon btn-icon--sm" :disabled="currentPage === totalPages" @click="currentPage++">
            <i class="icon-chevron-right" />
          </button>
          <button class="btn-icon btn-icon--sm" :disabled="currentPage === totalPages" @click="currentPage = totalPages">
            <i class="icon-chevrons-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Column { key: string; label: string; type?: 'text' | 'status' | 'link'; align?: 'left' | 'right' }
interface Row { id: number; [key: string]: any }

const props = defineProps<{
  columns: Column[]
  items: Row[]
  total: number
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit', row: Row): void
  (e: 'delete', id: number): void
  (e: 'view', row: Row): void
}>()

const searchQuery   = ref('')
const statusFilter  = ref('')
const selectedIds   = ref<number[]>([])
const currentPage   = ref(1)
const pageSize      = ref(10)
const allChecked    = ref(false)

const filteredItems = computed(() =>
  props.items.filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
)
const totalPages = computed(() => Math.ceil(props.total / pageSize.value))
const pageStart  = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const pageEnd    = computed(() => Math.min(currentPage.value * pageSize.value, props.total))

function toggleAll() { selectedIds.value = allChecked.value ? props.items.map(r => r.id) : [] }
function refresh()   { /* emit reload event */ }
</script>
```

---

### 10.3 Modal Vue Component

```vue
<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
      <div class="modal" :style="{ width: width + 'px' }">
        <div class="modal__header">
          <h3 class="h3">{{ title }}</h3>
          <button class="btn-icon" @click="close"><i class="icon-x" /></button>
        </div>
        <div class="modal__body">
          <slot />
        </div>
        <div class="modal__footer">
          <button class="btn btn--ghost" @click="close">Hủy</button>
          <button class="btn btn--primary" :disabled="loading" @click="emit('confirm')">
            {{ loading ? 'Đang lưu...' : 'Lưu' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title: string
  width?: number
  loading?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
}>()
const close = () => emit('update:modelValue', false)
</script>
```

---

### 10.4 Form Page Vue

```vue
<template>
  <div class="form-page">
    <div class="form-content">
      <div v-for="section in sections" :key="section.id" class="form-section">
        <h3 class="form-section__title h3">{{ section.title }}</h3>
        <div class="form-grid form-grid--2col">
          <div
            v-for="field in section.fields"
            :key="field.key"
            class="field"
            :class="{ 'form-grid__full': field.fullWidth }"
          >
            <label class="field__label">
              {{ field.label }}
              <span v-if="field.required" class="field__required">*</span>
            </label>
            <input
              v-if="field.type !== 'select' && field.type !== 'textarea'"
              class="input"
              :class="{ 'input--error': errors[field.key] }"
              :type="field.type || 'text'"
              :placeholder="field.placeholder"
              v-model="formData[field.key]"
            />
            <select v-else-if="field.type === 'select'" class="input input--select" v-model="formData[field.key]">
              <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
            </select>
            <textarea v-else class="input input--textarea" :placeholder="field.placeholder" v-model="formData[field.key]" rows="3" />
            <span v-if="errors[field.key]" class="field__error-msg">{{ errors[field.key] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="form-action-bar">
      <button class="btn btn--ghost" @click="emit('cancel')">Hủy</button>
      <button class="btn btn--outline" @click="saveAndAdd">Lưu và thêm</button>
      <button class="btn btn--primary" @click="save">Lưu</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{ sections: FormSection[] }>()
const emit  = defineEmits<{ (e: 'cancel'): void; (e: 'save', data: any): void }>()

const formData = reactive<Record<string, any>>({})
const errors   = reactive<Record<string, string>>({})

function validate(): boolean {
  let ok = true
  // clear errors
  Object.keys(errors).forEach(k => delete errors[k])
  // check required
  for (const s of props.sections) {
    for (const f of s.fields) {
      if (f.required && !formData[f.key]) {
        errors[f.key] = `${f.label} không được để trống`
        ok = false
      }
    }
  }
  return ok
}

function save()      { if (validate()) emit('save', { ...formData }) }
function saveAndAdd() { if (validate()) { emit('save', { ...formData }); Object.keys(formData).forEach(k => delete formData[k]) } }
</script>
```

---

## 11. CONTENT WRAPPER — List Page đầy đủ

> ⛔ `app-shell` dùng `100vw × 100vh`, không hardcode `1366 × 768`.  
> `main-content` và `content-wrapper` dùng `flex: 1` để tự mở rộng.

```html
<!-- Full List Page layout — RESPONSIVE -->
<div class="app-shell">
  <!-- Global Header -->
  <header class="global-header">...</header>

  <div class="body-row">
    <!-- Sidebar -->
    <aside class="sidebar sidebar--expanded">...</aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title h2">Khách hàng</h1>
          </div>
          <div class="page-header__right">
            <button class="btn btn--outline btn--sm"><i class="icon-upload"></i> Nhập Excel</button>
            <button class="btn btn--primary btn--sm"><i class="icon-plus"></i> Thêm</button>
          </div>
        </div>

        <!-- Table Panel -->
        <div class="table-panel">
          <!-- Toolbar + Table + Paging -->
        </div>
      </div>
    </main>
  </div>
</div>
```

```css
/* Content Wrapper — bao page header + table panel */
.content-wrapper {
  display: flex; flex-direction: column;
  flex: 1; min-height: 0;  /* fix overflow trong flex */
  overflow: hidden;
  padding: 0 16px 16px 16px;  /* T=0, L/R/B=16 — theo MDS token */
  gap: 0;
}

/* Table panel chiếm hết chiều cao còn lại, scroll nội bộ ở table-wrap */
.table-panel { flex: 1; min-height: 0; }
.table-wrap  { flex: 1; min-height: 0; overflow: auto; }
```

---

## 12. ICON USAGE

```
Icons: dùng Tabler Icons (https://tabler.io/icons) hoặc SVG inline.
Tất cả icon slot trong MDS design map sang Tabler Icons tương ứng:

  icon-search          → tabler: search
  icon-plus            → tabler: plus
  icon-edit            → tabler: pencil
  icon-trash           → tabler: trash
  icon-upload          → tabler: upload
  icon-download        → tabler: download
  icon-refresh         → tabler: refresh
  icon-chevron-left    → tabler: chevron-left
  icon-chevron-right   → tabler: chevron-right
  icon-chevrons-left   → tabler: chevrons-left
  icon-chevrons-right  → tabler: chevrons-right
  icon-arrow-left      → tabler: arrow-left
  icon-x               → tabler: x
  icon-filter          → tabler: filter
  icon-settings        → tabler: settings
  icon-bell            → tabler: bell
  icon-user            → tabler: user
  icon-home            → tabler: home
  icon-trending-up     → tabler: trending-up
  icon-trending-down   → tabler: trending-down
  icon-eye             → tabler: eye
  icon-copy            → tabler: copy
  icon-more            → tabler: dots (horizontal)

Import Tabler Icons vào dự án:
  npm install @tabler/icons-vue
  → <IconPlus :size="16" />

TIcon.vue (tại @mds/components/TIcon.vue) — quy tắc bắt buộc:
  • TIcon dùng MAP thủ công — PHẢI làm ĐỦ 2 bước khi thêm icon mới:
    1. import { IconXxx } from '@tabler/icons-vue'
    2. Thêm vào MAP: 'ten-icon': IconXxx
  • Nếu chỉ làm 1 bước, icon sẽ render trống không có lỗi.
  • Kiểm tra icon tồn tại trong package trước khi thêm:
      node -e "const i=require('@tabler/icons-vue');console.log('IconXxx' in i)"

IconMisaAI.vue (tại @mds/components/IconMisaAI.vue) — component riêng biệt:
  • KHÔNG phải Tabler icon — là branding MISA riêng.
  • CSS gradient circle 24×24 + 21 vector PNG từ Figma asset, tất cả absolute inside.
  • 2 layer dùng mix-blend-mode: screen.
  • Dùng trực tiếp <IconMisaAI /> không qua TIcon.
```

---

## 13. ECHARTS — BIỂU ĐỒ

> Thư viện chart DUY NHẤT được dùng. CDN: `https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js`

### Setup chuẩn

```html
<!-- Container PHẢI là <div> với width/height rõ ràng -->
<div id="myChart" style="width:100%; height:220px;"></div>
```

```js
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }

/* Khởi tạo lazy khi container hiển thị */
const chart = echarts.init(document.getElementById('myChart'));

/* ── Font InterVariable toàn cục cho mọi text trong chart ──
   ⛔ NGHIÊM CẤM dùng 'Inter', 'Arial', 'system-ui' hay bất kỳ font nào khác.
   Phải set TRƯỚC setOption() đầu tiên.                                          */
const FONT = 'InterVariable, "Inter var", sans-serif';  // KHÔNG ĐƯỢC sửa chuỗi này
chart.setOption({
  textStyle: { fontFamily: FONT, fontSize: 11 }
});

/* Resize theo window */
window.addEventListener('resize', () => chart.resize());
```

> **Rule:** `textStyle` với `fontFamily: FONT` (`'InterVariable, "Inter var", sans-serif'`) PHẢI được set ngay sau `echarts.init()`, trước khi gọi bất kỳ `setOption()` nào khác.
> ⛔ **NGHIÊM CẤM** hardcode `'Inter, system-ui, sans-serif'` hoặc bất kỳ font nào khác — `'Inter'` không phải tên font đã cài, browser sẽ fallback sang Arial trên Windows.

### Chart color palette (đã định nghĩa trong `mds-ui/src/style.css`)

| Biến | Hex | Dùng cho |
|---|---|---|
| `--chart-c1` | `#245fdf` | Brand blue — series chính / cột đơn |
| `--chart-c2` | `#12b76a` | Success green — tuyển mới / tăng trưởng |
| `--chart-c3` | `#f79009` | Warning orange — cảnh báo / trung tính |
| `--chart-c4` | `#f04438` | Danger red — nghỉ việc / giảm |
| `--chart-c5` | `#0ba5ec` | Info cyan — thông tin bổ sung |
| `--chart-c6` | `#7a5af8` | Accent purple — phân loại thứ 6 |

```js
// Dùng đúng: luôn qua cssVar()
itemStyle: { color: cssVar('--chart-c1') }

// SAI: không tự đặt tên biến không tồn tại
itemStyle: { color: cssVar('--chart-revenue') }  // ← undefined → màu lỗi
```

> **⚠️ NGHIÊM CẤM** dùng tên biến `--chart-revenue`, `--chart-profit` hay bất kỳ tên nào không có trong bảng trên. Chỉ dùng `--chart-c1` đến `--chart-c6`.

---

### ⚠️ RULES STYLING BẮT BUỘC

#### 1. Bar / Column chart — bo góc đỉnh thanh

Mọi series `type: 'bar'` đều PHẢI có bo góc 4px tại 2 góc đỉnh của thanh.

| Hướng thanh | `borderRadius` |
|---|---|
| **Column** (dọc — xAxis = category) | `[4, 4, 0, 0]` — bo góc trên-trái + trên-phải |
| **Bar** (ngang — yAxis = category) | `[0, 4, 4, 0]` — bo góc phải-trên + phải-dưới |

```js
// Column chart
itemStyle: { color: cssVar('--chart-c1'), borderRadius: [4, 4, 0, 0] }

// Horizontal bar chart
itemStyle: { color: cssVar('--chart-c1'), borderRadius: [0, 4, 4, 0] }
```

#### 2. Pie / Donut chart — bo góc slice + gap giữa các phần

Mọi series `type: 'pie'` đều PHẢI có:
- **Bo góc ngoài** 4px: `itemStyle.borderRadius: [4, 0]` → `[outerCorner, innerCorner]`
- **Gap 2px** giữa các slice: `itemStyle.borderColor: '#fff', borderWidth: 2`

```js
// Áp dụng ở cấp series (default cho toàn bộ slice)
itemStyle: {
  borderRadius: [4, 0],   // bo 4px góc ngoài; góc trong (donut hole) = 0
  borderColor: '#fff',    // màu nền trang = trắng → tạo gap trắng
  borderWidth: 2          // 2px gap giữa các slice
}
```

> **Lưu ý:** `borderColor` phải khớp với màu nền card/trang. Nếu card nền `var(--bg-neutral-light)` thì dùng `borderColor: getComputedStyle(...).getPropertyValue('--bg-neutral-light')` hoặc hardcode màu tương đương.

---

### Bar + Line combo

```js
chart.setOption({
  grid: { top: 12, right: 8, bottom: 28, left: 44 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: {
    type: 'category', data: ['T1','T2','T3','T4','T5','T6','T7'],
    axisTick: { show: false }, axisLine: { show: false },
    axisLabel: { color: cssVar('--text-hint'), fontSize: 11 }
  },
  yAxis: {
    type: 'value', splitLine: { lineStyle: { color: cssVar('--stroke-neutral-light'), type: 'dashed' } },
    axisLabel: { color: cssVar('--text-hint'), fontSize: 11 },
    axisLine: { show: false }, axisTick: { show: false }
  },
  series: [
    {
      name: 'Doanh thu', type: 'bar',
      data: [380, 350, 980, 440, 420, 400, 390],
      itemStyle: { color: cssVar('--chart-c1'), borderRadius: [4, 4, 0, 0] }, // ← bo góc đỉnh
      barMaxWidth: 40
    },
    {
      name: 'Lợi nhuận', type: 'line',
      data: [260, 250, 820, 380, 360, 340, 320],
      smooth: true,
      lineStyle: { color: cssVar('--chart-c2'), width: 2.5 },
      itemStyle: { color: cssVar('--chart-c2'), borderColor: '#fff', borderWidth: 2 },
      symbol: 'circle', symbolSize: 8
    }
  ]
});
```

### Donut (Pie với radius kép)

```js
chart.setOption({
  tooltip: { trigger: 'item', formatter: '{b}: <b>{c}%</b>' },
  series: [{
    type: 'pie',
    radius: ['55%', '78%'],
    center: ['50%', '50%'],
    label: { show: false }, labelLine: { show: false },
    itemStyle: {
      borderRadius: [4, 0],  // ← bo 4px góc ngoài (cạnh trên của arc)
      borderColor: '#fff',   // ← gap trắng
      borderWidth: 2         // ← 2px gap giữa các slice
    },
    data: [
      { value: 40, name: 'Lương',     itemStyle: { color: cssVar('--chart-c1') } },
      { value: 20, name: 'Media',     itemStyle: { color: cssVar('--chart-c2') } },
      { value: 15, name: 'Mặt bằng', itemStyle: { color: cssVar('--chart-c3') } },
      { value: 10, name: 'Vận hành', itemStyle: { color: cssVar('--chart-c4') } },
      { value: 10, name: 'Tiện ích', itemStyle: { color: cssVar('--chart-c5') } },
      { value: 5,  name: 'Khác',     itemStyle: { color: cssVar('--chart-c6') } }
    ]
  }]
});
```

### Pie thuần (không có hole)

```js
chart.setOption({
  series: [{
    type: 'pie',
    radius: '70%',
    itemStyle: {
      borderRadius: [4, 0],  // ← bo 4px góc ngoài
      borderColor: '#fff',
      borderWidth: 2
    },
    data: [ /* ... */ ]
  }]
});
```

---

## 14. GLOBAL HEADER — ControlHeader Component

> Component chuẩn tại `@mds/components/ControlHeader.vue`. Import và dùng trực tiếp trong app.

### Slots
- `#header-left` — logo + tên app
- `#header-meta` — company selector + year badge (nằm giữa left và center-search)
- `#header-center` — search box
- `#header-right` — không dùng (toolbar buttons đã built-in)

### header-company (combo chọn đơn vị)
```css
.header-company {
  font-size: 14px; font-weight: var(--fw-medium);
  color: white; background: transparent; border: none;
  padding: 4px 6px; border-radius: var(--radius-default);
}
.header-company:hover { background: rgba(255,255,255,0.12); }
```

### header-year-badge (pill năm tài chính)
```css
.header-year-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 0 12px 0 8px; height: 28px; border-radius: var(--radius-default);
  font-size: 12px; font-weight: 400;
  background: rgba(255,255,255,0.2); color: white;
}
```

### Toolbar button order (Figma standard — KHÔNG được đổi thứ tự)
Settings → MISA AI (`<IconMisaAI />`) → AMIS Chat (img + badge) → Bell → Help → More (dots-circle-horizontal)

### White header mode (Giao diện sáng)
- `currentMode` ref trong `theme.js` — giá trị `'color'` (brand bg) hoặc `'light'` (white bg)
- `applyMode(mode)` persist vào `localStorage('mds-header-mode')`
- Header toggle: `:class="{ 'global-header--white': currentMode === 'light' }"`
- CSS override `.global-header--white`:
  ```css
  .global-header--white { background: var(--bg-white); border-bottom: 1px solid var(--stroke-neutral-light); }
  .global-header--white .header-company       { color: var(--text-primary); }
  .global-header--white .header-company:hover { background: var(--bg-neutral-hover); }
  .global-header--white .header-year-badge    { background: transparent; border: 1px solid var(--stroke-neutral); color: var(--text-primary); }
  .global-header--white .btn-icon-white       { color: var(--icon-neutral); }
  .global-header--white .search-box-header    { background: var(--bg-neutral-light); }
  ```

### Settings dialog — mini preview header
```js
const miniHeaderStyle = computed(() => draftMode.value === 'light'
  ? { background: 'white', borderBottom: '1px solid #e9eaeb' }
  : { background: previewColor.value.main }
)
```

---

## 15. CHECKLIST SAU KHI VIẾT CODE

```
CONTROLS PRE-CHECK — Phải pass TRƯỚC khi viết code (không phải sau)
□ Đã đọc vue-controls.md trước khi bắt đầu?
□ Mọi Vue component (TableHeader, DataTable, AppSidebar, ControlHeader...) đều kéo từ mds-ui?
□ Mọi button đều dùng class từ danh sách đã duyệt (btn--primary, btn--outline btn--neutral...)?
□ Không có HTML bảng thủ công nào — tất cả bảng dùng DataTable component?
□ Element nào chưa có trong danh sách → đã để trống và báo user chưa?
□ Không tự thêm prop/slot/CSS override lên component gốc?

RESPONSIVE & LAYOUT
□ app-shell dùng 100vw × 100vh — KHÔNG hardcode 1366px / 768px?
□ Cấu trúc đúng: app-shell → header → body-row → [sidebar-host + main-content]?
□ Sidebar nằm sát header, KHÔNG có element nào chen giữa header và sidebar?
□ Sub-nav tabs (nếu có) đặt TRONG main-content, KHÔNG đặt ngoài body-row?
□ Sub-nav chiều cao đúng 48px?
□ sidebar-host là flex item (position:relative), sidebar là position:absolute bên trong?
□ Sidebar hover-expand dùng CSS :hover — KHÔNG dùng JS mouseenter/mouseleave?
□ btn-add-quick text dùng max-width:0/overflow:hidden (KHÔNG opacity:0 vì giữ layout space)?
□ Sidebar item label dùng class .sidebar-item__label (không dùng <span> thuần)?
□ Sidebar item icon: color = --icon-neutral (explicit)?  Sidebar item text: color = --text-primary?
□ Sidebar, header có fixed height/width MDS — main content dùng flex:1?
□ flex children có min-height: 0 / min-width: 0 để tránh overflow?
□ table-wrap có overflow: auto để scroll nội bộ?
□ form-grid có @media breakpoint thu về 1 cột khi màn nhỏ?

DESIGN TOKENS
□ Tất cả màu dùng CSS variable (--text-*, --bg-*, --stroke-*)?
□ Spacing lấy từ token variable (không hardcode px tùy ý)?
□ Button height 32px? Min-width 80px?
□ Input height 32px? Padding 8px 12px?
□ Table row height 56px?
□ Pagination height 48px?
□ Page Header height 56px?
□ Global Header height 48px?
□ Sidebar width 200px (expanded) / 64px (collapsed)?
□ Modal border-radius 12px? Shadow dùng --shadow-dialog?
□ Card/Panel border-radius: compact=6px (--radius-inner), medium/comfortable=8px (--radius-default)?
□ Control (input, button, tag...): compact dùng --radius-inner, còn lại dùng --radius-default?
□ Form grid: 2 cột, gap 32px horizontal / 16px vertical?

CODE QUALITY
□ Vue component: dùng Composition API (<script setup>)?
□ Không có placeholder text tự bịa — label, cột, dữ liệu lấy đúng từ yêu cầu?
□ Icon dùng đúng Tabler Icons class?
□ Không hardcode hex nào ngoài CSS variables?
□ Code chạy được ngay, không có TODO hay ...?
□ Card/panel trắng trên nền xám dùng box-shadow: var(--shadow-card)? KHÔNG có border nào?
□ Scorecard/KPI: title 13px semibold text-secondary, value 20px bold text-primary?
□ Card lớn (chart/list/table): title dùng H3 — 16px semibold text-primary?

CHART (nếu có biểu đồ)
□ Dùng ECharts 5 (CDN), KHÔNG dùng Chart.js hay thư viện khác?
□ Container là <div> (không phải <canvas>)?
□ Màu sắc đọc qua cssVar(), không hardcode hex trong setOption()?
□ Có gọi chart.resize() khi window resize?
□ Font Inter đã set qua textStyle global? (xem Section 13 — Setup chuẩn)
□ Bar/Column chart: borderRadius: [4,4,0,0] (column) hoặc [0,4,4,0] (bar ngang)?
□ Pie/Donut chart: itemStyle có borderRadius:[4,0], borderColor:'#fff', borderWidth:2?
```
