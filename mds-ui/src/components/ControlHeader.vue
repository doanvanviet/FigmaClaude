<template>
  <!-- ── Global Header ── -->
  <header class="global-header" :class="{ 'global-header--white': currentMode === 'light' }">
    <!-- Left -->
    <div class="header-left">
      <button class="btn-icon-white"><TIcon name="grid-dots" /></button>
      <slot name="logo-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
          <path d="M0 16C0 3.2 3.2 0 16 0C28.8 0 32 3.2 32 16C32 28.8 28.8 32 16 32C3.2 32 0 28.8 0 16Z" fill="url(#paint0_linear_4480_1201)"/>
          <circle cx="16" cy="16" r="10" fill="white"/>
          <path d="M20.2432 7.8353C18.9324 7.15508 17.4773 6.8 16.0005 6.8C14.5237 6.8 13.0685 7.15508 11.7578 7.8353L19.9223 15.9979L24.1652 11.7557C23.2902 10.0783 21.9212 8.7098 20.2432 7.8353Z" fill="#FF9500"/>
          <path d="M12.0781 16.0016L7.835 20.2432C8.96023 22.4079 10.8994 24.0371 13.2261 24.7723C15.5527 25.5075 18.0761 25.2886 20.2413 24.1636L12.0781 16.0016Z" fill="#4CD964"/>
          <path d="M24.1642 11.7592L15.9999 19.9209L20.2431 24.1631C22.408 23.0379 24.0373 21.0989 24.7725 18.7727C25.5077 16.4465 25.2885 13.9236 24.1633 11.7589L24.1642 11.7592Z" fill="#007AFF"/>
          <path d="M11.7561 7.8356C9.59182 8.96137 7.96314 10.9002 7.22794 13.226C6.49274 15.5518 6.71117 18.0743 7.83521 20.2391L15.9986 12.0771L11.7561 7.8356Z" fill="#FF3B30"/>
          <path d="M15.9996 12.0793L12.0789 15.9993L15.9996 19.9194L19.9203 15.9993L15.9996 12.0793Z" fill="#393A3D"/>
          <path d="M15.9991 12.811L19.1882 15.9996L15.9991 19.1873L12.8109 15.9996L15.9991 12.811Z" fill="#EEF3F6"/>
          <g opacity="0.15">
            <path d="M13.226 17.148L7.85547 20.2213L12.0782 16.0002L13.226 17.148Z" fill="black"/>
            <path d="M14.8512 13.225L11.7771 7.85541L15.9998 12.0777L14.8512 13.225Z" fill="black"/>
            <path d="M18.773 14.8506L24.1435 11.777L19.9208 15.999L18.773 14.8506Z" fill="black"/>
            <path d="M17.1481 18.7734L20.2222 24.1429L15.9995 19.9212L17.1481 18.7734Z" fill="black"/>
          </g>
          <defs>
            <linearGradient id="paint0_linear_4480_1201" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
              <stop stop-color="#3DC9F9"/>
              <stop offset="1" stop-color="#02A3EC"/>
            </linearGradient>
          </defs>
        </svg>
      </slot>
      <span class="app-name-header">{{ appName }}</span>
      <template v-if="!noMeta">
        <div class="divider-v-header"></div>
        <slot name="header-meta">
          <button class="header-company">
            Công ty mẫu <TIcon name="chevron-down" />
          </button>
          <span class="header-year-badge">
            <span class="year-dot"></span>
            Dữ liệu năm 2025
          </span>
        </slot>
      </template>
    </div>

    <!-- Right — search + actions — thứ tự chuẩn: Search → Settings → MISA AI → AMIS Chat → Bell → Help → More -->
    <div class="header-right">
      <slot name="header-search">
        <div class="search-box-header">
          <TIcon name="search" />
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
      </slot>
      <slot name="header-actions" />
      <div class="header-toolbar">
        <button class="btn-icon-white" title="Thiết lập màu sắc và hiển thị" @click="openSettings">
          <TIcon name="settings" />
        </button>
        <button class="btn-icon-white" title="MISA AI">
          <slot name="ai-icon"><IconMisaAI /></slot>
        </button>
        <button class="btn-icon-white" title="AMIS Chat">
          <IconAmisChat />
          <span class="header-badge">20</span>
        </button>
        <button class="btn-icon-white" title="Thông báo">
          <TIcon name="bell" />
          <span class="header-badge">9</span>
        </button>
        <button class="btn-icon-white" title="Trợ giúp">
          <TIcon name="help-circle" />
        </button>
        <button class="btn-icon-white" title="Thêm tùy chọn">
          <TIcon name="dots-circle-horizontal" />
        </button>
      </div>
      <div class="header-avatar">VT</div>
    </div>
  </header>

  <!-- ── Settings Dialog ── -->
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="showSettings" class="dialog-overlay" @mousedown.self="cancelSettings">
        <Transition name="dialog">
          <div class="settings-dialog" @click.stop>
            <!-- Header -->
            <div class="settings-dialog__header">
              <span class="h2">Thiết lập màu sắc và hiển thị</span>
              <button class="btn-icon" @click="cancelSettings"><TIcon name="x" /></button>
            </div>

            <!-- Tabs -->
            <div class="settings-dialog__tabs">
              <button
                v-for="tab in dialogTabs" :key="tab.id"
                class="dialog-tab"
                :class="{ 'dialog-tab--active': activeTab === tab.id }"
                @click="activeTab = tab.id"
              >{{ tab.label }}</button>
            </div>

            <!-- Body -->
            <div class="settings-dialog__body">

              <!-- ── Tab: Thiết lập màu sắc ── -->
              <template v-if="activeTab === 'color'">

                <!-- Tiêu đề + Nền + Sidebar — luôn nằm trên, thấy ngay khi mở -->
                <div class="settings-options-row">
                  <div class="srow">
                    <span class="srow__label">Tiêu đề</span>
                    <div class="srow__btns">
                      <button v-for="m in modes" :key="m.value" class="sopt"
                        :class="{ 'sopt--active': draftMode === m.value }" type="button"
                        @click="draftMode = m.value">
                        <span class="sopt__dot" />{{ m.label }}
                      </button>
                    </div>
                  </div>
                  <div class="srow">
                    <span class="srow__label">Nền</span>
                    <div class="srow__btns">
                      <button v-for="t in bgTints" :key="t.value" class="sopt"
                        :class="{ 'sopt--active': draftBgTint === t.value }" type="button"
                        @click="draftBgTint = t.value">
                        <span class="sopt__dot" />{{ t.label }}
                      </button>
                    </div>
                  </div>
                  <div class="srow">
                    <span class="srow__label">Sidebar</span>
                    <div class="srow__btns">
                      <button v-for="s in sidebarModes" :key="s.value" class="sopt"
                        :class="{ 'sopt--active': draftSidebarMode === s.value }" type="button"
                        @click="draftSidebarMode = s.value">
                        <span class="sopt__dot" />{{ s.label }}
                      </button>
                    </div>
                  </div>
                </div>

                <p class="settings-section-title">Lựa chọn màu sắc bạn muốn hiển thị trên phần mềm</p>

                <!-- Color swatches -->
                <div class="color-swatches">
                  <div
                    v-for="c in COLORS" :key="c.id"
                    class="color-swatch"
                    :class="{ 'color-swatch--selected': draftColor === c.id }"
                    :style="draftColor === c.id ? { borderColor: c.main } : {}"
                    @click="draftColor = c.id"
                  >
                    <div class="color-swatch__preview">
                      <div
                        v-if="draftColor === c.id"
                        class="color-swatch__check"
                        :style="{ background: c.main }"
                      >
                        <TIcon name="check" />
                      </div>
                      <div class="color-swatch__block-left"  :style="{ background: c.light }"></div>
                      <div class="color-swatch__block-right" :style="{ background: c.gradient || c.main }"></div>
                    </div>
                    <span class="color-swatch__label">{{ c.label }}</span>
                  </div>
                </div>

                <!-- App mini preview -->
                <div class="preview-wrap" ref="previewWrapRef">
                  <div class="preview-inner" ref="previewInnerRef">
                    <!-- Mini App Shell -->
                    <div class="mini-app">
                      <!-- Mini Header -->
                      <div class="mini-header" :style="miniHeaderStyle">
                        <div class="mini-header-left">
                          <div style="width:14px;height:14px;border-radius:3px;background:rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center">
                            <div style="width:8px;height:8px;border-radius:50%;background:var(--bg-brand)"></div>
                          </div>
                          <div style="width:60px;height:8px;background:rgba(255,255,255,0.8);border-radius:3px"></div>
                        </div>
                        <div style="display:flex;align-items:center;gap:6px">
                          <div style="width:120px;height:18px;background:rgba(255,255,255,0.2);border-radius:4px"></div>
                        </div>
                        <div style="display:flex;align-items:center;gap:5px">
                          <div v-for="i in 5" :key="i" style="width:18px;height:18px;border-radius:4px;background:rgba(255,255,255,0.2)"></div>
                          <div style="width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,0.9)"></div>
                        </div>
                      </div>
                      <!-- Mini Sub-nav -->
                      <div class="mini-subnav">
                        <div v-for="(t,i) in ['Trợ lý AI','Tổng quan','Tính năng mới']" :key="i"
                          class="mini-subnav-tab"
                          :class="{ active: i===1 }"
                          :style="i===1 ? { color: previewColor.main, borderBottomColor: previewColor.main } : {}"
                        >{{ t }}</div>
                        <div style="flex:1"></div>
                        <div style="display:flex;align-items:center;gap:4px;font-size:9px;color:var(--text-brand);padding-bottom:6px" :style="{color: previewColor.main}">
                          <TIcon name="player-play" style="font-size:9px" /> Bắt đầu sử dụng
                        </div>
                      </div>
                      <!-- Mini Body -->
                      <div class="mini-body" :style="{ background: draftBgTint === 'color' ? previewColor.light : '#f0f2f4' }">
                        <!-- Mini Sidebar -->
                        <div class="mini-sidebar" :style="miniSidebarStyle">
                          <div style="padding:6px 4px 4px">
                            <div style="width:100%;height:16px;border-radius:3px;border:1px solid"
                              :style="{ borderColor: draftSidebarMode === 'dark' ? 'rgba(255,255,255,0.2)' : previewColor.main }"></div>
                          </div>
                          <div style="display:flex;flex-direction:column;gap:2px;padding:4px">
                            <div v-for="(item,i) in sidebarItems" :key="i"
                              style="display:flex;align-items:center;gap:4px;height:20px;padding:0 4px;border-radius:3px"
                              :style="i===activeNav
                                ? (draftSidebarMode === 'dark' ? { background: previewColor.main } : { background: previewColor.light })
                                : {}"
                            >
                              <div style="width:10px;height:10px;border-radius:2px;flex-shrink:0"
                                :style="{ background: i===activeNav ? 'rgba(255,255,255,0.9)' : (draftSidebarMode === 'dark' ? 'rgba(255,255,255,0.28)' : '#d5d7da') }"></div>
                              <div style="height:6px;border-radius:2px;flex:1"
                                :style="{ background: i===activeNav ? 'rgba(255,255,255,0.7)' : (draftSidebarMode === 'dark' ? 'rgba(255,255,255,0.2)' : '#d5d7da') }"></div>
                            </div>
                          </div>
                        </div>
                        <!-- Mini Main -->
                        <div class="mini-main">
                          <!-- Page header -->
                          <div style="display:flex;align-items:center;justify-content:space-between;height:28px;padding:0 10px;background:white;border-bottom:1px solid #e9eaeb;flex-shrink:0;gap:6px">
                            <div style="display:flex;align-items:center;gap:6px">
                              <div style="height:16px;width:90px;background:#f0f2f4;border-radius:3px;border:1px solid #d5d7da"></div>
                              <div style="height:16px;width:70px;background:#f0f2f4;border-radius:3px;border:1px solid #d5d7da"></div>
                              <div style="height:16px;width:55px;background:#f0f2f4;border-radius:3px;border:1px solid #d5d7da"></div>
                            </div>
                            <div style="display:flex;gap:5px">
                              <div style="height:16px;padding:0 8px;border-radius:3px;display:flex;align-items:center;font-size:7px;font-weight:600;white-space:nowrap"
                                :style="{ background: previewColor.light, color: previewColor.main }">
                                Phân tích với AVA
                              </div>
                              <div style="height:16px;padding:0 8px;border-radius:3px;border:1px solid #d5d7da;display:flex;align-items:center;font-size:7px;color:#717680">Tùy chỉnh</div>
                            </div>
                          </div>
                          <!-- Content -->
                          <div style="flex:1;overflow:hidden;padding:8px;display:flex;flex-direction:column;gap:8px">
                            <!-- Row 1: 3 stat cards -->
                            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
                              <div v-for="i in 3" :key="i" style="background:white;border-radius:5px;padding:8px;box-shadow:0 0 2px rgba(0,0,0,0.1)">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
                                  <div style="height:7px;width:60px;background:#f0f2f4;border-radius:2px"></div>
                                  <div style="height:14px;width:40px;background:#f0f2f4;border-radius:2px"></div>
                                </div>
                                <div style="height:14px;width:70%;background:#e9eaeb;border-radius:3px;margin-bottom:4px"></div>
                                <div style="height:7px;width:50%;background:#f0f2f4;border-radius:2px"></div>
                              </div>
                            </div>
                            <!-- Row 2: chart + pie -->
                            <div style="display:grid;grid-template-columns:2fr 1fr;gap:8px;flex:1">
                              <div style="background:white;border-radius:5px;padding:8px;box-shadow:0 0 2px rgba(0,0,0,0.1)">
                                <div style="height:7px;width:80px;background:#f0f2f4;border-radius:2px;margin-bottom:8px"></div>
                                <div style="height:60%;position:relative;overflow:hidden">
                                  <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none">
                                    <polyline
                                      :points="`0,60 40,45 80,55 120,30 160,40 200,20 240,35 280,15 300,25`"
                                      fill="none" :stroke="previewColor.main" stroke-width="1.5"
                                    />
                                    <polyline
                                      :points="`0,70 40,65 80,68 120,50 160,60 200,45 240,55 280,40 300,50`"
                                      fill="none" stroke="#f79009" stroke-width="1.5" stroke-dasharray="3,2"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div style="background:white;border-radius:5px;padding:8px;box-shadow:0 0 2px rgba(0,0,0,0.1);display:flex;flex-direction:column;align-items:center;justify-content:center">
                                <svg width="60" height="60" viewBox="0 0 60 60">
                                  <circle cx="30" cy="30" r="22" fill="none" stroke="#e9eaeb" stroke-width="8"/>
                                  <circle cx="30" cy="30" r="22" fill="none" :stroke="previewColor.main" stroke-width="8"
                                    stroke-dasharray="80 58" stroke-dashoffset="-14" stroke-linecap="round"/>
                                </svg>
                                <div style="display:flex;flex-direction:column;gap:4px;margin-top:6px;width:100%">
                                  <div v-for="i in 4" :key="i" style="display:flex;align-items:center;gap:4px">
                                    <div style="width:7px;height:7px;border-radius:2px;flex-shrink:0"
                                      :style="{ background: i===1 ? previewColor.main : '#d5d7da' }"></div>
                                    <div style="height:5px;flex:1;background:#f0f2f4;border-radius:2px"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ── Tab: Thiết lập hiển thị ── -->
              <template v-else-if="activeTab === 'display'">
                <p class="settings-section-title">Lựa chọn mật độ hiển thị dữ liệu trên phần mềm</p>
                <div class="density-options">
                  <label
                    v-for="d in DENSITIES" :key="d.id"
                    class="density-item"
                    :class="{ 'density-item--active': draftDensity === d.id }"
                    @click="draftDensity = d.id"
                  >
                    <div class="density-item__radio">
                      <span class="radio-circle" :class="{ 'radio-circle--checked': draftDensity === d.id }"></span>
                    </div>
                    <div class="density-item__preview">
                      <div v-for="i in 3" :key="i" class="density-row-mock" :style="{ height: d.height + 'px' }">
                        <div class="density-row-mock__bar"></div>
                        <div class="density-row-mock__bar density-row-mock__bar--short"></div>
                      </div>
                    </div>
                    <div class="density-item__info">
                      <span class="density-item__label">{{ d.label }}</span>
                      <span class="density-item__desc">{{ d.description }}</span>
                    </div>
                  </label>
                </div>
              </template>

              <!-- ── Tab: Hình nền ── -->
              <template v-else-if="activeTab === 'wallpaper'">
                <p class="settings-section-title">Chọn hình nền cho ứng dụng</p>
                <div class="wallpaper-grid">
                  <!-- Tùy chọn: Không có -->
                  <div
                    class="wallpaper-item wallpaper-item--none"
                    :class="{ 'wallpaper-item--selected': draftWallpaper === 'none' }"
                    @click="draftWallpaper = 'none'"
                  >
                    <div class="wallpaper-item__thumb wallpaper-item__thumb--none">
                      <TIcon name="x" style="font-size:28px;color:var(--text-hint)" />
                    </div>
                    <span class="wallpaper-item__label">Không có</span>
                    <span v-if="draftWallpaper === 'none'" class="wallpaper-check"><TIcon name="check" /></span>
                  </div>
                  <!-- Preset images -->
                  <div
                    v-for="wp in WALLPAPERS.filter(w => w.id !== 'none')"
                    :key="wp.id"
                    class="wallpaper-item"
                    :class="{ 'wallpaper-item--selected': draftWallpaper === wp.id }"
                    @click="draftWallpaper = wp.id"
                  >
                    <div
                      class="wallpaper-item__thumb"
                      :style="{ backgroundImage: wp.type === 'gradient' ? wp.thumb : `url(${wp.thumb})` }"
                    ></div>
                    <span class="wallpaper-item__label">{{ wp.label }}</span>
                    <span v-if="draftWallpaper === wp.id" class="wallpaper-check"><TIcon name="check" /></span>
                  </div>
                </div>
                <!-- Preview live nhỏ -->
                <div v-if="draftWallpaper !== 'none'" class="wallpaper-preview-wrap">
                  <div
                    class="wallpaper-preview"
                    :style="{ backgroundImage: WALLPAPERS.find(w=>w.id===draftWallpaper)?.type === 'gradient' ? WALLPAPERS.find(w=>w.id===draftWallpaper)?.thumb : `url(${WALLPAPERS.find(w=>w.id===draftWallpaper)?.thumb})` }"
                  >
                    <div class="wp-preview-header"></div>
                    <div class="wp-preview-body">
                      <div class="wp-preview-sidebar"></div>
                      <div class="wp-preview-main">
                        <div class="wp-preview-card"></div>
                        <div class="wp-preview-card"></div>
                        <div class="wp-preview-card wp-preview-card--wide"></div>
                      </div>
                    </div>
                  </div>
                  <p class="wp-preview-note">Kính mờ (glass) được áp dụng trên toàn bộ giao diện</p>
                </div>
              </template>

              <!-- ── Tab placeholders ── -->
              <template v-else>
                <div class="settings-placeholder">
                  <TIcon name="tool" style="font-size:48px;color:var(--text-hint)" />
                  <p class="text-secondary" style="margin-top:12px">Đang phát triển...</p>
                </div>
              </template>
            </div>

            <!-- Footer -->
            <div class="settings-dialog__footer">
              <button class="btn btn--outline" @click="cancelSettings">Hủy</button>
              <button class="btn btn--primary" @click="saveSettings">Lưu</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { COLORS, currentTheme, applyTheme, currentMode, applyMode, currentBgTint, applyBgTint, DENSITIES, currentDensity, applyDensity, WALLPAPERS, currentWallpaper, applyWallpaper, currentSidebarMode, applySidebarMode } from '../theme.js'
