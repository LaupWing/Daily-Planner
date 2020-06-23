<template>
    <form @submit.prevent="submit" class="add-label" :style="setPos">
        <h2>Adding Label</h2>
        <div class="input-fields">
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
            <div class="example" :style="{borderColor: color, color: color}">
                <p class="label">{{newLabel}}</p>
            </div>
        </div>
        <div class="field buttons">
            <button type="button" @click="cancel">Cancel</button>
            <button>Add</button>
        </div>
    </form>
</template>

<script>
import Feedback from '@/components/feedback/Feedback'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'AddLabelForm',
    props:['settings', 'user'],
    components:{
        Feedback
    },
    computed:{
        ...mapGetters(['colorLabels']),
        setPos(){
            return{
                top: `${this.settings.coords.top-4}px`,
                left:`${this.settings.coords.left+this.settings.coords.elHeight+32}px`
            }
        }
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
        ...mapActions(['updateColor']),
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
                    const updatedColorLabels = [...this.colorLabels, colorLabel]
                    this.updateColor(updatedColorLabels)
                    this.cancel()
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
        },

    }
}
</script>

<style>
form.popup.add-label h2{
    color: black;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    font-weight: normal;
    letter-spacing: 1px;
    font-size: 1.2em;
    text-align: center;
    padding: 5px;
    border-bottom: 1px rgba(0,0,0,.4) solid;
}
form.popup.add-label{
    position: fixed;
    left: 0;
    top: 0;
    background: white;
    border-radius: 5px 5px 13px 13px;
    padding: 10px;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.37);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}
form.popup.add-label .input-fields{
    margin: 40px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
form.popup.add-label input[type='text']{
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
form.popup.add-label{
    left: 10%;
    padding: 20px;
}
form.popup.add-label .field{
    margin: 10px 15px;
}
form.popup.add-label .field.buttons{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
}
form.popup.add-label .field.buttons button{
    width: 50%;
    padding: 6px;
    background: transparent;
    border:none;
    border-top: 1px rgba(0,0,0,.4) solid;
    cursor: pointer;
}
form.popup.add-label .field.buttons button:first-of-type{
    border-right: 1px  rgba(0,0,0,.4) solid;
}
form.popup.add-label::before{
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
form.popup.add-label .example{
    padding: 7px 10px;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    color: black;
    border: solid black 2px;
    border-radius: 5px;
    align-items: center;
}
</style>