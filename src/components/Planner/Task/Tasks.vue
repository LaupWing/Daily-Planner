<template>
    <div id="Tasks"> 
        <!-- <div 
            class="task"
            v-for="(task, index) in tasks"
            :class="{
                'expanded':expanded === task, 
                'activeByEdit':JSON.stringify(preventActions.data)===JSON.stringify(task)
            }"
            :key="index"
            :data-begin="getTimeOfThisDay('begin', task)"
            :data-end="getTimeOfThisDay('end', task)"
            :style="{
                background: task.color.color
            }"
            @click="clickOnTask(task)"
            @contextmenu="openTab(task)"
        >
            <TaskMore
                :task="task"
                :edit="edit"
                :today="today"
                v-if="expanded === task"
                v-on:contractTask="contractTask"
                v-on:preventStateChange='preventStateChange'
                v-on:updateFinished="updateFinished"

            />
            <div class="info" v-else>
                <p class="task-name" v-if="edit !== task">{{task.task}}</p>
                <div class="time">
                    <p class="task-begin" v-if="edit !== task">{{getTimeOfThisDay('begin', task)}}-</p>
                    <p class="task-end" v-if="edit !== task">{{getTimeOfThisDay('end', task)}}</p>
                </div>
            </div>
        </div> -->
        <Task
            v-for="(task, index) in tasks"
            :key="index"
            :task="task"
            :edit="edit"
            :today="today"
            :compareTop="compareTop"
            :diffrence="diffrence"
            :expanded="expanded"
            :visibleTask="visibleTask"
            :preventActions="preventActions"
            v-on:emitToParent="emitToParent"
            v-on:expandTask="expandTask"
        />
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import {converDateToMS} from '@/components/helpers/timeFormat'
import {days} from '@/components/helpers/timeFormat'
import {checkConnectedLi} from '@/components/helpers/timeline'
import TaskMore from '@/components/Planner/Task/More/TaskMore'
import Task from '@/components/Planner/Task/Task'

export default {
    name: 'Tasks',
    components:{
        TaskMore,
        Task
    },
    props:['preventActions', 'visibleTask'],
    data(){
        return{
            tasks:[],
            allTasks: null,
            currentTask: null,
            edit: null,
            taskHeights:[],
            preventStateChangeFlag: false,
            today: null,
            expanded: null,
            taskHeightWhenExpanded: 250,
            compareTop: null,
            diffrence: null
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
                this.expanded = obj
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
            const findTask = this.tasks.find((task)=>{
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
        getTasks(extraCallback){
            db
                .collection('planner')
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then(doc=>{
                    if(doc.exists){
                        if(doc.data().dailyTasks){
                            this.allTasks = doc
                                .data()
                                .dailyTasks
                                
                            const date = new Date()
                            const dateNumber =  date.getDay()
                            const currentDay = days[dateNumber]
                            this.today = currentDay
                            this.tasks = doc
                                .data()
                                .dailyTasks
                                .filter(task=>{
                                    const checkDay = task.days.some(day=>day.day===currentDay)
                                    if(checkDay){
                                        return task
                                    }
                                })
                        }
                    }
                })
                .then(()=>{
                    if(extraCallback){
                        extraCallback()
                    }
                })
        },
        openTab(task){
            event.preventDefault()
            this.$emit('togglePopup', {
                type: 'task',
                data: task,
                coords:{
                    x: event.x,
                    y: event.y
                },
                elPrio2: '#Tasks .task'
            })
        }
    },
    mounted(){
        this.getTasks(()=>{
            this.checkCurrentTask()
            this.taskWatcher()
        })

        // This Snapchot change is currntly only use for checking the color label changes
        let ref = db.collection('planner')
        ref.onSnapshot(snapshot=>{
            snapshot.docChanges().forEach(change=>{
                const userId = firebase.auth().currentUser.uid
                if(change.type === 'modified' && change.doc.id === userId){
                    if(!this.preventStateChangeFlag){
                        this.getTasks(()=>{
                            // this.taskHeightAndPosition()
                            console.log('State changed')
                        })
                    }
                }
            })
        })
    }
}
</script>

<style>
#Tasks{
    width: 100%;
    position: relative;
}

#Tasks .task{
    position: absolute;
    width: 90%;
    display: flex;
    flex-direction: column;
    transition: .5s ease-out;
    background: orange;
    color: white;
    border-radius: 6px;
    opacity: .1;
    overflow: hidden;
    /* padding: 2px 5px; */
}

#Tasks .task.opacity{
    opacity: 1;
}
#Tasks .task.activeByEdit{
    opacity: 1;
}
/* #Tasks .task i{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
} */
#Tasks .days{
    display: flex;
}

#Tasks .task .task-name{
    max-width: 90%;
}
#Tasks .task .time{
    display: flex;
    font-size: .7em;
}
#Tasks .task.expanded{
    height: 250px;
    opacity: 1;
}
#Tasks .task .info{
    pointer-events: none;
    padding: 2px 5px;
}
</style>