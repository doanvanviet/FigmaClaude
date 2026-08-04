<template>
  <div class="app-shell">
    <ControlHeader app-name="Kế toán" app-tag="HKĐ">
      <template #header-meta>
        <button class="header-company">
          Công ty cổ phần Đại Việt <TIcon name="chevron-down" />
        </button>
        <span class="header-year-badge">
          <span style="width:6px;height:6px;border-radius:50%;background:#12b76a;flex-shrink:0;box-shadow:0 0 0 1.5px white"></span>
          Dữ liệu năm 2023
        </span>
      </template>

    </ControlHeader>

    <div class="body-row">
      <AppSidebar :items="navItems" active-id="tien-gui" @nav="onNav" />

      <div class="main-content">
        <!-- Sub-nav tabs -->
        <div class="sub-nav">
          <div class="sub-nav__scroll">
            <button
              v-for="tab in tabs" :key="tab.id"
              class="sub-nav-tab"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >{{ tab.label }}</button>
          </div>
        </div>

        <div class="content-wrapper">
          <div class="table-panel">
            <!-- KPI Row (3 boxes riêng) -->
            <div v-if="kpiOpen" class="kpi-row">
              <div class="kpi-card">
                <button class="kpi-card__reload btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                <div class="kpi-card__icon kpi-card__icon--success"><TIcon name="trending-up" /></div>
                <div class="kpi-card__content">
                  <span class="kpi-card__label">Tổng thu đầu năm đến hiện tại</span>
                  <div class="kpi-card__bottom">
                    <span class="kpi-card__value kpi-card__value--success">122.411.049.228</span>
                    <span class="kpi-card__time" title="Số liệu tính đến: 13h51">
                      <TIcon name="clock" /><span>13:51</span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="kpi-card">
                <button class="kpi-card__reload btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                <div class="kpi-card__icon kpi-card__icon--warning"><TIcon name="trending-down" /></div>
                <div class="kpi-card__content">
                  <span class="kpi-card__label">Tổng chi đầu năm đến hiện tại</span>
                  <div class="kpi-card__bottom">
                    <span class="kpi-card__value kpi-card__value--warning">11.120.566.816</span>
                    <span class="kpi-card__time" title="Số liệu tính đến: 13h51">
                      <TIcon name="clock" /><span>13:51</span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="kpi-card">
                <button class="kpi-card__reload btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                <div class="kpi-card__icon kpi-card__icon--brand"><TIcon name="building-bank" /></div>
                <div class="kpi-card__content">
                  <span class="kpi-card__label">Số dư tiền gửi đến ngày &lt;25/05/2026&gt;</span>
                  <div class="kpi-card__bottom">
                    <span class="kpi-card__value kpi-card__value--brand">165.518.221.676</span>
                    <span class="kpi-card__time" title="Số liệu tính đến: 13h51">
                      <TIcon name="clock" /><span>13:51</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- KPI toggle -->
            <div :class="['kpi-cep', !kpiOpen && 'kpi-cep--pinned']">
              <CollapseExpandPanel
                :type="kpiOpen ? 'Expand' : 'Collapse'"
                position="Top"
                bg-color="White"
                @click="kpiOpen = !kpiOpen"
              />
            </div>

            <div class="data-panel data-panel--master">

            <!-- Table Header (standard component) -->
            <TableHeader
              v-model="searchQuery"
              search-placeholder="Tìm kiếm"
              :search-width="200"
              :main-function-button="true"
              :bulk-action="selected.length > 0"
              :selected-count="selected.length"
              @deselect-all="selected = []"
            >
              <template #bulk-buttons>
                <button class="btn btn--outline btn--neutral">In chứng từ</button>
                <button class="btn btn--outline btn--neutral">Sao chép</button>
                <button class="btn btn--outline btn--neutral">Ghi sổ</button>
                <DropdownMenu :items="bulkMoreItems" placement="bottom-end" :min-width="160">
                  <template #trigger="{ toggle }">
                    <button class="btn-icon btn-icon--outline" @click.stop="toggle"><TIcon name="dots" /></button>
                  </template>
                </DropdownMenu>
              </template>
              <template #main-buttons>
                <div class="btn-split">
                  <button class="btn btn--primary">Thu tiền</button>
                  <button class="btn btn--primary btn-split__arrow"><TIcon name="chevron-down" /></button>
                </div>
                <div class="btn-split">
                  <button class="btn btn--primary">Chi tiền</button>
                  <button class="btn btn--primary btn-split__arrow"><TIcon name="chevron-down" /></button>
                </div>
                <button class="btn btn--ai">
                  <IconMisaAI />Thêm bằng AI
                </button>
                <DropdownMenu :items="utilityItems" placement="bottom-end" :min-width="180">
                  <template #trigger="{ toggle }">
                    <button class="btn-icon btn-icon--outline" title="Tiện ích" @click.stop="toggle">
                      <TIcon name="dots" />
                    </button>
                  </template>
                </DropdownMenu>
              </template>
            </TableHeader>

            <!-- Main datatable -->
            <div class="datatable" ref="datatableRef">
              <div v-if="hoveredColKey" class="col-hover-line" :style="{ left: colHoverLineLeft + 'px' }"></div>

              <!-- Header row -->
              <div class="dt-row dt-row--header" :style="{ minWidth: totalRowMinWidth + 'px' }">
                <div class="dt-cell dt-cell--header" style="width:44px;flex-shrink:0">
                  <div class="dt-cell-inner" style="justify-content:center;padding:0">
                    <AppCheckbox v-model="selectAll" />
                  </div>
                </div>
                <div v-for="col in mainCols" :key="col.key" class="dt-cell dt-cell--header" :style="cellStyle(col)">
                  <div class="dt-cell-inner" :class="col.align === 'right' ? 'dt-cell-inner--right' : ''">
                    <span class="dt-header-text">{{ col.label }}</span>
                  </div>
                  <div class="dt-col-divider"
                    @mousedown.prevent="startResize($event, col)"
                    @mouseenter="onDividerEnter($event)"
                    @mouseleave="onDividerLeave"
                  ></div>
                </div>
              </div>

              <!-- Body rows -->
              <div
                v-for="(row, i) in filteredRows" :key="i"
                class="dt-row dt-row--body"
                :class="{ 'dt-row--selected': selected.includes(i), 'dt-row--active': activeRow === i }"
                :style="{ minWidth: totalRowMinWidth + 'px' }"
                @click="selectRow(i)"
              >
                <div class="dt-cell" style="width:44px;flex-shrink:0" @click.stop>
                  <div class="dt-cell-inner" style="justify-content:center;padding:0">
                    <AppCheckbox v-model="selected" :value="i" />
                  </div>
                </div>
                <div class="dt-cell" :style="cellStyle(mainCols[0])">
                  <div class="dt-cell-inner"><span class="dt-text">{{ row.ngayHachToan }}</span></div>
                </div>
                <div class="dt-cell" :style="cellStyle(mainCols[1])">
                  <div class="dt-cell-inner"><span class="dt-text">{{ row.ngayChungTu }}</span></div>
                </div>
                <div class="dt-cell" :style="cellStyle(mainCols[2])">
                  <div class="dt-cell-inner">
                    <button class="dt-action-link">{{ row.soChungTu }}</button>
                  </div>
                </div>
                <div class="dt-cell" :style="cellStyle(mainCols[3])">
                  <div class="dt-cell-inner"><span class="dt-text">{{ row.dienGiai }}</span></div>
                </div>
                <div class="dt-cell" :style="cellStyle(mainCols[4])">
                  <div class="dt-cell-inner dt-cell-inner--right">
                    <span class="dt-text dt-text--right" style="font-weight:var(--fw-semibold)">{{ row.soTien }}</span>
                  </div>
                </div>
                <div class="dt-cell" :style="cellStyle(mainCols[5])">
                  <div class="dt-cell-inner"><span class="dt-text">{{ row.doiTuong }}</span></div>
                </div>
                <div class="dt-cell" :style="cellStyle(mainCols[6])">
                  <div class="dt-cell-inner"><span class="dt-text">{{ row.soTaiKhoan }}</span></div>
                </div>
                <div class="dt-cell" :style="cellStyle(mainCols[7])">
                  <div class="dt-cell-inner"><span class="dt-text">{{ row.lyDo }}</span></div>
                </div>
                <div class="dt-cell" :style="cellStyle(mainCols[8])">
                  <div class="dt-cell-inner"><span class="dt-text">{{ row.loaiCT }}</span></div>
                </div>
                <!-- Sticky hover action column -->
                <div class="dt-cell dt-cell--actions">
                  <div class="row-actions">
                    <button class="btn-icon btn-icon--sm btn-icon--outline" title="Xem"><TIcon name="eye" /></button>
                    <button class="btn-icon btn-icon--sm btn-icon--outline" title="Sửa"><TIcon name="pencil" /></button>
                    <button class="btn-icon btn-icon--sm btn-icon--outline btn-icon--danger" title="Xóa"><TIcon name="trash" /></button>
                    <DropdownMenu :items="rowMoreItems" placement="bottom-end" :min-width="160">
                      <template #trigger="{ toggle }">
                        <button class="btn-icon btn-icon--sm btn-icon--outline" title="Thêm thao tác" @click.stop="toggle"><TIcon name="dots" /></button>
                      </template>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

            </div>

            <!-- Footer row (outside scroll area) -->
            <div class="dt-row dt-row--footer" :style="{ minWidth: totalRowMinWidth + 'px' }">
              <div class="dt-cell dt-cell--footer" style="width:44px;flex-shrink:0"></div>
              <div class="dt-cell dt-cell--footer" :style="cellStyle(mainCols[0])">
                <div class="dt-cell-inner"><span class="dt-footer-text">Tổng</span></div>
              </div>
              <div class="dt-cell dt-cell--footer" :style="cellStyle(mainCols[1])"></div>
              <div class="dt-cell dt-cell--footer" :style="cellStyle(mainCols[2])"></div>
              <div class="dt-cell dt-cell--footer" :style="cellStyle(mainCols[3])"></div>
              <div class="dt-cell dt-cell--footer" :style="cellStyle(mainCols[4])">
                <div class="dt-cell-inner dt-cell-inner--right">
                  <span class="dt-footer-text">122.654.462.794</span>
                </div>
              </div>
              <template v-for="col in mainCols.slice(5)" :key="col.key">
                <div class="dt-cell dt-cell--footer" :style="cellStyle(col)"></div>
              </template>
            </div>

            <!-- Main paging -->
            <TablePaging :total="63" v-model:page="currentPage" v-model:page-size="pageSize" />

            </div><!-- /data-panel--master -->

            <!-- Expand trigger when detail is collapsed -->
            <div v-if="activeRow !== null && !detailOpen" class="master-bottom-cep">
              <CollapseExpandPanel type="Collapse" position="Bottom" bg-color="White" @click="detailOpen = true" />
            </div>

            <!-- Panel resizer -->
            <div v-if="activeRow !== null && detailOpen" class="panel-resizer" @mousedown="startPanelResize" />

            <!-- Detail panel -->
            <div v-if="activeRow !== null && detailOpen" class="data-panel data-panel--detail" :style="{ height: detailHeight + 'px' }">
                <div class="detail-cep">
                  <CollapseExpandPanel
                    type="Collapse"
                    position="Top"
                    @click="detailOpen = false"
                  />
                </div>
                <div class="detail-panel__tabs">
                  <button class="sub-nav-tab active">Chi tiết</button>
                </div>
                <!-- Detail datatable -->
                <div class="datatable datatable--detail" ref="detailTableRef">
                  <div v-if="detailHoveredColKey" class="col-hover-line" :style="{ left: detailHoverLineLeft + 'px' }"></div>

                  <!-- Detail header -->
                  <div class="dt-row dt-row--header" :style="{ minWidth: totalDetailMinWidth + 'px' }">
                    <div v-for="col in detailCols" :key="col.key" class="dt-cell dt-cell--header" :style="detailCellStyle(col)">
                      <div class="dt-cell-inner">
                        <span class="dt-header-text">{{ col.label }}</span>
                      </div>
                      <div class="dt-col-divider"
                        @mousedown.prevent="startDetailResize($event, col)"
                        @mouseenter="onDetailDividerEnter($event)"
                        @mouseleave="onDetailDividerLeave"
                      ></div>
                    </div>
                  </div>

                  <!-- Detail body rows -->
                  <div
                    v-for="(row, i) in detailRows" :key="i"
                    class="dt-row dt-row--body"
                    :style="{ minWidth: totalDetailMinWidth + 'px' }"
                  >
                    <div class="dt-cell" :style="detailCellStyle(detailCols[0])">
                      <div class="dt-cell-inner dt-cell-inner--center">
                        <span class="dt-text" style="text-align:center">{{ row.stt }}</span>
                      </div>
                    </div>
                    <div class="dt-cell" :style="detailCellStyle(detailCols[1])">
                      <div class="dt-cell-inner"><span class="dt-text">{{ row.maHang }}</span></div>
                    </div>
                    <div class="dt-cell" :style="detailCellStyle(detailCols[2])">
                      <div class="dt-cell-inner"><span class="dt-text">{{ row.tenHang }}</span></div>
                    </div>
                    <div class="dt-cell" :style="detailCellStyle(detailCols[3])">
                      <div class="dt-cell-inner"><span class="dt-text">{{ row.viTri }}</span></div>
                    </div>
                    <div class="dt-cell" :style="detailCellStyle(detailCols[4])">
                      <div class="dt-cell-inner" style="justify-content:center;padding:0">
                        <AppCheckbox :model-value="row.chietKhau" @click.stop />
                      </div>
                    </div>
                    <div class="dt-cell" :style="detailCellStyle(detailCols[5])">
                      <div class="dt-cell-inner"><span class="dt-text">{{ row.tkTien }}</span></div>
                    </div>
                    <div class="dt-cell" :style="detailCellStyle(detailCols[6])">
                      <div class="dt-cell-inner"><span class="dt-text">{{ row.tkDoanhThu }}</span></div>
                    </div>
                    <div class="dt-cell" :style="detailCellStyle(detailCols[7])">
                      <div class="dt-cell-inner"><span class="dt-text">{{ row.doiTuong }}</span></div>
                    </div>
                    <div class="dt-cell" :style="detailCellStyle(detailCols[8])">
                      <div class="dt-cell-inner"><span class="dt-text">{{ row.tenDoiTuong }}</span></div>
                    </div>
                    <div class="dt-cell" :style="detailCellStyle(detailCols[9])">
                      <div class="dt-cell-inner"><span class="dt-text">{{ row.quyCach }}</span></div>
                    </div>
                  </div>

                </div>

                <!-- Detail footer (outside scroll area) -->
                <div class="dt-row dt-row--footer" :style="{ minWidth: totalDetailMinWidth + 'px' }">
                  <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[0])">
                    <div class="dt-cell-inner"><span class="dt-footer-text">Tổng</span></div>
                  </div>
                  <template v-for="col in detailCols.slice(1)" :key="col.key">
                    <div class="dt-cell dt-cell--footer" :style="detailCellStyle(col)"></div>
                  </template>
                </div>

                <!-- Detail paging -->
                <TablePaging :total="detailRows.length" v-model:page="detailPage" :page-size-options="[20]" />
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ControlHeader from '@mds/components/ControlHeader.vue'
import AppSidebar    from '@mds/components/AppSidebar.vue'
import TIcon         from '@mds/components/TIcon.vue'
import TableHeader   from '@mds/components/TableHeader.vue'
import DropdownMenu  from '@mds/components/DropdownMenu.vue'
import IconMisaAI    from '@mds/components/IconMisaAI.vue'
import AppCheckbox          from '@mds/components/AppCheckbox.vue'
import CollapseExpandPanel  from '@mds/components/CollapseExpandPanel.vue'
import TablePaging          from '@mds/components/TablePaging.vue'

