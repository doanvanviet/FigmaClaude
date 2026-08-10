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
      <AppSidebar :items="navItems" active-id="tien-mat" @nav="onNav" />

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
                    <span class="kpi-card__value kpi-card__value--success">89.245.600.000</span>
                    <span class="kpi-card__time" title="Số liệu tính đến: 15h59">
                      <TIcon name="clock" /><span>15:59</span>
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
                    <span class="kpi-card__value kpi-card__value--warning">86.628.811.039</span>
                    <span class="kpi-card__time" title="Số liệu tính đến: 15h59">
                      <TIcon name="clock" /><span>15:59</span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="kpi-card">
                <button class="kpi-card__reload btn-icon btn-icon--sm"><TIcon name="refresh" /></button>
                <div class="kpi-card__icon kpi-card__icon--brand"><TIcon name="cash" /></div>
                <div class="kpi-card__content">
                  <span class="kpi-card__label">Tổng quỹ tiền mặt</span>
                  <div class="kpi-card__bottom">
                    <span class="kpi-card__value kpi-card__value--brand">2.616.788.961.791</span>
                    <span class="kpi-card__time" title="Số liệu tính đến: 15h59">
                      <TIcon name="clock" /><span>15:59</span>
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

              <TableHeader
                v-model="searchQuery"
                search-placeholder="Tìm theo số chứng từ, nội dung..."
                :search-width="280"
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
                <template #filters>
                  <div class="ibox" style="width:160px;cursor:pointer;gap:4px">
                    <span style="font-size:13px;color:var(--text-secondary);white-space:nowrap;flex-shrink:0">Trường:</span>
                    <select class="ibox__native ibox__native--select" v-model="truong">
                      <option value="all">Tất cả</option>
                      <option value="so_ct">Số chứng từ</option>
                      <option value="dien_giai">Diễn giải</option>
                      <option value="doi_tuong">Đối tượng</option>
                    </select>
                    <TIcon name="chevron-down" class="ibox__icon" style="font-size:14px;pointer-events:none" />
                  </div>
                </template>
                <template #main-buttons>
                  <div class="btn-split">
                    <button class="btn btn--primary" @click="openPopup('thu')"><TIcon name="plus" />Thêm thu tiền</button>
                    <button class="btn btn--primary btn-split__arrow"><TIcon name="chevron-down" /></button>
                  </div>
                  <div class="btn-split">
                    <button class="btn btn--outline btn--neutral" @click="openPopup('chi')"><TIcon name="plus" />Thêm chi tiền</button>
                    <button class="btn btn--outline btn--neutral btn-split__arrow"><TIcon name="chevron-down" /></button>
                  </div>
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
                <div v-if="hoveredColKey" class="col-hover-line" :style="{ left: colHoverLineLeft + 'px' }" />
                <!-- Header row -->
                <div class="dt-row dt-row--header" :style="{ minWidth: totalRowMinWidth + 'px' }">
                  <div class="dt-cell dt-cell--header" style="width:44px;flex-shrink:0">
                    <div class="dt-cell-inner" style="justify-content:center;padding:0">
                      <AppCheckbox v-model="selectAll" />
                    </div>
                  </div>
                  <div v-for="col in columns" :key="col.key"
                    class="dt-cell dt-cell--header"
                    :style="cellStyle(col)"
                  >
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
                  <div class="dt-cell" :style="cellStyle(columns[0])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.date }}</span></div>
                  </div>
                  <div class="dt-cell" :style="cellStyle(columns[1])">
                    <div class="dt-cell-inner">
                      <button class="dt-action-link">{{ row.voucher }}</button>
                    </div>
                  </div>
                  <div class="dt-cell" :style="cellStyle(columns[2])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.desc }}</span></div>
                  </div>
                  <div class="dt-cell" :style="cellStyle(columns[3])">
                    <div class="dt-cell-inner dt-cell-inner--right">
                      <span class="dt-text dt-text--right" style="font-weight:var(--fw-semibold)">{{ row.amount }}</span>
                    </div>
                  </div>
                  <div class="dt-cell" :style="cellStyle(columns[4])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.partner }}</span></div>
                  </div>
                  <div class="dt-cell" :style="cellStyle(columns[5])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.reason }}</span></div>
                  </div>
                  <div class="dt-cell" :style="cellStyle(columns[6])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.type }}</span></div>
                  </div>
                  <div class="dt-cell" :style="cellStyle(columns[7])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.shopVoucher }}</span></div>
                  </div>
                  <div class="dt-cell" :style="cellStyle(columns[8])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.cukcukVoucher }}</span></div>
                  </div>
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
                <div class="dt-cell dt-cell--footer" :style="cellStyle(columns[0])">
                  <div class="dt-cell-inner"><span class="dt-footer-text">Tổng</span></div>
                </div>
                <div class="dt-cell dt-cell--footer" :style="cellStyle(columns[1])"></div>
                <div class="dt-cell dt-cell--footer" :style="cellStyle(columns[2])"></div>
                <div class="dt-cell dt-cell--footer" :style="cellStyle(columns[3])">
                  <div class="dt-cell-inner dt-cell-inner--right">
                    <span class="dt-footer-text">268.600.000</span>
                  </div>
                </div>
                <template v-for="col in columns.slice(4)" :key="col.key">
                  <div class="dt-cell dt-cell--footer" :style="cellStyle(col)"></div>
                </template>
              </div>

              <!-- Main paging -->
              <TablePaging :total="filteredRows.length" v-model:page="currentPage" v-model:page-size="pageSize" />

            </div><!-- /data-panel--master -->

            <!-- Expand trigger when detail is collapsed -->
            <div v-if="activeRow !== null && !detailOpen" class="master-bottom-cep">
              <CollapseExpandPanel type="Collapse" position="Bottom" bg-color="White" @click="detailOpen = true" />
            </div>

            <!-- Panel resizer -->
            <div v-if="activeRow !== null && detailOpen" class="panel-resizer" @mousedown="startPanelResize" />

            <!-- Detail panel -->
            <div v-if="activeRow !== null && detailOpen"
              class="data-panel data-panel--detail"
              :style="{ height: detailHeight + 'px' }">
              <div class="detail-cep">
                <CollapseExpandPanel type="Collapse" position="Top" @click="detailOpen = false" />
              </div>
              <div class="detail-panel__tabs">
                <button class="sub-nav-tab active">Chi tiết</button>
              </div>
              <div class="datatable datatable--detail" ref="detailTableRef">
                <div v-if="detailHoveredColKey" class="col-hover-line" :style="{ left: detailHoverLineLeft + 'px' }" />

                <div class="dt-row dt-row--header" :style="{ minWidth: totalDetailMinWidth + 'px' }">
                  <div v-for="col in detailCols" :key="col.key" class="dt-cell dt-cell--header" :style="detailCellStyle(col)">
                    <div class="dt-cell-inner" :class="col.align === 'right' ? 'dt-cell-inner--right' : ''">
                      <span class="dt-header-text">{{ col.label }}</span>
                    </div>
                    <div class="dt-col-divider"
                      @mousedown.prevent="startDetailResize($event, col)"
                      @mouseenter="onDetailDividerEnter($event)"
                      @mouseleave="onDetailDividerLeave"
                    ></div>
                  </div>
                </div>

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
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.tkNo }}</span></div>
                  </div>
                  <div class="dt-cell" :style="detailCellStyle(detailCols[2])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.tkCo }}</span></div>
                  </div>
                  <div class="dt-cell" :style="detailCellStyle(detailCols[3])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.dienGiai }}</span></div>
                  </div>
                  <div class="dt-cell" :style="detailCellStyle(detailCols[4])">
                    <div class="dt-cell-inner dt-cell-inner--right">
                      <span class="dt-text dt-text--right" style="font-weight:var(--fw-semibold)">{{ row.soTien }}</span>
                    </div>
                  </div>
                  <div class="dt-cell" :style="detailCellStyle(detailCols[5])">
                    <div class="dt-cell-inner"><span class="dt-text">{{ row.doiTuong }}</span></div>
                  </div>
                </div>
              </div>

              <!-- Detail footer (outside scroll area) -->
              <div class="dt-row dt-row--footer" :style="{ minWidth: totalDetailMinWidth + 'px' }">
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[0])">
                  <div class="dt-cell-inner"><span class="dt-footer-text">Tổng</span></div>
                </div>
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[1])"></div>
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[2])"></div>
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[3])"></div>
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[4])">
                  <div class="dt-cell-inner dt-cell-inner--right">
                    <span class="dt-footer-text">15.000.000</span>
                  </div>
                </div>
                <div class="dt-cell dt-cell--footer" :style="detailCellStyle(detailCols[5])"></div>
              </div>

              <!-- Detail paging -->
              <TablePaging :total="detailRows.length" v-model:page="detailPage" :page-size-options="[20]" />
            </div>

          </div><!-- /table-panel -->
        </div><!-- /content-wrapper -->
      </div>
    </div>
  </div>

  <!-- Popup Thu / Chi tiền mặt -->
  <PhieuTienMatPopup
    v-if="popup.show"
    :type="popup.type"
    @close="popup.show = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import PhieuTienMatPopup    from '../components/PhieuTienMatPopup.vue'
