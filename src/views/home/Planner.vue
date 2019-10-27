<template>
  <div class="planner-container">
    <div class="set-view" :style="setTopPos">
        <i 
            class="fas fa-bars" 
            @click="view = 'single'"
            :class="{active :view === 'single'}"
        ></i>
        <i 
            class="fas fa-table" 
            @click="view = 'week'"
            :class="{active :view === 'week'}"
        ></i>
    </div>
    <AddTask 
        v-if="addTask"
        v-on:toggle="toggle('addTask')"
    />
    <div class="addTask">
        <div class="current-info">
            <h2 v-if="currentTask">{{currentTask.task}}</h2>
            <p>{{day}}, {{date}} {{month}}</p>
        </div>
        <button type="button" @click="toggle('addTask')">
            Add New Task
            <i class="far fa-calendar-plus"></i>
        </button>
    </div>    
    <ColorLabels
        :taskColor='taskColor'
        :userData="userData"
    />
    <WeekView 
        v-if="view === 'week'"
        :date="date"
        :month="month"
        :currentDay="day"
    />
    <DailyView
        :userData="userData"
        v-else
    />
    <!-- <div 
        v-if="view === 'single'"
        id="planner"
        @scroll="scrollEvent"
        @click="createTask"
    >
        <div class="indicator" @click="turnoff"></div>
        <Timeline
            :hours="hours"
            :minutes="minutes"
        />
        <Tasks
            :visibleTask="visibleTask"
            :userData="userData"
            v-on:setTask='setTask'
            v-on:checkActiveTask='checkTaskByScroll'
        />
    </div>
    <GoTo
        v-if="view === 'single'"
        v-on:setupCurrentPos='setupCurrentPos'  
        v-on:goToSpecifikTime='goToSpecifikTime'
    /> -->
  </div>
  
</template>

<script>
import WeekView from '@/components/Planner/views/WeekView'
import Timeline from '@/components/Planner/Timeline'
import GoTo from '@/components/Planner/GoTo'
import Tasks from '@/components/Planner/Tasks/Tasks'
import ColorLabels from '@/components/Planner/ColorLabels/ColorLabels'
import {checkConnectedLi} from '@/components/helpers/timeline'
import {days} from '@/components/helpers/timeFormat'
import {monthNames} from '@/components/helpers/timeFormat'
import AddTask from '@/components/Planner/AddTask/AddTask'
import firebase from 'firebase'
import db from '@/firebase/init'

import DailyView from '@/components/Planner/views/DailyView/DailyView'

