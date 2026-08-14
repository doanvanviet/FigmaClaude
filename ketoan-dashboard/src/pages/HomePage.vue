<template>
  <div class="amis-home" :class="{ 'amis-dark': isDark }" :style="isDark ? { backgroundImage: `url('${selectedBg}')` } : {}">

    <!-- ═══════════════ PLATFORM HEADER ═══════════════ -->
    <header class="ph">
      <div class="ph__left">
        <div class="ph__brand">
          <img class="ph__logo-svg" src="https://amis.misa.vn/sites/menu/images/ic-amis.svg" alt="MISA AMIS" />
          <span class="ph__appname">MISA AMIS</span>
        </div>
        <div class="ph__divider-v"></div>
        <div class="ph__greet-block">
          <span class="ph__greet">{{ greetText }}, <strong class="ph__greet-name">Việt</strong></span>
          <span class="ph__datetime">{{ dateTimeStr }}</span>
          <span class="ph__sep">·</span>
          <div class="ph__weather">
            <span class="ph__weather-ico" :style="{ color: weather.color }"><TIcon :name="weather.icon" /></span>
            <span class="ph__weather-temp">{{ weather.temp }}°</span>
            <span class="ph__weather-meta">{{ weather.cond }} · {{ weather.humidity }}% · HN</span>
          </div>
        </div>
      </div>

      <div class="ph__right">
        <template v-if="isEditing">
          <button class="amis-btn amis-btn--outline" @click="cancelEdit">
            <TIcon name="x" />Hủy
          </button>
          <button class="amis-btn amis-btn--primary" @click="saveEdit">
            <TIcon name="check" />Lưu
          </button>
        </template>
        <button v-else class="amis-btn amis-btn--outline" @click="startEdit">
          <TIcon name="pencil" />Tùy chỉnh
        </button>
        <button class="amis-btn amis-btn--primary" @click="showCatalog = true">
          <TIcon name="plus" />Thêm widget
        </button>
        <div class="ph__divider-v"></div>
        <button class="ph-icon-btn" @click="isDark = !isDark" :title="isDark ? 'Chế độ sáng' : 'Chế độ tối'">
          <TIcon :name="isDark ? 'sun' : 'moon'" />
        </button>
        <div class="ph__settings-wrap">
          <button class="ph-icon-btn" @click="showBgPicker = !showBgPicker" :class="{ 'ph-icon-btn--active': showBgPicker }">
            <TIcon name="settings" />
          </button>
          <Transition name="picker">
            <div v-if="showBgPicker" class="bg-picker">
              <div class="bg-picker__hd">
                <span class="bg-picker__title">Ảnh nền</span>
                <button class="ph-icon-btn" style="width:24px;height:24px;" @click="showBgPicker=false"><TIcon name="x" /></button>
              </div>
              <div class="bg-picker__grid">
                <button
                  v-for="bg in bgList" :key="bg.id"
                  class="bg-thumb"
                  :class="{ 'bg-thumb--active': selectedBg === bg.full }"
                  @click="selectedBg = bg.full; showBgPicker = false"
                  :title="bg.name"
                >
                  <img :src="bg.thumb" :alt="bg.name" loading="lazy" />
                  <span class="bg-thumb__name">{{ bg.name }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
        <img class="ph__avatar" src="https://i.pravatar.cc/80?img=68" alt="Nguyễn Đức Việt" title="Nguyễn Đức Việt" />
      </div>
    </header>

    <!-- ═══════════════ MAIN DASHBOARD ═══════════════ -->
    <main class="amis-main" ref="mainEl">
    <div class="amis-body">

      <!-- Widget Grid -->
      <div class="wgrid" :class="{ 'wgrid--editing': isEditing, 'wgrid--dragging': dragging && isEditing }" ref="wgridEl"
        @dragover="onWgridDragOver" @drop.prevent="onWgridDrop">

        <!-- Grid cell overlay — visible in edit mode -->
        <div v-for="cell in editGridCells" :key="`gc-${cell.col}-${cell.row}`" class="wgrid__cell"
          :style="{ gridColumn: cell.col, gridRow: cell.row }"></div>

        <!-- Drop ghost — snap preview while dragging -->
        <div v-if="isEditing && dropPreview" class="wgrid__drop-ghost"
          :style="{ gridColumn: `${dropPreview.colStart} / span ${dropPreview.colSpan}`, gridRow: `${dropPreview.rowStart} / span ${dropPreview.rowSpan}` }"></div>

        <div
          v-for="(w, idx) in widgets" :key="w.id"
          class="wcard"
          :class="{ 'wcard--dragging': dragging === w.id, 'wcard--over': dragOver === w.id, 'wcard--new': freshWidgets.has(w.id), 'wcard--resizing': resizing === w.id, 'wcard--kpi': w.type === 'kpi' }"
          :style="{ gridColumn: w.colStart ? `${w.colStart} / span ${w.colSpan}` : `span ${w.colSpan}`, gridRow: w.rowStart ? `${w.rowStart} / span ${w.rowSpan}` : `span ${w.rowSpan}`, '--delay': idx*0.055+'s', '--accent': w.color }"
          :draggable="isEditing"
          @dragstart="onDragStart($event, w.id)"
          @dragover.prevent="dragOver = w.id"
          @dragleave="dragOver = null"
          @dragend="onDragEnd"
        >
          <div v-if="!w.customHd || isEditing" class="wcard__hd">
            <div v-if="!w.customHd" class="wcard__hd-l">
              <span v-if="!['kpi','chart-line','chart-bar','chart-donut','chart-cashflow'].includes(w.type)" class="wcard__icon" :style="{ color: w.color }"><TIcon :name="w.icon" /></span>
              <div style="display:flex;flex-direction:column;gap:8px">
                <div class="wcard__title">{{ w.title }}</div>
                <div v-if="w.showSrc !== false && w.type !== 'kpi'" class="wcard__src">{{ w.source }}</div>
              </div>
            </div>
            <div class="wcard__hd-r" :style="w.customHd ? { marginLeft:'auto' } : {}">
              <span v-if="w.period && !isEditing" class="wcard__period">{{ w.period }}</span>
              <button v-if="!isEditing && !w.customHd" class="wc-btn"><TIcon name="dots-vertical" /></button>
              <button v-if="isEditing" class="wc-btn wc-btn--del" @click.stop="removeWidget(w.id)"><TIcon name="x" /></button>
              <span v-if="isEditing" class="drag-handle"><TIcon name="dots" /></span>
            </div>
          </div>

          <!-- Resize handle — visible only in edit mode -->
          <div v-if="isEditing" class="wcard__resize" :class="{'wcard__resize--active': resizing===w.id}" @mousedown="startResize($event, w.id)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 10L10 4M7 10L10 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>

          <div class="wcard__bd">
            <!-- KPI -->
            <template v-if="w.type === 'kpi'">
              <div class="kpi">
                <div class="kpi__info">
                  <div class="kpi__num">
                    <span class="kpi__val">{{ w.data.value }}</span>
                    <span class="kpi__unit">{{ w.data.unit }}</span>
                  </div>
                  <div class="kpi__top">
                    <div class="kpi__badge" :class="w.data.up ? 'kpi__badge--up' : 'kpi__badge--dn'">
                      <TIcon :name="w.data.up ? 'trending-up' : 'trending-down'" />
                      {{ w.data.trend }}
                    </div>
                    <p class="kpi__compare">vs tháng trước</p>
                  </div>
                </div>
                <div class="kpi__icon-box" :style="{ background: w.color + '18', color: w.color }">
                  <TIcon :name="w.icon" :stroke-width="1.5" />
                </div>
              </div>
            </template>

            <!-- Chart -->
            <template v-else-if="['chart-line','chart-bar','chart-donut','chart-cashflow'].includes(w.type)">
              <div class="chart-wrap" :ref="el => setChartEl(el, w.id)"></div>
            </template>

            <!-- Transaction list -->
            <template v-else-if="w.type === 'list-tx'">
              <div class="ltx">
                <div v-for="item in w.data.items" :key="item.id" class="ltx__row">
                  <div class="ltx__dot" :class="item.type==='thu'?'ltx__dot--g':'ltx__dot--r'"></div>
                  <div class="ltx__info">
                    <span class="ltx__name">{{ item.name }}</span>
                    <span class="ltx__date">{{ item.date }}</span>
                  </div>
                  <span class="ltx__amount" :class="item.type==='thu'?'ltx__amount--g':'ltx__amount--r'">{{ item.amount }}</span>
                  <span class="ltx__tag" :class="item.status==='done'?'ltx__tag--ok':'ltx__tag--wait'">
                    {{ item.status==='done' ? 'Đã hạch toán' : 'Chờ duyệt' }}
                  </span>
                </div>
              </div>
            </template>

            <!-- Task list -->
            <template v-else-if="w.type === 'list-tasks'">
              <div class="tasks">
                <div v-for="item in w.data.items" :key="item.id" class="task-row" :class="{'task-row--done':item.done}">
                  <div class="task-check" @click="item.done = !item.done">
                    <div class="task-chk" :class="{'task-chk--on':item.done}">
                      <TIcon v-if="item.done" name="check" />
                    </div>
                  </div>
                  <div class="task-body">
                    <span class="task-name">{{ item.title }}</span>
                    <span class="task-time">{{ item.time }}</span>
                  </div>
                  <span class="task-pri" :class="`task-pri--${item.priority}`">
                    {{ item.priority==='high'?'Cao':item.priority==='medium'?'TB':'Thấp' }}
                  </span>
                </div>
                <div class="task-foot">
                  <span>{{ w.data.items.filter(i=>!i.done).length }} việc còn lại</span>
                  <button class="amis-link">Xem tất cả →</button>
                </div>
              </div>
            </template>

            <!-- ── Thao tác nhanh ── -->
            <template v-else-if="w.type === 'quick-actions'">
              <div class="rcard__body qa-grid">
                <button v-for="qa in quickActions" :key="qa.id" class="qa-btn" @click.prevent>
                  <div class="qa-btn__icon" :style="{ background: (isDark && qa.darkColor ? qa.darkColor : qa.color)+'38', color: isDark && qa.darkColor ? qa.darkColor : qa.color }">
                    <TIcon :name="qa.icon" :stroke-width="1.6" />
                    <span v-if="qa.badge" class="qa-badge">{{ qa.badge }}</span>
                  </div>
                  <span class="qa-btn__name">{{ qa.name }}</span>
                </button>
              </div>
            </template>

            <!-- ── Sinh nhật ── -->
            <template v-else-if="w.type === 'birthdays'">
              <div class="rcard__body">
                <div v-for="b in birthdays" :key="b.id" class="rrow">
                  <img class="rrow__av rrow__av--img" :src="b.avatar" :alt="b.name" />
                  <div class="rrow__info">
                    <span class="rrow__name">{{ b.name }}</span>
                    <span class="rrow__sub">{{ b.dept }} · {{ b.age }} tuổi</span>
                  </div>
                  <button class="rrow__btn"><TIcon name="send" /></button>
                </div>
                <div v-if="!birthdays.length" class="rcard__empty">Không có sinh nhật hôm nay</div>
              </div>
            </template>

            <!-- ── Thông báo ── -->
            <template v-else-if="w.type === 'notices'">
              <div class="rcard__body">
                <div v-for="n in notices" :key="n.id" class="notice-row">
                  <img class="rrow__av rrow__av--img" :src="n.avatar" :alt="n.text" />
                  <div class="notice-info">
                    <span class="notice-text">{{ n.text }}</span>
                    <span class="notice-time">{{ n.time }}</span>
                  </div>
                </div>
              </div>
            </template>

            <!-- ── Top bán hàng ── -->
            <template v-else-if="w.type === 'top-sales'">
              <div class="rcard__body">
                <div v-for="(s, i) in topSales" :key="s.id" class="sales-row">
                  <span class="sales-rank" :class="`sales-rank--${i+1}`">{{ i+1 }}</span>
                  <img class="rrow__av rrow__av--img" :src="s.avatar" :alt="s.name" />
                  <div class="rrow__info">
                    <span class="rrow__name">{{ s.name }}</span>
                    <span class="rrow__sub">{{ s.amount }}</span>
                  </div>
                  <div class="sales-bar-wrap">
                    <div class="sales-bar" :style="{ width: s.pct+'%', background: i===0?'#12b76a':i===1?'#245fdf':'#7a5af8' }"></div>
                  </div>
                </div>
              </div>
            </template>

            <!-- ── Liên kết nhanh ── -->
            <template v-else-if="w.type === 'quick-links'">
              <div class="rcard__body rcard__body--links">
                <a v-for="lk in quickLinks" :key="lk.id" class="qlink" :href="lk.url" target="_blank">
                  <span class="qlink__icon" :style="{ background: lk.color+'18', color: lk.color }"><TIcon :name="lk.icon" /></span>
                  <span class="qlink__name">{{ lk.name }}</span>
                  <TIcon name="external-link" />
                </a>
              </div>
            </template>
          </div>
        </div>

        <!-- Ghost add tile (edit mode) -->
        <div v-if="isEditing" class="wcard wcard--ghost" style="grid-column:span 6" @click="showCatalog=true">
          <TIcon name="plus" /><span>Thêm widget</span>
        </div>
      </div>

    </div><!-- end .amis-body -->
    </main>

    <!-- ═══════════════ BOTTOM DOCK ═══════════════ -->
    <nav class="apps-dock">
      <div class="apps-dock__pill" ref="dockScrollEl" @mousemove="onDockMove" @mouseleave="onDockLeave">
        <button
          v-for="app in dockApps" :key="app.id"
          class="app-chip"
          :class="{ 'app-chip--active': activeApp === app.id }"
          :style="{ '--g1': app.g[0], '--g2': app.g[1] }"
          :data-name="app.name"
          @click="openApp(app)"
        >
          <div class="app-chip__logo" :style="app.logo ? {} : { background:`linear-gradient(135deg,${app.g[0]},${app.g[1]})` }">
            <img v-if="app.logo" class="app-chip__logo-img" :src="app.logo" :alt="app.name" />
            <TIcon v-else :name="app.icon" :stroke-width="1.8" />
          </div>
          <span class="app-chip__name">{{ app.name }}</span>
        </button>
        <div class="dock-sep"></div>
        <button class="app-chip dock-add-btn" title="Thêm ứng dụng" @click="showCatalog = true">
          <div class="dock-add-btn__icon">
            <TIcon name="plus" :stroke-width="1.8" />
          </div>
          <span class="app-chip__name">Thêm</span>
        </button>
      </div>
    </nav>

    <!-- ═══════════════ CATALOG PANEL ═══════════════ -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="showCatalog" class="amis-overlay" @click.self="showCatalog=false">
          <Transition name="panel">
            <div class="catalog-panel">
              <div class="catalog-panel__hd">
                <span class="catalog-panel__title">Chọn widget để thêm</span>
                <button class="ph-icon-btn" @click="showCatalog=false"><TIcon name="x" /></button>
              </div>
              <p class="catalog-panel__sub">Widget kéo dữ liệu trực tiếp từ các ứng dụng trong nền tảng</p>
              <div class="catalog-panel__body">
                <div v-for="cat in catalog" :key="cat.id"
                  class="cat-item" :class="{'cat-item--added':widgets.some(w=>w.id===cat.id)}"
                  @click="toggleWidget(cat)"
                >
                  <div class="cat-item__icon" :style="{ color:cat.color, background:cat.color+'18' }">
                    <TIcon :name="cat.icon" />
                  </div>
                  <div class="cat-item__info">
                    <span class="cat-item__title">{{ cat.title }}</span>
                    <span class="cat-item__src">{{ cat.source }} · {{ cat.size }}</span>
                  </div>
                  <button class="cat-item__btn" :class="{'cat-item__btn--remove':widgets.some(w=>w.id===cat.id)}">
                    <TIcon :name="widgets.some(w=>w.id===cat.id)?'minus':'plus'" />
                  </button>
                </div>
              </div>
              <div class="catalog-panel__ft">
                <button class="amis-btn amis-btn--primary" style="width:100%;justify-content:center;height:38px" @click="showCatalog=false">Xong</button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import TIcon from '@mds/components/TIcon.vue'

const router = useRouter()

const isDark     = ref(true)
const uiBlue     = computed(() => isDark.value ? '#7aadff' : '#245fdf')
const searchQ    = ref('')
const isEditing  = ref(false)
const showCatalog= ref(false)
const showBgPicker = ref(false)

const bgList = [
  // ── Vũ trụ & Thiên hà ──
  { id:'bg1',  name:'Biển sao',        thumb:'https://images.pexels.com/photos/1341279/pexels-photo-1341279.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/1341279/pexels-photo-1341279.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg2',  name:'Tinh vân xanh',   thumb:'https://images.pexels.com/photos/3607542/pexels-photo-3607542.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/3607542/pexels-photo-3607542.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg3',  name:'Ngân hà',         thumb:'https://images.pexels.com/photos/5338522/pexels-photo-5338522.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/5338522/pexels-photo-5338522.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg4',  name:'Dải Ngân hà',     thumb:'https://images.pexels.com/photos/2312040/pexels-photo-2312040.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/2312040/pexels-photo-2312040.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg5',  name:'Ngân hà sâu',     thumb:'https://images.pexels.com/photos/2538107/pexels-photo-2538107.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/2538107/pexels-photo-2538107.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg6',  name:'Tinh vân đỏ',     thumb:'https://images.pexels.com/photos/9160637/pexels-photo-9160637.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/9160637/pexels-photo-9160637.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  // ── Dark Abstract ──
  { id:'bg7',  name:'Đêm tối giản',   thumb:'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=85&w=1920&auto=format&fit=crop' },
  { id:'bg8',  name:'Đêm trừu tượng', thumb:'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1559825481-12a05cc00344?q=85&w=1920&auto=format&fit=crop' },
  { id:'bg9',  name:'Đêm tĩnh lặng',  thumb:'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=85&w=1920&auto=format&fit=crop' },
  { id:'bg10', name:'Dark Waves',      thumb:'https://images.unsplash.com/photo-1710438399422-2fca27686bcd?q=60&w=320&auto=format&fit=crop&ixlib=rb-4.1.0', full:'https://images.unsplash.com/photo-1710438399422-2fca27686bcd?q=85&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0' },
  // ── Hồ & Biển ──
  { id:'bg13', name:'Vũ trụ xoáy',    thumb:'https://images.pexels.com/photos/33441883/pexels-photo-33441883.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/33441883/pexels-photo-33441883.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg14', name:'Ngân hà đa màu',  thumb:'https://images.pexels.com/photos/3114462/pexels-photo-3114462.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/3114462/pexels-photo-3114462.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg15', name:'Bờ biển đêm',    thumb:'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=85&w=1920&auto=format&fit=crop' },
  { id:'bg16', name:'Thiên hà tím',    thumb:'https://images.pexels.com/photos/3222255/pexels-photo-3222255.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/3222255/pexels-photo-3222255.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  // ── Rừng & Sương ──
  { id:'bg17', name:'Thiên hà xa',    thumb:'https://images.pexels.com/photos/3745234/pexels-photo-3745234.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/3745234/pexels-photo-3745234.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg18', name:'Rừng thông tối', thumb:'https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=85&w=1920&auto=format&fit=crop' },
  { id:'bg19', name:'Dark Abstract',  thumb:'https://images.unsplash.com/photo-1663970206579-c157cba7edda?q=60&w=320&auto=format&fit=crop&ixlib=rb-4.1.0', full:'https://images.unsplash.com/photo-1663970206579-c157cba7edda?q=85&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0' },
  // ── Aurora ──
  { id:'bg20', name:'Aurora Bắc cực', thumb:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=85&w=1920&auto=format&fit=crop' },
  { id:'bg21', name:'Bắc quang xanh', thumb:'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=85&w=1920&auto=format&fit=crop' },
  // ── Dark texture ──
  { id:'bg23', name:'Núi đêm tối',   thumb:'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=85&w=1920&auto=format&fit=crop' },
  { id:'bg24', name:'Hồ đêm tĩnh',  thumb:'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=85&w=1920&auto=format&fit=crop' },
  // ── Abstract & Minimal dark ──
  { id:'bg25', name:'Dark Smoke',     thumb:'https://images.unsplash.com/photo-1557264322-b44d383a2906?q=60&w=320&auto=format&fit=crop&ixlib=rb-4.1.0', full:'https://images.unsplash.com/photo-1557264322-b44d383a2906?q=85&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0' },
  { id:'bg26', name:'Neon Dark',      thumb:'https://images.unsplash.com/photo-1726910133626-9b573eca70ff?q=60&w=320&auto=format&fit=crop&ixlib=rb-4.1.0', full:'https://images.unsplash.com/photo-1726910133626-9b573eca70ff?q=85&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0' },
  { id:'bg27', name:'Deep Navy',      thumb:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=85&w=1920&auto=format&fit=crop' },
  { id:'bg28', name:'Tối giản',       thumb:'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?q=60&w=320&auto=format&fit=crop', full:'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?q=85&w=1920&auto=format&fit=crop' },
  // ── Hoang mạc & Đồng bằng ──
  { id:'bg29', name:'Sao băng',         thumb:'https://images.pexels.com/photos/8390734/pexels-photo-8390734.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/8390734/pexels-photo-8390734.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg31', name:'Tím khói',        thumb:'https://images.pexels.com/photos/31622984/pexels-photo-31622984.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/31622984/pexels-photo-31622984.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  // ── Dark Digital Art (Pexels) ──
  { id:'bg32', name:'Teal vòng tròn',  thumb:'https://images.pexels.com/photos/34270452/pexels-photo-34270452.png?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/34270452/pexels-photo-34270452.png?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg33', name:'Sóng tối',        thumb:'https://images.pexels.com/photos/7505924/pexels-photo-7505924.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/7505924/pexels-photo-7505924.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg34', name:'Ánh sáng số',     thumb:'https://images.pexels.com/photos/14931463/pexels-photo-14931463.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/14931463/pexels-photo-14931463.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg35', name:'Bóng & ánh sáng', thumb:'https://images.pexels.com/photos/28905636/pexels-photo-28905636.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/28905636/pexels-photo-28905636.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg36', name:'Cửa sổ tối',      thumb:'https://images.pexels.com/photos/9203158/pexels-photo-9203158.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/9203158/pexels-photo-9203158.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg37', name:'Xanh huyền bí',   thumb:'https://images.pexels.com/photos/23824371/pexels-photo-23824371.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/23824371/pexels-photo-23824371.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg38', name:'Kết cấu tối',     thumb:'https://images.pexels.com/photos/31103737/pexels-photo-31103737.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/31103737/pexels-photo-31103737.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg39', name:'Khói xanh',         thumb:'https://images.pexels.com/photos/9606966/pexels-photo-9606966.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/9606966/pexels-photo-9606966.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg40', name:'Đa giác tối',     thumb:'https://images.pexels.com/photos/12920871/pexels-photo-12920871.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/12920871/pexels-photo-12920871.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg42', name:'Đồi cát xanh',    thumb:'https://images.pexels.com/photos/8858923/pexels-photo-8858923.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/8858923/pexels-photo-8858923.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg41', name:'Neon khói',         thumb:'https://images.pexels.com/photos/8991553/pexels-photo-8991553.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/8991553/pexels-photo-8991553.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  // ── Dark Minimal bổ sung ──
  { id:'bg46', name:'Vệt sáng xanh',   thumb:'https://images.pexels.com/photos/34144693/pexels-photo-34144693.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/34144693/pexels-photo-34144693.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg48', name:'Bụi vũ trụ',      thumb:'https://images.pexels.com/photos/9665214/pexels-photo-9665214.jpeg?auto=compress&cs=tinysrgb&w=320',  full:'https://images.pexels.com/photos/9665214/pexels-photo-9665214.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  // ── Thiên nhiên ban ngày ──
  { id:'bg51', name:'Khinh khí cầu',   thumb:'https://images.pexels.com/photos/210012/pexels-photo-210012.jpeg?auto=compress&cs=tinysrgb&w=320',   full:'https://images.pexels.com/photos/210012/pexels-photo-210012.jpeg?auto=compress&cs=tinysrgb&w=1920' },
  { id:'bg52', name:'Đồng cỏ hoa đỏ',     thumb:'https://images.pexels.com/photos/12264005/pexels-photo-12264005.jpeg?auto=compress&cs=tinysrgb&w=320', full:'https://images.pexels.com/photos/12264005/pexels-photo-12264005.jpeg?auto=compress&cs=tinysrgb&w=1920' },
]
const selectedBg = ref(bgList.find(b => b.id === 'bg4').full)
const dragging   = ref(null)
const dragOver   = ref(null)

const bdFilter = ref('today')
const bdFilterOpts = [
  { value:'today',    label:'Hôm nay' },
  { value:'tomorrow', label:'Ngày mai' },
  { value:'week',     label:'Tuần này' },
  { value:'month',    label:'Tháng này' },
]
const birthdays = [
  { id:1, name:'Nguyễn Minh Tuấn', avatar:'https://i.pravatar.cc/80?img=52', dept:'Kinh doanh', age:29, color:'#245fdf' },
  { id:2, name:'Trần Thị Hoa',     avatar:'https://i.pravatar.cc/80?img=47', dept:'Kế toán',    age:34, color:'#12b76a' },
  { id:3, name:'Lê Văn Dũng',      avatar:'https://i.pravatar.cc/80?img=65', dept:'Nhân sự',    age:27, color:'#f79009' },
]

const notices = [
  { id:1, text:'Nguyễn Hoàng Long vừa được tiếp nhận vào phòng Kinh doanh', time:'8 phút trước',  avatar:'https://i.pravatar.cc/80?img=59', color:'#245fdf' },
  { id:2, text:'Trần Thị Mai được khen thưởng nhân viên xuất sắc tháng 6',  time:'2 giờ trước',   avatar:'https://i.pravatar.cc/80?img=45', color:'#f79009' },
  { id:3, text:'Phạm Văn Bình vừa chào đón thành viên mới trong gia đình',  time:'Hôm qua',       avatar:'https://i.pravatar.cc/80?img=62', color:'#12b76a' },
  { id:4, text:'Lê Thị Lan hoàn thành chương trình đào tạo nội bộ Q2',      time:'2 ngày trước',  avatar:'https://i.pravatar.cc/80?img=44', color:'#7a5af8' },
]

const topSales = [
  { id:1, name:'Nguyễn Văn An',   avatar:'https://i.pravatar.cc/80?img=55', amount:'4,85 tỷ', pct:100, color:'#245fdf' },
  { id:2, name:'Trần Bích Ngọc',  avatar:'https://i.pravatar.cc/80?img=49', amount:'3,92 tỷ', pct:81,  color:'#12b76a' },
  { id:3, name:'Lê Minh Khôi',    avatar:'https://i.pravatar.cc/80?img=64', amount:'3,40 tỷ', pct:70,  color:'#7a5af8' },
  { id:4, name:'Phạm Thị Thanh',  avatar:'https://i.pravatar.cc/80?img=48', amount:'2,88 tỷ', pct:59,  color:'#f79009' },
]

const quickLinks = [
  { id:1, name:'Quy chế lương thưởng',  icon:'file-text',   url:'#', color:'#245fdf' },
  { id:2, name:'Bảng chấm công tháng',  icon:'calendar',    url:'#', color:'#12b76a' },
  { id:3, name:'Biểu mẫu đề xuất chi',  icon:'file-invoice',url:'#', color:'#f79009' },
  { id:4, name:'Danh bạ nhân viên',     icon:'users',       url:'#', color:'#7a5af8' },
  { id:5, name:'Báo cáo doanh thu Q2',  icon:'chart-bar',   url:'#', color:'#f04438' },
  { id:6, name:'Tài liệu đào tạo',      icon:'book',        url:'#', color:'#0ba5ec' },
]
/* ── Rside drag-and-drop ── */
const quickActions = [
  { id:'qa1', name:'Quy trình',  icon:'sitemap',        color:'#7a5af8', badge:0  },
  { id:'qa2', name:'Mail',       icon:'mail',           color:'#245fdf', badge:3, darkColor:'#7aadff' },
  { id:'qa3', name:'Lịch họp',  icon:'calendar',       color:'#12b76a', badge:2  },
  { id:'qa4', name:'Công việc',  icon:'clipboard-list', color:'#f79009', badge:5  },
  { id:'qa5', name:'Lập đơn',   icon:'file-invoice',   color:'#0ba5ec', badge:0  },
  { id:'qa6', name:'Đánh giá',  icon:'star',           color:'#f04438', badge:0  },
]
/* ── Grid row size — 24-col, ô vuông: rowH = colW ── */
const GRID_COLS = 24
const GRID_GAP  = 20
const gridRowH  = ref(40)
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

/* ── Edit mode ── */
let _widgetsSnap = []
async function startEdit() {
  _widgetsSnap = widgets.value.map(w => ({ ...w }))
  await nextTick()
  // Assign explicit positions BEFORE entering edit mode — no layout jump
  assignExplicitPositions()
  isEditing.value = true
}
function saveEdit()  { isEditing.value = false }
function cancelEdit() {
  widgets.value   = _widgetsSnap
  isEditing.value = false
}

function assignExplicitPositions() {
  const gridEl = wgridEl.value
  if (!gridEl) return
  const gridRect = gridEl.getBoundingClientRect()
  const GAP = GRID_GAP, ROW_H = gridRowH.value
  const cellW = (gridRect.width - GAP * (GRID_COLS - 1)) / GRID_COLS
  const cardEls = [...gridEl.querySelectorAll('.wcard:not(.wcard--ghost)')]
  widgets.value.forEach((w, idx) => {
    if (w.colStart && w.rowStart) return
    const el = cardEls[idx]
    if (!el) return
    const rect = el.getBoundingClientRect()
    const relX = rect.left - gridRect.left
    const relY = rect.top - gridRect.top
    w.colStart = Math.max(1, Math.round(relX / (cellW + GAP)) + 1)
    w.rowStart = Math.max(1, Math.round(relY / (ROW_H + GAP)) + 1)
  })
}

const mainEl       = ref(null)
const wgridEl      = ref(null)
const dockScrollEl = ref(null)
const activeApp    = ref(null)
const resizing     = ref(null)
const freshWidgets = ref(new Set())

watch(isDark, v => document.documentElement.classList.toggle('amis-dark-root', v))

/* ── Date / Time ── */
const now = new Date()
const dateStr = now.toLocaleDateString('vi-VN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
const h = now.getHours()
const greetText = h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'

/* ── Weather (static simulation, Hà Nội) ── */
const weather = computed(() => {
  const hr = new Date().getHours()
  if (hr < 5)  return { temp:24, feel:22, humidity:80, cond:'Trời tối',   icon:'moon',    color:'#7a5af8' }
  if (hr < 9)  return { temp:28, feel:29, humidity:74, cond:'Nắng nhẹ',   icon:'sun',     color:'#ffaa00' }
  if (hr < 12) return { temp:33, feel:36, humidity:65, cond:'Nắng nóng',  icon:'sun',     color:'#ff8800' }
  if (hr < 14) return { temp:36, feel:40, humidity:60, cond:'Rất nóng',   icon:'sun',     color:'#ff6600' }
  if (hr < 17) return { temp:34, feel:37, humidity:63, cond:'Nắng',       icon:'sun',     color:'#ffaa00' }
  if (hr < 19) return { temp:30, feel:32, humidity:70, cond:'Mát dần',    icon:'droplet', color:'#0ba5ec' }
  if (hr < 22) return { temp:27, feel:28, humidity:76, cond:'Mát mẻ',     icon:'moon',    color:'#7a5af8' }
  return               { temp:25, feel:25, humidity:80, cond:'Trời mát',   icon:'moon',    color:'#7a5af8' }
})
const dateTimeStr = computed(() => {
  const d = new Date()
  const dow = d.toLocaleDateString('vi-VN', { weekday:'short' })
  const day = d.getDate(), month = d.getMonth()+1
  const hh = d.getHours().toString().padStart(2,'0')
  const mm = d.getMinutes().toString().padStart(2,'0')
  const period = d.getHours() < 12 ? 'SA' : 'CH'
  return `${dow}, ${day} thg ${month}  ·  ${hh}:${mm} ${period}`
})

const IC = 'https://amis.misa.vn/sites/menu/images'
/* ── Apps (toàn nền tảng MISA AMIS) ── */
const apps = [
  // Kế toán
  { id:'ketoan',      name:'Kế toán',        route:'/ketoan-dashboard', icon:'calculator',       g:['#1252cc','#4285f4'], logo:`${IC}/ic-ke-toan.svg`,             dock:true },
  { id:'ketoan-hkd',  name:'Kế toán HKD',    route:null, icon:'book',                g:['#065f46','#059669'], logo:`${IC}/ic-ke-toan-hkd.svg` },
  { id:'ketoan-htx',  name:'Kế toán HTX',    route:null, icon:'building-community',  g:['#0e7490','#2dd4bf'], logo:`${IC}/ic-ke-toan-htx.svg` },
  { id:'misa-sme',    name:'MISA SME',        route:null, icon:'briefcase',           g:['#92400e','#f59e0b'], logo:`${IC}/ic-misa-sme.svg` },
  { id:'hddt',        name:'Hóa đơn ĐT',     route:null, icon:'file-invoice',        g:['#1d4ed8','#60a5fa'], logo:`${IC}/ic-hoa-don-dien-tu.svg`,      dock:true },
  { id:'cks',         name:'Chữ ký số',      route:null, icon:'file-certificate',    g:['#5b21b6','#8b5cf6'], logo:`${IC}/ic-chu-ky-so.svg` },
  { id:'thue-dt',     name:'Thuế điện tử',   route:null, icon:'file-analytics',      g:['#1e3a5f','#2563eb'], logo:`${IC}/ic-thue-dien-tu.svg` },
  { id:'nhdt',        name:'Ngân hàng ĐT',   route:null, icon:'building-bank',       g:['#0e4e8a','#0ea5e9'], logo:`${IC}/ic-ngan-hang-dien-tu.svg`,    dock:true },
  // Marketing & Bán hàng
  { id:'aimarketing', name:'aiMarketing',     route:null, icon:'sparkles',            g:['#c2410c','#fb923c'], logo:`${IC}/ic-aimarketing.svg`,          dock:true },
  { id:'crm',         name:'CRM',            route:null, icon:'users',               g:['#0f766e','#14b8a6'], logo:`${IC}/ic-crm.svg`,                  dock:true },
  { id:'khuyenmai',   name:'Khuyến mại',     route:null, icon:'star',                g:['#b45309','#f97316'], logo:`${IC}/ic-khuyen-mai.svg` },
  { id:'cuahang',     name:'Cửa hàng',       route:null, icon:'shopping-cart',       g:['#9d174d','#ec4899'], logo:`${IC}/ic-cua-hang.svg` },
  { id:'nhahang',     name:'Nhà hàng',       route:null, icon:'building',            g:['#4c1d95','#a78bfa'], logo:`${IC}/ic-nha-hang.svg` },
  { id:'muahang',     name:'Mua hàng',       route:null, icon:'package',             g:['#9a3412','#fb923c'], logo:`${IC}/ic-mua-hang.svg` },
  { id:'banhang',     name:'Bán hàng',       route:'/ban-hang', icon:'chart-bar',   g:['#c2430a','#fbbf24'] },
  // Nhân sự & HRM
  { id:'tuyendung',   name:'Tuyển dụng',     route:null, icon:'user-plus',           g:['#1e40af','#3b82f6'], logo:`${IC}/ic-tuyen-dung.svg` },
  { id:'hr',          name:'Thông tin nhân sự', route:null, icon:'users-group',      g:['#0f766e','#14b8a6'], logo:`${IC}/ic-thong-tin-nhan-su.svg`, dock:true },
  { id:'muctieu',     name:'Mục tiêu',       route:null, icon:'trending-up',         g:['#0e7490','#22d3ee'], logo:`${IC}/ic-muc-tieu.svg` },
  { id:'danhgia',     name:'Đánh giá',       route:null, icon:'award',               g:['#92400e','#fbbf24'], logo:`${IC}/ic-danh-gia.svg` },
  { id:'chamcong',    name:'Chấm công',      route:null, icon:'clock',               g:['#0b7a72','#2dd4bf'], logo:`${IC}/ic-cham-cong.svg`,            dock:true },
  { id:'luong',       name:'Tiền lương',     route:null, icon:'cash',                g:['#057a4a','#10b981'], logo:`${IC}/ic-tien-luong.svg`,           dock:true },
  { id:'bhxh',        name:'Bảo hiểm XH',   route:null, icon:'heart-handshake',     g:['#065f46','#34d399'] },
  { id:'nhansu',      name:'Nhân sự',        route:null, icon:'user-circle',         g:['#be185d','#f472b6'] },
  // AI & Nền tảng
  { id:'oneai',       name:'OneAI',          route:null, icon:'cpu',                 g:['#3730a3','#818cf8'], logo:`${IC}/ic-oneai.svg`,                dock:true },
  { id:'agentwork',   name:'Agentwork',      route:null, icon:'sparkle',             g:['#6b21a8','#d946ef'] },
  // Vận hành & Nội bộ
  { id:'congviec',    name:'Công việc',      route:null, icon:'clipboard-list',      g:['#1d4ed8','#60a5fa'], logo:`${IC}/ic-cong-viec.svg`,            dock:true },
  { id:'quytrinh',    name:'Quy trình',      route:null, icon:'sitemap',             g:['#0f766e','#10b981'], logo:`${IC}/ic-quy-trinh.svg`,            dock:true },
  { id:'hopdong',     name:'Hợp đồng điện tử', route:null, icon:'file-text',         g:['#5b21b6','#a855f7'], logo:`${IC}/ic-hop-dong-dien-tu.svg`,  dock:true },
  { id:'ghichep',     name:'Ghi chép',       route:null, icon:'book',                g:['#92400e','#f59e0b'], logo:`${IC}/ic-ghi-chep.svg` },
  { id:'vanthu',      name:'Văn thư',        route:null, icon:'mail',                g:['#c2410c','#f97316'], logo:`${IC}/ic-van-thu.svg` },
  { id:'taisan',      name:'Tài sản',        route:null, icon:'building-warehouse',  g:['#92400e','#fbbf24'], logo:`${IC}/ic-tai-san.svg` },
  { id:'kho',         name:'Kho hàng',       route:null, icon:'building-warehouse',  g:['#1e40af','#6366f1'], logo:`${IC}/ic-kho-hang.svg` },
  { id:'sanxuat',     name:'Sản xuất',       route:null, icon:'building-factory',    g:['#065f46','#10b981'], logo:`${IC}/ic-san-xuat.svg` },
  { id:'mxh',         name:'Mạng xã hội',   route:null, icon:'message-circle',      g:['#1d4ed8','#60a5fa'], logo:`${IC}/ic-mang-xa-hoi.svg` },
  { id:'chat',        name:'Chat',           route:null, icon:'message-circle',      g:['#1d4ed8','#60a5fa'], logo:`${IC}/ic-chat.svg` },
  { id:'phonghop',    name:'Phòng họp',      route:null, icon:'calendar',            g:['#0f766e','#10b981'], logo:`${IC}/ic-phong-hop.svg` },
]
const dockApps = computed(() => apps.filter(a => a.dock))

function openApp(app) {
  activeApp.value = app.id
  if (app.route) router.push(app.route)
}

/* ── Dock liquid magnification — pure JS lerp, không dùng CSS transition ── */
const DOCK_BASE_W  = 54
const DOCK_MAX_W   = 90
const DOCK_BASE_S  = 1          // icon scale base
const DOCK_MAX_S   = 1.60       // icon scale peak
const DOCK_RADIUS  = 140        // influence radius px
const DOCK_LERP    = 0.13       // smoothing (thấp = chậm/mượt hơn)

const _dock = {
  raf:   null,
  items: [],   // { chip, logo, cW, tW, cS, tS, cL, tL }
}

function _dockInit() {
  const chips = dockScrollEl.value?.querySelectorAll('.app-chip')
  if (!chips?.length) return
  if (_dock.items.length === chips.length) return   // already init
  _dock.items = Array.from(chips).map(chip => ({
    chip,
    logo: chip.querySelector('.app-chip__logo'),
    cW: DOCK_BASE_W, tW: DOCK_BASE_W,
    cS: DOCK_BASE_S, tS: DOCK_BASE_S,
    cL: 0,           tL: 0,
  }))
}

function _dockTick() {
  let live = false
  _dock.items.forEach(d => {
    d.cW += (d.tW - d.cW) * DOCK_LERP
    d.cS += (d.tS - d.cS) * DOCK_LERP
    d.cL += (d.tL - d.cL) * DOCK_LERP

    d.chip.style.width     = `${d.cW}px`
    d.chip.style.transform = `translateY(${d.cL}px)`
    if (d.logo) d.logo.style.transform = `scale(${d.cS})`

    if (
      Math.abs(d.cW - d.tW) > 0.06 ||
      Math.abs(d.cS - d.tS) > 0.002 ||
      Math.abs(d.cL - d.tL) > 0.06
    ) live = true
  })
  _dock.raf = live ? requestAnimationFrame(_dockTick) : null
}

function _dockStart() {
  if (!_dock.raf) _dock.raf = requestAnimationFrame(_dockTick)
}

function onDockMove(e) {
  _dockInit()
  const mx = e.clientX
  _dock.items.forEach(d => {
    const r    = d.chip.getBoundingClientRect()
    const dist = Math.abs(mx - (r.left + r.width / 2))
    const t    = Math.max(0, 1 - dist / DOCK_RADIUS) ** 1.5
    d.tW = DOCK_BASE_W + t * (DOCK_MAX_W - DOCK_BASE_W)
    d.tS = DOCK_BASE_S + t * (DOCK_MAX_S - DOCK_BASE_S)
    d.tL = -(t * 18)
  })
  _dockStart()
}

function onDockLeave() {
  _dock.items.forEach(d => { d.tW = DOCK_BASE_W; d.tS = DOCK_BASE_S; d.tL = 0 })
  _dockStart()
}

/* ── Widgets ── */
const widgets = ref([
  /* ── 24-col, ô vuông ~37px: KPI rowSpan:4 → ~210px, chart/list rowSpan:6 → ~325px ── */
  { id:'kpi-revenue',    type:'kpi', colSpan:6, rowSpan:3, title:'Doanh thu tháng 6', source:'Kế toán',  icon:'trending-up',   color:'#0e9a62', period:'T6/2026',
    data:{ value:'4.85', unit:'tỷ',     trend:'+12.4%', up:true,  spark:[3.2,3.8,4.1,3.9,4.4,4.85] } },
  { id:'kpi-receivable', type:'kpi', colSpan:6, rowSpan:3, title:'Công nợ phải thu',  source:'Kế toán',  icon:'coin',          color:'#f79009', period:'T6/2026',
    data:{ value:'1.23', unit:'tỷ',     trend:'-8.2%',  up:false, spark:[1.8,1.6,1.4,1.5,1.3,1.23] } },
  { id:'kpi-employees',  type:'kpi', colSpan:6, rowSpan:3, title:'Nhân viên',         source:'Nhân sự',  icon:'users',         color:'#245fdf', period:'Hiện tại',
    data:{ value:'142',  unit:'người',  trend:'+5',     up:true,  spark:[130,133,135,138,140,142] } },
  { id:'kpi-orders',     type:'kpi', colSpan:6, rowSpan:3, title:'Đơn hàng mới',      source:'Bán hàng', icon:'shopping-cart', color:'#7a5af8', period:'Hôm nay',
    data:{ value:'38',   unit:'đơn',    trend:'+6',     up:true,  spark:[20,25,28,22,32,38] } },
  /* ── Left area auto-placed từ hàng 5, rowSpan:6 → ~325px ── */
  { id:'chart-revenue',   type:'chart-line',     colSpan:12, rowSpan:6, title:'Doanh thu theo tháng',   source:'Kế toán',  icon:'chart-line',    color:'#0e9a62', period:'6T/2026', data:{} },
  { id:'chart-breakdown', type:'chart-donut',    colSpan:6,  rowSpan:6, title:'Cơ cấu doanh thu',       source:'Kế toán',  icon:'chart-donut',   color:'#245fdf', period:'T6/2026', data:{} },
  { id:'chart-bar-rev',   type:'chart-bar',      colSpan:10, rowSpan:6, title:'Doanh thu vs Chi phí',   source:'Kế toán',  icon:'chart-bar',     color:'#245fdf', period:'6T/2026', data:{} },
  { id:'chart-cashflow',  type:'chart-cashflow', colSpan:8,  rowSpan:6, title:'Dòng tiền Thu – Chi',    source:'Kế toán',  icon:'trending-up',   color:'#0e9a62', period:'6T/2026', data:{} },
  { id:'list-tx',         type:'list-tx',        colSpan:12, rowSpan:6, title:'Giao dịch gần đây',      source:'Kế toán',  icon:'file-invoice',  color:'#0e9a62',
    data:{ items:[
      { id:1, name:'Thu tiền hàng – Công ty ABC', amount:'+125.000.000', type:'thu', date:'23/06', status:'done' },
      { id:2, name:'Chi phí vận chuyển Q2/2026',  amount:'-8.500.000',   type:'chi', date:'23/06', status:'done' },
      { id:3, name:'Bán hàng BH00521 – TGDD',     amount:'+285.000.000', type:'thu', date:'22/06', status:'pending' },
      { id:4, name:'Nộp thuế GTGT T5/2026',       amount:'-43.200.000',  type:'chi', date:'22/06', status:'done' },
      { id:5, name:'Thu tiền hàng – Cty XYZ',     amount:'+92.000.000',  type:'thu', date:'21/06', status:'done' },
    ]}},
  { id:'list-tasks',      type:'list-tasks',     colSpan:6,  rowSpan:6, title:'Công việc hôm nay',      source:'Công việc', icon:'clipboard-list', color:'#7a5af8', customHd:false,
    data:{ items:[
      { id:1, title:'Lập báo cáo tài chính T6',    done:false, priority:'high',   time:'09:00' },
      { id:2, title:'Phê duyệt phiếu chi đợt 2',   done:true,  priority:'medium', time:'10:30' },
      { id:3, title:'Họp tổng kết quý II/2026',    done:false, priority:'high',   time:'14:00' },
      { id:4, title:'Kiểm tra công nợ khách hàng', done:false, priority:'low',    time:'15:30' },
      { id:5, title:'Nộp báo cáo thuế GTGT',       done:false, priority:'high',   time:'17:00' },
    ]}},
  /* ── Right column cols 19–24, rowSpan:6, aligned with left rows ── */
  { id:'quick-actions', type:'quick-actions', colSpan:6, rowSpan:6, colStart:19, rowStart:4,  title:'Thao tác nhanh', source:'AMIS', icon:'sparkles', color:'#f79009', showSrc:false, data:{} },
  { id:'birthdays',     type:'birthdays',     colSpan:6, rowSpan:6, colStart:19, rowStart:10, title:'Sinh nhật',      source:'AMIS', icon:'gift',     color:'#f79009', showSrc:false, data:{} },
  { id:'notices',       type:'notices',       colSpan:6, rowSpan:6, colStart:19, rowStart:16, title:'Thông báo',      source:'AMIS', icon:'bell',     color:'#245fdf', showSrc:false, data:{} },
  { id:'top-sales',     type:'top-sales',     colSpan:6, rowSpan:6, colStart:19, rowStart:22, title:'Top bán hàng',   source:'AMIS', icon:'award',    color:'#12b76a', showSrc:false, data:{} },
  { id:'quick-links',   type:'quick-links',   colSpan:6, rowSpan:6, colStart:19, rowStart:28, title:'Liên kết nhanh', source:'AMIS', icon:'link',     color:'#7a5af8', showSrc:false, data:{} },
])

const catalog = [
  { id:'kpi-revenue',    type:'kpi',        colSpan:6,  rowSpan:3, title:'Doanh thu tháng',    source:'Kế toán',  icon:'trending-up',  color:'#0e9a62', size:'Nhỏ',  data:{ value:'4.85', unit:'tỷ', trend:'+12.4%', up:true,  spark:[3.2,3.8,4.1,3.9,4.4,4.85] } },
  { id:'kpi-receivable', type:'kpi',        colSpan:6,  rowSpan:3, title:'Công nợ phải thu',   source:'Kế toán',  icon:'coin',         color:'#f79009', size:'Nhỏ',  data:{ value:'1.23', unit:'tỷ', trend:'-8.2%', up:false, spark:[1.8,1.6,1.4,1.5,1.3,1.23] } },
  { id:'kpi-employees',  type:'kpi',        colSpan:6,  rowSpan:3, title:'Nhân viên',          source:'Nhân sự',  icon:'users',        color:'#245fdf', size:'Nhỏ',  data:{ value:'142', unit:'người', trend:'+5', up:true, spark:[130,133,135,138,140,142] } },
  { id:'kpi-orders',     type:'kpi',        colSpan:6,  rowSpan:3, title:'Đơn hàng mới',       source:'Bán hàng', icon:'shopping-cart',color:'#7a5af8', size:'Nhỏ',  data:{ value:'38', unit:'đơn', trend:'+6', up:true, spark:[20,25,28,22,32,38] } },
  { id:'chart-revenue',  type:'chart-line', colSpan:12, rowSpan:6, title:'Doanh thu theo tháng', source:'Kế toán', icon:'chart-line',  color:'#0e9a62', size:'Lớn', data:{} },
  { id:'chart-breakdown',type:'chart-donut',colSpan:6,  rowSpan:6, title:'Cơ cấu doanh thu',   source:'Kế toán',  icon:'chart-donut',  color:'#245fdf', size:'Vừa', data:{} },
  { id:'list-tx',        type:'list-tx',    colSpan:12, rowSpan:6, title:'Giao dịch gần đây',  source:'Kế toán',  icon:'file-invoice', color:'#0e9a62', size:'Lớn', data:{items:[]} },
  { id:'list-tasks',     type:'list-tasks', colSpan:6,  rowSpan:6, title:'Công việc hôm nay',  source:'Công việc',icon:'clipboard-list',color:'#7a5af8', size:'Vừa', data:{items:[]} },
  { id:'kpi-cost',       type:'kpi',        colSpan:6,  rowSpan:3, title:'Tổng chi phí',       source:'Kế toán',  icon:'cash',         color:'#dc2626', size:'Nhỏ', data:{ value:'2.1', unit:'tỷ', trend:'+3.2%', up:false, spark:[1.8,1.9,2.0,2.1,2.0,2.1] } },
  { id:'kpi-profit',     type:'kpi',        colSpan:6,  rowSpan:3, title:'Lợi nhuận',          source:'Kế toán',  icon:'trending-up',  color:'#0e9a62', size:'Nhỏ', data:{ value:'2.75', unit:'tỷ', trend:'+18%', up:true, spark:[1.5,1.8,2.0,1.9,2.3,2.75] } },
  { id:'kpi-margin',     type:'kpi',        colSpan:6,  rowSpan:3, title:'Biên lợi nhuận',     source:'Kế toán',  icon:'chart-line',   color:'#7a5af8', size:'Nhỏ', data:{ value:'36.5', unit:'%', trend:'+2.1%', up:true, spark:[32,33,34,35,36,36.5] } },
  { id:'kpi-cashflow',   type:'kpi',        colSpan:6,  rowSpan:3, title:'Dòng tiền ròng',     source:'Kế toán',  icon:'wallet',       color:'#0ba5ec', size:'Nhỏ', data:{ value:'2.1', unit:'tỷ', trend:'+5.3%', up:true, spark:[1.5,1.7,1.9,2.0,2.0,2.1] } },
  { id:'kpi-ar-overdue', type:'kpi',        colSpan:6,  rowSpan:3, title:'Công nợ quá hạn',   source:'Kế toán',  icon:'alert-triangle',color:'#f04438',size:'Nhỏ', data:{ value:'0.42', unit:'tỷ', trend:'-12%', up:true, spark:[0.8,0.7,0.65,0.55,0.48,0.42] } },
  { id:'chart-bar-rev',  type:'chart-bar',  colSpan:12, rowSpan:6, title:'Doanh thu vs Chi phí',source:'Kế toán', icon:'chart-bar',    color:'#245fdf', size:'Lớn', data:{} },
  { id:'chart-cashflow', type:'chart-cashflow',colSpan:12,rowSpan:6,title:'Dòng tiền Thu – Chi',source:'Kế toán', icon:'trending-up',  color:'#0e9a62', size:'Lớn', data:{} },
]

function toggleWidget(cat) {
  const idx = widgets.value.findIndex(w => w.id === cat.id)
  if (idx >= 0) {
    const inst = chartInstances[cat.id]
    if (inst) { inst.dispose(); delete chartInstances[cat.id] }
    widgets.value.splice(idx, 1)
  } else {
    widgets.value.push({ ...cat, data: cat.data ? JSON.parse(JSON.stringify(cat.data)) : {} })
    freshWidgets.value = new Set([...freshWidgets.value, cat.id])
    setTimeout(() => {
      freshWidgets.value = new Set([...freshWidgets.value].filter(id => id !== cat.id))
    }, 700)
    nextTick(() => initCharts())
  }
}

function removeWidget(id) {
  const idx = widgets.value.findIndex(w => w.id === id)
  if (idx >= 0) {
    const inst = chartInstances[id]
    if (inst) { inst.dispose(); delete chartInstances[id] }
    widgets.value.splice(idx, 1)
  }
}

/* ── Drag & drop ── */
const dropPreview = ref(null)
let dragOffsetPx = { x: 0, y: 0 }

const editGridCells = computed(() => {
  if (!isEditing.value) return []
  const maxRow = widgets.value.reduce((m, w) => Math.max(m, (w.rowStart || 1) + (w.rowSpan || 1) - 1), 8)
  const rows = maxRow + 3
  const cells = []
  for (let r = 1; r <= rows; r++)
    for (let c = 1; c <= GRID_COLS; c++)
      cells.push({ col: c, row: r })
  return cells
})

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
  const GAP = GRID_GAP, ROW_H = gridRowH.value
  const cellW = (gridRect.width - GAP * (GRID_COLS - 1)) / GRID_COLS
  const relX = e.clientX - gridRect.left - dragOffsetPx.x
  const relY = e.clientY - gridRect.top - dragOffsetPx.y
  const colStart = Math.max(1, Math.min(GRID_COLS - draggedW.colSpan + 1, Math.floor(relX / (cellW + GAP)) + 1))
  const rowStart = Math.max(1, Math.floor(relY / (ROW_H + GAP)) + 1)
  if (!dropPreview.value || dropPreview.value.colStart !== colStart || dropPreview.value.rowStart !== rowStart) {
    dropPreview.value = { colStart, rowStart, colSpan: draggedW.colSpan, rowSpan: draggedW.rowSpan }
  }
}

function pushOverlapping(movedId) {
  const COLS = GRID_COLS
  function overlaps(a, b) {
    if (a.id === b.id) return false
    return a.colStart <= b.colStart + b.colSpan - 1 &&
           a.colStart + a.colSpan - 1 >= b.colStart &&
           a.rowStart <= b.rowStart + b.rowSpan - 1 &&
           a.rowStart + a.rowSpan - 1 >= b.rowStart
  }
  for (let pass = 0; pass < 30; pass++) {
    let anyMoved = false
    for (const w of widgets.value) {
      if (w.id === movedId) continue
      const conflict = widgets.value.find(other => overlaps(w, other))
      if (!conflict) continue
      anyMoved = true
      const newColStart = conflict.colStart + conflict.colSpan
      if (newColStart + w.colSpan - 1 <= COLS) {
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

function onWgridDrop(e) {
  e.preventDefault()
  if (!dragging.value || !dropPreview.value) return
  const id = dragging.value
  const widget = widgets.value.find(w => w.id === id)
  if (widget) {
    widget.colStart = dropPreview.value.colStart
    widget.rowStart = dropPreview.value.rowStart
    pushOverlapping(id)
  }
  dragging.value = null
  dragOver.value = null
  dropPreview.value = null
  nextTick(() => resizeCharts())
}

function onDragEnd() { dragging.value = null; dragOver.value = null; dropPreview.value = null }

/* ── Resize ── */
function startResize(e, widgetId) {
  e.preventDefault()
  e.stopPropagation()
  const widget = widgets.value.find(w => w.id === widgetId)
  if (!widget) return
  const gridEl = wgridEl.value
  if (!gridEl) return

  resizing.value = widgetId
  const gridRect = gridEl.getBoundingClientRect()
  const GAP  = GRID_GAP
  const ROW_H = gridRowH.value
  const cellW = (gridRect.width - GAP * (GRID_COLS - 1)) / GRID_COLS
  const cellH = ROW_H + GAP

  const startX      = e.clientX
  const startY      = e.clientY
  const startColSpan = widget.colSpan
  const startRowSpan = widget.rowSpan

  function onMove(ev) {
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    const maxCS = GRID_COLS - (widget.colStart || 1) + 1
    widget.colSpan = Math.max(3, Math.min(maxCS, startColSpan + Math.round(dx / cellW)))
    widget.rowSpan = Math.max(1, Math.min(12, startRowSpan + Math.round(dy / cellH)))
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

/* ── Sparklines ── */
function sparkLine(data) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  return data.map((v,i) => `${(i/(data.length-1))*100},${36-((v-min)/range)*30+3}`).join(' ')
}
function sparkArea(data) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v,i) => [(i/(data.length-1))*100, 36-((v-min)/range)*30+3])
  return `M0,36 L${pts[0].join(',')} ${pts.slice(1).map(([x,y]) => `L${x},${y}`).join(' ')} L100,36 Z`
}

/* ── ECharts ── */
const chartEls = {}
const chartInstances = {}

function setChartEl(el, id) { if (el) chartEls[id] = el }

function getChartOpt(w) {
  const dark = isDark.value
  const tc   = dark ? 'rgba(255,255,255,0.55)' : '#6b707a'
  const gc   = dark ? 'rgba(255,255,255,0.08)' : '#e9eaeb'
  const font = 'InterVariable, "Inter var", sans-serif'
  const tooltip = {
    backgroundColor: dark ? 'rgba(20,16,32,0.92)' : '#fff',
    borderColor:     dark ? 'rgba(255,255,255,0.15)' : '#e9eaeb',
    textStyle: { color: dark ? '#ffffff' : '#10141b', fontFamily: font, fontSize: 12 },
  }
  const lc = dark ? '#ffffff' : '#383c40'
  const LG = (x1,y1,x2,y2,...stops) => new echarts.graphic.LinearGradient(x1,y1,x2,y2, stops.map(([o,c])=>({offset:o,color:c})))

  // Gradient palettes
  const G_MINT  = LG(0,0,0,1, [0,'#34d399'],[1,'#06b6d4'])   // teal→cyan
  const G_ROSE  = LG(0,0,0,1, [0,'#fb7185'],[1,'#f97316'])   // rose→orange
  const G_SKY   = LG(0,0,0,1, [0,'#60a5fa'],[1,'#818cf8'])   // blue→violet
  const G_LAVEN = LG(0,0,0,1, [0,'#c084fc'],[1,'#a78bfa'])   // purple→violet
  const G_AMBER = LG(0,0,0,1, [0,'#fbbf24'],[1,'#f97316'])   // amber→orange
  // Flat endpoint colors (for dots/legend)
  const C_MINT  = '#2dd4bf'
  const C_ROSE  = '#f87171'
  const C_SKY   = '#60a5fa'
  const C_LAVEN = '#a78bfa'
  const C_AMBER = '#fbbf24'

  if (w.type === 'chart-line') return {
    backgroundColor: 'transparent',
    grid: { top:36, right:16, bottom:36, left:64 },
    xAxis: {
      type:'category', data:['T1','T2','T3','T4','T5','T6'],
      axisLine:{ show:false }, axisTick:{ show:false },
      axisLabel:{ color:tc, fontFamily:font, fontSize:12 }, splitLine:{ show:false },
    },
    yAxis: {
      type:'value',
      axisLabel:{ color:tc, fontFamily:font, fontSize:12, formatter: v => (v/1e9).toFixed(1)+'T' },
      splitLine:{ lineStyle:{ color:gc } }, axisLine:{ show:false }, axisTick:{ show:false },
    },
    series:[{
      type:'line', data:[3200000000,3800000000,4100000000,3900000000,4400000000,4850000000],
      smooth:0.4,
      lineStyle:{ width:2.5, color: LG(0,0,1,0,[0,'#60a5fa'],[1,'#2dd4bf']) },
      itemStyle:{ color:C_MINT },
      symbol:'circle', symbolSize:7, emphasis:{ focus:'series' },
      label:{ show:true, position:'top', fontFamily:font, fontSize:11, fontWeight:700, color:lc, formatter: p => (p.value/1e9).toFixed(2)+'T' },
      areaStyle:{ color: LG(0,0,0,1,[0,'rgba(96,165,250,0.28)'],[1,'rgba(45,212,191,0)']) },
    }],
    tooltip:{ ...tooltip, trigger:'axis', formatter: p => `${p[0].name}<br/><b>${(p[0].value/1e9).toFixed(2)} tỷ</b>` },
  }
  if (w.type === 'chart-bar') return {
    backgroundColor: 'transparent',
    grid: { top:40, right:16, bottom:36, left:64 },
    legend:{ top:8, right:16, textStyle:{ color:tc, fontFamily:font, fontSize:12 }, itemWidth:10, itemHeight:10, itemGap:14 },
    xAxis: {
      type:'category', data:['T1','T2','T3','T4','T5','T6'],
      axisLine:{ show:false }, axisTick:{ show:false },
      axisLabel:{ color:tc, fontFamily:font, fontSize:12 }, splitLine:{ show:false },
    },
    yAxis: {
      type:'value',
      axisLabel:{ color:tc, fontFamily:font, fontSize:12, formatter: v => (v/1e9).toFixed(1)+'T' },
      splitLine:{ lineStyle:{ color:gc } }, axisLine:{ show:false }, axisTick:{ show:false },
    },
    series:[
      { name:'Doanh thu', type:'bar', barWidth:'28%',
        data:[3200000000,3800000000,4100000000,3900000000,4400000000,4850000000],
        itemStyle:{ color:G_MINT, borderRadius:[4,4,0,0] },
        label:{ show:true, position:'top', fontFamily:font, fontSize:10, fontWeight:700, color:lc, formatter: p => (p.value/1e9).toFixed(1)+'T' },
      },
      { name:'Chi phí', type:'bar', barWidth:'28%',
        data:[2100000000,2300000000,2600000000,2400000000,2700000000,2950000000],
        itemStyle:{ color:G_ROSE, borderRadius:[4,4,0,0] },
        label:{ show:true, position:'top', fontFamily:font, fontSize:10, fontWeight:700, color:lc, formatter: p => (p.value/1e9).toFixed(1)+'T' },
      },
    ],
    tooltip:{ ...tooltip, trigger:'axis', formatter: p => `${p[0].axisValue}<br/>` + p.map(s=>`${s.seriesName}: <b>${(s.value/1e9).toFixed(2)} tỷ</b>`).join('<br/>') },
  }
  if (w.type === 'chart-cashflow') return {
    backgroundColor: 'transparent',
    grid: { top:40, right:16, bottom:36, left:64 },
    legend:{ top:8, right:16, textStyle:{ color:tc, fontFamily:font, fontSize:12 }, itemWidth:10, itemHeight:10, itemGap:14 },
    xAxis: {
      type:'category', data:['T1','T2','T3','T4','T5','T6'],
      axisLine:{ show:false }, axisTick:{ show:false },
      axisLabel:{ color:tc, fontFamily:font, fontSize:12 }, splitLine:{ show:false },
    },
    yAxis: {
      type:'value',
      axisLabel:{ color:tc, fontFamily:font, fontSize:12, formatter: v => (v/1e9).toFixed(1)+'T' },
      splitLine:{ lineStyle:{ color:gc } }, axisLine:{ show:false }, axisTick:{ show:false },
    },
    series:[
      { name:'Thu', type:'line', smooth:0.4,
        data:[3200000000,3800000000,4100000000,3900000000,4400000000,4850000000],
        lineStyle:{ width:2.5, color: LG(0,0,1,0,[0,'#34d399'],[1,'#06b6d4']) },
        itemStyle:{ color:C_MINT },
        symbol:'circle', symbolSize:6,
        label:{ show:true, position:'top', fontFamily:font, fontSize:10, fontWeight:700, color:lc, formatter: p => (p.value/1e9).toFixed(1)+'T' },
        areaStyle:{ color: LG(0,0,0,1,[0,'rgba(52,211,153,0.28)'],[1,'rgba(6,182,212,0)']) },
      },
      { name:'Chi', type:'line', smooth:0.4,
        data:[2100000000,2300000000,2600000000,2400000000,2700000000,2950000000],
        lineStyle:{ width:2.5, color: LG(0,0,1,0,[0,'#fb7185'],[1,'#f97316']) },
        itemStyle:{ color:C_ROSE },
        symbol:'circle', symbolSize:6,
        label:{ show:true, position:'top', fontFamily:font, fontSize:10, fontWeight:700, color:lc, formatter: p => (p.value/1e9).toFixed(1)+'T' },
        areaStyle:{ color: LG(0,0,0,1,[0,'rgba(251,113,133,0.24)'],[1,'rgba(249,115,22,0)']) },
      },
    ],
    tooltip:{ ...tooltip, trigger:'axis', formatter: p => `${p[0].axisValue}<br/>` + p.map(s=>`${s.seriesName}: <b>${(s.value/1e9).toFixed(2)} tỷ</b>`).join('<br/>') },
  }
  if (w.type === 'chart-donut') return {
    backgroundColor: 'transparent',
    legend:{ orient:'vertical', right:8, top:'middle', textStyle:{ color:tc, fontFamily:font, fontSize:12 }, icon:'circle', itemWidth:8, itemHeight:8, itemGap:10 },
    series:[{
      type:'pie', radius:['48%','72%'], center:['38%','50%'],
      avoidLabelOverlap:true,
      label:{ show:true, fontFamily:font, fontSize:11, fontWeight:700, color:lc, formatter: p => p.percent.toFixed(0)+'%' },
      labelLine:{ show:true, length:8, length2:6, lineStyle:{ color: dark ? 'rgba(255,255,255,0.35)' : '#ced1d6', width:1 } },
      emphasis:{ label:{ show:true, fontSize:13, fontWeight:'bold', fontFamily:font } },
      itemStyle:{ borderRadius:4, borderWidth:0 },
      data:[
        { value:2350000000, name:'Bán hàng',  itemStyle:{ color:G_MINT  } },
        { value:1200000000, name:'Dịch vụ',   itemStyle:{ color:G_SKY   } },
        { value:850000000,  name:'Xuất khẩu', itemStyle:{ color:G_LAVEN } },
        { value:450000000,  name:'Khác',      itemStyle:{ color:G_AMBER } },
      ],
    }],
    tooltip:{ ...tooltip, trigger:'item', formatter: p => `${p.name}<br/><b>${(p.value/1e9).toFixed(2)} tỷ</b> (${p.percent.toFixed(1)}%)` },
  }
  return {}
}

function initCharts() {
  nextTick(() => {
    widgets.value.filter(w => ['chart-line','chart-donut','chart-bar','chart-cashflow'].includes(w.type)).forEach(w => {
      const el = chartEls[w.id]
      if (!el) return
      if (chartInstances[w.id]) chartInstances[w.id].dispose()
      const chart = echarts.init(el, null, { renderer:'canvas' })
      chartInstances[w.id] = chart
      chart.setOption(getChartOpt(w))
    })
  })
}
function resizeCharts() { Object.values(chartInstances).forEach(c => c?.resize()) }

watch(isDark, () => initCharts())
const ro = new ResizeObserver(resizeCharts)
const gridRO = new ResizeObserver(updateGridRowSize)

onMounted(async () => {
  await nextTick()
  initCharts()
  if (mainEl.value) ro.observe(mainEl.value)
  if (wgridEl.value) { gridRO.observe(wgridEl.value); updateGridRowSize() }
})
onUnmounted(() => { ro.disconnect(); gridRO.disconnect(); Object.values(chartInstances).forEach(c => c?.dispose()) })
</script>

<style scoped>
/* ── CSS tokens — light ── */
.amis-home {
  --h-card:      #ffffff;
  --h-card-s:    #ffffff;
  --h-text-1:    #101828;
  --h-text-2:    #535760;
  --h-text-3:    #a4a7ae;
  --h-border:    rgba(0,0,0,0.07);
  --h-hd:        rgba(255,255,255,0.72);
  --h-hover:     rgba(0,0,0,0.04);
  --h-shadow:    0 0 2px 0 rgba(0,0,0,0.10);
  --h-shadow-hv: 0 2px 16px rgba(0,0,0,0.12);
  --h-dur:       0.3s;
  --h-blur:      none;
  display:flex; flex-direction:column;
  width:100vw; height:100vh; overflow:hidden;
  font-family:var(--font-family, InterVariable, sans-serif);
  font-size: 13px; color:var(--h-text-1);
  background: #ECEDEF;
  transition:color var(--h-dur) ease, background var(--h-dur) ease;
}
.amis-home::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
}
/* ── CSS tokens — dark (default) ── */
.amis-dark {
  --h-card:      rgba(81,77,99,0.25);
  --h-card-s:    rgba(81,77,99,0.62);
  --h-blur:      saturate(1.6) blur(28px);
  --h-text-1:    #ffffff;
  --h-text-2:    rgba(255,255,255,0.90);
  --h-text-3:    rgba(255,255,255,0.65);
  --h-border:    rgba(255,255,255,0.18);
  --h-hd:        rgba(255,255,255,0.07);
  --h-hover:     rgba(255,255,255,0.10);
  --h-shadow:    0 0 0 0.5px rgba(255,255,255,.08), 0 4px 16px rgba(0,0,0,.15), 0 16px 40px rgba(0,0,0,.12);
  --h-shadow-hv: 0 0 0 0.5px rgba(255,255,255,.14), 0 8px 28px rgba(0,0,0,.20), 0 28px 56px rgba(0,0,0,.18);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #0d0b14;
}
.amis-dark::before {
  background: rgba(0,0,0,0.07);
}

/* ── Header — transparent, minimal ── */
.ph {
  display:flex; align-items:center; position:relative; z-index:100;
  height:80px; padding:4px 24px 0; flex-shrink:0;
  background:transparent; gap:0;
}
.ph__left  { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.ph__right  { display:flex; align-items:center; gap:12px; margin-left:auto; }
.ph__brand  { display:flex; align-items:center; gap:12px; }
.ph__logo-svg { flex-shrink:0; width:32px; height:32px; }
.ph__appname { font-size:20px; font-weight:700; color:var(--h-text-1); letter-spacing:-.01em; }
.ph__greet { font-size: 13px; color:var(--h-text-2); white-space:nowrap; }
.amis-dark .ph__greet { color:rgba(255,255,255,.90); font-weight:500; }
.ph__greet-name { font-weight:700; background:linear-gradient(90deg,#5b8fff,#38d9a9); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.ph__greet-block { display:flex; flex-direction:row; align-items:center; gap:10px; }
.ph__datetime { font-size:11px; color:var(--h-text-2); font-weight:400; white-space:nowrap; }
.amis-dark .ph__datetime { color:rgba(255,255,255,.70); font-weight:500; }
.ph__divider-v { width:1px; height:18px; background:rgba(255,255,255,.22); margin:0 4px; flex-shrink:0; }
.amis-home:not(.amis-dark) .ph__divider-v { background:rgba(0,0,0,.14); }
.ph__sep { color:var(--h-text-3); font-size:12px; flex-shrink:0; }
.ph__weather { display:flex; align-items:center; gap:5px; flex-shrink:0; }
.ph__weather-ico { display:flex; align-items:center; flex-shrink:0; filter:drop-shadow(0 1px 6px currentColor); }
.amis-home:not(.amis-dark) .ph__weather-ico { filter: none; }
.ph__weather-ico :deep(svg) { width:28px; height:28px; }
.ph__weather-temp { font-size:14px; font-weight:700; color:var(--h-text-1); line-height:1; }
.amis-dark .ph__weather-temp { color:#fff; }
.ph__weather-meta { font-size:11px; color:var(--h-text-3); white-space:nowrap; }
.amis-dark .ph__weather-meta { color:rgba(255,255,255,.55); }
.ph-icon-btn {
  display:flex; align-items:center; justify-content:center;
  width:32px; height:32px; border-radius:8px;
  border:none; background:transparent; cursor:pointer; color:var(--h-text-2);
  transition:background .15s, color .15s;
}
.ph-icon-btn:hover { background:rgba(255,255,255,.12); color:var(--h-text-1); }
.amis-home:not(.amis-dark) .ph-icon-btn:hover { background:rgba(0,0,0,.07); }
.ph-icon-btn :deep(svg) { width:17px; height:17px; }
.ph__avatar {
  width:30px; height:30px; border-radius:50%;
  object-fit:cover; flex-shrink:0; cursor:pointer;
  box-shadow:0 0 0 2px rgba(255,255,255,.55);
  transition:box-shadow .15s, transform .15s;
  margin-left:2px;
}
.ph__avatar:hover { box-shadow:0 0 0 2.5px rgba(255,255,255,.90); transform:scale(1.06); }

/* ── Bottom Dock ── */
.apps-dock {
  position:fixed; bottom:0; left:0; right:0;
  display:flex; align-items:center; justify-content:center;
  padding:16px 20px; z-index:99;
  overflow:visible; pointer-events:none;
}
.apps-dock__pill { pointer-events:auto; }
.apps-dock__pill {
  display:flex; align-items:flex-end; gap:12px;
  padding:12px 24px;
  background-color: rgba(20,16,32,0.48);
  background-image: radial-gradient(circle at 50% -30%, rgb(255 255 255 / 14%), transparent 60%);
  backdrop-filter:saturate(1.2) blur(28px); -webkit-backdrop-filter:saturate(1.2) blur(28px);
  border:none;
  border-radius:26px;
  box-shadow:0 0 0 0.5px rgba(255,255,255,.18), 0 4px 16px rgba(0,0,0,.22), 0 16px 40px rgba(0,0,0,.18), inset 0 0.5px 0 rgba(255,255,255,.10);
  overflow:visible;
}
.amis-home:not(.amis-dark) .apps-dock__pill {
  background:rgba(255,255,255,0.85);
  border-color: transparent;
  box-shadow:0 4px 16px rgba(0,0,0,.10), 0 16px 40px rgba(0,0,0,.08);
}
.dock-apps-btn {
  display:flex; align-items:center; justify-content:center;
  border:none; background:transparent; cursor:pointer; padding:2px; flex-shrink:0;
}
.dock-apps-btn__icon {
  width:42px; height:42px; border-radius:12px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  background:linear-gradient(135deg,#ff6a00,#ee0979,#9b27af);
  box-shadow:0 2px 10px rgba(0,0,0,.30);
  transition:transform .15s cubic-bezier(.34,1.56,.64,1);
}
.dock-apps-btn:hover .dock-apps-btn__icon { transform:scale(1.12) translateY(-4px); }
.dock-apps-btn__icon .ti { color:#fff; }
.dock-apps-btn__icon :deep(svg) { width:20px; height:20px; }
.dock-sep {
  width:1px; height:32px; background:rgba(255,255,255,.15);
  flex-shrink:0; margin:0 4px; align-self:center;
}
.amis-home:not(.amis-dark) .dock-sep { background:rgba(0,0,0,.14); }

/* App chip — dock icon-only style */
.app-chip {
  position: relative;
  display: flex; flex-direction: column; align-items: center;
  width: 54px; padding: 2px 0; border-radius: 0; border: none; background: transparent;
  cursor: pointer; flex-shrink: 0; overflow: visible;
  /* width + transform handled entirely by JS lerp — NO CSS transition here */
}
.app-chip:hover { background: transparent; }

/* Icon container — transform scale handled by JS lerp */
.app-chip__logo {
  width: 42px; height: 42px; flex-shrink: 0; border-radius: 26%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,.28);
  transform-origin: bottom center;
  /* Only visual transitions — NOT transform (JS handles lerp) */
  transition: filter .22s ease, box-shadow .22s ease;
}
.app-chip:hover .app-chip__logo {
  filter:
    drop-shadow(0 0 8px var(--g1, rgba(255,255,255,0.9)))
    drop-shadow(0 4px 20px var(--g2, rgba(255,255,255,0.7)));
  box-shadow: 0 6px 24px rgba(0,0,0,.40);
}
.amis-home:not(.amis-dark) .app-chip__logo { box-shadow: 0 1px 4px rgba(0,0,0,.14); }
.amis-home:not(.amis-dark) .app-chip:hover .app-chip__logo { filter: none; box-shadow: 0 2px 10px rgba(0,0,0,.20); }
.app-chip__logo .ti { color: #fff; }
.app-chip__logo :deep(svg) { width: 20px; height: 20px; display: block; }
.app-chip__logo-img { width: 100%; height: 100%; object-fit: contain; border-radius: inherit; display: block; }
.app-chip--active .app-chip__logo { box-shadow: 0 2px 10px rgba(0,0,0,.28), 0 0 0 2px rgba(255,255,255,.50); }

/* Label — luôn hiện nhỏ bên dưới icon */
.app-chip__name {
  font-size: 10px; font-weight: 500; line-height: 1.2;
  text-align: center; margin-top: 5px;
  color: rgba(255,255,255,.75);
  width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: color .18s ease;
}
.app-chip:hover .app-chip__name { color: rgba(255,255,255,.98); }
.amis-home:not(.amis-dark) .app-chip__name { color: rgba(0,0,0,.55); }
.amis-home:not(.amis-dark) .app-chip:hover .app-chip__name { color: rgba(0,0,0,.80); }

/* Tooltip tên đầy đủ nổi phía trên khi hover */
.app-chip::after {
  content: attr(data-name);
  position: absolute;
  bottom: calc(100% + 24px);
  left: 50%;
  transform: translateX(-50%) translateY(5px) scale(0.9);
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  font-size: 12px; font-weight: 500; line-height: 1;
  color: rgba(255,255,255,.96);
  background: rgba(14,11,26,0.82);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 0.5px solid rgba(255,255,255,.18);
  border-radius: 8px;
  padding: 5px 10px;
  z-index: 200;
  transition: opacity .16s ease, transform .2s cubic-bezier(.34,1.56,.64,1);
}
.app-chip:hover::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}
.amis-home:not(.amis-dark) .app-chip::after {
  background: rgba(255,255,255,0.92);
  border-color: rgba(0,0,0,.10);
  color: rgba(0,0,0,.80);
}
.dock-add-btn__icon {
  width:42px; height:42px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  background:rgba(255,255,255,.12);
  border:1.5px dashed rgba(255,255,255,.35);
  box-shadow:0 2px 8px rgba(0,0,0,.20);
  transition:background .15s, border-color .15s;
}
.dock-add-btn:hover .dock-add-btn__icon { background:rgba(255,255,255,.20); border-color:rgba(255,255,255,.60); }
.dock-add-btn__icon .ti { color:rgba(255,255,255,.70); }
.dock-add-btn__icon :deep(svg) { width:20px; height:20px; display:block; }
.amis-home:not(.amis-dark) .dock-add-btn__icon { background:rgba(0,0,0,.05); border-color:rgba(0,0,0,.20); }
.amis-home:not(.amis-dark) .dock-add-btn:hover .dock-add-btn__icon { background:rgba(0,0,0,.09); border-color:rgba(0,0,0,.35); }
.amis-home:not(.amis-dark) .dock-add-btn__icon .ti { color:rgba(0,0,0,.45); }

/* ── Main ── */
.amis-main { flex:1; overflow-y:auto; overflow-x:hidden; min-width:0; background:transparent; position:relative; z-index:1; }
.amis-body {
  display:flex; align-items:flex-start; min-height:100%; gap:20px;
  width:100%; max-width:2000px; margin:0 auto;
  padding:0 40px 96px; /* 2560px+: content ~1920px */
}

/* ── Responsive breakpoints ── */
@media (max-width: 1920px) {
  /* Full HD: ~1600px content */
  .amis-body { max-width:1680px; padding:0 40px 96px; }
}
@media (max-width: 1600px) {
  /* Desktop rộng: ~1440px content */
  .amis-body { max-width:1504px; padding:0 32px 96px; }
}
@media (max-width: 1440px) {
  /* Desktop chuẩn: ~1360px content */
  .amis-body { max-width:1408px; padding:0 24px 96px; }
}
@media (max-width: 1366px) {
  /* Laptop phổ biến: ~1280px content */
  .amis-body { max-width:1320px; padding:0 20px 96px; }
}
@media (max-width: 1280px) {
  /* Laptop nhỏ: ~1184px content */
  .amis-body { max-width:1216px; padding:0 16px 96px; }
}
@media (max-width: 1024px) {
  /* Tablet / small desktop: ~960px, ẩn rside */
  .amis-body { max-width:100%; padding:0 16px 96px; }
  .rside { display:none; }
}

/* ── Top bar (greeting + controls) ── */
.top-bar { display:flex; align-items:center; justify-content:space-between; padding:12px 20px 8px; flex-shrink:0; }
.top-bar__left { display:flex; flex-direction:column; gap:2px; }
.top-bar__greet { font-size:16px; font-weight:700; color:var(--h-text-1); line-height:1.3; }
.amis-dark .top-bar__greet { color:#fff; text-shadow:0 1px 8px rgba(0,0,0,.40); }
.greeting__name { background:linear-gradient(90deg,#5b8fff,#38d9a9); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.top-bar__date { font-size:11.5px; color:var(--h-text-2); text-transform:capitalize; }
.amis-dark .top-bar__date { color:rgba(255,255,255,.50); }
.top-bar__right { display:flex; align-items:center; gap:8px; }
.dash-chip { font-size:11px; padding:2px 8px; border-radius:20px; background:var(--h-card); border:1px solid var(--h-border); color:var(--h-text-2); }
.amis-btn { display:inline-flex; align-items:center; gap:6px; height:32px; padding:0 14px; border-radius:8px; font-size: 13px; font-weight:500; font-family:inherit; cursor:pointer; border:none; transition:background .15s, box-shadow .15s, transform .15s; }
.amis-btn :deep(svg) { width:15px; height:15px; }
.amis-btn--outline { background:#fff; border:1px solid rgba(0,0,0,.12); color:var(--h-text-1); box-shadow:none; }
.amis-btn--outline:hover { background:#f5f5f5; box-shadow:none; }
.amis-dark .amis-btn--outline { background:rgba(255,255,255,.10); border-color:rgba(255,255,255,.22); color:#fff; box-shadow:none; }
.amis-dark .amis-btn--outline:hover { background:rgba(255,255,255,.16); border-color:rgba(255,255,255,.35); }
.amis-btn--primary { background:linear-gradient(170deg,#2f6aee,#1252cc); color:#fff; box-shadow:none; }
.amis-btn--primary:hover { background:linear-gradient(170deg,#3a75f5,#1a5ee0); box-shadow:none; transform:translateY(-1px); }
.amis-btn--primary:active { transform:translateY(0); box-shadow:none; }
.amis-link { background:none; border:none; color:#245fdf; cursor:pointer; font-size:12px; font-family:inherit; padding:0; }
.amis-dark .amis-link { color:#5b8fff; }

/* ── Widget grid ── */
.wgrid { flex:1; overflow:visible; padding:4px 0 16px; display:grid; grid-template-columns:repeat(24,1fr); grid-auto-rows:40px; gap:20px; align-content:start; }

@keyframes fadeInUp {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes springPop {
  0%   { opacity:0; transform:scale(0.72) translateY(16px); }
  55%  { opacity:1; transform:scale(1.05) translateY(-4px); }
  75%  { transform:scale(0.97) translateY(2px); }
  90%  { transform:scale(1.01) translateY(-1px); }
  100% { opacity:1; transform:scale(1) translateY(0); }
}
@keyframes drop-pulse {
  from { box-shadow:0 0 0 2px #245fdf, 0 0 0 4px rgba(36,95,223,.18), 0 4px 24px rgba(36,95,223,.14); }
  to   { box-shadow:0 0 0 2px #245fdf, 0 0 0 8px rgba(36,95,223,.32), 0 12px 44px rgba(36,95,223,.28); }
}
@keyframes resizePulse {
  0%,100% { box-shadow:0 0 0 2px rgba(36,95,223,.5), 0 0 12px rgba(36,95,223,.2); }
  50%     { box-shadow:0 0 0 2px rgba(36,95,223,.8), 0 0 24px rgba(36,95,223,.4); }
}

/* ── Rainbow stroke on hover ── */
@keyframes rainbow-move {
  0%   { background-position: 0%   50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0%   50%; }
}

.wcard {
  background:var(--h-card); border-radius:20px;
  backdrop-filter:var(--h-blur); -webkit-backdrop-filter:var(--h-blur);
  border:1px solid var(--h-border);
  box-shadow:var(--h-shadow);
  display:flex; flex-direction:column;
  animation:fadeInUp .4s ease backwards; animation-delay:var(--delay,0s);
  transition: box-shadow .22s ease, opacity .18s ease, transform .22s cubic-bezier(.34,1.56,.64,1);
}
.amis-dark .wcard {
  border: none;
  box-shadow: 0 0 0 0.5px rgba(255,255,255,0.20), inset 0 0.5px 0 rgba(255,255,255,0.18);
  background-color: transparent;
  background-image:
    radial-gradient(circle at 50% -20%, rgb(255 255 255 / 3%), transparent 46%),
    linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06)),
    linear-gradient(rgba(10,8,20,0.46), rgba(10,8,20,0.46));
}
/* Rainbow border via CSS mask — stays inside card, no overflow-x clipping issue */
.wcard::after {
  content:'';
  position:absolute; inset:0; border-radius:20px;
  background: linear-gradient(60deg,
    #f79533, #f37055, #ef4e7b, #a166ab,
    #5073b8, #1098ad, #07b39b, #6fba82,
    #f79533, #f37055
  );
  background-size: 300%;
  opacity:0; transition:opacity .3s ease;
  pointer-events:none; z-index:20;
  /* mask: show only the 1px ring, hide interior */
  padding: 1px;
  -webkit-mask: linear-gradient(#000 0 0) content-box,
                linear-gradient(#000 0 0);
  -webkit-mask-composite: destination-out;
  mask: linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: rainbow-move 3s ease alternate infinite;
  animation-play-state: paused;
}
.wcard:hover::after {
  opacity:1;
  animation-play-state: running;
}
.amis-dark .wcard:hover {
  background-color: transparent;
  background-image:
    radial-gradient(circle at 50% -20%, rgb(255 255 255 / 5%), transparent 46%),
    linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.08)),
    linear-gradient(rgba(10,8,20,0.40), rgba(10,8,20,0.40));
  box-shadow: 0 0 0 0.5px rgba(255,255,255,0.06), inset 0 0.5px 0 rgba(255,255,255,0.05);
}
.wcard:hover { background: rgba(255,255,255,0.82); }
/* All children above rainbow ring */
.wcard__hd, .wcard__bd { position:relative; z-index:2; }
.wcard:hover { box-shadow: var(--h-shadow-hv); }
.wcard--new {
  animation: springPop .58s cubic-bezier(.34,1.56,.64,1) forwards !important;
  animation-delay: 0s !important;
}
.wcard--dragging {
  opacity: .22;
  transform: scale(.93) rotate(-0.8deg);
  filter: blur(1.5px) saturate(0.8);
  box-shadow: 0 24px 64px rgba(0,0,0,.5) !important;
  z-index: 100;
  transition: opacity .14s ease, transform .14s ease, filter .14s ease !important;
}
.wcard--over {
  box-shadow: 0 0 0 2.5px #4a7ff7, 0 0 0 7px rgba(36,95,223,.26), 0 12px 48px rgba(36,95,223,.22) !important;
  transform: scale(1.025) translateY(-2px);
  z-index: 5;
  transition: transform .16s cubic-bezier(.34,1.56,.64,1), box-shadow .16s ease !important;
  animation: drop-pulse .85s ease-in-out infinite alternate;
}
.wcard--over::before {
  content: '';
  position: absolute; inset: 0; border-radius: 16px;
  background: rgba(36,95,223,.07);
  z-index: 1; pointer-events: none;
}
.wcard--ghost { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; border:2px dashed var(--h-border); border-radius:20px; background:rgba(255,255,255,.08); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); box-shadow:none; cursor:pointer; color:var(--h-text-2); font-size: 13px; }
.wcard--ghost :deep(svg) { width:22px; height:22px; }
.wcard--ghost:hover { border-color:#245fdf; color:#245fdf; background:rgba(36,95,223,.04); }
.wgrid--editing .wcard:not(.wcard--ghost) { cursor: grab; }
.wgrid--editing .wcard:not(.wcard--ghost):active { cursor: grabbing; }
/* Subtle jiggle khi vào edit mode để báo "có thể kéo" */
@keyframes editJiggle {
  0%,100% { transform: rotate(0deg); }
  20%     { transform: rotate(-0.6deg); }
  50%     { transform: rotate(0.6deg); }
  80%     { transform: rotate(-0.3deg); }
}
.wgrid--editing .wcard:not(.wcard--ghost):not(.wcard--dragging) {
  animation: editJiggle .5s ease-in-out 1;
}

/* ── Grid cell overlay (edit mode) ── */
.wgrid__cell {
  border-radius: 10px;
  border: 1.5px dashed rgba(36,95,223,.18);
  background: rgba(36,95,223,.04);
  pointer-events: none;
  z-index: 0;
  transition: border-color .2s, background .2s;
}
.amis-dark .wgrid__cell {
  border-color: rgba(150,180,255,.15);
  background: rgba(150,180,255,.03);
}

/* Drop ghost — snap preview */
.wgrid__drop-ghost {
  border-radius: 16px;
  border: 2px dashed #4a7ff7;
  background: rgba(36,95,223,.10);
  pointer-events: none;
  z-index: 3;
  animation: ghostPop .12s cubic-bezier(.34,1.56,.64,1);
}
.amis-dark .wgrid__drop-ghost {
  border-color: rgba(122,173,255,.70);
  background: rgba(122,173,255,.10);
}
@keyframes ghostPop {
  from { opacity:0; transform:scale(.96); }
  to   { opacity:1; transform:scale(1); }
}

/* While dragging: dim non-hovered cards */
.wgrid--dragging .wcard:not(.wcard--dragging) {
  opacity: 0.55;
  transition: opacity .15s ease !important;
}

.wcard__resize {
  position: absolute; bottom: 6px; right: 6px;
  width: 22px; height: 22px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: se-resize; color: var(--h-text-3);
  transition: color .15s, background .15s, transform .15s cubic-bezier(.34,1.56,.64,1), opacity .15s;
  z-index: 10; opacity: 0.5;
}
.wcard__resize:hover { color: var(--h-text-1); background: var(--h-hover); transform: scale(1.2); opacity: 1; }
.wcard__resize--active {
  color: #4a7ff7; background: rgba(36,95,223,.15);
  transform: scale(1.15); opacity: 1;
  animation: resizePulse 1s ease-in-out infinite;
}
.wcard--resizing {
  outline: 2px solid rgba(74,127,247,.55);
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(36,95,223,.12), 0 12px 40px rgba(36,95,223,.18) !important;
  transition: none !important;
}
.wcard { position:relative; }

.wcard__hd { display:flex; align-items:center; justify-content:space-between; padding:24px 24px 0; flex-shrink:0; }
.wcard__hd-l { display:flex; align-items:flex-start; gap:8px; min-width:0; }
.wcard__hd-r { display:flex; align-items:center; gap:4px; flex-shrink:0; }
.wcard__icon {
  flex-shrink:0; display:flex; align-items:center; justify-content:center;
}
.wcard__icon :deep(svg) { width:18px; height:18px; }
.wcard__title { font-size:16px; font-weight:600; color:var(--h-text-2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.amis-dark .wcard__title { color:rgba(255,255,255,.80); }
.amis-home:not(.amis-dark) .wcard__title { color: var(--text-primary); }
.wcard__src   { font-size:12px; color:var(--h-text-3); line-height:1.2; }
.wcard__period{ font-size:11px; color:var(--h-text-2); background:var(--h-hover); padding:2px 7px; border-radius:20px; }
.wc-btn { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:none; background:transparent; cursor:pointer; color:var(--h-text-2); transition:background .12s, color .12s; }
.wc-btn:hover { background:var(--h-hover); color:var(--h-text-1); }
.wc-btn--del:hover { background:#fef2f2; color:#f04438; }
.amis-dark .wc-btn--del:hover { background:rgba(240,68,56,.15); }
.drag-handle { display:flex; align-items:center; justify-content:center; width:28px; height:28px; cursor:grab; color:var(--h-text-2); border-radius:7px; transition:background .12s; }
.drag-handle:hover { background:var(--h-hover); }
.wcard__bd { flex:1; padding:8px 24px 24px; overflow:hidden; display:flex; flex-direction:column; container-type:inline-size; }
/* Khi không có wcard__hd phía trên (customHd cards ở view mode), bỏ padding-top thừa */
.wcard > .wcard__bd:first-child { padding-top: 0; }

/* ── KPI ── */
.kpi { display:flex; align-items:center; justify-content:space-between; height:100%; gap:12px; }
.kpi__info { flex:1; min-width:0; display:flex; flex-direction:column; gap:10px; }
.kpi__top { display:flex; align-items:center; gap:8px; }
.kpi__num { display:flex; align-items:baseline; gap:4px; }
.kpi__val { font-size:28px; font-weight:700; line-height:1.1; letter-spacing:-.02em; font-feature-settings:'tnum'; color:var(--h-text-1); }
.amis-dark .kpi__val { font-size:30px; font-weight:800; color:#ffffff; }
.kpi__unit { font-size:11px; color:var(--h-text-2); font-weight:500; }
.kpi__badge {
  display:inline-flex; align-items:center; gap:2px;
  padding:2px 7px 2px 5px; border-radius:20px;
  font-size:11px; font-weight:600; width:fit-content; white-space:nowrap;
}
.kpi__badge :deep(svg) { width:12px; height:12px; }
.kpi__badge--up { background:#ecfdf3; color:#0e9a62; }
.kpi__badge--dn { background:#fef2f2; color:#f04438; }
.amis-dark .kpi__badge--up { background:rgba(14,154,98,.20); color:#3ddc84; }
.amis-dark .kpi__badge--dn { background:rgba(240,68,56,.20); color:#ff7b72; }
.kpi__compare { font-size:10.5px; color:var(--h-text-3); }
.kpi__icon-box {
  width:52px; height:52px; flex-shrink:0;
  border-radius:12px;
  display:flex; align-items:center; justify-content:center;
}
.kpi__icon-box :deep(svg) { width:26px; height:26px; }

/* ── Charts ── */
.chart-wrap { flex:1; width:100%; min-height:0; }

/* ── Transaction list ── */
.ltx { display:flex; flex-direction:column; gap:4px; overflow-y:auto; flex:1; min-height:0; }
.ltx__row { display:flex; align-items:center; gap:10px; padding:6px 8px; border-radius:8px; transition:background .12s; }
.ltx__row:hover { background:var(--h-hover); }
.ltx__dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.ltx__dot--g { background:#0e9a62; } .ltx__dot--r { background:#f04438; }
.ltx__info { flex:1; min-width:0; }
.ltx__name { font-size:12.5px; color:var(--h-text-1); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block; }
.ltx__date { font-size:11px; color:var(--h-text-2); }
.ltx__amount { font-size: 13px; font-weight:600; flex-shrink:0; font-feature-settings:'tnum'; white-space:nowrap; }
.ltx__amount--g { color:#0e9a62; } .ltx__amount--r { color:#f04438; }
.ltx__tag { font-size:11px; padding:2px 7px; border-radius:20px; white-space:nowrap; flex-shrink:0; }
.ltx__tag--ok { background:#ecfdf3; color:#0e9a62; }
.ltx__tag--wait { background:#fffaeb; color:#b45309; }
.amis-dark .ltx__tag--ok { background:rgba(14,154,98,.15); }
.amis-dark .ltx__tag--wait { background:rgba(247,144,9,.15); color:#f79009; }

/* ── Task list ── */
.tasks { display:flex; flex-direction:column; gap:2px; overflow-y:auto; flex:1; min-height:0; }
.task-row { display:flex; align-items:center; gap:10px; padding:6px 6px; border-radius:8px; cursor:pointer; transition:background .12s, opacity .2s; }
.task-row:hover { background:var(--h-hover); }
.task-row--done { opacity:.5; }
.task-chk { width:18px; height:18px; border-radius:5px; border:1.5px solid #ced1d6; display:flex; align-items:center; justify-content:center; color:#fff; transition:background .15s, border-color .15s; }
.task-chk--on { background:#0e9a62; border-color:#0e9a62; }
.task-chk :deep(svg) { width:12px; height:12px; }
.task-body { flex:1; min-width:0; }
.task-name { font-size:12.5px; color:var(--h-text-1); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block; }
.task-row--done .task-name { text-decoration:line-through; }
.task-time { font-size:11px; color:var(--h-text-2); }
.task-pri { font-size:10.5px; font-weight:600; padding:2px 6px; border-radius:20px; flex-shrink:0; }
.task-pri--high   { background:#fef2f2; color:#f04438; }
.task-pri--medium { background:#fffaeb; color:#b45309; }
.task-pri--low    { background:#f0fdf4; color:#0e9a62; }
.amis-dark .task-pri--high   { background:rgba(240,68,56,.15); }
.amis-dark .task-pri--medium { background:rgba(247,144,9,.15); color:#f79009; }
.amis-dark .task-pri--low    { background:rgba(14,154,98,.15); }
.task-foot { margin-top:auto; padding-top:8px; border-top:1px solid var(--h-border); display:flex; align-items:center; justify-content:space-between; font-size:11.5px; color:var(--h-text-2); }

/* ── Custom scrollbars — ẩn mặc định, hiện khi hover ── */
.tasks, .ltx, .catalog-panel__body {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color .2s;
}
.tasks:hover, .ltx:hover {
  scrollbar-color: rgba(0,0,0,.20) transparent;
}
.amis-dark .tasks:hover, .amis-dark .ltx:hover {
  scrollbar-color: rgba(255,255,255,.18) transparent;
}

.tasks::-webkit-scrollbar, .ltx::-webkit-scrollbar,
.catalog-panel__body::-webkit-scrollbar { width:4px; }
.tasks::-webkit-scrollbar-track, .ltx::-webkit-scrollbar-track,
.catalog-panel__body::-webkit-scrollbar-track { background:transparent; }
.tasks::-webkit-scrollbar-thumb, .ltx::-webkit-scrollbar-thumb,
.catalog-panel__body::-webkit-scrollbar-thumb {
  background:transparent; border-radius:4px; transition:background .25s;
}
.tasks:hover::-webkit-scrollbar-thumb, .ltx:hover::-webkit-scrollbar-thumb {
  background:rgba(0,0,0,.20);
}
.amis-dark .tasks:hover::-webkit-scrollbar-thumb, .amis-dark .ltx:hover::-webkit-scrollbar-thumb {
  background:rgba(255,255,255,.18);
}
.catalog-panel__body:hover::-webkit-scrollbar-thumb { background:rgba(0,0,0,.18); }

/* ── Main scroll ── */
.amis-main {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color .2s;
}
.amis-main:hover { scrollbar-color: rgba(255,255,255,.18) transparent; }
.amis-home:not(.amis-dark) .amis-main:hover { scrollbar-color: rgba(0,0,0,.16) transparent; }
.amis-main::-webkit-scrollbar { width:5px; }
.amis-main::-webkit-scrollbar-track { background:transparent; }
.amis-main::-webkit-scrollbar-thumb { background:transparent; border-radius:4px; transition:background .25s; }
.amis-main:hover::-webkit-scrollbar-thumb { background:rgba(255,255,255,.20); }
.amis-home:not(.amis-dark) .amis-main:hover::-webkit-scrollbar-thumb { background:rgba(0,0,0,.16); }

/* ── Catalog panel — macOS sheet ── */
.amis-overlay { position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,.30); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); display:flex; align-items:flex-end; justify-content:flex-end; }
.catalog-panel {
  width:400px; height:100%;
  background:rgba(255,255,255,0.95);
  backdrop-filter:saturate(1.4) blur(20px); -webkit-backdrop-filter:saturate(1.4) blur(20px);
  border-left:1px solid rgba(0,0,0,.08);
  display:flex; flex-direction:column;
  box-shadow:-2px 0 0 0.5px rgba(0,0,0,.04), -8px 0 32px rgba(0,0,0,.08);
}
.amis-dark .catalog-panel {
  background:rgba(22,16,28,0.88);
  border-left-color:rgba(255,255,255,.08);
  box-shadow:-2px 0 0 0.5px rgba(0,0,0,.25), -8px 0 40px rgba(0,0,0,.35);
}
.catalog-panel__hd { display:flex; align-items:center; justify-content:space-between; padding:18px 20px 8px; border-bottom:1px solid var(--h-border); flex-shrink:0; }
.catalog-panel__title { font-size:15px; font-weight:600; color:var(--h-text-1); }
.catalog-panel__sub { font-size:12px; color:var(--h-text-2); padding:8px 20px 12px; flex-shrink:0; }
.catalog-panel__body { flex:1; overflow-y:auto; padding:4px 16px; display:flex; flex-direction:column; gap:6px; }
.catalog-panel__ft { padding:16px 20px; border-top:1px solid var(--h-border); flex-shrink:0; }
.cat-item { display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:10px; cursor:pointer; border:1.5px solid transparent; transition:background .12s, border-color .15s; }
.cat-item:hover { background:var(--h-hover); }
.cat-item--added { border-color:#0e9a62; background:rgba(14,154,98,.05); }
.amis-dark .cat-item--added { background:rgba(14,154,98,.1); }
.cat-item__icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
.cat-item__info { flex:1; min-width:0; }
.cat-item__title { font-size: 13px; font-weight:600; color:var(--h-text-1); display:block; }
.cat-item__src { font-size:11.5px; color:var(--h-text-2); }
.cat-item__btn { width:30px; height:30px; border-radius:8px; border:1.5px solid var(--h-border); background:var(--h-card); cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--h-text-2); transition:background .12s, border-color .12s, color .12s; }
.cat-item__btn:hover { background:#245fdf; border-color:#245fdf; color:#fff; }
.cat-item__btn--remove:hover { background:#f04438; border-color:#f04438; color:#fff; }

/* ── SVG icon sizing (Tabler icons render as SVG, not icon font) ── */
.wc-btn      :deep(svg) { width:15px; height:15px; }
.drag-handle :deep(svg) { width:15px; height:15px; }
.cat-item__icon :deep(svg) { width:22px; height:22px; }
.cat-item__btn  :deep(svg) { width:15px; height:15px; }
.wcard--ghost   :deep(svg) { width:22px; height:22px; }
.top-bar__right .amis-btn :deep(svg) { width:15px; height:15px; }

/* ── Background Picker ── */
.ph__settings-wrap { position:relative; }
.ph-icon-btn--active { background:rgba(255,255,255,.15); color:var(--h-text-1); }
.amis-home:not(.amis-dark) .ph-icon-btn--active { background:rgba(0,0,0,.10); }

.bg-picker {
  position:absolute; top:calc(100% + 10px); right:0;
  width:720px;
  background:rgba(18,14,28,0.92);
  backdrop-filter:saturate(1.8) blur(28px); -webkit-backdrop-filter:saturate(1.8) blur(28px);
  border:1px solid rgba(255,255,255,.16);
  border-radius:20px;
  box-shadow:0 8px 40px rgba(0,0,0,.50), 0 2px 8px rgba(0,0,0,.30);
  padding:16px;
  z-index:200;
}
.amis-home:not(.amis-dark) .bg-picker {
  background:rgba(255,255,255,.94);
  border-color:rgba(0,0,0,.10);
  box-shadow:0 8px 40px rgba(0,0,0,.16);
}
.bg-picker__hd {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:14px;
}
.bg-picker__title { font-size: 13px; font-weight:600; color:var(--h-text-1); }
.bg-picker__grid {
  display:grid; grid-template-columns:repeat(4,1fr); gap:10px;
  max-height:680px; overflow-y:auto; padding-right:2px;
  scrollbar-width:thin; scrollbar-color:rgba(255,255,255,.18) transparent;
}
.bg-picker__grid::-webkit-scrollbar { width:4px; }
.bg-picker__grid::-webkit-scrollbar-thumb { background:rgba(255,255,255,.18); border-radius:4px; }
.bg-thumb {
  border:none; padding:0; cursor:pointer; border-radius:10px; overflow:hidden;
  position:relative; aspect-ratio:16/9; background:#111;
  outline:2.5px solid transparent; outline-offset:2px;
  transition:outline-color .15s, transform .15s;
}
.bg-thumb:hover { transform:scale(1.04); }
.bg-thumb--active { outline-color:rgba(255,255,255,.85); }
.amis-home:not(.amis-dark) .bg-thumb--active { outline-color:#245fdf; }
.bg-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
.bg-thumb__name {
  position:absolute; bottom:0; left:0; right:0;
  padding:16px 8px 6px; font-size:11px; font-weight:500;
  background:linear-gradient(transparent, rgba(0,0,0,.70));
  color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  text-align:center;
}

.picker-enter-active, .picker-leave-active { transition:opacity .18s ease, transform .18s ease; }
.picker-enter-from, .picker-leave-to { opacity:0; transform:translateY(-6px) scale(.97); }

/* ── Right sidebar widgets now in unified wgrid ── */
.amis-home:not(.amis-dark) .wcard {
  border: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.amis-home:not(.amis-dark) .wcard:hover {
  background: #ffffff;
}

.rcard__hd {
  display:flex; align-items:center; gap:7px;
  padding:24px 24px 8px;
}
.wgrid--editing .wcard .rcard__hd { padding-top:8px; }
.rcard__icon { display:flex; }
.rcard__icon :deep(svg) { width:15px; height:15px; }
.rcard__title { font-size:16px; font-weight:600; color:var(--h-text-2); }
.amis-dark .rcard__title { color:rgba(255,255,255,.80); }
.amis-home:not(.amis-dark) .rcard__title { color: var(--text-primary); }
.rcard__sub { font-size:11px; color:var(--h-text-3); flex:1; }
.rcard__filter-wrap {
  flex:1; position:relative;
  display:inline-flex; align-items:center; gap:3px;
  cursor:pointer;
}
.rcard__filter-label {
  font-size:11px; font-weight:600; color:var(--h-text-2); white-space:nowrap;
}
.rcard__filter-wrap :deep(svg) { width:11px; height:11px; color:var(--h-text-3); flex-shrink:0; }
.rcard__filter {
  position:absolute; inset:0;
  opacity:0; cursor:pointer;
  width:100%; height:100%;
  appearance:none; border:none;
}
.rcard__filter option { background:#1e1b2e; color:#fff; }
.rcard__badge {
  font-size:10px; font-weight:700; min-width:18px; height:18px; padding:0 5px;
  border-radius:9px; background:rgba(247,144,9,.20); color:#f79009;
  display:flex; align-items:center; justify-content:center;
}
.rcard__badge--blue { background:rgba(36,95,223,.20); color:#245fdf; }
.amis-dark .rcard__badge--blue { background:rgba(122,173,255,.18); color:#7aadff; }
.rcard__body { padding:0; display:flex; flex-direction:column; gap:8px; }
.rcard__body--links { gap:4px; }
.rcard__empty { font-size:12px; color:var(--h-text-3); text-align:center; padding:8px 0; }

/* birthday / sales rows */
.rrow { display:flex; align-items:center; gap:8px; padding:5px 8px; margin:0 -8px; border-radius:8px; cursor:pointer; transition:background .12s; }
.rrow:hover { background:var(--h-hover); }
.rrow__av {
  width:30px; height:30px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:11px; font-weight:700; color:#fff;
  box-shadow: 0 0 0 1.5px rgba(255,255,255,0.40), 0 0 0 2.5px rgba(0,0,0,0.06);
}
.rrow__av--img { object-fit:cover; }
.rrow__info { flex:1; min-width:0; display:flex; flex-direction:column; gap:1px; }
.rrow__name { font-size:12px; font-weight:600; color:var(--h-text-1); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rrow__sub  { font-size:11px; color:var(--h-text-3); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.rrow__btn  { display:flex; align-items:center; justify-content:center; width:26px; height:26px; border:none; border-radius:7px; background:rgba(36,95,223,.15); color:#5b8fff; cursor:pointer; flex-shrink:0; transition:background .12s, opacity .12s; opacity:0; }
.rrow:hover .rrow__btn { opacity:1; }
.rrow__btn:hover { background:rgba(36,95,223,.28); }
.rrow__btn :deep(svg) { width:13px; height:13px; }

/* notices */
.notice-row { display:flex; align-items:flex-start; gap:8px; padding:5px 8px; margin:0 -8px; border-radius:8px; cursor:pointer; transition:background .12s; }
.notice-row:hover { background:var(--h-hover); }
.notice-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; margin-top:5px; }
.notice-info { flex:1; display:flex; flex-direction:column; gap:2px; }
.notice-text { font-size:12px; color:var(--h-text-1); line-height:1.5; }
.notice-time { font-size:10.5px; color:var(--h-text-3); }

/* top sales */
.sales-row { display:flex; align-items:center; gap:8px; padding:5px 8px; margin:0 -8px; border-radius:8px; cursor:pointer; transition:background .12s; }
.sales-row:hover { background:var(--h-hover); }
.sales-rank { font-size:11px; font-weight:700; width:16px; text-align:center; flex-shrink:0; color:var(--h-text-3); }
.sales-rank--1 { color:#f79009; }
.sales-rank--2 { color:#a4a7ae; }
.sales-rank--3 { color:#cd7f32; }
.sales-bar-wrap { width:40px; flex-shrink:0; background:var(--h-hover); border-radius:3px; height:4px; overflow:hidden; }
.sales-bar { height:4px; border-radius:3px; transition:width .6s ease; }

/* ── Quick Actions ── */
.qa-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(72px, 1fr)); gap:6px; align-content:start; }
.rcard__body.qa-grid { padding:0; }
.qa-btn {
  display:flex; flex-direction:column; align-items:center; gap:7px;
  padding:10px 6px 8px;
  border:none; background:transparent; cursor:pointer;
  border-radius:12px; transition:background .14s;
  font-family:inherit;
}
.qa-btn:hover { background:transparent; }
.qa-btn__icon {
  position:relative;
  width:46px; height:46px; border-radius:13px;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
  transition:transform .14s;
}
.qa-btn:hover .qa-btn__icon { transform:translateY(-2px); }
.qa-btn__icon :deep(svg) { position:relative; z-index:2; width:20px; height:20px; }
.qa-btn__icon::after {
  content:'';
  position:absolute; inset:0; border-radius:13px;
  background: linear-gradient(60deg,
    #f79533, #f37055, #ef4e7b, #a166ab,
    #5073b8, #1098ad, #07b39b, #6fba82,
    #f79533, #f37055
  );
  background-size: 300%;
  opacity:0; transition:opacity .25s ease;
  pointer-events:none; z-index:1;
  padding: 2px;
  -webkit-mask: linear-gradient(#000 0 0) content-box,
                linear-gradient(#000 0 0);
  -webkit-mask-composite: destination-out;
  mask: linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: rainbow-move 2s ease alternate infinite;
  animation-play-state: paused;
}
.qa-btn:hover .qa-btn__icon::after {
  opacity:1;
  animation-play-state: running;
}
.qa-badge {
  position:absolute; top:-5px; right:-5px; z-index:3;
  min-width:17px; height:17px; border-radius:9px;
  background:#f04438; color:#fff;
  font-size:10px; font-weight:700; line-height:1;
  display:flex; align-items:center; justify-content:center;
  padding:0 4px;
  border:2px solid transparent;
  box-shadow:0 1px 4px rgba(240,68,56,.4);
}
.amis-dark .qa-badge { border-color:rgba(81,77,99,0.32); }
.amis-home:not(.amis-dark) .qa-badge { border-color:#fff; }
.qa-btn__name { font-size:11px; color:var(--h-text-2); text-align:center; line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }

/* quick links */
.qlink {
  display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:8px;
  text-decoration:none; transition:background .12s; cursor:pointer;
}
.qlink:hover { background:var(--h-hover); }
.qlink__icon { width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.qlink__icon :deep(svg) { width:14px; height:14px; }
.qlink__name { flex:1; font-size:12px; color:var(--h-text-1); font-weight:500; }
.qlink :deep(svg):last-child { width:13px; height:13px; color:var(--h-text-3); flex-shrink:0; }

/* ── Transitions ── */
.overlay-enter-active, .overlay-leave-active { transition:opacity .25s ease; }
.overlay-enter-from, .overlay-leave-to { opacity:0; }
.panel-enter-active, .panel-leave-active { transition:transform .3s cubic-bezier(.22,1,.36,1); }
.panel-enter-from, .panel-leave-to { transform:translateX(100%); }
</style>
