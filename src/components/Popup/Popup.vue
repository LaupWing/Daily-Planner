<template>
    <div class="popup-container">
        <div 
            class="popup-disabler" 
            v-if="settings" 
            @click="$emit('turnOffPopup')"
        >
            <component 
                :is="componentId"
                :settings="settings"
                class="popup"
                v-on:cancel="$emit('turnOffPopup')"
                @click.stop.native
                v-on="$listeners"
            >
            </component>
        </div>
    </div>
</template>

<script>
import CustomContext from './CustomContext/CustomContext'
import EditLabelForm from './ColorForms/EditLabelForm'
import AddLabelForm from './ColorForms/AddLabelForm'
import SetTimeTask from './SetTimeTask/SetTimeTask'

export default {
    name:'Popup',
    props:['settings', 'componentId'],
    components:{
        'CustomContext':CustomContext,
        'EditLabelForm':EditLabelForm,
        'SetTimeTask':SetTimeTask
    },
}
</script>

<style scoped>
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
    animation: scaleUp forwards .5s;
}

@keyframes scaleUp {
    from{
        transform: scale(0);
    }
    to{
        transform: scale(1);
    }
}
</style>