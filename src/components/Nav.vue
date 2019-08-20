<template>
    <nav>
        <ul>
            <li>
                <router-link :to="{name: 'Signup'}">Signup</router-link>
            </li>
            <li>Login</li>
            <li>
                <a @click="logout">Logout</a>
            </li>
        </ul>
    </nav>
</template>    

<script>
import firebase from 'firebase'
export default {
    name: 'Nav',
    methods:{
        logout(){
            firebase
                .auth()
                .signOut()
                .then(()=>{
                    this.$router.push({name: 'Signup'})
                })
        }
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