export default {
  name: '',
  props: ['userData'],
  data(){
    return{
        hours: null,
        minutes: null,
        date: null,
        day: null,
        month: null,
        distanceMinutes: null,
        distanceHours: null,
        settingDistanceAndAdjust: null,
        timeoutInSec: 0,
        timeoutInterval: null,
        scrollByCode: false,
        user: null,
        timeToReturnInSec: 300,
        geolocation:{
            lat: 52.370216,
            lng: 4.895168
        },
        taskColor: null,
        addTask: null,
        visibleTask: null,
        currentTask: null,
        setTopPos: null,
        view: 'single'
    }
  },
  components:{
        Timeline,
        Tasks,
        ColorLabels,
        GoTo,
        AddTask,
        WeekView,
        DailyView
  },
  methods:{
    test(){
      console.log(this.visibleTask)
    },
    createTask(){
      // this.test()
        // if(event.target.id){
        //     if(event.target.id === 'Tasks' || event.target.id === 'planner'){
        //     const container = this.$el.querySelector('#planner')
        //     const clickYCoord = event.clientY
        //     const zeroScrollCoord = container.getBoundingClientRect().top + (container.offsetHeight/2)
        //     const begin = (clickYCoord -zeroScrollCoord) + container.scrollTop 
        //     container.scrollTo(0,begin)
        //     } 
        // }
    },
    toggle(prop){
        this[prop] = !this[prop]
    },
    goToSpecifikTime(point){
        this.scrollByCode = false
        this.$el.querySelector('#planner').scrollTo(0,point)
    },
    setTask(task){
        if(task.task){
            this.currentTask = task
        }else{
            this.currentTask ={
                task
            }
        }
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
        this.date = date.getDate()
        this.day = days[date.getDay()]
        this.month = monthNames[date.getMonth()]
    },
    turnoff(){
      // clearInterval(this.settingDistanceAndAdjust)
    },
    scrollEvent(){
        this.setTimeIndicator()
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
            console.log(this.timeoutInSec)
            if(this.timeoutInSec === this.timeToReturnInSec){
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
        this.visibleTask = findTask
        if(findTask){
            const connectedLi = checkConnectedLi(findTask)
            connectedLi.forEach(li=>{
                li.classList.add('opacity')
            })
            findTask.classList.add('opacity')
            this.taskColor = findTask.style.background
        }
        else{
            this.taskColor = null
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
    setTimeIndicator(){
        const scrolled = this.$el.querySelector('#planner').scrollTop
        const height = this.$el.querySelector('#planner').offsetHeight
        const midpoint = Math.round(scrolled + (height/2))
        this.$el.querySelectorAll('#Timeline li').forEach(li=>{
            const max = li.offsetTop + li.offsetHeight
            const min = li.offsetTop
            if(midpoint >= min && midpoint <= max){
                const liTime = li.dataset.time
                const comparePoint = Math.round(li.offsetTop + (li.offsetHeight/2))
                const oneMinuteInPx = li.offsetHeight/30
                let time = '00:00'
            if(midpoint===comparePoint){
                time = liTime
            }
            else if(midpoint > comparePoint){
                const minutesDiffrence = Math.round((midpoint-comparePoint)/oneMinuteInPx)
                const liTimeHours =  Number(liTime.split(':')[0])
                const liTimeMinutes = Number(liTime.split(':')[1])
                time = `${this.addZero(liTimeHours)}:${this.addZero(liTimeMinutes+minutesDiffrence)}` 
            }
            else if(midpoint < comparePoint){
                const minutesDiffrence = Math.round((comparePoint-midpoint)/oneMinuteInPx)
                let liTimeHours =  Number(liTime.split(':')[0])
                let liTimeMinutes = Number(liTime.split(':')[1])
                if(liTimeMinutes === 0 ){
                    liTimeHours = (liTimeHours !== 0) ? liTimeHours - 1 : 23
                    liTimeMinutes = 60-minutesDiffrence
                    time = `${this.addZero(liTimeHours)}:${this.addZero(liTimeMinutes)}`
                }else{
                    time = `${this.addZero(liTimeHours)}:${this.addZero(liTimeMinutes-minutesDiffrence)}`
                }
            }
            document
                    .querySelector('#planner .indicator')
                    .setAttribute('time', `${time}`)
            }
        })
    },
    setupCurrentPos(){
        this.setTime()
        this.distanceMinutes = this.getMinutesDistance()
        this.distanceHours = this.getDistanceHours()
        this.adjustPosition()
        console.log('auto setting')
    },
    assignInterval(){
        this.settingDistanceAndAdjust = setInterval(()=>{
            this.setupCurrentPos()
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
    },
  },
  mounted(){
        this.setTopPos =  {
            top: (document.querySelector('#NavBar').offsetHeight) + 'px'
        }
        // this.assignInterval()
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(pos=>{
                this.geolocation.lat = pos.coords.latitude
                this.geolocation.lng = pos.coords.longitude
                this.updateAndGetUserData()
            })
        }
        else{
            this.updateAndGetUserData()
        }
  }
}
</script>

<style>
#planner.preventScroll{
    overflow-y: hidden;
}
#planner{
    margin: auto;
    margin-right: 65px;
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
.planner-container .set-view{
    position: fixed;
    right: 0;
    padding: 20px;
    display: flex;
}
.planner-container .set-view i{
    font-size: 1.5em;
    margin: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    /* background: orange; */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: .5;
    transition: .25s;
}
.planner-container .set-view i:hover,
.planner-container .set-view i.active{
    background: rgba(0,0,0,.7);
    opacity: 1;
    cursor: pointer;
}
.planner-container .addTask{
    margin-bottom: 20px;
    width: 100%;
    text-align: center;
    position: absolute;
    transform: translate(0,-130%);
}
.planner-container .addTask .current-info{
    margin: 20px 0;
}
.planner-container .current-info h2{
    font-size: 1.5em;
}
.planner-container .current-info p{
    text-transform: capitalize;
    opacity: .5;
}
.planner-container .addTask button{
    font-size: .6em;
    width: 60%;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 5px;
    background: white;
    opacity: .35;
    border: none;
    transition: .25s;
    cursor: pointer;
} 
.planner-container .addTask button:hover{
    opacity: 1;
}
.planner-container{
    position: relative;
}

#planner .indicator{
    --time: '00:00';
    height: 1.2px;
    width: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    background: white;
    opacity: .8;
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
@media only screen and (max-height: 800px) {
    #planner {
        max-height: 60vh;   
        width: 450px;
    }
    .planner-container{
        margin-top: 70px;
    }
    #planner .indicator{
        margin-top: 35px;
    }
}
</style>
