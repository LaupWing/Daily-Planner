<template>
    <div class="popup-container">
        <div class="popup-disabler" v-if="settings" @click="togglePopup">
        </div>
        <component :is="componentId"></component>
        <!-- <CustomContext
            class="popup"
            v-if="settings.type === 'task'"
            :settings="settings"
            :userData="userData"
        />
        <transition name="scalingLeftTopCorner">
            <EditLabelForm
                class="popup" 
                v-if="settings.type ===  'label'"
                :userData="userData"
                :settings="settings"
                :label="settings.data"
                v-on:cancel="cancel"
            /> 
        </transition>
        <AddLabelForm
            class="popup" 
            v-if="settings.type ===  'label-add'"
            :userData="userData"
            :settings="settings"
            v-on:cancel="cancel"
        /> -->
    </div>
</template>

<script>
import CustomContext from '@/components/Planner/Task/CustomContext'
import EditLabelForm from '@/components/Popups/Labels/EditLabelForm'
import AddLabelForm from '@/components/Popups/Labels/AddLabelForm'
import checkTask from '@/components/helpers/checkLocationTask'
export default {
    name:'Popups',
    props:['settings'],
    data(){
        return{
            userData: null,
            componentId: null
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
                    document.querySelectorAll(this.settings.elPrio2).forEach(item=>{
                        item.style.removeProperty('z-index')
                    })
                    this.$emit('togglePopup')
                }
            }
        },
        cancel(){
            this.$emit('togglePopup')
        }
    },
    created(){
        db.collection('planner')
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then(doc=>{
                this.userData = doc.data()
                this.$emit('setUserData', this.userData)
            })
    },
    mounted(){
        if(this.settings.elPrio2){
            document.querySelectorAll(this.settings.elPrio2).forEach(item=>{
                item.style.zIndex = '10000'
            })
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