import ControlHeader        from '@mds/components/ControlHeader.vue'
import AppSidebar           from '@mds/components/AppSidebar.vue'
import TIcon                from '@mds/components/TIcon.vue'
import TableHeader          from '@mds/components/TableHeader.vue'
import DropdownMenu         from '@mds/components/DropdownMenu.vue'
import AppCheckbox          from '@mds/components/AppCheckbox.vue'
import CollapseExpandPanel  from '@mds/components/CollapseExpandPanel.vue'
import TablePaging          from '@mds/components/TablePaging.vue'

const router = useRouter()

/* ── Nav ── */
const navItems = [
  { id: 'ban-lam-viec',     icon: 'home',               label: 'Tổng quan' },
  { id: 'tien-mat',         icon: 'cash',               label: 'Tiền mặt' },
  { id: 'tien-gui',         icon: 'building-bank',      label: 'Tiền gửi' },
  { id: 'mua-hang',         icon: 'package',            label: 'Mua hàng' },
  { id: 'ban-hang',         icon: 'shopping-cart',      label: 'Bán hàng' },
  { id: 'hd-dien-tu',       icon: 'file-check',         label: 'Kết nối HĐ điện tử' },
  { id: 'kho',              icon: 'building-warehouse', label: 'Kho' },
  { id: 'cong-cu',          icon: 'tool',               label: 'Công cụ dụng cụ' },
  { id: 'tien-luong',       icon: 'users',              label: 'Tiền lương' },
  { id: 'thue',             icon: 'file-invoice',       label: 'Thuế' },
  { id: 'bao-cao',          icon: 'chart-bar',          label: 'Báo cáo' },
  { id: 'kt-dich-vu',       icon: 'book',               label: 'Kế toán dịch vụ' },
  { id: 'danh-muc',         icon: 'list',               label: 'Danh mục' },
  { id: 'so-du-ban-dau',    icon: 'coin',               label: 'Số dư ban đầu' },
]

