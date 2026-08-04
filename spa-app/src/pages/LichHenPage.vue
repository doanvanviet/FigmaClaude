<template>
  <AppShell>
    <!-- Tab Area -->
    <div class="tab-area">
      <button
        v-for="tab in tabs" :key="tab.value"
        class="tab-item"
        :class="{ 'tab-item--active': activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="tab-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Table Panel -->
    <div class="table-panel">
      <!-- Table Header (search + actions) -->
      <div class="th-wrapper">
        <TableHeader
          v-model="searchText"
          search-placeholder="Tìm khách hàng, dịch vụ..."
          :search-width="260"
          :main-function-button="true"
          :bulk-action="selected.length > 0"
          :selected-count="selected.length"
          @refresh="refreshData"
          @export="handleExport"
          @deselect-all="selected = []"
        >
          <template #filters>
            <select class="input input--select" style="width:150px" v-model="filterStatus">
              <option value="">Tất cả trạng thái</option>
              <option v-for="s in APPOINTMENT_STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <AppDatebox v-model="filterDate" style="width:140px" />
          </template>
          <template #main-buttons>
            <AppButton label="Thêm lịch hẹn" icon-left="plus" @click="openAdd" />
          </template>
          <template #bulk-buttons>
            <AppButton label="Xác nhận" variant="outline" color="primary" icon-left="check" @click="bulkConfirm" />
            <AppButton label="Hủy lịch"  variant="outline" color="neutral" icon-left="x"    @click="bulkCancel" />
          </template>
        </TableHeader>
      </div>

      <!-- DataTable -->
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
          @confirm-row="confirmAppointment"
        />
      </div>

      <!-- Pagination -->
      <AppPagination
        :total="filteredRows.length"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
      />
    </div>

    <!-- ── Add / Edit Modal ── -->
    <AppModal
      v-if="showModal"
      :title="editingId ? 'Chỉnh sửa lịch hẹn' : 'Thêm lịch hẹn mới'"
      :width="600"
      @close="closeModal"
    >
      <template #body>
        <div class="form-grid">
          <AppInput label="Khách hàng" required vertical>
            <AppCombobox v-model="form.customerId" :options="customerOptions" placeholder="Chọn khách hàng" />
          </AppInput>
          <AppInput label="Số điện thoại" vertical>
            <AppTextbox v-model="form.phone" placeholder="0901 234 567" :disabled="true" />
          </AppInput>
          <AppInput label="Dịch vụ" required vertical>
            <AppCombobox v-model="form.serviceId" :options="serviceOptions" placeholder="Chọn dịch vụ" @update:model-value="onServiceChange" />
          </AppInput>
          <AppInput label="Nhân viên" vertical>
            <AppCombobox v-model="form.staffId" :options="staffOptions" placeholder="Chọn nhân viên" />
          </AppInput>
          <AppInput label="Ngày hẹn" required vertical>
            <AppDatebox v-model="form.date" />
          </AppInput>
          <AppInput label="Giờ hẹn" required vertical>
            <AppDatebox v-model="form.time" type="time" />
          </AppInput>
          <AppInput label="Thời gian (phút)" vertical>
            <AppNumberbox v-model="form.duration" :min="15" :step="15" suffix=" phút" />
          </AppInput>
          <AppInput label="Trạng thái" vertical>
            <AppCombobox v-model="form.status" :options="statusOptions" />
          </AppInput>
          <AppInput label="Ghi chú" vertical style="grid-column: 1 / -1">
            <AppTextarea v-model="form.note" placeholder="Ghi chú về yêu cầu đặc biệt, dị ứng, sở thích..." rows="3" />
          </AppInput>
        </div>
      </template>
      <template #footer>
        <AppButton label="Hủy"   variant="outline" color="neutral" @click="closeModal" />
        <AppButton :label="editingId ? 'Cập nhật' : 'Lưu lịch hẹn'" icon-left="check" @click="handleSave" />
      </template>
    </AppModal>

    <!-- ── Detail Modal ── -->
    <AppModal v-if="showDetail && detailRow" title="Chi tiết lịch hẹn" :width="500" @close="showDetail = false">
      <template #body>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">Khách hàng</span><span class="detail-value">{{ detailRow.customerName }}</span></div>
          <div class="detail-item"><span class="detail-label">Điện thoại</span><span class="detail-value">{{ detailRow.phone }}</span></div>
          <div class="detail-item"><span class="detail-label">Dịch vụ</span><span class="detail-value">{{ detailRow.serviceName }}</span></div>
          <div class="detail-item"><span class="detail-label">Nhân viên</span><span class="detail-value">{{ detailRow.staffName }}</span></div>
          <div class="detail-item"><span class="detail-label">Ngày & Giờ</span><span class="detail-value">{{ formatDate(detailRow.date) }} lúc {{ detailRow.time }}</span></div>
          <div class="detail-item"><span class="detail-label">Thời gian</span><span class="detail-value">{{ detailRow.duration }} phút</span></div>
          <div class="detail-item">
            <span class="detail-label">Trạng thái</span>
            <span class="status-badge" :class="`status-badge--${getStatusInfo(detailRow.status).color}`">{{ getStatusInfo(detailRow.status).label }}</span>
          </div>
          <div v-if="detailRow.note" class="detail-item" style="grid-column:1/-1">
            <span class="detail-label">Ghi chú</span><span class="detail-value">{{ detailRow.note }}</span>
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
import AppCombobox   from '@mds/components/AppCombobox.vue'
import AppDatebox    from '@mds/components/AppDatebox.vue'
import AppNumberbox  from '@mds/components/AppNumberbox.vue'
import {
  appointments as _appointments, customers, services, staff,
  APPOINTMENT_STATUSES, formatDate, getStatusInfo,
} from '../data/mockData.js'

