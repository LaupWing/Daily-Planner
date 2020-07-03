<template>
    <div 
        id="planner"
        @scroll="scrollEvent"
        @mousedown="creatingTask('starting')"
        @mousemove="createTask.starting && creatingTask('ending')"
        @mouseup="createTask.starting && (createTask.ended = true)"
    >
        <div 
            :style="{
                top: elementMidpoint
            }" 
            class="indicator"
            @mousedown.stop
        >
        </div>
        <app-timeline
            @mousedown.native.stop
        />
        <app-tasks
            :visibleTask="visibleTask"
            :createTask="createTask"
            v-on:checkActiveTask='checkTaskByScroll'
            v-on:setTask='setTask'
            @mousedown.native.stop
        />
        <div 
            class="controls"
            @mousedown.stop
        >
            <app-actions
                :visibleTask="visibleTask"
            />
        </div>
        <!-- Need to calculate margin-top value by adding the planner height -->
        <app-go-to
            v-on:setupCurrentPos='setupCurrentPos'  
            v-on:goToSpecifikTime='goToSpecifikTime'
            @mousedown.native.stop
        />
    </div>
</template>

<script>
import Timeline from '@/views/Daily/Timeline/Timeline'
import Tasks from './parts/Tasks/Tasks'
import GoTo from '@/views/Daily/GoTo/GoTo'
import Actions from './parts/Actions/Actions'
import {checkConnectedLi} from '@/components/helpers/timeline'
import {days} from '@/components/helpers/timeFormat'
import {monthNames} from '@/components/helpers/timeFormat'
import {getClosestCoord, fiveMinuteCoords, pointOverlappedTask} from './helpers/helpers'

export default {
    name: 'TasksContainer',
    components:{
        'app-tasks':Tasks,
        'app-timeline':Timeline,
        'app-go-to':GoTo,
        'app-actions':Actions,
    },
    data(){
        return{
            visibleTask: null,
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
            timeToReturnInSec: 300,
            taskColor: null,
            currentTask: null,
            offset: 0,
            elementMidpoint: 0,
            createTask:{
                starting: false,
                ending: null,
                ended: false
            }
        }
    },
    methods:{
        creatingTask(section){
            const containerCoords = this.$el.getBoundingClientRect()
            const yValInContainer = (this.$el.scrollTop + event.y) - containerCoords.top 
            const min = fiveMinuteCoords()[0].coord 
            // const max = fiveMinuteCoords()[fiveMinuteCoords().length-1].coord
            if(
                (min-5) > yValInContainer ||
                (this.createTask.starting && this.createTask.starting.coord > yValInContainer) ||
                this.createTask.ended
            ){
                return
            }
            if(this.createTask.ending && section === 'ending'){
                const overlapping = pointOverlappedTask(this.createTask.starting.coord, yValInContainer)
                if(overlapping){
                    return
                }
            }
            this.createTask[section] = getClosestCoord(yValInContainer)
        }, 
        goToSpecifikTime(point){
            this.scrollByCode = false
            this.$el.scrollTo(0,point)
        },
        setTask(task){
            task.task ? this.$emit('setCurrentTask', task) : this.$emit('setCurrentTask', {task})
        },
        adjustPosition(){
            this.scrollByCode = true
            this.$el.scrollTo(0,(this.distanceHours+this.distanceMinutes))
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
            this.date = date.getDate()
            this.day = days[date.getDay()]
            this.month = monthNames[date.getMonth()]
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
                if(this.$store.getters.creatingTask){
                    this.timeoutInSec = 300
                    return
                }
                this.timeoutInSec += 1
                if(this.timeoutInSec === this.timeToReturnInSec){
                    this.assignInterval()
                    this.timeoutInSec = 0
                    clearInterval(this.timeoutInterval)
                }
            },1000)
        },
        checkTaskByScroll(){
            const scrolled = this.$el.scrollTop
            const height = this.$el.offsetHeight
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
                this.$emit('setData', {
                    data:'taskColor',
                    value: findTask.style.background
                })
            }
            else{
                this.$emit('setData', {
                    data:'taskColor',
                    value: null
                })
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
            const scrolled = this.$el.scrollTop
            const height = this.$el.offsetHeight
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
        calcStartingPoint(){
            const beginLi  = this.$el.querySelector('#Timeline li')
            const beginPos = beginLi.offsetTop + (beginLi.offsetHeight/2)
            
            return beginPos
        },
        setupCurrentPos(){
            this.setTime()
            this.distanceMinutes = this.getMinutesDistance()
            this.distanceHours = this.getDistanceHours()
            this.adjustPosition()
        },
        assignInterval(){
            this.settingDistanceAndAdjust = setInterval(()=>{
                this.setupCurrentPos()
            },1000)
        },
    },
    mounted(){
        this.assignInterval()
        this.elementMidpoint = this.$el.offsetTop + (this.$el.offsetHeight/2) + this.$el.parentElement.offsetTop + 'px'
    }
}
</script>

<style scoped>
.indicator{
    --time: '00:00';
    height: 1.2px;
    width: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    background: white;
    opacity: .8;
    pointer-events: none;
}
.indicator::before{
    content: 'Time';
    top:-20px;
    position: absolute;
}
.indicator::after{
    content: attr(time);
}
</style>