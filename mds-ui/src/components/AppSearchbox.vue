<template>
  <div class="ibox" :class="boxClass" style="cursor:text">
    <TIcon name="search" class="ibox__icon" />
    <input
      class="ibox__native"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled || state === 'disabled'"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('search', modelValue)"
    />
    <span v-if="clearable && modelValue" class="ibox__icon ibox__icon--clear" @click="$emit('update:modelValue', ''); $emit('clear')">
      <TIcon name="x" />
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TIcon from './TIcon.vue'

const props = defineProps({
  modelValue:  { type: String,  default: '' },
  placeholder: { type: String,  default: 'Tìm kiếm...' },
  state:       { type: String,  default: 'default' },
  outline:     { type: Boolean, default: true },
  clearable:   { type: Boolean, default: true },
  size:        { type: String,  default: 'md' },
  disabled:    { type: Boolean, default: false },
  variant:     { type: String,  default: '' },
})

defineEmits(['update:modelValue', 'search', 'clear'])

const boxClass = computed(() => ({
  'ibox--no-border': !props.outline && props.variant !== 'header',
  'ibox--header':    props.variant === 'header',
  'ibox--error':     props.state === 'error',
  'ibox--disabled':  props.state === 'disabled' || props.disabled,
  'ibox--sm':        props.size === 'sm',
}))
</script>
