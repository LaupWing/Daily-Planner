<template>
    <div 
        class="task"
        :class="{
            'expanded':expanded === task, 
            'activeByEdit':JSON.stringify(preventActions.data)===JSON.stringify(task)
        }"
        :key="index"
        :data-begin="getTimeOfThisDay('begin', task)"
        :data-end="getTimeOfThisDay('end', task)"
        :style="{background: task.color.color}"
        @click="clickOnTask(task)"
        @contextmenu="openTab(task)"
    >
        <TaskMore/>
    </div>
</template>

<script>
import TaskMore from '@/components/Planner/Task/More/TaskMore'
export default {
    name: 'Task',
    components:{
        TaskMore
    },
    props:['task','edit', 'expanded', 'preventActions'],
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
    }
}
</script>

<style>

</style>