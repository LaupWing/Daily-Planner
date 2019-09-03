<template>
    <div class="general">
        <div class="field task">
            <label for="task">Task:</label>
            <input type="text" @input="sendInput('task')" v-model="task">
        </div>
        <div class="field notes">
            <label for="task">Notes:</label>
            <textarea name="" id="" cols="30" rows="10" @input="sendInput('notes')" v-model="notes"></textarea>
        </div>
        <p class="feedback" v-if="feedback">{{feedback}}</p>
        <button @click="nextInput">Next</button>
    </div>
</template>

<script>
export default {
    name: 'General',
    data(){
        return{
            task: null,
            notes: null,
            feedback: null
        }
    },
    methods:{
        sendInput(type){
            this.$emit('sendingInput', {type, value: this[type]})
        },
        nextInput(){
            console.log('test')
            if(this.task === null){
                this.feedback = 'You have to fill in the name of this task'
            }else{
                this.$emit('nextInput', 2)
            }
        }
    }
}
</script>

<style>
#AddTask .general textarea{
    width: 80%;
    margin: auto;
    display: block;
}
#AddTask .field.notes label{
    width: 100%;
    display: block;
}
</style>