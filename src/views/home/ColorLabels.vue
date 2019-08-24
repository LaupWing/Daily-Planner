<template>
    <div id="Color-Label">
        <p 
            v-for="(label, index) in colorLabels" 
            :key="index"
            :style="{color:label.color}"
        >
            {{label}}
        </p>
        <form @submit.prevent="submit">
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
            <button>Add</button>
        </form>
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
            color: null
        }
    },
    methods:{
        submit(){

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
#Color-Label p.label{
    display: inline-block;
    padding: 5px 15px;
    border-radius: 2px;
    margin: 5px auto;
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
</style>