<template>
    <div class="day">
        <div
            :class="{'today': day === today}"
        >
            <h3>{{day.slice(0,3)}}</h3>
            <h3>{{date+(index-compareDateIndex)}}</h3>
        </div>
        <Task
            v-for="(task,i2) in getTaskOfThisDay(day)"
            :key="i2"
            :index="i2"
            :task="task"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Task from '@/components/Planner/views/WeekView/parts/Day/parts/Task'

export default {
    name: 'DayInWeekView',
    props:['day', 'today', 'index', 'date', 'compareDateIndex'],
    components:{
        Task
    },
    computed:{
        ...mapGetters(['getUserData'])
    },
    data(){
        return{

        }
    },
    methods:{
        getTaskOfThisDay(day){
            if(this.getUserData.dailyTasks.length === 0)    return []
            const filterTasks = this.getUserData.dailyTasks
            const filteredTasks = filterTasks.filter(task=>task.days.find(t2=>t2.day===day))
            
            const tasksOfThisDay = []
            filteredTasks.forEach(task=>{
                task.days.forEach(d2=>{
                    if(d2.day === day){
                        tasksOfThisDay.push({
                            task: task.task,
                            begin: d2.begin,
                            end: d2.end
                        })
                    }
                })
            })
            
            return tasksOfThisDay
        }
    }
}
</script>

<style>

</style>