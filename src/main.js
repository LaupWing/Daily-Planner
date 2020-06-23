import './firebase/init.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import store from './store'
Vue.config.productionTip = false

let app = null

firebase.auth().onAuthStateChanged(()=>{
    store.dispatch('userWatcher')
    store.dispatch('setLocation')
    if(!app){
        app = new Vue({
            store,
            router,
            render: h => h(App)
        }).$mount('#app')
    }
})
