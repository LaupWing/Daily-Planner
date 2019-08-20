import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false
let app = null
// ################ What is this? ################
// This code below waites for state changed like login or logout
// ################ Why? ################
// Because it takes time for the firebaseapp to initalize to see if there is an user currently logged in
// Otherwise we will get a null if we want to see if a user is currently logged in
// The app will only start if the firebaseapp noticed if a user is logged in or not
firebase.auth().onAuthStateChanged(()=>{
  if(!app){
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})
