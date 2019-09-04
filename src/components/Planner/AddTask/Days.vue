<template>
    <div class="days-addTask">
        <div class="days" v-if="period === 'weekly'">
            <div class="field" >
                <input type="checkbox" name="days" id="mon">
                <label for="mon">mon</label>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="tue">
                <label for="tue">tue</label>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="wed">
                <label for="wed">wed</label>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="thu">
                <label for="thu">thu</label>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="fri">
                <label for="fri">fri</label>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="sat">
                <label for="sat">sat</label>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="sun">
                <label for="sun">sun</label>
                <!-- <button>set time</button> -->
            </div>        
        </div>
        <div class="days" :class="{'selected':daysAndTime.length>0}" v-else>
            <div class="field">
                <p class="day">mon</p>
                <p class="time-span" v-if="daysAndTime.length>0">{{setTimePeroid('mon')}}</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">tue</p>
                <p class="time-span" v-if="daysAndTime.length>0">{{setTimePeroid('tue')}}</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">wed</p>
                <p class="time-span" v-if="daysAndTime.length>0">{{setTimePeroid('wed')}}</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">thu</p>
                <p class="time-span" v-if="daysAndTime.length>0">{{setTimePeroid('thu')}}</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">fri</p>
                <p class="time-span" v-if="daysAndTime.length>0">{{setTimePeroid('fri')}}</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">sat</p>
                <p class="time-span" v-if="daysAndTime.length>0">{{setTimePeroid('sat')}}</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">sun</p>
                <p class="time-span" v-if="daysAndTime.length>0">{{setTimePeroid('sun')}}</p>
                <!-- <button>set time</button> -->
            </div>          
        </div>
        <div class="set-time">
            <TimePopup
                :period="period"
                :daysAndTime="daysAndTime"
                v-if="setTime"
                v-on:userSelectedTime="userSelectedTime"
            />
            <!-- <p for="task">Begin: </p> -->
            <!-- <input type="number" name="hours" min="00" max="23" value="00">
            <input type="number" name="minutes" min="00" max="59" value="00">
            <p for="task">End: </p>
            <input type="number" name="hours" min="00" max="23" value="00">
            <input type="number" name="minutes" min="00" max="59" value="00"> -->
            <button @click="activateTime">Set Time</button>
        </div>
    </div>
</template>

<script>
import TimePopup from '@/components/Planner/AddTask/Days/TimePopup'

export default {
    name: 'Days',
    props:['period'],
    components:{
        TimePopup
    },
    data(){
        return{
            setTime: false,
            daysAndTime: []
        }
    },
    methods:{
        activateTime(){
            this.setTime = !this.setTime
        },
        userSelectedTime(days){
            console.log(days)
            this.activateTime()
            this.daysAndTime = days
        },
        setTimePeroid(day){
            console.log(this.daysAndTime.length)
            const findDay = this.daysAndTime.find(d=>d.day===day)
            if(findDay){
                return `${findDay.begin} - ${findDay.end}`
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
    margin: 5px auto;
}
#AddTask .days-addTask .days{
    display: flex;
}

#AddTask .days .field p{
    margin: 0;
}
#AddTask .days .field p.day{
    width: 20%;
}
#AddTask .days .field p.time-span{
    border-bottom: solid 1px rgba(0,0,0,.2);
}
#AddTask .days-addTask .days.selected{
    flex-direction: column;
}
#AddTask .days-addTask .days label{
    font-size: .5em;
    width: 30px;
    height: 30px;
    line-height: 30px;
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
#AddTask .days-addTask label{

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
/* #AddTask .days-addTask input[type='number']{
    font-size: .8em;
    width: 35px;
} */
</style>