import TIcon        from './TIcon.vue'
import IconMisaAI   from './IconMisaAI.vue'
import IconAmisChat from './IconAmisChat.vue'

defineProps({
  appName: { type: String, default: 'Kế Toán' },
  appTag:  { type: String, default: '' },
  noMeta:  { type: Boolean, default: false },
})

/* ── Dialog state ── */
const showSettings = ref(false)
const activeTab    = ref('color')
const draftColor     = ref(currentTheme.value)
const draftMode      = ref(currentMode.value)
const draftBgTint    = ref(currentBgTint.value)
const draftDensity   = ref(currentDensity.value)
const draftWallpaper    = ref(currentWallpaper.value)
const draftSidebarMode  = ref(currentSidebarMode.value)

const sidebarModes = [
  { value: 'light', label: 'Nền trắng' },
  { value: 'dark',  label: 'Nền tối' },
]

const dialogTabs = [
  { id: 'color',      label: 'Thiết lập màu sắc' },
  { id: 'display',    label: 'Thiết lập hiển thị' },
  { id: 'wallpaper',  label: 'Hình nền' },
]
const modes = [
  { value: 'color', label: 'Màu đang chọn' },
  { value: 'light', label: 'Màu trắng' },
]
const bgTints = [
  { value: 'color', label: 'Màu đang chọn' },
  { value: 'gray',  label: 'Màu xám' },
]
const sidebarItems = Array(14).fill(0)
const activeNav    = ref(1)