const router = useRouter()

/* ── Nav ── */
const navItems = [
  { id: 'ban-lam-viec',   icon: 'home',               label: 'Tổng quan' },
  { id: 'tien-mat',       icon: 'cash',               label: 'Tiền mặt' },
  { id: 'tien-gui',       icon: 'building-bank',      label: 'Tiền gửi' },
  { id: 'mua-hang',       icon: 'package',            label: 'Mua hàng' },
  { id: 'ban-hang',       icon: 'shopping-cart',      label: 'Bán hàng' },
  { id: 'hd-dien-tu',     icon: 'file-check',         label: 'Kết nối HĐ điện tử' },
  { id: 'kho',            icon: 'building-warehouse', label: 'Kho' },
  { id: 'cong-cu',        icon: 'tool',               label: 'Công cụ dụng cụ' },
  { id: 'tien-luong',     icon: 'users',              label: 'Tiền lương' },
  { id: 'thue',           icon: 'file-invoice',       label: 'Thuế' },
  { id: 'bao-cao',        icon: 'chart-bar',          label: 'Báo cáo' },
  { id: 'kt-dich-vu',     icon: 'book',               label: 'Kế toán dịch vụ' },
  { id: 'danh-muc',       icon: 'list',               label: 'Danh mục' },
  { id: 'so-du-ban-dau',  icon: 'coin',               label: 'Số dư ban đầu' },
]

