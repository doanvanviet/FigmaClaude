<template>
  <AppShell>
    <div class="tq">

      <!-- Toolbar -->
      <div class="tq-bar">
        <h2 class="tq-bar__title">Tổng quan</h2>
        <div class="tq-bar__btns">
          <template v-if="isEditing">
            <button class="tq-bar__btn tq-bar__btn--cancel" @click="cancelEdit">
              <TIcon name="x" /><span>Hủy</span>
            </button>
            <button class="tq-bar__btn tq-bar__btn--done" @click="saveEdit">
              <TIcon name="check" /><span>Xong</span>
            </button>
          </template>
          <button v-else class="tq-bar__btn" @click="startEdit">
            <TIcon name="settings" /><span>Tuỳ chỉnh</span>
          </button>
        </div>
      </div>

      <!-- Customize panel -->
      <transition name="slide-panel">
        <div v-if="isEditing" class="cp glass">
          <div class="cp__left">
            <span class="cp__lbl">Hiển thị / ẩn widget</span>
            <div class="cp__chips">
              <button
                v-for="w in widgets" :key="w.id"
                class="cp__chip"
                :class="{ 'cp__chip--on': w.visible }"
                @click="toggleWidgetVisible(w)"
              >
                <TIcon :name="w.visible ? 'eye' : 'eye-off'" class="cp__chip-ico" />
                {{ w.label }}
              </button>
            </div>
          </div>
          <div class="cp__hint">
            <TIcon name="info-circle" class="cp__hint-ico" />
            Kéo card để di chuyển · Kéo góc dưới-phải để đổi kích thước
          </div>
        </div>
      </transition>

      <!-- Widget grid -->
      <div ref="wgridEl" class="wgrid"
        :class="{ 'wgrid--editing': isEditing, 'wgrid--dragging': !!dragging }"
        @dragover="onWgridDragOver"
        @drop="onWgridDrop"
      >
        <!-- Grid cell background (edit mode only) -->
        <div
          v-for="cell in editGridCells" :key="`gc-${cell.col}-${cell.row}`"
          class="wgrid__cell"
          :style="{ gridColumn: cell.col, gridRow: cell.row }"
        ></div>

        <!-- Drop ghost / snap preview -->
        <div v-if="isEditing && dropPreview" class="wgrid__drop-ghost"
          :style="{
            gridColumn: `${dropPreview.colStart} / span ${dropPreview.colSpan}`,
            gridRow:    `${dropPreview.rowStart} / span ${dropPreview.rowSpan}`,
          }"
        ></div>

        <!-- Widgets -->
        <div
          v-for="(w, idx) in visibleWidgets" :key="w.id"
          class="wcard"
          :class="{
            'wcard--transparent': w.id === 'welcome',
            'wcard--dragging': dragging === w.id,
            'wcard--over':     dragOver === w.id,
            'wcard--resizing': resizing === w.id,
          }"
          :style="{
            gridColumn: w.colStart ? `${w.colStart} / span ${w.colSpan}` : `span ${w.colSpan}`,
            gridRow:    w.rowStart ? `${w.rowStart} / span ${w.rowSpan}` : `span ${w.rowSpan}`,
            '--delay':  `${idx * 0.055}s`,
          }"
          :draggable="isEditing"
          @dragstart="onDragStart($event, w.id)"
          @dragover.prevent="dragOver = w.id"
          @dragleave="dragOver = null"
          @dragend="onDragEnd"
        >
          <!-- Header -->
          <div class="wcard__hd">
            <div class="wcard__hd-l">
              <span class="wcard__title">
                {{ w.label }}
                <span v-if="w.id === 'tasklist'" class="badge-n">{{ taskList.length }}</span>
              </span>
            </div>
            <div class="wcard__hd-r">
              <select v-if="w.period !== undefined && !isEditing" class="period-sel" v-model="w.period">
                <option v-for="p in getPeriods(w.id)" :key="p">{{ p }}</option>
              </select>
              <button v-if="!isEditing" class="wc-btn" title="Làm mới"><TIcon name="refresh" /></button>
              <button v-if="isEditing" class="wc-btn wc-btn--del" @click.stop="removeWidget(w.id)"><TIcon name="x" /></button>
              <span v-if="isEditing" class="drag-handle"><TIcon name="dots-vertical" /></span>
            </div>
          </div>

          <!-- Body -->
          <div class="wcard__bd">

            <template v-if="w.id === 'welcome'">
              <div class="hero">
                <div class="hero__greet">Xin chào, <strong>Đoàn Văn Việt</strong></div>
                <div class="hero__sub">Chúc bạn một ngày làm việc hiệu quả!</div>
                <div class="hero__time">{{ currentTime }}</div>
                <div class="hero__date">{{ currentDate }}</div>
                <div class="hero__weather">
                  <div class="hero__w-main">
                    <div class="hero__w-temp">{{ weather.temp }}°</div>
                    <div class="hero__w-info">
                      <div class="hero__w-cond">{{ weather.condition }}</div>
                      <div class="hero__w-loc"><TIcon name="map-pin" />{{ weather.location }}</div>
                    </div>
                  </div>
                  <div class="hero__w-details">
                    <div class="hero__w-row"><TIcon name="droplets" /><span>Độ ẩm {{ weather.humidity }}%</span></div>
                    <div class="hero__w-row"><TIcon name="wind" /><span>Gió {{ weather.wind }} km/h</span></div>
                    <div class="hero__w-row"><TIcon name="thermometer" /><span>{{ weather.low }}° / {{ weather.high }}°</span></div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="w.id === 'remind'">
              <div class="scroll-body">
                <div class="remind-row" v-for="item in remindItems" :key="item.title">
                  <div class="remind-row__hd">
                    <TIcon :name="item.icon" class="remind-ico" />
                    <strong>{{ item.num }}. {{ item.title }}</strong>
                  </div>
                  <p class="remind-row__desc" v-html="item.desc"></p>
                </div>
                <div class="suggest-box">
                  <div class="suggest-box__hd"><span class="dot-warn"></span>Gợi ý:</div>
                  <ul><li v-for="s in suggests" :key="s">{{ s }}</li></ul>
                </div>
              </div>
            </template>

            <template v-else-if="w.id === 'caNhan'">
              <div class="donut-wrap">
                <div :ref="el => setChartEl(el, w.id)" class="chart-wrap donut-el"></div>
                <div class="donut-leg">
                  <div class="dleg dleg--danger"><span class="dleg__dot"></span><b>4</b><span>Quá hạn</span></div>
                  <div class="dleg dleg--warn">  <span class="dleg__dot"></span><b>2</b><span>Đến hạn</span></div>
                  <div class="dleg dleg--info">  <span class="dleg__dot"></span><b>3</b><span>Sắp đến hạn</span></div>
                </div>
              </div>
            </template>

            <template v-else-if="w.id === 'toigiao' || w.id === 'cuatoi' || w.id === 'lienquan'">
              <div class="scroll-body">
                <div class="wtask-row"
                  v-for="t in (w.id === 'toigiao' ? tasksToigiao : w.id === 'cuatoi' ? tasksCuatoi : tasksLienquan)"
                  :key="t.id"
                  :class="{ 'wtask-row--done': t.done }">
                  <div class="wtask-sico" :style="{ '--sc': t.status.color }">
                    <div class="wtask-sico__dot"></div>
                  </div>
                  <div class="wtask-body">
                    <div class="wtask-name">{{ t.name }}</div>
                    <div class="wtask-meta">
                      <span class="wtask-who">{{ (t.person || t.assigner).name.split(' ').slice(-2).join(' ') }}</span>
                      <span class="wtask-status" :style="{ color: t.status.color, background: t.status.color + '22' }">{{ t.status.label }}</span>
                      <span v-if="t.due" class="wtask-due"><TIcon name="calendar" />{{ t.due.slice(5).replace('-', '/') }}</span>
                    </div>
                  </div>
                  <TIcon v-if="t.done" name="circle-check" class="wtask-done-ico" />
                </div>
              </div>
            </template>

            <template v-else-if="w.id === 'tasklist'">
              <div class="scroll-body">
                <div class="task-row" v-for="t in taskList" :key="t.id">
                  <div class="task-row__top">
                    <span class="badge badge--danger">Quá hạn</span>
                    <span class="task-row__name">{{ t.name }}</span>
                  </div>
                  <div class="task-row__meta">
                    <span class="ta-av">ĐV</span>
                    <template v-if="t.date"><TIcon name="calendar" /><span>{{ t.date }}</span></template>
                    <TIcon name="message-circle" /><span>{{ t.comments }}</span>
                    <template v-if="t.taskCount"><TIcon name="clipboard-list" /><span>{{ t.taskCount }}</span></template>
                  </div>
                  <div v-if="t.tag" class="badge badge--danger" style="margin-top:4px">{{ t.tag }}</div>
                </div>
              </div>
            </template>

            <template v-else-if="w.id === 'stats'">
              <div class="stats-list">
                <div class="stats-row" v-for="s in statItems" :key="s.label">
                  <span class="sico" :class="`sico--${s.color}`"><TIcon :name="s.icon" /></span>
                  <span class="slbl">{{ s.label }}</span>
                  <span class="sval" :class="`sval--${s.color}`">{{ s.val }}</span>
                </div>
              </div>
            </template>

          </div><!-- /wcard__bd -->

          <!-- Resize handle (edit mode only) -->
          <div v-if="isEditing" class="wcard__resize"
            :class="{ 'wcard__resize--active': resizing === w.id }"
            @mousedown="startResize($event, w.id)"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 10L10 4M7 10L10 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
        </div><!-- /wcard -->

        <!-- Add widget ghost tile -->
        <div v-if="isEditing" class="wcard wcard--ghost" :style="{ gridColumn: 'span 6' }">
          <TIcon name="plus" /><span>Thêm widget</span>
        </div>

      </div><!-- /wgrid -->
    </div>
  </AppShell>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import AppShell  from '../components/AppShell.vue'
