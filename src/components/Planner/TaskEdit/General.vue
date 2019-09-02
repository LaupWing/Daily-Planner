<template>
    <div class="general-info">
        <input type="text" v-model="editTask.task">
        <div class="days">
            <div class="day">
                <input type="checkbox" name="day" id="monday"
                    :checked="checkDay(task.days, 'monday')">
                <label for="monday">Mon</label>
            </div>
            <div class="day">
                <input type="checkbox" name="day" id="tuesday"
                    :checked="checkDay(task.days, 'tuesday')">
                <label for="tuesday">Tues</label>
            </div>
            <div class="day">
                <input type="checkbox" name="day" id="wednesday"
                    :checked="checkDay(task.days, 'wednesday')">
                <label for="wednesday">Wed</label>
            </div>
            <div class="day">
                <input type="checkbox" name="day" id="thursday"
                    :checked="checkDay(task.days, 'thursday')">
                <label for="thursday">Thu</label>
            </div>
            <div class="day">
                <input type="checkbox" name="day" id="friday"
                    :checked="checkDay(task.days, 'friday')">
                <label for="friday">Fri</label>
            </div>
            <div class="day">
                <input type="checkbox" name="day" id="saturday"
                    :checked="checkDay(task.days, 'saturday')">
                <label for="saturday">Sat</label>
            </div>
            <div class="day">
                <input type="checkbox" name="day" id="sunday" 
                    :checked="checkDay(task.days, 'sunday')">
                <label for="sunday">Sun</label>
            </div>
        </div>
        <div class="time-span-container">
            <div class="field time-span">
                <label for="task">Begin:</label>
                <div class="time">
                    <div class="hours">
                        <label for="hours">Hours</label>
                        <input type="number" name="hours" min="00" max="23" 
                            v-model="editTask.begin.hours">
                    </div>
                    <div class="minutes">
                        <label for="minutes">Minutes</label>
                        <input type="number" name="minutes" min="00" max="59" 
                            v-model="editTask.begin.minutes">
                    </div>
                </div>
            </div>
            <div class="field time-span">
                <label for="task">End:</label>
                <div class="time">
                    <div class="hours">
                        <label for="hours">Hours</label>
                        <input type="number" name="hours" min="00" max="23" 
                            v-model="editTask.end.hours">
                    </div>
                    <div class="minutes">
                        <label for="minutes">Minutes</label>
                        <input type="number" name="minutes" min="00" max="59" 
                            v-model="editTask.end.minutes">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'General',
    props:['editTask', 'task'],
    methods:{
        checkDay(days, day){
            if(days.includes(day)){
                return true
            }
        },
        
    }
}
</script>

<style>
.general-info .field{
    display: flex;
}
.general-info input[type="text"]{
    width: 80%;
    margin: 6px auto;
    display: block;
}

.general-info .days{
    display: flex;
    justify-content: space-around;
    margin: 10px 0;
    font-size: .6em;
}
.general-info .days label{
    border: solid 1px white;
    padding: 5px;
    width: 40px;
    text-align: center;
    border-radius: 5px;
    margin: 5px 0;
    display: inline-block;
    transition: .25s;
}
.general-info input[type="checkbox"]:checked + label{
    background: white;
    color: black;
}
.general-info .time-span-container{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
.general-info .field.time-span{
    display: flex;
    flex-direction: column;
    font-size: 1em;
    width: 48%;
}
.general-info .field.time-span > label{
    width: 100%;
    text-align: center; 
}
.general-info .field.time-span .time{
    display: flex;
    justify-content: center;
    width: 100%;
}
.general-info .field.time-span .hours,
.general-info .field.time-span .minutes{
    display: flex;
    flex-direction: column;
}
</style>