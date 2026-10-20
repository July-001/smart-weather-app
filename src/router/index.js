import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Favorites from '../views/Favorites.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: Favorites
  }
]

const router = createRouter({
  // hash 模式便于静态托管部署
  history: createWebHashHistory(),
  routes
})

export default router
