<template>
    <p :style='checkTaskColor'@click="edit">
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
        edit(){
            this.$emit('edit', this.label)
        }
    },
    computed:{
        checkTaskColor(){
            if(this.taskColor === null){
                return {
                    color: this.label.color,
                    background:'transparent',
                    border: `solid 1px ${this.label.color}`
                }
            }
            else if(this.label.color.toLowerCase() === this.taskColor.toLowerCase()){
                return {
                    background: this.taskColor,
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

</style>