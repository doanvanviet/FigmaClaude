# MDS Mobile App Designer

Skill thiết kế màn hình **Mobile App** sử dụng **MDS Mobile Components v2.0**.

**Figma library file:** `F7oYdUUaUYVie57LA7DX2B`
**Logo library file:** `DxJfoNpKGaw6JvJcJn8RHT`

**MANDATORY:** Load [figma-use](../../../plugins/cache/claude-plugins-official/figma/2.1.30/skills/figma-use/SKILL.md) và [figma-generate-design](../../../plugins/cache/claude-plugins-official/figma/2.1.30/skills/figma-generate-design/SKILL.md) trước mọi `use_figma` call.

---

## ⛔ QUY TẮC SỐ 1 — COMPONENT FIRST (BẮT BUỘC TUYỆT ĐỐI)

```
NGHIÊM CẤM tự vẽ button, input, checkbox, badge, chip, divider,
avatar, alert, navigation bar, status bar... bằng primitive shapes
khi chưa tìm kiếm trong thư viện MDS Mobile.

QUY TRÌNH BẮT BUỘC cho mọi control:
  1. Tra cứu references/components.md — nếu có key → dùng ngay
  2. Nếu không có trong docs → search_design_system(query, fileKey=WORKING_FILE)
  3. Nếu tìm thấy → importComponentSetByKeyAsync(key) → createInstance()
  4. Chọn đúng variant (Color, Style, State, Size, Type...)
  5. Chỉ tự vẽ custom khi xác nhận không có trong thư viện → ghi chú lý do

KHÔNG được thay đổi variant ngoài danh sách có sẵn trong component.
```

---

## Khi nào dùng skill này

- Thiết kế màn hình **mobile app** (iOS/Android)
- Các sản phẩm: AMIS Mobile, MISA QLNS Mobile, CUKCUK Mobile, EMIS Mobile
- Màn hình: Login, Home/Dashboard, List, Form, Detail, Bottom Sheet, Dialog

## Workflow

1. **Đọc** [references/components.md](references/components.md) — có sẵn keys đầy đủ
2. **Xác định loại màn hình** → load prompt tương ứng trong `prompts/`
3. **Inspect file** — `get_metadata` xem nội dung hiện tại
4. **Tìm logo** nếu cần → [assets/library-info.txt](assets/library-info.txt)
5. **Tạo frame** chuẩn mobile (390×844 hoặc 375×812)
6. **Import Status Bar + Navigation Bar** từ thư viện trước
7. **Build từng section** — import component, set variant, override text
8. **Screenshot validate** sau mỗi section

## Thông số Mobile chuẩn MDS

### Frame sizes
| Thiết bị | Kích thước |
|---------|-----------|
| iPhone 14 Pro (chuẩn) | 390 × 844 |
| iPhone SE | 375 × 667 |
| iPhone 14 Pro Max | 430 × 932 |
| Android chuẩn | 360 × 800 |

### Font — Inter (fallback khi SF Pro Text không available)
```js
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });
// SF Pro Text thường không available trong môi trường plugin
// → dùng Inter làm fallback, chấp nhận được
```

### Màu sắc MDS Mobile (dùng khi không có variable)
| Token | Hex | RGB (0–1) |
|-------|-----|-----------|
| Brand/Primary | `#0499E4` | `{r:0.016, g:0.600, b:0.894}` |
| Text/Primary | `#111827` | `{r:0.067, g:0.094, b:0.153}` |
| Text/Secondary | `#6B7280` | `{r:0.420, g:0.447, b:0.502}` |
| Text/Placeholder | `#9CA3AF` | `{r:0.612, g:0.639, b:0.686}` |
| Border/Default | `#E5E7EB` | `{r:0.898, g:0.906, b:0.922}` |
| BG/Page | `#F3F4F6` | `{r:0.953, g:0.957, b:0.965}` |
| BG/White | `#FFFFFF` | `{r:1, g:1, b:1}` |
| BG/Input | `#F9FAFB` | `{r:0.976, g:0.980, b:0.988}` |
| Success | `#16A34A` | `{r:0.086, g:0.639, b:0.290}` |
| Warning | `#D97706` | `{r:0.851, g:0.467, b:0.024}` |
| Danger | `#DC2626` | `{r:0.863, g:0.149, b:0.149}` |

### Spacing Mobile chuẩn
| Dùng cho | Giá trị |
|---------|---------|
| Padding màn hình | 16px–20px |
| Padding section | 16px |
| Gap giữa items | 12px |
| Gap trong row | 8px |
| Input height | 48px–52px |
| Button height | 48px (Medium), 40px (Small) |
| Nav bar height | 64px |
| Status bar height | 44px (iPhone notch) |
| Tab bar height | 83px (iPhone với home indicator) |

### Corner radius Mobile
| Element | Radius |
|---------|--------|
| Button | 8px |
| Input | 12px |
| Card | 12px |
| Sheet/Modal | 20px top corners |
| Chip/Tag | 100px |
| Avatar | 100px (circle) |

## References

- [references/components.md](references/components.md) — Component keys Mobile v2.0 (đầy đủ)
- [references/screen-patterns.md](references/screen-patterns.md) — Mobile screen patterns
- [assets/library-info.txt](assets/library-info.txt) — File keys & logo keys
