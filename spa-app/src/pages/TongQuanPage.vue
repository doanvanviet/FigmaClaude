<template>
  <AppShell>
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title h2">Tổng quan</h1>
        <span class="page-header__sub text-secondary">{{ todayLabel }}</span>
      </div>
      <div class="page-header__right">
        <select class="input input--select" style="width:140px" v-model="period">
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="quarter">Quý này</option>
        </select>
      </div>
    </div>

    <div class="content-wrapper">

      <!-- ── KPI Row ── -->
      <div class="kpi-row">
        <div class="kpi-card" v-for="k in kpiCards" :key="k.label">
          <div class="card__head card__head--kpi">
            <div class="card__title-wrap">
              <span class="kpi-card__title">{{ k.label }}</span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
            <div class="kpi-icon-badge" :class="`kpi-icon-badge--${k.theme}`">
              <TIcon :name="k.icon" />
            </div>
          </div>
          <div class="kpi-card__stat">
            <div class="kpi-card__value">{{ k.value }}</div>
            <div class="kpi-card__trend" :class="k.up ? 'trend--up' : 'trend--down'">
              <TIcon :name="k.up ? 'trending-up' : 'trending-down'" />
              <span class="trend-pct">{{ k.pct }}</span>
              <span class="trend-label">so với tuần trước</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Chart Row ── -->
      <div class="chart-row">
        <div class="card card--chart">
          <div class="card__head">
            <div class="card__title-wrap">
              <span class="card__title">Doanh thu 7 ngày gần nhất</span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
            <div class="head-right">
              <button class="card__btn-icon"><TIcon name="settings" /></button>
            </div>
          </div>
          <div ref="chartRevenue" class="chart-area"></div>
        </div>

        <div class="card card--chart card--chart-sm">
          <div class="card__head">
            <div class="card__title-wrap">
              <span class="card__title">Doanh thu theo danh mục</span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
          </div>
          <div ref="chartCategory" class="chart-area"></div>
        </div>
      </div>

      <!-- ── Bottom Row ── -->
      <div class="table-row-2col">

        <!-- Lịch hẹn hôm nay -->
        <div class="card card--table">
          <div class="card__head">
            <div class="card__title-wrap">
              <span class="card__title">Lịch hẹn hôm nay</span>
              <span class="badge-count">{{ todayAppointments.length }}</span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
            <router-link to="/lich-hen" class="card__link">Xem tất cả →</router-link>
          </div>
          <DataTable
            :columns="colsLichHen"
            :rows="todayAppointments"
            :hide-blank-rows="false"
          />
        </div>

        <!-- Dịch vụ nổi bật -->
        <div class="card card--table">
          <div class="card__head">
            <div class="card__title-wrap">
              <span class="card__title">Dịch vụ được đặt nhiều nhất</span>
              <button class="card__btn-icon"><TIcon name="refresh" /></button>
            </div>
            <router-link to="/dich-vu" class="card__link">Xem tất cả →</router-link>
          </div>
          <DataTable
            :columns="colsDichVu"
            :rows="topServices"
            :hide-blank-rows="false"
          />
        </div>

      </div>
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import AppShell  from '../components/AppShell.vue'
import DataTable from '@mds/components/DataTable.vue'
import TIcon     from '@mds/components/TIcon.vue'
import { appointments, services, formatCurrency, getStatusInfo } from '../data/mockData.js'

const period = ref('week')

// Today label
const todayLabel = computed(() => {
  const d = new Date(2026, 4, 27) // 27/05/2026
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
})

// ── KPI Cards ──────────────────────────────────────────────────────────────
const kpiCards = computed(() => [
  { label: 'Lịch hẹn hôm nay',    icon: 'calendar',        theme: 'brand',   value: '7',           pct: '+2',    up: true  },
  { label: 'Doanh thu tuần',       icon: 'coin',            theme: 'success', value: '18.350.000 ₫', pct: '+12%',  up: true  },
  { label: 'Khách mới tuần',       icon: 'users',           theme: 'info',    value: '5',           pct: '+1',    up: true  },
  { label: 'Dịch vụ nổi bật',     icon: 'sparkles',        theme: 'warning', value: 'Massage TS',  pct: '8 đơn', up: true  },
])

