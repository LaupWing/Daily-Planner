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
         <EditLabelForm 
            v-if="editLabel"
            :colorLabels="colorLabels"
            :nonEditedLabel="nonEditedLabel"
            :editLabel="editLabel"
            :user="user"
            v-on:cancel="cancel"
        />
        <div 
            class="close-box"
            v-if="editLabel"
        >

        </div>
    </div>
</template>

<script>
import EditLabelForm from '@/components/Planner/ColorLabels/ColorForms/EditLabelForm'
export default {
    name: 'Label',
    props:['label' ,'taskColor', 'user', 'colorLabels'],
    components:{
        EditLabelForm
    },
    data(){
        return{
            editLabel: null,
            nonEditedLabel: null
        }
    },
    methods:{
        clickAction(){
            this.editLabel = Object.assign({},this.label)
            this.nonEditedLabel = this.label
            // this.$emit('edit', this.label)
        },
        cancel(){

        }
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
    position: relative;
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