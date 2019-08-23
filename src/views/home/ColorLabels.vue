<template>
    <div id="Color-Label">
        <p 
            v-for="(label, index) in colorLabels" 
            :key="index"
            :style="{color:label.color}"
        >
            {{label}}
        </p>
        <form action=" "></form>
        <div class="field">
            <input type="text" v-model="newLabel">
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
            newLabel: null
        }
    },
    methods:{

    },
    created(){
        db
            .collection('planner')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc=>{
                const data = doc.data()
                if(data.colorLabels){
                    this.colorLabels = colorLabels
                }   
            })
    }
}
</script>

<style>

</style>