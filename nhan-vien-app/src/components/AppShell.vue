<template>
  <div class="app-shell">
    <ControlHeader app-name="Nhân viên" :no-meta="true" />
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
import AppSidebar    from '@mds/components/AppSidebar.vue'
import ControlHeader from '@mds/components/ControlHeader.vue'

const router = useRouter()
const route  = useRoute()

const sidebarItems = [
  { id: 'tong-quan',  label: 'Tổng quan',  icon: 'layout-dashboard' },
  { id: 'hoi-nhap',   label: 'Hội nhập',   icon: 'user-plus'        },
  { id: 'ho-so',      label: 'Hồ sơ',      icon: 'id-badge-2'       },
  { id: 'cham-cong',  label: 'Chấm công',  icon: 'clock-hour-4'     },
  { id: 'don-tu',     label: 'Đơn từ',     icon: 'file-text'        },
  { id: 'tien-luong', label: 'Tiền lương', icon: 'wallet'           },
  { id: 'phuc-loi',   label: 'Phúc lợi',   icon: 'heart-handshake'  },
  { id: 'dong-phuc',  label: 'Đồng phục',  icon: 'shirt'            },
  { id: 'danh-gia',   label: 'Đánh giá',   icon: 'award'            },
]

const activeId = computed(() => route.path.replace('/', ''))

function onNav(id) {
  router.push('/' + id)
}
</script>
