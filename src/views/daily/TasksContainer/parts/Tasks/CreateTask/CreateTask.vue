<template>
    <div 
        class="create-task"
        :style="{
            height,
            top
        }"
    >
        <steps-popup
            v-if="createTask.ended"
            :coord="$el.getBoundingClientRect().top"
            :createTask="createTask"
            @setTime="checkNewTime"
        />
        <p class="begin" v-if="!createTask.ended">
            {{createTask.starting.time}}
        </p>  
        <p class="duration">
            {{calcDuration}}
        </p>
        <p v-if="createTask.ending && !createTask.ended" class="end">
            {{createTask.ending.time}}
        </p>
    </div>
</template>

<script>
import StepsPopup from './StepsPopup/StepsPopup'
import {getCoordOfTime} from '../../../helpers/helpers'

export default {
    name: 'CreateTask',
    props:['createTask'],
    components:{
        'steps-popup' : StepsPopup
    },
    computed:{
        height(){
            if(this.createTask.ending){
                return this.createTask.ending.coord - this.createTask.starting.coord + 'px'
            }
            return 0
        },
        top(){
            return this.createTask.starting.coord + 'px'
        },
        calcDuration(){
            if(!this.createTask.starting||!this.createTask.ending){
                return 'No duration available'
            }
            const startHour = Number(this.createTask.starting.time.split(':')[0])
            const startMinute = Number(this.createTask.starting.time.split(':')[1])

            const endHour = Number(this.createTask.ending.time.split(':')[0])
            const endMinute = Number(this.createTask.ending.time.split(':')[1])
            
            let hourDif = endHour - startHour
            let minuteDif = endMinute - startMinute
            if(minuteDif < 0){
                hourDif -= 1 
                minuteDif = 60 -(startMinute - endMinute)
            }
            return `Duration: ${hourDif < 10 ? '0'+hourDif:hourDif}:${minuteDif < 10 ? '0'+minuteDif:minuteDif}`
        }
    },
    methods:{
        checkNewTime(time){
            const newCoord = getCoordOfTime(time)
            console.log(newCoord)
            console.log(this.createTask)
        }
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