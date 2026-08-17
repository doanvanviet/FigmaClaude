<template>
  <div v-if="visible" class="ava-banner">
    <!-- Header -->
    <div class="ava-banner__header">
      <div class="ava-banner__title-row">
        <IconMisaAI class="ava-banner__ai-icon" />
        <span class="ava-banner__name">AVA Kế toán</span>
        <span class="ava-banner__dot"></span>
      </div>
      <div class="ava-banner__meta">
        <span class="ava-banner__period">Tháng {{ currentMonth }}</span>
        <span class="ava-banner__divv"></span>
        <span class="ava-banner__time"><TIcon name="clock" />Số liệu tính đến: {{ currentTime }}</span>
        <button class="ava-btn-icon" title="Tải lại"><TIcon name="refresh" /></button>
        <button class="ava-banner__see-all">Xem tất cả <TIcon name="chevron-right" /></button>
        <button class="ava-btn-icon" @click="dismiss"><TIcon name="x" /></button>
      </div>
    </div>

    <!-- Body -->
    <div class="ava-banner__body">
      <template v-for="(sec, i) in sections" :key="i">
        <div v-if="i > 0" class="ava-banner__sep"></div>
        <div class="ava-banner__section">
          <div class="ava-banner__sec-label">{{ sec.title }}</div>
          <div class="ava-banner__sec-empty">Chưa có dữ liệu phân tích.</div>
          <button class="ava-banner__cta">Phân tích chuyên sâu</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TIcon      from '@mds/components/TIcon.vue'
import IconMisaAI from '@mds/components/IconMisaAI.vue'

const props = defineProps({
  sections: {
    type: Array,
    default: () => [
      { title: 'Dòng tiền thuần' },
      { title: 'Rủi ro & Khuyến nghị' },
    ]
  },
  moduleId: {
    type: String,
    required: true
  }
})

const storageKey = `ava-banner-dismissed-${props.moduleId}`
const visible = ref(localStorage.getItem(storageKey) !== '1')

function dismiss() {
  visible.value = false
  localStorage.setItem(storageKey, '1')
}

const now = new Date()
const currentMonth = now.getMonth() + 1
const currentTime  = now.getHours() + 'h' + String(now.getMinutes()).padStart(2, '0')
</script>

<style scoped>
/* Gradient border trick: padding-box + border-box */
.ava-banner {
  position: relative;
  border-radius: var(--radius-default);
  background:
    linear-gradient(135deg, #ece5fd 0%, #f7e8ff 45%, #e5edfe 100%) padding-box,
    linear-gradient(135deg, #7c3aed 0%, #a855f7 35%, #ec4899 65%, #38bdf8 100%) border-box;
  border: 1.5px solid transparent;
  box-shadow: 0 2px 12px rgba(124, 58, 237, 0.1), var(--shadow-card);
  flex-shrink: 0;
  overflow: hidden;
  margin-bottom: 8px;
}

/* ── Header ── */
.ava-banner__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 14px;
  border-bottom: none;
  gap: 12px;
}
.ava-banner__title-row {
  display: flex; align-items: center; gap: 7px;
}
.ava-banner__ai-icon {
  width: 20px; height: 20px; flex-shrink: 0;
}
.ava-banner__name {
  font-size: 13px; font-weight: var(--fw-semibold);
  color: var(--text-primary);
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

/* Meta */
.ava-banner__meta {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.ava-banner__period {
  font-size: var(--text-sm); font-weight: var(--fw-medium);
  color: var(--text-secondary);
}
.ava-banner__divv {
  width: 1px; height: 12px; background: var(--stroke-neutral-light);
}
.ava-banner__time {
  display: flex; align-items: center; gap: 4px;
  font-size: var(--text-sm); color: var(--text-hint);
}
.ava-banner__time :deep(.t-icon) { font-size: 12px; }

.ava-btn-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px;
  border-radius: var(--radius-sm); border: none;
  background: transparent; cursor: pointer;
  color: var(--icon-neutral);
  transition: background 0.15s, color 0.15s;
}
.ava-btn-icon:hover { background: rgba(124, 58, 237, 0.08); color: var(--text-accent); }
.ava-btn-icon :deep(.t-icon) { font-size: 14px; }

.ava-banner__see-all {
  display: flex; align-items: center; gap: 2px;
  font-size: var(--text-sm); font-weight: var(--fw-medium);
  color: var(--text-link);
  background: none; border: none; cursor: pointer;
  padding: 2px 6px; border-radius: var(--radius-sm);
  transition: background 0.15s;
}
.ava-banner__see-all:hover { background: var(--bg-brand-light); }
.ava-banner__see-all :deep(.t-icon) { font-size: 12px; }

/* ── Body ── */
.ava-banner__body {
  display: flex; gap: 10px;
  padding: 0 12px 12px;
}
.ava-banner__sep { display: none; }
.ava-banner__section {
  flex: 1; min-width: 0;
  padding: 10px 12px;
  background: var(--bg-white);
  border-radius: var(--radius-inner);
  box-shadow: var(--shadow-card);
  display: flex; flex-direction: column; gap: 4px;
}
.ava-banner__sec-label {
  font-size: var(--text-sm); font-weight: var(--fw-semibold);
  color: var(--text-primary);
}
.ava-banner__sec-empty {
  font-size: var(--text-sm); color: var(--text-hint);
}
.ava-banner__cta {
  display: inline-flex; align-items: center;
  font-size: var(--text-sm); font-weight: var(--fw-medium);
  color: var(--text-link);
  background: none; border: none; cursor: pointer; padding: 0;
  margin-top: 2px; transition: color 0.15s;
}
.ava-banner__cta:hover { text-decoration: underline; }
</style>
