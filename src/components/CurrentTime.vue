<template>
    <div id="Current-Time">
        <h2 class="date">{{day}} {{month}} {{year}}</h2>
        <h2 class="time">{{hours}}:{{minutes}}</h2>
        <i 
            v-if="$route.name === 'Home'" 
            class="far fa-calendar-plus"
            @click="addTask"
        ></i>
    </div>
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
export default {
    name: 'CurrentTime',
    data(){
        return{
            hours: null,
            minutes: null,
            day: null,
            month: null,
            year: null
        }
    },
    methods:{
        addTask(){
            this.$router.push({name:'AddTask'})
        }
    },
    created(){
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        setInterval(()=>{
            const date = new Date()
            this.hours = addZero(date.getHours())
            this.minutes = addZero(date.getMinutes())
            this.day = addZero(date.getDate())
            this.month = monthNames[date.getMonth()]
            this.year = date.getFullYear()
        },1000)
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

#Current-Time i{
    font-size: 1.2em;
    cursor: pointer;
}
</style>