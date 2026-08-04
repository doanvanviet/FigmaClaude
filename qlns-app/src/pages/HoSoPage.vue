<template>
  <div class="app-shell">
    <ControlHeader app-name="MISA QLNS">
      <template #header-meta>
        <button class="header-company">
          Công ty cổ phần Công nghệ MISA <TIcon name="chevron-down" />
        </button>
      </template>
    </ControlHeader>

    <div class="body-row">
      <AppSidebar :items="sidebarItems" :active-id="'ho-so'" @nav="onNav" />

      <div class="main-content">

        <!-- Page Header — Dạng 1, nằm trong main-content trước content-wrapper -->
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title h2">Danh sách Nhân viên</h1>
          </div>
          <div class="page-header__right">
            <button class="btn btn--outline btn--neutral">
              <TIcon name="file-import" /> Nhập từ Excel
            </button>
            <button class="btn btn--outline btn--neutral">
              <TIcon name="file-export" /> Xuất
            </button>
            <div class="btn-split">
              <button class="btn btn--primary"><TIcon name="plus" />Thêm nhân viên</button>
              <button class="btn btn--primary btn-split__arrow"><TIcon name="chevron-down" /></button>
            </div>
            <DropdownMenu :items="utilityItems" placement="bottom-end" :min-width="180">
              <template #trigger="{ toggle }">
                <button class="btn-icon btn-icon--outline" @click.stop="toggle">
                  <TIcon name="dots" />
                </button>
              </template>
            </DropdownMenu>
          </div>
        </div>

        <!-- Content -->
        <div class="content-wrapper">
          <div class="table-panel">
            <div class="data-panel data-panel--master">

              <!-- Toolbar -->
              <TableHeader
                v-model="searchQuery"
                search-placeholder="Tìm theo tên, mã NV..."
                :search-width="240"
                :main-function-button="false"
                :bulk-action="selected.length > 0"
                :selected-count="selected.length"
                @deselect-all="selected = []"
              >
                <template #bulk-buttons>
                  <button class="btn btn--outline btn--neutral">In hồ sơ</button>
                  <button class="btn btn--outline btn--neutral">Xuất Excel</button>
                  <DropdownMenu :items="bulkMoreItems" placement="bottom-end" :min-width="160">
                    <template #trigger="{ toggle }">
                      <button class="btn-icon btn-icon--outline" @click.stop="toggle"><TIcon name="dots" /></button>
                    </template>
                  </DropdownMenu>
                </template>
                <template #filters>
                  <!-- Phòng ban -->
                  <div class="ibox" style="width:160px;cursor:pointer;gap:4px">
                    <span style="font-size:13px;color:var(--text-secondary);white-space:nowrap;flex-shrink:0">Phòng ban:</span>
                    <select class="ibox__native ibox__native--select" v-model="filterDept">
                      <option value="">Tất cả</option>
                      <option v-for="d in depts" :key="d" :value="d">{{ d }}</option>
                    </select>
                    <TIcon name="chevron-down" class="ibox__icon" style="font-size:14px;pointer-events:none" />
                  </div>
                  <!-- Chức vụ -->
                  <div class="ibox" style="width:148px;cursor:pointer;gap:4px">
                    <span style="font-size:13px;color:var(--text-secondary);white-space:nowrap;flex-shrink:0">Chức vụ:</span>
                    <select class="ibox__native ibox__native--select" v-model="filterPosition">
                      <option value="">Tất cả</option>
                      <option v-for="p in positions" :key="p" :value="p">{{ p }}</option>
                    </select>
                    <TIcon name="chevron-down" class="ibox__icon" style="font-size:14px;pointer-events:none" />
                  </div>
                  <!-- Trạng thái -->
                  <div class="ibox" style="width:148px;cursor:pointer;gap:4px">
                    <span style="font-size:13px;color:var(--text-secondary);white-space:nowrap;flex-shrink:0">Trạng thái:</span>
                    <select class="ibox__native ibox__native--select" v-model="filterStatus">
                      <option value="">Tất cả</option>
                      <option value="active">Đang làm việc</option>
                      <option value="probation">Thử việc</option>
                      <option value="maternity">Nghỉ thai sản</option>
                    </select>
                    <TIcon name="chevron-down" class="ibox__icon" style="font-size:14px;pointer-events:none" />
                  </div>
                </template>
              </TableHeader>

              <!-- DataTable -->
              <DataTable
                :columns="columns"
                :rows="rows"
                :selected="selected"
                @update:selected="selected = $event"
                :row-actions="rowActions"
                :more-actions="moreActions"
                :hide-blank-rows="false"
                pagination
                :total="filteredRowsRaw.length"
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-size-options="[20, 50, 100]"
              />

            </div><!-- /data-panel--master -->
          </div><!-- /table-panel -->
        </div><!-- /content-wrapper -->

      </div><!-- /main-content -->
    </div><!-- /body-row -->
  </div><!-- /app-shell -->
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ControlHeader   from '@mds/components/ControlHeader.vue'
import AppSidebar      from '@mds/components/AppSidebar.vue'
import TIcon           from '@mds/components/TIcon.vue'
import TableHeader     from '@mds/components/TableHeader.vue'
import DataTable       from '@mds/components/DataTable.vue'
import DropdownMenu    from '@mds/components/DropdownMenu.vue'

