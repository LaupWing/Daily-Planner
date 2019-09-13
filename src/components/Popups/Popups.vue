<template>
    <div class="popup-disabler" v-if="settings" @click="togglePopup">
        <CustomContext
            v-if="settings.type === 'task'"
            :settings="settings"
            :userData="userData"
        />
        <EditLabelForm 
            v-if="settings.type ===  'colorlabelEdit'"
            :userData="userData"
            :label="settings.data"
        /> 
    </div>
</template>

<script>
import CustomContext from '@/components/Popups/Tasks/CustomContext'
import EditLabelForm from '@/components/Popups/Labels/EditLabelForm'
export default {
    name:'Popups',
    props:['settings', 'userData'],
    data(){
        return{
            
        }
    },
    components:{
        CustomContext,
        EditLabelForm
    },
    methods:{
        togglePopup(){
            if(event.target.classList.length>0){
                if(event.target.classList[0]==='popup-disabler'){
                    this.$emit('togglePopup')
                }
            }
        }
    },
    created(){
        console.log(this.settings, this.userData)
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