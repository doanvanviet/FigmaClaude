import { createRouter, createWebHistory } from 'vue-router'
import TongQuanPage  from './pages/TongQuanPage.vue'
import LichHenPage   from './pages/LichHenPage.vue'
import DichVuPage    from './pages/DichVuPage.vue'
import KhachHangPage from './pages/KhachHangPage.vue'
import NhanVienPage  from './pages/NhanVienPage.vue'

const routes = [
  { path: '/',             redirect: '/tong-quan' },
  { path: '/tong-quan',    component: TongQuanPage,  meta: { id: 'tong-quan' } },
  { path: '/lich-hen',     component: LichHenPage,   meta: { id: 'lich-hen' } },
  { path: '/dich-vu',      component: DichVuPage,    meta: { id: 'dich-vu' } },
  { path: '/khach-hang',   component: KhachHangPage, meta: { id: 'khach-hang' } },
  { path: '/nhan-vien',    component: NhanVienPage,  meta: { id: 'nhan-vien' } },
  { path: '/:pathMatch(.*)*', redirect: '/tong-quan' },
]

export default createRouter({ history: createWebHistory(), routes })