function onNav(id) {
  if (id === 'ban-lam-viec') router.push('/ketoan-dashboard')
  if (id === 'tien-gui')     router.push('/tien-gui')
  if (id === 'ban-hang')     router.push('/ban-hang')
}

/* ── Tabs ── */
const tabs = [
  { id: 'thu-chi',   label: 'Thu, chi' },
  { id: 'thu-tien',  label: 'Thu tiền' },
  { id: 'chi-tien',  label: 'Chi tiền' },
  { id: 'kiem-ke',   label: 'Kiểm kê' },
]
const popup = ref({ show: false, type: 'thu' })
function openPopup(type) { popup.value = { show: true, type } }
const activeTab  = ref('thu-chi')
const kpiOpen    = ref(true)
const detailOpen = ref(false)

/* ── Table state ── */
const searchQuery = ref('')
const truong      = ref('all')
const pageSize    = ref(20)
const currentPage = ref(1)
const detailPage  = ref(1)
const selected    = ref([])
const selectAll   = computed({
  get: () => filteredRows.value.length > 0 && selected.value.length === filteredRows.value.length,
  set: (val) => { selected.value = val ? filteredRows.value.map((_, i) => i) : [] }
})
const activeRow   = ref(null)
/* 280px ≈ header(36) + 3×row(36) + footer(36) + tabs(36) + cep(16) + paging(48) */
const detailHeight = ref(280)

