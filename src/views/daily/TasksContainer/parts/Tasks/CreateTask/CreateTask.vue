<template>
    <div 
        class="create-task"
        :style="{
            height: height
        }"
    >

    </div>
</template>

<script>
import {collisionDetection} from '../../../helpers/helpers'

export default {
    name: 'CreateTask',
    props:['createTask'],
    computed:{
        height(){
            if(this.createTask.moving){
                console.log(collisionDetection(this.createTask.starting.coord,this.createTask.moving.coord))
                // collisionDetection(this.createTask.starting.coord,this.createTask.moving.coord)
                return this.createTask.moving.coord - this.createTask.starting.coord + 'px' 
            }
            return 0
        },
    },
    mounted(){
        this.$el.style.top = this.createTask.starting.coord + 'px'
    }
}
</script>

<style scoped>
.create-task{
    position: absolute;
    width: 90%;
    background: transparent;
    border: dashed 1px white;
    height: 50px;
    border-radius: 6px;
}
</style>