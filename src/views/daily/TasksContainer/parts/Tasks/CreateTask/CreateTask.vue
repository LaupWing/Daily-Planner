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
import {collisionDetection, getClosestCoord} from '../../../helpers/helpers'

export default {
    name: 'CreateTask',
    props:['createTask'],
    computed:{
        height(){
            if(this.createTask.moving){
                const collided = collisionDetection(this.createTask.starting.coord,this.createTask.moving.coord)
                if(collided){
                    return getClosestCoord(collided.offsetTop) - this.createTask.starting.coord + 'px'
                }
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