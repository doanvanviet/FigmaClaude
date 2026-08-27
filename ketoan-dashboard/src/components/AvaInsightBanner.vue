<template>
  <div v-if="visible" class="ava-banner">
    <!-- Header -->
    <div class="ava-banner__header">
      <div class="ava-banner__title-row">
        <IconAvaKeToan class="ava-banner__ai-icon" />
        <span class="ava-banner__name">AVA Kế toán</span>
        <span class="ava-banner__dot"></span>
        <span class="ava-banner__time"><TIcon name="clock" />Số liệu tính đến: {{ currentTime }}, Th{{ currentMonth }}</span>
      </div>
      <div class="ava-banner__meta">
        <button class="ava-btn-icon" title="Tải lại"><TIcon name="refresh" /></button>
        <button class="ava-banner__see-all">Xem tất cả <TIcon name="chevron-right" /></button>
        <button class="ava-btn-icon" @click="dismiss" title="Đóng"><TIcon name="x" /></button>
      </div>
    </div>

    <!-- Body — tối đa 3 thông báo AI, còn lại xem ở "Xem tất cả" -->
    <div class="ava-banner__body">
      <div v-for="(sec, i) in visibleSections" :key="i" class="ava-banner__card">
        <div class="ava-banner__card-head">
          <span class="ava-banner__card-title">{{ sec.title }}</span>
          <button class="ava-banner__cta"><TIcon name="sparkles" />Phân tích chuyên sâu</button>
        </div>
        <div class="ava-banner__card-text" v-html="sec.html ?? demoHtml(i)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TIcon        from '@mds/components/TIcon.vue'
import IconAvaKeToan from './IconAvaKeToan.vue'

// Tự inject 1 lần definition <linearGradient id="ai-icon-gradient"> vào document
// (giống BorderBeamButton.vue) để icon trong .ava-banner__cta tô được đúng AI Gradient.
onMounted(() => {
  if (document.getElementById('ai-icon-gradient')) return
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.setAttribute('style', 'position:absolute')
  svg.setAttribute('aria-hidden', 'true')
  svg.innerHTML = `
    <defs>
      <linearGradient id="ai-icon-gradient" x1="0%" y1="0%" x2="100%" y2="35%">
        <stop offset="8.87%" stop-color="#1482ff" />
        <stop offset="100%" stop-color="#cf11ff" />
      </linearGradient>
    </defs>
  `
  document.body.appendChild(svg)
})

const props = defineProps({
  sections: {
    type: Array,
    default: () => [
      { title: 'Dòng tiền thuần' },
      { title: 'Rủi ro & Khuyến nghị' },
      { title: 'Tăng trưởng doanh thu' },
    ]
  },
  moduleId: {
    type: String,
    required: true
  }
})

// Tối đa 3 thông báo hiện ngoài banner, còn lại xem qua "Xem tất cả"
const visibleSections = computed(() => props.sections.slice(0, 3))

// Dữ liệu demo tạm (chưa có API) — ví dụ cụ thể, highlight từ khóa chính (xanh = tích cực, đỏ = cảnh báo)
const DEMO_HTML = [
  'Dòng tiền thuần <span class="hl hl--success">thặng dư lớn</span>, doanh nghiệp đang <span class="hl hl--success">tăng trưởng tốt</span> và có khả năng tự tài trợ <span class="hl hl--success">dồi dào</span>.',
  'Tiền mặt nhàn rỗi lớn dẫn đến nguy cơ <span class="hl hl--danger">lãng phí, giảm hiệu suất</span> sinh lời của vốn. Bạn nên xem xét đầu tư hoặc ưu tiên thanh toán các khoản công nợ.',
  'Doanh thu tháng này <span class="hl hl--success">tăng 28%</span> so với tháng trước, chủ yếu nhờ nhóm hàng thời trang <span class="hl hl--success">bứt phá</span>.',
]
function demoHtml(i) { return DEMO_HTML[i % DEMO_HTML.length] }

const storageKey = `ava-banner-dismissed-${props.moduleId}`
const dismissed = ref(localStorage.getItem(storageKey) === '1')
// Ẩn tạm (vd: khi mở panel chi tiết để tiết kiệm chỗ) — không lưu localStorage, không phải người dùng chủ động tắt
const tempHidden = ref(false)
const visible = computed(() => !dismissed.value && !tempHidden.value)

