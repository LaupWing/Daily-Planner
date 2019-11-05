<template>
    <div class="task-tooltip" :style="setVal">
        <h2>{{task.task}}</h2>
        <p>{{task.begin}} - {{task.end}}</p>
    </div>
</template>

<script>
export default {
    name: 'TaskTooltipInWeekView',
    props:['settings', 'task'],
    computed:{
        setVal(){
            return{
                top: this.settings.top +'px',
                left: this.settings.left+ 'px',
                color: this.task.color.color
            }
        }
    },
    data(){
        return{

        }
    },
    mounted(){
        console.log(this.task, this.settings)
    }
}
</script>

<style>
.task-tooltip{
    width: 200px;
    height: 300px;
    background: white;
    position: fixed;
    z-index: 1000;
    pointer-events: none;
    border-radius: 10px;
    animation: scaleUp .5s forwards;    
    transform-origin: top left;
}
.task-tooltip h2{
    text-align: center;
    border-bottom: 1px rgba(0,0,0,.2) solid; 
    padding: 10px;
}
</style>