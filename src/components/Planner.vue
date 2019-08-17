<template>
  <div 
    id="planner"
    @scroll="scrollEvent"
  >
    <div class="overlay" @click="turnoff"></div>
    <Timeline
      :hours="hours"
      :minutes="minutes"
    />
    <Tasks/>
  </div>
</template>

<script>
import Timeline from '@/components/Planner/Timeline'
import Tasks from '@/components/Planner/Tasks'
import debounce from '@/components/helpers/debounce'
import IntervalTimer from '@/components/helpers/intervalTimer'
import { setTimeout } from 'timers';

export default {
  name: '',
  props: {
    
  },
  data(){
    return{
      hours: null,
      minutes: null,
      distanceMinutes: null,
      distanceHours: null,
      settingDistanceAndAdjust: null,
      firstLanding: true
    }
  },
  components:{
    Timeline,
    Tasks
  },
  methods:{
    adjustPosition(){
      this.$el.scrollTo(0,(this.distanceHours+this.distanceMinutes))
    },
    addZero(number){
      if(number<10) return '0'+number
      else          return number
    },
    getDistanceHours(){
      const heightParent = this.$el.offsetHeight
      const currentElTime = Array.from(this.$el.querySelectorAll('li'))
        .filter(el=>el.textContent.includes(':'))
        .find(el=>el.textContent.split(':')[0]===String(this.hours))
      const parentElOffset = currentElTime.parentElement.offsetTop
      const distance = 
        (currentElTime.offsetTop-parentElOffset) - 
        (this.$el.offsetHeight/2) + 
        (currentElTime.offsetHeight/2)
      return distance
    },
    getMinutesDistance(){
      const li = document.querySelector('#Timeline li')
      const totalDistance = li.offsetHeight*2
      const distancePerMinute = totalDistance/60
      const distance = distancePerMinute * this.minutes
      return distance
    },
    setTime(){
      const date = new Date()
      this.hours = this.addZero(date.getHours())
      this.minutes = this.addZero(date.getMinutes())
    },
    turnoff(){
      console.log('clearing')
      clearInterval(this.settingDistanceAndAdjust)
    },
    scrollEvent(){
      if(this.firstLanding){
        this.firstLanding = false
        return
      }
      clearInterval(this.settingDistanceAndAdjust)
      setTimeout(()=>{
        this.assignInterval()
      },10000)
    },
    assignInterval(){
      this.settingDistanceAndAdjust = setInterval(()=>{
          this.setTime()
          this.distanceMinutes = this.getMinutesDistance()
          this.distanceHours = this.getDistanceHours()
          this.adjustPosition()
      },1000)
    }
  },
  created(){
  },
  mounted(){
    this.assignInterval()
  }
}
</script>

<style>
#planner{
  margin: auto;
  width: 500px;
  display: flex;
  max-height: 600px;
  overflow-y: auto;
  position: relative;
}
#planner .overlay{
  height: 50%;
  width: 50%;
  position: fixed;
  top: 0;
  left: 0;
  background: purple;
  opacity: .1;
}
</style>
