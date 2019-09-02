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

</style>