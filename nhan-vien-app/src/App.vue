<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { applyTheme, currentTheme, applyDensity, currentDensity, applyMode, currentMode } from '@mds/theme.js'
onMounted(() => {
  const theme = localStorage.getItem('mds-theme') || 'purple'
  applyTheme(theme)
  applyDensity(currentDensity.value)
  applyMode(currentMode.value)
})
</script>