// ── State ──────────────────────────────────────────────────────────────────
const rows       = ref([..._appointments])
const searchText = ref('')
const filterStatus = ref('')
const filterDate   = ref('')
const activeTab  = ref('all')
const selected   = ref([])
const currentPage = ref(1)
const pageSize   = ref(10)

// ── Tabs ───────────────────────────────────────────────────────────────────
const tabs = computed(() => [
  { value: 'all',        label: 'Tất cả',          count: rows.value.length },
  { value: 'pending',    label: 'Chờ xác nhận',    count: rows.value.filter(r => r.status === 'pending').length },
  { value: 'confirmed',  label: 'Đã xác nhận',     count: rows.value.filter(r => r.status === 'confirmed').length },
  { value: 'inprogress', label: 'Đang thực hiện',  count: rows.value.filter(r => r.status === 'inprogress').length },
  { value: 'completed',  label: 'Hoàn thành',      count: rows.value.filter(r => r.status === 'completed').length },
  { value: 'cancelled',  label: 'Đã hủy',          count: rows.value.filter(r => r.status === 'cancelled').length },
])

// ── Filtered rows ──────────────────────────────────────────────────────────
const filteredRows = computed(() => {
  const q = searchText.value.toLowerCase()
  return rows.value
    .filter(r => activeTab.value === 'all' || r.status === activeTab.value)
    .filter(r => !filterStatus.value || r.status === filterStatus.value)
    .filter(r => !filterDate.value || r.date === filterDate.value)
    .filter(r =>
      !q ||
      r.customerName.toLowerCase().includes(q) ||
      r.serviceName.toLowerCase().includes(q) ||
      r.staffName.toLowerCase().includes(q)
    )
    .map(r => ({
      ...r,
      customerAvatar:  { text: r.customerName },
      dateTime:        `${formatDate(r.date)} ${r.time}`,
      durationDisplay: r.duration + ' phút',
      statusBadge:     { label: getStatusInfo(r.status).label, color: getStatusInfo(r.status).color },
    }))
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

// ── Columns ────────────────────────────────────────────────────────────────
const columns = [
  { key: '_cb',            type: 'checkbox',     width: 40,  noFilter: true },
  { key: 'customerAvatar', label: 'Khách hàng', type: 'avatar-text', fill: true },
  { key: 'serviceName',    label: 'Dịch vụ',   width: 180 },
  { key: 'staffName',      label: 'Nhân viên',  width: 140 },
  { key: 'dateTime',       label: 'Ngày & Giờ', width: 130 },
  { key: 'durationDisplay', label: 'Thời gian', width: 90, noFilter: true },
  { key: 'statusBadge',  label: 'Trạng thái', type: 'status', width: 140 },
]

const rowActions = [
  { icon: 'pencil', emit: 'edit-row',   title: 'Chỉnh sửa' },
  { icon: 'trash',  emit: 'delete-row', title: 'Xóa', danger: true },
]

// ── Form ───────────────────────────────────────────────────────────────────
const showModal  = ref(false)
const showDetail = ref(false)
const detailRow  = ref(null)
const editingId  = ref(null)
const form = reactive({
  customerId: '', phone: '', serviceId: '', staffId: '',
  date: '2026-05-27', time: '09:00', duration: 60,
  status: 'pending', note: '',
})

const customerOptions = customers.map(c => ({ value: String(c.id), label: c.name }))
const serviceOptions  = services.map(s => ({ value: String(s.id), label: s.name }))
const staffOptions    = staff.map(s => ({ value: String(s.id), label: s.name }))
const statusOptions   = APPOINTMENT_STATUSES.map(s => ({ value: s.value, label: s.label }))

function onServiceChange(val) {
  const svc = services.find(s => String(s.id) === val)
  if (svc) form.duration = svc.duration
}

function openAdd() {
  editingId.value = null
  Object.assign(form, { customerId: '', phone: '', serviceId: '', staffId: '', date: '2026-05-27', time: '09:00', duration: 60, status: 'pending', note: '' })
  showModal.value = true
}

function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, {
    customerId: String(row.customerId),
    phone:      row.phone,
    serviceId:  String(row.serviceId),
    staffId:    String(row.staffId),
    date:       row.date,
    time:       row.time,
    duration:   row.duration,
    status:     row.status,
    note:       row.note,
  })
  showModal.value = true
}

