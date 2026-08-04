# List Page Patterns — Vue 3 Code

> Patterns cho màn hình danh sách (có/không có tab). Đọc file này khi build page có DataTable + Pagination.

---

## Hai biến thể cấu trúc trang danh sách

| Biến thể | Page Header | Tab Area | Nút Thêm | `main-function-button` |
|----------|-------------|----------|----------|------------------------|
| **Không có tab** | ✅ Có — chứa title + Primary Button | ❌ Không | Trong `.page-header__right` | ❌ **KHÔNG set** |
| **Có tab** | ❌ **Không có** — bỏ hẳn | ✅ Ngay đầu trang | Trong `TableHeader` slot `#main-buttons` | ✅ **Phải set `true`** |

**⛔ Quy tắc bắt buộc:**
- **NGHIÊM CẤM** để nút Thêm xuất hiện ở CẢ HAI nơi (page-header và main-buttons cùng lúc)
- Trang **có tab** → TableHeader **PHẢI** có `:main-function-button="true"` + slot `#main-buttons`
- Trang **không có tab** → TableHeader **KHÔNG** có `:main-function-button`

---

## Template chuẩn — Trang KHÔNG CÓ TAB

```html
<AppShell>
  <div class="page-header">
    <div class="page-header__left"><h1 class="page-header__title h2">Nhân viên</h1></div>
    <div class="page-header__right">
      <AppButton label="Thêm nhân viên" icon-left="plus" @click="openAdd" />
    </div>
  </div>
  <div class="table-panel">
    <div class="th-wrapper">
      <TableHeader v-model="searchText" @refresh="() => {}" @export="() => {}">
        <!-- KHÔNG có :main-function-button="true", KHÔNG có slot #main-buttons -->
      </TableHeader>
    </div>
    <div class="table-scroll">
      <DataTable :columns="columns" :rows="pagedRows" :row-actions="rowActions" :hide-blank-rows="true"
        @row-click="openDetail" @edit-row="openEdit" @delete-row="confirmDelete" />
    </div>
    <AppPagination :total="filteredRows.length" v-model:current-page="currentPage" v-model:page-size="pageSize" />
  </div>
</AppShell>
```

```css
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  height: var(--layout-page-header-h); padding: 0 16px;
  background: var(--bg-white); border-bottom: 1px solid var(--stroke-divider);
  flex-shrink: 0;
}
.page-header__left  { display: flex; align-items: center; }
.page-header__title { margin: 0; }
.page-header__right { display: flex; gap: 8px; }

.table-panel {
  display: flex; flex-direction: column; flex: 1; overflow: hidden;
  background: var(--bg-white); margin: 16px;
  border-radius: var(--radius-default); box-shadow: var(--shadow-card);
}
.th-wrapper  { padding: 0; }            /* ← KHÔNG thêm border-bottom */
.table-scroll { flex: 1; overflow: auto; }
```

---

## Template chuẩn — Trang CÓ TAB

```html
<AppShell>
  <div class="tab-area">               <!-- ← ngay sát dưới Global Header, KHÔNG có page-header -->
    <button class="tab-item" :class="{ 'tab-item--active': activeTab === 'all' }" @click="activeTab = 'all'">
      Tất cả <span class="tab-badge">{{ rows.length }}</span>
    </button>
    <button class="tab-item" :class="{ 'tab-item--active': activeTab === 'confirmed' }" @click="activeTab = 'confirmed'">
      Đã xác nhận
    </button>
  </div>
  <div class="table-panel">
    <div class="th-wrapper">
      <TableHeader v-model="searchText" :main-function-button="true" @refresh="() => {}" @export="() => {}">
        <template #main-buttons>
          <AppButton label="Thêm lịch hẹn" icon-left="plus" @click="openAdd" />
        </template>
      </TableHeader>
    </div>
    <div class="table-scroll">
      <DataTable :columns="columns" :rows="pagedRows" :row-actions="rowActions" :hide-blank-rows="true"
        @row-click="openDetail" @edit-row="openEdit" @delete-row="confirmDelete" />
    </div>
    <AppPagination :total="filteredRows.length" v-model:current-page="currentPage" v-model:page-size="pageSize" />
  </div>
</AppShell>
```

