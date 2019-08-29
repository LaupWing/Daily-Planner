<template>
    <div id="Current-Time">
        <h2 class="date">{{day}} {{month}} {{year}}</h2>
        <h2 class="time">{{hours}}<span>:</span>{{minutes}}</h2>
        <p v-if="user" class="task">Current Task: {{currentTask}}</p>
        <i 
            v-if="$route.name === 'Home'" 
            class="far fa-calendar-plus"
            @click="addTask"
        ></i>
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
            hours: null,
            minutes: null,
            day: null,
            month: null,
            year: null,
            user: null
        }
    },
    methods:{
        addTask(){
            this.$emit('addTask')
        }
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
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    text-align: center;
}    

#Current-Time h2.date{
    font-size: 1em;
    margin-top: 5px;
    font-weight: normal;
}

#Current-Time h2.time{
    font-size: 3.5em;
    margin-top: 10px;
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