<template>
  <div class="planner-container">
    <AddTask 
        v-if="addTask"
        v-on:close="addTask = false"
    />
    <div class='addTask'>
        <div class="current-info">
            <h2 
                v-if="currentTask"
            >
                {{currentTask.task}}
            </h2>
            <h2 
                v-else
            >
                Your current Task
            </h2>
            <p>{{day}}, {{date}} {{month}}</p>
        </div>
        <button 
            type="button" 
            @click="addTask = true"
        >
            Add New Task
            <i class="far fa-calendar-plus"></i>
        </button>
    </div>    
    <ColorLabels
        :taskColor='taskColor'
    />
    <TasksContainer
        v-on:setData="setData"
        v-on:setCurrentTask="currentTask = $event"
    />
  </div>
  
</template>

<script>
import ColorLabels from './ColorLabels/ColorLabels'
import AddTask from './AddTask/AddTask'
import TasksContainer from './TasksContainer/TasksContainer'
import {monthNames} from '@/components/helpers/timeFormat'

export default {
    name: 'Daily',
    data(){
        return{
            date: null,
            day: null,
            month: null,
            user: null,
            taskColor: null,
            addTask: false,
            currentTask: null
        }
    },
    components:{
        ColorLabels,
        AddTask,
        TasksContainer
    },
    methods:{
        setData({data,value}){
            this[data] = value
        },
        setDate(){
            const date = new Date()
            this.day = date.getDate()
            this.month = monthNames[date.getMonth()]
        },
    },
    created(){
        this.setDate()
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
    max-height: var(--dailyPlanner-height);
    overflow-y: auto;
    position: relative;
    position: relative;
    scroll-behavior: smooth;
    align-items: flex-start;
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
@media only screen and (max-height: 800px) {
    #planner {
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
