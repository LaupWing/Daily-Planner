<template>
    <form @submit.prevent="submit" class="task-edit">
        <nav>
            <li 
                :style="[part === 'general' ? {'background': task.color.color} : {'background': 'transparent'}]"
                @click="changePart('general')"
            >
                General
            </li>
            <li
                :style="[part === 'colors' ? {'background': task.color.color} : {'background': 'transparent'}]"
                @click="changePart('colors')"
            >
                Colors
            </li>
            <li
                :style="[part === 'notes' ? {'background': task.color.color} : {'background': 'transparent'}]"
                @click="changePart('notes')"
            >
                Notes
            </li>
            <li
                class="delete"
                 :style="[part === 'delete' ? {'background': task.color.color} : {'background': 'transparent'}]"
                @click="changePart('delete')"
            >
                <i class="fas fa-trash-alt"></i>
            </li>
        </nav>
        <Colors
            v-if="part === 'colors'"
            :editTask="editTask"
            v-on:updateColorlabel="updateColorlabel"
        />
        <General
            :editTask="editTask"
            v-if="part === 'general'"
        />
        <div class="delete"
            v-if="part === 'delete'"
        >
            <h3>You sure you want to Delete this task?</h3>
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
        <div class="buttons" v-if="part !== 'delete'">
            <button>Cancel</button>
            <button>Accept</button>
        </div>
        <div class="buttons" v-if="part === 'delete'">
            <button>No</button>
            <button>Yes</button>
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
import Colors from '@/components/Planner/TaskEdit/Colors'

export default {
    name: 'TaskEdit',
    components:{
        General,
        Colors
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
                days: this.editTask.days,
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
            if(this.part === 'delete'){
                if(document.activeElement.textContent.trim() === 'Yes'){
                    console.log('delete')
                }else{
                    this.$emit('toggleEdit', this.task)
                }
            }else{
                if(document.activeElement.textContent.trim() === 'Accept'){
                    this.accept()
                }else{
                    this.$emit('toggleEdit', this.task)
                }
            }
        },
        changePart(part){
            this.part = part
        },
        updateColorlabel(color){
            this.editTask.color = color
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
    background: rgba(0,0,0,.7);
    font-size: .8em;
}
.task-edit nav li{
    padding: 3px 20px;
    margin: 0;
    cursor: pointer;
    transition: .25s;
}
#Tasks .task-edit nav li i{
    position: relative;
    top: 0;
    right: 0;
    left: 0;
}
.task-edit .delete h3{
    font-weight: normal;
    font-size: 1em;
    text-align: center;
    margin-top: 15%;
}
.task-edit input[type="checkbox"]{
    display: none;
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