/* ── Main columns ── */
const columns = [
  { key: 'date',          label: 'Ngày hạch toán',    width: 112 },
  { key: 'voucher',       label: 'Số chứng từ',        width: 112 },
  { key: 'desc',          label: 'Diễn giải',          flex: true, minWidth: 180 },
  { key: 'amount',        label: 'Số tiền',            width: 124, align: 'right' },
  { key: 'partner',       label: 'Đối tượng',          width: 168 },
  { key: 'reason',        label: 'Lý do thu chi',      width: 148 },
  { key: 'type',          label: 'Loại chứng từ',      width: 112 },
  { key: 'shopVoucher',   label: 'Số chứng từ eShop',  width: 144 },
  { key: 'cukcukVoucher', label: 'Số chứng từ CUKCUK', width: 168 },
]

const ACTION_WIDTH    = 140
const lastColKey      = columns[columns.length - 1].key
const colWidths       = ref(Object.fromEntries(columns.map(c => [c.key, c.width ?? c.minWidth ?? 100])))
const resizedFlexCols = ref({})

const totalRowMinWidth = computed(() =>
  44 + columns.reduce((sum, col) => {
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
    const fixedSum = 44 + ACTION_WIDTH + columns.reduce((s, c) => c.flex ? s : s + (colWidths.value[c.key] ?? 0), 0)
    const available = datatableRef.value.clientWidth - fixedSum
    columns.filter(c => c.flex).forEach(c => {
      colWidths.value[c.key] = Math.max(c.minWidth ?? 100, available)
      resizedFlexCols.value[c.key] = true
    })
  })
})

/* ── Detail columns ── */
const detailCols = [
  { key: 'stt',       label: '#',          width: 44 },
  { key: 'tkNo',      label: 'TK Nợ',      width: 80 },
  { key: 'tkCo',      label: 'TK Có',      width: 80 },
  { key: 'dienGiai',  label: 'Diễn giải',  flex: true, minWidth: 200 },
  { key: 'soTien',    label: 'Số tiền',    width: 124, align: 'right' },
  { key: 'doiTuong',  label: 'Đối tượng',  width: 180 },
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

/* ── Dropdown items ── */
const bulkMoreItems = [
  { id: 'delete', icon: 'trash',       label: 'Xóa' },
  { id: 'export', icon: 'file-export', label: 'Xuất Excel' },
]

const utilityItems = [
  { id: 'import',  icon: 'file-import',    label: 'Nhập khẩu từ Excel' },
  { id: 'export',  icon: 'file-export',    label: 'Xuất khẩu ra Excel' },
  { separator: true },
  { id: 'print',   icon: 'printer',        label: 'In danh sách' },
  { id: 'columns', icon: 'layout-columns', label: 'Tùy chỉnh cột hiển thị' },
]

const rowMoreItems = [
  { id: 'copy',      icon: 'copy',        label: 'Sao chép' },
  { id: 'duplicate', icon: 'paperclip',   label: 'Nhân bản' },
  { separator: true },
  { id: 'print',     icon: 'file-export', label: 'In chứng từ' },
]

/* ── Main data ── */
const rows = [
  { date: '21/04/2026', voucher: 'PT0001', desc: 'Thu tiền khách hàng Công ty TNHH MTV ABC',         amount: '15.000.000',  partner: 'Công ty TNHH MTV ABC',           reason: 'Thu nợ khách hàng',    type: 'Thu tiền', shopVoucher: '',          cukcukVoucher: 'ORDER-12345' },
  { date: '21/04/2026', voucher: 'PC0001', desc: 'Chi tiền mua văn phòng phẩm',                       amount: '2.500.000',   partner: 'Cửa hàng Hồng Hà',               reason: 'Mua hàng ngoài',       type: 'Chi tiền', shopVoucher: 'BILL-999',   cukcukVoucher: '' },
  { date: '20/04/2026', voucher: 'PT0002', desc: 'Thu tạm ứng hoàn thừa - Nguyễn Văn A',             amount: '1.000.000',   partner: 'Nguyễn Văn A',                    reason: 'Thu khác',             type: 'Thu tiền', shopVoucher: '',          cukcukVoucher: '' },
  { date: '20/04/2026', voucher: 'PC0002', desc: 'Chi tiền điện tháng 04/2026',                       amount: '4.200.000',   partner: 'Công ty Điện lực Việt Nam',       reason: 'Chi khác',             type: 'Chi tiền', shopVoucher: '',          cukcukVoucher: '' },
  { date: '19/04/2026', voucher: 'PT0003', desc: 'Thu tiền lãi tiền gửi ngân hàng',                   amount: '12.500.000',  partner: 'Ngân hàng Vietcombank',           reason: 'Thu khác',             type: 'Thu tiền', shopVoucher: '',          cukcukVoucher: '' },
  { date: '19/04/2026', voucher: 'PC0003', desc: 'Chi tạm ứng đi công tác - Trần Thị B',             amount: '5.000.000',   partner: 'Trần Thị B',                      reason: 'Chi tạm ứng',          type: 'Chi tiền', shopVoucher: '',          cukcukVoucher: '' },
  { date: '18/04/2026', voucher: 'PT0004', desc: 'Thu tiền mặt từ bán hàng trực tiếp',                amount: '8.900.000',   partner: 'Khách vãng lai',                  reason: 'Thu tiền bán hàng',    type: 'Thu tiền', shopVoucher: 'BILL-1002', cukcukVoucher: '' },
  { date: '18/04/2026', voucher: 'PC0004', desc: 'Chi trả nợ nhà cung cấp - Cty Hòa Phát',           amount: '50.000.000',  partner: 'Công ty CP Tập đoàn Hòa...',     reason: 'Trả nợ nhà cung cấp', type: 'Chi tiền', shopVoucher: '',          cukcukVoucher: '' },
  { date: '17/04/2026', voucher: 'PT0005', desc: 'Thu tiền rút từ tài khoản ngân hàng về nhập quỹ',  amount: '100.000.000', partner: 'Kế toán trưởng',                  reason: 'Thu khác',             type: 'Thu tiền', shopVoucher: '',          cukcukVoucher: '' },
  { date: '17/04/2026', voucher: 'PC0005', desc: 'Chi tiền mặt gửi vào tài khoản ngân hàng',         amount: '70.000.000',  partner: 'Thủ quỹ',                         reason: 'Chi khác',             type: 'Chi tiền', shopVoucher: '',          cukcukVoucher: '' },
]

const filteredRows = computed(() => {
  if (!searchQuery.value) return rows
  const q = searchQuery.value.toLowerCase()
  return rows.filter(r =>
    r.voucher.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q)
  )
})

