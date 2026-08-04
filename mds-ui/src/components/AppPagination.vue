<template>
  <div class="pagination-bar">
    <!-- Sum area -->
    <div class="pagination-bar__sums">
      <div
        v-for="(sum, i) in sums" :key="i"
        class="pagination-bar__sum-item"
        :class="{ 'pagination-bar__sum-item--vertical': sumVertical }"
      >
        <span class="pagination-bar__sum-label">{{ sum.label }}</span>
        <span class="pagination-bar__sum-value">{{ sum.value }}</span>
      </div>
    </div>

    <!-- Pagination controls -->
    <div class="pagination-bar__controls">
      <span class="pagination-bar__label">Số dòng/trang</span>

      <AppCombobox
        :model-value="String(pageSize)"
        :options="pageSizeOptions.map(String)"
        size="sm"
        style="width:80px"
        @update:model-value="onPageSizeChange"
      />

      <span class="pagination-bar__range">{{ rangeText }}</span>

      <div class="pagination-bar__nav">
        <button class="pagination-bar__nav-btn" :disabled="currentPage <= 1" @click="go(1)" title="Trang đầu">
          <TIcon name="chevron-left-pipe" />
        </button>
        <button class="pagination-bar__nav-btn" :disabled="currentPage <= 1" @click="go(currentPage - 1)" title="Trang trước">
          <TIcon name="chevron-left" />
        </button>
        <button class="pagination-bar__nav-btn" :disabled="currentPage >= totalPages" @click="go(currentPage + 1)" title="Trang sau">
          <TIcon name="chevron-right" />
        </button>
        <button class="pagination-bar__nav-btn" :disabled="currentPage >= totalPages" @click="go(totalPages)" title="Trang cuối">
          <TIcon name="chevron-right-pipe" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TIcon from './TIcon.vue'
import AppCombobox from './AppCombobox.vue'

const props = defineProps({
  total:           { type: Number, default: 0 },
  pageSize:        { type: Number, default: 10 },
  currentPage:     { type: Number, default: 1 },
  pageSizeOptions: { type: Array,  default: () => [10, 20, 50, 100] },
  sums:            { type: Array,  default: () => [] }, // [{label, value}]
  sumVertical:     { type: Boolean, default: false },
})

const emit = defineEmits(['update:currentPage', 'update:pageSize'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const rangeText = computed(() => {
  const start = Math.min(props.total, (props.currentPage - 1) * props.pageSize + 1)
  const end   = Math.min(props.total, props.currentPage * props.pageSize)
  return props.total > 0 ? `${start} - ${end}` : '0 - 0'
})

function go(page) {
  const p = Math.max(1, Math.min(page, totalPages.value))
  if (p !== props.currentPage) emit('update:currentPage', p)
}

function onPageSizeChange(val) {
  const size = Number(val)
  if (size !== props.pageSize) {
    emit('update:pageSize', size)
    emit('update:currentPage', 1)
  }
}
</script>
