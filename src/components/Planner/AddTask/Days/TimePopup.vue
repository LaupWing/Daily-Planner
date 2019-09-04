<template>
    <div class="time-popup-bg" @click="closePopup">
        <div class="time-popup">
            <div class="days-choice">
                <div class="field">
                    <input type="checkbox" name="day" id="all-choice" @input="userDaySelection">
                    <label for="all-choice">all</label>
                </div>
                <div class="field">
                    <input type="checkbox" name="day" id="mon-choice" @input="userDaySelection">
                    <label for="mon-choice">mon</label>
                </div>
                <div class="field">
                    <input type="checkbox" name="day" id="tue-choice" @input="userDaySelection">
                    <label for="tue-choice">tue</label>
                </div>
                <div class="field">
                    <input type="checkbox" name="day" id="wed-choice" @input="userDaySelection">
                    <label for="wed-choice">wed</label>
                </div>
                <div class="field">
                    <input type="checkbox" name="day" id="thu-choice" @input="userDaySelection">
                    <label for="thu-choice">thu</label>
                </div>
                <div class="field">
                    <input type="checkbox" name="day" id="fri-choice" @input="userDaySelection">
                    <label for="fri-choice">fri</label>
                </div>
                <div class="field">
                    <input type="checkbox" name="day" id="sat-choice" @input="userDaySelection">
                    <label for="sat-choice">sat</label>
                </div>
                <div class="field">
                    <input type="checkbox" name="day" id="sun-choice" @input="userDaySelection">
                    <label for="sun-choice">sun</label>
                </div>
            </div>
            <div class="time">
                <div class="begin">
                    <p for="task">Begin: </p>
                    <input type="number" name="hours" min="00" max="23" value="00" v-model="begin.hours">
                    <input type="number" name="minutes" min="00" max="59" value="00" v-model="begin.minutes">
                </div>
                <div class="end">
                    <p for="task">End: </p>
                    <input type="number" name="hours" min="00" max="23" value="00" v-model="end.hours">
                    <input type="number" name="minutes" min="00" max="59" value="00" v-model="end.minutes">
                </div>
            </div>
            <button @click="addDaysAndTime">Add Time</button>
        </div>
    </div>  
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
export default {
    name:'TimePopup',
    props:['period'],
    data(){
        return{
            days: [],
            begin:{
                hours: '00',
                minutes: '00'
            },
            end:{
                hours: '00',
                minutes: '00'
            },
        }
    },
    methods:{
        closePopup(){
            if(event.target.classList.length >0){
                if(event.target.classList[0].includes('bg')){
                    console.log(this.days)
                }
            }
        },
        userDaySelection(){
            const choice = event.target.id.split('-choice')[0].trim()
            const checkboxes = this.$el.querySelectorAll('input[type="checkbox"]')
            if(choice === 'all' && event.target.checked){
                this.days = []
                checkboxes.forEach(cb=>{
                    cb.checked=true
                    this.days.push(cb.id.split('-choice')[0].trim())
                })
            }
            else if(choice === 'all' && !event.target.checked){
                this.days = []
                checkboxes.forEach(cb=>cb.checked=false)
            }
            else{
                if(event.target.checked){
                    this.days.push(choice)
                }else{
                    this.days = this.days.filter(day=>day!==choice)
                }
            }
        },
        addDaysAndTime(){
            const userinput = this.days
                .filter(day=>day!=='all')
                .map(day=>{
                    return{
                        day: day,
                        begin: `${addZero(this.begin.hours)}:${addZero(this.begin.minutes)}`,
                        end: `${addZero(this.end.hours)}:${addZero(this.end.minutes)}`
                    }
                })
            if(userinput.length >0){
                this.$emit('userSelectedTime', userinput)
            }else{
                
            }
        }
    }
}
</script>

<style>
.time-popup-bg{
    width: 100vw;
    height: 100vw;
    background: rgba(0,0,0,.4);
    position: fixed;
    left: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    z-index: 1000;
}
.time-popup{
    background: white;
    /* padding: 10px; */
    border-radius:  4px;
    overflow: hidden;
}
.time-popup .days-choice{
    display: flex;
    margin: 10px;
}
#AddTask .time-popup .field label{
    width: 30px;
    height: 30px;
    font-size: .5em;
    line-height: 30px;
    margin: 5px;
}
#AddTask .time-popup input[type="checkbox"]:checked + label{
    background: black;
    color: white;
    opacity: 1;
}
.time-popup .time > div{
    margin: 10px;
    margin-bottom: 20px;
}
.time-popup .time > div p{
    width: 100%;
    text-align: center;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.time-popup input[type='number']{
    font-size: 1em;
    width: 40px;
}
#AddTask .time-popup-bg .time-popup button{
    width: 100%;
    padding: 5px;
    border-radius: 0 0 5px 5px;
    cursor: pointer;
    margin: 0;
}
#AddTask .time-popup button:hover{
    opacity: 1;
}
</style>