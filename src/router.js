import Vue from 'vue'
import Router from 'vue-router'
import Daily from './views/daily/Container.vue'
import Week from './views/week/Week.vue'
import Signup from './views/auth/Signup'
import Login from './views/auth/Login'
import AllTasks from './views/alltasks/AllTasks'

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