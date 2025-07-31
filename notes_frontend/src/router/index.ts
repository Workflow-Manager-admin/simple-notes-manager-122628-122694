import { createRouter, createWebHistory } from 'vue-router'
import NotesMainView from '../views/NotesMainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'notes',
      component: NotesMainView,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
})

export default router
