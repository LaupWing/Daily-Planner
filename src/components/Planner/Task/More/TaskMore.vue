<template>
    <div class="task-more">
        <TaskNav
            :section="section"
            :task="task"
        />
        <!-- <General

        /> -->
    </div>
</template>

<script>
import General from '@/components/Planner/Task/More/General'
import TaskNav from '@/components/Planner/Task/More/TaskNav'

export default {
    name:'TaskMore',
    props:['task'],
    components:{
        General,
        TaskNav
    },
    data(){
        return{
            section: 'general'
        }
    },
     methods:{

     }
}
</script>

<style>
.task-more{
    width: 100%;
    height: 100%;
}
</style>