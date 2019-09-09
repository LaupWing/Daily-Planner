<template>
    <div class="task-more">
        <TaskNav
            :section="section"
            :task="editTask"
            v-on:contractTask="contractTask"
            v-on:setSection="setSection"
        />
        <General
            :task="editTask"
            :edit="edit"
            v-if="section === 'general'"
        />
        <Week
            :task="editTask"
            :edit="edit"
            v-if="section === 'time'"
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
            <button>Accept</button>
        </div>
    </div>
</template>

<script>
import General from '@/components/Planner/Task/More/parts/General'
import Week from '@/components/Planner/Task/More/parts/Week'
import TaskNav from '@/components/Planner/Task/More/parts/TaskNav'

export default {
    name:'TaskMore',
    props:['task'],
    components:{
        General,
        TaskNav,
        Week
    },
    data(){
        return{
            section: 'general',
            edit: false,
            editTask:JSON.parse(JSON.stringify(this.task))
        }
    },
    methods:{
        contractTask(){
            this.$emit('contractTask')
        },
        toggleEdit(state){
            this.edit = state
        },
        setSection(section){
            this.section = section
        }
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