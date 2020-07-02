<template>
    <div class="field">
        <div class="start">
            <h2>Start:</h2>
            <input 
                type="number" 
                name="hours" 
                min="00" 
                max="23" 
                v-model="startingTime.hour"
            >
            <input 
                type="number" 
                name="minutes" 
                min="00" 
                max="59" 
                v-model="startingTime.minute"
            >
        </div>
        <div class="end">
            <h2>End:</h2>
            <input 
                type="number" 
                name="hours" 
                min="00" 
                max="23" 
                v-model="endingTime.hour"
            >
            <input 
                type="number" 
                name="minutes" 
                min="00" 
                max="59" 
                v-model="endingTime.minute"
            >
        </div>
    </div>
</template>

<script>
export default {
    name: 'Time',
    props:{
        starting:{
            type: String,
            required: true
        },
        ending:{
            type: String,
            required: true
        },
    },
    data(){
        return{
            startingTime: {
                hour: Number(this.starting.split(':')[0]),
                minute: Number(this.starting.split(':')[1])
            },
            endingTime: {
                hour: Number(this.ending.split(':')[0]),
                minute: Number(this.ending.split(':')[1])
            },
            topVal: 0
        }
    },
}
</script>

<style scoped>
.end,
.start{
    color: black;
}
.start{
    margin-bottom: 20px;
}
input{
    font-size: 1.2em;
    text-align: center;
}
</style>