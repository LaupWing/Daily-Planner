<template>
    <form @submit.prevent="submit" id="AddTask"> 
        <h2>AddTask</h2>
        <div class="info">
            <div class="color-labels-container">
                <ColorLabels/>
            </div>
            <div class="general">
                <div class="field">
                    <label for="task">Task:</label>
                    <input type="text" name="task" v-model="task">
                </div>
                <div class="field">
                    <label for="task">Begin:</label>
                    <div class="hours">
                        <label for="hours">Hours</label>
                        <input @input="setTaskTime('begin', 'hours')" type="number" name="hours" min="00" max="23" value="00">
                    </div>
                    <div class="minutes">
                        <label for="minutes">Minutes</label>
                        <input @input="setTaskTime('begin', 'minutes')" type="number" name="minutes" min="00" max="59" value="00">
                    </div>
                </div>
                <div class="field">
                    <label for="task">End:</label>
                    <div class="hours">
                        <label for="hours">Hours</label>
                        <input @input="setTaskTime('end', 'hours')" type="number" name="hours" min="00" max="23" value="00">
                    </div>
                    <div class="minutes">
                        <label for="minutes">Minutes</label>
                        <input @input="setTaskTime('end', 'minutes')" type="number" name="minutes" min="00" max="59" value="00">
                    </div>
                </div>
                <div class="field">
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="monday">
                        <label for="monday">Monday</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="tuesday">
                        <label for="tuesday">Tuesday</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="wednesday">
                        <label for="wednesday">Wednesday</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="thursday">
                        <label for="thursday">Thursday</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="friday">
                        <label for="friday">Friday</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="saturday">
                        <label for="saturday">Saturday</label>
                    </div>
                    <div class="day">
                        <input type="checkbox" @input="checkboxValues" name="day" id="sunday">
                        <label for="sunday">Sunday</label>
                    </div>
                </div>
                <div class="field">
                    <div class="feedback" v-if="feedback.length>0">
                        <p  
                            v-for="(feed, index) in feedback"
                            :key="index"
                        >{{feed}}</p>
                    </div>
                    <button>Submit</button>
                </div>
            </div>
        </div>
    </form>
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
                hours: null,
                minutes: null
            },
            end: {
                hours: null,
                minutes: null
            },
            feedback: [],
            feedbackMsg: null,
            user: null,
            dailyTasks: []
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
                this.end.minutes       
            ){
                const taskObj = {
                    task: this.task,
                    begin: `${this.begin.hours.substring(0,2)}:${this.begin.minutes.substring(0,2)}`, 
                    end: `${this.end.hours.substring(0,2)}:${this.end.minutes.substring(0,2)}`,
                    days: this.days
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
                        .catch(err=>{
                            db
                                .collection('planner')
                                .doc(this.user.uid)
                                .set({
                                    dailyTasks: this.dailyTasks
                                })
                                .then(()=>{
                                    this.$router.push({name:'Home'})
                                })
                        })
                }
            }else{
                this.feedback = 'You have to fill in all the fields'
            }
        },
        checkboxValues(){
            this.days =[]
            this.$el.day.forEach(input=>{
                if(input.checked){
                    this.days.push(input.id)
                }
            })
        },
        setTaskTime(state, time){
            this[state][time] = addZero(event.target.value)
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
                    this.dailyTasks = data.dailyTasks 
                }
            })
    }
}
</script>

<style>
#AddTask{
    width: 500px;
}
#AddTask > h2{
    text-align: center;
    margin: 10px;
}
#AddTask .color-labels-container{
    width: 50%;
}
#AddTask .color-labels-container #Color-Label{
    position: relative;
    width: 100%;
    top: 0;
    left: 0;
}
#AddTask #Color-Label h2{
    text-align: center;
    margin: 10px;
    width: 100%;
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
</style>