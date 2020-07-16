<template>
    <div class="steps-container">
        <div 
            id="steps-popup"
            :style="{
                top: topVal
            }"
        >
            <div class="steps-wrapper">
                <transition :name="anim">
                    <app-time
                        :starting="createTask.starting.time"
                        :ending="createTask.ending.time"
                        :createTask="createTask"
                        v-on:disableNext="disableNext = $event"
                        v-on="$listeners"
                        v-if="step === 1"
                    />
                    <app-general
                        v-if="step === 2"
                    />
                </transition>
            </div>
            <div class="buttons">
                <button 
                    @click="setStep(false)"
                    :class="{
                        'disabled': step ===  1
                    }"
                >
                    previous
                </button>
                <button 
                    :class="{disabled:disableNext}"
                    @click="setStep(true)"
                >
                    next
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Time from './Steps/Time/Time'
import General from './Steps/General/General'

export default {
    name: 'StepsPopup',
    components:{
        'app-time': Time,
        'app-general': General
    },
    props:['coord', 'createTask'],
    data(){
        return{
            topVal: 0,
            disableNext: false,
            step: 1,
            anim: 'slideOutIn'
        }
    },
    methods:{
        setStep(forward){
            if(forward){
                this.anim = 'slideOutIn'
                this.step += 1
            }else{
                if(this.step > 1){
                    this.anim = 'slideInOut'
                    this.step -= 1
                }
            }
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
    min-width: 220px;
    height: 250px;
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
.steps-wrapper{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
    width: 100%;
    overflow: hidden;
}
#steps-popup >>> .step{
    padding: 20px;
    color: black;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
    pointer-events: none;
}

@keyframes slidingOut {
    from{
        transform: translateX(0);
    }
    to{
        transform: translateX(-100%);
    }

}
@keyframes slidingIn {
    from{
        transform: translateX(100%);
    }
    to{
        transform: translateX(0);
    }

}
.slideOutIn-enter-active {
    animation: slidingIn 1s;
}

.slideOutIn-leave-active {
    animation: slidingOut 1s;
}
.slideInOut-enter-active {
    animation: slidingOut 1s reverse;
}

.slideInOut-leave-active {
    animation: slidingIn 1s reverse;
}
</style>