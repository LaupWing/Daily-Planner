<template>
    <div class="task-tooltip" :style="setVal">
        <h2>{{settings.task.task}}</h2>
        <p>{{settings.task.begin}} - {{settings.task.end}}</p>
    </div>
</template>

<script>
export default {
    name: 'TaskTooltipInWeekView',
    props:['settings'],
    computed:{
        setVal(){
            return{
                top: this.settings.top +'px',
                left: this.settings.left+ 'px',
                color: this.settings.task.color.color
            }
        }
    }
}
</script>

<style>
.task-tooltip{
    width: 200px;
    height: 300px;
    background: white;
    position: fixed;
    z-index: 100000;
    pointer-events: none;
    border-radius: 10px;
    animation: scaleUp .5s forwards;    
    transform-origin: top left;
}
.task-tooltip h2{
    text-align: center;
    border-bottom: 1px rgba(0,0,0,.2) solid; 
    padding: 10px;
    font-size: 1rem;
}
</style>