import Vue from 'vue'
import Router from 'vue-router'
import Planner from './views/home/Planner.vue'
import AddTask from './views/AddTask.vue'
import Signup from './views/auth/Signup'
import Login from './views/auth/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Planner
    },
    {
      path: '/add-task',
      name: 'AddTask',
      component: AddTask
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
