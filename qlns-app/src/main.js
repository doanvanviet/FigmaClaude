import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import TongQuanPage from './pages/TongQuanPage.vue'
import HoSoPage from './pages/HoSoPage.vue'
import '@mds/style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tong-quan' },
    { path: '/tong-quan', component: TongQuanPage },
    { path: '/ho-so', component: HoSoPage },
    // Placeholder routes cho các module khác
    { path: '/:pathMatch(.*)*', redirect: '/tong-quan' },
  ]
})

createApp(App).use(router).mount('#app')
