<template>
    <div id="Color-Label">
        <h2>Color Labels</h2>
        <div class="label-container" v-if="!addTask">
            <Label 
                v-for="(label, index) in colorLabels" 
                :key="index"
                :label='label'
                :taskColor='taskColor'
                class="label"
                :class="{'active':nonEditedLabel === label}"
                v-on:edit='edit'
            />
            <i v-if="!addLabel && !editLabel"  class="fas fa-plus-circle" @click="toggleAdd"></i>
        </div>
        <div class="label-container" v-if="addTask">
            <AddTaskLabel 
                v-for="(label, index) in colorLabels" 
                :key="index"
                :label='label'
                :colorLabelToAdd='colorLabelToAdd'
                class="label"
                v-on:addColorLabel='addColorLabel'
            />
            <i v-if="!addLabel && !editLabel"  class="fas fa-plus-circle" @click="toggleAdd"></i>
        </div>
        <!-- <i v-if="!addLabel && !editLabel"  class="fas fa-plus-circle" @click="toggleAdd"></i> -->
        <div class="form-container"  v-if="addLabel || editLabel">
            <form @submit.prevent="submit" v-if="addLabel">
                <h2 v-if="addTask">Adding Label</h2>
                <div class="field">
                    <Feedback 
                        v-if="feedbackLabel" 
                        :feedback='{message:feedbackLabel, type:"label"}'
                        v-on:turnOffFeedback="turnOffFeedback"
                    />
                    <input type="text" v-model="newLabel" name="label" placeholder="label" required>
                </div>
                <div class="field">
                    <Feedback 
                        v-if="feedbackColor" 
                        :feedback='{message:feedbackColor, type: "color"}'
                        v-on:turnOffFeedback="turnOffFeedback"
                    />
                    <input type="text" v-model="color" name="color" placeholder="color" required>
                </div>
                <div class="example">
                    <p :style="{borderColor: color, color: color}" class="label">{{newLabel}}</p>
                </div>
                <div class="field">
                    <button type="button" @click="cancel">Cancel</button>
                    <button>Add</button>
                </div>
            </form>
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
        </div>
        <div class="buttons" v-if="addTask">
            <button @click="closePopup">Cancel</button>
            <button @click="chosenColor">Accept</button>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import Label from '@/components/Planner/ColorLabels/Labels/Label'
import AddTaskLabel from '@/components/Planner/ColorLabels/Labels/AddTaskLabel'
import Feedback from '@/components/feedback/Feedback'
export default {
    name: 'ColorLabels',
    props:['taskColor' ,'addTask', 'chosenColorLabel'],
    components:{
        Label,
        AddTaskLabel,
        Feedback
    },
    data(){
        return{
            colorLabels: [],
            newLabel: null,
            color: null,
            user: firebase.auth().currentUser,
            addLabel: false,
            editLabel: null,
            nonEditedLabel: null,
            colorLabelToAdd: null,
            feedbackColor: null,
            feedbackLabel: null
        }
    },
    methods:{
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
        edit(label){
            if(this.addLabel){
                return
            }
            this.editLabel = Object.assign({},label)
            this.nonEditedLabel = label
        },
        toggleAdd(){
            this.addLabel = !this.addLabel
        },
        addColorLabel(label){
            this.colorLabelToAdd = label
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
        cancel(){
            this.editLabel = null
            this.addLabel = false
            this.nonEditedLabel = null
            this.color = null
            this.newLabel = null
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
                    }
                })
        },
        turnOffFeedback(feedback){
            if(feedback.type === 'color'){
                this.feedbackColor = null
            }
            if(feedback.type === 'label'){
                this.feedbackLabel = null
            }
        },
        closePopup(){
            this.$emit('closePopup')
        },
        chosenColor(){
            this.$emit('chosenColor', this.colorLabelToAdd)
        }
    },
    created(){
        this.getData()
        if(this.chosenColorLabel){
            this.colorLabelToAdd = this.chosenColorLabel
        }
    }
}
</script>

<style>
#Color-Label{
    position: fixed;
    top: 50%;
    left: 20px;
    transform:translate(0,-50%);
}
#Color-Label h2{
    font-weight: normal;
    font-size: 1.2em;
    text-align: center;
    width: 140px;
}
#Color-Label p.label{
    display: inline-block;
    padding: 5px 15px;
    border-radius: 2px;
    margin: 5px auto;
    border: black solid 2px;
    position: relative;
    cursor: pointer;
    transition: .5s;
    font-weight: bold;
}
#Color-Label p.label.active::before{
    content: '>';
    position: absolute;
    left: -15px;
    color: white;
}
#Color-Label .example{
    display: flex;
    justify-content: center;
}
#Color-Label button{
    margin: auto;
    display: block;
    width: 50%;
    border: none;
    background: transparent;
    border: solid 1px white;
    color: white;
    padding: 5px;
    border-radius: 0 20px 20px 0;
    outline: none;
    cursor: pointer;
}
#Color-Label button:first-of-type{
    border-right: none;
    border-radius: 20px 0 0 20px;
}
#Color-Label .example{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
#Color-Label .label-container{
    display: flex;
    flex-direction: column;
}
#Color-Label i{
    display: block;
    margin: 10px auto;
    text-align: center;
    font-size: 1.5em;
    color: white;
    cursor: pointer;
    width: 100%;
}
#Color-Label .form-container{
    /* height: 100px; */
}
#Color-Label form input[type='text']{
    width: 140px;
    border: none;
    padding: 5px;
    padding-left: 0;
    border-bottom: white solid 1px;
    outline: none;
    background: transparent;
    color: white
}
/* #Color-Label form button{
    width: 70px;
    text-align: center;
} */
#Color-Label .field{
    display: flex;
    position: relative;
}

#Color-Label .buttons{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
}
#Color-Label .buttons button{
    width: 50%;
}
</style>