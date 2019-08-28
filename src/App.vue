<template>
  <div id="app">
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
    <router-view
      v-on:setTask='setTask'
    />
  </div>
</template>

<script>
import CurrentTime from '@/components/CurrentTime.vue'
import AddTask from '@/components/Planner/AddTask'
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
      weatherData: null
    }
  },
  components:{
    CurrentTime,
    Nav,
    AddTask
  },
  methods:{
    setTask(task){
      this.currentTask = task
    },
    toggle(prop){
      this[prop] = !this[prop]
      console.log(this[prop])
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
          console.log(this.weatherData)
        })
        .catch(err=>{
          this.weatherData = err.message
        })
    }
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
body{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
}
input,
button{
  outline: none;
}
</style>
