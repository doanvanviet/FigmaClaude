<template>
  <div class="ibox" :class="boxClass">
    <TIcon :name="iconName" class="ibox__icon" />
    <input
      class="ibox__native ibox__native--date"
      :type="inputType"
      :value="modelValue"
      :placeholder="placeholder || placeholderByType"
      :disabled="disabled || state === 'disabled'"
      :readonly="readonly || state === 'readonly'"
      @change="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TIcon from './TIcon.vue'

const props = defineProps({
  modelValue:  { type: String,  default: '' },
  type:        { type: String,  default: 'date' }, // date | datetime-local | time
  placeholder: { type: String,  default: '' },
  state:       { type: String,  default: 'default' },
  outline:     { type: Boolean, default: true },
  size:        { type: String,  default: 'md' },
  disabled:    { type: Boolean, default: false },
  readonly:    { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'change'])

const inputType = computed(() => props.type)

const iconName = computed(() => {
  if (props.type === 'time') return 'clock'
  return 'calendar'
})

const placeholderByType = computed(() => {
  if (props.type === 'time') return 'HH:MM'
  if (props.type === 'datetime-local') return 'DD/MM/YYYY HH:MM'
  return 'DD/MM/YYYY'
})

const boxClass = computed(() => ({
  'ibox--no-border': !props.outline,
  'ibox--error':     props.state === 'error',
  'ibox--success':   props.state === 'success',
  'ibox--warning':   props.state === 'warning',
  'ibox--disabled':  props.state === 'disabled' || props.disabled,
  'ibox--readonly':  props.state === 'readonly'  || props.readonly,
  'ibox--sm':        props.size === 'sm',
}))
</script>
