<template>
    <div class="days-addTask">
        <div class="days" v-if="period==='weekly'">
            <div class="field">
                <input type="checkbox" name="days" id="">
                <label for="">mon</label>
                <button>set time</button>
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="">
                <label for="">tue</label>
                <button>set time</button>
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="">
                <label for="">wed</label>
                <button>set time</button>
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="">
                <label for="">thu</label>
                <button>set time</button>
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="">
                <label for="">fri</label>
                <button>set time</button>
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="">
                <label for="">sat</label>
                <button>set time</button>
            </div>
            <div class="field">
                <input type="checkbox" name="days" id="">
                <label for="">sun</label>
                <button>set time</button>
            </div>        
        </div>
        <div class="days" v-else>
            <div class="field">
                <p class="day">mon</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">tue</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">wed</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">thu</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">fri</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">sat</p>
                <!-- <button>set time</button> -->
            </div>
            <div class="field">
                <p class="day">sun</p>
                <!-- <button>set time</button> -->
            </div>          
        </div>
        <TimePopup v-if="setTime"/>
        <button @click="activateTime">Set time</button>
    </div>
</template>

<script>
import TimePopup from '@/components/Planner/AddTask/Days/TimePopup'

export default {
    name: 'days-addTask',
    props:['period'],
    data(){
        return{
            setTime: false
        }
    },
    methods:{
        activateTime(){
            this.setTime = !this.setTime
        }
    },
    components:{
        TimePopup
    }
}
</script>

<style>
#AddTask .days-addTask,
#AddTask .days-addTask .days{
    width: 100%
}
#AddTask .days-addTask .days{
    display: flex;
}
#AddTask .days-addTask .field{
    display: flex;
    align-items: center;
    width: 50%;
    /* margin: 10px auto; */
    justify-content: space-between;
}
.days-addTask .field p{
    font-size: .8em;
    text-align: center;
    margin: auto;
    border-bottom: solid 1px rgba(0,0,0,.2);
}
#AddTask .days-addTask  button{
    margin: 10px auto;
    display: block;
    font-size: .7em;
}
#AddTask .days-addTask label{

}
</style>