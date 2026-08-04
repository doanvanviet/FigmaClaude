<template>
  <div class="dropdown-wrap" ref="wrapRef">
    <slot name="trigger" :toggle="toggle" :close="close" :is-open="isOpen" />

    <Teleport to="body">
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          class="dropdown-menu"
          :style="menuStyle"
          ref="menuRef"
          @click.stop
        >
          <template v-for="(item, i) in items" :key="i">
            <div v-if="item.separator" class="dropdown-menu__separator" />
            <button
              v-else
              class="dropdown-menu__item"
              :class="{
                'dropdown-menu__item--danger':   item.danger,
                'dropdown-menu__item--active':   item.id != null && item.id === activeId,
                'dropdown-menu__item--disabled': item.disabled,
              }"
              :disabled="item.disabled"
              @click="onSelect(item)"
            >
              <TIcon v-if="item.icon" :name="item.icon" class="dropdown-menu__icon" />
              <span class="dropdown-menu__label">{{ item.label }}</span>
              <span v-if="item.tag" class="dropdown-menu__tag">{{ item.tag }}</span>
            </button>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import TIcon from './TIcon.vue'

const props = defineProps({
  items:     { type: Array,             default: () => [] },
  placement: { type: String,            default: 'bottom-start' }, // 'bottom-start' | 'bottom-end'
  activeId:  { type: [String, Number],  default: null },
  minWidth:  { type: Number,            default: 0 },
})
const emit = defineEmits(['select', 'update:open'])

const wrapRef = ref(null)
const menuRef = ref(null)
const isOpen  = ref(false)
const pos     = ref({ top: 0, left: 0, right: 0, minWidth: 0 })

function computePos() {
  if (!wrapRef.value) return
  const r = wrapRef.value.getBoundingClientRect()
  pos.value = {
    top:      r.bottom + 4,
    left:     r.left,
    right:    window.innerWidth - r.right,
    minWidth: Math.max(props.minWidth, r.width),
  }
}

const menuStyle = computed(() => {
  const s = {
    position: 'fixed',
    top:      pos.value.top + 'px',
    minWidth: pos.value.minWidth + 'px',
    zIndex:   9999,
  }
  if (props.placement === 'bottom-end') s.right = pos.value.right + 'px'
  else                                  s.left  = pos.value.left  + 'px'
  return s
})

async function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) { await nextTick(); computePos() }
}

function close() { isOpen.value = false }

function onSelect(item) {
  if (item.disabled) return
  emit('select', item)
  close()
}

function onClickOutside(e) {
  if (menuRef.value?.contains(e.target)) return
  if (wrapRef.value?.contains(e.target)) return
  close()
}

function onKeyDown(e) {
  if (e.key === 'Escape') close()
}

watch(isOpen, val => {
  emit('update:open', val)
  if (val) {
    document.addEventListener('pointerdown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
  } else {
    document.removeEventListener('pointerdown', onClickOutside)
    document.removeEventListener('keydown', onKeyDown)
  }
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onClickOutside)
  document.removeEventListener('keydown', onKeyDown)
})
</script>
