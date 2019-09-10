<template>
    <div class="general-info">
        <div class="title">
            <p 
                class="task-name"
                v-if="!edit"
            >
                {{task.task}}
            </p>
            <input
                type="text" 
                v-if="edit"
                v-model="editTask.task"
            >
        </div>
        <div class="notes">
            <h3>Notes</h3>
            <p v-if="!edit">{{task.notes}}</p>
            <textarea 
                cols="30" 
                rows="8" 
                v-if="edit" 
                v-model="editTask.notes"
            >

            </textarea>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GeneralInfo',
    props:['task','editTask', 'edit', 'today', 'expanded'],
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
.general-info .title{
    padding: 5px;
}
.general-info .title input[type='text']{
    width: 100%;
}
.general-info .notes{
    font-size: .8em;
    margin: 5px 0;
    user-select: none;
    padding: 5px;
}
.general-info .task-name{
    padding: 5px 0;
}
.general-info .notes p{
    max-height: 120px;
    overflow-y: auto;
    font-style: italic;
}
.general-info .notes textarea{
    width: 100%;
}

/* width */
.general-info .notes p::-webkit-scrollbar,
.general-info .notes textarea::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.general-info .notes p::-webkit-scrollbar-track,
.general-info .notes textarea::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
.general-info .notes p::-webkit-scrollbar-thumb,
.general-info .notes textarea::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
.general-info .notes p::-webkit-scrollbar-thumb:hover,
.general-info .notes textarea::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>