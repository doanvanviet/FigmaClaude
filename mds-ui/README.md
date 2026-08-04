# MDS UI — Thư viện component dùng chung

Dùng chung cho mọi project Vue 3 theo chuẩn MDS Web Components v2.0.

## Cấu trúc
```
mds-ui/src/
├── style.css           ← Design tokens (màu, spacing, radius, typography)
├── theme.js            ← Quản lý theme màu (10 màu, lưu localStorage)
├── index.js            ← Barrel export tất cả components
└── components/
    ├── ControlHeader.vue  ← Header chung (có Thiết lập màu sắc & hiển thị)
    └── AppSidebar.vue     ← Sidebar collapsible
```

## Dùng trong project mới

### 1. Vite alias (vite.config.js)
```js
import path from 'path'
export default {
  resolve: {
    alias: { '@mds': path.resolve(__dirname, '../mds-ui/src') }
  }
}
```

### 2. Import
```vue
<script setup>
import ControlHeader from '@mds/components/ControlHeader.vue'
import AppSidebar    from '@mds/components/AppSidebar.vue'
</script>
```

### 3. CSS (main.js)
```js
import '@mds/style.css'
```

## Các project đang dùng
- D:\figma\ketoan-dashboard\
