<template>
    <div class="login">
        <form @submit.prevent="login">
            <h2>Login</h2>
            <div class="field">
                <label for="email">Email</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password">
            </div>
            <p v-if="feedback">{{feedback}}</p>
            <div class="field">
                <button>Submit</button>
            </div>
        </form>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'Login',
    data(){
        return{
            email: null,
            password: null,
            feedback: null
        }
    },
    methods:{
        login(){
            if(this.email && this.password){
                firebase
                    .auth()
                    .signInWithEmailAndPassword(this.email, this.password)
                    .then(()=>{
                        this.$router.push({name:'Home'})
                    })
                    .catch(err=>{
                        this.feedback = err.message
                    })
                this.feedback = null
            } else {
                this.feedback = 'Please fill in both field!'
            }
        }
    }
}
</script>

<style>

</style>