const router = useRouter()

/* ── Sidebar ── */
const sidebarItems = [
  { id: 'tong-quan',     label: 'Tổng quan',       icon: 'layout-dashboard' },
  { id: 'hoi-nhap',      label: 'Hội nhập',         icon: 'user-plus' },
  { id: 'ho-so',         label: 'Hồ sơ',            icon: 'id-badge-2' },
  { id: 'hop-dong',      label: 'Hợp đồng',         icon: 'file-certificate' },
  { id: 'bo-nhiem',      label: 'Bổ nhiệm',         icon: 'user-check' },
  { id: 'mien-nhiem',    label: 'Miễn nhiệm',       icon: 'user-minus' },
  { id: 'thuyen-chuyen', label: 'Thuyên chuyển',    icon: 'transfer' },
  { id: 'nghi-viec',     label: 'Nghỉ việc',        icon: 'door-exit' },
  { id: 'khen-thuong',   label: 'Khen thưởng',      icon: 'medal' },
  { id: 'ky-luat',       label: 'Kỷ luật/Sự cố',   icon: 'alert-triangle' },
  { id: 'phuc-loi',      label: 'Phúc lợi',         icon: 'heart-handshake' },
  { id: 'quy-hoach',     label: 'Quy hoạch',        icon: 'sitemap' },
  { id: 'ke-can',        label: 'Kế cận',           icon: 'ladder' },
  { id: 'kho-tiem-nang', label: 'Kho tiềm năng',    icon: 'diamond' },
  { id: 'dong-phuc',     label: 'Đồng phục',        icon: 'shirt' },
  { id: 'de-xuat',       label: 'Đề xuất',          icon: 'bulb' },
  { id: 'dinh-bien',     label: 'Định biên',        icon: 'scale' },
]
function onNav(id) { router.push('/' + id) }

/* ── Filters ── */
const searchQuery    = ref('')
const filterDept     = ref('')
const filterPosition = ref('')
const filterStatus   = ref('')
const currentPage    = ref(1)
const pageSize       = ref(20)
const selected       = ref([])

const depts     = ['Ban Giám đốc', 'Hành chính - Nhân sự', 'Kế toán', 'Kỹ thuật - IT', 'Kinh doanh', 'Marketing', 'Vận hành']
const positions = ['Giám đốc', 'Trưởng phòng', 'Phó phòng', 'Nhân viên', 'Chuyên viên', 'Trợ lý']

/* ── Columns ── */
const columns = [
  { key: '_sel',     label: '',             type: 'checkbox',       width: 44,  noFilter: true },
  { key: 'stt',      label: 'STT',          type: 'text',           width: 48,  align: 'center', noFilter: true, noMenu: true },
  { key: 'code',     label: 'Mã NV',        type: 'text',           width: 100 },
  { key: 'emp',      label: 'Họ và tên',    type: 'avatar-subtext', minWidth: 200 },
  { key: 'dob',      label: 'Ngày sinh',    type: 'text',           width: 100 },
  { key: 'dept',     label: 'Phòng ban',    type: 'text',           width: 180 },
  { key: 'position', label: 'Chức vụ',      type: 'text',           width: 140 },
  { key: 'joinDate', label: 'Ngày vào làm', type: 'text',           width: 112 },
  { key: 'status',   label: 'Trạng thái',   type: 'status',         width: 128 },
]

