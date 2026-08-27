<template>
  <img :src="avaIcon" alt="AVA Kế toán" class="icon-ava-ketoan" />
</template>

<script setup>
import avaIcon from '../assets/ava-ketoan.webp'
</script>

<style scoped>
.icon-ava-ketoan {
  width: 24px; height: 24px;
  border-radius: 50%;
  object-fit: cover;
  display: inline-block;
  flex-shrink: 0;
}
</style>
