<template>
    <div class="popup-container">
        <div 
            class="popup-disabler" 
            v-if="settings" 
            @click="togglePopup"
        >
        </div>
        <component 
            :is="componentId"
            :settings="settings"
            class="popup"
            v-on:cancel="cancel"
        ></component>
    </div>
</template>

<script>
import CustomContext from './CustomContext/CustomContext'
import EditLabelForm from './ColorForms/EditLabelForm'
import AddLabelForm from './ColorForms/AddLabelForm'

export default {
    name:'Popups',
    props:['settings', 'componentId'],
    data(){
        return{

        }
    },
    components:{
        'CustomContext':CustomContext,
        'EditLabelForm':EditLabelForm,
        'AddLabelForm':AddLabelForm
    },
    methods:{
        togglePopup(){
            if(event.target.classList.length>0){
                if(event.target.classList[0]==='popup-disabler'){
                    this.$emit('turnOffPopup')
                }
            }
        },
        cancel(){
            this.$emit('turnOffPopup')
        }
    },
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
.scalingLeftTopCorner-enter-active{
    animation: scalingLeftTopCorner forwards 1s;
}
.scalingLeftTopCorner-leave-active{
    animation: scalingLeftTopCorner reverse 1s;
}

@keyframes scalingLeftTopCorner {
    from{
        transform-origin: top left;
        transform: scale(0);
    }
    from{
        transform-origin: top left;
        transform: scale(1);
    }
}
</style>