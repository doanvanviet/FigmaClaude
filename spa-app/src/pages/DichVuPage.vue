<template>
  <AppShell>
    <!-- Tab by category -->
    <div class="tab-area">
      <button
        v-for="tab in categoryTabs" :key="tab.value"
        class="tab-item" :class="{ 'tab-item--active': activeCategory === tab.value }"
        @click="activeCategory = tab.value"
      >
        {{ tab.label }}
        <span class="tab-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Table Panel -->
    <div class="table-panel">
      <div class="th-wrapper">
        <TableHeader
          v-model="searchText"
          search-placeholder="Tìm kiếm dịch vụ..."
          :search-width="240"
          :main-function-button="true"
          @refresh="() => {}"
          @export="() => {}"
        >
          <template #filters>
            <select class="input input--select" style="width:130px" v-model="filterPrice">
              <option value="">Tất cả mức giá</option>
              <option value="low">Dưới 300k</option>
              <option value="mid">300k – 600k</option>
              <option value="high">Trên 600k</option>
            </select>
          </template>
          <template #main-buttons>
            <AppButton label="Thêm dịch vụ" icon-left="plus" @click="openAdd" />
          </template>
        </TableHeader>
      </div>

      <div class="table-scroll">
        <DataTable
          :columns="columns"
          :rows="pagedRows"
          :row-actions="rowActions"
          :hide-blank-rows="true"
          @row-click="openDetail"
          @edit-row="openEdit"
          @delete-row="confirmDelete"
        />
      </div>

      <AppPagination
        :total="filteredRows.length"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
      />
    </div>

    <!-- Add/Edit Modal -->
    <AppModal
      v-if="showModal"
      :title="editingId ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'"
      :width="580"
      @close="closeModal"
    >
      <template #body>
        <div class="form-grid">
          <AppInput label="Tên dịch vụ" required vertical style="grid-column:1/-1">
            <AppTextbox v-model="form.name" placeholder="Nhập tên dịch vụ" />
          </AppInput>
          <AppInput label="Danh mục" required vertical>
            <AppCombobox v-model="form.category" :options="categoryOptions" placeholder="Chọn danh mục" />
          </AppInput>
          <AppInput label="Thời gian thực hiện" vertical>
            <AppNumberbox v-model="form.duration" :min="15" :step="15" suffix=" phút" />
          </AppInput>
          <AppInput label="Giá dịch vụ" required vertical>
            <AppNumberbox v-model="form.price" :min="0" :step="50000" suffix=" ₫" />
          </AppInput>
          <AppInput label="Mô tả" vertical style="grid-column:1/-1">
            <AppTextarea v-model="form.description" placeholder="Mô tả ngắn về dịch vụ..." rows="3" />
          </AppInput>
        </div>
      </template>
      <template #footer>
        <AppButton label="Hủy"    variant="outline" color="neutral" @click="closeModal" />
        <AppButton :label="editingId ? 'Cập nhật' : 'Thêm dịch vụ'" icon-left="check" @click="handleSave" />
      </template>
    </AppModal>
  </AppShell>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import AppShell      from '../components/AppShell.vue'
import AppModal      from '../components/AppModal.vue'
import DataTable     from '@mds/components/DataTable.vue'
import TableHeader   from '@mds/components/TableHeader.vue'
import AppPagination from '@mds/components/AppPagination.vue'
import AppButton     from '@mds/components/AppButton.vue'
import AppInput      from '@mds/components/AppInput.vue'
import AppTextbox    from '@mds/components/AppTextbox.vue'
import AppTextarea   from '@mds/components/AppTextarea.vue'
import AppCombobox   from '@mds/components/AppCombobox.vue'
import AppNumberbox  from '@mds/components/AppNumberbox.vue'
import { services as _services, SERVICE_CATEGORIES, formatCurrency, getCategoryLabel } from '../data/mockData.js'

const rows         = ref([..._services])
const searchText   = ref('')
const filterPrice  = ref('')
const activeCategory = ref('all')
const currentPage  = ref(1)
const pageSize     = ref(10)

const categoryTabs = computed(() => [
  { value: 'all', label: 'Tất cả', count: rows.value.length },
  ...SERVICE_CATEGORIES.map(c => ({
    value: c.value,
    label: c.label,
    count: rows.value.filter(r => r.category === c.value).length,
  })),
])

const filteredRows = computed(() => {
  const q = searchText.value.toLowerCase()
  return rows.value
    .filter(r => activeCategory.value === 'all' || r.category === activeCategory.value)
    .filter(r => {
      if (!filterPrice.value) return true
      if (filterPrice.value === 'low')  return r.price < 300000
      if (filterPrice.value === 'mid')  return r.price >= 300000 && r.price <= 600000
      if (filterPrice.value === 'high') return r.price > 600000
      return true
    })
    .filter(r => !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    .map(r => ({
      ...r,
      categoryTag:    [{ label: getCategoryLabel(r.category), color: categoryColor(r.category) }],
      priceDisplay:   formatCurrency(r.price),
      durationDisplay: r.duration + ' phút',
    }))
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

const columns = [
  { key: 'name',            label: 'Tên dịch vụ',   fill: true },
  { key: 'categoryTag',     label: 'Danh mục',      type: 'tag', width: 160, noFilter: true },
  { key: 'durationDisplay', label: 'Thời gian',     width: 100, noFilter: true },
  { key: 'priceDisplay',    label: 'Giá dịch vụ',  width: 130, noFilter: true },
]

const rowActions = [
  { icon: 'pencil', emit: 'edit-row',   title: 'Chỉnh sửa' },
  { icon: 'trash',  emit: 'delete-row', title: 'Xóa', danger: true },
]

function categoryColor(cat) {
  const map = {
    'cham-soc-da':     'brand',
    'massage':         'success',
    'nail':            'accent',
    'toc':             'warning',
    'cham-soc-co-the': 'info',
  }
  return map[cat] || 'neutral'
}

// Form
const showModal  = ref(false)
const editingId  = ref(null)
const form = reactive({ name: '', category: '', duration: 60, price: 300000, description: '' })
const categoryOptions = SERVICE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))

function openAdd() {
  editingId.value = null
  Object.assign(form, { name: '', category: '', duration: 60, price: 300000, description: '' })
  showModal.value = true
}
function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, { name: row.name, category: row.category, duration: row.duration, price: row.price, description: row.description })
  showModal.value = true
}
function openDetail(row) { openEdit(row) }
function closeModal() { showModal.value = false }

function handleSave() {
  if (editingId.value) {
    const idx = rows.value.findIndex(r => r.id === editingId.value)
    if (idx > -1) Object.assign(rows.value[idx], { ...form })
  } else {
    rows.value.unshift({ id: rows.value.length + 100, ...form })
  }
  closeModal()
}
function confirmDelete(row) {
  if (confirm(`Xóa dịch vụ "${row.name}"?`)) rows.value = rows.value.filter(r => r.id !== row.id)
}
</script>

<style scoped>

.tab-area {
  display: flex;
  background: var(--bg-white);
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
.th-wrapper { padding: 0; }
.table-scroll { flex: 1; overflow: auto; }

.form-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px;
}

.input--select {
  height: var(--input-height); padding: 0 8px;
  border: 1px solid var(--stroke-neutral); border-radius: var(--radius-default);
  font-size: 13px; color: var(--text-primary); background: var(--bg-white);
}
</style>
