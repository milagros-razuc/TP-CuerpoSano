import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import MembersView from '../views/MiembrosView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/miembros',
    name: 'Members',
    component: MembersView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router