<template>
    <div 
        class="task"
        :class="{
            'expanded':expanded === task, 
            'activeByEdit':JSON.stringify(preventActions.data)===JSON.stringify(task),
            'opacity': checkVisibleTask
        }"
        :data-begin="getTimeOfThisDay('begin', task)"
        :data-end="getTimeOfThisDay('end', task)"
        :style="taskProps"
        @click="clickOnTask"
        @contextmenu="openTab(task)"
        @transitionend="animEnded"
    >
        <TaskMore
            :task="task"
            :edit="edit"
            :today="today"
            v-if="expanded === task"
            v-on:contractTask="contractTask"
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
    props:['task','edit', 'expanded', 'preventActions', 'today', 'diffrence', 'compareTop', 'visibleTask'],
    data(){
        return{
            taskHeightWhenExpanded: 250,
            top: null,
            height: null
        }
    },
    methods:{
        contractTask(){
            this.resetTimeline()
            this.$emit('expandTask')
        },
        getTimeOfThisDay(state, task){
            return task.days
                .find(day=>day.day===this.today)[state]
        },
        animEnded(){
            if(this.expanded === this.task){
                const container = document.querySelector('#planner')
                const scrollToY = this.$el.offsetTop - (container.offsetHeight/2) + (this.$el.offsetHeight/2) 
                container.scrollTo(0,scrollToY)
            }else{
                this.$emit('emitToParent', 'checkActiveTask')
            }
        },
        clickOnTask(){
            if(this.expanded === this.task || event.target.classList.contains('task-nav-item')){
                // If the user clicks cancel this will be triggerd
                return
            }
            if(this.expanded === null){
                // this.scrollToMidPoint()
                this.expandTask()
            }
            else{
                // this.scrollToMidPoint()
                this.resetTimeline()
                this.expandTask()
            }
        },
        resetTimeline(){
            document.querySelectorAll('#Timeline li').forEach(li=>{
                li.style.removeProperty('margin-bottom')
                li.style.removeProperty('margin-top')
            })
        },
        expandTask(){
            if(this.$el.offsetHeight <this.taskHeightWhenExpanded){
                const diffrence = this.taskHeightWhenExpanded - this.height
                this.adjustTimeline(this.$el, diffrence)
                this.$emit('expandTask', 
                    {
                        task: this.task,
                        compareTop: this.top,
                        diffrence: diffrence
                    })
            }else{
                this.$emit('expandTask', this.task)
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
        taskHeightAndPosition(){
            const startingPoint = this.calculatePoint(this.task.days.find(day=>day.day===this.today).begin)
            this.top = startingPoint
            const height = this.calculatePoint(this.task.days.find(day=>day.day===this.today).end) - startingPoint
            this.height = height
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
        },
        checkVisibleTask(){
            if(this.$el === this.visibleTask){
                return true
            }else{
                return false
            }
        },
    },
    created(){
        
    },
    mounted(){
        this.taskHeightAndPosition()
    },
}
</script>

<style>

</style>