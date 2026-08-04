<template>
  <AppShell>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title h2">Tổng quan</h1>
      </div>
      <div class="page-header__right">
        <select class="input input--select" style="width:140px" v-model="period">
          <option value="thang">Tháng này</option>
          <option value="quy">Quý này</option>
          <option value="nam">Năm nay</option>
        </select>
      </div>
    </div>

    <div class="content-wrapper tq-wrapper">

      <!-- ── Row KPI (Chart Stat Card — Figma 6828:52005) ── -->
      <div class="kpi-row">
        <div class="kpi-card" v-for="k in kpiCards" :key="k.label">
          <!-- Header: title + reload (hover) | icon badge -->
          <div class="card__head card__head--kpi">
            <div class="card__title-wrap">
              <span class="kpi-card__title">{{ k.label }}</span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
            <div class="kpi-icon-badge" :class="`kpi-icon-badge--${k.theme}`">
              <TIcon :name="k.icon" />
            </div>
          </div>
          <!-- Stat: value + trend badge -->
          <div class="kpi-card__stat">
            <div class="kpi-card__value">{{ k.value }}</div>
            <div class="kpi-card__trend" :class="k.pctUp ? 'trend--up' : 'trend--down'">
              <TIcon :name="k.pctUp ? 'trending-up' : 'trending-down'" />
              <span class="trend-pct">{{ k.pct }}</span>
              <span class="trend-label">{{ k.pctLabel }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Row charts ── -->
      <div class="chart-row">
        <!-- Biến động nhân sự -->
        <div class="card card--chart">
          <div class="card__head">
            <div class="card__title-wrap">
              <span class="card__title">Biến động nhân sự</span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
            <div class="head-right">
              <select class="period-sel" v-model="periodBienDong">
                <option>6 tháng gần nhất</option>
                <option>12 tháng gần nhất</option>
              </select>
              <button class="card__btn-icon"><TIcon name="settings" /></button>
            </div>
          </div>
          <div ref="chartBienDong" class="chart-area"></div>
        </div>

        <!-- Cơ cấu theo phòng ban -->
        <div class="card card--chart">
          <div class="card__head">
            <div class="card__title-wrap">
              <span class="card__title">Cơ cấu theo phòng ban</span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
            <div class="head-right">
              <button class="card__btn-icon"><TIcon name="settings" /></button>
            </div>
          </div>
          <div ref="chartPhongBan" class="chart-area"></div>
        </div>
      </div>

      <!-- ── Row tables ── -->
      <div class="table-row-2col">

        <!-- Sinh nhật trong tháng -->
        <div class="card card--table">
          <div class="card__head">
            <div class="card__title-wrap">
              <span class="card__title">Sinh nhật trong tháng <span class="badge-count">{{ sinhNhatList.length }}</span></span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
            <div class="head-right">
              <button class="card__btn-icon"><TIcon name="settings" /></button>
            </div>
          </div>
          <DataTable
            :columns="colsSinhNhat"
            :rows="rowsSinhNhat"
            :hide-blank-rows="false"
          />
        </div>

        <!-- Hợp đồng sắp hết hạn -->
        <div class="card card--table">
          <div class="card__head">
            <div class="card__title-wrap">
              <span class="card__title">Hợp đồng sắp hết hạn <span class="badge-count">{{ hopDongList.length }}</span></span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
            <div class="head-right">
              <button class="card__btn-icon"><TIcon name="settings" /></button>
            </div>
          </div>
          <DataTable
            :columns="colsHopDong"
            :rows="rowsHopDong"
            :hide-blank-rows="false"
          />
        </div>

      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import AppShell    from '../components/AppShell.vue'
import TIcon       from '@mds/components/TIcon.vue'
import DataTable   from '@mds/components/DataTable.vue'

const period = ref('thang')
const periodBienDong = ref('6 tháng gần nhất')
const chartBienDong = ref(null)
const chartPhongBan = ref(null)

const kpiCards = [
  { label: 'Tổng nhân viên',        value: '248', pct: '+3',  pctUp: true,  pctLabel: 'so với tháng trước', icon: 'users',          theme: 'brand'   },
  { label: 'Tuyển mới trong tháng', value: '12',  pct: '+5',  pctUp: true,  pctLabel: 'so với tháng trước', icon: 'user-plus',      theme: 'success' },
  { label: 'Nghỉ việc trong tháng', value: '4',   pct: '-2',  pctUp: false, pctLabel: 'so với tháng trước', icon: 'user-minus',     theme: 'danger'  },
  { label: 'Đề xuất chờ duyệt',     value: '17',  pct: '+6',  pctUp: false, pctLabel: 'so với tháng trước', icon: 'clipboard-list', theme: 'warning' },
]

const sinhNhatList = [
  { id:1, name:'Nguyễn Thị Mai',   dept:'Phòng Kế toán',   birthday:'26/05', initials:'NM', avatarBg:'#eff8ff' },
  { id:2, name:'Trần Văn Hùng',    dept:'Phòng Kỹ thuật',  birthday:'28/05', initials:'TH', avatarBg:'#f0fdf4' },
  { id:3, name:'Lê Thị Hoa',       dept:'Phòng Marketing', birthday:'30/05', initials:'LH', avatarBg:'#fdf4ff' },
  { id:4, name:'Phạm Quốc Bảo',    dept:'Phòng Kinh doanh',birthday:'31/05', initials:'PB', avatarBg:'#fff7ed' },
  { id:5, name:'Hoàng Minh Tuấn',  dept:'Ban Giám đốc',    birthday:'02/06', initials:'HT', avatarBg:'#eff8ff' },
]

const hopDongList = [
  { id:1, name:'Nguyễn Văn An',    loai:'HĐLĐ có thời hạn', date:'30/05/2026', urgent:true,  initials:'NA', avatarBg:'#fef3f2' },
  { id:2, name:'Trần Thị Bình',    loai:'HĐLĐ có thời hạn', date:'15/06/2026', urgent:false, initials:'TB', avatarBg:'#fff7ed' },
  { id:3, name:'Lê Minh Cường',    loai:'Thử việc',         date:'20/06/2026', urgent:false, initials:'LC', avatarBg:'#eff8ff' },
  { id:4, name:'Võ Thị Dung',      loai:'HĐLĐ có thời hạn', date:'25/06/2026', urgent:false, initials:'VD', avatarBg:'#f0fdf4' },
  { id:5, name:'Đinh Quang Đạt',   loai:'Thử việc',         date:'01/07/2026', urgent:false, initials:'ĐĐ', avatarBg:'#fdf4ff' },
]

/* ── DataTable columns & rows — Sinh nhật ── */
const colsSinhNhat = [
  { key: 'name',     label: 'Họ và tên',     type: 'subtext', minWidth: 160 },
  { key: 'dept',     label: 'Phòng ban',      width: 160 },
  { key: 'birthday', label: 'Ngày sinh nhật', width: 110, align: 'right' },
]
const rowsSinhNhat = computed(() =>
  sinhNhatList.map(e => ({
    id:       e.id,
    name:     { text: e.name, subtext: e.dept },  // subtext type: { text, subtext }
    dept:     e.dept,
    birthday: e.birthday,
  }))
)

/* ── DataTable columns & rows — Hợp đồng sắp hết hạn ── */
const colsHopDong = [
  { key: 'name',   label: 'Họ và tên',       type: 'subtext', minWidth: 160 },
  { key: 'loai',   label: 'Loại hợp đồng',   width: 160 },
  { key: 'expiry', label: 'Ngày hết hạn',     type: 'status', width: 130 },
]
const rowsHopDong = computed(() =>
  hopDongList.map(e => ({
    id:     e.id,
    name:   { text: e.name, subtext: '' },
    loai:   e.loai,
    expiry: { label: e.date, color: e.urgent ? 'danger' : 'warning' }, // status type: { label, color }
  }))
)

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const FONT = 'InterVariable, "Inter var", sans-serif'

onMounted(() => {
  // Chart 1: Biến động nhân sự (Line)
  const c1 = echarts.init(chartBienDong.value)
  c1.setOption({ textStyle: { fontFamily: FONT, fontSize: 11 } })   // font Inter — phải set trước setOption chính
  c1.setOption({
    grid: { top: 16, right: 16, bottom: 40, left: 48 },
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { fontFamily: FONT, fontSize: 12, color: cssVar('--text-secondary') },
    },
    xAxis: {
      type: 'category',
      data: ['Th.12', 'Th.01', 'Th.02', 'Th.03', 'Th.04', 'Th.05'],
      axisLine: { lineStyle: { color: cssVar('--stroke-neutral-light') } },
      axisTick: { show: false },
      axisLabel: { fontFamily: FONT, color: cssVar('--text-hint'), fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: cssVar('--stroke-neutral-light'), type: 'dashed' } },
      axisLabel: { fontFamily: FONT, color: cssVar('--text-hint'), fontSize: 11 },
      axisLine: { show: false }, axisTick: { show: false },
    },
    series: [
      {
        name: 'Tuyển mới', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: [8, 10, 7, 14, 9, 12],
        lineStyle: { color: cssVar('--chart-c2') },
        itemStyle: { color: cssVar('--chart-c2'), borderColor: '#fff', borderWidth: 2 },
      },
      {
        name: 'Nghỉ việc', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
        data: [5, 3, 6, 2, 7, 4],
        lineStyle: { color: cssVar('--chart-c4') },
        itemStyle: { color: cssVar('--chart-c4'), borderColor: '#fff', borderWidth: 2 },
      },
    ],
  })

  // Chart 2: Cơ cấu theo phòng ban (Horizontal Bar)
  const c2 = echarts.init(chartPhongBan.value)
  c2.setOption({ textStyle: { fontFamily: FONT, fontSize: 11 } })   // font Inter — phải set trước setOption chính
  c2.setOption({
    grid: { top: 8, right: 48, bottom: 8, left: 130, containLabel: false },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: cssVar('--stroke-neutral-light'), type: 'dashed' } },
      axisLabel: { fontFamily: FONT, color: cssVar('--text-hint'), fontSize: 11 },
      axisLine: { show: false }, axisTick: { show: false },
    },
    yAxis: {
      type: 'category',
      data: ['Ban GĐ', 'Hành chính', 'Kế toán', 'IT', 'Kinh doanh', 'Marketing', 'Kỹ thuật'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontFamily: FONT, color: cssVar('--text-primary'), fontSize: 11 },
    },
    series: [{
      type: 'bar',
      barWidth: '40%',   // 40% của category slot → gap 60%, thoáng hơn giữa các thanh
      data: [5, 12, 18, 31, 45, 22, 34],
      itemStyle: {
        color: cssVar('--chart-c1'),
        borderRadius: [0, 4, 4, 0],   // horizontal bar: bo 4px góc phải (đỉnh thanh)
      },
      label: {
        show: true, position: 'right',
        fontFamily: FONT, fontSize: 11, color: cssVar('--text-secondary'),
      },
    }],
  })

  const onResize = () => { c1.resize(); c2.resize() }
  window.addEventListener('resize', onResize)
})
</script>

