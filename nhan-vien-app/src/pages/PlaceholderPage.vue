<template>
  <AppShell>
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title h2">{{ title }}</h1>
      </div>
    </div>
    <div class="ph-body">
      <div class="ph-card">
        <div class="ph-icon-wrap">
          <TIcon name="tool" />
        </div>
        <p class="ph-title">Đang phát triển</p>
        <p class="ph-desc">Tính năng <strong>{{ title }}</strong> sẽ sớm ra mắt</p>
      </div>
    </div>
  </AppShell>
</template>

<script setup>
import AppShell from '../components/AppShell.vue'
import TIcon    from '@mds/components/TIcon.vue'

defineProps({
  title: { type: String, default: '' }
})
</script>

<style scoped>
.page-header {
  display: flex; align-items: center;
  height: var(--layout-page-header-h); padding: 0 16px;
  background: var(--bg-white); border-bottom: 1px solid var(--stroke-divider);
  flex-shrink: 0;
}
.page-header__left { display: flex; align-items: center; }
.page-header__title { margin: 0; }

.ph-body {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 40px 16px;
}
.ph-card {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 40px; background: var(--bg-white);
  border-radius: var(--radius-default); box-shadow: var(--shadow-card);
  text-align: center; max-width: 360px; width: 100%;
}
.ph-icon-wrap {
  width: 64px; height: 64px; border-radius: 16px;
  background: var(--bg-neutral-light);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-hint);
}
.ph-icon-wrap .ti { font-size: 32px; }
.ph-title {
  font-size: 16px; font-weight: var(--fw-semibold);
  color: var(--text-primary); margin: 0;
}
.ph-desc {
  font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 20px;
}
.ph-desc strong { color: var(--text-primary); }
</style>