function onNav(id) {
  if (id === 'ban-lam-viec') router.push('/ketoan-dashboard')
  if (id === 'tien-mat')     router.push('/tien-mat')
  if (id === 'ban-hang')     router.push('/ban-hang')
}

/* ── Tabs ── */
const tabs = [
  { id: 'quy-trinh',       label: 'Quy trình' },
  { id: 'de-nghi-chi',     label: 'Đề nghị chi tiền' },
  { id: 'thu-chi-tien',    label: 'Thu, chi tiền' },
  { id: 'quyet-toan',      label: 'Đề nghị quyết toán tạm ứng' },
  { id: 'doi-chieu',       label: 'Đối chiếu ngân hàng' },
  { id: 'khe-uoc-vay',     label: 'Khế ước đi vay' },
  { id: 'du-bao',          label: 'Dự báo dòng tiền' },
  { id: 'nh-dien-tu',      label: 'Ngân hàng điện tử' },
  { id: 'khe-uoc-cho-vay', label: 'Khế ước cho vay' },
  { id: 'bao-cao',         label: 'Báo cáo' },
]
const activeTab  = ref('thu-chi-tien')
const kpiOpen    = ref(true)
const detailOpen = ref(false)

/* ── Table state ── */
const searchQuery = ref('')
const pageSize    = ref(20)
const currentPage = ref(1)
const detailPage  = ref(1)
const selected    = ref([])
const selectAll   = computed({
  get: () => filteredRows.value.length > 0 && selected.value.length === filteredRows.value.length,
  set: (val) => { selected.value = val ? filteredRows.value.map((_, i) => i) : [] }
})
const activeRow   = ref(null)
/* 3 rows visible: header(36) + 3×row(36) + footer(36) + tabs(36) + cep(16) + paging(48) = 280 */
const detailHeight = ref(280)

