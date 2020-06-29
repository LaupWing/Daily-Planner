<template>
    <div id="Tasks">
        <app-create-task
            v-if="createTask.starting"
            :createTask="createTask"
        />
        <app-task
            v-for="(task, index) in tasksOfToday"
            :key="index"
            :task="task"
            :edit="edit"
            :today="today"
            :compareTop="compareTop"
            :diffrence="diffrence"
            :expanded="expanded"
            :visibleTask="visibleTask"
            v-on:emitToParent="emitToParent"
            v-on:expandTask="expandTask"
            @mousedown.native.stop.prevent
        />
    </div>
</template>

<script>
import {converDateToMS} from '@/components/helpers/timeFormat'
import {days} from '@/components/helpers/timeFormat'
import Task from './Task/Task'
import CreateTask from './CreateTask/CreateTask'

export default {
    name: 'Tasks',
    components:{
        'app-task':Task,
        'app-create-task':CreateTask
    },
    props:['visibleTask', 'createTask'],
    data(){
        return{
            currentTask: null,
            edit: null,
            preventStateChangeFlag: false,
            today: days[new Date().getDay()],
            expanded: null,
            compareTop: null,
            diffrence: null
        }
    },
    computed:{
        tasksOfToday(){
            const tasks = this.$store.getters.dailyTasks 
            if(tasks){
                this.checkCurrentTask()
                return tasks
                    .filter(task=>{
                        const date = new Date()
                        const dateNumber =  date.getDay()
                        const currentDay = days[dateNumber]
                        
                        const checkDay = task.days.some(day=>day.day===currentDay)
                        if(checkDay){
                            return task
                        }
                    })
            }
            return null
        }
    },
    methods:{
        emitToParent(method){
            this.$emit(method)
        },
        expandTask(obj){
            if(!obj){
                this.expanded = null
            }
            else if(obj.compareTop){
                this.expanded = obj.task
                this.compareTop = obj.compareTop
                this.diffrence = obj.diffrence
            }else{
                this.compareTop = null
                this.diffrence = null
                this.expanded = obj.task
            }
        },
        getTimeOfThisDay(state, task){
            return task.days
                .find(day=>day.day===this.today)[state]
        },
        preventStateChange(){
            this.preventStateChangeFlag = true
        },
        checkCurrentTask(){
            setTimeout(()=>{
                this.taskWatcher()
            },1000)
            setInterval(()=>{
                this.taskWatcher()
            },60000)
        },
        taskWatcher(){
            const findTask = this.tasksOfToday.find((task)=>{
                const begin = converDateToMS(this.getTimeOfThisDay('begin', task))
                const end = converDateToMS(this.getTimeOfThisDay('end', task))
                const currentTimeInMS = converDateToMS()
                if(begin<=currentTimeInMS && end>=currentTimeInMS){
                    return task
                }
            })
            if(findTask){
                this.changeTimeSize(findTask)
                // For the message under the current time
                this.currentTask = findTask.task
                this.$emit('setTask', this.currentTask)
            }else{
                document.querySelectorAll('#Timeline li').forEach(li=>{
                    li.classList.remove('highlight')
                })
                // For the message under the current time
                this.currentTask = 'No Tasks Right now!'
                this.$emit('setTask', this.currentTask)
            }

        },
        changeTimeSize(task){
            const quarterInMs = 900000
            const allLi = Array.from(document.querySelectorAll('#Timeline li'))
            const taskBegin = converDateToMS(this.getTimeOfThisDay('begin', task))
            const taskEnd = converDateToMS(this.getTimeOfThisDay('end', task))
            let beginLi = null
            let endLi = null
            
            allLi.forEach((li,index)=>{
                const time = converDateToMS(li.dataset.time)
                const timeToCompareMax = time+quarterInMs
                const timeToCompareMin = time-quarterInMs
                if(timeToCompareMin<=taskBegin && timeToCompareMax>=taskBegin){
                    if(beginLi===null){
                        beginLi = index
                    }
                }
                if(timeToCompareMin<=taskEnd && timeToCompareMax>=taskEnd){
                    if(endLi===null){
                        endLi = index
                    }
                }
            })
            const highlight = allLi.filter((li,index)=>{
                if(index>=beginLi && index <= endLi){
                    return li
                }
            })
            if(highlight[0].classList.contains('highlight')){
                return
            }
            else{
                highlight.forEach(li=>{
                    li.classList.add('highlight', 'opacity')
                })
            }
        },
        setCurrentLocationTaskSettings(){
            this.checkCurrentTask()
            this.$emit('checkActiveTask')
        },
        openTab(task){
            event.preventDefault()
            this.$emit('togglePopup', {
                type: 'task',
                data: task,
                coords:{
                    x: event.x,
                    y: event.y
                }
            })
        }
    }
}
</script>

<style scoped>
#Tasks{
    width: 100%;
    position: relative;
}
</style>