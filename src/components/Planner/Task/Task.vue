<template>
    <div 
        class="task"
        :class="{
            'expanded':expanded === task, 
            'activeByEdit':JSON.stringify(preventActions.data)===JSON.stringify(task)
        }"
        :data-begin="getTimeOfThisDay('begin', task)"
        :data-end="getTimeOfThisDay('end', task)"
        :style="{background: task.color.color}"
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
    </div>
</template>

<script>
import TaskMore from '@/components/Planner/Task/More/TaskMore'
export default {
    name: 'Task',
    components:{
        TaskMore
    },
    props:['task','edit', 'expanded', 'preventActions', 'today'],
    data(){
        return{
            taskHeightWhenExpanded: 250
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
            this.$el.style.top = `${startingPoint}px`

            const height = this.calculatePoint(this.task.days.find(day=>day.day===this.today).end) - startingPoint
            this.$el.style.height = `${height}px`
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
        expandedHeights(){
            if(this.expanded){
                return 
            }
            else if(this.expanded === this.task){
                this.$el.style.removeProperty('height')
            }
            else{
                return 
            }
        }
    },
    created(){
        console.log(this.task)
    },
    mounted(){
        this.taskHeightAndPosition()
    }
}
</script>

<style>

</style>