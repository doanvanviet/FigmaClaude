<template>
  <div class="app-wrapper">
    <RouterView />
  </div>
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

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app { height: 100%; }
.app-wrapper { width: 100%; height: 100vh; overflow: hidden; }
</style>
