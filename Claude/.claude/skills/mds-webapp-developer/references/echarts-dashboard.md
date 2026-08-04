# ECharts Dashboard — Patterns & Config Reference

> Dùng lại các pattern ECharts đã chuẩn hóa từ dự án `ketoan-dashboard`.  
> CHỈ dùng **Apache ECharts** — NGHIÊM CẤM Chart.js, D3, Recharts, hay thư viện khác.  
> Font bắt buộc: `InterVariable, "Inter var", sans-serif` — không hardcode font khác.

---

## 1. Setup

### CDN (thêm vào `index.html`)
```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
```

### Container HTML
```html
<!-- width/height tường minh là bắt buộc — không dùng <canvas> -->
<div class="chart-wrap" :ref="el => setChartEl(el, w.id)"></div>
```
```css
.chart-wrap { flex: 1; width: 100%; min-height: 0; }
```

---

## 2. State & Helpers (trong `<script setup>`)

```js
/* ── ECharts state ── */
const chartEls       = {}   // DOM refs
const chartInstances = {}   // chart instances

function setChartEl(el, id) { if (el) chartEls[id] = el }
```

### Dark mode + font constants
```js
function getChartOpt(w) {
  const dark = isDark.value   // boolean — ref từ theme system
  const tc   = dark ? 'rgba(255,255,255,0.55)' : '#6b707a'   // text color axes/labels
  const gc   = dark ? 'rgba(255,255,255,0.08)' : '#e9eaeb'   // grid line color
  const lc   = dark ? '#ffffff'                : '#383c40'   // data label color
  const font = 'InterVariable, "Inter var", sans-serif'
  // ...
}
```

---

## 3. Gradient Helper

```js
const LG = (x1, y1, x2, y2, ...stops) =>
  new echarts.graphic.LinearGradient(x1, y1, x2, y2,
    stops.map(([o, c]) => ({ offset: o, color: c }))
  )

// Palette chuẩn — dùng nhất quán trong 1 dashboard
const G_MINT  = LG(0,0,0,1, [0,'#34d399'], [1,'#06b6d4'])   // teal → cyan
const G_ROSE  = LG(0,0,0,1, [0,'#fb7185'], [1,'#f97316'])   // rose → orange
const G_SKY   = LG(0,0,0,1, [0,'#60a5fa'], [1,'#818cf8'])   // blue → violet
const G_LAVEN = LG(0,0,0,1, [0,'#c084fc'], [1,'#a78bfa'])   // purple → violet
const G_AMBER = LG(0,0,0,1, [0,'#fbbf24'], [1,'#f97316'])   // amber → orange

// Màu điểm tương ứng (cho dots, legend)
const C_MINT  = '#2dd4bf'
const C_ROSE  = '#f87171'
const C_SKY   = '#60a5fa'
const C_LAVEN = '#a78bfa'
const C_AMBER = '#fbbf24'
```

---

## 4. Tooltip Preset

```js
const tooltip = {
  backgroundColor: dark ? 'rgba(20,16,32,0.92)' : '#fff',
  borderColor:     dark ? 'rgba(255,255,255,0.15)' : '#e9eaeb',
  textStyle: { color: dark ? '#ffffff' : '#10141b', fontFamily: font, fontSize: 12 },
}
// Dùng: tooltip: { ...tooltip, trigger:'axis', formatter: ... }
```

---

## 5. Axis Presets

```js
// X-axis category (dùng cho line, bar, cashflow)
const xAxisCategory = (data) => ({
  type: 'category', data,
  axisLine:  { show: false },
  axisTick:  { show: false },
  axisLabel: { color: tc, fontFamily: font, fontSize: 12 },
  splitLine: { show: false },
})

// Y-axis value
const yAxisValue = (formatter) => ({
  type: 'value',
  axisLabel: { color: tc, fontFamily: font, fontSize: 12, formatter },
  splitLine: { lineStyle: { color: gc } },
  axisLine:  { show: false },
  axisTick:  { show: false },
})

// Formatter tiền VND tỷ đồng
const fmtBillion = v => (v / 1e9).toFixed(1) + 'T'
```

---

## 6. Chart Configs

