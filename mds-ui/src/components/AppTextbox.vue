<template>
  <div class="ibox" :class="boxClass">
    <TIcon v-if="iconLeft"  :name="iconLeft"  class="ibox__icon" />
    <input
      class="ibox__native"
      :class="{ 'ibox__native--right': align === 'right' }"
      :type="showPassword ? 'text' : inputType"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled || state === 'disabled'"
      :readonly="readonly || state === 'readonly'"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <!-- Password toggle -->
    <span v-if="inputType === 'password'" class="ibox__icon ibox__icon--action" @click="showPassword = !showPassword">
      <TIcon :name="showPassword ? 'eye-off' : 'eye'" />
    </span>
    <!-- Clear button -->
    <span v-else-if="clearable && modelValue" class="ibox__icon ibox__icon--clear" @click="$emit('update:modelValue', ''); $emit('clear')">
      <TIcon name="x" />
    </span>
    <TIcon v-else-if="iconRight" :name="iconRight" class="ibox__icon" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TIcon from './TIcon.vue'

const props = defineProps({
  modelValue:  { type: String,  default: '' },
  type:        { type: String,  default: 'text' }, // text | password | email | tel | url
  placeholder: { type: String,  default: '' },
  state:       { type: String,  default: 'default' }, // default | error | success | warning | disabled | readonly
  outline:     { type: Boolean, default: true },
  iconLeft:    { type: String,  default: '' },
  iconRight:   { type: String,  default: '' },
  clearable:   { type: Boolean, default: false },
  align:       { type: String,  default: 'left' }, // left | right
  size:        { type: String,  default: 'md' },   // md | sm
  disabled:    { type: Boolean, default: false },
  readonly:    { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'clear'])

const showPassword = ref(false)

const inputType = computed(() => props.type === 'password' ? 'password' : props.type)

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
