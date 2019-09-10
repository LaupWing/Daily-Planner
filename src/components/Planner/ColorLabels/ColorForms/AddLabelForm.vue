<template>
    <form @submit.prevent="submit">
        <h2 v-if="addTask">Adding Label</h2>
        <div class="field">
            <Feedback 
                v-if="feedbackLabel" 
                :feedback='{message:feedbackLabel, type:"label"}'
                v-on:turnOffFeedback="turnOffFeedback"
            />
            <input type="text" v-model="newLabel" name="label" autocomplete="off" placeholder="label" required>
        </div>
        <div class="field">
            <Feedback 
                v-if="feedbackColor" 
                :feedback='{message:feedbackColor, type: "color"}'
                v-on:turnOffFeedback="turnOffFeedback"
            />
            <input type="text" v-model="color" name="color" placeholder="color" autocomplete="off" required>
        </div>
        <div class="example">
            <p :style="{borderColor: color, color: color}" class="label">{{newLabel}}</p>
        </div>
        <div class="field">
            <button type="button" @click="cancel">Cancel</button>
            <button>Add</button>
        </div>
    </form>
</template>

<script>
import Feedback from '@/components/feedback/Feedback'

export default {
    name: 'AddLabelForm',
    props:['addTask', 'addLabel' , 'colorLabels', 'user'],
    components:{
        Feedback
    },
    data(){
        return{
            feedbackLabel: null,
            feedbackColor: null,
            newLabel: null,
            color: null
        }
    },
    methods:{
        cancel(){
            this.$emit('cancel')
        },
        submit(){
            if(this.newLabel && this.color){
                if(this.duplicateCheck(this.colorLabels, 'newLabel', 'color')){
                    const colorLabel = {
                        color: this.color,
                        label: this.newLabel
                    }
                    this.colorLabels.push(colorLabel)
                    db
                        .collection('planner')
                        .doc(this.user.uid)
                        .update({
                            colorLabels: this.colorLabels
                        })
                        .then(()=>{
                            this.cancel()
                        })
                        .catch(()=>{
                        })
                }
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