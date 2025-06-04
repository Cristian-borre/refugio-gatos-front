import { createRouter, createWebHistory } from 'vue-router'
import GatosView from '@/views/GatosView.vue'

const routes = [{ path: '/', name: 'Gatos', component: GatosView }]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
