<template>
    <div class="general-info">
        <p class="task-name">{{task.task}}</p>
        <div class="notes">
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
.general-info .task-name{
    padding: 5px;
}
.general-info .notes p{
    max-height: 120px;
    overflow-y: auto;
    font-style: italic;
}

/* width */
.general-info .notes p::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.general-info .notes p::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
.general-info .notes p::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
.general-info .notes p::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>