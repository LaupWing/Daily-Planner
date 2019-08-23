<template>
  <div class="planner-container">
    <div 
      id="planner"
      @scroll="scrollEvent"
    >
      <div class="indicator" @click="turnoff"></div>
      <Timeline
        :hours="hours"
        :minutes="minutes"
      />
      <Tasks
        v-on:setTask='setTask'
      />
    </div>
  </div>
</template>

<script>
import Timeline from '@/components/Planner/Timeline'
import Tasks from '@/components/Planner/Tasks'
// import debounce from '@/components/helpers/debounce'
// import IntervalTimer from '@/components/helpers/intervalTimer'
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
  name: '',
  props: ['days'],
  data(){
    return{
      hours: null,
      minutes: null,
      distanceMinutes: null,
      distanceHours: null,
      settingDistanceAndAdjust: null,
      timeoutInSec: 0,
      timeoutInterval: null,
      scrollByCode: false,
      user: null,
      geolocation:{
        lat: 52.370216,
        lng: 4.895168
      }
    }
  },
  components:{
    Timeline,
    Tasks
  },
  methods:{
    setTask(task){
      this.$emit('setTask', task)
    },
    adjustPosition(){
      this.scrollByCode = true
      this.$el.querySelector('#planner').scrollTo(0,(this.distanceHours+this.distanceMinutes))
    },
    addZero(number){
      if(number<10) return '0'+number
      else          return number
    },
    getDistanceHours(){
      const currentElTime = Array.from(this.$el.querySelectorAll('#Timeline li'))
        .filter(el=>el.textContent.includes(':'))
        .find(el=>el.textContent.split(':')[0]===String(this.hours))
      const parentElOffset = currentElTime.parentElement.offsetTop
      const distance = 
        (currentElTime.offsetTop-parentElOffset) - 
        (this.$el.querySelector('#planner').offsetHeight/2) + 
        (currentElTime.offsetHeight/2)
      // console.log(distance)
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
      // clearInterval(this.settingDistanceAndAdjust)
    },
    scrollEvent(){
      if(this.scrollByCode){
        setTimeout(()=>{
          this.scrollByCode = false
          this.checkTaskByScroll()
        },500)
        return
      }
      this.checkTaskByScroll()
      clearInterval(this.settingDistanceAndAdjust)
      clearInterval(this.timeoutInterval)
      this.timeoutInSec = 0
      this.timeoutInterval = setInterval(()=>{
        this.timeoutInSec += 1
        if(this.timeoutInSec === 10){
          this.assignInterval()
          this.timeoutInSec = 0
          clearInterval(this.timeoutInterval)
        }
      },1000)
    },
    checkTaskByScroll(){
      const scrolled = this.$el.querySelector('#planner').scrollTop
      const height = this.$el.querySelector('#planner').offsetHeight
      const midpoint = scrolled + (height/2)
      
      if(document.querySelectorAll('.task')===undefined) return
      const tasks = Array.from(document.querySelectorAll('.task'))
      const findTask = tasks.find(task=>{
        const taskHeight = task.offsetHeight
        const taskOffsetTop = task.offsetTop
        const taskMaxpoint = taskHeight+taskOffsetTop
        if(midpoint >= taskOffsetTop && midpoint <= taskMaxpoint){
          return task
        }
      })

      if(findTask){
        document.querySelectorAll('#Timeline li').forEach(li=>{
          const taskHeight = findTask.offsetHeight
          const taskOffsetTop = findTask.offsetTop
          const taskMaxpoint = taskHeight+taskOffsetTop
          const quarterInPx = li.offsetHeight/2 // Because one li represents half an hour

          const min = taskOffsetTop - (quarterInPx*1.2) 
          const max = taskMaxpoint  + (quarterInPx*1.2)  

          const liMin = li.offsetTop
          const liMax = li.offsetTop + li.offsetHeight
          li.classList.remove('opacity')
          if(liMin >= min && liMax <= max){
            li.classList.add('opacity')
          }
        })
      }
      else{
        document.querySelectorAll('#Timeline li').forEach(li=>{
          const liMin = li.offsetTop
          const liMax = li.offsetTop + li.offsetHeight
          li.classList.remove('opacity')
          if(midpoint >= liMin && midpoint <= liMax){
            li.classList.add('opacity')
          }
        })
      }
    },
    assignInterval(){
      this.settingDistanceAndAdjust = setInterval(()=>{
        this.setTime()
        this.distanceMinutes = this.getMinutesDistance()
        this.distanceHours = this.getDistanceHours()
        this.adjustPosition()
      },1000)
    },
    updateAndGetUserData(){
      const user = firebase.auth().currentUser
      const ref = db.collection('users')
      ref
        .where('user_id', '==', user.uid)
        .get()
        .then(snapshot=>{
          snapshot.forEach(doc=>{
            ref
              .doc(doc.id)
              .update({
                geolocation:{
                  lat: this.geolocation.lat,
                  lng: this.geolocation.lng
                }
              })
          })
        })
        .then(()=>{
          ref
            .where('user_id', '==',user.uid)
            .get()
            .then(snapshot=>{
              snapshot.forEach(doc=>{
                this.user = doc.data()
              })
            })
        })
    }
  },
  created(){
    
  },
  mounted(){
    this.assignInterval()
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
        this.geolocation.lat = pos.coords.latitude
        this.geolocation.lng = pos.coords.longitude
        this.updateAndGetUserData()
      })
    }else{
      this.updateAndGetUserData()
    }

  }
}
</script>

<style>
#planner{
  margin: auto;
  margin-right: 50px;
  width: 500px;
  display: flex;
  max-height: 60vh;
  overflow-y: auto;
  position: relative;
  position: relative;
  scroll-behavior: smooth;
}
#planner.smooth{
  scroll-behavior: smooth;
}
.planner-container{
  position: relative;
}
.planner-container::before{
  content  : "";
  position : absolute;
  z-index  : 1;
  top   : 0;
  left     : 0;
  pointer-events   : none;
  background-image : linear-gradient(to bottom, 
                    rgba(255,255,255, 1), 
                    rgba(255,255,255, 0) 90%);
  width    : 100%;
  height   : 5em;
}
.planner-container::after{
  content  : "";
  position : absolute;
  z-index  : 1;
  bottom   : 0;
  left     : 0;
  pointer-events   : none;
  background-image : linear-gradient(to bottom, 
                    rgba(255,255,255, 0), 
                    rgba(255,255,255, 1) 90%);
  width    : 100%;
  height   : 5em;
}
#planner .indicator{
  --time: '00:00';
  height: 1px;
  width: 300px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -300px;
  background: black;
  opacity: .4;
}
#planner .indicator::before{
  content: 'Time';
  top:-20px;
  position: absolute;
}
#planner .indicator::after{
  content: attr(time);
}
#planner::-webkit-scrollbar {
  width: 0px;
}

/* Track */
#planner::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
#planner::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
#planner::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
@media only screen and (min-height: 1000px) {
  #planner {
    max-height:600px;
  }
}
</style>
