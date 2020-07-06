<template>
    <div 
        class="tooltip"
        :style="{
            top: getCoord('top'),
            left: getCoord('left')
        }"
    >
        <h2>Testing tooltip</h2>
    </div>
</template>

<script>
import {overlapTask}  from '../../../../../../helpers/helpers'

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
    created(){
        console.log(overlapTask(this.tooltip.coord))
        console.log(this.tooltip)
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
    padding: 10px;
    border-radius: 5px;
    border: solid var(--red) 1px;
    transform: translateY(-105%);
    background: white;
}
</style>