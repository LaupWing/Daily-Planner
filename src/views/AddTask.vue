<template>
    <form @submit.prevent="submit" id="AddTask"> 
        <h2>AddTask</h2>
        <div class="field">
            <label for="task">Task:</label>
            <input type="text" name="task" v-model="task">
        </div>
        <div class="field">
            <label for="task">Begin:</label>
            <div class="hours">
                <label for="hours">Hours</label>
                <input @input="setTaskTime('begin', 'hours')" type="number" name="hours" min="00" max="23">
            </div>
            <div class="minutes">
                <label for="minutes">Minutes</label>
                <input @input="setTaskTime('begin', 'minutes')" type="number" name="minutes" min="00" max="59">
            </div>
        </div>
        <div class="field">
            <label for="task">End:</label>
            <div class="hours">
                <label for="hours">Hours</label>
                <input @input="setTaskTime('end', 'hours')" type="number" name="hours" min="00" max="23">
            </div>
            <div class="minutes">
                <label for="minutes">Minutes</label>
                <input @input="setTaskTime('end', 'minutes')" type="number" name="minutes" min="00" max="59">
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
    </form>
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
import {converDateToMS} from '@/components/helpers/timeFormat'
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'AddTask',
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
                const findOverlap = this.dailyTasks.filter(task=>{
                    for(let dayInCurrentTask of task.days){
                        for(let dayInNewTask of taskObj.days){
                            if(dayInNewTask === dayInCurrentTask){
                                const beginCurrentTask = converDateToMS(task.begin)
                                const endCurrentTask = converDateToMS(task.end)
                                const beginNewTask = converDateToMS(taskObj.begin)
                                const endNewTask = converDateToMS(taskObj.end)
                                if(
                                    beginNewTask >= beginCurrentTask && 
                                    endNewTask <= endCurrentTask   
                                ){
                                    return task
                                }
                                else if(
                                    beginNewTask >= beginCurrentTask && 
                                    endNewTask >= endCurrentTask     &&
                                    beginNewTask < endCurrentTask   
                                ){
                                    return task
                                }
                                else if(
                                    beginNewTask <= beginCurrentTask &&
                                    endNewTask <= endCurrentTask     &&
                                    endNewTask > beginCurrentTask
                                ){
                                    return task
                                }
                                else if(
                                    beginNewTask < beginCurrentTask &&
                                    endNewTask > endCurrentTask     
                                ){
                                    return task
                                }
                            }
                        }
                    }
                })
                if(findOverlap.length > 0){
                    findOverlap.forEach(task=>{
                        const overlappingDays = task.days.filter(day=>{
                            const findDay = taskObj.days.find(dayInNewTask=>dayInNewTask===day)
                            return day
                        })
                        overlappingDays.forEach(day=>{
                            const msg = `Your new taks is to long therfore it is within the task ${task.task} in between ${task.begin} - ${task.end} on a ${day}`
                            this.feedback.push(msg)
                        })
                    })
                }
                // this.dailyTasks.push(taskObj)
                // db
                //     .collection('planner')
                //     .doc(this.user.uid)
                //     .update({
                //         dailyTasks: this.dailyTasks
                //     })
                //     .then(()=>{
                //         this.$router.push({name:'Home'})
                //     })
            }else{
                this.feedback = 'You have to fill in all the fields'
            }
        },
        checkboxValues(){
            this.days.push(event.target.id)
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
                const data = doc.data()
                this.dailyTasks = data.dailyTasks 
            })
    }
}
</script>