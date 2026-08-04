<template>
  <div class="app-shell">
    <ControlHeader app-name="Spa & Làm đẹp" :no-meta="true" />

    <div class="body-row">
      <AppSidebar :items="sidebarItems" :active-id="activeId" @nav="onNav" />
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ControlHeader from '@mds/components/ControlHeader.vue'
import AppSidebar    from '@mds/components/AppSidebar.vue'

const router = useRouter()
const route  = useRoute()

const sidebarItems = [
  { id: 'tong-quan',  label: 'Tổng quan',   icon: 'layout-dashboard' },
  { id: 'lich-hen',   label: 'Lịch hẹn',    icon: 'calendar' },
  { id: 'dich-vu',    label: 'Dịch vụ',     icon: 'sparkles' },
  { id: 'khach-hang', label: 'Khách hàng',  icon: 'users' },
  { id: 'nhan-vien',  label: 'Nhân viên',   icon: 'user-check' },
]

const activeId = computed(() => route.meta.id || '')
function onNav(id) { router.push('/' + id) }
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.body-row {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: var(--bg-page);
}
</style>
