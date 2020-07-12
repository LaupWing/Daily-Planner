<template>
    <div class="field">
        <div 
            :class="{
                time: true,
                start: true,
                overlapping: isOverlappingStarting
            }"
        >
            <h2>
                Start:
                <i 
                    v-if="isOverlappingStarting"
                    class="fas fa-exclamation-circle"
                    @mouseover="tooltip={
                        time:createTask.starting.time,
                        event: $event ,
                        moment: 'starting'
                    }"
                    @mouseout="tooltip=null"
                >
                </i>
                <app-tooltip
                    v-if="isOverlappingStarting && tooltip"
                    :tooltip="tooltip"
                />
            </h2>
            <input 
                type="number" 
                name="hours" 
                min="00" 
                max="23" 
                v-model.number="startingTime.hour"
                @input="$emit('setTime', {
                    time: startingTime,
                    moment: 'starting'
                })"
            >
            <input 
                type="number" 
                name="minutes" 
                min="00" 
                max="59" 
                v-model.number="startingTime.minute"
                @input="$emit('setTime', {
                    time: startingTime,
                    moment: 'starting'
                })"
            >
        </div>
        <div 
            :class="{
                time: true,
                end: true,
                overlapping: isOverlappingEnding
            }"
        >
            <h2>
                End:
                <i 
                    v-if="isOverlappingEnding"
                    class="fas fa-exclamation-circle"
                    @mouseover="tooltip={
                        time:createTask.ending.time,
                        event: $event,
                        moment: 'ending' 
                    }"
                    @mouseout="tooltip=null"
                >
                </i>
                <app-tooltip
                    v-if="isOverlappingEnding && tooltip"
                    :tooltip="tooltip"
                />
            </h2>
            <input 
                type="number" 
                name="hours" 
                min="00" 
                max="23" 
                v-model.number="endingTime.hour"
                @input="$emit('setTime', {
                    time: endingTime,
                    moment: 'ending'
                })"
            >
            <input 
                type="number" 
                name="minutes" 
                min="00" 
                max="59" 
                v-model.number="endingTime.minute"
                @input="$emit('setTime', {
                    time: endingTime,
                    moment: 'ending'
                })"
            >
        </div>
    </div>
</template>

<script>
import Tooltip from './Tooltip/Tooltip'

export default {
    name: 'Time',
    components:{
        'app-tooltip': Tooltip
    },
    props:{
        starting:{
            type: String,
            required: true
        },
        ending:{
            type: String,
            required: true
        },
        createTask:{
            type: Object,
            required: true
        }
    },
    watch:{
        createTask:{
            handler(val){
                if(val.starting.overlapping){
                    this.isOverlappingStarting = true
                    return
                }
                if(val.ending.overlapping){
                    this.isOverlappingEnding = true
                    return
                }
                this.isOverlappingEnding = false
                this.isOverlappingStarting = false
            },
            deep:true
        }
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
            topVal: 0,
            isOverlappingEnding: false,
            isOverlappingStarting: false,
            tooltip: null
        }
    }
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
.time{
    padding: 5px;
    border-radius: 5px;
}
.time.overlapping{
    color: var(--red);
}
.time.overlapping input{
    border: var(--red) solid 2px;
    border-radius: 3px;
    color: var(--red);
}
</style>