function openDetail(row) {
  detailRow.value = row
  showDetail.value = true
}

function openEditFromDetail(row) {
  showDetail.value = false
  openEdit(row)
}

function closeModal() { showModal.value = false }

function handleSave() {
  const cust = customers.find(c => String(c.id) === form.customerId) || {}
  const svc  = services.find(s  => String(s.id) === form.serviceId)  || {}
  const nv   = staff.find(s    => String(s.id) === form.staffId)    || {}

  if (editingId.value) {
    const idx = rows.value.findIndex(r => r.id === editingId.value)
    if (idx > -1) {
      rows.value[idx] = {
        ...rows.value[idx],
        customerId:   Number(form.customerId),
        customerName: cust.name || '',
        phone:        cust.phone || '',
        serviceId:    Number(form.serviceId),
        serviceName:  svc.name || '',
        staffId:      Number(form.staffId),
        staffName:    nv.name || '',
        date: form.date, time: form.time, duration: form.duration,
        status: form.status, note: form.note,
      }
    }
  } else {
    rows.value.unshift({
      id:           rows.value.length + 100,
      customerId:   Number(form.customerId),
      customerName: cust.name || '',
      phone:        cust.phone || '',
      serviceId:    Number(form.serviceId),
      serviceName:  svc.name || '',
      staffId:      Number(form.staffId),
      staffName:    nv.name || '',
      date: form.date, time: form.time, duration: form.duration,
      status: form.status, note: form.note,
    })
  }
  closeModal()
}

function confirmAppointment(row) {
  const idx = rows.value.findIndex(r => r.id === row.id)
  if (idx > -1) rows.value[idx].status = 'confirmed'
}

function confirmDelete(row) {
  if (confirm(`Xóa lịch hẹn của ${row.customerName}?`)) {
    rows.value = rows.value.filter(r => r.id !== row.id)
  }
}

function refreshData() { /* reload mock */ }
function handleExport() { alert('Xuất file Excel') }

function bulkConfirm() {
  rows.value = rows.value.map(r =>
    selected.value.includes(r.id) ? { ...r, status: 'confirmed' } : r
  )
  selected.value = []
}
function bulkCancel() {
  rows.value = rows.value.map(r =>
    selected.value.includes(r.id) ? { ...r, status: 'cancelled' } : r
  )
  selected.value = []
}
</script>

<style scoped>

/* ── Tabs ── */
.tab-area {
  display: flex;
  gap: 0;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-divider);
  padding: 0 16px;
  flex-shrink: 0;
}
.tab-item {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 16px;
  font-size: 13px; font-weight: var(--fw-medium);
  color: var(--text-secondary);
  background: transparent; border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}
.tab-item:hover { color: var(--text-primary); }
.tab-item--active {
  color: var(--bg-brand);
  border-bottom-color: var(--bg-brand);
  font-weight: var(--fw-semibold);
}
.tab-badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: var(--bg-neutral-light); color: var(--text-secondary);
  border-radius: 9999px; font-size: 11px;
}
.tab-item--active .tab-badge { background: var(--bg-brand-light); color: var(--bg-brand); }

/* ── Table Panel ── */
.table-panel {
  display: flex; flex-direction: column;
  flex: 1; overflow: hidden;
  background: var(--bg-white);
  margin: 16px;
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
}
.th-wrapper { padding: 0; }
.table-scroll { flex: 1; overflow: auto; }

/* ── Form ── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
}

/* ── Detail ── */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}
.detail-item   { display: flex; flex-direction: column; gap: 3px; }
.detail-label  { font-size: 12px; color: var(--text-hint); }
.detail-value  { font-size: 13px; color: var(--text-primary); font-weight: var(--fw-medium); }

.status-badge {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: var(--radius-pill);
  font-size: 12px; font-weight: var(--fw-medium);
}
.status-badge--success { background: var(--bg-success-light); color: var(--bg-success); }
.status-badge--warning { background: var(--bg-warning-light); color: var(--bg-warning); }
.status-badge--info    { background: var(--bg-info-light);    color: var(--text-info); }
.status-badge--brand   { background: var(--bg-brand-light);   color: var(--bg-brand); }
.status-badge--danger  { background: var(--bg-danger-light);  color: var(--bg-danger); }
.status-badge--neutral { background: var(--bg-neutral-light); color: var(--text-secondary); }

.input--select {
  height: var(--input-height); padding: 0 8px;
  border: 1px solid var(--stroke-neutral); border-radius: var(--radius-default);
  font-size: 13px; color: var(--text-primary); background: var(--bg-white);
}
</style>
