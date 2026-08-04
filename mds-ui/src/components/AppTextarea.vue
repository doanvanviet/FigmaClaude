<template>
  <div class="ibox ibox--area" :class="boxClass">
    <textarea
      class="ibox__native ibox__native--area"
      :style="{ minHeight: minHeight + 'px', maxHeight: maxHeight ? maxHeight + 'px' : undefined, resize: resize ? 'vertical' : 'none' }"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength || undefined"
      :disabled="disabled || state === 'disabled'"
      :readonly="readonly || state === 'readonly'"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue:  { type: String,  default: '' },
  placeholder: { type: String,  default: '' },
  state:       { type: String,  default: 'default' }, // default | error | success | warning | disabled | readonly
  outline:     { type: Boolean, default: true },
  minHeight:   { type: Number,  default: 80 },
  maxHeight:   { type: Number,  default: 0 },
  resize:      { type: Boolean, default: true },
  maxlength:   { type: Number,  default: 0 },
  disabled:    { type: Boolean, default: false },
  readonly:    { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const boxClass = computed(() => ({
  'ibox--no-border': !props.outline,
  'ibox--error':     props.state === 'error',
  'ibox--success':   props.state === 'success',
  'ibox--warning':   props.state === 'warning',
  'ibox--disabled':  props.state === 'disabled' || props.disabled,
  'ibox--readonly':  props.state === 'readonly'  || props.readonly,
}))
</script>
