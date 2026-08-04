<template>
  <div class="ibox" :class="boxClass">
    <input
      class="ibox__native ibox__native--right"
      type="number"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min != null ? min : undefined"
      :max="max != null ? max : undefined"
      :step="step"
      :disabled="disabled || state === 'disabled'"
      :readonly="readonly || state === 'readonly'"
      @input="$emit('update:modelValue', $event.target.valueAsNumber ?? $event.target.value)"
      @change="$emit('change', $event.target.valueAsNumber ?? $event.target.value)"
    />
    <div v-if="stepper && !readonly && state !== 'readonly'" class="ibox__stepper">
      <button
        class="ibox__stepper-btn"
        type="button"
        :disabled="disabled || state === 'disabled' || (min != null && Number(modelValue) <= min)"
        @click="decrement"
      >
        <TIcon name="minus" />
      </button>
      <button
        class="ibox__stepper-btn"
        type="button"
        :disabled="disabled || state === 'disabled' || (max != null && Number(modelValue) >= max)"
        @click="increment"
      >
        <TIcon name="plus" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TIcon from './TIcon.vue'

const props = defineProps({
  modelValue:  { type: [Number, String], default: '' },
  placeholder: { type: String,  default: '' },
  min:         { type: Number,  default: null },
  max:         { type: Number,  default: null },
  step:        { type: Number,  default: 1 },
  state:       { type: String,  default: 'default' },
  outline:     { type: Boolean, default: true },
  size:        { type: String,  default: 'md' },
  stepper:     { type: Boolean, default: true },
  disabled:    { type: Boolean, default: false },
  readonly:    { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

function decrement() {
  const cur = props.modelValue === '' ? 0 : Number(props.modelValue)
  const next = cur - props.step
  const val = props.min != null ? Math.max(next, props.min) : next
  emit('update:modelValue', val)
  emit('change', val)
}

function increment() {
  const cur = props.modelValue === '' ? 0 : Number(props.modelValue)
  const next = cur + props.step
  const val = props.max != null ? Math.min(next, props.max) : next
  emit('update:modelValue', val)
  emit('change', val)
}

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
