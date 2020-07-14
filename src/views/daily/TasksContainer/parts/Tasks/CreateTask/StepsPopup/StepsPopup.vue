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
                :ending="createTask.ending.time"
                :createTask="createTask"
                v-on:disableNext="disableNext = $event"
                v-on="$listeners"
            />
            <div class="buttons">
                <button @click="$emit('cancelCreateTask')">cancel</button>
                <button :class="{disabled:disableNext}">next</button>
            </div>
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
            topVal: 0,
            disableNext: false
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
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    flex-direction: column;
}
#steps-popup::after{
    content: '';
    position: absolute;
    background: white;
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
    bottom: -10px;
    z-index: -1;
}
#steps-popup >>> .field{
    margin: 20px;
}
#steps-popup >>> h2{
    font-size: 1em;
    margin-bottom: 5px;
}
.buttons{
    width: 100%;
    text-align: center;
}
.buttons button{
    color: black;
    padding: 7px;
    width: 50%;
    background: white;
    border: none;
    border-top: solid rgba(0,0,0,.4) 1px;
    text-transform: uppercase;
    font-size: .5em;
    letter-spacing: 2px;
    cursor: pointer;
    transition: .25s;
}
.buttons button:last-of-type{
    border-radius: 0 0 5px 0;
}
.buttons button:first-of-type {
    border-right: solid rgba(0,0,0,.4) 1px;
    border-radius: 0 0 0 5px;
}
button.disabled{
    background: #eee;
    color: #ccc;
}
</style>