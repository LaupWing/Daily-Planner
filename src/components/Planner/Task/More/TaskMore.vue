<template>
    <div class="task-more">
        <TaskNav
            :section="section"
            :task="task"
            v-on:contractTask="contractTask"
        />
        <General
            :task="task"
            :edit="edit"
        />
        <i 
            class="far fa-edit">
        </i>
    </div>
</template>

<script>
import General from '@/components/Planner/Task/More/General'
import TaskNav from '@/components/Planner/Task/More/TaskNav'

export default {
    name:'TaskMore',
    props:['task'],
    components:{
        General,
        TaskNav
    },
    data(){
        return{
            section: 'general',
            edit: false
        }
    },
    methods:{
        contractTask(){
            this.$emit('contractTask')
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
.task-more i:hover{
    /* color: var(--task-color); */
    background: rgba(0, 0, 0, .4);
}
</style>