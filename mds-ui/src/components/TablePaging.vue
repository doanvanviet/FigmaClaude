<template>
  <div class="paging">
    <span class="paging__total">
      <span class="paging__total-label">Tổng số:</span>
      <strong class="paging__total-value">{{ total }}</strong>
    </span>
    <div class="paging__right">
      <span class="paging__label">Số dòng/trang</span>
      <div class="ibox" style="width:72px;cursor:pointer">
        <select
          class="ibox__native ibox__native--select"
          :value="pageSize"
          @change="$emit('update:pageSize', +$event.target.value)"
        >
          <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
        </select>
        <TIcon name="chevron-down" class="ibox__icon" style="font-size:13px;pointer-events:none" />
      </div>
      <span class="paging__range">{{ rangeStart }} - {{ rangeEnd }}</span>
      <div class="paging__nav">
        <button class="btn-icon btn-icon--sm" :disabled="page <= 1" @click="$emit('update:page', 1)">
          <TIcon name="chevron-left-pipe" />
        </button>
        <button class="btn-icon btn-icon--sm" :disabled="page <= 1" @click="$emit('update:page', page - 1)">
          <TIcon name="chevron-left" />
        </button>
        <button class="btn-icon btn-icon--sm" :disabled="page >= totalPages" @click="$emit('update:page', page + 1)">
          <TIcon name="chevron-right" />
        </button>
        <button class="btn-icon btn-icon--sm" :disabled="page >= totalPages" @click="$emit('update:page', totalPages)">
          <TIcon name="chevron-right-pipe" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TIcon from './TIcon.vue'

const props = defineProps({
  total:           { type: Number, default: 0 },
  page:            { type: Number, default: 1 },
  pageSize:        { type: Number, default: 20 },
  pageSizeOptions: { type: Array,  default: () => [20, 50, 100] },
})

defineEmits(['update:page', 'update:pageSize'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const rangeStart = computed(() => props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1)
const rangeEnd   = computed(() => Math.min(props.page * props.pageSize, props.total))
</script>

<style scoped>
.paging {
  display: flex; align-items: center; justify-content: space-between;
  height: 48px; padding: 0 16px; flex-shrink: 0;
  border-top: 1px solid var(--stroke-neutral-light);
  background: var(--bg-white);
}
.paging__total-label { font-size: 13px; color: var(--text-secondary); font-weight: var(--fw-regular); }
.paging__total-value { font-size: 13px; color: var(--text-primary);   font-weight: var(--fw-semibold); }
.paging__right  { display: flex; align-items: center; gap: 8px; }
.paging__label  { font-size: 13px; color: var(--text-primary); white-space: nowrap; }
.paging__range  { font-size: 13px; color: var(--text-primary); font-weight: var(--fw-semibold); }
.paging__nav    { display: flex; align-items: center; gap: 2px; }
</style>
