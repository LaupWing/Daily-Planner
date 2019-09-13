<template>
    <div class="popup-disabler" v-if="settings" @click="togglePopup">
        <CustomContext
            :settings="settings"
            :userData="userData"
        />
    </div>
</template>

<script>
import CustomContext from '@/components/Popups/Tasks/CustomContext'
export default {
    name:'Popups',
    props:['settings', 'userData'],
    components:{
        CustomContext
    },
    methods:{
        togglePopup(){
            if(event.target.classList.length>0){
                if(event.target.classList[0]==='popup-disabler'){
                this.popup = null
                }
            }
        }
    }
}
</script>

<style>
.popup-disabler{
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
}
.popup{
  z-index: 10010;
}
</style>