const previewColor = computed(() => COLORS.find(c => c.id === draftColor.value) || COLORS[0])

const miniHeaderStyle = computed(() =>
  draftMode.value === 'light'
    ? { background: 'white', borderBottom: '1px solid #e9eaeb' }
    : { background: previewColor.value.gradient || previewColor.value.main }
)

const miniSidebarStyle = computed(() =>
  draftSidebarMode.value === 'dark'
    ? { background: '#1c1e26', borderRightColor: 'rgba(255,255,255,0.07)' }
    : {}
)

function openSettings() {
  activeTab.value        = 'color'
  draftColor.value       = currentTheme.value
  draftMode.value        = currentMode.value
  draftBgTint.value      = currentBgTint.value
  draftDensity.value     = currentDensity.value
  draftWallpaper.value   = currentWallpaper.value
  draftSidebarMode.value = currentSidebarMode.value
  showSettings.value     = true
  nextTick(() => scalePreview())
}
function cancelSettings() { showSettings.value = false }
function saveSettings() {
  applyTheme(draftColor.value)
  applyMode(draftMode.value)
  applyBgTint(draftBgTint.value)
  applyDensity(draftDensity.value)
  applyWallpaper(draftWallpaper.value)
  applySidebarMode(draftSidebarMode.value)
  showSettings.value = false
}

