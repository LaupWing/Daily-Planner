<template>
    <div class="step">
        <input type="text" placeholder="Task" v-model="taskProxy"/>
        <textarea placeholder="Notes" v-model="notesProxy"></textarea>
    </div>
</template>

<script>
export default {
    name: 'General',
    computed:{
        notesProxy:{
            get(){
                return this.notes
            },
            set(value){
                this.$emit('update:notes', value)
            }
        },
        taskProxy:{
            get(){
                return this.task
            },
            set(value){
                this.$emit('update:task', value)
            }
        },
    },
    props:{
        notes:{
            required: true,
            type: String
        },
        task:{
            required: true,
            type: String
        }
    }
}
</script>

<style scoped>
input{
    width: 100%;
    padding: 2px;
    margin-bottom: 5px;
}
textarea{
    flex: 1;
    width: 100%;
    padding: 5px;
    resize: none;
}
</style>