<template>
  <Teleport to="body">
    <div class="modal-overlay" @mousedown.self="onOverlayClick">
      <div class="modal" :style="{ width: width + 'px' }" role="dialog" :aria-label="title">
        <!-- Header -->
        <div class="modal__header">
          <h2 class="modal__title">{{ title }}</h2>
          <button class="modal__close" @click="$emit('close')" title="Đóng">
            <TIcon name="x" />
          </button>
        </div>

        <!-- Body -->
        <div class="modal__body">
          <slot name="body" />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="modal__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import TIcon from '@mds/components/TIcon.vue'

const props = defineProps({
  title:         { type: String,  default: '' },
  width:         { type: Number,  default: 560 },
  closeOnOverlay:{ type: Boolean, default: true },
})
const emit = defineEmits(['close'])

function onOverlayClick() {
  if (props.closeOnOverlay) emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16, 24, 40, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal {
  background: var(--bg-white);
  border-radius: var(--radius-dialog);
  box-shadow: var(--shadow-dialog);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 48px);
  overflow: hidden;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--stroke-divider);
  flex-shrink: 0;
}

.modal__title {
  font-size: var(--text-h3);
  font-weight: var(--fw-semibold);
  color: var(--text-primary);
  line-height: var(--text-h3-lh);
}

.modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-default);
  font-size: 16px;
  flex-shrink: 0;
}
.modal__close:hover { background: var(--bg-neutral-light); color: var(--text-primary); }

.modal__body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
}

.modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 24px;
  border-top: 1px solid var(--stroke-divider);
  flex-shrink: 0;
}
</style>
