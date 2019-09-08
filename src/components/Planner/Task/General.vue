<template>
    <div class="general-info">
        <p class="task-name" v-if="edit !== task">{{task.task}}</p>
        <div class="time" v-if="task !== expanded">
            <p 
                class="task-begin" 
                v-if="edit !== task"
            >
                {{getTimeOfThisDay('begin', task)}}-
            </p>
            <p 
                class="task-end" 
                v-if="edit !== task"
            >
                {{getTimeOfThisDay('end', task)}}
            </p>
        </div>
        <div class="notes" v-if="expanded === task">
            <h3>Notes</h3>
            <p>{{task.notes}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GeneralInfo',
    props:['task', 'edit', 'today', 'expanded'],
    data(){
        return{

        }
    },
    methods:{
        getTimeOfThisDay(state, task){
            return task.days
                .find(day=>day.day===this.today)[state]
        }
    },
    created(){
        console.log(this.task)
    }
}
</script>

<style>
.general-info .notes{
    font-size: .8em;
    margin: 5px 0;
    user-select: none;
    padding: 5px;
}
.general-info .notes p{
    max-height: 120px;
    overflow-y: auto;
    font-style: italic;
}
</style>