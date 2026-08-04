import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import TongQuanPage from './pages/TongQuanPage.vue'
import PlaceholderPage from './pages/PlaceholderPage.vue'
import '@mds/style.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',             redirect: '/tong-quan' },
    { path: '/tong-quan',    component: TongQuanPage },
    { path: '/hoi-nhap',     component: PlaceholderPage, props: { title: 'Hội nhập' } },
    { path: '/ho-so',        component: PlaceholderPage, props: { title: 'Hồ sơ' } },
    { path: '/cham-cong',    component: PlaceholderPage, props: { title: 'Chấm công' } },
    { path: '/don-tu',       component: PlaceholderPage, props: { title: 'Đơn từ' } },
    { path: '/tien-luong',   component: PlaceholderPage, props: { title: 'Tiền lương' } },
    { path: '/phuc-loi',     component: PlaceholderPage, props: { title: 'Phúc lợi' } },
    { path: '/dong-phuc',    component: PlaceholderPage, props: { title: 'Đồng phục' } },
    { path: '/danh-gia',     component: PlaceholderPage, props: { title: 'Đánh giá' } },
    { path: '/:pathMatch(.*)*', redirect: '/tong-quan' },
  ]
})

createApp(App).use(router).mount('#app')
