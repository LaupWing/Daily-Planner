<template>
    <form @submit.prevent="change" v-if="editLabel">
        <div class="field">
            <Feedback 
                v-if="feedbackLabel" 
                :feedback='{message: feedbackLabel, type:"label"}'
                v-on:turnOffFeedback="turnOffFeedback"
            />
            <input type="text" v-model="editLabel.label" name="label" required>
        </div>
        <div class="field">
            <Feedback 
                v-if="feedbackColor" 
                :feedback='{message: feedbackColor, type:"color"}'
                v-on:turnOffFeedback="turnOffFeedback"
            />
            <input type="text" v-model="editLabel.color" name="color" required>
        </div>
        <div class="example">
            <p :style="{color: editLabel.color, borderColor:editLabel.color}" class="label">{{editLabel.label}}</p>
        </div>
        <div class="field">
            <button type="button" @click="cancel">Cancel</button>
            <button >Change</button>
        </div>
    </form>
</template>

<script>
import Feedback from '@/components/feedback/Feedback'

export default {
    name: 'EditLabelForm',
    props:['editLabel', 'colorLabels', 'nonEditedLabel'],
    components:{
        Feedback
    },
    data(){
        return{
            feedbackColor: null,
            feedbackLabel: null
        }
    },
    methods:{
        cancel(){
            this.$emit('cancel')
        },
        change(){
            const removeSelf = this.colorLabels.filter(label=>{
                return JSON.stringify(label) !== JSON.stringify(this.nonEditedLabel)
            })
            if(this.duplicateCheck(removeSelf, 'editLabel.label', 'editLabel.color')){
                this.getData()
                    .then(()=>{
                        const updatedLabels = this.colorLabels.map(label=>{
                            if(JSON.stringify(this.nonEditedLabel) === JSON.stringify(label)){
                                return this.editLabel
                            }
                            return label
                        })
                        const updatedTasks = this.dailyTasks.map(task=>{
                            if(JSON.stringify(this.nonEditedLabel) === JSON.stringify(task.color)){
                                task.color = this.editLabel
                            }
                            return task
                        })
                        db
                            .collection('planner')
                            .doc(this.user.uid)
                            .update({
                                colorLabels: updatedLabels,
                                dailyTasks: updatedTasks
                            })
                            .then(()=>{
                                this.colorLabels = updatedLabels
                                this.cancel()
                            })
                    })
            }
            
        },
        duplicateCheck(array,labelProp, colorProp){
            const findColor = array.find(label=>label.color.toLowerCase() === this[colorProp].toLowerCase())
            const findLabel = array.find(label=> label.label.toLowerCase() === this[labelProp].toLowerCase())
            if(findColor || findLabel){
                if(findColor){
                    this.feedbackColor = `The color ${this.color} is already in use`
                }
                if(findLabel){
                    this.feedbackLabel = `The label named ${this.newLabel} is already in use`
                }
                return false
            }else{
                return true
            }
        },
        turnOffFeedback(feedback){
            if(feedback.type === 'color'){
                this.feedbackColor = null
            }
            if(feedback.type === 'label'){
                this.feedbackLabel = null
            }
        }
    }
}
</script>

<style>

</style>