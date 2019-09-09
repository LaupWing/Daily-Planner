<template>
    <p :style='checkTaskColor' @click="clickAction">
        {{label.label}}
    </p>
</template>

<script>
export default {
    name: 'Label',
    props:['label' ,'taskColor'],
    data(){
        return{

        }
    },
    methods:{
        clickAction(){
            this.$emit('edit', this.label)
        }
    },
    computed:{
        checkTaskColor(){
            if(this.taskColor === null || this.taskColor === undefined){
                return {
                    color: this.label.color,
                    background:'transparent',
                    border: `solid 1px ${this.label.color}`
                }
            }
            else if(this.label.color.toLowerCase() === this.taskColor.toLowerCase()){
                return {
                    background: this.label.color,
                    color: 'white',
                    border: `solid 1px ${this.label.color}`
                }
            }else{
                return {
                    color: this.label.color,
                    background:'transparent',
                    border: `solid 1px ${this.label.color}`
                }
            }
        }
    },
    created(){
    }
}
</script>