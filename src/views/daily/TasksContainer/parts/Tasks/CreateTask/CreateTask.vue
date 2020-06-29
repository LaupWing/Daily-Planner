<template>
    <div 
        class="create-task"
        :style="{
            height: height
        }"
    >
        <p class="begin">
            {{createTask.starting.time}}    
        </p>  
        <p class="duration">
            
        </p>
        <p v-if="createTask.moving" class="end">
            {{createTask.moving.time}}
        </p>
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
</style>