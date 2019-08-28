<template>
<div class="add-task-bg">
    <form @submit.prevent="submit" id="AddTask"> 
        <h2>AddTask</h2>
        <div class="info">
            <div class="color-labels-container">
                <ColorLabels
                    :addTask='true'
                    v-on:addColorLabel='addColorLabel'
                />
            </div>
            <div class="general">
                <h2>General Info</h2>
                <div class="field">
                    <label for="task">Task:</label>
                    <input type="text" name="task" v-model="task">
                </div>
                <div class="task-time">
                    <div class="field">
                        <label for="task">Begin:</label>
                        <div class="time">
                            <div class="hours">
                                <input @input="setTaskTime('begin', 'hours')" type="number" name="hours" min="00" max="23" value="00">
                            </div>
                            <div class="minutes">
                                <input @input="setTaskTime('begin', 'minutes')" type="number" name="minutes" min="00" max="59" value="00">
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label for="task">End:</label>
                        <div class="time">
                            <div class="hours">
                                <input @input="setTaskTime('end', 'hours')" type="number" name="hours" min="00" max="23" value="00" v-model="end.hours">
                            </div>
                            <div class="minutes">
                                <input @input="setTaskTime('end', 'minutes')" type="number" name="minutes" min="00" max="59" value="00" v-model="end.minutes">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field days">
                    <label>Days:</label>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="monday">
                        <label for="monday">Mon</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="tuesday">
                        <label for="tuesday">Tue</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="wednesday">
                        <label for="wednesday">Wed</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="thursday">
                        <label for="thursday">Thu</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="friday">
                        <label for="friday">Fri</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="saturday">
                        <label for="saturday">Sat</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="sunday">
                        <label for="sunday">Sun</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="field">
            <div class="feedback" v-if="feedback.length>0">
                <p  
                    v-for="(feed, index) in feedback"
                    :key="index"
                >{{feed}}</p>
            </div>
            <button type="button" @click="toggle">Cancel</button>
            <button>Submit</button>
        </div>
    </form>
</div>            
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
import {checkOverlap} from '@/components/helpers/overlap'
import {addDayToMsg} from '@/components/helpers/overlap'
import ColorLabels from '@/components/Planner/ColorLabels'
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'AddTask',
    components:{
        ColorLabels
    },
    data(){
        return{
            days:[],
            task: null,
            begin: {
                hours: '00',
                minutes: '00'
            },
            end: {
                hours: '00',
                minutes: '00'
            },
            feedback: [],
            feedbackMsg: null,
            user: null,
            dailyTasks: [],
            color: null
        }
    },
    methods:{
        submit(){
            if(
                this.days.length !== 0 &&
                this.task              &&
                this.begin.hours       &&
                this.begin.minutes     &&
                this.end.hours         &&
                this.end.minutes       &&
                this.color
            ){
                const taskObj = {
                    task: this.task,
                    begin: `${this.begin.hours.substring(0,2)}:${this.begin.minutes.substring(0,2)}`, 
                    end: `${this.end.hours.substring(0,2)}:${this.end.minutes.substring(0,2)}`,
                    days: this.days,
                    color: this.color
                }

                const overlapCheck = checkOverlap(this.dailyTasks, taskObj)
               
                if(overlapCheck.findOverlap.length > 0){
                    const overlapArray = overlapCheck.findOverlap
                    const feedbackMsg = overlapCheck.feedbackMsg
                    this.feedback = []
                    this.feedback = addDayToMsg(overlapArray, feedbackMsg, taskObj)
                }else{
                    this.feedback = []
                    this.dailyTasks.push(taskObj)
                    db
                        .collection('planner')
                        .doc(this.user.uid)
                        .update({
                            dailyTasks: this.dailyTasks
                        })
                        .then(()=>{
                            this.$router.push({name:'Home'})
                        })
                        .catch(()=>{
                            db
                                .collection('planner')
                                .doc(this.user.uid)
                                .set({
                                    dailyTasks: this.dailyTasks
                                })
                                .then(()=>{
                                    this.$emit('toggle')
                                })
                        })
                }
            }else{
                const taskObj = {
                    task: this.task,
                    begin: `${this.begin.hours.substring(0,2)}:${this.begin.minutes.substring(0,2)}`, 
                    end: `${this.end.hours.substring(0,2)}:${this.end.minutes.substring(0,2)}`,
                    days: this.days,
                    color: this.color
                }
                console.log(taskObj)
                this.feedback = []
                this.feedback.push( 'You have to fill in all the fields')
            }
        },
        checkboxValues(){
            this.days =[]
            this.$el.querySelector('form#AddTask').day.forEach(input=>{
                if(input.checked){
                    this.days.push(input.id)
                }
            })
            console.log(this.days)
        },
        setTaskTime(state, time){
            console.log(event)
            this[state][time] = addZero(event.target.value)
        },
        addColorLabel(label){
            this.$el.querySelector('#AddTask').style.setProperty('--chosen-color', label.color)
            this.color = label
        },
        toggle(){
            this.$emit('toggle')
        }
    },
    created(){
        this.user = firebase.auth().currentUser 
        db
            .collection('planner')
            .doc(this.user.uid)
            .get()
            .then(doc=>{
                if(doc.exists){
                    const data = doc.data()
                    if(data.dailyTasks){
                        this.dailyTasks = data.dailyTasks 
                    }
                }
            })
    }
}
</script>

