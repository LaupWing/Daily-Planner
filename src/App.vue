<template>
  <div id="app">
    <!-- <div class="popup-disabler" v-if="popup" @click="togglePopup"></div> -->
    <Temperature
      :weatherData='weatherData'
    />
    <CurrentTime
      :currentTask='currentTask'
      v-on:addTask="toggle('addTask')"
    />
    <Nav/>
    <!-- <i class="far fa-calendar-plus"></i> -->
    <AddTask 
      v-if="addTask"
      v-on:toggle="toggle('addTask')"
    />
    <Popups 
      v-if="popup"
      :settings="popup"
      :userData="userData"
      v-on:togglePopup="togglePopup"
    />
    <router-view
      :preventActions="preventActions"
      v-on:setTask='setTask'
      v-on:togglePopup='togglePopup'
      v-on:setUserData='setUserData'
    />
  </div>
</template>

<script>
import CurrentTime from '@/components/CurrentTime.vue'
import Temperature from '@/components/Temperature.vue'
import AddTask from '@/components/Planner/AddTask/AddTask'
import CustomContext from '@/components/Popups/Tasks/CustomContext'
import Popups from '@/components/Popups/Popups'
import Nav from '@/components/Nav.vue'
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
      preventActions: null
    }
  },
  components:{
    CurrentTime,
    Nav,
    AddTask,
    Temperature,
    Popups
  },
  methods:{
    setUserData(data){
      this.userData = data
    },
    togglePopup(settings){
      if(settings){
        this.popup = settings
        this.preventActions = this.settings.type
      }else{
        this.popup = null
        this.preventActions = null
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
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
        this.geolocation.lat = pos.coords.latitude
        this.geolocation.lng = pos.coords.longitude
      })
      this.getWeather()
    }else{
      this.getWeather()
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
input,
button,
textarea{
  outline: none;
}
li{
  list-style: none;
}
</style>
