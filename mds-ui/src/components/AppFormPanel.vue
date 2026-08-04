<template>
  <div class="form-panel">
    <!-- Header -->
    <div class="form-header" :class="{ 'form-header--divider': divider }">
      <span class="form-header__title">
        <slot name="title">{{ title }}</slot>
      </span>
      <slot name="header-end">
        <button v-if="closable" class="btn-icon" @click="$emit('close')">
          <TIcon name="x" />
        </button>
      </slot>
    </div>

    <!-- Toolbar slot — for tabs, toolbars, sub-headers (rendered outside form-body) -->
    <slot name="toolbar" />

    <!-- Body -->
    <div class="form-body">
      <slot />
    </div>

    <!-- Footer (only rendered if slot is provided) -->
    <div v-if="$slots.footer" class="form-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import TIcon from './TIcon.vue'

defineProps({
  title:    { type: String,  default: '' },
  divider:  { type: Boolean, default: true },
  closable: { type: Boolean, default: true },
})

defineEmits(['close'])
</script>
