<template>
    <div class="task-color">
        
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
    created(){
        console.log(this.colors)
    }
}
</script>

<style>
.task-color #Color-Label{
    position: relative;
}
</style>