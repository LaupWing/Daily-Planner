<template>
    <div 
        v-if="view === 'single'"
        id="planner"
        @scroll="scrollEvent"
        @click="createTask"
    >
        <div class="indicator" @click="turnoff"></div>
        <Timeline/>
        <Tasks
            :visibleTask="visibleTask"
            :userData="userData"
            v-on:setTask='setTask'
            v-on:checkActiveTask='checkTaskByScroll'
        />
    </div>
</template>

<script>
import Timeline from '@/components/Planner/Timeline'
import Tasks from '@/components/Planner/Tasks/Tasks'

export default {
    name: 'DailyView',
    components:{
        Tasks,
        Timeline
    },
    data(){
        return{
            visibleTask: null,
        }
    },
    computed:{

    },
    methods:{
        emitToParent(func, data){
            this.$emit(func, data)
        }
        createTask(){
        // this.test()
            // if(event.target.id){
            //     if(event.target.id === 'Tasks' || event.target.id === 'planner'){
            //     const container = this.$el.querySelector('#planner')
            //     const clickYCoord = event.clientY
            //     const zeroScrollCoord = container.getBoundingClientRect().top + (container.offsetHeight/2)
            //     const begin = (clickYCoord -zeroScrollCoord) + container.scrollTop 
            //     container.scrollTo(0,begin)
            //     } 
            // }
        },
        setTask(task){
            if(task.task){
                this.currentTask = task
            }else{
                this.currentTask ={
                    task
                }
            }
        },
    }
}
</script>

<style>

</style>