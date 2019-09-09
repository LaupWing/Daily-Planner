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
        <div 
            class="edit-day-bg" 
            v-if="dayToEdit"
        >
            <div class="edit-day">
                <label class="day">{{dayToEdit.day.slice(0,3).trim()}}</label>
            <div class="time-span-container">
                <div class="field time-span">
                    <label for="task">Begin:</label>
                    <div class="time">
                        <div class="hours">
                            <label for="hours">Hours</label>
                            <input type="number" name="hours" min="00" max="23" v-model="dayToEdit.begin.split(':')[0]">
                        </div>
                        <div class="minutes">
                            <label for="minutes">Minutes</label>
                            <input type="number" name="minutes" min="00" max="59" v-model="dayToEdit.begin.split(':')[1]">
                        </div>
                    </div>
                </div>
                <div class="field time-span">
                    <label for="task">End:</label>
                    <div class="time">
                        <div class="hours">
                            <label for="hours">Hours</label>
                            <input type="number" name="hours" min="00" max="23" v-model="dayToEdit.end.split(':')[0]">
                        </div>
                        <div class="minutes">
                            <label for="minutes">Minutes</label>
                            <input type="number" name="minutes" min="00" max="59" v-model="dayToEdit.end.split(':')[1]">
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Week',
    props:['task', 'edit'],
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
            console.log(this.dayToEdit)
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
.week .edit-day-bg{
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0,.4);
    z-index: 1000;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.week .edit-day-bg .edit-day{
    width: 280px;
    height: 180px;
    background: white;
    color: var(--task-color);
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
}
.week .edit-day-bg .edit-day label.day{
    width: 40px;
    height: 40px;
    line-height: 40px;
    border: solid 1px var(--task-color);
    border-radius: 50%;
    text-align: center;
    font-size: 12px;
    display: inline-block;
    margin: auto;
}
.week .time-span-container{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
.week .field.time-span{
    display: flex;
    flex-direction: column;
    font-size: 1em;
    width: 45%;
}
.week .field.time-span > label{
    width: 100%;
    text-align: center; 
}
.week .field.time-span .time{
    display: flex;
    justify-content: center;
    width: 100%;
}
.week .field.time-span .hours,
.week .field.time-span .minutes{
    display: flex;
    flex-direction: column;
}
</style>