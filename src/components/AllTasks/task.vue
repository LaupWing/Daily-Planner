<template>
    <div class="task" :style="getRgb(task.color.color.toLowerCase())">
        <h2 :style="{background: task.color.color}">
            {{task.task}}
        </h2>
        <div class="days">
            <!-- <p class="day" v-for="(day,index) in task.days" :key="index">{{day.substring(0,3)}}</p> -->
            <p class="day" :class="{'active':activeDay('mon')}">Mon</p>
            <p class="day" :class="{'active':activeDay('tue')}">Tue</p>
            <p class="day" :class="{'active':activeDay('wed')}">Wed</p>
            <p class="day" :class="{'active':activeDay('thu')}">Thu</p>
            <p class="day" :class="{'active':activeDay('fri')}">Fri</p>
            <p class="day" :class="{'active':activeDay('sat')}">Sat</p>
            <p class="day" :class="{'active':activeDay('sun')}">Sun</p>
        </div>
    </div>
</template>

<script>
import colorString from 'color-string'
export default {
    name: 'Task',
    props:['task'],
    methods:{
        getRgb(color){
            const rgbaArray = colorString.get.rgb(this.task.color.color.toLowerCase())
            return {
                background: `rgba(${rgbaArray[0]},${rgbaArray[1]},${rgbaArray[2]},.2)`
            }
        },
        activeDay(day){
            const findDay = this.task.days.find(d=>d.substring(0,3).toLowerCase()===day)
            if(findDay){
                return true
            }else{
                return false
            }
        }
    }
}
</script>

<style scoped>
.task{
    width: 500px;
    margin: 10px 0;
    height: 150px;
}
.task h2{
    font-size: 1em;
    font-weight: normal;
    padding: 5px;
}
.task .days{
    display: flex;
    padding: 10px;
}
.task .days .day{
    font-size: .8em;
    padding: 3px 10px;
    border: white solid 1px;
    margin: 0 5px;
}
.task .days .day.active{
    color: black;
    background: white;
}
</style>