### 6.1 Line Chart — xu hướng đơn
```js
// type: 'chart-line'
{
  backgroundColor: 'transparent',
  grid: { top: 36, right: 16, bottom: 36, left: 64 },
  xAxis: xAxisCategory(['T1','T2','T3','T4','T5','T6']),
  yAxis: yAxisValue(fmtBillion),
  series: [{
    type: 'line',
    data: [3200000000, 3800000000, 4100000000, 3900000000, 4400000000, 4850000000],
    smooth: 0.4,
    lineStyle: { width: 2.5, color: LG(0,0,1,0, [0,'#60a5fa'], [1,'#2dd4bf']) },
    itemStyle: { color: C_MINT },
    symbol: 'circle', symbolSize: 7,
    emphasis: { focus: 'series' },
    label: {
      show: true, position: 'top',
      fontFamily: font, fontSize: 11, fontWeight: 700, color: lc,
      formatter: p => (p.value / 1e9).toFixed(2) + 'T',
    },
    areaStyle: { color: LG(0,0,0,1, [0,'rgba(96,165,250,0.28)'], [1,'rgba(45,212,191,0)']) },
  }],
  tooltip: { ...tooltip, trigger: 'axis',
    formatter: p => `${p[0].name}<br/><b>${(p[0].value/1e9).toFixed(2)} tỷ</b>`,
  },
}
```

### 6.2 Bar Chart — so sánh 2 series
```js
// type: 'chart-bar'
{
  backgroundColor: 'transparent',
  grid: { top: 40, right: 16, bottom: 36, left: 64 },
  legend: { top: 8, right: 16, textStyle: { color: tc, fontFamily: font, fontSize: 12 }, itemWidth: 10, itemHeight: 10, itemGap: 14 },
  xAxis: xAxisCategory(['T1','T2','T3','T4','T5','T6']),
  yAxis: yAxisValue(fmtBillion),
  series: [
    {
      name: 'Doanh thu', type: 'bar', barWidth: '28%',
      data: [3200000000, 3800000000, 4100000000, 3900000000, 4400000000, 4850000000],
      itemStyle: { color: G_MINT, borderRadius: [4,4,0,0] },
      label: { show: true, position: 'top', fontFamily: font, fontSize: 10, fontWeight: 700, color: lc, formatter: p => (p.value/1e9).toFixed(1)+'T' },
    },
    {
      name: 'Chi phí', type: 'bar', barWidth: '28%',
      data: [2100000000, 2300000000, 2600000000, 2400000000, 2700000000, 2950000000],
      itemStyle: { color: G_ROSE, borderRadius: [4,4,0,0] },
      label: { show: true, position: 'top', fontFamily: font, fontSize: 10, fontWeight: 700, color: lc, formatter: p => (p.value/1e9).toFixed(1)+'T' },
    },
  ],
  tooltip: { ...tooltip, trigger: 'axis',
    formatter: p => `${p[0].axisValue}<br/>` + p.map(s => `${s.seriesName}: <b>${(s.value/1e9).toFixed(2)} tỷ</b>`).join('<br/>'),
  },
}
```

### 6.3 Cashflow Chart — 2 lines + area fill
```js
// type: 'chart-cashflow'
{
  backgroundColor: 'transparent',
  grid: { top: 40, right: 16, bottom: 36, left: 64 },
  legend: { top: 8, right: 16, textStyle: { color: tc, fontFamily: font, fontSize: 12 }, itemWidth: 10, itemHeight: 10, itemGap: 14 },
  xAxis: xAxisCategory(['T1','T2','T3','T4','T5','T6']),
  yAxis: yAxisValue(fmtBillion),
  series: [
    {
      name: 'Thu', type: 'line', smooth: 0.4,
      data: [3200000000, 3800000000, 4100000000, 3900000000, 4400000000, 4850000000],
      lineStyle: { width: 2.5, color: LG(0,0,1,0, [0,'#34d399'], [1,'#06b6d4']) },
      itemStyle: { color: C_MINT },
      symbol: 'circle', symbolSize: 6,
      label: { show: true, position: 'top', fontFamily: font, fontSize: 10, fontWeight: 700, color: lc, formatter: p => (p.value/1e9).toFixed(1)+'T' },
      areaStyle: { color: LG(0,0,0,1, [0,'rgba(52,211,153,0.28)'], [1,'rgba(6,182,212,0)']) },
    },
    {
      name: 'Chi', type: 'line', smooth: 0.4,
      data: [2100000000, 2300000000, 2600000000, 2400000000, 2700000000, 2950000000],
      lineStyle: { width: 2.5, color: LG(0,0,1,0, [0,'#fb7185'], [1,'#f97316']) },
      itemStyle: { color: C_ROSE },
      symbol: 'circle', symbolSize: 6,
      label: { show: true, position: 'top', fontFamily: font, fontSize: 10, fontWeight: 700, color: lc, formatter: p => (p.value/1e9).toFixed(1)+'T' },
      areaStyle: { color: LG(0,0,0,1, [0,'rgba(251,113,133,0.24)'], [1,'rgba(249,115,22,0)']) },
    },
  ],
  tooltip: { ...tooltip, trigger: 'axis',
    formatter: p => `${p[0].axisValue}<br/>` + p.map(s => `${s.seriesName}: <b>${(s.value/1e9).toFixed(2)} tỷ</b>`).join('<br/>'),
  },
}
```

