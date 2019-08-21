<template>
  <div id="app">
    <CurrentTime
      :currentTask='currentTask'
    />
    <Nav/>
    <!-- <i class="far fa-calendar-plus"></i> -->
    <router-view
      v-on:setTask='setTask'
    />
  </div>
</template>

<script>
import CurrentTime from '@/components/CurrentTime.vue'
import Nav from '@/components/Nav.vue'
export default {
  name: 'App',
  data(){
    return{
      currentTask: null
    }
  },
  components:{
    CurrentTime,
    Nav
  },
  methods:{
    setTask(task){
      this.currentTask = task
    }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
body{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
