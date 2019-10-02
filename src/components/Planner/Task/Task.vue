<template>
    <div 
        class="task"
        :class="{
            'expanded':expanded === task, 
            'activeByEdit':JSON.stringify(preventActions.data)===JSON.stringify(task)
        }"
        :data-begin="getTimeOfThisDay('begin', task)"
        :data-end="getTimeOfThisDay('end', task)"
        :style="taskProps"
        @click="clickOnTask2"
        @contextmenu="openTab(task)"
    >
        <TaskMore
            :task="task"
            :edit="edit"
            :today="today"
            v-if="expanded === task"
        />
        <div class="info" v-else>
            <p class="task-name" v-if="edit !== task">{{task.task}}</p>
            <div class="time">
                <p class="task-begin" v-if="edit !== task">{{getTimeOfThisDay('begin', task)}}-</p>
                <p class="task-end" v-if="edit !== task">{{getTimeOfThisDay('end', task)}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import TaskMore from '@/components/Planner/Task/More/TaskMore'
import {checkConnectedLi} from '@/components/helpers/timeline'

export default {
    name: 'Task',
    components:{
        TaskMore
    },
    props:['task','edit', 'expanded', 'preventActions', 'today', 'diffrence', 'compareTop'],
    data(){
        return{
            taskHeightWhenExpanded: 250,
            top: null,
            height: null
        }
    },
    methods:{
        getTimeOfThisDay(state, task){
            return task.days
                .find(day=>day.day===this.today)[state]
        },
        clickOnTask(task){
            if(this.preventActions){
                if(this.preventActions.type === 'task')  return
            }
            if(this.expanded === task){
                // If the user clicks cancel this will be triggerd
                return
            }else if(this.expanded === null){
                this.expanded = task
                this.expandTask()
            }
            else{
                // When the user clicks on another task to edit and keeps one open
                this.applyPrevStyles()
                this.expanded = task
                this.expandTask()
            }
        },
        clickOnTask2(){
            if(this.preventActions){
                if(this.preventActions.type === 'task')  return
            }
            if(this.expanded === this.task){
                // If the user clicks cancel this will be triggerd
                return
            }else if(this.expanded === null){
                this.expandTask2()
            }
            else{
                // When the user clicks on another task to edit and keeps one open
                // this.applyPrevStyles()
                // this.expanded = task
                this.expandTask2()
            }
        },
        expandTask2(){
            if(this.$el.offsetHeight <this.taskHeightWhenExpanded){
                const diffrence = this.taskHeightWhenExpanded - this.height
                this.adjustTimeline(this.$el, diffrence)
                this.$emit('expandTask2', 
                    {
                        task: this.task,
                        compareTop: this.top,
                        diffrence: diffrence
                    })
            }else{
                this.$emit('expandTask2', this.task)
            }
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
        expandTask(task){
            this.taskHeights = Array.from(document.querySelectorAll('#planner .task'))
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
        taskHeightAndPosition(){
            const startingPoint = this.calculatePoint(this.task.days.find(day=>day.day===this.today).begin)
            // this.$el.style.top = `${startingPoint}px`
            this.top = startingPoint
            const height = this.calculatePoint(this.task.days.find(day=>day.day===this.today).end) - startingPoint
            this.height = height
            // this.$el.style.height = `${height}px`
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
        taskProps(){
            if(!this.expanded){
                return {
                    top: this.top + 'px',
                    height: this.height + 'px',
                    background: this.task.color.color
                }
            }
            else if(this.expanded === this.task){
                if(this.$el.offsetHeight <this.taskHeightWhenExpanded){
                    return {
                        top: this.top + 'px',
                        height: this.taskHeightWhenExpanded + 'px',
                        background: this.task.color.color
                    }
                }else{
                    return {
                        top: this.top + 'px',
                        height: this.height + 'px',
                        background: this.task.color.color
                    }
                }
            }
            else if(this.expanded !== this.task){
                if(this.compareTop === null){
                    return{
                        top: this.top + 'px',
                        height: this.height + 'px',
                        background: this.task.color.color
                    }
                }
                if(this.top > this.compareTop){
                    // task.style.top = numberIterationTop + diffrence + 'px'
                    return{
                        top: this.top + this.diffrence + 'px',
                        height: this.height + 'px',
                        background: this.task.color.color
                    }
                }else{
                    return{
                        top: this.top + 'px',
                        height: this.height + 'px',
                        background: this.task.color.color
                    }
                }
            }
        }
    },
    created(){
        // console.log(this.task)
    },
    mounted(){
        this.taskHeightAndPosition()
    }
}
</script>

<style>

</style>