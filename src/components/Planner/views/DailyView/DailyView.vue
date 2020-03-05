<template>
    <div 
        id="planner"
        @scroll="scrollEvent"
        @click="createTask"
    >
        <div class="indicator" @click="turnoff"></div>
        <Timeline/>
        <Tasks
            :visibleTask="visibleTask"
            :userData="userData"
            v-on:checkActiveTask='checkTaskByScroll'
            v-on:setTask='setTask'
        />
        <div class="controls">
            <Actions
                :visibleTask="visibleTask"
            />
        </div>
        <div>
            <!-- Need to calculate margin-top value by adding the planner height -->
            <GoTo
                v-on:setupCurrentPos='setupCurrentPos'  
                v-on:goToSpecifikTime='goToSpecifikTime'
            />
        </div>
    </div>
</template>

<script>
import Timeline from '@/components/Planner/Timeline'
import Tasks from '@/components/Planner/views/DailyView/parts/Tasks/Tasks'
import GoTo from '@/components/Planner/GoTo'
import Actions from '@/components/Planner/views/DailyView/parts/Actions'
import {checkConnectedLi} from '@/components/helpers/timeline'
import {days} from '@/components/helpers/timeFormat'
import {monthNames} from '@/components/helpers/timeFormat'

export default {
    name: 'DailyView',
    components:{
        Tasks,
        Timeline,
        GoTo,
        Actions
    },
    props:['userData'],
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
        }
    },
    computed:{  
    },
    methods:{
        emitToParent(func, data){
            this.$emit(func, data)
        },
        test(){
            // console.log(this.visibleTask)
        },
        createTask(){
        // this.test()
            // if(event.target.id){
            //     if(event.target.id === 'Tasks' || event.target.id === 'planner'){
            //     const container = this.$el
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
            // console.log('scrolling')
            this.$el.scrollTo(0,point)
        },
        setTask(task){
            // console.log(task)
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
            this.calcStartingPoint()
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
            console.log(beginPos)
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
    }
}
</script>

<style>

</style>