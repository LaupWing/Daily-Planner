<template>
    <div id="Week-View">
        <Timeline view="week"/>
        <div id="Week">
            <Day
                v-for="(day,i) in days"
                :key="i"
                :day="day"
                :index="i"
                :today="today"
                :date="date"
                :compareDateIndex="compareDateIndex"
                v-on:setTooltip="tooltip = $event"
            />
        </div>   
        <Tooltip
            v-if="tooltip"
            :settings="tooltip"
        />
    </div>
</template>

<script>
import Timeline from '@/views/Daily/Timeline/Timeline';
import {days} from '@/components/helpers/timeFormat';
import {monthNames} from '@/components/helpers/timeFormat';
import Day from './parts/Day/Day';
import Tooltip from './parts/Tooltip';
export default {
    name: 'WeekView',
    components:{
        Timeline,
        Day,
        Tooltip
    },
    data(){
        return{
            tooltip: null,
            days: days,
            dailyTasks: [],
            date: new Date().getDate(),
            today: days[new Date().getDay()],
            month: monthNames[new Date().getMonth()],
            compareDateIndex: null
        }
    },
    created(){
        this.compareDateIndex = this.days.findIndex((day)=>this.today===day);
    }
}
</script>

<style>
#Week-View{
    display: flex;
    align-items: flex-start;
    margin-left: 10px;
    margin-top: 10px;
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
    flex: 1;
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