/* ── Preview scaling ── */
const previewWrapRef  = ref(null)
const previewInnerRef = ref(null)

function scalePreview() {
  if (!previewWrapRef.value || !previewInnerRef.value) return
  const w = previewWrapRef.value.offsetWidth
  const maxH = 200
  const scaleByW = w / 1440
  const scaleByH = maxH / 650
  const scale = Math.min(scaleByW, scaleByH)
  previewInnerRef.value.style.transform = `scale(${scale})`
  previewWrapRef.value.style.height = `${Math.round(650 * scale)}px`
}

watch(showSettings, (v) => { if (v) nextTick(scalePreview) })
watch(activeTab,    (v) => { if (v === 'color') nextTick(scalePreview) })
</script>

<style scoped>
/* ── Settings Dialog ── */
.dialog-overlay {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(16,24,40,0.45);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 20px; overflow-y: auto;
}
.settings-dialog {
  background: var(--bg-white);
  border-radius: var(--radius-dialog);
  width: 100%; max-width: 1440px;
  display: flex; flex-direction: column;
  max-height: calc(100vh - 40px);
  overflow: hidden; flex-shrink: 0;
}

/* Header */
.settings-dialog__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--dialog-py) var(--dialog-px);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}

/* Tabs */
.settings-dialog__tabs {
  display: flex; align-items: flex-end;
  padding: 0 var(--dialog-px);
  border-bottom: 1px solid var(--stroke-neutral-light);
  flex-shrink: 0;
}
.dialog-tab {
  height: 44px; padding: 0 16px;
  font-size: 13px; font-weight: var(--fw-medium);
  color: var(--text-secondary);
  border: none; background: transparent; cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.dialog-tab:hover { color: var(--text-primary); }
.dialog-tab--active { color: var(--text-brand); border-bottom-color: var(--stroke-brand); font-weight: var(--fw-semibold); }

/* Body */
.settings-dialog__body {
  flex: 1; min-height: 0; overflow-y: auto;
  padding: 24px var(--dialog-px) 16px;
  display: flex; flex-direction: column; gap: 20px;
}

/* Section title */
.settings-section-title {
  font-size: var(--text-h2); font-weight: var(--fw-semibold);
  color: var(--text-primary);
  text-align: center; line-height: var(--text-h2-lh);
}

/* Settings option rows — pill style */
.settings-options-row {
  display: flex; align-items: center; gap: 24px;
  justify-content: center; flex-wrap: wrap; row-gap: 12px;
}
.srow { display: flex; align-items: center; gap: 10px; }
.srow__label {
  font-size: 11px; font-weight: var(--fw-semibold);
  color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.06em;
  min-width: 44px; text-align: right; white-space: nowrap;
}
.srow__btns { display: flex; gap: 6px; }
.sopt {
  display: flex; align-items: center; gap: 6px;
  height: 28px; padding: 0 12px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--stroke-neutral);
  background: var(--bg-white);
  font-size: 12px; font-weight: var(--fw-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.sopt:hover { border-color: var(--stroke-brand); color: var(--text-brand); }
.sopt--active {
  border-color: var(--stroke-brand);
  background: var(--bg-brand-light);
  color: var(--text-brand);
  font-weight: var(--fw-semibold);
}
.sopt__dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--stroke-neutral); flex-shrink: 0;
  transition: background 0.15s;
}
.sopt--active .sopt__dot { background: var(--text-brand); }

