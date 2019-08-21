<template>
    <div id="Tasks"> 
        <div 
            class="task"
            v-for="(task, index) in tasks"
            :key="index"
            :style="styleObj"
            :data-begin="task.begin"
            :data-end="task.end"
        >
            {{task.task}}
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import {converDateToMS} from '@/components/helpers/timeFormat'
import {days} from '@/components/helpers/timeFormat'
export default {
    name: 'Tasks',
    props:['days'],
    data(){
        return{
            tasks:[
                // {
                //     task:'Cleaning Room',
                //     begin: '02:00',
                //     end: '02:30'
                // },
                {
                    task:'Cleaning Room',
                    begin: '01:40',
                    end: '02:00'
                },
                {
                    task:'Cleaning Room',
                    begin: '16:15',
                    end: '19:59'
                },
                {
                    task:'Cleaning Room',
                    begin: '12:15',
                    end: '14:30'
                }
            ],
            allTasks: null,
            currentTask: null
        }
    },
    methods:{
        checkCurrentTask(){
            setTimeout(()=>{
                this.taskWatcher()
            },1000)
            setInterval(()=>{
                this.taskWatcher()
            },60000)
        },
        taskWatcher(){
            const findTask = this.tasks.find((task)=>{
                const begin = converDateToMS(task.begin)
                const end = converDateToMS(task.end)
                const currentTimeInMS = converDateToMS()
                if(begin<=currentTimeInMS && end>=currentTimeInMS){
                    return task
                }

            })
            if(findTask){
                this.changeTimeSize(findTask)
                this.currentTask = findTask.task
                this.$emit('setTask', this.currentTask)
            }else{
                document.querySelectorAll('#Timeline li').forEach(li=>{
                    li.classList.remove('highlight')
                })
                this.currentTask = 'No Tasks Right now!'
                this.$emit('setTask', this.currentTask)
            }

        },
        changeTimeSize(task){
            const quarterInMs = 900000
            const allLi = Array.from(document.querySelectorAll('#Timeline li'))
            const taskBegin = converDateToMS(task.begin)
            const taskEnd = converDateToMS(task.end)
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
        taskHeightAndPosition(){
            const allTasks = this.$el.querySelectorAll('.task')
            allTasks.forEach(task=>{
                const startingPoint = this.calculatePoint(task.dataset.begin)
                task.style.top = `${startingPoint}px`

                const height = this.calculatePoint(task.dataset.end) - startingPoint
                task.style.height = `${height}px`
            })
        },
        calculatePoint(state){
            const allLi = Array.from(document.querySelectorAll('#Timeline li'))
            const li = allLi
                .find(li=>{
                    const liHour = li.dataset.time.split(':')[0]
                    const taskHour = state.split(':')[0]
                    if(liHour===taskHour){
                        return li
                    }
                })
            const calcMinutes = ((li.offsetHeight*2)/60)*state.split(':')[1]
            const point = li.offsetTop + (li.offsetHeight/2) + calcMinutes
            return point
        }
    },
    computed:{
        styleObj:function(){
            return {
                background: 'orange'
            }
        }
    },
    created(){
    },
    mounted(){
        db
            .collection('planner')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc=>{
                if(doc.exists){
                    this.allTasks = doc
                        .data()
                        .dailyTasks
                    
                    this.tasks = doc
                        .data()
                        .dailyTasks
                        .filter(task=>{
                            const date = new Date()
                            const day = days[date.getDay()-1]
                            if(task.days.includes(day)){
                                return task
                            }
                        })
                }
            })
            .then(()=>{
                    this.taskHeightAndPosition()
                    this.checkCurrentTask()
            })
    }
}
</script>

<style>
#Tasks{
    width: 100%;
    position: relative;
}

.task{
    position: absolute;
}
</style>