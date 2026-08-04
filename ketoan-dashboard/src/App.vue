<template>
  <div class="app-wrapper">
    <div class="app-content">
      <RouterView />
    </div>
    <Transition name="ava-slide">
      <AVAChatPanel v-if="showAvaChat" @close="closeAva" @resize="onAvaResize" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from 'vue'
import { applyTheme, currentTheme, applyDensity, currentDensity, applyMode, currentMode } from '@mds/theme.js'
import AVAChatPanel from './components/AVAChatPanel.vue'

const showAvaChat = ref(false)
const avaPanelWidth = ref(420)

function toggleAva() { showAvaChat.value = !showAvaChat.value }
function closeAva()  { showAvaChat.value = false }
function onAvaResize(w) { avaPanelWidth.value = w }

/* Sync --ava-panel-width lên :root để overlay popup biết vùng chat đang chiếm bao nhiêu */
watchEffect(() => {
  const w = showAvaChat.value ? avaPanelWidth.value : 0
  document.documentElement.style.setProperty('--ava-panel-width', w + 'px')
})

/* Event delegation — intercept nút MISA AI ở bất kỳ trang nào */
function handleDocClick(e) {
  if (e.target.closest('[title="MISA AI"]')) {
    e.stopPropagation()
    toggleAva()
  }
}

onMounted(() => {
  applyTheme(currentTheme.value)
  applyDensity(currentDensity.value)
  applyMode(currentMode.value)
  document.addEventListener('click', handleDocClick, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocClick, true)
})
</script>

<style>
/* ── App-level layout: panel đẩy app-content vào, không overlay ── */
.app-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;   /* theo body (có min-width), không phải 100vw (= viewport) */
  height: 100vh;
  overflow: hidden;
}

/* app-content: flex:1 nhường chỗ cho panel.
   overflow-x:auto → scroll cục bộ khi app-shell (min-width:1024px) bị nén < 1024px */
.app-content {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

/* ── AVA slide-in: clip-path tránh GPU layer thoát overflow ── */
.ava-slide-enter-active { transition: clip-path 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease; }
.ava-slide-leave-active { transition: clip-path 0.22s ease-in, opacity 0.18s ease; }
.ava-slide-enter-from  { clip-path: inset(0 0 0 100%); opacity: 0; }
.ava-slide-leave-to    { clip-path: inset(0 0 0 100%); opacity: 0; }
</style>
