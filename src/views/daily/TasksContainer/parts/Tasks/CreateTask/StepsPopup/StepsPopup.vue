<template>
    <div class="steps-container">
        <div 
            id="steps-popup"
            :style="{
                top: topVal
            }"
        >
            <app-time
                :starting="createTask.starting.time"
                :ending="createTask.moving.time"
            />
        </div>
    </div>
</template>

<script>
import Time from './Steps/Time'

export default {
    name: 'StepsPopup',
    components:{
        'app-time': Time
    },
    props:['coord', 'createTask'],
    data(){
        return{
            starting: {
                hour: Number(this.createTask.starting.time.split(':')[0]),
                minute: Number(this.createTask.starting.time.split(':')[1])
            },
            ending: {
                hour: Number(this.createTask.moving.time.split(':')[0]),
                minute: Number(this.createTask.moving.time.split(':')[1])
            },
            topVal: 0
        }
    },
    mounted(){
        this.topVal = (this.coord-this.$el.querySelector('#steps-popup').getBoundingClientRect().height-15) + 'px'
    }
}
</script>

<style scoped>
.steps-container{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
#steps-popup{
    position: fixed;
    background: white;
    width: 100px;
    height: 100px;
    top: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}
#steps-popup::after{
    content: '';
    position: absolute;
    background: white;
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
    bottom: -10px;
}
</style>