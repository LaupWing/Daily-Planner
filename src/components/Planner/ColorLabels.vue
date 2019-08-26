<template>
    <div id="Color-Label">
        <h2>Color Labels</h2>
        <div class="label-container">
            <Label 
                v-for="(label, index) in colorLabels" 
                :key="index"
                :label='label'
                :taskColor='taskColor'
                class="label"
                :class="{'active':nonEditedLabel === label}"
                v-on:edit='edit'
            />
        </div>
        <div class="form-container">
            <i v-if="!addLabel && !editLabel"  class="fas fa-plus-circle" @click="toggleAdd"></i>
            <form @submit.prevent="submit" v-if="addLabel">
                <div class="field">
                    <input type="text" v-model="newLabel" name="label" placeholder="label" required>
                </div>
                <div class="field">
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
                    <input type="text" v-model="editLabel.label" name="label" required>
                </div>
                <div class="field">
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
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import Label from '@/components/Planner/ColorLabels/Label'
export default {
    name: 'ColorLabels',
    props:['taskColor'],
    components:{
        Label
    },
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
                    .then(()=>{
                        this.cancel()
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
        toggleAdd(){
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
                    this.cancel()
                })
        },
        cancel(){
            this.editLabel = null
            this.addLabel = false
            this.nonEditedLabel = null
            this.color = null
            this.newLabel = null
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
    position: fixed;
    top: 10px;
    left: 20px;
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
    border: black solid 1px;
    position: relative;
    cursor: pointer;
    transition: .5s;
}
#Color-Label p.label.active::before{
    content: '>';
    position: absolute;
    left: -15px;
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
    border: solid 1px rgba(0, 0, 0, .3);
    color: rgba(0, 0, 0, .7);
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
    margin: auto;
    text-align: center;
    font-size: 1.5em;
    color: rgba(0, 0, 0, .3);
    cursor: pointer;
}
#Color-Label .form-container{
    height: 100px;
}
#Color-Label form input[type='text']{
    width: 140px;
    border: none;
    padding: 5px;
    padding-left: 0;
    border-bottom: rgba(0, 0, 0, .3) solid 1px;
    outline: none;
}
/* #Color-Label form button{
    width: 70px;
    text-align: center;
} */
#Color-Label .field{
    display: flex;
}
</style>