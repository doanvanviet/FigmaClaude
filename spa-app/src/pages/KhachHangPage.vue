<template>
  <AppShell>
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title h2">Khách hàng</h1>
      </div>
      <div class="page-header__right">
        <AppButton label="Thêm khách hàng" icon-left="plus" @click="openAdd" />
      </div>
    </div>

    <div class="table-panel">
      <div class="th-wrapper">
        <TableHeader
          v-model="searchText"
          search-placeholder="Tìm tên, SĐT, email..."
          :search-width="260"
          :bulk-action="selected.length > 0"
          :selected-count="selected.length"
          @refresh="() => {}"
          @export="() => {}"
          @deselect-all="selected = []"
        >
          <template #bulk-buttons>
            <AppButton label="Xuất danh sách" variant="outline" color="primary" icon-left="file-export" @click="bulkExport" />
            <AppButton label="Xóa"            variant="outline" color="neutral" icon-left="trash"       @click="bulkDelete" />
          </template>
        </TableHeader>
      </div>

      <div class="table-scroll">
        <DataTable
          :columns="columns"
          :rows="pagedRows"
          :row-actions="rowActions"
          v-model:selected="selected"
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
      :title="editingId ? 'Chỉnh sửa hồ sơ khách hàng' : 'Thêm khách hàng mới'"
      :width="600"
      @close="closeModal"
    >
      <template #body>
        <div class="form-grid">
          <AppInput label="Họ và tên" required vertical style="grid-column:1/-1">
            <AppTextbox v-model="form.name" placeholder="Nguyễn Thị A" />
          </AppInput>
          <AppInput label="Số điện thoại" required vertical>
            <AppTextbox v-model="form.phone" placeholder="09xx xxx xxx" type="tel" />
          </AppInput>
          <AppInput label="Email" vertical>
            <AppTextbox v-model="form.email" placeholder="email@domain.com" type="email" />
          </AppInput>
          <AppInput label="Ngày sinh" vertical>
            <AppDatebox v-model="form.birthDate" />
          </AppInput>
          <AppInput label="Loại da / Ghi chú về da" vertical>
            <AppTextbox v-model="form.skinNote" placeholder="Da dầu, da khô, nhạy cảm..." />
          </AppInput>
          <AppInput label="Sở thích & lưu ý" vertical style="grid-column:1/-1">
            <AppTextarea v-model="form.preference" placeholder="Sở thích dịch vụ, yêu cầu đặc biệt..." rows="3" />
          </AppInput>
        </div>
      </template>
      <template #footer>
        <AppButton label="Hủy"    variant="outline" color="neutral" @click="closeModal" />
        <AppButton :label="editingId ? 'Cập nhật' : 'Lưu hồ sơ'" icon-left="check" @click="handleSave" />
      </template>
    </AppModal>

    <!-- Detail Modal -->
    <AppModal v-if="showDetail && detailRow" title="Hồ sơ khách hàng" :width="620" @close="showDetail = false">
      <template #body>
        <div class="detail-profile">
          <div class="detail-avatar">
            <span class="avatar-xl">{{ initials(detailRow.name) }}</span>
            <div class="detail-name-block">
              <h3 class="detail-name">{{ detailRow.name }}</h3>
              <span class="detail-phone">{{ detailRow.phone }}</span>
            </div>
          </div>
          <div class="stats-row">
            <div class="stat-box">
              <span class="stat-value">{{ detailRow.visitCount }}</span>
              <span class="stat-label">Lần ghé thăm</span>
            </div>
            <div class="stat-box stat-box--brand">
              <span class="stat-value">{{ detailRow.points }}</span>
              <span class="stat-label">Điểm tích lũy</span>
            </div>
            <div class="stat-box stat-box--success">
              <span class="stat-value">{{ formatCurrency(detailRow.totalSpent) }}</span>
              <span class="stat-label">Tổng chi tiêu</span>
            </div>
          </div>
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">{{ detailRow.email || '—' }}</span></div>
            <div class="detail-item"><span class="detail-label">Ngày sinh</span><span class="detail-value">{{ formatDate(detailRow.birthDate) }}</span></div>
            <div class="detail-item"><span class="detail-label">Lần cuối ghé</span><span class="detail-value">{{ formatDate(detailRow.lastVisit) }}</span></div>
            <div class="detail-item"><span class="detail-label">Loại da</span><span class="detail-value">{{ detailRow.skinNote || '—' }}</span></div>
          </div>
          <!-- Lịch sử dịch vụ -->
          <div class="history-section">
            <h4 class="history-title">Lịch sử đặt dịch vụ</h4>
            <div v-for="apt in customerHistory" :key="apt.id" class="history-row">
              <span class="history-date">{{ formatDate(apt.date) }}</span>
              <span class="history-svc">{{ apt.serviceName }}</span>
              <span class="history-staff">{{ apt.staffName }}</span>
            </div>
            <p v-if="!customerHistory.length" class="history-empty text-secondary">Chưa có lịch sử.</p>
          </div>
        </div>
      </template>
      <template #footer>
        <AppButton label="Đóng"       variant="outline" color="neutral" @click="showDetail = false" />
        <AppButton label="Chỉnh sửa" icon-left="pencil" @click="openEditFromDetail(detailRow)" />
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
import AppDatebox    from '@mds/components/AppDatebox.vue'
import { customers as _customers, appointments, formatCurrency, formatDate } from '../data/mockData.js'

const rows       = ref([..._customers])
const searchText = ref('')
const selected   = ref([])
const currentPage = ref(1)
const pageSize   = ref(10)