/* Color swatches */
.color-swatches {
  display: flex; gap: 10px;
  flex-wrap: nowrap; overflow-x: auto;
  padding-bottom: 4px;
  justify-content: center;
}
.color-swatch {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer; flex-shrink: 0;
  padding: 6px; border-radius: var(--radius-default);
  border: 2px solid transparent;
  transition: border-color 0.15s, background 0.15s;
  background: var(--bg-white);
  min-width: 80px;
}
.color-swatch:hover { background: var(--bg-neutral-light); }
.color-swatch--selected { background: var(--bg-white); }

.color-swatch__preview {
  width: 72px; height: 40px;
  border-radius: 6px; overflow: hidden;
  display: flex; position: relative;
  border: 1px solid var(--stroke-neutral-light);
}
.color-swatch__block-left  { flex: 1; }
.color-swatch__block-right { flex: 1.6; }
.color-swatch__check {
  position: absolute; top: 4px; right: 4px;
  width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  z-index: 1;
}
.color-swatch__check .ti { font-size: 10px; color: white; }
.color-swatch__label {
  font-size: 12px; font-weight: var(--fw-medium);
  color: var(--text-primary); white-space: nowrap;
}

/* Preview wrap */
.preview-wrap {
  width: 100%; overflow: hidden;
  border-radius: var(--radius-default);
  border: 1px solid var(--stroke-neutral-light);
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
  display: flex; justify-content: center;
}
.preview-inner {
  width: 1440px;
  flex-shrink: 0;
  transform-origin: top center;
}

