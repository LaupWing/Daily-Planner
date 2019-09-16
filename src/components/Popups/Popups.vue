<template>
    <div class="popup-container">
        <div class="popup-disabler" v-if="settings" @click="togglePopup">
        </div>
        <CustomContext
            class="popup"
            v-if="settings.type === 'task'"
            :settings="settings"
            :userData="userData"
        />
        <EditLabelForm
            class="popup" 
            v-if="settings.type ===  'label'"
            :userData="userData"
            :settings="settings"
            :label="settings.data"
        /> 
    </div>
</template>

<script>
import CustomContext from '@/components/Popups/Tasks/CustomContext'
import EditLabelForm from '@/components/Popups/Labels/EditLabelForm'
import AddLabelForm from '@/components/Popups/Labels/AddLabelForm'
export default {
    name:'Popups',
    props:['settings', 'userData'],
    data(){
        return{
            
        }
    },
    components:{
        CustomContext,
        EditLabelForm,
        AddLabelForm
    },
    methods:{
        togglePopup(){
            if(event.target.classList.length>0){
                if(event.target.classList[0]==='popup-disabler'){
                    document.querySelectorAll(this.settings.elPrio2).forEach(item=>{
                        item.style.removeProperty('z-index')
                    })
                    this.$emit('togglePopup')
                }
            }
        }
    },
    mounted(){
        if(this.settings.elPrio2){
            document.querySelectorAll(this.settings.elPrio2).forEach(item=>{
                item.style.zIndex = '10000'
            })
        }
    }
}
</script>

<style>
.popup-disabler{
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
}
.popup{
  z-index: 100000;
}
</style>