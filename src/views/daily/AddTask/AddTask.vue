<template>
<div class="add-task-bg">
    <form @submit.prevent="submit" id="AddTask"> 
        <h2>
            <input 
                type="text" 
                name="task" 
                v-model="task" 
                placeholder="Name your task" 
                autocomplete="off"
                class="add_task_name"
            >
        </h2>
        <main>
            <div class="info">
                <div class="field notes">
                    <label for="notes">Notes</label>
                    <textarea name="notes" cols="30" rows="10" placeholder="Insert your notes here. This is not a must!"></textarea>
                </div>
                <div class="field color-label">
                    <label>Color Label:</label>
                    <button 
                        type="button" 
                        class="set-color" 
                        @click="setColor" 
                        v-if="!color"
                    >
                        Set Colorlabel
                    </button>
                    <button 
                        type="button" 
                        class="set-color" 
                        @click="setColor" 
                        :style="buttonStyling" 
                        v-else
                    >
                        {{color.label}}
                    </button>
                </div>
            </div>
            <div class="extra-info">
                <Days
                    :days="days"
                    v-on:updateDaysAndTime="updateDaysAndTime"
                    v-on:removedDay="days = $event"
                />
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
        <div class="feedback-container" v-if="feedback.length>0">
            <div  
                v-for="(feed, index) in feedback"
                :key="index"
                class="feedback"
            >
                <div class="message" v-html="feed"></div>
                <i @click="deleteFeedback(index)" class="fas fa-times"></i>
            
            </div>
        </div>
        <div class="buttons">
            <button 
                @click="$emit('close')" 
                type="button"
            >
                Cancel
            </button>
            <button 
                :class="submitButtonStyling" 
                type="submit"
            >
                Submit
            </button>
        </div>
    </form>
</div>            
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
import {checkOverlap} from '@/components/helpers/overlap'
import ColorLabels from '@/views/Daily/ColorLabels/ColorLabels'
import Days from './parts/Days'
import { mapActions, mapGetters } from 'vuex'

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
            color: null,
            notes: null,
            state: 1,
            colorPopup: false,
            daysFullName:['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }
    },
    methods:{
        ...mapActions(['addNewTask']),
        updateDaysAndTime(day){
            this.days.find(d=>day.day === d.day) ? 
            this.days = this.days.map(x=>x.day === day.day ? day : x) :
            this.days.push(day)
        },
        nextInput(state){
            this.state = state
        },
        submit(){
            if(this.days.length !== 0 && this.task && this.color){
                const reformatDays = this.days.map(day=>{
                    const dayFormatted = this.daysFullName.find(fullDay=>fullDay.slice(0,3)===day.day)
                    return{
                        day: dayFormatted,
                        begin: day.begin,
                        end: day.end
                    }
                })
                const taskObj = {
                    task: this.task,
                    days: reformatDays,
                    color: this.color
                }
                const overlapCheck = checkOverlap(this.dailyTasks, taskObj)
                const dailyCheck = (callback)=>{
                    if(this.period === 'daily'){
                        if(this.days.length<6){
                            const msg = 'If you chose daily as your period you need to fill in every day'
                            this.feedback.push(msg)
                        }else{
                            if(callback){
                                callback()
                            }
                        }
                    }else{
                        callback()
                    }
                }
                if(overlapCheck.feedback.length > 0){
                    this.feedback = []
                    this.feedback = overlapCheck.feedback
                    dailyCheck()
                }else{
                    this.feedback = []
                    dailyCheck(()=>{this.updateDailyTasks(taskObj)})
                }
            }else{
                this.feedback = []
                this.feedback.push( 'You have to fill in all the fields')
            }
        },
        updateDailyTasks(taskObj){
            this.dailyTasks.push(taskObj)
            this.addNewTask(this.dailyTasks)
                .then(()=>{
                    this.toggle()
                })
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
        deleteFeedback(index){
            this.feedback = this.feedback.filter((feed, i)=>i!==index)
        },
    },
    computed:{
        buttonStyling(){
            return{
                borderColor: this.color.color,
                color: this.color.color,
                borderWidth: '2px',
                fontSize: '1em'
            }
        },
        submitButtonStyling(){
            if(this.days && this.color &&  this.task){
                return 'active'
            }
            return ''
        },
        ...mapGetters(['dailyTasks'])
    },
}
</script>

<style scoped>
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
    border-radius: 5px;
    overflow: hidden;
    width: 600px; 
    background: white;
    color: black;
    box-shadow: var(--popup-boxShadow);
}
#AddTask > h2{
    text-align: left;
    padding: 10px;
    border-bottom: solid 1px rgba(0,0,0,.2);
    color: var(--chosen-color);
}
#AddTask .buttons{
    display: flex;
}

#AddTask .buttons button{
    width: 50%;
    margin: 0;
    border: none;
    padding: 10px;
    background: white;
    color: black;
    border-right: solid 1px rgba(0,0,0,.2);
    border-top: solid 1px rgba(0,0,0,.2);
    cursor: pointer;
}
#AddTask .buttons button:hover{
    background: black;
    color: white;
}

#AddTask .buttons button[type="submit"]{
    width: 50%;
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
    margin: 10px auto;
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
    padding: 10px 15px;
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
#AddTask .add_task_name{
    border: none;
    width: 100%;
    font-size: 1em;
    font-weight: bold;
    transition: .25s;
    opacity: .5;
    padding: 10px;
}
#AddTask input[type='text']:focus,
#AddTask input[type='text']:hover,
#AddTask textarea:focus,
#AddTask textarea:hover{
    background: rgba(0,0,0,.075);
}
#AddTask .info input[type='text']::placeholder{
    font-weight: bold;
    opacity: .5;
}

#AddTask .info .field.notes,
#AddTask .field.color-label{
    display: flex;
    flex-direction: column;
    width: 100%;
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
    box-shadow: 0px 0px 17px 3px rgba(0,0,0,0.35);
    border-radius: 10px;
}

#AddTask #Color-Label h2{
    padding: 5px 10px;
    /* background: var(--chosen-color); */
    color: black;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 10px 0;
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
    border-radius: 0;
    color: black;
}
#AddTask #Color-Label > .buttons button:first-of-type{
    border-radius: 0 0 0 10px;
}
#AddTask #Color-Label > .buttons button:last-of-type{
    border-radius: 0 0 10px 0;
}
#AddTask #Color-Label button:hover{
    color: white;
}
#AddTask #Color-Label form{
    left: 50%;
}



#AddTask .field.notes label,
#AddTask .field.color-label label{
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


#AddTask .feedback-container{
    max-height: 100px;
    overflow: auto;
    border-top: solid 1px rgba(0,0,0,.2);
}

#AddTask .feedback-container .feedback{
    display: flex;
    font-size: 0.7em;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    background: red;
    border-radius: 5px;
    color: white;
    opacity: .3;
    transition: .25s;
    cursor: pointer;
    margin: 10px;
}
#AddTask .feedback-container .feedback:hover{
    opacity: 1;
}
#AddTask .feedback-container .feedback span{
    font-weight: bold;
    color: black;
}
</style>