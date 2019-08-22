<template>
    <form @submit.prevent="submit" class="task-edit">
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
        <div class="field">
            <label for="task">Begin:</label>
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
        <div class="field">
            <label for="task">End:</label>
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
        <div class="feedback-container" v-if="feedback.length>0">
            <p 
                v-for="(feed, index) in feedback" 
                :key='index' 
                class="feedback"
            >
                {{feed}}
            </p>
        </div>
        <div class="buttons">
            <button>Cancel</button>
            <button>Accept</button>
        </div>
    </form>
</template>

<script>
import {checkOverlap} from '@/components/helpers/overlap'
import {addDayToMsg} from '@/components/helpers/overlap'
import {addZero} from '@/components/helpers/timeFormat'

export default {
    name: 'TaskEdit',
    props:['task', 'allTasks'],
    data(){
        return{
           editTask: Object.assign({},this.task),
           editTask:{
               task: this.task.task,
               days: this.task.days,
               begin:{
                   hours: this.task.begin.split(':')[0],
                   minutes: this.task.begin.split(':')[1]
               },
               end:{
                   hours: this.task.end.split(':')[0],
                   minutes: this.task.end.split(':')[1]
               }
           },
           feedback: [] 
        }
    },
    methods:{
        checkDay(days, day){
            if(days.includes(day)){
                return true
            }
        },
        accept(){
            const filterThisTask = this.allTasks
                .slice()
                .filter(task=>{
                    if(JSON.stringify(this.task)!== JSON.stringify(task)){
                        return task
                    }
                })

            const taskObj = {
                task: this.editTask.task,
                days: this.editTask.days,
                begin: `${addZero(this.editTask.begin.hours)}:${addZero(this.editTask.begin.minutes)}`,
                end: `${addZero(this.editTask.end.hours)}:${addZero(this.editTask.end.minutes)}`
            }
            const overlapCheck = checkOverlap(filterThisTask, taskObj)
             if(overlapCheck.findOverlap.length > 0){
                const overlapArray = overlapCheck.findOverlap
                const feedbackMsg = overlapCheck.feedbackMsg
                this.feedback = []
                this.feedback = addDayToMsg(overlapArray, feedbackMsg, taskObj)
                console.log(this.feedback)
            }
        },
        submit(){
            if(document.activeElement.textContent.trim() === 'Accept'){
                this.accept()
            }else{
                this.$emit('toggleEdit', this.task)
            }
        }
    },
    created(){
        
    }
}
</script>

<style>
.task-edit .field{
    display: flex;
}
</style>