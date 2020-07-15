<template>
    <div 
        class="tooltip"
        :style="{
            top: getCoord('top'),
            left: getCoord('left')
        }"
    >
        <h2>{{msg}}</h2>
    </div>
</template>

<script>
import {overlapTask, getCoordOfTime}  from '../../../../../../helpers/helpers'

export default {
    name: 'Tooltip',
    props:{
        tooltip:{
            type: Object,
            required: true
        }
    },
    methods:{
        getCoord(pos){
            return this.tooltip.event.target.getBoundingClientRect()[pos] + 'px'
        }
    },
    data(){
        return{
            msg: null
        }
    },
    created(){
        const time = {
            hour: this.tooltip.time.split(':')[0],
            minute: this.tooltip.time.split(':')[1]
        }
        const overlap = overlapTask(getCoordOfTime(time))
        if(this.tooltip.moment === 'ending'){
            const overlapTime = overlap.dataset.begin
            this.msg = `This time needs to be below ${overlapTime}`
        }else{
            const overlapTime = overlap.dataset.end
            this.msg = `This time needs to be above ${overlapTime}`
        }
    }
}
</script>

<style scoped>
.tooltip > h2{
    margin: 0!important;
    padding: 0;
}
.tooltip{
    position: fixed;
    padding: 10px 15px;
    border-radius: 5px;
    border: solid var(--red) 1px;
    transform: translateY(-105%);
    background: white;
}
</style>