import TIcon     from '@mds/components/TIcon.vue'
import { PEOPLE, ME } from '../store/people.js'

/* ── Grid constants ── */
const GRID_COLS = 24
const GRID_GAP  = 20

/* ── Clock ── */
const currentTime = ref('')
const currentDate = ref('')
let clockTimer = null
function updateClock() {
  const d = new Date(), h = d.getHours(), m = String(d.getMinutes()).padStart(2,'0')
  currentTime.value = `${String(h).padStart(2,'0')}:${m}`
  const days = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy']
  currentDate.value = `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
}
updateClock()

/* ── Weather (mock) ── */
const weather = {
  temp: 33, feels: 35, condition: 'Nhiều mây', icon: 'cloud',
  humidity: 72, wind: 18, high: 36, low: 28,
  location: 'Hà Nội',
}

/* ── Widgets ── */
// col 1-8 = breathing space · col 9-24 = 2×8 content
// welcome compact at top → cuatoi+toigiao (priority) → lienquan+remind → tasklist → caNhan+stats
const widgets = ref([
  { id:'welcome',  label:'Chào mừng',                  colStart:1,  rowStart:1,  colSpan:8,  rowSpan:25, visible:true },
  { id:'cuatoi',   label:'Việc giao cho tôi',          colStart:9,  rowStart:1,  colSpan:8,  rowSpan:7,  visible:true, type:'task-list' },
  { id:'toigiao',  label:'Việc tôi giao',              colStart:17, rowStart:1,  colSpan:8,  rowSpan:7,  visible:true, type:'task-list' },
  { id:'lienquan', label:'Việc liên quan đến tôi',     colStart:9,  rowStart:8,  colSpan:8,  rowSpan:7,  visible:true, type:'task-list' },
  { id:'remind',   label:'Nhắc việc hôm nay',          colStart:17, rowStart:8,  colSpan:8,  rowSpan:7,  visible:true },
  { id:'tasklist', label:'Danh sách việc cần làm',     colStart:9,  rowStart:15, colSpan:16, rowSpan:5,  visible:true },
  { id:'caNhan',   label:'Cá nhân',                    colStart:9,  rowStart:20, colSpan:8,  rowSpan:5,  visible:true, period:'Hôm nay', type:'chart-donut' },
  { id:'stats',    label:'Số lượng công việc hôm nay', colStart:17, rowStart:20, colSpan:8,  rowSpan:5,  visible:true },
])

const visibleWidgets = computed(() => widgets.value.filter(w => w.visible))

function getPeriods(id) {
  return id === 'caNhan' ? ['Hôm nay','Tuần này','Tháng này'] : ['Tuần này','Tháng này']
}

/* ── Edit mode ── */
const wgridEl   = ref(null)
const isEditing = ref(false)
let _widgetsSnap = []

async function startEdit() {
  _widgetsSnap = widgets.value.map(w => ({ ...w }))
  await nextTick()
  assignExplicitPositions()   // read DOM BEFORE setting isEditing
  isEditing.value = true
}
function saveEdit()   { isEditing.value = false }
function cancelEdit() { widgets.value = _widgetsSnap; isEditing.value = false }

function assignExplicitPositions() {
  const gridEl = wgridEl.value
  if (!gridEl) return
  const gridRect = gridEl.getBoundingClientRect()
  const cellW = (gridRect.width - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS
  const ROW_H = gridRowH.value
  const cardEls = [...gridEl.querySelectorAll('.wcard:not(.wcard--ghost)')]
  visibleWidgets.value.forEach((w, idx) => {
    if (w.colStart && w.rowStart) return
    const el = cardEls[idx]
    if (!el) return
    const rect = el.getBoundingClientRect()
    w.colStart = Math.max(1, Math.round((rect.left - gridRect.left) / (cellW + GRID_GAP)) + 1)
    w.rowStart = Math.max(1, Math.round((rect.top  - gridRect.top)  / (ROW_H + GRID_GAP)) + 1)
  })
}

function removeWidget(id) {
  const w = widgets.value.find(w => w.id === id)
  if (!w) return
  const inst = chartInstances[id]
  if (inst) { inst.dispose(); delete chartInstances[id] }
  w.visible = false
}

function toggleWidgetVisible(w) {
  w.visible = !w.visible
  if (w.visible) nextTick(() => initCharts())
}

/* ── Square cells (ResizeObserver) ── */
const gridRowH = ref(40)

function updateGridRowSize() {
  const gridEl = wgridEl.value
  if (!gridEl) return
  const colW = Math.floor((gridEl.clientWidth - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS)
  if (colW > 20 && colW !== gridRowH.value) {
    gridEl.style.gridAutoRows = `${colW}px`
    gridRowH.value = colW
    resizeCharts()
  }
}

const gridRO = new ResizeObserver(updateGridRowSize)

/* ── Drag & Drop ── */
const dragging    = ref(null)
const dragOver    = ref(null)
const dropPreview = ref(null)
let dragOffsetPx  = { x: 0, y: 0 }

function onDragStart(e, id) {
  dragging.value = id
  dropPreview.value = null
  e.dataTransfer.effectAllowed = 'move'
  const cardRect = e.currentTarget.getBoundingClientRect()
  dragOffsetPx = { x: e.clientX - cardRect.left, y: e.clientY - cardRect.top }
  nextTick(() => {
    if (!wgridEl.value) return
    const colW = (wgridEl.value.clientWidth - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS
    wgridEl.value.style.setProperty('--gcw', `${colW}px`)
  })
}

function onWgridDragOver(e) {
  if (!isEditing.value || !dragging.value || !wgridEl.value) return
  e.preventDefault()
  const draggedW = widgets.value.find(w => w.id === dragging.value)
  if (!draggedW) return
  const gridRect = wgridEl.value.getBoundingClientRect()
  const cellW = (gridRect.width - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS
  const relX = e.clientX - gridRect.left - dragOffsetPx.x
  const relY = e.clientY - gridRect.top  - dragOffsetPx.y
  const colStart = Math.max(1, Math.min(GRID_COLS - draggedW.colSpan + 1, Math.floor(relX / (cellW + GRID_GAP)) + 1))
  const rowStart = Math.max(1, Math.floor(relY / (gridRowH.value + GRID_GAP)) + 1)
  if (!dropPreview.value || dropPreview.value.colStart !== colStart || dropPreview.value.rowStart !== rowStart) {
    dropPreview.value = { colStart, rowStart, colSpan: draggedW.colSpan, rowSpan: draggedW.rowSpan }
  }
}

function onWgridDrop(e) {
  e.preventDefault()
  if (!dragging.value || !dropPreview.value) return
  const widget = widgets.value.find(w => w.id === dragging.value)
  if (widget) {
    widget.colStart = dropPreview.value.colStart
    widget.rowStart = dropPreview.value.rowStart
    pushOverlapping(widget.id)
  }
  dragging.value = null
  dragOver.value = null
  dropPreview.value = null
  nextTick(() => resizeCharts())
}

function onDragEnd() {
  dragging.value = null
  dragOver.value = null
  dropPreview.value = null
}

function pushOverlapping(movedId) {
  function overlaps(a, b) {
    if (a.id === b.id || !a.colStart || !b.colStart) return false
    return a.colStart <= b.colStart + b.colSpan - 1 &&
           a.colStart + a.colSpan - 1 >= b.colStart &&
           a.rowStart <= b.rowStart + b.rowSpan - 1 &&
           a.rowStart + a.rowSpan - 1 >= b.rowStart
  }
  for (let pass = 0; pass < 30; pass++) {
    let anyMoved = false
    for (const w of widgets.value) {
      if (w.id === movedId || !w.visible) continue
      const conflict = widgets.value.find(other => other.visible && overlaps(w, other))
      if (!conflict) continue
      anyMoved = true
      const newColStart = conflict.colStart + conflict.colSpan
      if (newColStart + w.colSpan - 1 <= GRID_COLS) {
        w.colStart = newColStart
        w.rowStart = conflict.rowStart
      } else {
        w.colStart = 1
        w.rowStart = conflict.rowStart + conflict.rowSpan
      }
    }
    if (!anyMoved) break
  }
}

/* ── Resize (bottom-right corner) ── */
const resizing = ref(null)

function startResize(e, widgetId) {
  e.preventDefault(); e.stopPropagation()
  const widget = widgets.value.find(w => w.id === widgetId)
  if (!widget || !wgridEl.value) return
  resizing.value = widgetId
  const gridRect = wgridEl.value.getBoundingClientRect()
  const cellW = (gridRect.width - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS
  const cellH = gridRowH.value + GRID_GAP
  const startX = e.clientX, startY = e.clientY
  const startCS = widget.colSpan, startRS = widget.rowSpan
  function onMove(ev) {
    const maxCS = GRID_COLS - (widget.colStart || 1) + 1
    widget.colSpan = Math.max(3, Math.min(maxCS, startCS + Math.round((ev.clientX - startX) / cellW)))
    widget.rowSpan = Math.max(1, Math.min(12,    startRS + Math.round((ev.clientY - startY) / cellH)))
  }
  function onUp() {
    resizing.value = null
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
    nextTick(() => resizeCharts())
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

/* ── Edit grid cells (dashed background) ── */
const editGridCells = computed(() => {
  if (!isEditing.value) return []
  const maxRow = visibleWidgets.value.reduce((m, w) => Math.max(m, (w.rowStart || 1) + (w.rowSpan || 1) - 1), 8)
  const rows = maxRow + 3
  const cells = []
  for (let r = 1; r <= rows; r++)
    for (let c = 1; c <= GRID_COLS; c++)
      cells.push({ col: c, row: r })
  return cells
})

/* ── ECharts ── */
const isDark         = ref(false)
const chartEls       = {}
const chartInstances = {}

function setChartEl(el, id) { if (el) chartEls[id] = el }

const LG = (x1, y1, x2, y2, ...stops) =>
  new echarts.graphic.LinearGradient(x1, y1, x2, y2,
    stops.map(([o, c]) => ({ offset: o, color: c })))

const G_MINT  = LG(0,0,0,1, [0,'#34d399'], [1,'#06b6d4'])
const G_ROSE  = LG(0,0,0,1, [0,'#fb7185'], [1,'#f97316'])
const G_SKY   = LG(0,0,0,1, [0,'#60a5fa'], [1,'#818cf8'])
const G_AMBER = LG(0,0,0,1, [0,'#fbbf24'], [1,'#f97316'])

function getChartOpt(w) {
  const dark = isDark.value
  const tc   = dark ? 'rgba(255,255,255,0.55)' : '#6b707a'
  const gc   = dark ? 'rgba(255,255,255,0.08)' : '#e9eaeb'
  const lc   = dark ? '#ffffff'                : '#383c40'
  const font = 'InterVariable, "Inter var", sans-serif'

  const tooltip = {
    backgroundColor: dark ? 'rgba(20,16,32,0.92)' : '#fff',
    borderColor:     dark ? 'rgba(255,255,255,0.15)' : '#e9eaeb',
    textStyle: { color: dark ? '#ffffff' : '#10141b', fontFamily: font, fontSize: 12 },
  }
  const xAxisCategory = (data) => ({
    type: 'category', data,
    axisLine: { show: false }, axisTick: { show: false },
    axisLabel: { color: tc, fontFamily: font, fontSize: 11 },
    splitLine: { show: false },
  })
  const yAxisValue = () => ({
    type: 'value', minInterval: 1,
    axisLabel: { color: tc, fontFamily: font, fontSize: 11 },
    splitLine: { lineStyle: { color: gc } },
    axisLine: { show: false }, axisTick: { show: false },
  })

  if (w.type === 'chart-bar') {
    const DATA = {
      lienquan: { d1:[2,1,3,0,2,0,0], d2:[1,2,0,1,1,0,0] },
      cuatoi:   { d1:[1,2,1,2,1,0,0], d2:[0,1,2,0,1,0,0] },
      toigiao:  { d1:[3,1,2,1,0,0,0], d2:[1,0,1,1,1,0,0] },
    }
    const d = DATA[w.id] || { d1:[], d2:[] }
    return {
      backgroundColor: 'transparent',
      grid: { top: 32, right: 12, bottom: 28, left: 32 },
      legend: { top: 6, right: 10, itemWidth: 8, itemHeight: 8, itemGap: 10,
        textStyle: { color: tc, fontFamily: font, fontSize: 11 } },
      xAxis: xAxisCategory(['T2','T3','T4','T5','T6','T7','CN']),
      yAxis: yAxisValue(),
      series: [
        { name:'Quá hạn', type:'bar', stack:'s', barWidth:'46%', data: d.d1,
          itemStyle: { color: G_ROSE, borderRadius:[0,0,0,0] } },
        { name:'Đến hạn', type:'bar', stack:'s', barWidth:'46%', data: d.d2,
          itemStyle: { color: G_MINT, borderRadius:[3,3,0,0] } },
      ],
      tooltip: { ...tooltip, trigger:'axis',
        formatter: p => `${p[0].axisValue}<br/>` + p.map(s => `${s.seriesName}: <b>${s.value}</b>`).join('<br/>') },
    }
  }

  if (w.type === 'chart-donut') {
    return {
      backgroundColor: 'transparent',
      series: [{
        type:'pie', radius:['52%','80%'], center:['50%','50%'],
        avoidLabelOverlap: false,
        emphasis: { itemStyle: { shadowBlur:8, shadowColor:'rgba(0,0,0,0.15)' } },
        label: {
          show: true, position:'center',
          formatter: () => `{n|9}\n{lbl|công việc}`,
          rich: {
            n:   { fontSize:24, fontWeight:'700', color: lc, fontFamily: font, lineHeight:26 },
            lbl: { fontSize:11, color: tc, fontFamily: font, lineHeight:15 },
          },
        },
        labelLine: { show: false },
        data: [
          { value:4, name:'Quá hạn',     itemStyle:{ color: G_ROSE  } },
          { value:2, name:'Đến hạn',     itemStyle:{ color: G_AMBER } },
          { value:3, name:'Sắp đến hạn', itemStyle:{ color: G_SKY   } },
        ],
      }],
      tooltip: { ...tooltip, trigger:'item',
        formatter: p => `${p.name}: <b>${p.value}</b> (${p.percent.toFixed(1)}%)` },
    }
  }
  return null
}

const CHART_TYPES = ['chart-bar', 'chart-donut']

function initCharts() {
  nextTick(() => {
    widgets.value.filter(w => CHART_TYPES.includes(w.type) && w.visible).forEach(w => {
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

watch(isDark, () => initCharts())

/* ── Sample data ── */
const remindItems = [
  { num:1, icon:'clipboard-list', title:'Công việc',  desc:'Bạn có <a href="#" style="color:var(--text-brand)">3 công việc</a> cần thực hiện' },
  { num:2, icon:'calendar',       title:'Lịch họp',   desc:'Hiện tại không có lịch họp nào cần tham gia' },
  { num:3, icon:'sitemap',        title:'Quy trình',  desc:'Bạn có <a href="#" style="color:var(--text-brand)">3 quy trình</a> cần xử lý' },
  { num:4, icon:'file-text',      title:'Đơn từ',     desc:'Hiện tại không có đơn từ nào cần phê duyệt' },
]
const suggests = [
  '8:00–9:30: Xử lý 3 quy trình ưu tiên cao',
  '10:00–11:30: Hoàn thành 3 công việc quan trọng',
  '14:00–15:00: Duyệt đơn từ (nếu phát sinh)',
  '15:30–16:30: Tổng kết & chuẩn bị ngày mai',
]
const taskList = [
  { id:1, name:'Việc của tôi',                     date:'25/09/2020', comments:3 },
  { id:2, name:'3333234234',                       date:'14/09/2023', comments:2, taskCount:'1/1' },
  { id:3, name:'Triển khai dự án AMIS Công việc',  date:'29/09/2023', comments:5 },
  { id:4, name:'Review kết quả sprint 12',          date:'30/01/2023', comments:0, taskCount:'0/2' },
  { id:5, name:'3333',                              date:'',           comments:0, tag:'1. QC đã test' },
  { id:6, name:'Cập nhật tài liệu kỹ thuật API',   date:'01/03/2023', comments:1 },
  { id:7, name:'Kiểm tra hiệu năng database',      date:'15/02/2023', comments:3 },
  { id:8, name:'Họp đánh giá Q1 với team',         date:'10/01/2023', comments:2 },
]
const statItems = [
  { icon:'alert-triangle',  label:'Quá hạn',            val:7, color:'danger'  },
  { icon:'clock-hour-4',    label:'Đến hạn',            val:0, color:'warning' },
  { icon:'bell',            label:'Sắp đến hạn',        val:0, color:'info'    },
  { icon:'message-circle',  label:'Chờ tôi duyệt',      val:0, color:'neutral' },
  { icon:'user-circle',     label:'Công việc cần giao',  val:1, color:'brand'   },
]

const STATUS_COLORS = { todo:'#64748b', doing:'#3b82f6', done:'#10b981', review:'#f59e0b' }

/* Việc tôi giao — tasks ME assigned to others */
const tasksToigiao = PEOPLE.slice(1).flatMap((p, i) => [
  { id: 900+i*2,   person: p, name: ['Xây dựng module quản lý nhân sự','Design màn hình báo cáo','Cập nhật form nhập liệu','Nghiên cứu microservices','Triển khai module thông báo'][i] || 'Công việc mới', due:'2026-07-'+String(12+i*3).padStart(2,'0'), status:{ label:['Đang xử lý','Chưa bắt đầu','Đang thực hiện','Kế hoạch'][i%4], color:Object.values(STATUS_COLORS)[i%4] }, done: i===2 },
  { id: 901+i*2,   person: p, name: ['Review thiết kế UX module','Lên kế hoạch sprint Q3','Cập nhật dependencies','Họp báo cáo tiến độ Q3'][i] || 'Phân tích yêu cầu', due:'2026-07-'+String(15+i*2).padStart(2,'0'), status:{ label:['Chưa bắt đầu','Đang thực hiện','Hoàn thành','Đang xử lý'][i%4], color:Object.values(STATUS_COLORS)[i%4] }, done: false },
])

/* Việc giao cho tôi — tasks others assigned to ME */
const tasksCuatoi = PEOPLE.slice(1).flatMap((p, i) => [
  { id: 950+i*2, assigner: p, name: ['Thiết kế màn hình dashboard mới','Viết tài liệu API v2','Triển khai module thanh toán','Nghiên cứu giải pháp cache Redis'][i] || 'Phân tích yêu cầu module', due:'2026-07-'+String(10+i*3).padStart(2,'0'), status:{ label:['Đang thực hiện','Chưa thực hiện','Đang thực hiện','Chưa thực hiện'][i%4], color:Object.values(STATUS_COLORS)[i%4] }, done: false },
  { id: 951+i*2, assigner: p, name: ['Refactor module xác thực','Viết test cho API đặt lịch','Tích hợp OAuth2 Google','Xây dựng hệ thống gợi ý'][i] || 'Cải thiện accessibility', due:'2026-07-'+String(5+i*4).padStart(2,'0'), status:{ label:['Đang thực hiện','Đang thực hiện','Chưa thực hiện','Đang thực hiện'][i%4], color:Object.values(STATUS_COLORS)[i%4] }, done: i===1 },
])

/* Việc liên quan — tasks I'm involved in but not the primary actor */
const tasksLienquan = [
  { id:980, person:PEOPLE[1], name:'Họp kick-off dự án ERP mới',          due:'2026-07-16', status:{ label:'Đang tiến hành', color:'#3b82f6' }, done:false },
  { id:981, person:PEOPLE[2], name:'Review thiết kế UX module báo cáo',   due:'2026-07-22', status:{ label:'Chưa bắt đầu',  color:'#64748b' }, done:false },
  { id:982, person:PEOPLE[3], name:'Lên kế hoạch sprint Q3',             due:'2026-07-11', status:{ label:'Đang thực hiện', color:'#3b82f6' }, done:false },
  { id:983, person:PEOPLE[4], name:'Xây dựng tài liệu hướng dẫn sử dụng',due:'2026-07-28', status:{ label:'Chưa bắt đầu',  color:'#64748b' }, done:false },
  { id:984, person:PEOPLE[1], name:'Demo sản phẩm cho khách hàng',        due:'2026-07-14', status:{ label:'Đang tiến hành', color:'#3b82f6' }, done:false },
  { id:985, person:PEOPLE[3], name:'Họp đánh giá KPI tháng 7',           due:'2026-07-15', status:{ label:'Hoàn thành',     color:'#10b981' }, done:true  },
]

onMounted(async () => {
  clockTimer = setInterval(updateClock, 30000)
  await nextTick()
  if (wgridEl.value) { gridRO.observe(wgridEl.value); updateGridRowSize() }
  initCharts()
})

onUnmounted(() => {
  clearInterval(clockTimer)
  gridRO.disconnect()
  Object.values(chartInstances).forEach(c => c?.dispose())
})
</script>

<style scoped>
/* ── Page container ── */
.tq {
  flex: 1; min-height: 0; overflow-y: auto;
  padding: 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.15) transparent;

  /* h-* tokens for wcard */
  --h-card:      rgba(255,255,255,0.82);
  --h-blur:      blur(20px) saturate(1.25);
  --h-border:    rgba(255,255,255,0.65);
  --h-shadow:    0 2px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
  --h-shadow-hv: 0 4px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
  --h-text-1:    var(--text-primary);
  --h-text-2:    var(--text-secondary);
  --h-text-3:    var(--text-hint, #9ca3af);
  --h-hover:     rgba(0,0,0,0.06);
}

/* ── Toolbar ── */
.tq-bar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.tq-bar__title { font-size: 15px; font-weight: var(--fw-semibold); color: var(--text-primary); margin: 0; }
.tq-bar__btns  { display: flex; align-items: center; gap: 8px; }
.tq-bar__btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 32px; padding: 0 12px;
  border: 1px solid rgba(255,255,255,0.4); border-radius: var(--radius-default);
  background: rgba(255,255,255,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  cursor: pointer; font-size: 13px; color: var(--text-primary);
  transition: background 0.15s;
}
.tq-bar__btn:hover { background: rgba(255,255,255,0.72); }
.tq-bar__btn--done   { background: var(--bg-success-light, #d1fae5); border-color: var(--stroke-success, #34d399); color: var(--text-success, #065f46); }
.tq-bar__btn--done:hover { background: #a7f3d0; }
.tq-bar__btn--cancel { background: rgba(255,255,255,0.5); border-color: rgba(0,0,0,0.12); color: var(--text-secondary); }
.tq-bar__btn--cancel:hover { background: rgba(255,255,255,0.72); color: var(--text-primary); }
.tq-bar__btn .ti { font-size: 15px; }

/* ── Customize panel ── */
.cp {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 12px 16px; margin-bottom: 16px;
}
.cp__left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; flex-wrap: wrap; }
.cp__lbl  { font-size: 11px; font-weight: var(--fw-semibold); color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; flex-shrink: 0; }
.cp__chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.cp__chip {
  display: inline-flex; align-items: center; gap: 5px;
  height: 28px; padding: 0 10px;
  border: 1px solid rgba(0,0,0,0.1); border-radius: 20px;
  background: rgba(255,255,255,0.5); font-size: 12px; color: var(--text-secondary);
  cursor: pointer; transition: all 0.15s; user-select: none;
}
.cp__chip:hover { background: rgba(255,255,255,0.75); color: var(--text-primary); }
.cp__chip--on { background: var(--bg-brand-light); border-color: var(--stroke-brand); color: var(--text-brand); }
.cp__chip-ico .ti { font-size: 13px; }
.cp__hint { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-hint); white-space: nowrap; flex-shrink: 0; }
.cp__hint-ico .ti { font-size: 13px; }

.glass {
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(20px) saturate(1.25); -webkit-backdrop-filter: blur(20px) saturate(1.25);
  border: 1px solid rgba(255,255,255,0.65); border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
}

/* ── Wgrid ── */
.wgrid {
  overflow: visible; padding: 4px 0 24px;
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-auto-rows: 40px;
  gap: 20px;
  align-content: start;
}

/* ── Wcard base ── */
.wcard {
  background: var(--h-card);
  border-radius: 16px;
  backdrop-filter: var(--h-blur); -webkit-backdrop-filter: var(--h-blur);
  border: 1px solid var(--h-border);
  box-shadow: var(--h-shadow);
  display: flex; flex-direction: column;
  overflow: hidden;
  position: relative;
  animation: fadeInUp .4s ease backwards;
  animation-delay: var(--delay, 0s);
  transition: box-shadow .22s ease, opacity .18s ease, transform .22s cubic-bezier(.34,1.56,.64,1);
}
.wcard:hover { background: rgba(255,255,255,0.9); box-shadow: var(--h-shadow-hv); }

/* Rainbow border on hover */
.wcard::after {
  content: ''; position: absolute; inset: 0; border-radius: 16px;
  background: linear-gradient(60deg, #f79533,#f37055,#ef4e7b,#a166ab,#5073b8,#1098ad,#07b39b,#6fba82,#f79533,#f37055);
  background-size: 300%; opacity: 0; transition: opacity .3s; pointer-events: none; z-index: 20;
  padding: 1px;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: destination-out;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: rainbow-move 3s ease alternate infinite; animation-play-state: paused;
}
.wcard:hover::after { opacity: 1; animation-play-state: running; }

/* Edit mode states */
.wcard--dragging {
  opacity: .22; transform: scale(.93) rotate(-0.8deg);
  filter: blur(1.5px) saturate(0.8);
  box-shadow: 0 24px 64px rgba(0,0,0,.5) !important;
  z-index: 100;
}
.wcard--over {
  box-shadow: 0 0 0 2.5px #4a7ff7, 0 0 0 7px rgba(36,95,223,.26), 0 12px 48px rgba(36,95,223,.22) !important;
  transform: scale(1.025) translateY(-2px); z-index: 5;
  animation: drop-pulse .85s ease-in-out infinite alternate;
}
.wcard--over::before {
  content: ''; position: absolute; inset: 0; border-radius: 14px;
  background: rgba(36,95,223,.07); z-index: 1; pointer-events: none;
}
.wcard--resizing {
  outline: 2px solid rgba(74,127,247,.55); outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(36,95,223,.12), 0 12px 40px rgba(36,95,223,.18) !important;
  transition: none !important;
}

/* Jiggle on enter edit */
@keyframes editJiggle {
  0%,100% { transform: rotate(0deg); }
  20%     { transform: rotate(-0.6deg); }
  50%     { transform: rotate(0.6deg); }
  80%     { transform: rotate(-0.3deg); }
}
.wgrid--editing .wcard:not(.wcard--ghost):not(.wcard--dragging) {
  animation: editJiggle .5s ease-in-out 1;
}

/* Drag mode */
.wgrid--editing .wcard:not(.wcard--ghost) { cursor: grab; }
.wgrid--editing .wcard:not(.wcard--ghost):active { cursor: grabbing; }
.wgrid--dragging .wcard:not(.wcard--dragging) {
  opacity: 0.55; transition: opacity .15s ease !important;
}

/* Ghost tile */
.wcard--ghost {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  border: 2px dashed var(--h-border); border-radius: 16px;
  background: rgba(255,255,255,.08); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  box-shadow: none; cursor: pointer; color: var(--h-text-2); font-size: 13px;
  animation: none !important;
}
.wcard--ghost::after { display: none; }
.wcard--ghost:hover  { border-color: #245fdf; color: #245fdf; background: rgba(36,95,223,.04); }

/* ── Grid cell overlay ── */
.wgrid__cell {
  border-radius: 8px; border: 1.5px dashed rgba(36,95,223,.18);
  background: rgba(36,95,223,.04); pointer-events: none; z-index: 0;
}

/* ── Drop ghost ── */
.wgrid__drop-ghost {
  border-radius: 14px; border: 2px dashed #4a7ff7;
  background: rgba(36,95,223,.10); pointer-events: none; z-index: 3;
  animation: ghostPop .12s cubic-bezier(.34,1.56,.64,1);
}
@keyframes ghostPop {
  from { opacity: 0; transform: scale(.96); }
  to   { opacity: 1; transform: scale(1); }
}

/* ── Resize handle ── */
.wcard__resize {
  position: absolute; bottom: 6px; right: 6px;
  width: 22px; height: 22px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: se-resize; color: var(--h-text-3);
  transition: color .15s, background .15s, transform .15s cubic-bezier(.34,1.56,.64,1), opacity .15s;
  z-index: 10; opacity: 0.5;
}
.wcard__resize:hover { color: var(--h-text-1); background: var(--h-hover); transform: scale(1.2); opacity: 1; }
.wcard__resize--active { color: #4a7ff7; background: rgba(36,95,223,.15); transform: scale(1.15); opacity: 1; }

/* ── Card header ── */
.wcard__hd {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px; padding: 12px 14px 0; flex-shrink: 0;
}
.wcard__hd-l { display: flex; align-items: center; gap: 8px; min-width: 0; }
.wcard__hd-r { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.wcard__title {
  font-size: 13px; font-weight: var(--fw-semibold); color: var(--text-primary);
  display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.badge-n {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  background: var(--bg-brand-light); color: var(--text-brand);
  border-radius: 10px; font-size: 11px; font-weight: var(--fw-semibold);
}
.period-sel {
  height: 24px; padding: 0 6px;
  border: 1px solid rgba(0,0,0,0.08); border-radius: 6px;
  font-size: 11px; color: var(--text-secondary);
  background: rgba(255,255,255,0.5); cursor: pointer; outline: none;
}
.period-sel:focus { border-color: var(--stroke-brand); }
.wc-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border: none; background: transparent;
  border-radius: 6px; cursor: pointer; padding: 0; color: var(--text-secondary);
  opacity: 0; transition: opacity 0.15s, background 0.1s;
}
.wcard:hover .wc-btn { opacity: 1; }
.wc-btn:hover { background: rgba(0,0,0,0.07); }
.wc-btn--del:hover { background: var(--bg-danger-light); color: var(--text-danger); opacity: 1; }
.wc-btn .ti { font-size: 14px; }
.drag-handle {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; color: var(--text-hint); cursor: grab; border-radius: 4px;
}
.drag-handle:hover { background: rgba(0,0,0,0.07); color: var(--text-secondary); }
.drag-handle .ti { font-size: 14px; }

/* ── Card body ── */
.wcard__bd { flex: 1; min-height: 0; padding: 12px 14px 14px; display: flex; flex-direction: column; }

/* ── Keyframes ── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes drop-pulse {
  from { box-shadow: 0 0 0 2.5px #4a7ff7, 0 0 0 7px rgba(36,95,223,.26), 0 8px 32px rgba(36,95,223,.18); }
  to   { box-shadow: 0 0 0 2.5px #4a7ff7, 0 0 0 10px rgba(36,95,223,.12), 0 16px 48px rgba(36,95,223,.26); }
}
@keyframes rainbow-move {
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

/* ── Transparent welcome card ── */
.wcard--transparent {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  overflow: visible;
}
.wcard--transparent::after,
.wcard--transparent::before { display: none !important; }
.wcard--transparent:hover    { background: transparent !important; box-shadow: none !important; }
.wcard--transparent .wcard__hd { display: none; }
.wcard--transparent .wcard__bd { padding: 0; height: 100%; }

/* ── Hero (vertical, transparent, grouped content) ── */
.hero {
  display: flex; flex-direction: column; gap: 4px;
  height: 100%; padding: 6px 4px 4px; box-sizing: border-box; justify-content: flex-start;
}
.hero__greet {
  font-size: 13px; color: var(--text-secondary); font-weight: 400; line-height: 1.4;
}
.hero__greet strong { color: var(--text-primary); font-weight: 700; }
.hero__sub {
  font-size: 11.5px; color: var(--text-hint); line-height: 1.4;
}
.hero__time {
  font-size: 48px; font-weight: 800; letter-spacing: -2px; line-height: 1;
  margin-top: 6px;
  background: linear-gradient(110deg, var(--text-ai) 0%, #cf11ff 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero__date {
  font-size: 11.5px; color: var(--text-hint); font-weight: 400; letter-spacing: 0.3px;
  text-transform: capitalize;
}
/* ── Weather block ── */
.hero__weather {
  margin-top: 10px;
  background: var(--bg-neutral-light); border: 1px solid var(--stroke-neutral-light);
  border-radius: 12px; padding: 10px 12px;
}
.hero__w-main {
  display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
}
.hero__w-temp {
  font-size: 38px; font-weight: 700; color: var(--text-primary); line-height: 1; letter-spacing: -1px;
}
.hero__w-info { display: flex; flex-direction: column; gap: 3px; }
.hero__w-cond { font-size: 12.5px; color: var(--text-primary); font-weight: 500; }
.hero__w-loc {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: var(--text-hint);
}
.hero__w-loc .ti { font-size: 11px; }
.hero__w-details {
  display: flex; flex-direction: column; gap: 5px;
  border-top: 1px solid var(--stroke-neutral-light); padding-top: 7px;
}
.hero__w-row {
  display: flex; align-items: center; gap: 6px;
  font-size: 11.5px; color: var(--text-secondary);
}
.hero__w-row .ti { font-size: 12px; color: var(--icon-neutral); flex-shrink: 0; }

/* ── Remind ── */
.scroll-body { flex: 1; overflow-y: auto; scrollbar-width: none; min-height: 0; }
.scroll-body::-webkit-scrollbar { width: 0; }
.scroll-body:hover { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.18) transparent; }
.scroll-body:hover::-webkit-scrollbar { width: 4px; }
.scroll-body:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.18); border-radius: 2px; }
.remind-row { margin-bottom: 10px; }
.remind-row__hd { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-primary); margin-bottom: 2px; }
.remind-ico .ti { font-size: 13px; color: var(--icon-neutral); }
.remind-row__desc { margin: 0; padding-left: 20px; font-size: 12px; color: var(--text-secondary); }
.suggest-box { padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.06); margin-top: 2px; }
.suggest-box__hd { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: var(--fw-semibold); color: var(--text-primary); margin: 6px 0 4px; }
.dot-warn { width: 8px; height: 8px; border-radius: 50%; background: var(--bg-warning); flex-shrink: 0; }
.suggest-box ul { margin: 0; padding-left: 16px; display: flex; flex-direction: column; gap: 2px; }
.suggest-box li { font-size: 12px; color: var(--text-secondary); }

/* ── Donut ── */
.donut-wrap { display: flex; align-items: center; gap: 16px; flex: 1; min-height: 0; }
.donut-el   { width: 136px; height: 136px; flex-shrink: 0; }
.chart-wrap { flex: 1; width: 100%; min-height: 0; height: 160px; }
.donut-leg  { display: flex; flex-direction: column; gap: 14px; flex: 1; }
.dleg { display: flex; align-items: center; gap: 10px; }
.dleg__dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dleg--danger .dleg__dot { background: var(--chart-c4, #ef4444); }
.dleg--warn   .dleg__dot { background: var(--chart-c3, #f59e0b); }
.dleg--info   .dleg__dot { background: var(--chart-c2, #3b82f6); }
.dleg b    { font-size: 18px; font-weight: 700; color: var(--text-primary); min-width: 26px; }
.dleg span { font-size: 12px; color: var(--text-secondary); }

/* ── Task list ── */
.task-row { padding: 9px 0; border-bottom: 1px solid rgba(0,0,0,0.05); cursor: pointer; transition: all 0.1s; }
.task-row:last-child { border-bottom: none; }
.task-row:hover { background: rgba(0,0,0,0.03); border-radius: 6px; margin: 0 -6px; padding: 9px 6px; }
.task-row__top  { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.task-row__name { font-size: 13px; font-weight: var(--fw-medium); color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; }
.task-row__meta { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-secondary); }
.task-row__meta .ti { font-size: 12px; }
.ta-av { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: var(--text-brand); background: var(--bg-brand-light); flex-shrink: 0; }
.badge { display: inline-flex; align-items: center; height: 18px; padding: 0 6px; border-radius: 4px; font-size: 10px; font-weight: var(--fw-semibold); flex-shrink: 0; }
.badge--danger { background: var(--bg-danger-light); color: var(--text-danger); }

/* ── Stats ── */
.stats-list { display: flex; flex-direction: column; gap: 2px; }
.stats-row  { display: flex; align-items: center; gap: 10px; height: 36px; border-radius: 6px; cursor: pointer; padding: 0 4px; }
.stats-row:hover { background: rgba(0,0,0,0.04); }
.sico { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0; }
.sico .ti { font-size: 15px; }
.sico--danger  { background: var(--bg-danger-light);        color: var(--text-danger);  }
.sico--warning { background: var(--bg-warning-light);       color: var(--text-warning); }
.sico--info    { background: var(--bg-info-light, #eff8ff); color: var(--text-info, #2563eb); }
.sico--neutral { background: var(--bg-neutral-light);       color: var(--text-secondary); }
.sico--brand   { background: var(--bg-brand-light);         color: var(--text-brand);   }
.slbl { flex: 1; font-size: 13px; color: var(--text-primary); }
.sval { font-size: 14px; font-weight: var(--fw-semibold); min-width: 24px; text-align: right; }
.sval--danger  { color: var(--text-danger);  }
.sval--warning { color: var(--text-warning); }
.sval--info    { color: var(--text-info, #2563eb); }
.sval--neutral { color: var(--text-secondary); }
.sval--brand   { color: var(--text-brand);   }

/* ── Widget task list (toigiao / cuatoi) ── */
.wtask-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 4px; border-bottom: 1px solid var(--stroke-neutral-light);
  cursor: pointer; transition: background .1s;
}
.wtask-row:last-child { border-bottom: none; }
.wtask-row:hover { background: rgba(0,0,0,0.03); border-radius: 6px; }
.wtask-sico {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: color-mix(in srgb, var(--sc) 15%, transparent);
  border: 2px solid color-mix(in srgb, var(--sc) 40%, transparent);
  display: flex; align-items: center; justify-content: center;
}
.wtask-sico__dot {
  width: 10px; height: 10px; border-radius: 50%; background: var(--sc);
}
.wtask-body { flex: 1; min-width: 0; }
.wtask-name {
  font-size: 12.5px; font-weight: var(--fw-medium); color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.wtask-row--done .wtask-name { text-decoration: line-through; color: var(--text-secondary); }
.wtask-meta {
  display: flex; align-items: center; gap: 6px; margin-top: 3px; flex-wrap: wrap;
}
.wtask-who  { font-size: 11px; color: var(--text-secondary); }
.wtask-status {
  font-size: 10px; padding: 1px 6px; border-radius: 10px;
  font-weight: var(--fw-medium); white-space: nowrap;
}
.wtask-due {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 11px; color: var(--text-hint);
}
.wtask-due .ti { font-size: 11px; }
.wtask-done-ico { font-size: 16px; color: #10b981; flex-shrink: 0; }

/* ── Transitions ── */
.slide-panel-enter-active, .slide-panel-leave-active { transition: opacity 0.18s, transform 0.18s; }
.slide-panel-enter-from,  .slide-panel-leave-to     { opacity: 0; transform: translateY(-8px); }
</style>