const filteredRows = computed(() => {
  const q = searchText.value.toLowerCase()
  return rows.value
    .filter(r => !q || r.name.toLowerCase().includes(q) || r.phone.includes(q) || r.email.toLowerCase().includes(q))
    .map(r => ({
      ...r,
      customerAvatar:   { text: r.name },
      birthDateDisplay: formatDate(r.birthDate),
      lastVisitDisplay: formatDate(r.lastVisit),
      totalSpentDisplay: formatCurrency(r.totalSpent),
    }))
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

const columns = [
  { key: '_cb',              type: 'checkbox',    width: 40, noFilter: true },
  { key: 'customerAvatar',   label: 'Khách hàng', type: 'avatar-text', fill: true },
  { key: 'phone',            label: 'Điện thoại', width: 130 },
  { key: 'skinNote',         label: 'Loại da',    width: 150 },
  { key: 'visitCount',       label: 'Số lần ghé', width: 100, noFilter: true },
  { key: 'points',           label: 'Điểm tích lũy', width: 110, noFilter: true },
  { key: 'totalSpentDisplay',label: 'Tổng chi tiêu', width: 130, noFilter: true },
  { key: 'lastVisitDisplay', label: 'Lần cuối ghé', width: 120, noFilter: true },
]

const rowActions = [
  { icon: 'pencil', emit: 'edit-row',   title: 'Chỉnh sửa' },
  { icon: 'trash',  emit: 'delete-row', title: 'Xóa', danger: true },
]

// ── Detail ─────────────────────────────────────────────────────────────────
const showDetail    = ref(false)
const detailRow     = ref(null)
const customerHistory = computed(() =>
  detailRow.value
    ? appointments.filter(a => a.customerId === detailRow.value.id && a.status === 'completed').slice(0, 5)
    : []
)

function openDetail(row) { detailRow.value = row; showDetail.value = true }

// ── Form ───────────────────────────────────────────────────────────────────
const showModal  = ref(false)
const editingId  = ref(null)
const form = reactive({ name: '', phone: '', email: '', birthDate: '', skinNote: '', preference: '' })

function openAdd() {
  editingId.value = null
  Object.assign(form, { name: '', phone: '', email: '', birthDate: '', skinNote: '', preference: '' })
  showModal.value = true
}
function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, { name: row.name, phone: row.phone, email: row.email, birthDate: row.birthDate, skinNote: row.skinNote, preference: row.preference || '' })
  showModal.value = true
}
function openEditFromDetail(row) { showDetail.value = false; openEdit(row) }
function closeModal() { showModal.value = false }

function handleSave() {
  if (editingId.value) {
    const idx = rows.value.findIndex(r => r.id === editingId.value)
    if (idx > -1) Object.assign(rows.value[idx], { ...form })
  } else {
    rows.value.unshift({ id: rows.value.length + 100, points: 0, visitCount: 0, totalSpent: 0, lastVisit: '', ...form })
  }
  closeModal()
}
function confirmDelete(row) {
  if (confirm(`Xóa hồ sơ khách hàng "${row.name}"?`)) rows.value = rows.value.filter(r => r.id !== row.id)
}

function initials(name) {
  return name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?'
}

function bulkExport() { alert(`Xuất ${selected.value.length} khách hàng`) }
function bulkDelete() {
  if (confirm(`Xóa ${selected.value.length} khách hàng đã chọn?`)) {
    rows.value = rows.value.filter(r => !selected.value.includes(r.id))
    selected.value = []
  }
}
</script>

<style scoped>
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
.th-wrapper { padding: 0; }
.table-scroll { flex: 1; overflow: auto; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }

/* ── Detail Profile ── */
.detail-profile { display: flex; flex-direction: column; gap: 20px; }
.detail-avatar { display: flex; align-items: center; gap: 16px; }
.avatar-xl {
  display: flex; align-items: center; justify-content: center;
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--bg-brand-light); color: var(--bg-brand);
  font-size: 20px; font-weight: var(--fw-semibold); flex-shrink: 0;
}
.detail-name-block { display: flex; flex-direction: column; gap: 2px; }
.detail-name  { font-size: 16px; font-weight: var(--fw-semibold); color: var(--text-primary); margin: 0; }
.detail-phone { font-size: 13px; color: var(--text-secondary); }

.stats-row {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}
.stat-box {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 12px; background: var(--bg-neutral-light);
  border-radius: var(--radius-default); text-align: center;
}
.stat-box--brand   { background: var(--bg-brand-light); }
.stat-box--success { background: var(--bg-success-light); }
.stat-value { font-size: 18px; font-weight: var(--fw-semibold); color: var(--text-primary); }
.stat-box--brand .stat-value   { color: var(--bg-brand); }
.stat-box--success .stat-value { color: var(--bg-success); }
.stat-label { font-size: 11px; color: var(--text-hint); }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
.detail-item  { display: flex; flex-direction: column; gap: 3px; }
.detail-label { font-size: 12px; color: var(--text-hint); }
.detail-value { font-size: 13px; color: var(--text-primary); font-weight: var(--fw-medium); }

.history-section { border-top: 1px solid var(--stroke-divider); padding-top: 16px; }
.history-title   { font-size: 13px; font-weight: var(--fw-semibold); margin-bottom: 10px; color: var(--text-primary); }
.history-row {
  display: grid; grid-template-columns: 100px 1fr 120px;
  gap: 8px; padding: 8px 0;
  border-bottom: 1px solid var(--stroke-neutral-light);
  font-size: 13px;
}
.history-date  { color: var(--text-secondary); }
.history-svc   { color: var(--text-primary); font-weight: var(--fw-medium); }
.history-staff { color: var(--text-hint); text-align: right; }
.history-empty { font-size: 13px; padding: 8px 0; }
</style>
