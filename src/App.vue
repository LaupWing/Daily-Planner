<template>
  <div id="app">
    <CurrentTime/>
    <router-view/>
  </div>
</template>

<script>
import CurrentTime from '@/components/CurrentTime.vue'
export default {
  name: 'App',
  components:{
    CurrentTime
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
