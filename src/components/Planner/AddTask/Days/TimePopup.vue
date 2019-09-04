<template>
    <div class="time-popup-bg" @click="closePopup">
        <div class="time-popup">
            <div class="days-choice" :class="{'single':display!=='all'}">
                <div class="field" v-if="display==='all'">
                    <input type="checkbox" name="day" id="all-choice" @input="userDaySelection">
                    <label for="all-choice">all</label>
                </div>
                <div class="field" v-if="display==='all' || display==='mon'">
                    <input type="checkbox" name="day" id="mon-choice" @input="userDaySelection">
                    <label for="mon-choice">mon</label>
                </div>
                <div class="field" v-if="display==='all' || display==='tue'">
                    <input type="checkbox" name="day" id="tue-choice" @input="userDaySelection">
                    <label for="tue-choice">tue</label>
                </div>
                <div class="field" v-if="display==='all' || display==='wed'">
                    <input type="checkbox" name="day" id="wed-choice" @input="userDaySelection">
                    <label for="wed-choice">wed</label>
                </div>
                <div class="field" v-if="display==='all' || display==='thu'">
                    <input type="checkbox" name="day" id="thu-choice" @input="userDaySelection">
                    <label for="thu-choice">thu</label>
                </div>
                <div class="field" v-if="display==='all' || display==='fri'">
                    <input type="checkbox" name="day" id="fri-choice" @input="userDaySelection">
                    <label for="fri-choice">fri</label>
                </div>
                <div class="field" v-if="display==='all' || display==='sat'">
                    <input type="checkbox" name="day" id="sat-choice" @input="userDaySelection">
                    <label for="sat-choice">sat</label>
                </div>
                <div class="field" v-if="display==='all' || display==='sun'">
                    <input type="checkbox" name="day" id="sun-choice" @input="userDaySelection" >
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
            <button @click="addDaysAndTime" v-if="display ==='all'">Add Time</button>
            <button @click="changeTime" v-else>Change Time</button>
        </div>
    </div>  
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
export default {
    name:'TimePopup',
    props:['period', 'days', 'display', 'timeToEdit'],
    data(){
        return{
            daysArray: [],
            begin:{
                hours: '00',
                minutes: '00'
            },
            end:{
                hours: '00',
                minutes: '00'
            },
            allDays:null
        }
    },
    methods:{
        closePopup(){
            if(event.target.classList.length >0){
                if(event.target.classList[0].includes('bg')){
                    this.$emit('toggleTime')
                }
            }
        },
        userDaySelection(){
            const choice = event.target.id.split('-choice')[0].trim()
            const checkboxes = Array.from(this.$el.querySelectorAll('input[type="checkbox"]'))
            if(choice === 'all' && event.target.checked){
                this.daysArray = []
                const checkAllDisabled = checkboxes
                    .filter(cb=>cb.id!=='all-choice')
                    .every(cb=>{return cb.disabled})
                if(checkAllDisabled){
                    event.target.checked = false
                }
                checkboxes.forEach(cb=>{
                    if(cb.disabled)  return
                    cb.checked=true
                    this.daysArray.push(cb.id.split('-choice')[0].trim())
                })
            }
            else if(choice === 'all' && !event.target.checked){
                this.daysArray = []
                checkboxes.forEach(cb=>cb.checked=false)
            }
            else{
                if(event.target.checked){
                    this.daysArray.push(choice)
                }else{
                    this.daysArray = this.daysArray.filter(day=>day!==choice)
                }
            }
        },
        changeTime(){
            const updatedArray = this.days.map(day=>{
                if(day.day === this.display){
                    day.begin = `${addZero(this.begin.hours)}:${addZero(this.begin.minutes)}`
                    day.end = `${addZero(this.end.hours)}:${addZero(this.end.minutes)}`
                    return day
                }
                return day
            })
            this.$emit('userSelectedTime', updatedArray)
        },
        addDaysAndTime(){
            const userinput = this.daysArray
                .filter(day=>day!=='all')
                .map(day=>{
                    return{
                        day: day,
                        begin: `${addZero(this.begin.hours)}:${addZero(this.begin.minutes)}`,
                        end: `${addZero(this.end.hours)}:${addZero(this.end.minutes)}`
                    }
                })
            for(let uInput of userinput){
                this.allDays.push(uInput)
            }
            if(userinput.length >0){
                this.$emit('userSelectedTime', this.allDays)
            }else{
                const disabledCheck = Array
                    .from(this.$el.querySelectorAll('input[type="checkbox"]'))
                    .filter(input=>input.id!=='all-choice')
                    .every(input=>input.disabled = true)
                if(disabledCheck){
                    this.$emit('toggleTime')
                }
            }
        }
    },
    created(){
        this.allDays = this.days
        if(this.timeToEdit){
            this.begin.hours = this.timeToEdit.begin.split(':')[0]
            this.begin.minutes = this.timeToEdit.begin.split(':')[1]
            this.end.hours = this.timeToEdit.end.split(':')[0]
            this.end.minutes = this.timeToEdit.end.split(':')[1]
        }
    },
    mounted(){
        const setCheckbox = (input, state)=>{
            this.$el.querySelectorAll('input[type="checkbox"]').forEach(input2=>{
                const day = input2.id.split('-choice')[0].trim()
                if(input.id === day){
                    // console.log(input2, state)
                    input2.disabled = state
                }
            })
        }
        if(this.period === "weekly"){
            document.querySelectorAll('.days.checkbox input[type="checkbox"]').forEach(input=>{
                if(!input.checked){
                    setCheckbox(input, true)
                }else{
                    setCheckbox(input, false)
                }
            })
        }
        this.$el.querySelectorAll('input[type="checkbox"]').forEach(input=>{
            const day = input.id.split('-choice')[0].trim()
            const findDay = this.days.find(d=>d.day===day)
            if(findDay){
                input.disabled = true
            }
        })
    }
}
</script>

<style>
.time-popup-bg{
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.4);
    position: fixed;
    top: 0;
    bottom: 0;
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
#AddTask .time-popup .days-choice.single .field{
    width: 100%;
    justify-content: center;
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
#AddTask .time-popup input[type="checkbox"]:disabled + label{
    background: black;
    color: white;
    opacity: .2;
    cursor:auto;
}
#AddTask .time{
    display: flex;
    justify-content: center;
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