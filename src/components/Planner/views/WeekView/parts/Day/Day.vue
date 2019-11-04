<template>
    <div class="day">
        <div
            :class="{'today': day === today}"
        >
            <h3>{{day.slice(0,3)}}</h3>
            <h3>{{date+(i-compareDateIndex)}}</h3>
        </div>
        <!-- <div 
            class="task"
            v-for="(task,i2) in getTaskOfThisDay(day)"
            :key="i2"
            :style="{top: 100*i2 +'px'}"
        >
            {{task.task}}
        </div> -->
        <Task
            v-for="(task,i2) in getTaskOfThisDay(day)"
            :key="i2"
        />
    </div>
</template>

<script>
export default {
    name: 'DayInWeekView',
    props:['day', 'today'],
    components:{
        Task
    },
    methods:{
        getTaskOfThisDay(day){
            if(this.dailyTasks.length === 0)    return []
            const filterTasks = this.dailyTasks
            const filteredTasks = filterTasks.filter(task=>task.days.find(t2=>t2.day===day))
                // .map(task2=>{
                //     const filteroutDays = task2.days.filter(d2=>d2.day===day)
                //     console.log(filteroutDays)
                //     return task2
                // })
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
            // return filterTasks
            return tasksOfThisDay
        }
    }
}
</script>

<style>

</style>