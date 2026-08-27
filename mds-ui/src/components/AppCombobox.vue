<template>
  <div class="ibox" :class="boxClass" :style="{ cursor: (state === 'readonly' || state === 'disabled' || disabled) ? 'default' : 'pointer' }">
    <TIcon v-if="iconLeft" :name="iconLeft" class="ibox__icon" />

    <!-- Single select -->
    <select v-if="!multiple"
      class="ibox__native ibox__native--select"
      :value="modelValue"
      :disabled="disabled || state === 'disabled' || state === 'readonly'"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled :selected="!modelValue">{{ placeholder }}</option>
      <option
        v-for="opt in normalizedOptions" :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >{{ opt.label }}</option>
    </select>

    <!-- Multiple select — shows tags + native select overlay -->
    <template v-else>
      <div class="ibox__native" style="display:flex;flex-wrap:wrap;gap:4px;height:auto;min-height:20px;align-items:center;cursor:pointer">
        <span
          v-for="val in selectedValues" :key="val"
          style="display:inline-flex;align-items:center;gap:2px;padding:0 6px;height:18px;background:var(--bg-neutral-light);border:1px solid var(--stroke-neutral);border-radius:4px;font-size:11px;white-space:nowrap"
        >
          {{ labelOf(val) }}
          <span style="cursor:pointer;line-height:0;margin-left:2px" @click.stop="removeValue(val)"><TIcon name="x" style="font-size:10px" /></span>
        </span>
        <span v-if="!selectedValues.length" style="color:var(--text-hint);font-size: 13px">{{ placeholder }}</span>
      </div>
      <select
        class="ibox__native--select"
        style="position:absolute;inset:0;opacity:0;width:100%;cursor:pointer"
        multiple
        :disabled="disabled || state === 'disabled'"
        @change="onMultiChange"
      >
        <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value" :selected="selectedValues.includes(opt.value)">{{ opt.label }}</option>
      </select>
    </template>

    <TIcon v-if="iconRight" :name="iconRight" class="ibox__icon" :class="{ 'ibox__icon--brand': iconRight === 'plus' }" />
    <TIcon name="chevron-down" class="ibox__icon" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TIcon from './TIcon.vue'

const props = defineProps({
  modelValue:  { type: [String, Array], default: () => '' },
  options:     { type: Array,   default: () => [] }, // string[] | { value, label, disabled? }[]
  placeholder: { type: String,  default: '' },
  multiple:    { type: Boolean, default: false },
  state:       { type: String,  default: 'default' },
  outline:     { type: Boolean, default: true },
  iconLeft:    { type: String,  default: '' },
  iconRight:   { type: String,  default: '' },
  size:        { type: String,  default: 'md' },
  disabled:    { type: Boolean, default: false },
  ghost:       { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const normalizedOptions = computed(() =>
  props.options.map(o =>
    typeof o === 'object' ? o : { value: String(o), label: String(o) }
  )
)

const selectedValues = computed(() =>
  props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : []) : []
)

function labelOf(val) {
  return normalizedOptions.value.find(o => o.value === val)?.label ?? val
}

function removeValue(val) {
  emit('update:modelValue', selectedValues.value.filter(v => v !== val))
}

function onMultiChange(e) {
  const selected = Array.from(e.target.selectedOptions).map(o => o.value)
  emit('update:modelValue', selected)
}

const boxClass = computed(() => ({
  'ibox--ghost':     props.ghost,
  'ibox--no-border': !props.ghost && !props.outline,
  'ibox--error':     props.state === 'error',
  'ibox--success':   props.state === 'success',
  'ibox--warning':   props.state === 'warning',
  'ibox--disabled':  props.state === 'disabled' || props.disabled,
  'ibox--readonly':  props.state === 'readonly',
  'ibox--sm':        props.size === 'sm',
}))
</script>
