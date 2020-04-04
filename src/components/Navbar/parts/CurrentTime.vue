<template>
    <div id="Current-Time">
        <h2 class="time">{{hours}}<span>:</span>{{minutes}}</h2>
        <h2 class="date">{{day}} {{month}} {{year}}</h2>
        <!-- <p v-if="user" class="task">Current Task: {{currentTask}}</p> -->
    </div>
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
import {monthNames} from '@/components/helpers/timeFormat'
import firebase from 'firebase'


export default {
    name: 'CurrentTime',
    props:['currentTask'],
    data(){
        return{
            hours: '00',
            minutes: '00',
            day: 'day',
            month: 'month',
            year: 'year',
            user: null
        }
    },
    methods:{
    },
    mounted(){
        setInterval(()=>{
            const date = new Date()
            this.hours = addZero(date.getHours())
            this.minutes = addZero(date.getMinutes())
            this.day = addZero(date.getDate())
            this.month = monthNames[date.getMonth()]
            this.year = date.getFullYear()
        },1000)
        firebase.auth().onAuthStateChanged(user=>{
            this.user = user
        })
    }
}
</script>

<style>
#Current-Time{
    color: black;
}    

#Current-Time h2.date{
    font-size: .7em;
    font-weight: normal;
    padding: 5px;
    opacity: .7;
    text-align: center;
}

#Current-Time h2.time{
    font-size: 2em;
    /* margin-top: 10px; */
    text-align: center;
    font-weight: normal;
}

#Current-Time i{
    font-size: 1.4em;
    cursor: pointer;
    margin: 5px;
}

#Current-Time .time span{
    animation: blink 2s infinite;
}

@keyframes blink{
    0%{
        opacity: 0;
    }

    50%{
        opacity: 1;
    }
    100%{
        opacity: 0;
    }
}
</style>