/* ── Main columns ── */
const ACTION_WIDTH = 140
const mainCols = [
  { key: 'ngayHachToan', label: 'Ngày hạch toán',  width: 108 },
  { key: 'ngayChungTu',  label: 'Ngày chứng từ',   width: 108 },
  { key: 'soChungTu',    label: 'Số chứng từ',     width: 108 },
  { key: 'dienGiai',     label: 'Diễn giải',        flex: true, minWidth: 200 },
  { key: 'soTien',       label: 'Số tiền',          width: 128, align: 'right' },
  { key: 'doiTuong',     label: 'Đối tượng',        width: 180 },
  { key: 'soTaiKhoan',   label: 'Số tài khoản NH',  width: 136 },
  { key: 'lyDo',         label: 'Lý do thu/chi',    width: 148 },
  { key: 'loaiCT',       label: 'Loại chứng từ',    width: 104 },
]
const lastColKey = mainCols[mainCols.length - 1].key

const colWidths       = ref(Object.fromEntries(mainCols.map(c => [c.key, c.width ?? c.minWidth ?? 100])))
const resizedFlexCols = ref({})

const totalRowMinWidth = computed(() =>
  44 + mainCols.reduce((sum, col) => {
    const base  = colWidths.value[col.key] ?? 0
    const extra = col.key === lastColKey ? ACTION_WIDTH : 0
    return sum + base + extra
  }, 0)
)

