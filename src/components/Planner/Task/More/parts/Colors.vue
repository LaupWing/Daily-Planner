<template>
    <div class="task-color">
        <div 
            class="label-wrapper" 
            v-if="!edit"
        >
            <p 
                class="color"
                v-for="(label, index) of colors"
                :key="index"
                :style="{background: label.color}"
                :class="{'chosen':JSON.stringify(label)===JSON.stringify(editTask.color)}"
            >
                {{label.label}}
            </p>
        </div>
        <div 
            class="edit-wrapper"
            v-if="edit"    
        >
            <div 
                class="color"
                :style="{background: label.color}"
                v-for="(label, index) of colors"
                :key="index"
            >
                <label 
                    :for="label+index"
                >
                    {{label.label}}
                </label>
                <input 
                    type="radio" 
                    name="label" 
                    :id="label+index"
                    :checked="JSON.stringify(label)===JSON.stringify(editTask.color)"
                    @input="changeColor(label)"
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Colors',
    props:['colors', 'edit', 'editTask'],
    components:{
    },
    data(){
        return{
            
        }
    },
    methods:{
        changeColor(label){
            this.$emit('changeColor', label)
        }
    }
}
</script>

<style>
.label-wrapper,
.edit-wrapper{
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    align-items: center;
}
.task-color .color{
    border: white solid 1px;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    margin: 5px;
    transform-origin: center;
    font-size: .8em;
}
.task-color .edit-wrapper .color{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.task-color .color.chosen{
    transform: scale(1.15);
    margin: 10px;
    font-weight: bold;
}
</style>