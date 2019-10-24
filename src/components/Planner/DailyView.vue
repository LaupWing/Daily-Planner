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

    },
    data(){
        return{
            visibleTask: null,
        }
    },
    computed:{

    },
    methods:{
        setTask(task){
            if(task.task){
                this.currentTask = task
            }else{
                this.currentTask ={
                    task
                }
            }
        },
        emitToParent(func, data){
            this.$emit(func, data)
        }
    }
}
</script>

<style>

</style>