<style scoped>
.tq-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--card-col-gap);
  padding: var(--card-col-gap);
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

/* ── Page Header ── */
.page-header {
  display: flex; align-items: center; justify-content: space-between;
  height: var(--layout-page-header-h);
  padding: 0 var(--card-col-gap);
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
.page-header__left { display: flex; align-items: center; gap: 8px; }
.page-header__right { display: flex; align-items: center; gap: 8px; }

/* ── KPI row (Chart Stat Card — Figma 6828:52005) ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--card-col-gap);
}

/* KPI card = Chart Stat Card: vertical layout, padding 20px, gap 8px */
.kpi-card {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Shared card header (dùng cho kpi-card, card--chart, card--table) ── */
/* title-wrap: title text + reload icon inline */
.card__title-wrap {
  display: flex; align-items: center; gap: 8px;
  flex: 1; min-width: 0;
}
/* card__head--kpi: không có padding-top vì kpi-card tự padding */
.card__head--kpi {
  padding: 0;
}
/* Card icon button: ẩn mặc định, hiện khi hover card */
.card__btn-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border: none; background: transparent;
  border-radius: 6px; cursor: pointer; color: var(--text-secondary);
  flex-shrink: 0; padding: 0;
  opacity: 0; transition: opacity 0.15s, background 0.1s;
}
.kpi-card:hover .card__btn-icon,
.card:hover .card__btn-icon { opacity: 1; }
.card__btn-icon:hover { background: var(--bg-neutral-hover); }
.card__btn-icon .ti { font-size: 16px; }

/* Icon badge: nền nhạt, icon stroke màu đậm cùng tone */
.kpi-icon-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
}
.kpi-icon-badge .ti { font-size: 22px; stroke-width: 1.5; }

