<template>
    <div class="steps-container">
        <div 
            id="steps-popup"
            :style="{
                top: topVal
            }"
        >

        </div>
    </div>
</template>

<script>
export default {
    name: 'StepsPopup',
    props:['coord'],
    data(){
        return{
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