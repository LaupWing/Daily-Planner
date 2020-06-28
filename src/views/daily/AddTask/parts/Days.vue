<template>
    <div class="days-addTask">
        <div 
            class="days"
        >
            <div 
                class="field"
                v-for="(day,index) in daysName"
                :key="index"
            >
                <!-- <input 
                    type="checkbox" 
                    name="days" 
                    :id="day"
                    @input="toggleDay"
                > -->
                <!-- <label :for="day">{{day}}</label> -->
                <p class="day">{{day}}</p>
                <button 
                    type="button"
                    v-if="!days.find(x=>x.day===day)" 
                    @click="activateTime(day)"
                >
                    Set Time
                </button>
                <p 
                    class="time-span" 
                    v-else  
                    @click="activateTime(day)"
                >
                    {{setTimePeroid(day)}}
                </p>
            </div>      
        </div>
        <!-- <set-time-task
            v-if="setTime"
            :dayToEdit="setTime.dayToEdit"
            :pos="setTime.pos"
            :elClicked="setTime.elClicked"
            v-on:cancel="setTime = false"
            v-on:accept="userSelectedTime"
            v-on:remove="removeDay"
        /> -->
        <app-popup
            v-if="popupSettings"
            :settings="popupSettings"
            :componentId="'SetTimeTask'"
            v-on:accept="userSelectedTime"
            v-on:remove="removeDay"
            v-on:turnOffPopup="popupSettings = false"
        />
        <!-- <div class="set-time">
            <TimePopup
                :period="period"
                :days="days"
                :display="display"
                :timeToEdit="timeToEdit"
                v-on:toggleTime="activateTime"
                v-if="setTime"
                v-on:userSelectedTime="userSelectedTime"
            />
        </div> -->
    </div>
</template>

<script>
import TimePopup from './Days/TimePopup'
import Popup from '@/components/Popups/Popups'

export default {
    name: 'Days',
    props:['days'],
    components:{
        TimePopup,
        'app-popup':Popup
    },
    data(){
        return{
            popupSettings: false,
            display: null,
            timeToEdit:null,
            daysName:['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            daysFullName:['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }
    },
    methods:{
        removeDay(day){
            const removeDayFromArray = this.days.filter(x=>x.day !== this.daysName[this.daysFullName.indexOf(day.day)])
            console.log(removeDayFromArray)
            this.$emit('removedDay', removeDayFromArray)
            this.popupSettings = false
        },
        activateTime(day){
            const exists = this.days.find(d=>d.day===day)

            this.popupSettings = {
                pos: { 
                    top: event.target.getBoundingClientRect().top,
                    left: event.target.getBoundingClientRect().left
                },
                dayToEdit: {
                    day:this.daysFullName[this.daysName.indexOf(day)],
                    begin: exists ? exists.begin : '00:00',
                    end: exists ? exists.end : '00:00'
                },
                elClicked: event.target
            }
        },
        userSelectedTime(time){
            this.popupSettings = false
            this.$emit('updateDaysAndTime', {
                ...time,
                day: this.daysName[this.daysFullName.indexOf(time.day)]
            })
        },
        setTimePeroid(day){
            const findDay = this.days.find(d=>d.day===day)
            if(findDay){
                return `${findDay.begin} - ${findDay.end}`
            }
            return false
        },
        toggleDay(){
            if(event.target.checked){
            }else{
                const findDay = this.days.find(day=>day.day === event.target.id)
                if(findDay){
                    const updatedDays = this.days.filter(day=>{
                        if(JSON.stringify(day)!==JSON.stringify(findDay)){
                            return day
                        }
                    })
                    this.$emit('updateDaysAndTime', updatedDays)
                }
            }
        }
    }
}
</script>

<style scoped>
#AddTask .days-addTask{
    animation: heightAnim 2s forwards;
    max-height: 0;
}
@keyframes heightAnim{
    from{
        max-height: 0;
    }
    to{
        max-height: 10000px;
    }
}
#AddTask .days-addTask,
#AddTask .days-addTask .days,
#AddTask .days .field{
    width: 100%;
}
#AddTask .days-addTask .days .field{
    width: 60%;
    margin: 5px auto;
}
#AddTask .days-addTask .days{
    display: flex;
}

#AddTask .days .field p{
    margin: 5px 0;
}
#AddTask .days .field p.day{
    width: 100%;
    text-align: left;
}

#AddTask .days .field label{
    width: 20%;
}
#AddTask .days .field p.time-span{
    border-bottom: solid 1px rgba(0,0,0,.2);
    cursor: pointer;
    white-space: nowrap;
    transition: .5s;
}
#AddTask .days .field p.time-span:hover{
    background: rgba(0,0,0,.2);
}
#AddTask .days.checkbox .field p.time-span{
    opacity: .2;
}
#AddTask .days-addTask .days{
    flex-direction: column;
}
#AddTask .days-addTask .days.selected p.day{
    width: 20%;
}
#AddTask .days-addTask .days label{
    font-size: .4em;
    width: 25px;
    height: 25px;
    line-height: 25px;
    letter-spacing: 1px;
}
#AddTask .days-addTask .field{
    display: flex;
    align-items: center;
    width: 50%;
    margin: 5px 0;
    justify-content: space-between;
}
.days-addTask .field p{
    font-size: .8em;
    text-align: center;
    margin: auto;
    
}
#AddTask .days-addTask .field  button{
    display: flex;
    font-size: .6em;
    white-space: nowrap;
    background: transparent;
    border-radius: 5px;
    border: solid 1px black;
    text-transform: uppercase;
    font-size: .6em;
    letter-spacing: 1px;
    padding: 3px 5px;
    opacity: .7;
}
#AddTask .days-addTask .set-time{
    display: flex;
    align-items: center;
}
#AddTask .set-time p{
    font-size: .7em;
}

#AddTask .days input[type="checkbox"]:checked + label{
    background: var(--chosen-color);
    color: white;
    opacity: 1;
}
#AddTask .days input[type="checkbox"]:checked ~ p.time-span{
    opacity: 1;
}
</style>