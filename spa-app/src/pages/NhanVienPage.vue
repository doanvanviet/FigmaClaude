<template>
  <AppShell>
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title h2">Nhân viên</h1>
      </div>
      <div class="page-header__right">
        <AppButton label="Thêm nhân viên" icon-left="plus" @click="openAdd" />
      </div>
    </div>

    <div class="table-panel">
      <div class="th-wrapper">
        <TableHeader
          v-model="searchText"
          search-placeholder="Tìm tên, SĐT, kỹ năng..."
          :search-width="260"
          @refresh="() => {}"
          @export="() => {}"
        >
          <template #filters>
            <select class="input input--select" style="width:160px" v-model="filterSkill">
              <option value="">Tất cả kỹ năng</option>
              <option v-for="sk in allSkills" :key="sk" :value="sk">{{ sk }}</option>
            </select>
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
      :title="editingId ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'"
      :width="580"
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
            <AppTextbox v-model="form.email" placeholder="email@spa.vn" type="email" />
          </AppInput>
          <AppInput label="Kỹ năng phụ trách" vertical style="grid-column:1/-1">
            <AppCombobox
              v-model="form.skillsStr"
              :options="skillOptions"
              multiple
              placeholder="Chọn kỹ năng..."
            />
          </AppInput>
        </div>
      </template>
      <template #footer>
        <AppButton label="Hủy"    variant="outline" color="neutral" @click="closeModal" />
        <AppButton :label="editingId ? 'Cập nhật' : 'Thêm nhân viên'" icon-left="check" @click="handleSave" />
      </template>
    </AppModal>

    <!-- Detail Modal -->
    <AppModal v-if="showDetail && detailRow" title="Hồ sơ nhân viên" :width="580" @close="showDetail = false">
      <template #body>
        <div class="detail-profile">
          <div class="detail-avatar">
            <span class="avatar-xl avatar-xl--staff">{{ initials(detailRow.name) }}</span>
            <div class="detail-name-block">
              <h3 class="detail-name">{{ detailRow.name }}</h3>
              <span class="detail-phone">{{ detailRow.phone }}</span>
              <span class="detail-email text-secondary">{{ detailRow.email }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="section-title">Kỹ năng & dịch vụ phụ trách</h4>
            <div class="skills-list">
              <span v-for="sk in detailRow.skills" :key="sk" class="skill-tag">{{ sk }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4 class="section-title">Lịch hẹn hôm nay (27/05/2026)</h4>
            <div v-for="apt in staffToday" :key="apt.id" class="schedule-row">
              <span class="schedule-time">{{ apt.time }}</span>
              <span class="schedule-svc">{{ apt.serviceName }}</span>
              <span class="schedule-cust">{{ apt.customerName }}</span>
              <span class="schedule-status" :class="`status-dot--${getStatusInfo(apt.status).color}`">
                {{ getStatusInfo(apt.status).label }}
              </span>
            </div>
            <p v-if="!staffToday.length" class="text-secondary" style="font-size:13px;padding:8px 0">Không có lịch hẹn hôm nay.</p>
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
import AppCombobox   from '@mds/components/AppCombobox.vue'
import { staff as _staff, appointments, SERVICE_CATEGORIES, getStatusInfo } from '../data/mockData.js'

const rows        = ref([..._staff])
const searchText  = ref('')
const filterSkill = ref('')
const currentPage = ref(1)
const pageSize    = ref(10)

const allSkills = SERVICE_CATEGORIES.map(c => c.label)
const skillOptions = allSkills.map(s => ({ value: s, label: s }))

const filteredRows = computed(() => {
  const q = searchText.value.toLowerCase()
  return rows.value
    .filter(r => !filterSkill.value || r.skills.includes(filterSkill.value))
    .filter(r => !q || r.name.toLowerCase().includes(q) || r.phone.includes(q) || r.skills.join(' ').toLowerCase().includes(q))
    .map(r => ({
      ...r,
      staffAvatar:       { text: r.name },
      skillTags:         r.skills.map(s => ({ label: s, color: skillColor(s) })),
      todayCountDisplay: appointments.filter(a => a.staffId === r.id && a.date === '2026-05-27').length + ' lịch',
    }))
})

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

const columns = [
  { key: 'staffAvatar', label: 'Nhân viên',   type: 'avatar-text', fill: true },
  { key: 'phone',      label: 'Điện thoại',  width: 130 },
  { key: 'email',      label: 'Email',        width: 180 },
  { key: 'skillTags',  label: 'Kỹ năng',     type: 'tag', width: 200, noFilter: true },
  { key: 'todayCountDisplay', label: 'Lịch hôm nay', width: 110, noFilter: true },
]

const rowActions = [
  { icon: 'pencil', emit: 'edit-row',   title: 'Chỉnh sửa' },
  { icon: 'trash',  emit: 'delete-row', title: 'Xóa', danger: true },
]

function skillColor(skill) {
  const map = {
    'Chăm sóc da': 'brand', 'Massage': 'success', 'Nail': 'accent',
    'Tóc': 'warning', 'Chăm sóc cơ thể': 'info',
  }
  return map[skill] || 'neutral'
}

// ── Detail ─────────────────────────────────────────────────────────────────
const showDetail = ref(false)
const detailRow  = ref(null)
const staffToday = computed(() =>
  detailRow.value
    ? appointments.filter(a => a.staffId === detailRow.value.id && a.date === '2026-05-27')
    : []
)

function openDetail(row) { detailRow.value = row; showDetail.value = true }

// ── Form ───────────────────────────────────────────────────────────────────
const showModal = ref(false)
const editingId = ref(null)
const form = reactive({ name: '', phone: '', email: '', skillsStr: '' })

function openAdd() {
  editingId.value = null
  Object.assign(form, { name: '', phone: '', email: '', skillsStr: '' })
  showModal.value = true
}
function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, { name: row.name, phone: row.phone, email: row.email, skillsStr: row.skills.join(',') })
  showModal.value = true
}
function openEditFromDetail(row) { showDetail.value = false; openEdit(row) }
function closeModal() { showModal.value = false }

