<template>
  <div id="app">
    <Navbar
        :currentTask='currentTask'
        v-on:toggle="toggle('sideNav')"
        v-on:navbarLoaded="navbarLoaded = true"
    />
    <transition name="slide">
        <SideBar
            v-if="sideNav"
            v-on:closeNav="toggle('sideNav')"
        />
    </transition>
    <Popups 
        v-if="popup"
        :settings="popup"
        v-on:togglePopup="togglePopup"
    />
    <router-view
        v-if="navbarLoaded"
        v-on:setTask='currentTask = $event'
        v-on:togglePopup='togglePopup'
        v-on:setUserData='setUserData'
    />
  </div>
</template>

<script>
import Popups from '@/components/Popups/Popups'
import Navbar from '@/components/Navbar/Navbar'
import SideBar from '@/components/SideBar/SideBar'
import db from '@/firebase/init'
import firebase from 'firebase'
import { mapActions } from 'vuex'

export default {
    name: 'App',
    data(){
        return{
            currentTask: null,
            addTask: false,
            popup: null,
            userData: null,
            sideNav: false,
            navbarLoaded: false
        }
    },
    components:{
        Popups,
        Navbar,
        SideBar
    },
    methods:{
        ...mapActions(['checkUser']),
        setUserData(data){
            this.userData = data
        },
        togglePopup(settings){
            if(settings){
                this.popup = settings
            }else{
                this.popup = null
            }
        },
        toggle(prop){
            this[prop] = !this[prop]
        }
        
    }
}
</script>

<style>
*{
    margin: 0;
    box-sizing: border-box;
    padding: 0;
}
:root {
    --main-color: white;
    --border-color: rgba(0,0,0,.2);
    --dailyPlanner-height: 600px;
    --bg-overlay-color: rgba(0,0,0,.4);
}

@media only screen and (min-height: 1000px) {
    :root {
        --dailyPlanner-height: 600px;
    }
}
@media only screen and (max-height: 800px) {
    :root {
        --dailyPlanner-height: 60vh;   
    }
}

#app{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
body{
    --weather-background: url(https://images.unsplash.com/photo-1459679749680-18eb1eb37418?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Montserrat', sans-serif;
    background:linear-gradient(0deg,rgba(0,0,0,0.6),rgba(0,0,0,0.6)),var(--weather-background);
    /* background: black; */
    background-size:cover;
    color: white;
}
select,
input,
button,
textarea{
    outline: none;
}
li{
    list-style: none;
}

@keyframes slideIn {
    from{
        transform: translate(-100%,0);
    }
    to{
        transform: translate(0,0);
    }
}

@keyframes scaleUp {
    from{
        transform: scale(0);
    }
    to{
        transform: scale(1);
    }

}
.slide-enter-active {
    animation: slideIn 1s;
}

.slide-leave-active {
    animation: slideIn reverse 1s;
}
</style>
