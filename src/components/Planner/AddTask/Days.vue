<template>
    <div class="days-addTask">
        <div 
            class="days" 
            :class="{'checkbox': period ==='weekly','selected':days.length>0}"
        >
            <div 
                class="field"
                v-for="(day,index) in daysName"
                :key="index"
            >
                <input 
                    type="checkbox" 
                    name="days" 
                    :id="day" 
                    v-if="period==='weekly'"
                    @input="toggleDay"
                >
                <label v-if="period==='weekly'" :for="day">{{day}}</label>
                <p v-if="period==='daily'" class="day">{{day}}</p>
                <p class="time-span" v-if="days.length>0"  @click="activateTime(day)">{{setTimePeroid(day)}}</p>
            </div>      
        </div>
        <div class="set-time">
            <TimePopup
                :period="period"
                :days="days"
                :display="display"
                :timeToEdit="timeToEdit"
                v-on:toggleTime="activateTime"
                v-if="setTime"
                v-on:userSelectedTime="userSelectedTime"
            />
            <button @click="activateTime('all')">Set Time</button>
        </div>
    </div>
</template>

<script>
import TimePopup from '@/components/Planner/AddTask/Days/TimePopup'

export default {
    name: 'Days',
    props:['period', 'days'],
    components:{
        TimePopup
    },
    data(){
        return{
            setTime: false,
            display: null,
            timeToEdit:null,
            daysName:['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        }
    },
    methods:{
        activateTime(display){
            this.display = display
            if(this.display !== 'all'){
                const time = this.days.find(day=>day.day === display)
                if(time){
                    this.timeToEdit = {
                        begin:{
                            hours: null,
                            minutes: null
                        },
                        end:{
                            hours: null,
                            minutes: null
                        }
                    }
                    this.timeToEdit.begin = time.begin
                    this.timeToEdit.end = time.end
                }
            }
            this.setTime = !this.setTime
        },
        userSelectedTime(days){
            this.activateTime()
            this.$emit('updateDaysAndTime', days)
        },
        setTimePeroid(day){
            const findDay = this.days.find(d=>d.day===day)
            if(findDay){
                return `${findDay.begin} - ${findDay.end}`
            }
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

<style>
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
    margin: 5px;
}
#AddTask .days-addTask .days{
    display: flex;
}

#AddTask .days .field p{
    margin: 5px 0;
}
#AddTask .days .field p.day{
    width: 100%;
}

#AddTask .days .field label{
    width: 20%;
}
#AddTask .days .field p.time-span{
    border-bottom: solid 1px rgba(0,0,0,.2);
    cursor: pointer;
    transition: .5s;
}
#AddTask .days .field p.time-span:hover{
    background: rgba(0,0,0,.2);
}
#AddTask .days.checkbox .field p.time-span{
    opacity: .2;
}
#AddTask .days-addTask .days.selected{
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
#AddTask .days-addTask  button{
    margin: 10px auto;
    display: block;
    font-size: .7em;
}
#AddTask .days-addTask .set-time{
    display: flex;
    align-items: center;
}
#AddTask .set-time p{
    font-size: .7em;
}

#AddTask .days input[type="checkbox"]:checked + label{
    background: black;
    color: white;
    opacity: 1;
}
#AddTask .days input[type="checkbox"]:checked ~ p.time-span{
    opacity: 1;
}
</style>