<template>
  <!-- Host reserves space in flex layout; sidebar inside is always position:absolute -->
  <div class="sidebar-host" :class="{ 'sidebar-host--expanded': isExpanded }">
  <aside
    class="sidebar"
    :class="{ expanded: isExpanded }"
  >
    <!-- Inner scrollable content -->
    <div class="sidebar-inner">
      <!-- Quick add button -->
      <button v-if="!hideQuickAdd" class="btn-add-quick" @click="$emit('quick-add')">
        <TIcon name="plus" />
        <span class="btn-add-text">Thêm nhanh</span>
      </button>

      <!-- Nav items -->
      <nav class="sidebar-nav">
        <button
          v-for="item in items"
          :key="item.id"
          class="sidebar-item"
          :class="{ active: activeId === item.id }"
          :title="item.label"
          @click="$emit('nav', item.id)"
        >
          <TIcon :name="item.icon" />
          <span class="sidebar-item__label">{{ item.label }}</span>
        </button>
      </nav>
    </div>

    <!-- Collapse/Expand button — absolute at bottom -->
    <button class="btn-collapse" @click="onCollapseClick" :title="isExpanded ? 'Thu gọn' : 'Ghim mở rộng'">
      <!-- expanded → show collapse icon (lines right + left arrow) -->
      <svg v-if="isExpanded" viewBox="0 0 16.5 9.83333" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="11">
        <path d="M9.08333 0.75H15.75M9.08333 9.08333H15.75M12.4167 4.91667H15.75M0.75 4.91667H9.08333M4.5 1.16667L0.75 4.91667L4.5 8.66667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <!-- collapsed → show expand icon (lines left + right arrow) -->
      <svg v-else viewBox="0 0 16.5 9.83333" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="11">
        <path d="M0.75 0.75H7.41667M0.75 9.08333H7.41667M0.75 4.91667H4.08333M15.75 4.91667H7.41667M12 1.16667L15.75 4.91667L12 8.66667" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TIcon from './TIcon.vue'

const props = defineProps({
  items:           { type: Array,   default: () => [] },
  activeId:        { type: String,  default: '' },
  defaultExpanded: { type: Boolean, default: false },
  hideQuickAdd:    { type: Boolean, default: false },
})
defineEmits(['nav', 'quick-add'])

const STORAGE_KEY = 'mds-sidebar-expanded'
const stored = localStorage.getItem(STORAGE_KEY)
const isExpanded = ref(stored !== null ? stored === 'true' : props.defaultExpanded)
// Persist initial resolved state so all pages share the same default
if (stored === null) {
  localStorage.setItem(STORAGE_KEY, String(isExpanded.value))
}

function onCollapseClick() {
  isExpanded.value = !isExpanded.value
  localStorage.setItem(STORAGE_KEY, isExpanded.value)
}
</script>
