<template>
    <div id="AllTasks">
        <h2>All tasks</h2>
        <!-- <div class="search">
            <input @input="search" type="text" placeholder="search">
            <i class="fas fa-search"></i>
        </div>
        <div class="sorting">
            
        </div>
        <div class="tasks">
            <Task 
                v-for="(task, index) in tasks" 
                :key="index"
                :task="task"
            />
        </div> -->
    </div>
</template>

<script>
import firebase from 'firebase'
import Task from '@/components/AllTasks/task'

export default {
    name: 'AllTasks',
    components:{
        Task
    },
    methods:{
        search(){
            this.searchTerm = event.target.value
            // console.log(this.searchTerm)
        }
    },
    data(){
        return{
            searchTerm: null
        }
    },
    computed:{
        tasks(){
            if(this.searchTerm){
                return this.tasksArray.filter(task=>task.task.toLowerCase().includes(this.searchTerm.toLowerCase()))
            }else{
                return this.tasksArray
            }
        }
    },
}
</script>

<style>
#AllTasks{
    /* background: rgba(255, 255, 255, .2); */
    width: 600px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
}
#AllTasks .tasks{
    margin: 20px;
    height: 60vh;
    overflow-y: auto;
    padding: 0 10px;
}
#AllTasks input[type="text"]{
    border: none;
    background: transparent;
    width: 100%;
}
#AllTasks .search{
    border: solid 2px white;
    background: transparent;
    padding: 5px 20px;
    width: 350px;
    border-radius: 50px;
    display: flex;
}
</style>