<template>
  <span class="app-tag" :class="`app-tag--${color}`">
    <span v-if="dot" class="app-tag__dot" />
    <span class="app-tag__label">{{ label }}</span>
  </span>
</template>

<script setup>
defineProps({
  /** Text hiển thị bên trong tag */
  label: { type: String, required: true },
  /** Màu sắc: brand | success | warning | danger | neutral */
  color: { type: String, default: 'neutral' },
  /** Hiện dấu chấm màu (dot indicator) bên trái — dùng cho status tag */
  dot: { type: Boolean, default: false },
})
</script>
