<template>
    <div id="Week-View">
        <Timeline/>
        <div id="Week">
            <div 
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
            </div>
        </div>   
    </div>
</template>

<script>
import Timeline from '@/components/Planner/Timeline'
import {days} from '@/components/helpers/timeFormat'
import {monthNames} from '@/components/helpers/timeFormat'
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'WeekView',
    components:{
        Timeline
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
    align-items: center;
    height: 100%;
}
#Week-View #Week h3{
    width: 150px;
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