// ── Today appointments ─────────────────────────────────────────────────────
const todayAppointments = computed(() =>
  appointments
    .filter(a => a.date === '2026-05-27')
    .slice(0, 5)
    .map(a => {
      const st = getStatusInfo(a.status)
      return {
        ...a,
        customerAvatar: { text: a.customerName },
        timeDisplay: a.time,
        statusBadge: { label: st.label, color: st.color },
      }
    })
)

const colsLichHen = [
  { key: 'customerAvatar', label: 'Khách hàng',  type: 'avatar-text', fill: true },
  { key: 'timeDisplay',    label: 'Giờ',          width: 60 },
  { key: 'serviceName',    label: 'Dịch vụ',      width: 160 },
  { key: 'statusBadge',    label: 'Trạng thái',   type: 'status', width: 130 },
]

// ── Top services ───────────────────────────────────────────────────────────
const topServices = computed(() => {
  const countMap = {}
  appointments.forEach(a => {
    countMap[a.serviceName] = (countMap[a.serviceName] || 0) + 1
  })
  return Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], i) => ({
      rank: i + 1,
      name,
      count,
      revenue: formatCurrency(count * (services.find(s => s.name === name)?.price || 0)),
    }))
})

const colsDichVu = [
  { key: 'rank',    label: '#',          width: 40,  noFilter: true },
  { key: 'name',    label: 'Dịch vụ',   fill: true },
  { key: 'count',   label: 'Số đặt',    width: 70,  noFilter: true },
  { key: 'revenue', label: 'Doanh thu', width: 120, noFilter: true },
]

// ── Charts ─────────────────────────────────────────────────────────────────
const chartRevenue  = ref(null)
const chartCategory = ref(null)
let ecRevenue, ecCategory

const revenueData = {
  days:   ['21/05', '22/05', '23/05', '24/05', '25/05', '26/05', '27/05'],
  values: [2400000, 3100000, 2750000, 3600000, 2900000, 3500000, 4200000],
}

const categoryData = [
  { value: 38, name: 'Massage' },
  { value: 26, name: 'Chăm sóc da' },
  { value: 18, name: 'Nail' },
  { value: 10, name: 'Tóc' },
  { value: 8,  name: 'Cơ thể' },
]

