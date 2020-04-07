<template>
  <div class="planner-container">
    <AddTask 
        v-if="addTask"
        v-on:toggle="toggle('addTask')"
    />
    <div class='addTask'>
        <div class="current-info">
            <h2 v-if="currentTask">{{currentTask.task}}</h2>
            <h2 v-else>Your current Task</h2>
            <p>{{day}}, {{date}} {{month}}</p>
        </div>
        <button type="button" @click="toggle('addTask')">
            Add New Task
            <i class="far fa-calendar-plus"></i>
        </button>
    </div>    
    <ColorLabels
        :taskColor='taskColor'
        :userData="userData"
        :view='"single"'
    />
    <DailyView
        :userData="userData"
        v-on:setData="setData"
        v-on:setCurrentTask="setCurrentTask"
    />
  </div>
  
</template>

<script>
import ColorLabels from './ColorLabels/ColorLabels'
import AddTask from './AddTask/AddTask'
import firebase from 'firebase'
import db from '@/firebase/init'
import DailyView from './views/DailyView/DailyView'
import { mapGetters, mapActions } from 'vuex'
import {monthNames} from '@/components/helpers/timeFormat'

export default {
  name: '',
  props: ['userData'],
    data(){
        return{
            hours: null,
            minutes: null,
            date: null,
            day: null,
            month: null,
            user: null,
            geolocation:{
                lat: 52.370216,
                lng: 4.895168
            },
            taskColor: null,
            addTask: null,
            currentTask: null
        }
    },
    components:{
        ColorLabels,
        AddTask,
        DailyView
    },
    methods:{
        ...mapActions(['fetchUserData']),
        setData({data,value}){
            this[data] = value
        },
        createTask(){
        // this.test()
            // if(event.target.id){
            //     if(event.target.id === 'Tasks' || event.target.id === 'planner'){
            //     const container = this.$el.querySelector('#planner')
            //     const clickYCoord = event.clientY
            //     const zeroScrollCoord = container.getBoundingClientRect().top + (container.offsetHeight/2)
            //     const begin = (clickYCoord -zeroScrollCoord) + container.scrollTop 
            //     container.scrollTo(0,begin)
            //     } 
            // }
        },
        setDate(){
            const date = new Date()
            this.day = date.getDate()
            this.month = monthNames[date.getMonth()]
        },
        setCurrentTask(data){
            this.currentTask =data
            // console.log(data)
        },
        updateAndGetUserData(){
            const user = firebase.auth().currentUser
            const ref = db.collection('users')
            ref
                .where('user_id', '==', user.uid)
                .get()
                .then(snapshot=>{
                snapshot.forEach(doc=>{
                    ref
                    .doc(doc.id)
                    .update({
                        geolocation:{
                            lat: this.geolocation.lat,
                            lng: this.geolocation.lng
                        }
                    })
                })
                })
                .then(()=>{
                ref
                    .where('user_id', '==',user.uid)
                    .get()
                    .then(snapshot=>{
                        snapshot.forEach(doc=>{
                            this.user = doc.data()
                        })
                    })
                })
        },
    },
    created(){
        this.setDate()  
    },
    mounted(){
        this.fetchUserData()
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(pos=>{
                this.geolocation.lat = pos.coords.latitude
                this.geolocation.lng = pos.coords.longitude
                this.updateAndGetUserData()
            })
        }
        else{
            this.updateAndGetUserData()
        }
    }
}
</script>

<style>
#planner.preventScroll{
    overflow-y: hidden;
}
#planner{
    margin-right: 65px;
    width: 500px;
    display: flex;
    max-height: 60vh;
    overflow-y: auto;
    position: relative;
    position: relative;
    scroll-behavior: smooth;
}
#planner.smooth{
    scroll-behavior: smooth;
}
.planner-container .set-view{
    position: absolute;
    right: 0;
    padding: 20px;
    top: 10px;
    display: flex;
}
.planner-container .set-view i{
    font-size: 1.5em;
    margin: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: .5;
    transition: .25s;
}
.planner-container .set-view i:hover,
.planner-container .set-view i.active{
    background: rgba(0,0,0,.7);
    opacity: 1;
    cursor: pointer;
}
/* Add Task view single */
.planner-container .addTask{
    margin-bottom: 20px;
    width: 500px;
    text-align: center;
}
.planner-container .addTask .current-info{
    margin: 20px 0;
}
.planner-container .current-info h2{
    font-size: 1.5em;
}
.planner-container .current-info p{
    text-transform: capitalize;
    opacity: .5;
}
.planner-container .addTask button{
    font-size: .6em;
    width: 70%;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 5px;
    background: white;
    opacity: .35;
    border: none;
    transition: .25s;
    cursor: pointer;
} 
.planner-container .addTask button:hover{
    opacity: 1;
}
/* Add Task Week View */
.planner-container .addTask.week{
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin: 0;
}

.planner-container .addTask.week button{
    width: 150px;
    padding: 10px;
}

.planner-container{
    position: relative;
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 10%;
}

#planner .indicator{
    --time: '00:00';
    height: 1.2px;
    width: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    background: white;
    opacity: .8;
}
#planner .indicator::before{
    content: 'Time';
    top:-20px;
    position: absolute;
}
#planner .indicator::after{
    content: attr(time);
}
#planner::-webkit-scrollbar {
    width: 0px;
}

/* Track */
#planner::-webkit-scrollbar-track {
    background: #f1f1f1; 
}
 
/* Handle */
#planner::-webkit-scrollbar-thumb {
    background: #888; 
}

/* Handle on hover */
#planner::-webkit-scrollbar-thumb:hover {
    background: #555; 
}
@media only screen and (min-height: 1000px) {
    #planner {
        max-height:600px;
    }
}
@media only screen and (max-height: 800px) {
    #planner {
        max-height: 60vh;   
        width: 450px;
    }
    .planner-container{
        margin-top: 70px;
    }
    #planner .indicator{
        margin-top: 35px;
    }
}
</style>
