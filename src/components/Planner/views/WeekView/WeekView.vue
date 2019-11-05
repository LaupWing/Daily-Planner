<template>
    <div id="Week-View">
        <Timeline/>
        <div id="Week">
            <Day
                v-for="(day,i) in days"
                :key="i"
                :day="day"
                :index="i"
                :today="today"
                :date="date"
                :compareDateIndex="compareDateIndex"
            />
        </div>   
    </div>
</template>

<script>
import Timeline from '@/components/Planner/Timeline'
import {days} from '@/components/helpers/timeFormat'
import {monthNames} from '@/components/helpers/timeFormat'
import Day from '@/components/Planner/views/WeekView/parts/Day/Day'

export default {
    name: 'WeekView',
    components:{
        Timeline,
        Day
    },
    data(){
        return{
            days: days,
            dailyTasks: [],
            date: new Date().getDate(),
            today: days[new Date().getDay()],
            month: monthNames[new Date().getMonth()],
            compareDateIndex: null
        }
    },
    methods:{
        
    },
    created(){
        this.compareDateIndex = this.days.findIndex((day)=>this.today===day)
    }
}
</script>

<style>
#Week-View{
    display: flex;
}
#Week-View #Timeline{
    padding: 0;
    margin: 0;
    margin-top: 70px;
}
#Week-View #Timeline li{
    font-size: .5em;
    opacity: 1;
    padding: 5px 0;
}
#Week-View #Week{
    display: flex;
    /* align-items: center; */
    height: 100%;
    border-bottom:solid white 1px
}
#Week-View #Week h3{
    text-align: center;
}

#Week-View .today{
    background: orange;
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 50%;
}
</style>