/* ── Mini App Styles ── */
.mini-app {
  display: flex; flex-direction: column;
  width: 1440px; height: 650px;
  background: var(--bg-page);
  font-family: var(--font-family);
  overflow: hidden;
}
.mini-header {
  display: flex; align-items: center; justify-content: space-between;
  height: 48px; padding: 0 16px; flex-shrink: 0; gap: 12px;
}
.mini-header-left { display: flex; align-items: center; gap: 8px; flex: 1; }
.mini-subnav {
  display: flex; align-items: flex-end;
  height: 44px; padding: 0 16px;
  background: white; border-bottom: 1px solid #e9eaeb;
  flex-shrink: 0; gap: 0;
}
.mini-subnav-tab {
  display: flex; align-items: center;
  height: 44px; padding: 0 14px;
  font-size: 10px; font-weight: 500; color: #717680;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}
.mini-subnav-tab.active { font-weight: 600; }
.mini-body {
  display: flex; flex: 1; overflow: hidden;
}
.mini-sidebar {
  width: 200px; flex-shrink: 0;
  background: white; border-right: 1px solid #e9eaeb;
  display: flex; flex-direction: column;
}
.mini-main {
  display: flex; flex-direction: column; flex: 1; overflow: hidden;
}

/* Footer */
.settings-dialog__footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 12px; padding: 12px var(--dialog-px);
  background: var(--neutral-50);
  border-top: 1px solid var(--stroke-neutral-light);
  border-radius: 0 0 var(--radius-dialog) var(--radius-dialog);
  flex-shrink: 0;
}

