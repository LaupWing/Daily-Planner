<template>
    <form @submit.prevent="submit" class="task-edit">
        <nav>
            <li>General</li>
            <li>Colors</li>
            <li>Notes</li>
        </nav>
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
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'TaskEdit',
    props:['task', 'allTasks'],
    data(){
        return{
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
               },
               color: this.task.color
           },
           feedback: [],
           user: null
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
                days: this.getCheckedValues(),
                begin: `${addZero(this.editTask.begin.hours)}:${addZero(this.editTask.begin.minutes)}`,
                end: `${addZero(this.editTask.end.hours)}:${addZero(this.editTask.end.minutes)}`,
                color: this.editTask.color
            }
            const overlapCheck = checkOverlap(filterThisTask, taskObj)
             if(overlapCheck.findOverlap.length > 0){
                const overlapArray = overlapCheck.findOverlap
                const feedbackMsg = overlapCheck.feedbackMsg
                this.feedback = []
                this.feedback = addDayToMsg(overlapArray, feedbackMsg, taskObj)
            }else{
                const newDailyTasks = this.allTasks.map(task=>{
                    if(JSON.stringify(this.task)=== JSON.stringify(task)){
                        return taskObj
                    }else{
                        return task
                    }
                })
                // Prevent the state change from activating
                this.$emit('preventStateChange')
                db
                    .collection('planner')
                    .doc(this.user.uid)
                    .update({
                        dailyTasks: newDailyTasks
                    })
                    .then(()=>{
                        this.$emit('updateTasks', this.task)
                    })
            }
        },
        getCheckedValues(){
            const days = Array.from(this.$el.day)
                .filter(input=>input.checked)
                .map(input=>input.id)
            return days
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
        this.user = firebase.auth().currentUser
    }
}
</script>

<style>
.task-edit{
    position: relative;
    height: 100%;
}
.task-edit nav{
    position: relative;
    right: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.task-edit nav li{
    margin: 0 3px;
}
.task-edit .field{
    display: flex;
}
.task-edit input[type="text"]{
    width: 80%;
    margin: 6px auto;
    display: block;
}
.task-edit input[type="checkbox"]{
    display: none;
}
.task-edit .days{
    display: flex;
    justify-content: space-around;
    margin: 10px 0;
    font-size: .6em;
}
.task-edit .days label{
    border: solid 1px white;
    padding: 5px;
    width: 40px;
    text-align: center;
    border-radius: 5px;
    margin: 5px 0;
    display: inline-block;
    transition: .25s;
}
.task-edit input[type="checkbox"]:checked + label{
    background: white;
    color: black;
}
.task-edit .time-span-container{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
.task-edit .field.time-span{
    display: flex;
    flex-direction: column;
    font-size: 1em;
    width: 48%;
}
.task-edit .field.time-span > label{
    width: 100%;
    text-align: center; 
}
.task-edit .field.time-span .time{
    display: flex;
    justify-content: center;
    width: 100%;
}
.task-edit .field.time-span .hours,
.task-edit .field.time-span .minutes{
    display: flex;
    flex-direction: column;
}
.task-edit .buttons{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
}
.task-edit .buttons button{
    background: transparent;
    border: none;
    color: white;
    border-top: white solid 1px;
    transition: .25s;
    width: 50%;
    font-size: .7em;
    letter-spacing: 2px;
    padding: 5px 0;
    cursor: pointer; 
    display: inline-block;
}
.task-edit .buttons button:first-of-type{
    border-right: solid white 1px;
}
.task-edit .buttons button:hover{
    background: white;
    color: black;   
}
</style>