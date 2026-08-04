import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage        from './pages/HomePage.vue'
import KetoanDashboard from './pages/KetoanDashboard.vue'
import TienMatPage     from './pages/TienMatPage.vue'
import TienGuiPage     from './pages/TienGuiPage.vue'
import BanHangPage     from './pages/BanHangPage.vue'
import '@mds/style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/ketoan-dashboard', component: KetoanDashboard },
    { path: '/tien-mat', component: TienMatPage },
    { path: '/tien-gui', component: TienGuiPage },
    { path: '/ban-hang', component: BanHangPage },
  ]
})

createApp(App).use(router).mount('#app')
