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
                v-model.number="startingTimeHour"
            >
            <input 
                type="number" 
                name="minutes" 
                min="00" 
                max="59" 
                v-model.number="startingTimeMinute"
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
                v-model.number="endingTimeHour"
            >
            <input 
                type="number" 
                name="minutes" 
                min="00" 
                max="59" 
                v-model.number="endingTimeMinute"
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
    computed:{
        startingTimeHour:{
            get(){
                return this.startingTime.hour
            },
            set(val){
                if(val > 24){
                    return
                }
                if(val > this.endingTime.hour){
                    return
                }
                if(val === this.endingTime.hour && this.startingTime.minute > this.endingTime.minute ){
                    return
                }
                this.startingTime.hour = val
                this.$emit('setTime', {
                    time: this.startingTime,
                    moment: 'starting'
                })
            }
        },
        startingTimeMinute:{
            get(){
                return this.startingTime.minute
            },
            set(val){
                if(val > 59){
                    return
                }
                if(this.startingTime.hour === this.endingTime.hour){
                    if(val > this.endingTime.minute){
                        return
                    }
                }
                this.startingTime.minute = val
                this.$emit('setTime', {
                    time: this.startingTime,
                    moment: 'starting'
                })
            }
        },
        endingTimeHour:{
            get(){
                return this.endingTime.hour
            },
            set(val){
                if(val > 24){
                    return
                }
                if(val < this.startingTime.hour){
                    return
                }
                if(val === this.startingTime.hour && this.endingTime.minute < this.startingTime.minute ){
                    return
                }
                this.endingTime.hour = val
                this.$emit('setTime', {
                    time: this.endingTime,
                    moment: 'ending'
                })
            }
        },
        endingTimeMinute:{
            get(){
                return this.endingTime.minute
            },
            set(val){
                if(val > 59){
                    return
                }
                if(this.startingTime.hour === this.endingTime.hour){
                    if(val < this.startingTime.minute){
                        return
                    }
                }
                this.endingTime.minute = val
                this.$emit('setTime', {
                    time: this.endingTime,
                    moment: 'ending'
                })
            }
        },
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