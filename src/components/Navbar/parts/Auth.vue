<template>
    <nav class="auth">
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
    name: 'Auth',
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
nav.auth{
    /* position: fixed;
    top: 0;
    right: 10px; */
}    
nav.auth li{
    list-style: none;
    margin: 5px;
}
nav.auth a{
    color: black;
    text-decoration: none;
    cursor: pointer;
}
nav.auth ul{
    display: flex;
}
</style>