const rowActions = [
  { icon: 'eye',    title: 'Xem hồ sơ', emit: 'view' },
  { icon: 'pencil', title: 'Chỉnh sửa', emit: 'edit' },
  { icon: 'trash',  title: 'Xóa',       emit: 'delete', danger: true },
]
const moreActions = [
  { id: 'copy',    icon: 'copy',  label: 'Sao chép' },
  { separator: true },
  { id: 'history', icon: 'clock', label: 'Lịch sử thay đổi' },
]

/* ── Status helpers ── */
const STATUS_COLOR = { active: 'success', probation: 'warning', maternity: 'info' }
const STATUS_LABEL = { active: 'Đang làm việc', probation: 'Thử việc', maternity: 'Nghỉ thai sản' }

/* ── Data ── */
const allRows = [
  { id:1,  code:'NV001', name:'Nguyễn Văn An',      email:'an.nv@misa.com.vn',     dob:'15/03/1990', dept:'Ban Giám đốc',           position:'Giám đốc',     joinDate:'01/01/2018', status:'active',    initials:'NA', avatarBg:'#eff8ff' },
  { id:2,  code:'NV002', name:'Trần Thị Bình',       email:'binh.tt@misa.com.vn',   dob:'22/07/1992', dept:'Hành chính - Nhân sự',    position:'Trưởng phòng', joinDate:'15/03/2019', status:'active',    initials:'TB', avatarBg:'#f0fdf4' },
  { id:3,  code:'NV003', name:'Lê Minh Cường',       email:'cuong.lm@misa.com.vn',  dob:'08/11/1988', dept:'Kế toán',                 position:'Trưởng phòng', joinDate:'01/06/2017', status:'active',    initials:'LC', avatarBg:'#fdf4ff' },
  { id:4,  code:'NV004', name:'Võ Thị Dung',         email:'dung.vt@misa.com.vn',   dob:'30/04/1995', dept:'Kinh doanh',              position:'Chuyên viên',  joinDate:'10/08/2021', status:'active',    initials:'VD', avatarBg:'#fff7ed' },
  { id:5,  code:'NV005', name:'Đinh Quang Đạt',      email:'dat.dq@misa.com.vn',    dob:'12/09/1993', dept:'Kỹ thuật - IT',           position:'Nhân viên',    joinDate:'20/01/2022', status:'probation', initials:'ĐĐ', avatarBg:'#fef3f2' },
  { id:6,  code:'NV006', name:'Hoàng Thị Hà',        email:'ha.ht@misa.com.vn',     dob:'05/02/1991', dept:'Marketing',               position:'Trưởng phòng', joinDate:'01/04/2020', status:'active',    initials:'HH', avatarBg:'#eff8ff' },
  { id:7,  code:'NV007', name:'Phạm Văn Giang',      email:'giang.pv@misa.com.vn',  dob:'18/06/1994', dept:'Kinh doanh',              position:'Nhân viên',    joinDate:'05/05/2022', status:'active',    initials:'PG', avatarBg:'#f0fdf4' },
  { id:8,  code:'NV008', name:'Nguyễn Thị Hương',    email:'huong.nt@misa.com.vn',  dob:'25/12/1996', dept:'Hành chính - Nhân sự',    position:'Nhân viên',    joinDate:'15/09/2023', status:'probation', initials:'NH', avatarBg:'#fdf4ff' },
  { id:9,  code:'NV009', name:'Trần Quốc Khải',      email:'khai.tq@misa.com.vn',   dob:'07/08/1989', dept:'Kế toán',                 position:'Phó phòng',    joinDate:'01/07/2016', status:'active',    initials:'TK', avatarBg:'#fff7ed' },
  { id:10, code:'NV010', name:'Lý Thị Lan',           email:'lan.lt@misa.com.vn',    dob:'14/01/1997', dept:'Marketing',               position:'Chuyên viên',  joinDate:'01/11/2023', status:'active',    initials:'LL', avatarBg:'#eff8ff' },
  { id:11, code:'NV011', name:'Đặng Minh Long',       email:'long.dm@misa.com.vn',   dob:'03/05/1990', dept:'Kỹ thuật - IT',           position:'Chuyên viên',  joinDate:'20/02/2020', status:'active',    initials:'ĐL', avatarBg:'#f0fdf4' },
  { id:12, code:'NV012', name:'Mai Thị Ngọc',         email:'ngoc.mt@misa.com.vn',   dob:'28/10/1993', dept:'Kế toán',                 position:'Nhân viên',    joinDate:'01/01/2021', status:'maternity', initials:'MN', avatarBg:'#fdf4ff' },
  { id:13, code:'NV013', name:'Phan Văn Minh',        email:'minh.pv@misa.com.vn',   dob:'16/04/1992', dept:'Vận hành',                position:'Trưởng phòng', joinDate:'01/09/2019', status:'active',    initials:'PM', avatarBg:'#fff7ed' },
  { id:14, code:'NV014', name:'Cao Thị Nhung',        email:'nhung.ct@misa.com.vn',  dob:'11/07/1998', dept:'Kinh doanh',              position:'Nhân viên',    joinDate:'15/06/2024', status:'probation', initials:'CN', avatarBg:'#fef3f2' },
  { id:15, code:'NV015', name:'Bùi Quang Phúc',       email:'phuc.bq@misa.com.vn',   dob:'23/03/1991', dept:'Kỹ thuật - IT',           position:'Phó phòng',    joinDate:'01/03/2018', status:'active',    initials:'BP', avatarBg:'#eff8ff' },
]

