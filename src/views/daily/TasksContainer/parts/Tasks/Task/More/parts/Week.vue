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
        <SetTaskTime
            v-if="dayToEdit"
            :dayToEdit="dayToEdit"
            :pos="pos"
            v-on:cancel="reset"
            v-on:accept="changeEdit"
        />
    </div>
</template>

<script>
import SetTaskTime from '@/components/SetTaskTime/SetTaskTime'

export default {
    name: 'Week',
    props:['editTask', 'edit'],
    components:{
        SetTaskTime
    },
    data(){
        return{
            weekName: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            dayToEdit: null,
            pos: null
        }
    },
    methods:{
        checkDay(day){
            return this.editTask.days.find(d=>d.day === day) ? true : false
        },
        setDuration(day){
            const findDay = this.editTask.days.find(d=>d.day === day)
            return `${findDay.begin} - ${findDay.end}`
        },
        editDay(day){
            event.target.classList.add('active')
            this.pos = { 
                top: event.target.getBoundingClientRect().top,
                left: event.target.getBoundingClientRect().left
            }
            this.dayToEdit = this.editTask.days.find(d=>d.day === day)
        },
        reset(){
            this.$el.querySelectorAll('.task-duration').forEach(task=>task.classList.remove('active'))
            this.dayToEdit = null
        },
        changeEdit(newDay){
            this.dayToEdit = null
            this.$emit('changeDay', newDay)
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
.week .task-duration.edit:hover,
.week .task-duration.active{
    color: var(--task-color);
    background: white;
}

</style>