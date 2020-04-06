<template>
    <div class="task-more">
        <TaskNav
            :section="section"
            :task="editTask"
            v-on:contractTask="contractTask"
            v-on:setSection="setSection"
        />
        <General
            :editTask="editTask"
            :task="task"
            :edit="edit"
            v-if="section === 'general'"
        />
        <Week
            :editTask="editTask"
            :edit="edit"
            v-if="section === 'time'"
            v-on:changeDay="changeDay"
        />
        <Colors
            :editTask="editTask"
            :edit="edit"
            :colors="colors"
            v-if="section === 'labels'"
            v-on:changeColor="changeColor"
        />
        <i 
            class="far fa-edit"
            v-if="!edit"
            @click="toggleEdit(true)"
        >
        </i>
        <div 
            class="buttons"
            v-if="edit"
        >
            <button @click="toggleEdit(false)">Cancel</button>
            <button @click="acceptChanges">Accept</button>
        </div>
    </div>
</template>

<script>
import General from '@/components/Planner/views/DailyView/parts/Tasks/Task/More/parts/General'
import Week from '@/components/Planner/views/DailyView/parts/Tasks/Task/More/parts/Week'
import Colors from '@/components/Planner/views/DailyView/parts/Tasks/Task/More/parts/Colors'
import TaskNav from '@/components/Planner/views/DailyView/parts/Tasks/Task/More/parts/TaskNav'
import db from '@/firebase/init'
import firebase from 'firebase'
import { mapGetters, mapActions } from 'vuex'


export default {
    name:'TaskMore',
    props:['task'],
    components:{
        General,
        TaskNav,
        Week,
        Colors
    },
    data(){
        return{
            section: 'general',
            edit: false,
            editTask:JSON.parse(JSON.stringify(this.task)),
            dailyTasks: [],
            colors: []
        }
    },
    methods:{
        ...mapActions(['updateTask']),
        contractTask(){
            this.$emit('contractTask')
        },
        toggleEdit(state){
            this.edit = state
            if(!state){
                this.editTask = JSON.parse(JSON.stringify(this.task))
            }
        },
        setSection(section){
            this.section = section
        },
        changeColor(label){
            this.editTask.color = label
        },
        changeDay(newDay){
            this.editTask.days = this.editTask.days
                .map(day=>{
                    if(day.day === newDay.day){
                        return newDay
                    }
                    return day
                })
        },
        resetTimeline(){
            document.querySelectorAll('#Timeline li').forEach(li=>{
                li.style.removeProperty('margin-bottom')
                li.style.removeProperty('margin-top')
            })
        },
        async updateDatabase(){
            this.dailyTasks = this.dailyTasks.map(task=>{
                if(task.task === this.task.task){
                    return this.editTask
                }else{
                    return task
                }
            })
            // Need to start the retracting first before rerender this the whole array dailytasks array
            this.contractTask()
            await this.updateTask(this.dailyTasks)
            this.edit = false
        },
        acceptChanges(){
            this.resetTimeline()
            this.updateDatabase()
        }
    },
    created(){
        db
            .collection('planner')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc=>{
                this.dailyTasks = doc.data().dailyTasks
                this.colors = doc.data().colorLabels
            })

    },
    mounted(){
        this.$el.style.setProperty('--task-color', this.task.color.color)
    }
}
</script>

<style>
.task-more{
    width: 100%;
    height: 100%;
    position: relative;
    --task-color: black;
}
.task-more i.far.fa-edit{
    width: 100%;
    position: absolute;
    text-align: center;
    left:0;
    bottom: 0;
    padding: 5px;
    transition: .25s;
    cursor: pointer;
}
.task-more .buttons{
    width: 100%;
    position: absolute;
    text-align: center;
    left:0;
    bottom: 0;
}
.task-more .buttons button{
    width: 50%;
    background: transparent;
    border: none;
    color: white;
    padding: 5px;
    text-transform: uppercase;
    font-size: .6em;
    letter-spacing: 2px;
    border-top: solid 1px white;
    cursor: pointer;
    transition: .25s;
}
.task-more .buttons button:hover{
    background: white;
    color: var(--task-color);
}
.task-more .buttons button:first-of-type{
    border-right: solid 1px white;
}
.task-more i:hover{
    /* color: var(--task-color); */
    background: rgba(0, 0, 0, .4);
}
</style>