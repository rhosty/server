import { createWebHistory, createRouter } from 'vue-router'

import Login from './components/LogIn.vue'
import ToDoList from './components/ToDoList.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/todo', component: ToDoList },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router