```css
.tab-area {
  display: flex; background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-divider);
  padding: 0 16px; flex-shrink: 0;
}
.tab-item {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px; font-size: 13px; font-weight: var(--fw-medium);
  color: var(--text-secondary); background: transparent; border: none;
  border-bottom: 2px solid transparent; cursor: pointer; margin-bottom: -1px;
  white-space: nowrap; transition: color 0.15s, border-color 0.15s;
}
.tab-item:hover { color: var(--text-primary); }
.tab-item--active { color: var(--bg-brand); border-bottom-color: var(--bg-brand); font-weight: var(--fw-semibold); }
.tab-badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: var(--bg-neutral-light); color: var(--text-secondary);
  border-radius: 9999px; font-size: 11px;
}
.tab-item--active .tab-badge { background: var(--bg-brand-light); color: var(--bg-brand); }

.table-panel {
  display: flex; flex-direction: column; flex: 1; overflow: hidden;
  background: var(--bg-white); margin: 16px;
  border-radius: var(--radius-default); box-shadow: var(--shadow-card);
}
.th-wrapper  { padding: 0; }
.table-scroll { flex: 1; overflow: auto; }
```

---

## DataTable — Action buttons chỉ hiện khi hover

**KHÔNG dùng `type: 'action-icon'` trong columns** — loại này luôn hiện buttons.

Dùng **`:row-actions` prop** — DataTable đã có CSS `opacity: 0 → 1` on hover sẵn:

```html
<DataTable
  :columns="columns"
  :rows="pagedRows"
  :row-actions="rowActions"
  @edit-row="openEdit"
  @delete-row="confirmDelete"
/>
```

```js
const rowActions = [
  { icon: 'pencil', emit: 'edit-row',   title: 'Chỉnh sửa' },
  { icon: 'trash',  emit: 'delete-row', title: 'Xóa', danger: true },
]

// columns: KHÔNG có _actions entry
const columns = [
  { key: 'name', label: 'Tên', fill: true },
  // ...
]
```

---

## Bulk Action — TableHeader với selection

```html
<TableHeader
  v-model="searchText"
  :bulk-action="selected.length > 0"
  :selected-count="selected.length"
  @deselect-all="selected = []"
>
  <template #bulk-buttons>
    <AppButton label="Xác nhận" variant="outline" color="primary" @click="bulkConfirm" />
    <AppButton label="Hủy"      variant="outline" color="neutral" @click="bulkCancel" />
  </template>
</TableHeader>
```

```html
<DataTable
  :columns="columns"
  :rows="pagedRows"
  v-model:selected="selected"
  ...
/>
```

```js
// Checkbox column bắt buộc:
const columns = [
  { key: '_cb', type: 'checkbox', width: 40, noFilter: true },
  // ...data cols...
]

// Checkbox body cell — PHẢI wrap trong <div @click.stop>:
// (DataTable.vue đã xử lý nội bộ, chỉ cần truyền checkbox col đúng)
```

---

## AppButton — Size theo vị trí

| Size | Prop | Chiều cao | Dùng ở đâu |
|------|------|-----------|------------|
| `md` | *(không ghi)* | 32px | `page-header__right`, `#main-buttons`, modal footer |
| `lg` | `size="lg"` | 40px | Chỉ khi user yêu cầu rõ |

> **⚠️ `size="sm"` = 28px — KHÔNG dùng trong TableHeader.** Search/filter/icon-button đều 32px. Dùng `sm` → thấp hơn 4px, lỗi alignment.

---

## `.th-wrapper` — chỉ `padding: 0`

`TableHeader` component tự có `padding: 12px 16px`. DataTable header row tự có `border-top`.

```css
/* ✅ ĐÚNG */
.th-wrapper { padding: 0; }

/* ❌ SAI — double padding */
.th-wrapper { padding: 0 12px; }

/* ❌ SAI — double line */
.th-wrapper { border-bottom: 1px solid var(--stroke-divider); }
```

---

## ControlHeader — Props

```html
<!-- App KHÔNG có chi nhánh (spa, POS, nội bộ) -->
<ControlHeader app-name="Spa & Làm đẹp" :no-meta="true" />

<!-- App CÓ chi nhánh (kế toán, ERP) -->
<ControlHeader app-name="Kế toán" />

<!-- App có tag -->
<ControlHeader app-name="Báo cáo" app-tag="Beta" :no-meta="true" />
```

| Prop | Mô tả |
|------|-------|
| `app-name` | Tên ứng dụng |
| `app-tag` | Tag nhỏ bên cạnh (vd: "Beta") |
| `no-meta` | Ẩn branch/company khi `true` |

Slots: `#header-meta`, `#header-search`, `#header-actions`
