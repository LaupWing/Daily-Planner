<template>
    <div id="Week-View">
        <Timeline/>
        <div id="Week">
            <!-- <div 
                class="day"
                v-for="(day,i) in days"
                :key="i"
            >
                <div
                    :class="{'today': day === today}"
                >
                    <h3>{{day.slice(0,3)}}</h3>
                    <h3>{{date+(i-compareDateIndex)}}</h3>
                </div>
                <div 
                    class="task"
                    v-for="(task,i2) in getTaskOfThisDay(day)"
                    :key="i2"
                    :style="{top: 100*i2 +'px'}"
                >
                    {{task.task}}
                </div>
            </div> -->
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
import firebase from 'firebase'
import db from '@/firebase/init'
import Day from '@/components/Planner/views/WeekView/parts/Day/Day'

export default {
    name: 'WeekView',
    components:{
        Timeline,
        Day
    },
    computed:{
        
    },
    // props:['date', 'month', 'currentDay'],
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
        getTaskOfThisDay(day){
            if(this.dailyTasks.length === 0)    return []
            const filterTasks = this.dailyTasks
            const filteredTasks = filterTasks.filter(task=>task.days.find(t2=>t2.day===day))
                // .map(task2=>{
                //     const filteroutDays = task2.days.filter(d2=>d2.day===day)
                //     console.log(filteroutDays)
                //     return task2
                // })
            const tasksOfThisDay = []
            filteredTasks.forEach(task=>{
                task.days.forEach(d2=>{
                    if(d2.day === day){
                        tasksOfThisDay.push({
                            task: task.task,
                            begin: d2.begin,
                            end: d2.end
                        })
                    }
                })
            })
            console.log(tasksOfThisDay, day)
            // return filterTasks
            return tasksOfThisDay
        }
    },
    created(){
        this.compareDateIndex = this.days.findIndex((day)=>this.today===day)
        db
            .collection('planner')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc=>{
                if(doc.exists){
                    if(doc.data().dailyTasks){
                        this.dailyTasks = doc.data().dailyTasks
                    }
                    // console.log(this.dailyTasks, this.days)
                }
            })
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
    width: 150px;
    text-align: center;
}
#Week-View #Week .day{
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
}
#Week-View #Week .day .task{
    position: absolute;
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