/* Density options */
.density-options {
  display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
}
.density-item {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  cursor: pointer; padding: 16px;
  border: 2px solid var(--stroke-neutral-light);
  border-radius: var(--radius-default);
  background: var(--bg-white);
  transition: border-color 0.15s, background 0.15s;
  min-width: 160px;
}
.density-item:hover { background: var(--bg-neutral-light); }
.density-item--active { border-color: var(--stroke-brand); background: var(--bg-white); }
.density-item__radio { display: flex; align-items: center; }
.density-item__preview {
  width: 100%; display: flex; flex-direction: column; gap: 2px;
  border: 1px solid var(--stroke-neutral-light); border-radius: 4px;
  overflow: hidden; background: var(--bg-page);
}
.density-row-mock {
  display: flex; align-items: center; gap: 6px; padding: 0 8px;
  border-bottom: 1px solid var(--stroke-neutral-light);
  background: var(--bg-white);
}
.density-row-mock:last-child { border-bottom: none; }
.density-row-mock__bar {
  height: 8px; width: 60%; border-radius: 3px; background: var(--bg-neutral-light);
}
.density-row-mock__bar--short { width: 30%; }
.density-item__info {
  display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center;
}
.density-item__label {
  font-size: 13px; font-weight: var(--fw-semibold); color: var(--text-primary);
}
.density-item__desc {
  font-size: 11px; color: var(--text-secondary); line-height: 1.4;
}

