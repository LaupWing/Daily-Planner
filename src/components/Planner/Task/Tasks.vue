<template>
    <div id="Tasks"> 
        <div 
            class="task"
            v-for="(task, index) in tasks"
            :class="{'expanded':expanded === task}"
            :key="index"
            :data-begin="getTimeOfThisDay('begin', task)"
            :data-end="getTimeOfThisDay('end', task)"
            :style="{background: task.color.color}"
            @click="clickOnTask(task)"
        >
            <!-- <i 
                class="far fa-edit" 
                v-if="edit !== task" 
                @click="editTask(task)">
            </i> -->
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
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import {converDateToMS} from '@/components/helpers/timeFormat'
import {days} from '@/components/helpers/timeFormat'
import {checkConnectedLi} from '@/components/helpers/timeline'
import TaskMore from '@/components/Planner/Task/More/TaskMore'

export default {
    name: 'Tasks',
    components:{
        TaskMore
    },
    props:['days'],
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
            taskHeightWhenExpanded: 250
        }
    },
    methods:{
        updateFinished(){
            this.expanded = null 
            this.updateTasks()
            this.applyPrevStyles()
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
        },
        clickOnTask(task){
            if(this.expanded === task){
                // If the user clicks cancel this will be triggerd
                return
            }else if(this.expanded === null){
                this.expanded = task
                this.expandTask()
            }
            else{
                // When the user clicks on another task to edit and keeps one open
                console.log('click on another task')
                this.applyPrevStyles()
                this.expanded = task
                this.expandTask()
            }
        },
        contractTask(){
            const liItems = document.querySelectorAll('ul#Timeline li')
            const reset = ()=>{
                this.expanded = null
                liItems.forEach(li=>li.removeEventListener('transitionend', reset))
            }
            liItems.forEach(li=>{
                if(li.style.marginTop || li.style.marginBottom){
                    li.addEventListener('transitionend',reset)
                }
            })
            this.applyPrevStyles()
            // Wait until the animation is ended
            // TODO: change the code below to a transitionend event for more dynamic code
            this.$el.querySelectorAll('.task').forEach(task=>{
                task.classList.remove('expanded')
            })
        },
        expandTask(task){
            // if(this.expanded === task){
            //     return
            // }
            // this.expanded = task
            this.taskHeights = Array.from(this.$el.querySelectorAll('.task'))
                .map((task)=>{
                    return{
                        task: task,
                        height: task.style.height,
                        top: task.style.top
                    }
                }) 
            let el = event.target.classList[0] === 'task' ? event.target : event.target.parentElement
            if(el.offsetHeight <this.taskHeightWhenExpanded){
                const diffrence = this.taskHeightWhenExpanded - Number(el.style.height.split('px')[0])
                this.adjustTimeline(el, diffrence)
                this.adjustTopValues(diffrence, el.style.top)
                el.style.removeProperty('height')
            }
        },
        applyPrevStyles(){
            document.querySelectorAll('#Timeline li').forEach(li=>{
                li.style.removeProperty('margin-bottom')
                li.style.removeProperty('margin-top')
            })
            this.$el.querySelectorAll('.task').forEach(task=>{
                for(let preveTask of this.taskHeights){
                    if(preveTask.task===task){
                        task.style.height = preveTask.height
                        task.style.top = preveTask.top
                    }
                }
            })
        },
        adjustTimeline(el, diffrence){
            const connectedLi = checkConnectedLi(el)
            const adjustLi = connectedLi[connectedLi.length-1]
            const bottomOfsetTask = el.offsetTop + el.offsetHeight
            const bottomOfLi = adjustLi.offsetTop + adjustLi.offsetHeight
            if(bottomOfsetTask >= bottomOfLi){
                adjustLi.style.marginBottom = `${diffrence}px`
            }else{
                adjustLi.style.marginTop = `${diffrence}px`
            }

        },
        adjustTopValues(diffrence, top){
            this.$el.querySelectorAll('.task').forEach(task=>{
                const numberIterationTop = Number(task.style.top.split('px')[0])
                const compareTop = Number(top.split('px')[0])
                if(numberIterationTop > compareTop){
                    task.style.top = numberIterationTop + diffrence + 'px'
                }
            })
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
        updateTasks(){
            const findLiWithMargin = Array.from(document.querySelectorAll('#Timeline li'))
                .find(li=>{
                    if(li.style.marginTop || li.style.marginBottom){
                        return li
                    }
                })
            
            const bridge = (e)=>{
                if(e.propertyName==='margin-top'||e.propertyName==='margin-bottom'){
                    console.log('transitionended')
                    this.getTasks(()=>{
                        this.taskHeightAndPosition()
                    })
                    document.querySelectorAll('#Timeline li').forEach(li=>{
                        li.removeEventListener('transitionend', bridge)
                    })
                }
            }
            // If there is a li with inline style margins we need adjust the positions according the li positions
            this.preventStateChangeFlag = false
            if(findLiWithMargin){
                document.querySelectorAll('#Timeline li').forEach(li=>{
                    li.addEventListener('transitionend', bridge)
                })
            }else{
                this.getTasks(()=>{
                    this.taskHeightAndPosition()
                })
            }
        }
    },
    computed:{
        
    },
    mounted(){
        this.getTasks(()=>{
            this.taskHeightAndPosition()
            this.checkCurrentTask()
            this.taskWatcher()
        })
        let ref = db.collection('planner')
        // This Snapchot change is currntly only use for checking the color label changes
        ref.onSnapshot(snapshot=>{
            snapshot.docChanges().forEach(change=>{
                const userId = firebase.auth().currentUser.uid
                if(change.type === 'modified' && change.doc.id === userId){
                    if(!this.preventStateChangeFlag){
                        this.getTasks(()=>{
                            this.taskHeightAndPosition()
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
    border: white solid 2px;
    opacity: .1;
    overflow: hidden;
    /* padding: 2px 5px; */
}

#Tasks .task.opacity{
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