function initCharts() {
  if (chartRevenue.value) {
    ecRevenue = echarts.init(chartRevenue.value)
    ecRevenue.setOption({
      tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name}<br/>${new Intl.NumberFormat('vi-VN').format(p[0].value)} ₫` },
      grid:    { top: 16, right: 16, bottom: 24, left: 64 },
      xAxis:   { type: 'category', data: revenueData.days, axisLine: { lineStyle: { color: '#e9eaeb' } }, axisLabel: { color: '#717680', fontSize: 12 } },
      yAxis:   { type: 'value', axisLabel: { color: '#717680', fontSize: 11, formatter: v => (v/1000000).toFixed(1) + 'tr' }, splitLine: { lineStyle: { color: '#f0f2f4' } } },
      series: [{
        type: 'bar', data: revenueData.values, barWidth: '60%',
        itemStyle: { color: '#c64691', borderRadius: [4, 4, 0, 0] },
      }],
    })
  }

  if (chartCategory.value) {
    ecCategory = echarts.init(chartCategory.value)
    ecCategory.setOption({
      tooltip:  { trigger: 'item', formatter: '{b}: {c}%' },
      legend:   { orient: 'vertical', left: 'right', top: 'middle', textStyle: { fontSize: 12, color: '#717680' } },
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['35%', '50%'],
        label: { show: false },
        data: categoryData,
        itemStyle: { borderRadius: 4 },
        color: ['#c64691', '#f9a8d4', '#0e9a62', '#f79009', '#7a5af8'],
      }],
    })
  }
}

const resizeHandler = () => { ecRevenue?.resize(); ecCategory?.resize() }

onMounted(() => { initCharts(); window.addEventListener('resize', resizeHandler) })
onUnmounted(() => { window.removeEventListener('resize', resizeHandler); ecRevenue?.dispose(); ecCategory?.dispose() })
</script>

<style scoped>
/* ── Page Header ── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--layout-page-header-h);
  padding: 0 16px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--stroke-divider);
  flex-shrink: 0;
}
.page-header__left  { display: flex; align-items: baseline; gap: 10px; }
.page-header__title { margin: 0; }
.page-header__sub   { font-size: 12px; }
.page-header__right { display: flex; gap: 8px; }

/* ── Content ── */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── KPI Row ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.kpi-card {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card__head { display: flex; align-items: flex-start; justify-content: space-between; }
.card__head--kpi { }
.card__title-wrap { display: flex; align-items: center; gap: 4px; }
.kpi-card__title { font-size: 13px; color: var(--text-secondary); font-weight: var(--fw-medium); }
.card__btn-icon {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
  border: none; background: transparent;
  color: var(--text-hint); cursor: pointer;
  border-radius: var(--radius-sm);
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.15s;
}
.kpi-card:hover .card__btn-icon,
.card:hover .card__btn-icon { opacity: 1; }
.card__btn-icon:hover { background: var(--bg-neutral-light); color: var(--text-primary); }

.kpi-icon-badge {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border-radius: var(--radius-default);
  font-size: 20px;
  flex-shrink: 0;
}
.kpi-icon-badge--brand   { background: var(--bg-brand-light);   color: var(--bg-brand); }
.kpi-icon-badge--success { background: var(--bg-success-light); color: var(--bg-success); }
.kpi-icon-badge--info    { background: var(--bg-info-light);    color: var(--text-info); }
.kpi-icon-badge--warning { background: var(--bg-warning-light); color: var(--bg-warning); }

.kpi-card__stat  { display: flex; flex-direction: column; gap: 6px; }
.kpi-card__value { font-size: 22px; font-weight: var(--fw-semibold); color: var(--text-primary); line-height: 1.2; }
.kpi-card__trend { display: flex; align-items: center; gap: 4px; font-size: 12px; }
.trend--up   { color: var(--text-success); }
.trend--down { color: var(--text-danger); }
.trend-pct   { font-weight: var(--fw-semibold); }
.trend-label { color: var(--text-hint); }

/* ── Chart Row ── */
.chart-row {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
}
.card {
  background: var(--bg-white);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-card);
}
.card--chart { padding: 16px; }
.card--chart-sm { padding: 16px; }
.card__head {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;
}
.card__title { font-size: 13px; font-weight: var(--fw-semibold); color: var(--text-primary); }
.badge-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: var(--bg-brand-light); color: var(--bg-brand);
  border-radius: 9999px; font-size: 11px; font-weight: var(--fw-semibold);
}
.head-right { display: flex; align-items: center; gap: 4px; }
.chart-area { height: 200px; }

/* ── Bottom tables row ── */
.table-row-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.card--table { overflow: hidden; }
.card--table .card__head { padding: 12px 16px; margin-bottom: 0; border-bottom: 1px solid var(--stroke-divider); }
.card__link { font-size: 12px; color: var(--text-brand); text-decoration: none; }
.card__link:hover { text-decoration: underline; }

/* ── Input select ── */
.input--select {
  height: var(--input-height);
  padding: 0 8px;
  border: 1px solid var(--stroke-neutral);
  border-radius: var(--radius-default);
  font-size: 13px;
  color: var(--text-primary);
  background: var(--bg-white);
  cursor: pointer;
}
</style>