/* Placeholder */
.settings-placeholder {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; min-height: 200px;
}

/* ── Wallpaper picker ── */
.wallpaper-grid {
  display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
}
.wallpaper-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer; position: relative;
  border-radius: var(--radius-default);
  padding: 4px; border: 2px solid transparent;
  transition: border-color 0.15s;
}
.wallpaper-item:hover { border-color: var(--stroke-neutral); }
.wallpaper-item--selected { border-color: var(--stroke-brand); }

.wallpaper-item__thumb {
  width: 120px; height: 80px; border-radius: 8px;
  background-size: cover; background-position: center;
  border: 1px solid var(--stroke-neutral-light);
}
.wallpaper-item__thumb--none {
  background: var(--bg-neutral-light);
  display: flex; align-items: center; justify-content: center;
}
.wallpaper-item__label {
  font-size: 12px; font-weight: var(--fw-medium);
  color: var(--text-primary);
}
.wallpaper-check {
  position: absolute; top: 8px; right: 8px;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--bg-brand); color: #fff;
  display: flex; align-items: center; justify-content: center;
}
.wallpaper-check .ti { font-size: 12px; }

/* Mini preview */
.wallpaper-preview-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.wallpaper-preview {
  width: 480px; height: 280px; border-radius: 10px;
  background-size: cover; background-position: center;
  overflow: hidden; border: 1px solid var(--stroke-neutral-light);
  box-shadow: var(--shadow-md);
  display: flex; flex-direction: column;
}
.wp-preview-header {
  height: 36px; flex-shrink: 0;
  background: rgba(255,255,255,0.78);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.5);
}
.wp-preview-body { display: flex; flex: 1; overflow: hidden; }
.wp-preview-sidebar {
  width: 60px; flex-shrink: 0;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255,255,255,0.45);
}
.wp-preview-main {
  flex: 1; padding: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-content: flex-start;
}
.wp-preview-card {
  height: 70px; flex: 1; min-width: 100px;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 8px;
}
.wp-preview-card--wide { flex: 2; min-width: 200px; }
.wp-preview-note {
  font-size: 12px; color: var(--text-hint);
  margin: 0; text-align: center;
}

/* Transitions */
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from,  .overlay-leave-to      { opacity: 0; }
.dialog-enter-active, .dialog-leave-active   { transition: transform 0.22s ease, opacity 0.22s ease; }
.dialog-enter-from,  .dialog-leave-to        { transform: translateY(-16px); opacity: 0; }
</style>
