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
        <app-popup
            v-if="popupSettings"
            :settings="popupSettings"
            :componentId="'SetTimeTask'"
            v-on:turnOffPopup="reset"
        />
    </div>
</template>

<script>
import Popup from '@/components/Popup/Popup'

export default {
    name: 'Week',
    props:['editTask', 'edit'],
    components:{
        'app-popup':Popup
    },
    data(){
        return{
            weekName: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            dayToEdit: null,
            pos: null,
            elClicked: null,
            popupSettings: null
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
            this.popupSettings = {
                pos : { 
                    top: event.target.getBoundingClientRect().top,
                    left: event.target.getBoundingClientRect().left
                },
                dayToEdit : this.editTask.days.find(d=>d.day === day),
                elClicked : event.target
            }
        },
        reset(){
            this.$el.querySelectorAll('.task-duration').forEach(task=>task.classList.remove('active'))
            this.popupSettings = null
        },
        changeEdit(newDay){
            this.popupSettings = null
            this.$emit('changeDay', newDay)
        }
    }
}
</script>

<style scoped>
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