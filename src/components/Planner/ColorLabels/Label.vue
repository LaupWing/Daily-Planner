<template>
    <p :style='checkTaskColor' @click="clickAction">
        {{label.label}}
    </p>
</template>

<script>
export default {
    name: 'Label',
    props:['label' ,'taskColor', 'addTask', 'colorLabelToAdd'],
    data(){
        return{

        }
    },
    methods:{
        clickAction(){
            if(this.addTask){
                this.$emit('addColorLabel', this.label)
                document.querySelectorAll('#Color-Label p.label').forEach(label=>{
                    label.style.removeProperty('backgound-color')
                    label.classList.remove('add')
                })
                this.$el.classList.add('add')
                this.$el.style.backgroundColor = this.label.color
            }else{
                this.$emit('edit', this.label)
            }
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

<style>
p.label.add{
    color: white!important;
}
</style>