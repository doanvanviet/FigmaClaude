<template>
  <div ref="wrapRef" class="search-popover-wrap" @click="open" @keydown.escape="close">
    <div class="search-box-header">
      <TIcon name="search" />
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="Tìm kiếm..."
        @focus="open"
      />
    </div>
  </div>

  <Teleport to="body">
    <Transition name="search-pop">
      <div v-if="show" ref="popRef" class="sh-popover" :style="popStyle">

        <!-- AI header strip -->
        <div class="sh-ai-header">
          <span class="sh-ai-icon">✦</span>
          <span class="sh-ai-title">Tìm kiếm thông minh</span>
          <span class="sh-ai-shortcut">Ctrl + K</span>
        </div>

        <!-- Top từ khóa -->
        <div class="sh-section">
          <p class="sh-label">
            <span class="sh-label-badge sh-label-badge--hot"><TIcon name="trending-up" /></span>
            Top từ khóa tìm nhiều nhất
          </p>
          <div class="sh-chips">
            <span v-for="kw in TOP_KW" :key="kw" class="sh-chip" @mousedown.prevent="pick(kw)">{{ kw }}</span>
          </div>
        </div>

        <div class="sh-divider"></div>

        <!-- Gần đây -->
        <div class="sh-section">
          <p class="sh-label">
            <span class="sh-label-badge sh-label-badge--recent"><TIcon name="clock" /></span>
            Gần đây
          </p>
          <div class="sh-recents">
            <button v-for="r in RECENT_KW" :key="r" class="sh-recent-item" @mousedown.prevent="pick(r)">
              <TIcon name="clock-hour-4" class="sh-recent-icon" />
              <span>{{ r }}</span>
            </button>
          </div>
        </div>

        <div class="sh-divider"></div>

        <!-- Gợi ý -->
        <div class="sh-hints">
          <p class="sh-hints-header">
            <TIcon name="bulb" class="sh-hints-icon" />
            Gợi ý cách nhập từ khóa
          </p>
          <div class="sh-hint-card">
            <span class="sh-hint-badge">Cơ bản</span>
            <p class="sh-hint-title">Gợi ý cách nhập từ khóa tìm kiếm cơ bản</p>
            <p class="sh-hint-item"><strong>Tìm kiếm chứng từ:</strong> Nhập số chứng từ, số hóa đơn, ngày chứng từ, tên đối tượng (VD: PC00001)</p>
            <p class="sh-hint-item"><strong>Tìm kiếm danh mục:</strong> Nhập mã hoặc tên danh mục (VD: KH00002)</p>
            <p class="sh-hint-item"><strong>Tìm kiếm tính năng, báo cáo hoặc tùy chọn:</strong> Nhập tên chức năng, tên báo cáo hoặc tên tùy chọn (VD: Thêm mới khách hàng)</p>
          </div>
          <div class="sh-hint-card">
            <span class="sh-hint-badge sh-hint-badge--ai">AI</span>
            <p class="sh-hint-title">Gợi ý cách nhập từ khóa tìm kiếm nhiều điều kiện</p>
            <p class="sh-hint-item">Ví dụ 1: Tìm phiếu chi tiền cho Nguyễn Minh Anh trong tháng này.</p>
            <p class="sh-hint-item">Ví dụ 2: Tìm chứng từ bán hàng cho Công ty cổ phần ABC trong tháng này.</p>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TIcon from '@mds/components/TIcon.vue'

const TOP_KW    = ['Phiếu chi tiền', 'Hóa đơn đầu vào', 'Phiếu thu tiền', 'Báo cáo tổng hợp', 'Khách hàng', 'Nhà cung cấp']
const RECENT_KW = ['PC00001', 'KH00002', 'Thêm mới khách hàng', 'Báo cáo doanh thu', 'Phiếu nhập kho']

const wrapRef  = ref(null)
const inputRef = ref(null)
const popRef   = ref(null)
const query    = ref('')
const show     = ref(false)
const popStyle = ref({})

function open() {
  if (wrapRef.value) {
    const r = wrapRef.value.getBoundingClientRect()
    popStyle.value = {
      position: 'fixed',
      top:   (r.bottom + 8) + 'px',
      left:  (r.left + r.width / 2 - 260) + 'px',
      width: '520px',
      zIndex: 9500,
    }
  }
  show.value = true
}
function close() { show.value = false }
function pick(kw) { query.value = kw; close() }

function onDocMousedown(e) {
  if (!wrapRef.value?.contains(e.target) && !popRef.value?.contains(e.target)) close()
}
onMounted(() => document.addEventListener('mousedown', onDocMousedown))
onUnmounted(() => document.removeEventListener('mousedown', onDocMousedown))
</script>

<style scoped>
.search-popover-wrap { position: relative; }

