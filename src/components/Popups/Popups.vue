<template>
    <div class="popup-container">
        <div class="popup-disabler" v-if="settings" @click="togglePopup">
        </div>
        <component 
            :is="componentId"
            :settings="settings"
            :userData="userData"
            class="popup"
            v-on:cancel="cancel"
        ></component>
    </div>
</template>

<script>
import CustomContext from '@/views/daily/views/DailyView/parts/Tasks/CustomContext'
import EditLabelForm from '@/views/daily/ColorLabels/ColorForms/EditLabelForm'
import AddLabelForm from '@/views/daily/ColorLabels/ColorForms/AddLabelForm'
import checkTask from '@/components/helpers/checkLocationTask'
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name:'Popups',
    props:['settings', 'componentId', 'userData'],
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
            // console.log('test', event.target.classList)
            if(event.target.classList.length>0){
                if(event.target.classList[0]==='popup-disabler'){
                    // console.log('emitting')
                    this.$emit('turnOffPopup')
                }
            }
        },
        cancel(){
            this.$emit('turnOffPopup')
        }
    },
    mounted(){
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