function handleSave() {
  const skills = form.skillsStr ? form.skillsStr.split(',').map(s => s.trim()).filter(Boolean) : []
  if (editingId.value) {
    const idx = rows.value.findIndex(r => r.id === editingId.value)
    if (idx > -1) Object.assign(rows.value[idx], { name: form.name, phone: form.phone, email: form.email, skills })
  } else {
    rows.value.unshift({ id: rows.value.length + 100, name: form.name, phone: form.phone, email: form.email, skills, avatar: null })
  }
  closeModal()
}
function confirmDelete(row) {
  if (confirm(`Xóa nhân viên "${row.name}"?`)) rows.value = rows.value.filter(r => r.id !== row.id)
}

function initials(name) {
  return name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?'
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

/* ── Detail ── */
.detail-profile { display: flex; flex-direction: column; gap: 20px; }
.detail-avatar  { display: flex; align-items: center; gap: 16px; }
.avatar-xl {
  display: flex; align-items: center; justify-content: center;
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--bg-brand-light); color: var(--bg-brand);
  font-size: 20px; font-weight: var(--fw-semibold); flex-shrink: 0;
}
.avatar-xl--staff { background: var(--bg-success-light); color: var(--bg-success); }
.detail-name-block { display: flex; flex-direction: column; gap: 2px; }
.detail-name  { font-size: 16px; font-weight: var(--fw-semibold); color: var(--text-primary); margin: 0; }
.detail-phone { font-size: 13px; color: var(--text-secondary); }
.detail-email { font-size: 12px; }

.detail-section { display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--stroke-divider); padding-top: 16px; }
.section-title  { font-size: 13px; font-weight: var(--fw-semibold); color: var(--text-primary); margin: 0; }

.skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
.skill-tag {
  display: inline-flex; align-items: center; padding: 3px 10px;
  background: var(--bg-brand-light); color: var(--bg-brand);
  border-radius: var(--radius-pill); font-size: 12px; font-weight: var(--fw-medium);
}

.schedule-row {
  display: grid; grid-template-columns: 55px 1fr 130px 110px;
  gap: 8px; padding: 7px 0;
  border-bottom: 1px solid var(--stroke-neutral-light);
  font-size: 13px; align-items: center;
}
.schedule-time  { font-weight: var(--fw-semibold); color: var(--text-primary); }
.schedule-svc   { color: var(--text-primary); }
.schedule-cust  { color: var(--text-secondary); }
.schedule-status { font-size: 12px; }
.status-dot--success { color: var(--bg-success); }
.status-dot--warning { color: var(--bg-warning); }
.status-dot--info    { color: var(--text-info); }
.status-dot--brand   { color: var(--bg-brand); }
.status-dot--danger  { color: var(--bg-danger); }

.input--select {
  height: var(--input-height); padding: 0 8px;
  border: 1px solid var(--stroke-neutral); border-radius: var(--radius-default);
  font-size: 13px; color: var(--text-primary); background: var(--bg-white);
}
</style>
