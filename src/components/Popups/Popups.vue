<template>
    <div class="popup-disabler" v-if="settings" @click="togglePopup">
        <CustomContext
            class="popup"
            v-if="settings.type === 'task'"
            :settings="settings"
            :userData="userData"
        />
        <EditLabelForm
            class="popup" 
            v-if="settings.type ===  'colorlabelEdit'"
            :userData="userData"
            :settings="settings"
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
    mounted(){
        if(this.settings.elPrio2){
            document.querySelector(this.settings.elPrio2).style.zIndex = 'var(--priority-2)'
        }
    }
}
</script>

<style>
.popup-disabler{
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: var(--priority-3);
  top: 0;
  left: 0;
}
.popup{
  z-index: var(--priority-1);
}
</style>