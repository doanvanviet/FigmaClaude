<template>
  <div class="tnc" :class="{ 'tnc--child': row._isChild, 'tnc--wrap': row._lineCount > 1 }">
    <div class="tnc__controls">
      <button v-if="row._hasChildren" class="tnc__expand" @click.stop="row._onToggle()">
        <TIcon name="chevron-right" class="tnc__chevron" :class="{ 'tnc__chevron--open': row._expanded }" />
      </button>
      <span v-else class="tnc__ph" />

      <button
        class="tnc__check"
        :class="{ 'tnc__check--done': row._status === 'done' }"
        @click.stop="row._onCheck()"
      >
        <!-- Done: filled green circle + white checkmark. Inline SVG = reliable size & color -->
        <svg v-if="row._status === 'done'"
          class="tnc__svg-done"
          width="18" height="18" viewBox="0 0 18 18"
          fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="9" cy="9" r="9" fill="currentColor" />
          <path d="M5.5 9L7.8 11.5L12.5 6.5"
            stroke="white" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"
          />
        </svg>
        <!-- Undone: outline circle 18×18, line 1.5 -->
        <span v-else class="tnc__circle" />
      </button>
    </div>

    <span
      class="tnc__name"
      :class="{
        'tnc__name--clip':  row._lineCount === 1,
        'tnc__name--wrap':  row._lineCount !== 1,
        'tnc__name--done':  row._status === 'done',
      }"
      :style="row._lineCount > 1 && row._lineCount !== 0 ? { '--lc': row._lineCount } : {}"
    >{{ row.task?.text }}</span>
  </div>
</template>

<script setup>
import TIcon from '@mds/components/TIcon.vue'
defineProps({ row: Object, col: Object })
</script>

<style scoped>
.tnc {
  display: flex; align-items: center; gap: 8px;
  width: 100%; min-width: 0; overflow: hidden;
}
.tnc--wrap  { align-items: flex-start; }
.tnc--child { padding-left: 16px; }

.tnc__controls {
  display: flex; align-items: center; gap: 2px; flex-shrink: 0;
}

/* Expand button */
.tnc__expand {
  display: flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; flex-shrink: 0;
  border: none; background: transparent; cursor: pointer; padding: 0;
  border-radius: 4px; color: var(--icon-neutral);
  transition: background 0.12s;
}
.tnc__expand:hover { background: var(--bg-neutral-hover); }
.tnc__ph { width: 20px; height: 20px; display: block; flex-shrink: 0; }
.tnc__chevron { font-size: 14px; transition: transform 0.18s ease; display: block; }
.tnc__chevron--open { transform: rotate(90deg); }

/* Check button — font-size 18px → CSS circle 1em = 18px */
.tnc__check {
  display: flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; flex-shrink: 0;
  border: none; background: transparent; cursor: pointer; padding: 0;
  font-size: 18px; color: var(--icon-neutral);
  transition: color 0.15s;
}
.tnc__check:hover       { color: var(--text-brand); }
.tnc__check--done       { color: var(--text-success, #0e9a62); }
.tnc__check--done:hover { opacity: 0.75; }

/* Done icon — inline SVG, màu = currentColor từ .tnc__check--done */
.tnc__svg-done { display: block; flex-shrink: 0; }

/* Undone circle — 1em = 18px, line 1.5 */
.tnc__circle {
  width: 1em; height: 1em; border-radius: 50%;
  border: 1.5px solid currentColor; display: block; flex-shrink: 0;
}

/* Task name */
.tnc__name {
  flex: 1; min-width: 0; font-size: 13px; color: var(--text-primary); line-height: 1.5;
}
/* 1 dòng: rút gọn */
.tnc__name--clip {
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
/* Nhiều dòng: wrap tự nhiên, clamp qua --lc (0 = unlimited = không set clamp) */
.tnc__name--wrap {
  white-space: normal; overflow: hidden;
  display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;
  -webkit-line-clamp: var(--lc, 9999);
}
/* Done: gạch ngang, chữ vẫn primary */
.tnc__name--done {
  text-decoration: line-through;
  text-decoration-color: var(--text-secondary);
}
.tnc--child .tnc__name { color: var(--text-secondary); }
</style>
