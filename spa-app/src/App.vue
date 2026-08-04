<template>
  <RouterView />
</template>

<script setup>
import { applyTheme } from '@mds/theme.js'

// Default theme = pink (spa & làm đẹp). User có thể đổi qua Settings trong ControlHeader.
if (!localStorage.getItem('mds-theme')) {
  applyTheme('pink')
} else {
  applyTheme(localStorage.getItem('mds-theme'))
}
</script>
