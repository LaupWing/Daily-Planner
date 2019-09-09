<template>
    <div class="week">
        <div 
            class="day"
            v-for="(day, index) in weekName"
            :key="index"
        >
            <div class="day-name">
                {{day}}
            </div>
            <div 
                class="task-duration" 
                v-if="checkDay(day) && !edit"
            > 
                {{setDuration(day)}}
            </div>
            <div 
                class="task-duration edit" 
                v-if="checkDay(day) && edit"
                @click="editDay(day)"
            > 
                {{setDuration(day)}}
            </div>
        </div>
        <ChangeDay
            v-if="dayToEdit"
            :dayToEdit="dayToEdit"
            v-on:cancel="reset"
        />
    </div>
</template>

<script>
import ChangeDay from '@/components/Planner/Task/More/parts/Week/ChangeDay'
export default {
    name: 'Week',
    props:['task', 'edit'],
    components:{
        ChangeDay
    },
    data(){
        return{
            weekName: ['monday', 'thursday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            dayToEdit: null
        }
    },
    methods:{
        checkDay(day){
            const findDay = this.task.days.find(d=>d.day === day)
            if(findDay){
                return true
            }else{
                return false
            }
        },
        setDuration(day){
            const findDay = this.task.days.find(d=>d.day === day)
            return `${findDay.begin} - ${findDay.end}`
        },
        editDay(day){
            this.dayToEdit = this.task.days.find(d=>d.day === day)
        },
        reset(){
            this.dayToEdit = null
        }
    }
}
</script>

<style>
.week{
    margin-top: 13px;
    font-size: .8em;
}
.week .day{
    display: flex;
    width: 60%;
    margin: 10px auto;
    justify-content: space-between;
}
.week .task-duration.edit{
    text-decoration: underline;
    cursor: pointer;
    transition: .25s;
}
.week .task-duration.edit:hover{
    color: var(--task-color);
    background: white;
}

</style>