<template>
    <div id="Color-Label">
        <h2>Labels</h2>
        <div class="label-container" v-if="!addTask">
            <Label 
                v-for="(label, index) in colorLabels" 
                :key="index"
                :label='label'
                :taskColor='taskColor'
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
        <div class="form-container"  v-if="addLabel || editLabel">
            <AddLabelForm 
                v-if="addLabel"
                :addTask="addTask"
                :colorLabels="colorLabels"
                :user="user"
                v-on:cancel="cancel"
            />
            <EditLabelForm 
                v-if="editLabel"
                :colorLabels="colorLabels"
                :nonEditedLabel="nonEditedLabel"
                :editLabel="editLabel"
                :user="user"
                v-on:cancel="cancel"
            />
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
import EditLabelForm from '@/components/Planner/ColorLabels/ColorForms/EditLabelForm'
import AddLabelForm from '@/components/Planner/ColorLabels/ColorForms/AddLabelForm'

export default {
    name: 'ColorLabels',
    props:['taskColor' ,'addTask', 'chosenColorLabel'],
    components:{
        Label,
        AddTaskLabel,
        Feedback,
        EditLabelForm,
        AddLabelForm
    },
    data(){
        return{
            colorLabels: [],
            user: firebase.auth().currentUser,
            addLabel: false,
            editLabel: null,
            nonEditedLabel: null,
            colorLabelToAdd: null
        }
    },
    methods:{
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
    align-items: center;
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