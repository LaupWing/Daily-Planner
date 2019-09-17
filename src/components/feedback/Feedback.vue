<template>
    <div 
        class="feedback"
        @click="turnOffFeedback"
    >
        <h3>{{feedback.message}}</h3>
    </div>
</template>

<script>
export default {
    name: 'Feedback',
    props:['feedback'],
    methods:{
        turnOffFeedback(){
            this.$emit('turnOffFeedback', this.feedback)
        }
    },
    mounted(){
        setTimeout(()=>{
            this.turnOffFeedback()
        },5000)
    }
}
</script>

<style scoped>
.feedback{
    position: absolute;
    background: white;
    top: -100%;
    left: 100%;
    color: black;
    font-size: 12px;
    padding: 5px;
    white-space: nowrap;
    border-radius: 5px;
    box-shadow: 0px 0px 22px 0px rgba(0,0,0,0.33);
    padding: 10px;
}
</style>