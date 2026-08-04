<template>
  <div class="app-shell">
    <!-- Global Header -->
    <ControlHeader app-name="MISA QLNS">
      <template #header-meta>
        <button class="header-company">
          Công ty cổ phần Công nghệ MISA <TIcon name="chevron-down" />
        </button>
      </template>
    </ControlHeader>

    <div class="body-row">
      <!-- Sidebar -->
      <AppSidebar
        :items="sidebarItems"
        :active-id="activeId"
        @nav="onNav"
      />

      <!-- Main content slot -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import AppSidebar from '@mds/components/AppSidebar.vue'
import ControlHeader from '@mds/components/ControlHeader.vue'
import TIcon from '@mds/components/TIcon.vue'

const router = useRouter()
const route = useRoute()

const sidebarItems = [
  { id: 'tong-quan',       label: 'Tổng quan',        icon: 'layout-dashboard' },
  { id: 'hoi-nhap',        label: 'Hội nhập',          icon: 'user-plus' },
  { id: 'ho-so',           label: 'Hồ sơ',             icon: 'id-badge-2' },
  { id: 'hop-dong',        label: 'Hợp đồng',          icon: 'file-certificate' },
  { id: 'bo-nhiem',        label: 'Bổ nhiệm',          icon: 'user-check' },
  { id: 'mien-nhiem',      label: 'Miễn nhiệm',        icon: 'user-minus' },
  { id: 'thuyen-chuyen',   label: 'Thuyên chuyển',     icon: 'transfer' },
  { id: 'nghi-viec',       label: 'Nghỉ việc',         icon: 'door-exit' },
  { id: 'khen-thuong',     label: 'Khen thưởng',       icon: 'medal' },
  { id: 'ky-luat',         label: 'Kỷ luật/Sự cố',    icon: 'alert-triangle' },
  { id: 'phuc-loi',        label: 'Phúc lợi',          icon: 'heart-handshake' },
  { id: 'quy-hoach',       label: 'Quy hoạch',         icon: 'sitemap' },
  { id: 'ke-can',          label: 'Kế cận',            icon: 'ladder' },
  { id: 'kho-tiem-nang',   label: 'Kho tiềm năng',     icon: 'diamond' },
  { id: 'dong-phuc',       label: 'Đồng phục',         icon: 'shirt' },
  { id: 'de-xuat',         label: 'Đề xuất',           icon: 'bulb' },
  { id: 'dinh-bien',       label: 'Định biên',         icon: 'scale' },
]

const activeId = computed(() => route.path.replace('/', ''))

function onNav(id) {
  router.push('/' + id)
}
</script>
