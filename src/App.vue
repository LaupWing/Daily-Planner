<template>
  <div id="app">
    <Navbar
        :weatherData='weatherData'
        :currentTask='currentTask'
        v-on:toggle="toggle('sideNav')"
    />
    <transition name="slide">
        <SideBar
            v-if="sideNav"
        />
    </transition>
    <Popups 
        v-if="popup"
        :settings="popup"
        :userData="userData"
        v-on:togglePopup="togglePopup"
    />
    <router-view
        :userData="userData"
        v-on:setTask='setTask'
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
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'App',
    data(){
        return{
            currentTask: null,
            addTask: false,
            geolocation:{
                lat: 52.370216,
                lng: 4.895168
            },
            weatherData: null,
            popup: null,
            userData: null,
            sideNav: false
        }
    },
    computed:{
        ...mapGetters(['getDailyTasks'])
    },
    components:{
        Popups,
        Navbar,
        SideBar
    },
    methods:{
        ...mapActions(['fetchDailyTasks', 'checkUser']),
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
        setTask(task){
            this.currentTask = task
        },
        toggle(prop){
            this[prop] = !this[prop]
        },
        getWeather(){
            const proxy = "https://cors-anywhere.herokuapp.com/"
            const api = `${proxy}https://api.darksky.net/forecast/0bfee81d0d48f12651dd1fc9ef560f04/${this.geolocation.lat},${this.geolocation.lng}`
            fetch(api)
                .then(res=>{
                    return res.json()
                })
                .then(data=>{
                    this.weatherData = data
                    this.setBackground()
                })
                .catch(err=>{
                    this.weatherData = err.message
                })
        },
        setBackground(){
        // document.querySelector('body').style.background = 'orange'
            document.querySelector('body').style.setProperty('--weather-background', `url(https://source.unsplash.com/random/?${this.weatherData.currently.summary})`)
            // For some reaseon the css var doesnt work
            fetch(`https://source.unsplash.com/random/?${this.weatherData.currently.summary}`)
                .then(data=>{
                    document.querySelector('body').style.background = `linear-gradient(0deg,rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url(${data.url})`
                    document.querySelector('body').style.backgroundSize = 'cover'
                })
        },
        
    },
    created(){
        firebase.auth().onAuthStateChanged(()=>{
            this.checkUser()
        })
        this.checkUser()
        if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(pos=>{
                    this.geolocation.lat = pos.coords.latitude
                    this.geolocation.lng = pos.coords.longitude
                })
                this.getWeather()
            }else{
                this.getWeather()
            }
        // this.fetchDailyTasks()
        db.collection('planner')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc=>{
                this.userData = doc.data()
            })
    },
    mounted(){
        setTimeout(()=>{

            console.log(this.getDailyTasks)
        },2000)
    }
}
</script>

<style>
*{
    margin: 0;
    box-sizing: border-box;
    padding: 0;
}
#App{
    --main-color: white;
    --border-color: rgba(0,0,0,.2);
    --bg-overlay-color: rgba(0,0,0,.4);
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

.slide-enter-active {
    animation: slideIn 1s;
}

.slide-leave-active {
    animation: slideIn reverse 1s;
}
</style>
