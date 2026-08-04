<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { applyTheme, currentTheme, applyDensity, currentDensity, applyMode, currentMode } from '@mds/theme.js'
onMounted(() => {
  applyTheme(currentTheme.value)
  applyDensity(currentDensity.value)
  applyMode(currentMode.value)
})
</script>
