<template>
    <form @submit.prevent="change" class="edit-label" :style="setPos">
        <div class="field">
            <Feedback 
                v-if="feedbackLabel" 
                :feedback='{message: feedbackLabel, type:"label"}'
                v-on:turnOffFeedback="turnOffFeedback"
            />
            <input type="text" v-model="editLabel.label" name="label" autocomplete="off" required>
        </div>
        <div class="field">
            <Feedback 
                v-if="feedbackColor" 
                :feedback='{message: feedbackColor, type:"color"}'
                v-on:turnOffFeedback="turnOffFeedback"
            />
            <input type="text" v-model="editLabel.color" name="color" autocomplete="off" required>
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
import firebase from 'firebase'
export default {
    name: 'EditLabelForm',
    props:['label','userData', 'settings'],
    components:{
        Feedback
    },
    data(){
        return{
            feedbackColor: null,
            feedbackLabel: null,
            colorLabels: this.userData.colorLabels,
            user: firebase.auth().currentUser,
            nonEditedLabel: this.label,
            editLabel: Object.assign({}, this.label)
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
            const findLabel =   array.find(label=> label.label.toLowerCase() === this[labelProp].toLowerCase())
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
    },
    watch:{
        label: function(newLabel, oldLabel){
            if(JSON.stringify(newLabel)!== JSON.stringify(oldLabel)){
                this.editLabel = Object.assign({}, newLabel)
            }
        }
    },
    computed:{
        setPos(){
            return{
                top: `${this.settings.coords.top +2}px`,
                left:`${this.settings.coords.left+this.settings.coords.elHeight+13}px`
            }
        }
    }
}
</script>

<style>
form.popup.edit-label{
    position: fixed;
    left: 0;
    top: 0;
    background: white;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.37);
    z-index: 1000;
}
form.popup.edit-label input[type='text']{
    width: 140px;
    border: none;
    padding: 5px;
    padding-left: 0;
    border-bottom: rgba(0,0,0,.2) solid 1px;
    outline: none;
    background: transparent;
    color: rgba(0,0,0,.8);
}
form.popup.edit-label input[type='text']::placeholder{
    color: rgba(0,0,0,.2);
}
form.popup.edit-label{
    left: 10%;
    padding: 20px;
}
form.popup.edit-label .field{
    margin: 10px 15px;
}
form.popup.edit-label::before{
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
form.popup.edit-label .example{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>