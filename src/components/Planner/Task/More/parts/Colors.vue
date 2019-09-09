<template>
    <div class="task-color">
        <p 
            class="color"
            v-for="(label, index) of colors"
            :key="index"
            :style="{background: label.color}"
            :class="{'chosen':JSON.stringify(label)===JSON.stringify(editTask.color)}"
        >
            {{label.label}}
        </p>
    </div>
</template>

<script>
export default {
    name: 'Colors',
    props:['colors', 'edit', 'editTask'],
    components:{
    },
    data(){
        return{

        }
    },
    methods:{
        
    },
    created(){
        console.log(this.colors)
    }
}
</script>

<style>
.task-color{
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    align-items: center;
}
.task-color .color{
    border: white solid 1px;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    margin: 5px;
    transform-origin: center;
    font-size: .8em;
}
.task-color .color.chosen{
    transform: scale(1.15);
    margin: 10px;
    font-weight: bold;
}
</style>