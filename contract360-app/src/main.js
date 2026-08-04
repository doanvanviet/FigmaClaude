import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Contract360Dashboard from './pages/Contract360Dashboard.vue'
import '@mds/style.css'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Contract360Dashboard },
  ]
})

createApp(App).use(router).mount('#app')
