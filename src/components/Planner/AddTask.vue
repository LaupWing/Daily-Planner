<template>
<div class="add-task-bg">
    <form @submit.prevent="submit" id="AddTask"> 
        <h2 v-if="!task">Add Task</h2>
        <h2 v-else>{{task}}</h2>
        <main>
            <div class="info">
                <input type="text" name="task" v-model="task" placeholder="Name your task" autocomplete="off">
                <div class="field notes">
                    <label for="notes">Notes</label>
                    <textarea name="notes" cols="30" rows="10" placeholder="Insert your notes here. This is not a must!"></textarea>
                </div>
                <button class="set-color" @click="setColor" v-if="!color">Set Colorlabel</button>
                <button class="set-color" @click="setColor" :style="buttonStyling" v-else>{{color.label}}</button>
            </div>
            <div class="extra-info">
                <div class="field period-choice">
                    <input type="radio" name="period" id="daily" @input="setPeriod">
                    <label for="daily">Daily</label>
                    <input type="radio" name="period" id="weekly" @input="setPeriod">
                    <label for="weekly">Weekly</label>
                    <input type="radio" name="period" id="once" @input="setPeriod">
                    <label for="once">Once</label>
                </div>
                <div class="time" v-if="period">
                    <Days
                        :period="period"
                        :days="days"
                        v-on:updateDaysAndTime="updateDaysAndTime"
                    />
                </div>
                
            </div>
            <div class="color-labels-bg" v-if="colorPopup" @click="closePopupByBG">
                <ColorLabels
                    :addTask="true"
                    :chosenColorLabel="color"
                    v-on:chosenColor="addColorLabel"
                    v-on:closePopup="setColor"
                />
            </div>
        </main>
        <!-- <div class="field">
            <div class="feedback" v-if="feedback.length>0">
                <p  
                    v-for="(feed, index) in feedback"
                    :key="index"
                >{{feed}} <i @click="deleteFeedback(index)" class="fas fa-times"></i></p>
            </div>
            <div class="buttons">
                <button type="button" @click="toggle">Cancel</button>
                <button>Submit</button>
            </div>
        </div> -->
        <button :class="submitButtonStyling" type="submit">Submit</button>
    </form>
</div>            
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
import {checkOverlap} from '@/components/helpers/overlap'
import {addDayToMsg} from '@/components/helpers/overlap'
import ColorLabels from '@/components/Planner/ColorLabels'
import Days from '@/components/Planner/AddTask/Days'


import firebase from 'firebase'
import db from '@/firebase/init'
export default {
    name: 'AddTask',
    components:{
        ColorLabels,
        Days
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
            color: null,
            notes: null,
            state: 1,
            period: null,
            colorPopup: false
        }
    },
    methods:{
        updateDaysAndTime(days){
            this.days = days
        },
        nextInput(state){
            this.state = state
        },
        setPeriod(){
            this.period = event.target.id
        },
        submit(){
            if(this.days.length !== 0 && this.task && this.color){
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
                this.feedback = []
                this.feedback.push( 'You have to fill in all the fields')
            }
        },
        settingData(obj){
            this[obj.type] = obj.value
        },
        checkboxValues(){
            this.days =[]
            this.$el.querySelector('form#AddTask').day.forEach(input=>{
                if(input.checked){
                    this.days.push(input.id)
                }
            })
        },
        setTaskTime(state, time){
            this[state][time] = addZero(event.target.value)
        },
        addColorLabel(label){
            this.setColor()
            this.$el.querySelector('#AddTask').style.setProperty('--chosen-color', label.color)
            this.color = label
        },
        setColor(){
            this.colorPopup = !this.colorPopup
        },
        closePopupByBG(){   
            if(event.target.classList.length > 0){
                if(event.target.classList[0].includes('bg')){
                    this.setColor()
                }
            }
        },
        toggle(){
            this.$emit('toggle')
        },
        deleteFeedback(index){
            this.feedback = this.feedback.filter((feed, i)=>i!==index)
        },
    },
    computed:{
        buttonStyling(){
            return{
                borderColor: this.color.color,
                color: this.color.color
            }
        },
        submitButtonStyling(){
            if(this.days && this.color &&  this.task){
                return 'active'
            }
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
    border-radius: 5px;
    overflow: hidden;
    --chosen-color: black;
    width: 600px;
    background: white;
    color: black;
}
#AddTask > h2{
    text-align: left;
    padding: 10px;
    background: var(--chosen-color);
    color: white;
}
#AddTask button[type="submit"]{
    width: 100%;
    margin: 0;
    border: none;
    padding: 10px;
    background: rgba(0,0,0,.05);
    color: rgba(0,0,0,.3);
}
#AddTask button[type="submit"].active{
    border: var(--chosen-color) 1.2px solid;
    color: var(--chosen-color);
    background: white;
    cursor: pointer;
    transition: .25s;
}
#AddTask button[type="submit"].active:hover{
    color: white;
    background: var(--chosen-color);
}
#AddTask button.set-color{
    background: transparent;
    border-radius: 5px;
    border: solid 1px black;
    padding: 5px 10px;
    text-transform: uppercase;
    font-size: .6em;
    letter-spacing: 1px;
    margin: auto;
    opacity: .7;
}
#AddTask main{
    width: 100%;
    display: flex;
}
#AddTask .info,
#AddTask .extra-info{
    display: flex;
    width: 50%;
    justify-content: flex-start;
    flex-direction: column;
    padding: 20px;
    align-items: center;
}
#AddTask .info{
    border-right: solid 1px rgba(0,0,0,.2);
    /* background: orange; */
}
#AddTask .info h3{
    margin-bottom: 5px;
}
#AddTask .info input[type='text'],
#AddTask .info textarea{
    border-radius: 3px;
    padding: 5px;
    font-family: Arial, Helvetica, sans-serif
}
#AddTask .info input[type='text']{
    border: none;
    width: 100%;
    font-size: 1.5em;
    font-weight: bold;
    transition: .25s;
    opacity: .5;
}
#AddTask .info input[type='text']:focus,
#AddTask .info input[type='text']:hover,
#AddTask .info textarea:focus,
#AddTask .info textarea:hover{
    background: rgba(0,0,0,.075);
}
#AddTask .info input[type='text']::placeholder{
    font-weight: bold;
    opacity: .5;
}