/* ── Popover shell ── */
.sh-popover {
  background: #ffffff;
  border-radius: 16px;
  box-shadow:
    0 0 0 1px rgba(109, 40, 217, 0.08),
    0 24px 48px -8px rgba(16, 24, 40, 0.16),
    0 8px 20px -4px rgba(109, 40, 217, 0.10);
  overflow: hidden;
  font-family: var(--font-family);
}

/* ── AI header ── */
.sh-ai-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px 9px;
  background: linear-gradient(110deg, #f5f3ff 0%, #eff6ff 60%, #f0fdf4 100%);
  border-bottom: 1px solid rgba(109, 40, 217, 0.10);
}
.sh-ai-icon {
  font-size: 14px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}
.sh-ai-title {
  font-size: 12px;
  font-weight: 600;
  background: linear-gradient(90deg, #6d28d9, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  flex: 1;
}
.sh-ai-shortcut {
  font-size: 11px;
  color: #a4a7ae;
  background: #f0f2f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  border: 1px solid #e9eaeb;
}

/* ── Sections ── */
.sh-section { padding: 12px 16px 10px; }
.sh-label {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600; color: #a4a7ae;
  text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 10px;
}
.sh-label-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0;
  font-size: 13px;
}
.sh-label-badge--hot    { background: #fff1e6; color: #f97316; }
.sh-label-badge--recent { background: #eff6ff; color: #3b82f6; }
.sh-label-badge .ti     { font-size: 13px; }
.sh-divider { height: 1px; background: #f0f2f4; }

/* ── Chips ── */
.sh-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.sh-chip {
  display: inline-flex; align-items: center;
  height: 27px; padding: 0 11px;
  background: linear-gradient(135deg, #f5f3ff, #eff6ff);
  color: #6d28d9;
  font-size: 12px; font-weight: 500;
  border-radius: 9999px; cursor: pointer;
  border: 1px solid rgba(109, 40, 217, 0.15);
  transition: all 0.15s; user-select: none;
}
.sh-chip:hover {
  background: linear-gradient(135deg, #ede9fe, #dbeafe);
  border-color: rgba(109, 40, 217, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.15);
}

/* ── Recent items ── */
.sh-recents { display: flex; flex-direction: column; gap: 1px; }
.sh-recent-item {
  display: flex; align-items: center; gap: 8px;
  height: 34px; padding: 0 8px;
  border: none; background: transparent; border-radius: 8px;
  cursor: pointer; font-size: 13px; color: #101828;
  text-align: left; width: 100%;
  transition: background 0.12s; font-family: var(--font-family);
}
.sh-recent-item:hover { background: #f5f3ff; }
.sh-recent-icon  { color: #c4b5fd; font-size: 14px; flex-shrink: 0; }
.sh-recent-enter {
  color: #d5d7da; font-size: 12px; margin-left: auto; flex-shrink: 0;
  opacity: 0; transition: opacity 0.12s;
}
.sh-recent-item:hover .sh-recent-enter { opacity: 1; }

/* ── Hints section ── */
.sh-hints {
  padding: 12px 16px 14px;
  background: linear-gradient(160deg, #fafaf9 0%, #f8f8ff 100%);
  display: flex; flex-direction: column; gap: 8px;
}
.sh-hints-header {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 600;
  color: #7c3aed;
  text-transform: uppercase; letter-spacing: 0.07em;
  margin: 0 0 2px;
}
.sh-hints-icon { font-size: 13px; }

.sh-hint-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 11px 14px 11px 16px;
  box-shadow: 0 1px 4px rgba(16,24,40,0.06), 0 0 0 1px rgba(16,24,40,0.04);
  position: relative;
  overflow: hidden;
}
.sh-hint-card::before {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 3px; bottom: 0;
  background: linear-gradient(180deg, #7c3aed 0%, #3b82f6 100%);
  border-radius: 0 2px 2px 0;
}

.sh-hint-badge {
  display: inline-flex; align-items: center;
  height: 18px; padding: 0 7px;
  font-size: 10px; font-weight: 700;
  border-radius: 4px;
  background: #ede9fe; color: #6d28d9;
  margin-bottom: 6px;
  letter-spacing: 0.03em;
}
.sh-hint-badge--ai {
  background: linear-gradient(90deg, #6d28d9, #2563eb);
  color: #ffffff;
}
.sh-hint-title { font-size: 12px; font-weight: 600; color: #101828; margin: 0 0 7px; }
.sh-hint-item  { font-size: 12px; color: #535760; line-height: 19px; margin: 0 0 3px; }
.sh-hint-item:last-child { margin-bottom: 0; }
.sh-hint-item strong { color: #101828; font-weight: 600; }

/* ── Transition ── */
.search-pop-enter-active, .search-pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
.search-pop-enter-from, .search-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
