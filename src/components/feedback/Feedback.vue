<template>
    <div 
        class="feedback"
        :class="{'color': feedback.type === 'color', 'label': feedback.type === 'label'}"
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
        },10000)
    }
}
</script>

<style scoped>
.feedback{
    position: absolute;
    background: white;
    top: 0;
    right: -100%;
    color: black;
    font-size: 12px;
    padding: 5px;
}
.feedback.label{
    transform: translate(45%, -68%);
}
.feedback.color{
    transform: translate(32%, 25%);
}
</style>