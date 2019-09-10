<template>
    <div 
        class="label"
        :class="{'hover':!nonEditedLabel}" 
        :style='{background: label.color}' 
        @click="clickAction"
    >
        <p 
            class="label-name" 
            :style="{background: label.color}"
            :class="checkTaskColor"
        >
            {{label.label}}
        </p>
         <EditLabelForm 
            v-if="nonEditedLabel === label"
            :colorLabels="colorLabels"
            :nonEditedLabel="nonEditedLabel"
            :editLabel="editLabel"
            :user="user"
            v-on:cancel="cancel"
        /> 
    </div>
</template>

<script>
import EditLabelForm from '@/components/Planner/ColorLabels/ColorForms/EditLabelForm'
export default {
    name: 'Label',
    props:['label' ,'taskColor', 'user', 'colorLabels', 'editLabel', 'nonEditedLabel'],
    components:{
        EditLabelForm
    },
    data(){
        return{
        }
    },
    methods:{
        clickAction(){
            this.$emit('edit', this.label)
        },
        cancel(){
            this.$emit('cancel')
        },
    },
    watch:{
        nonEditedLabel: function(newLabel, oldLabel){
            // console.log(newLabel, oldLabel, this.nonEditedLabel)
        }
    },
    computed:{
        checkTaskColor(){
            if(this.taskColor === null || this.taskColor === undefined){
                return
            }
            return {
                'show': this.label.color.toLowerCase() === this.taskColor.toLowerCase() && !this.nonEditedLabel
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
    position: relative;
}
div.label p.label-name{
    user-select: none;
    position: absolute;
    left: 50%;
    max-width: 0px;
    transition: .5s;
    overflow: hidden;
    height: 100%;
    line-height: 30px;
}
div.label p.label-name.show,
div.label p.label-name.show-all,
div.label.hover:hover p.label-name{
    padding-left: 50px;
    padding-right: 10px;
    max-width: 300px;
}
#Color-Label div.label form{
    left: 150%;
}
#Color-Label div.label form::before{
    content: "";
    width: 20px;
    height: 20px;
    background: white;
    transform: translate(0,-100%);
    display: block;
    position: absolute;
    left: -8px;
    top: 6px;
    transform: rotate(45deg);
}
</style>