.kpi-icon-badge--brand   { background: var(--bg-brand-light);   color: var(--text-brand);   }
.kpi-icon-badge--success { background: var(--bg-success-light); color: var(--text-success); }
.kpi-icon-badge--danger  { background: var(--bg-danger-light);  color: var(--text-danger);  }
.kpi-icon-badge--warning { background: var(--bg-warning-light); color: var(--text-warning); }

/* KPI card title: Heading 6 — 16px/semibold */
.kpi-card__title {
  font-size: 16px; font-weight: var(--fw-semibold);
  color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  flex: 1; min-width: 0;
}

/* Stat area: value (24px/bold) + trend badge */
.kpi-card__stat {
  display: flex; flex-direction: column; gap: 4px;
}
.kpi-card__value {
  font-size: 24px; font-weight: 700;
  color: var(--text-primary); line-height: 28px;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}

/* Trend badge: icon (20px) + pct (13px/600) + label (13px/400/secondary) */
.kpi-card__trend {
  display: flex; align-items: center; gap: 4px;
  font-size: 13px; line-height: 20px;
}
.kpi-card__trend .ti { font-size: 20px; flex-shrink: 0; }
.trend--up   .ti, .trend--up   .trend-pct { color: var(--text-success); }
.trend--down .ti, .trend--down .trend-pct { color: var(--text-danger); }
.trend-pct   { font-weight: var(--fw-semibold); }
.trend-label { color: var(--text-secondary); font-weight: var(--fw-regular); }

