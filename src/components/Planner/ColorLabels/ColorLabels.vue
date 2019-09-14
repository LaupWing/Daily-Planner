<template>
    <div id="Color-Label">
        <h2
            @mouseover="showAll(true)"
            @mouseout="showAll(false)"
        >Labels</h2>
        <div class="label-container" v-if="!addTask">
            <Label 
                v-for="(label, index) in colorLabels" 
                :key="index"
                :label='label'
                :preventActions="preventActions"
                :colorLabels="colorLabels"
                :user="user"
                :taskColor='taskColor'
                :nonEditedLabel="nonEditedLabel"
                :editLabel="editLabel"
                :class="{'active':nonEditedLabel === label}"
                v-on:editPopup='editPopup'
            />
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
            <!-- <div class="form-container">
                <i class="fas fa-plus-circle" @click="toggleAdd" v-if="!addLabel"></i>
                <AddLabelForm 
                    v-if="addLabel"
                    :addTask="addTask"
                    :colorLabels="colorLabels"
                    :user="user"
                    v-on:cancel="cancel"
                />
            </div> -->
        </div>
        <div class="form-container">
            <i class="fas fa-plus-circle" @click="toggleAdd"></i>
            <AddLabelForm 
                v-if="addLabel"
                :addTask="addTask"
                :colorLabels="colorLabels"
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
// import EditLabelForm from '@/components/Planner/ColorLabels/ColorForms/EditLabelForm'
import AddLabelForm from '@/components/Planner/ColorLabels/ColorForms/AddLabelForm'

export default {
    name: 'ColorLabels',
    props:['taskColor' ,'addTask', 'chosenColorLabel', 'preventActions'],
    components:{
        Label,
        AddTaskLabel,
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
        showAll(state){
            if(this.preventActions.type === 'label') return
            if(state){
                this.$el.querySelectorAll('.label-name').forEach(label=>{
                    label.classList.add('show-all')
                })
            }else{
                this.$el.querySelectorAll('.label-name').forEach(label=>{
                    label.classList.remove('show-all')
                })
            }
        },
        editPopup(data){
            this.$emit('editPopup', data)
        },
        toggleAdd(){
            this.editLabel = null
            this.nonEditedLabel = null
            this.addLabel = !this.addLabel
        },
        addColorLabel(label){
            this.colorLabelToAdd = label
        },
        cancel(){
            this.editLabel = null
            this.addLabel = false
            this.nonEditedLabel = null
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
    border: solid 1px rgba(0,0,0,.6);
    color: rgba(0,0,0,.6);
    padding: 5px;
    border-radius: 0 20px 20px 0;
    outline: none;
    cursor: pointer;
}
#Color-Label button:first-of-type{
    border-right: none;
    border-radius: 20px 0 0 20px;
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
#Color-Label .form-container{
    position: relative;
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