function dismiss() {
  dismissed.value = true
  localStorage.setItem(storageKey, '1')
}

function show() {
  dismissed.value = false
  tempHidden.value = false
  localStorage.removeItem(storageKey)
}

function hide()   { tempHidden.value = true }
function unhide() { tempHidden.value = false }

function toggle() {
  if (visible.value) dismiss()
  else show()
}

defineExpose({ show, hide, unhide, toggle })

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentTime  = now.getHours() + 'h' + String(now.getMinutes()).padStart(2, '0')
</script>

<style scoped>
.ava-banner {
  position: relative;
  border-radius: 8px;
  background:
    linear-gradient(#ffffffbf, #ffffffbf) padding-box,
    var(--mi-bg-dashboard-inside) center / cover no-repeat padding-box,
    linear-gradient(98deg, #3794ff 8.87%, #d52bff) border-box;
  border: 1.5px solid transparent;
  isolation: isolate;
  flex-shrink: 0;
  overflow: hidden;
  margin-bottom: 8px;
}

/* ── Header ── */
.ava-banner__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px 4px;
  gap: 12px;
}
.ava-banner__title-row {
  display: flex; align-items: center; gap: 8px;
}
.ava-banner__ai-icon { width: 16px; height: 16px; flex-shrink: 0; }
.ava-banner__name {
  font-size: 13px; font-weight: var(--fw-semibold);
  background: linear-gradient(106deg, #1482ff 8.87%, #cf11ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}

/* Pulsing dot — AI đang hoạt động */
.ava-banner__dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #22c55e; flex-shrink: 0;
  animation: ava-pulse 2.4s ease-in-out infinite;
}
@keyframes ava-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  50%       { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
}

.ava-banner__time {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; color: var(--text-secondary);
}
.ava-banner__time :deep(.t-icon) { font-size: 12px; }

.ava-banner__meta { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }

.ava-btn-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
  border-radius: var(--radius-sm); border: none;
  background: transparent; cursor: pointer;
  color: var(--icon-neutral);
  transition: background 0.15s, color 0.15s;
}
.ava-btn-icon:hover { background: rgba(124, 58, 237, 0.08); color: var(--text-accent); }
.ava-btn-icon :deep(.t-icon) { font-size: 13px; }

.ava-banner__see-all {
  display: flex; align-items: center; gap: 2px;
  font-size: 13px; font-weight: var(--fw-regular);
  color: #245fdf;
  background: none; border: none; cursor: pointer;
  padding: 2px 6px; border-radius: var(--radius-sm);
  transition: background 0.15s;
}
.ava-banner__see-all:hover { background: rgba(255,255,255,0.6); }
.ava-banner__see-all :deep(.t-icon) { font-size: 13px; }

/* ── Body — 3 card trắng tách biệt rõ tiêu đề / nội dung ── */
.ava-banner__body {
  display: flex; gap: 8px;
  padding: 0 12px 12px;
}
.ava-banner__card {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: 8px;
  padding: 8px 12px;
  background: var(--bg-white);
  border: 1px solid var(--stroke-neutral-light);
  border-radius: var(--radius-inner);
}
.ava-banner__card-head {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 8px;
}
.ava-banner__card-title {
  font-size: 13px; font-weight: var(--fw-bold);
  color: var(--text-primary);
}
.ava-banner__card-text {
  font-size: 13px; color: var(--text-primary); line-height: 18px;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden;
}
.ava-banner__card-text :deep(.hl) { font-weight: var(--fw-semibold); }
.ava-banner__card-text :deep(.hl--success) { color: var(--text-success); }
.ava-banner__card-text :deep(.hl--danger)  { color: var(--text-danger); }
.ava-banner__cta {
  display: inline-flex; align-items: center; gap: 4px;
  flex-shrink: 0; white-space: nowrap;
  font-size: 13px; font-weight: var(--fw-medium);
  border: none; cursor: pointer; padding: 0;
  background: linear-gradient(106deg, #1482ff 8.87%, #cf11ff 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}
.ava-banner__cta :deep(.t-icon) { font-size: 13px; }
.ava-banner__cta :deep(svg) * { stroke: url(#ai-icon-gradient) !important; }
.ava-banner__cta:hover { text-decoration: underline; }
</style>
