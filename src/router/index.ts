import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/stv',
      name: 'stv',
      component: () => import('../views/ideas/ShortPeriodTargetView.vue'),
    },
    {
      path: '/book-excerpt',
      name: 'book-excerpt',
      component: () => import('../views/ideas/BookExcerptView.vue'),
    },
    {
      path: '/tech-summary',
      name: 'tech-summary',
      component: () => import('../views/ideas/TechSummaryView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