function cellStyle(col) {
  const extra = col.key === lastColKey ? ACTION_WIDTH : 0
  if (col.flex && !resizedFlexCols.value[col.key]) {
    const style = { flex: 1, minWidth: colWidths.value[col.key] + 'px', overflow: 'hidden' }
    if (extra) style.paddingRight = extra + 'px'
    return style
  }
  return { width: colWidths.value[col.key] + extra + 'px', flexShrink: 0 }
}

function selectRow(i) {
  activeRow.value = i
  detailOpen.value = true
}

function startPanelResize(e) {
  e.preventDefault()
  const startY = e.clientY
  const startH = detailHeight.value
  function onMove(ev) { detailHeight.value = Math.max(80, startH - (ev.clientY - startY)) }
  function onUp()     { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

const bulkMoreItems = [
  { id: 'delete',    icon: 'trash',       label: 'Xóa' },
  { id: 'export',    icon: 'file-export', label: 'Xuất Excel' },
]

const utilityItems = [
  { id: 'import',   icon: 'file-import',  label: 'Nhập khẩu từ Excel' },
  { id: 'export',   icon: 'file-export',  label: 'Xuất khẩu ra Excel' },
  { separator: true },
  { id: 'print',    icon: 'printer',      label: 'In danh sách' },
  { id: 'columns',  icon: 'layout-columns', label: 'Tùy chỉnh cột hiển thị' },
]

const rowMoreItems = [
  { id: 'copy',      icon: 'copy',        label: 'Sao chép' },
  { id: 'duplicate', icon: 'paperclip',   label: 'Nhân bản' },
  { separator: true },
  { id: 'print',     icon: 'file-export', label: 'In chứng từ' },
]

/* ── Detail columns ── */
const detailCols = [
  { key: 'stt',         label: '#',                     width: 44 },
  { key: 'maHang',      label: 'Mã hàng',               width: 100 },
  { key: 'tenHang',     label: 'Tên hàng',              flex: true, minWidth: 160 },
  { key: 'viTri',       label: 'Vị trí',                width: 100 },
  { key: 'chietKhau',   label: 'Chiết khấu thương mại', width: 168 },
  { key: 'tkTien',      label: 'TK tiền',               width: 80 },
  { key: 'tkDoanhThu',  label: 'TK doanh thu',          width: 104 },
  { key: 'doiTuong',    label: 'Đối tượng',             width: 100 },
  { key: 'tenDoiTuong', label: 'Tên đối tượng',         width: 148 },
  { key: 'quyCach',     label: 'Quy cách',              width: 100 },
]

const detailColWidths       = ref(Object.fromEntries(detailCols.map(c => [c.key, c.width ?? c.minWidth ?? 100])))
const detailResizedFlexCols = ref({})

const totalDetailMinWidth = computed(() =>
  detailCols.reduce((sum, col) => sum + (detailColWidths.value[col.key] ?? 0), 0)
)

function detailCellStyle(col) {
  if (col.flex && !detailResizedFlexCols.value[col.key]) {
    return { flex: 1, minWidth: detailColWidths.value[col.key] + 'px', overflow: 'hidden' }
  }
  return { width: detailColWidths.value[col.key] + 'px', flexShrink: 0 }
}

/* ── Column resize (main) ── */
const datatableRef     = ref(null)
const hoveredColKey    = ref(null)
const colHoverLineLeft = ref(0)

function startResize(e, col) {
  e.preventDefault()
  hoveredColKey.value = null
  const startX = e.clientX
  const extra  = col.key === lastColKey ? ACTION_WIDTH : 0
  let startW
  if (col.flex && !resizedFlexCols.value[col.key]) {
    startW = e.currentTarget.parentElement.getBoundingClientRect().width - extra
    colWidths.value[col.key] = Math.round(startW)
    resizedFlexCols.value[col.key] = true
  } else {
    startW = colWidths.value[col.key]
  }
  function onMove(ev) { colWidths.value[col.key] = Math.max(60, startW + ev.clientX - startX) }
  function onUp()     { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onDividerEnter(e) {
  const divRect   = e.currentTarget.getBoundingClientRect()
  const tableRect = datatableRef.value.getBoundingClientRect()
  colHoverLineLeft.value = divRect.left + 4 - tableRect.left
  hoveredColKey.value = true
}
function onDividerLeave() { hoveredColKey.value = null }

onMounted(() => {
  nextTick(() => {
    if (!datatableRef.value) return
    const fixedSum = 44 + ACTION_WIDTH + mainCols.reduce((s, c) => c.flex ? s : s + (colWidths.value[c.key] ?? 0), 0)
    const available = datatableRef.value.clientWidth - fixedSum
    mainCols.filter(c => c.flex).forEach(c => {
      colWidths.value[c.key] = Math.max(c.minWidth ?? 100, available)
      resizedFlexCols.value[c.key] = true
    })
  })
})

/* ── Column resize (detail) ── */
const detailTableRef      = ref(null)
const detailHoveredColKey = ref(null)
const detailHoverLineLeft = ref(0)

function startDetailResize(e, col) {
  e.preventDefault()
  detailHoveredColKey.value = null
  const startX = e.clientX
  let startW
  if (col.flex && !detailResizedFlexCols.value[col.key]) {
    startW = e.currentTarget.parentElement.getBoundingClientRect().width
    detailColWidths.value[col.key] = Math.round(startW)
    detailResizedFlexCols.value[col.key] = true
  } else {
    startW = detailColWidths.value[col.key]
  }
  function onMove(ev) { detailColWidths.value[col.key] = Math.max(60, startW + ev.clientX - startX) }
  function onUp()     { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function onDetailDividerEnter(e) {
  const divRect   = e.currentTarget.getBoundingClientRect()
  const tableRect = detailTableRef.value.getBoundingClientRect()
  detailHoverLineLeft.value = divRect.left + 4 - tableRect.left
  detailHoveredColKey.value = true
}
function onDetailDividerLeave() { detailHoveredColKey.value = null }

/* ── Main data ── */
const rows = [
  { ngayHachToan: '20/05/2026', ngayChungTu: '20/05/2026', soChungTu: 'NTTK00064', dienGiai: 'Thu tiền bán hàng Công ty TNHH Xây dựng Thịnh Phát',           soTien: '784.500.000',   doiTuong: 'Công ty TNHH Xây dựng Thịnh Phát',       soTaiKhoan: '23268868',    lyDo: 'Bán hàng hóa trong nước (có HĐ)', loaiCT: 'Bán hàng' },
  { ngayHachToan: '10/05/2026', ngayChungTu: '10/05/2026', soChungTu: 'NTTK00006', dienGiai: 'Thu tiền bán hàng Công ty Cổ phần Xây dựng An Khang',          soTien: '22.330.000',    doiTuong: 'Công ty Cổ phần Xây dựng An Khang',      soTaiKhoan: '23268868',    lyDo: 'Bán hàng hóa trong nước (có HĐ)', loaiCT: 'Bán hàng' },
  { ngayHachToan: '07/05/2026', ngayChungTu: '07/05/2026', soChungTu: 'UNC00025',  dienGiai: 'Chi nộp thuế nhập khẩu, thuế giá trị gia tăng tháng 04/2026', soTien: '92.515.315',    doiTuong: '',                                        soTaiKhoan: '23268868',    lyDo: 'Nộp thuế GTGT hàng nhập khẩu',   loaiCT: 'Nộp thuế' },
  { ngayHachToan: '07/05/2026', ngayChungTu: '07/05/2026', soChungTu: 'UNC00024',  dienGiai: 'Chi nộp thuế nhập khẩu, thuế giá trị gia tăng tháng 04/2026', soTien: '88.486.090',    doiTuong: '',                                        soTaiKhoan: '23268868',    lyDo: 'Nộp thuế GTGT hàng nhập khẩu',   loaiCT: 'Nộp thuế' },
  { ngayHachToan: '07/05/2026', ngayChungTu: '07/05/2026', soChungTu: 'UNC00023',  dienGiai: 'Chi tiền điện T5 Theo HD 5496',                                soTien: '10.523.700',    doiTuong: 'Công Ty TNHH Nước Giải Khát Suntory',    soTaiKhoan: '23268868',    lyDo: 'Chi mua ngoài có hóa đơn',        loaiCT: 'Ủy nhiệm chi' },
  { ngayHachToan: '06/05/2026', ngayChungTu: '06/05/2026', soChungTu: 'UNC00022',  dienGiai: 'QUẢNG CÁO THEO HD 96',                                        soTien: '61.600.000',    doiTuong: 'Công ty TNHH Thực Phẩm Hoàng Gia',       soTaiKhoan: '23268868',    lyDo: 'Chứng từ mua dịch vụ',           loaiCT: 'Chứng từ' },
  { ngayHachToan: '01/05/2026', ngayChungTu: '01/05/2026', soChungTu: 'UNC00057',  dienGiai: 'Trả tiền cho 6. Công Ty Cổ Phần Masan Consumer',              soTien: '539.453.200',   doiTuong: '6. Công Ty Cổ Phần Masan Consumer',      soTaiKhoan: '150129507001',lyDo: 'Trả tiền nhà cung cấp',           loaiCT: 'Trả tiền nhà CC' },
  { ngayHachToan: '30/04/2026', ngayChungTu: '30/04/2026', soChungTu: 'UNC00088',  dienGiai: 'Trả tiền cho Công Ty TNHH Ân Nam Fine Foods',                 soTien: '1.153.781.460', doiTuong: 'Công ty TNHH Ân Nam Fine Foods',         soTaiKhoan: '6656566339',  lyDo: 'Trả tiền nhà cung cấp',           loaiCT: 'Trả tiền nhà CC' },
  { ngayHachToan: '30/04/2026', ngayChungTu: '30/04/2026', soChungTu: 'UNC00069',  dienGiai: 'Trả tiền cho Công Ty TNHH Đồ Uống Việt',                     soTien: '384.670.000',   doiTuong: 'Công ty TNHH Đồ Uống Việt (Demo)',       soTaiKhoan: '23268868',    lyDo: 'Trả tiền nhà cung cấp',           loaiCT: 'Trả tiền nhà CC' },
  { ngayHachToan: '20/04/2026', ngayChungTu: '20/04/2026', soChungTu: 'UNC00059',  dienGiai: 'Trả tiền cho Công Ty Cổ Phần Bia Sài Gòn Bình Tây',          soTien: '822.573.000',   doiTuong: 'Công ty Cổ Phần Bia Sài Gòn Bình Tây',   soTaiKhoan: '23268868',    lyDo: 'Trả tiền nhà cung cấp',           loaiCT: 'Trả tiền nhà CC' },
]

const filteredRows = computed(() => {
  if (!searchQuery.value) return rows
  const q = searchQuery.value.toLowerCase()
  return rows.filter(r =>
    r.soChungTu.toLowerCase().includes(q) ||
    r.dienGiai.toLowerCase().includes(q)  ||
    r.doiTuong.toLowerCase().includes(q)
  )
})

/* ── Detail data ── */
const detailRows = [
  { stt: 1, maHang: 'HH001', tenHang: 'Thịt bò Úc',               viTri: '', chietKhau: false, tkTien: '1121', tkDoanhThu: '5111', doiTuong: 'KH0003', tenDoiTuong: 'Công ty TNHH Xây dựng Thịnh Phát', quyCach: '' },
  { stt: 2, maHang: 'HH002', tenHang: 'Cá hồi Nauy',              viTri: '', chietKhau: false, tkTien: '1121', tkDoanhThu: '5111', doiTuong: 'KH0003', tenDoiTuong: 'Công ty TNHH Xây dựng Thịnh Phát', quyCach: '' },
  { stt: 3, maHang: 'HH004', tenHang: 'Phở bò tái',               viTri: '', chietKhau: false, tkTien: '1121', tkDoanhThu: '5111', doiTuong: 'KH0003', tenDoiTuong: 'Công ty TNHH Xây dựng Thịnh Phát', quyCach: '' },
  { stt: 4, maHang: 'HH006', tenHang: 'Súp hành kiểu Pháp',       viTri: '', chietKhau: false, tkTien: '1121', tkDoanhThu: '5111', doiTuong: 'KH0003', tenDoiTuong: 'Công ty TNHH Xây dựng Thịnh Phát', quyCach: '' },
  { stt: 5, maHang: 'HH008', tenHang: 'Nước khoáng Lavie',        viTri: '', chietKhau: false, tkTien: '1121', tkDoanhThu: '5111', doiTuong: 'KH0003', tenDoiTuong: 'Công ty TNHH Xây dựng Thịnh Phát', quyCach: '' },
  { stt: 6, maHang: 'HH009', tenHang: 'Champagne Moët & Chandon', viTri: '', chietKhau: false, tkTien: '1121', tkDoanhThu: '5111', doiTuong: 'KH0003', tenDoiTuong: 'Công ty TNHH Xây dựng Thịnh Phát', quyCach: '' },
]
</script>

<style scoped>
.sub-nav { border-bottom: 1px solid var(--stroke-neutral-light); background: var(--bg-white); flex-shrink: 0; }
.sub-nav__scroll {
  display: flex; align-items: flex-end; height: 100%;
  overflow-x: auto; scrollbar-width: none;
}
.sub-nav__scroll::-webkit-scrollbar { display: none; }

.content-wrapper {
  flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 16px; position: relative;
}
.table-panel {
  flex: 1; min-height: 0; display: flex; flex-direction: column;
}
.data-panel--master {
  flex: 1; min-height: 0; display: flex; flex-direction: column;
  background: var(--bg-white); border-radius: 8px; overflow: hidden;
}
.data-panel--detail {
  flex-shrink: 0; display: flex; flex-direction: column;
  background: var(--bg-white); border-radius: 8px; overflow: hidden;
}

/* KPI */
.kpi-row { display: flex; gap: 12px; flex-shrink: 0; }
.kpi-cep { display: flex; justify-content: center; flex-shrink: 0; margin-bottom: 4px; }
.kpi-cep--pinned { position: absolute; top: 0; left: 0; right: 0; margin-bottom: 0; z-index: 10; }
.kpi-card { position: relative; flex: 1; display: flex; flex-direction: row; align-items: center; padding: 8px 16px; gap: 12px; background: var(--bg-white); border-radius: 8px; }
.kpi-card__reload { position: absolute; top: 6px; right: 8px; opacity: 0; transition: opacity 0.15s; }
.kpi-card:hover .kpi-card__reload { opacity: 1; }
.kpi-card__content { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.kpi-card__label { font-size: 12px; font-weight: var(--fw-medium); color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kpi-card__bottom { display: flex; align-items: center; gap: 8px; }
.kpi-card__value { font-size: 18px; font-weight: var(--fw-semibold); line-height: 26px; }
.kpi-card__value--success { color: var(--text-success); }
.kpi-card__value--warning  { color: var(--text-warning); }
.kpi-card__value--brand    { color: var(--text-brand); }
.kpi-card__time { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--text-secondary); white-space: nowrap; cursor: default; }
.kpi-card__time .t-icon { color: var(--icon-neutral); }
.kpi-card__icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.kpi-card__icon--success { background: var(--bg-success-light); color: var(--text-success); }
.kpi-card__icon--warning  { background: var(--bg-warning-light); color: var(--text-warning); }
.kpi-card__icon--brand    { background: var(--bg-brand-light);   color: var(--text-brand); }

/* Datatable */
.datatable { flex: 1; min-height: 0; overflow-y: auto; }


/* Panel resizer */
.panel-resizer {
  height: 8px; flex-shrink: 0; cursor: ns-resize;
  display: flex; align-items: center; justify-content: center;
}
.panel-resizer::after {
  content: ''; width: 32px; height: 3px;
  background: var(--stroke-neutral); border-radius: 2px;
  opacity: 0; transition: opacity 0.15s;
}
.panel-resizer:hover::after { opacity: 1; }

.master-bottom-cep {
  position: absolute; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: center;
}
.detail-cep {
  display: flex; justify-content: center; flex-shrink: 0;
}
.detail-panel__tabs {
  display: flex; align-items: flex-end; flex-shrink: 0; padding: 0 4px;
}
.detail-panel__tabs .sub-nav-tab { height: 36px; }
.datatable--detail { flex: 1; min-height: 0; overflow-y: auto; height: 230px; }

</style>