<style>
.add-task-bg{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,.5);
    z-index: 15;
    display: flex;
    justify-content: center;
    align-items: center;
}
#AddTask{
    --chosen-color: black;
    width: 650px;
    background: white;
    color: black;
}
#AddTask > h2{
    text-align: left;
    padding: 10px;
    background: var(--chosen-color);
    color: white;
}
#AddTask .color-labels-container{
    width: 40%;
    padding: 10px;
}
#AddTask .color-labels-container #Color-Label{
    position: relative;
    width: 100%;
    top: 0;
    left: 0;
    transform: translate(0,0);
}
#AddTask #Color-Label h2,
#AddTask .general h2{
    text-align: center;
    margin: 10px;
    width: 100%;
    font-weight: 500;
    font-size: 1.2em;
}
#AddTask #Color-Label .label-container{
    flex-direction: row;
    flex-wrap: wrap;
}
#AddTask #Color-Label .form-container{
    width: 140px;
    margin: 10px auto;
}
#AddTask .info{
    display: flex;
    width: 100%;
    justify-content: space-between;
}
#AddTask .general{
    width: 55%;
    padding: 10px;
}
#AddTask .field{
    margin: 10px 0;
}
#AddTask .task-time{
    display: flex;
}
#AddTask .task-time .field{
    width: 50%;
}
#AddTask .task-time .field label{
    margin: auto;
    display: block;
    text-align: center;
    margin-bottom: 5px;
}
#AddTask .general input[type='text']{
    border: none;
    width: 80%;
    border-bottom: solid 1px rgba(0,0,0,.2);
    padding: 5px;
}
#AddTask input[type='checkbox']{
    display: none;
}
#AddTask .field.days{
    display: flex;
    flex-wrap: wrap;
}
#AddTask .field.days >label{
    width: 100%;
}
#AddTask .day label{
    border: solid 1px var(--chosen-color);
    padding: 3px 10px;
    display: inline-block;
    border-radius: 3px;
    margin: 5px;
    transition: .5s;
}
#AddTask .day input[type='checkbox']:checked+label{
    color: white;
    background: var(--chosen-color);
}
#AddTask .time{
    display: flex;
    justify-content: center;
}
#AddTask input[type='number']{
    font-size: 1.5em;
    width: 50px;
}
#AddTask .hours,
#AddTask .minutes{
    position: relative;
    margin-top: 15px; 
}
#AddTask .hours::before{
    content: 'H';
    position: absolute;
    top: -18px;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
}
#AddTask .minutes::before{
    content: 'M';
    position: absolute;
    top: -18px;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
}

#AddTask > .field{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
}
#AddTask > .field button{
    padding: 8px 15px;
    border-radius: 20px;
    border: solid 1px var(--chosen-color);
    margin: 10px;
    background: white;
    cursor: pointer;
    transition: .25s;
}
#AddTask > .field button:hover{
    background: var(--chosen-color);
    color: white;
}
</style>