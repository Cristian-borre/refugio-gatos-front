import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GatosView from '@/views/GatosView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/gatos', name: 'Gatos', component: GatosView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
