<template>
    <div 
        class="create-task"
        :style="{
            height,
            top
        }"
    >
        <steps-popup
            v-if="setCreateTask.ended"
            :coord="$el.getBoundingClientRect().top"
            :createTask="setCreateTask"
            :notes.sync="setCreateTask.notes"
            :task.sync="setCreateTask.task"
            @setTime="checkNewTime"
            v-on="$listeners"
        />
        <p class="begin" v-if="!setCreateTask.ended"
        >
            {{setCreateTask.starting.time}}
        </p>  
        <p class="duration">
            {{calcDuration}}
        </p>
        <p v-if="setCreateTask.ending && !setCreateTask.ended" class="end"
        >
            {{setCreateTask.ending.time}}
        </p>
    </div>
</template>

<script>
import StepsPopup from './StepsPopup/StepsPopup'
import {
        getCoordOfTime,
        pointOverlappedTask
    } from '../../../helpers/helpers'

export default {
    name: 'CreateTask',
    props:['createTask'],
    components:{
        'steps-popup' : StepsPopup
    },
    data(){
        return{
            setCreateTask: this.createTask.ended ? Object.assign({}, this.createTask) : this.createTask,
        }
    },
    computed:{
        height(){
            if(this.setCreateTask.ending){
                return this.setCreateTask.ending.coord - this.setCreateTask.starting.coord + 'px'
            }
            return 0
        },
        top(){
            return this.setCreateTask.starting.coord + 'px'
        },
        calcDuration(){
            if(!this.setCreateTask.starting||!this.setCreateTask.ending){
                return 'No duration available'
            }else{
                const startHour = Number(this.setCreateTask.starting.time.split(':')[0])
                const startMinute = Number(this.setCreateTask.starting.time.split(':')[1])
    
                const endHour = Number(this.setCreateTask.ending.time.split(':')[0])
                const endMinute = Number(this.setCreateTask.ending.time.split(':')[1])
                
                let hourDif = endHour - startHour
                let minuteDif = endMinute - startMinute
                if(minuteDif < 0){
                    hourDif -= 1 
                    minuteDif = 60 -(startMinute - endMinute)
                }
                return `Duration: ${hourDif < 10 ? '0'+hourDif:hourDif}:${minuteDif < 10 ? '0'+minuteDif:minuteDif}`
            }
        }
    },
    methods:{
        checkNewTime({time, moment}){
            const newCoord = getCoordOfTime(time)
            const overlapping = pointOverlappedTask(
                moment === 'starting' ? newCoord : this.setCreateTask.starting.coord,
                moment === 'ending' ? newCoord : this.setCreateTask.ending.coord,
            )
            if(!overlapping){
                if(moment === 'starting'){
                    const diffrence = Math.floor(newCoord) - Math.floor(this.setCreateTask.starting.coord)
                    document.querySelector('#planner').scrollBy(0, Math.floor(diffrence))
                }
                this.setCreateTask[moment].coord = newCoord
                this.setCreateTask[moment].overlapping = false
            }else{
                this.setCreateTask[moment].overlapping = true
            }
            const hour = Number(time.hour) < 9 ? `0${time.hour}` : time.hour
            const minute = Number(time.minute) < 9 ? `0${time.minute}` : time.minute

            this.setCreateTask[moment].time = `${hour}:${minute}`
        },
    },
    created(){
        this.$store.commit('setCreatingTask', true)
    }
}
</script>

<style scoped>
.create-task{
    position: absolute;
    width: 90%;
    background: transparent;
    border: dashed 1px white;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
}
p.begin,
p.end{
    user-select: none;
    background: white;
    color:black;
    padding: 2px 5px;
    font-size: .8em;
}
p.begin{
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-100%);
    border-radius: 5px 5px 0 0;
}
p.end{
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translateY(100%);
    border-radius: 0 0 5px 5px;
}
p.duration{
    position: absolute;
    user-select: none;
}
</style>