/* ── Detail data ── */
const detailRows = [
  { stt: 1, tkNo: '1111', tkCo: '131',  dienGiai: 'Thu tiền khách hàng Công ty TNHH MTV ABC', soTien: '15.000.000', doiTuong: 'Công ty TNHH MTV ABC' },
  { stt: 2, tkNo: '1111', tkCo: '3331', dienGiai: 'Thuế GTGT đầu vào',                        soTien: '1.500.000',  doiTuong: '' },
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
.kpi-cep { display: flex; justify-content: center; flex-shrink: 0; margin-top: -1px; margin-bottom: 0; }
.kpi-cep--pinned { position: absolute; top: 0; left: 0; right: 0; margin-top: 0; margin-bottom: 0; z-index: 10; }
.kpi-card { position: relative; flex: 1; display: flex; flex-direction: row; align-items: center; padding: 8px 16px; gap: 12px; background: var(--bg-white); border-radius: 8px; }
.kpi-card__reload { position: absolute; top: 6px; right: 8px; opacity: 0; transition: opacity 0.15s; }
.kpi-card:hover .kpi-card__reload { opacity: 1; }
.kpi-card__icon   { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.kpi-card__icon--success { background: var(--bg-success-light); color: var(--text-success); }
.kpi-card__icon--warning  { background: var(--bg-warning-light); color: var(--text-warning); }
.kpi-card__icon--brand    { background: var(--bg-brand-light);   color: var(--text-brand); }
.kpi-card__content { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.kpi-card__label   { font-size: 12px; font-weight: var(--fw-medium); color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kpi-card__bottom  { display: flex; align-items: center; gap: 8px; }
.kpi-card__value   { font-size: 18px; font-weight: var(--fw-semibold); line-height: 26px; }
.kpi-card__value--success { color: var(--text-success); }
.kpi-card__value--warning  { color: var(--text-warning); }
.kpi-card__value--brand    { color: var(--text-brand); }
.kpi-card__time { display: flex; align-items: center; gap: 3px; font-size: 11px; color: var(--text-secondary); white-space: nowrap; cursor: default; }
.kpi-card__time .t-icon { color: var(--icon-neutral); }

/* Datatable */
.datatable { flex: 1; min-height: 0; overflow-y: auto; }
.datatable--detail { flex: 1; min-height: 0; overflow-y: auto; height: 230px; }

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
</style>