/* ── Charts row ── */
.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--card-col-gap);
}

.card {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 20px;
}
.card__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0; gap: 8px;
}
.card__title {
  font-size: 16px; font-weight: var(--fw-semibold);
  color: var(--text-primary); line-height: 24px;
  display: flex; align-items: center; gap: 8px;
  white-space: nowrap;
}
.head-right {
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
}

.period-sel {
  height: 28px; padding: 0 8px;
  border: 1px solid var(--stroke-neutral-light);
  border-radius: var(--radius-default);
  font-size: var(--text-sm); color: var(--text-secondary);
  background: var(--bg-white); cursor: pointer; outline: none;
}
.period-sel:focus { border-color: var(--stroke-brand); }

.chart-area {
  height: 200px;
  margin-top: 12px;
}

/* ── Table row 2 col ── */
.table-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--card-col-gap);
}

/* table card: header có 20px padding (từ .card), DataTable đi sát cạnh dưới */
.card--table { padding-bottom: 0; }
.card--table .card__head { margin-bottom: 8px; }

.badge-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 20px; height: 20px; padding: 0 6px;
  background: var(--bg-brand-light); color: var(--text-brand);
  border-radius: var(--radius-pill);
  font-size: 11px; font-weight: var(--fw-semibold);
}
</style>
