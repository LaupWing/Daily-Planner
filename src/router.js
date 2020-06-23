import Vue from 'vue'
import Router from 'vue-router'
import Daily from './views/Daily/Daily'
import Week from './views/Week/Week.vue'
import Signup from './views/Auth/Signup'
import Login from './views/Auth/Login'
import AllTasks from './views/AllTasks/AllTasks'

import firebase from 'firebase'
Vue.use(Router)

const router =  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'Daily',
            component: Daily,
            meta:{
                requiresAuth: true
            }
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
            path: '/allTasks',
            name: 'AllTasks',
            component: AllTasks,
            meta:{
                requiresAuth: true
            }
        },
        {
            path: '/week',
            name: 'Week',
            component: Week,
            meta:{
                requiresAuth: true
            }
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