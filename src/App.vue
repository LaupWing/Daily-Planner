<template>
  <div id="app">
    <CurrentTime/>
    <Nav/>
    <!-- <i class="far fa-calendar-plus"></i> -->
    <router-view
      :days="days"
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
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }
  },
  components:{
    CurrentTime,
    Nav
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
#app i.far.fa-calendar-plus{
  margin-left: auto;
  display: block;
  text-align: right;
  font-size: 2em;
  margin-bottom: .5em;
  cursor: pointer;
}
</style>