const filteredRowsRaw = computed(() => allRows.filter(r => {
  const q = searchQuery.value.toLowerCase()
  if (q && !r.name.toLowerCase().includes(q) && !r.code.toLowerCase().includes(q)) return false
  if (filterDept.value     && r.dept     !== filterDept.value)     return false
  if (filterPosition.value && r.position !== filterPosition.value) return false
  if (filterStatus.value   && r.status   !== filterStatus.value)   return false
  return true
}))

/* ── Rows: transform to DataTable format + paginate ── */
const rows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRowsRaw.value.slice(start, start + pageSize.value).map((r, i) => ({
    id:       r.id,
    stt:      start + i + 1,
    code:     r.code,
    emp:      { text: r.name, subtext: r.email },
    dob:      r.dob,
    dept:     r.dept,
    position: r.position,
    joinDate: r.joinDate,
    status:   { label: STATUS_LABEL[r.status] ?? r.status, color: STATUS_COLOR[r.status] ?? 'neutral' },
  }))
})

/* ── Dropdown items ── */
const bulkMoreItems = [
  { id: 'delete', icon: 'trash',       label: 'Xóa' },
  { id: 'export', icon: 'file-export', label: 'Xuất Excel' },
]
const utilityItems = [
  { id: 'import',  icon: 'file-import',  label: 'Nhập từ Excel' },
  { id: 'export',  icon: 'file-export',  label: 'Xuất ra Excel' },
  { separator: true },
  { id: 'columns', icon: 'settings',     label: 'Tùy chỉnh cột hiển thị' },
]
</script>

<style scoped>
/* ── Page Header ── */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  height: var(--layout-page-header-h);
  padding: 0 16px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
.page-header__left  { display: flex; align-items: center; gap: 8px; }
.page-header__right { display: flex; align-items: center; gap: 8px; }

/* ── Layout ── */
.content-wrapper {
  flex: 1; min-height: 0; display: flex; flex-direction: column;
  padding: 16px; position: relative;
}
.table-panel {
  flex: 1; min-height: 0; display: flex; flex-direction: column;
}
.data-panel--master {
  flex: 1; min-height: 0; display: flex; flex-direction: column;
  background: var(--bg-white); border-radius: 8px; overflow: hidden;
}

</style>
