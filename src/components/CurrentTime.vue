<template>
    <div id="Current-Time">
        <h2 class="date">{{day}} {{month}} {{year}}</h2>
        <h2 class="time">{{hours}}<span>:</span>{{minutes}}</h2>
        <p v-if="user" class="task">Current Task: {{currentTask}}</p>
        <nav>
                <router-link :to="{name: 'Home'}">Daily Planner</router-link>
                <a>All Tasks</a>
                <a>Habit Tracker</a>
        </nav>
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
#Current-Time nav{
    display: flex;
    margin: 20px auto;
    justify-content: center;
    align-items: center;
}
#Current-Time nav li{
    list-style: none;
}
#Current-Time nav a{
    text-decoration: none;
    color: white;
    padding: 5px 12px;
    opacity: .5;
    display: inline-block;
    border: solid white 1px;
    font-size: .8em;
}
#Current-Time nav a.router-link-exact-active{
    opacity: 1;
    background: white;
    color: black;
}
#Current-Time nav a:nth-child(even){
    border-left: none;
    border-right: none;
}
#Current-Time nav a:first-of-type{
    border-radius: 10px 0 0 10px;
}
#Current-Time nav a:last-of-type{
    border-radius: 0 10px 10px 0;
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