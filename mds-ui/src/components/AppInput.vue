<template>
  <div class="input-field" :class="{ 'input-field--row': !vertical }">
    <div v-if="label" class="input-field__label-wrap">
      <span class="input-field__label">{{ label }}</span>
      <span v-if="required" class="input-field__required">*</span>
    </div>
    <div class="input-field__body">
      <slot />
      <span v-if="caption" class="input-field__caption">{{ caption }}</span>
      <span v-if="message" class="input-field__message" :class="`input-field__message--${messageType}`">
        <TIcon v-if="messageType === 'error'"   name="circle-x"        />
        <TIcon v-else-if="messageType === 'success'" name="circle-check"   />
        <TIcon v-else-if="messageType === 'warning'" name="alert-triangle" />
        <TIcon v-else-if="messageType === 'info'"    name="info-circle"    />
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script setup>
import TIcon from './TIcon.vue'

defineProps({
  label:       { type: String,  default: '' },
  required:    { type: Boolean, default: false },
  vertical:    { type: Boolean, default: true },
  caption:     { type: String,  default: '' },
  message:     { type: String,  default: '' },
  messageType: { type: String,  default: 'error' }, // error | success | warning | info
})
</script>