#AddTask .info .field.notes{
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    width: 100%;
}

#AddTask .extra-info input[type="radio"]{
    display: none;
}
#AddTask .extra-info input[type="radio"]:checked + label{
    opacity: 1;
}
#AddTask .extra-info label{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: solid 1px black;
    display: inline-block;
    font-size: .5em;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-align: center;
    line-height: 50px;
    vertical-align: middle;
    opacity: .3;
    cursor: pointer;
    transition: .25s;
}
#AddTask .extra-info label:hover{
    opacity: 1;
}
#AddTask .extra-info .field.period-choice{
    display: flex;
    width: 80%;
    margin: 0 auto;
    justify-content: space-around;
}
#AddTask .extra-info .time{
    margin-top: 10px;
    width: 100%;
}
#AddTask .extra-info button{
    border: solid 1px black;
    padding: 3px 7px;
    background: transparent;
    border-radius: 5px;
    opacity: .4;
    text-transform: uppercase;
    letter-spacing: 2px;
}

/* Color Labels Styling */
#AddTask .color-labels-bg{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.4);
}

#AddTask .color-labels-bg #Color-Label{
    transform: translate(0,0);
    position: relative;
    top: auto;
    left: auto;
    background: white;
    width: 400px;
    height: 350px;
}

#AddTask #Color-Label h2{
    padding: 5px 10px;
    background: var(--chosen-color);
    color: white;
    width: 100%;
    text-align: left;
}

#AddTask #Color-Label .label-container{
    flex-direction: row;
    flex-wrap: wrap;
    padding: 5px;
}

#AddTask #Color-Label p.label{
    margin: 10px;
}
#AddTask #Color-Label i{
    color: black;
}

#AddTask #Color-Label .form-container{
    position: absolute;
    background: rgba(0,0,0,.4);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
#AddTask #Color-Label .form-container form{
    background: white
}
#AddTask #Color-Label input[type="text"]{
    border-color: rgba(0,0,0,.2);
    margin: 5px 20px;
    width: 200px;
    color: black;
}
#AddTask #Color-Label button{
    border-color: black;
    border-radius: 0;
    color: black;
}



#AddTask .field.notes label{
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 5px;
    font-size: .8em;
}
#AddTask .field.notes textarea{
    resize: none;
    border: none;
    opacity: .7;
}
#AddTask .field.notes textarea::placeholder{
    opacity: .5;
}
#AddTask .info > div{
    margin: 2px 0;
    display: flex;
}
#AddTask .info .input{
    margin-left: 10px;
    color: rgba(0,0,0,.5);
    max-width: 80%;
    word-break:break-all;
}
#AddTask .user-input{
    padding: 10px;
    width: 50%;
}
#AddTask .field{
    /* margin: 10px 0; */
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


#AddTask > .field .feedback{
    text-align: center;
    max-height: 200px;
    overflow-y: scroll;
    display: inline-block;
    width: auto;
    margin: 0 20px;
    margin-bottom: 10px;
    position: relative;
    left: 0;
}
#AddTask > .field .feedback p{
    text-align: center;
    border: solid 2px red;
    display: inline-flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 5px;
    margin-bottom: 10px;
}
#AddTask > .field .feedback p i{
    color: red;
    font-size: 1.5em;
    margin-left: 10px;
    cursor: pointer;
}
#AddTask > .field button:hover{
    background: var(--chosen-color);
    color: white;
}
</style>