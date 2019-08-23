import Vue from 'vue'
import Router from 'vue-router'
import Planner from './views/home/Planner.vue'
import AddTask from './views/AddTask.vue'
import Signup from './views/auth/Signup'
import Login from './views/auth/Login'
import ColorLabels from './views/home/ColorLabels'

import firebase from 'firebase'
Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Planner,
      meta:{
        requiresAuth: true
      }
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
    },
    {
      path: '/color-labels',
      name: 'ColorLabels',
      component: ColorLabels
    }
  ]
})

router.beforeEach((to, from, next)=>{
  if(to.matched.some(rec=> rec.meta.requiresAuth)){
    let user = firebase.auth().currentUser
    if(user){
      next()
    }else{
      next({name:'Login'})
    }
  }else{
    next()
  }
})

export default router