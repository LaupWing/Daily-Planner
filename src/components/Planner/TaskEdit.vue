<template>
    <form @submit.prevent="submit" class="task-edit">
        <nav>
            <li :style="[part === 'general' ? {'background': task.color.color} : {'background': 'transparent'}]">General</li>
            <li>Colors</li>
            <li>Notes</li>
        </nav>
        <General
            :task="task"
            :editTask="editTask"
        />
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
import General from '@/components/Planner/TaskEdit/General'

export default {
    name: 'TaskEdit',
    components:{
        General
    },
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
           user: null,
           part: 'general'
        }
    },
    methods:{
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
    },
    computed:{
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
    left: 0;
    background: rgba(0,0,0,.5);
    font-size: .8em;
}
.task-edit nav li{
    padding: 3px 5px;
    margin: 0;
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