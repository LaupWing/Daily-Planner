<template>
    <nav>
        <ul>
            <li v-if="!user">
                <router-link :to="{name: 'Signup'}">Signup</router-link>
            </li>
            <li v-if="!user">
                <router-link :to="{name: 'Login'}">Login</router-link>
            </li>
            <li v-if="user">{{user.email}}</li>
            <li v-if="user">
                <a @click="logout">Logout</a>
            </li>
        </ul>
    </nav>
</template>    

<script>
import firebase from 'firebase'
export default {
    name: 'Nav',
    data(){
        return{
            user: null
        }
    },
    methods:{
        logout(){
            firebase
                .auth()
                .signOut()
                .then(()=>{
                    this.$router.push({name: 'Login'})
                })
        }
    },
    created(){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.user = user
            }else{
                this.user = null
            }
        })
    }
}
</script>

<style>
nav{
    position: fixed;
    top: 0;
    right: 10px;
}    
nav li{
    list-style: none;
    margin: 5px;
}
nav a{
    color: black;
    text-decoration: none;
    cursor: pointer;
}
nav ul{
    display: flex;
}
</style>