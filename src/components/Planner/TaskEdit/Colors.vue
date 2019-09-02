<template>
    <div class="colors-container">
        <div 
            class="color" 
            v-for="(color, index) in colors" 
            :key="index"
        >
            <input type="radio" name="label" :id="color.label+index" :checked="checkActive(color)">
            <label 
                :style="{background: color.color}" 
                :for="color.label+index"
            >
                {{color.label}}
            </label>    
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
    name: 'Edit-Color',
    props:['task'],
    data(){
        return{
            colors: null
        }
    },
    methods:{
        checkActive(color){
            if(JSON.stringify(color)== JSON.stringify(this.task.color)){
                return true
            }else{
                return false
            }
        }
    },
    created(){
        const user = firebase.auth().currentUser
        db
            .collection('planner')
            .doc(user.uid)
            .get()
            .then(doc=>{
                this.colors = doc.data().colorLabels
            })
    }   
}
</script>

<style>
.colors-container{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    max-height: 70%;
    overflow-y: auto;
    align-items: center;
}
.colors-container label{
    border: white solid 2px;
    padding: 5px 10px;
    display: inline-block;
    margin: 5px;    
    font-size: .8em;
    border-radius: 5px;
    transform-origin: center;
    transform: scale(.85);
}
.colors-container input[type="radio"]{
    display: none;
}
.colors-container input[type="radio"]:checked + label{
    transform: scale(1.1);
    color: white;
}
</style>