### 6.4 Donut Chart — phân bổ cơ cấu
```js
// type: 'chart-donut'
{
  backgroundColor: 'transparent',
  legend: {
    orient: 'vertical', right: 8, top: 'middle',
    textStyle: { color: tc, fontFamily: font, fontSize: 12 },
    icon: 'circle', itemWidth: 8, itemHeight: 8, itemGap: 10,
  },
  series: [{
    type: 'pie', radius: ['48%','72%'], center: ['38%','50%'],
    avoidLabelOverlap: true,
    label: { show: true, fontFamily: font, fontSize: 11, fontWeight: 700, color: lc, formatter: p => p.percent.toFixed(0)+'%' },
    labelLine: { show: true, length: 8, length2: 6, lineStyle: { color: dark ? 'rgba(255,255,255,0.35)' : '#ced1d6', width: 1 } },
    emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold', fontFamily: font } },
    itemStyle: { borderRadius: 4, borderWidth: 0 },
    data: [
      { value: 2350000000, name: 'Bán hàng',  itemStyle: { color: G_MINT  } },
      { value: 1200000000, name: 'Dịch vụ',   itemStyle: { color: G_SKY   } },
      { value: 850000000,  name: 'Xuất khẩu', itemStyle: { color: G_LAVEN } },
      { value: 450000000,  name: 'Khác',       itemStyle: { color: G_AMBER } },
    ],
  }],
  tooltip: { ...tooltip, trigger: 'item',
    formatter: p => `${p.name}<br/><b>${(p.value/1e9).toFixed(2)} tỷ</b> (${p.percent.toFixed(1)}%)`,
  },
}
```

---

## 7. Lifecycle Management

```js
function initCharts() {
  const CHART_TYPES = ['chart-line', 'chart-donut', 'chart-bar', 'chart-cashflow']
  nextTick(() => {
    widgets.value.filter(w => CHART_TYPES.includes(w.type)).forEach(w => {
      const el = chartEls[w.id]
      if (!el) return
      if (chartInstances[w.id]) chartInstances[w.id].dispose()
      const chart = echarts.init(el, null, { renderer: 'canvas' })
      chartInstances[w.id] = chart
      chart.setOption(getChartOpt(w))
    })
  })
}

function resizeCharts() {
  Object.values(chartInstances).forEach(c => c?.resize())
}

// Re-init khi đổi dark/light theme
watch(isDark, () => initCharts())

// ResizeObserver để chart resize theo container
const ro = new ResizeObserver(resizeCharts)

onMounted(async () => {
  await nextTick()
  initCharts()
  if (mainEl.value) ro.observe(mainEl.value)
})

onUnmounted(() => {
  ro.disconnect()
  Object.values(chartInstances).forEach(c => c?.dispose())
})
```

---

## 8. Checklist trước khi dùng

- [ ] `echarts` CDN đã có trong `index.html`
- [ ] Container chart là `<div>` có `width/height` tường minh (flex:1 + min-height:0)
- [ ] `font` constant dùng `InterVariable, "Inter var", sans-serif` — không font khác
- [ ] Tất cả màu lấy từ palette `G_*` / `C_*` — không hardcode hex tự sinh
- [ ] Gọi `resizeCharts()` sau mọi thao tác thay đổi kích thước layout
- [ ] `dispose()` tất cả instances trong `onUnmounted`
- [ ] `watch(isDark, () => initCharts())` để chart tự cập nhật khi đổi theme
