import Vue from 'vue'
import Router from 'vue-router'
import Planner from './views/Planner.vue'
import AddTask from './views/AddTask.vue'
import Signup from './views/auth/Signup'
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
    }
  ]
})
