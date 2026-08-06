<template>
  <div class="table-header">

    <!-- ── BULK ACTION MODE: đè lên toàn bộ nội dung header ── -->
    <template v-if="bulkAction">
      <div class="table-header__bulk">
        <!-- Search giữ nguyên vị trí bên trái -->
        <div v-if="search" class="ibox" style="width:200px;flex-shrink:0">
          <TIcon name="search" class="ibox__icon" />
          <input
            class="ibox__native"
            :placeholder="searchPlaceholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
          />
        </div>
        <!-- Action area: selected info + deselect + bulk buttons -->
        <div class="bulk-action">
          <span class="bulk-selected">
            Đã chọn <strong>{{ selectedCount }}</strong>
          </span>
          <button class="bulk-deselect" @click="$emit('deselect-all')">Bỏ chọn</button>
          <div class="bulk-buttons">
            <slot name="bulk-buttons" />
          </div>
        </div>
      </div>
    </template>

    <!-- ── NORMAL MODE ── -->
    <template v-else>
      <!-- Left: search + filter slots -->
      <div class="table-header__left">
        <div v-if="search" class="ibox" :style="`width:${searchWidth}px`">
          <TIcon name="search" class="ibox__icon" />
          <input
            class="ibox__native"
            :placeholder="searchPlaceholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
          />
        </div>
        <slot name="filters" />
      </div>

      <!-- Right: icon group + divider + main buttons -->
      <div class="table-header__right">
        <div class="table-header__icon-group">
          <button class="btn-icon btn-icon--outline" title="Làm mới"        @click="$emit('refresh')">       <TIcon name="refresh" /></button>
          <button class="btn-icon btn-icon--outline" title="Xuất file"       @click="$emit('export')">        <TIcon name="file-export" /></button>
          <button class="btn-icon btn-icon--outline" title="Thiết lập cột"   @click="$emit('col-settings')">  <TIcon name="settings" /></button>
          <button class="btn-icon btn-icon--outline" title="Bộ lọc"          @click="$emit('open-filter')">   <TIcon name="filter" /></button>
        </div>
        <template v-if="mainFunctionButton">
          <div class="table-header__divider" />
          <div class="table-header__main-group">
            <slot name="main-buttons" />
          </div>
        </template>
      </div>
    </template>

  </div>
</template>

<script setup>
import TIcon from './TIcon.vue'

defineProps({
  modelValue:         { type: String,  default: '' },
  searchPlaceholder:  { type: String,  default: 'Tìm kiếm...' },
  searchWidth:        { type: Number,  default: 240 },
  search:             { type: Boolean, default: true },
  mainFunctionButton: { type: Boolean, default: false },
  bulkAction:         { type: Boolean, default: false },
  selectedCount:      { type: Number,  default: 0 },
})

defineEmits(['update:modelValue', 'refresh', 'export', 'col-settings', 'open-filter', 'deselect-all'])
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-white);
  flex-shrink: 0;
  min-height: 48px;
}

/* ── Normal mode ── */
.table-header__left {
  display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
}
.table-header__right {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.table-header__icon-group {
  display: flex; align-items: center; gap: 8px;
}
.table-header__divider {
  width: 1px; height: 20px; background: var(--stroke-neutral-light); flex-shrink: 0;
}
.table-header__main-group {
  display: flex; align-items: center; gap: 8px;
}

/* ── Bulk action mode ── */
.table-header__bulk {
  display: flex; align-items: center; gap: 16px; flex: 1;
}
.bulk-action {
  display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0;
}
.bulk-selected {
  font-size: 13px; color: var(--text-primary); display: flex; gap: 4px; align-items: center; flex-shrink: 0;
}
.bulk-selected strong { font-weight: var(--fw-semibold); }
.bulk-deselect {
  background: none; border: none; padding: 0; cursor: pointer;
  font-size: 13px; color: var(--text-brand); flex-shrink: 0;
}
.bulk-deselect:hover { text-decoration: underline; }
.bulk-buttons {
  display: flex; align-items: center; gap: 8px;
}
</style>
