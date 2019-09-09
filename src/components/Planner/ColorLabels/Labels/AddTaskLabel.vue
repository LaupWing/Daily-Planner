<template>
    <p :style='checkTaskColor' @click="clickAction">
        {{label.label}}
    </p>
</template>

<script>
export default {
    name: 'Label',
    props:['label' ,'colorLabelToAdd'],
    data(){
        return{

        }
    },
    methods:{
        clickAction(){
            this.$emit('addColorLabel', this.label)
        }
    },
    computed:{
        checkTaskColor(){
            if(this.colorLabelToAdd === null || this.colorLabelToAdd === undefined){
                return {
                    color: this.label.color,
                    background:'transparent',
                    border: `solid 1px ${this.label.color}`
                }
            }
            else if(JSON.stringify(this.colorLabelToAdd) === JSON.stringify(this.label)){
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