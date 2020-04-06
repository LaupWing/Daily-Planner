<template>
    <form @submit.prevent="change" class="edit-label" :style="setPos">
        <div class="input-fields">
            <div class="field">
                <transition name="scaling">
                    <Feedback 
                        v-if="feedbackLabel" 
                        :feedback='{message: feedbackLabel, type:"label"}'
                        v-on:turnOffFeedback="turnOffFeedback"
                    />
                </transition>
                <input type="text" v-model="editLabel.label" name="label" autocomplete="off" required>
            </div>
            <div class="field">
                <transition name="scaling">
                    <Feedback 
                        v-if="feedbackColor" 
                        :feedback='{message: feedbackColor, type:"color"}'
                        v-on:turnOffFeedback="turnOffFeedback"
                    />
                </transition>
                <input type="text" v-model="editLabel.color" name="color" autocomplete="off" required>
            </div>
            <div class="example" :style="{color: editLabel.color, borderColor:editLabel.color}">
                <p>{{editLabel.label}}</p>
            </div>
        </div>
        <div class="field buttons">
            <button type="button" @click="cancel">Cancel</button>
            <button >Change</button>
        </div>
    </form>
</template>

<script>
import Feedback from '@/components/feedback/Feedback'
import firebase from 'firebase'
import db from '@/firebase/init'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'EditLabelForm',
    props:['userData', 'settings'],
    components:{
        Feedback
    },
    computed:{
        ...mapGetters(['getUserData']),
        setPos(){
            return{
                top: `${this.settings.coords.top +2}px`,
                left:`${this.settings.coords.left+this.settings.coords.elHeight+13}px`
            }
        },
    },
    data(){
        return{
            feedbackColor: null,
            feedbackLabel: null,
            colorLabels: this.userData.colorLabels,
            user: firebase.auth().currentUser,
            nonEditedLabel: this.settings.data,
            editLabel: Object.assign({}, this.settings.data)
        }
    },
    methods:{
        ...mapActions(['updateColor', 'updateTask']),
        cancel(){
            this.$emit('cancel')
        },
        change(){
            const removeSelf = this.getUserData.colorLabels.filter(label=>{
                return JSON.stringify(label) !== JSON.stringify(this.nonEditedLabel)
            })
            if(this.duplicateCheck(removeSelf)){
                const updatedColorLabels = this.getUserData.colorLabels.map(label=>{
                        if(JSON.stringify(label)=== JSON.stringify(this.nonEditedLabel)){
                            return this.editLabel
                        }
                        return label
                    })
                const updatedDailyTasks = this.getUserData.dailyTasks.map(task=>{
                    if(JSON.stringify(task.color) === JSON.stringify(this.nonEditedLabel)){
                        task.color = this.editLabel
                        }
                        return task
                    })
                this.updateColor(updatedColorLabels)
                this.updateTask(updatedDailyTasks)
                this.cancel()
            }
            
        },
        getData(){
            return db
                .collection('planner')
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then(doc=>{
                    const data = doc.data()
                    if(data.colorLabels){
                        this.colorLabels = data.colorLabels
                    }   
                    if(data.dailyTasks){
                        this.dailyTasks = data.dailyTasks
                        // console.log(this.dailyTasks)
                    }
                })
        },
        duplicateCheck(array){
            const findColor = array.find(label=>label.color.toLowerCase() === this.editLabel.color.toLowerCase())
            const findLabel =   array.find(label=> label.label.toLowerCase() === this.editLabel.label.toLowerCase())
            if(findColor || findLabel){
                if(findColor){
                    this.feedbackColor = `The color ${this.editLabel.color} is already in use`
                }
                if(findLabel){
                    this.feedbackLabel = `The label named ${this.editLabel.label} is already in use`
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
    created(){
    }
}
</script>

<style>
form.popup.edit-label{
    position: fixed;
    left: 0;
    top: 0;
    background: white;
    border-radius: 5px 5px 13px 13px;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.37);
    z-index: 1000;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
form.popup.edit-label .input-fields{
    margin-top: 10px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
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
    position: relative;
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
    padding: 6px 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 2px;
    border-radius: 5px;
    border-style: solid;
    margin-top: 20px;
}
form.popup.edit-label .field.buttons{
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0;
    width: 100%;
}
form.popup.edit-label .field.buttons button{
    border: none;
    background: transparent;
    padding: 6px;
    width: 50%;
    cursor: pointer;
    transition: .25s;
    border-top: 1px solid rgba(0,0,0,.4);
}
form.popup.edit-label .field.buttons button:first-of-type{
    border-right: 1px solid rgba(0,0,0,.4);
}
.scaling-enter-active {
  animation: scaling .5s ease-in;
}
.scaling-leave-active {
  animation: scaling .5s reverse;
}
@keyframes scaling {
    from{
        transform: scale(0);
        transform-origin: bottom left;
    }
    to{
        transform: scale(1);
        transform-origin: bottom left;
    }
}
</style>