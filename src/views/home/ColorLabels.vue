<template>
    <div id="Color-Label">
        <div class="label-container">
            <p 
                v-for="(label, index) in colorLabels" 
                :key="index"
                :style="{background:label.color}"
                class="label"
                :class="{'active':nonEditedLabel === label}"
                @click="edit(label)"
            >
                {{label.label}}
            </p>
        </div>
        <div class="form-container">
            <i v-if="!addLabel && !editLabel" class="far fa-plus-square" @click="add"></i>
            <form @submit.prevent="submit" v-if="addLabel">
                <div class="field">
                    <label for="lable">Label </label>
                    <input type="text" v-model="newLabel" name="label">
                </div>
                <div class="field">
                    <label for="color">Color</label>
                    <input type="text" v-model="color" name="color">
                </div>
                <div class="example">
                    <p :style="{background: color}" class="label">{{newLabel}}</p>
                </div>
                <div class="field">
                    <button type="button" @click="cancel">Cancel</button>
                    <button @click="change">Change</button>
                </div>
            </form>
            <form @submit.prevent="submit" v-if="editLabel">
                <div class="field">
                    <label for="lable">Label </label>
                    <input type="text" v-model="editLabel.label" name="label">
                </div>
                <div class="field">
                    <label for="color">Color</label>
                    <input type="text" v-model="editLabel.color" name="color">
                </div>
                <div class="example">
                    <p :style="{background: editLabel.color}" class="label">{{editLabel.label}}</p>
                </div>
                <div class="field">
                    <button type="button" @click="cancel">Cancel</button>
                    <button @click="change">Change</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'ColorLabels',
    data(){
        return{
            colorLabels: [],
            newLabel: null,
            color: null,
            user: firebase.auth().currentUser,
            addLabel: false,
            editLabel: null,
            nonEditedLabel: null
        }
    },
    methods:{
        submit(){
            if(this.newLabel && this.color){
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
                    .catch(err=>{
                        console.log(err)
                    })
            }
        },
        edit(label){
            if(this.addLabel){
                return
            }
            this.editLabel = Object.assign({},label)
            this.nonEditedLabel = label
        },
        add(){
            this.addLabel = !this.addLabel
        },
        change(){
            const updatedLabels = this.colorLabels.map(label=>{
                if(JSON.stringify(this.nonEditedLabel) === JSON.stringify(label)){
                    return this.editLabel
                }
                return label
            })
            db
                .collection('planner')
                .doc(this.user.uid)
                .update({
                    colorLabels: updatedLabels
                })
                .then(()=>{
                    this.colorLabels = updatedLabels
                })
        },
        cancel(){
            this.editLabel = null
            this.addLabel = false
            this.nonEditedLabel = null
        }
    },
    created(){
        db
            .collection('planner')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc=>{
                const data = doc.data()
                if(data.colorLabels){
                    this.colorLabels = data.colorLabels
                }   
            })
        
    }
}
</script>

<style>
#Color-Label{
    height: 500px;
}
#Color-Label p.label{
    display: inline-block;
    padding: 5px 15px;
    border-radius: 2px;
    margin: 5px auto;
}
#Color-Label p.label.active{
    border: solid 2px grey;
}
#Color-Label .example{
    display: flex;
    justify-content: center;
}
#Color-Label button{
    margin: auto;
    display: block;
    padding: 5px 15px;
}
#Color-Label .example{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
#Color-Label .label-container{
    height: 400px;
    width: 300px;
    /* display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: left; */
}
#Color-Label i{
    display: block;
    margin: auto;
    text-align: center;
    font-size: 2em;
}
#Color-Label .form-container{
    height: 100px;
}
</style>