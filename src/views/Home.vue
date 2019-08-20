<template>
  <div class="home">
    <Planner/>
  </div>
</template>

<script>
import Planner from '@/components/Planner.vue'
import firebase from 'firebase'
export default {
  name: 'home',
  components: {
    Planner
  },
  mounted(){
    console.log(firebase.auth().currentUser)
  }
}
</script>

<style>
  
</style>