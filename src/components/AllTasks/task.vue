<template>
    <div class="task" :style="getRgb(task.color.color.toLowerCase())">
        <h2 :style="{background: task.color.color}">
            {{task.task}}
        </h2>
    </div>
</template>

<script>
import colorString from 'color-string'
export default {
    name: 'Task',
    props:['task'],
    methods:{
        getRgb(color){
            const rgbaArray = colorString.get.rgb(this.task.color.color.toLowerCase())
            return {
                background: `rgba(${rgbaArray[0]},${rgbaArray[1]},${rgbaArray[2]},.2)`
            }
        }
    }
}
</script>

<style scoped>
.task{
    width: 500px;
    margin: 10px 0;
    height: 150px;
}
.task h2{
    font-size: 1em;
    font-weight: normal;
    padding: 5px;
}
</style>