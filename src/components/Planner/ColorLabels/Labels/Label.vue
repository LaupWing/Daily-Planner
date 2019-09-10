<template>
    <div 
        class="label" 
        :style='{background: label.color}' 
        @click="clickAction"
    >
        <p 
            class="label-name" 
            :style="{color: label.color}"
            :class="checkTaskColor"
        >
            {{label.label}}
        </p>
    </div>
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
        },
    },
    computed:{
        checkTaskColor(){
            if(this.taskColor === null || this.taskColor === undefined){
                return
            }
            return {
                'show': this.label.color.toLowerCase() === this.taskColor.toLowerCase() 
            }
            if(this.taskColor === null || this.taskColor === undefined){
                return false
            }
        }
        },
    created(){
    }
}
</script>
<style>
div.label{
    width: 30px;
    height: 30px;
    margin: 5px;
    border-radius: 50%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
div.label p.label-name{
    position: absolute;
    left: 110%;
    top: 12%;
    max-width: 0px;
    transition: .5s;
    overflow: hidden;
    background: rgba(255,255,255,.7);
}
div.label p.label-name.show{
    padding: 2px 5px;
    max-width: 300px;
}
</style>