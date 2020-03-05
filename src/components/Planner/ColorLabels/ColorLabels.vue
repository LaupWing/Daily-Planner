<template>
    <div id="Color-Label" :class="view" :style="changeMarginOnWeekView">
        <h2
            @mouseover="showAll(true)"
            @mouseout="showAll(false)"
        >Labels</h2>
        <div class="label-container">
            <Label 
                v-for="(label, index) in getUserData.colorLabels" 
                :key="index"
                :label='label'
                :colorLabels="colorLabels"
                :userData="userData"
                :taskColor='taskColor'
            />
            <i class="fas fa-plus-circle" @click="addColorLabel2"></i>
        </div>
        <Popup
            v-if="popupSettings"
            :settings="popupSettings"
            :componentId="'AddLabelForm'"
            :userData="userData"
            v-on:turnOffPopup="addColorLabel2(false)"
        />
    </div>
</template>

<script>
import Label from '@/components/Planner/ColorLabels/Labels/Label'
import Popup from '@/components/Popups/Popups'
import { mapGetters } from 'vuex'
export default {
    name: 'ColorLabels',
    props:['taskColor' ,'addTask', 'chosenColorLabel', 'userData', 'view'],
    components:{
        Label,
        Popup
    },
    data(){
        return{
            colorLabels: [],
            colorLabelToAdd: null,
            popupSettings:null
        }
    },
    computed:{
        ...mapGetters(['getUserData']),
        changeMarginOnWeekView(){
            if(this.view === 'week'){
                return {
                    marginTop: '-70px'
                }
            }
            return
        }
    },
    methods:{
        showAll(state){
            if(state){
                this.$el.querySelectorAll('.label-name').forEach(label=>{
                    label.classList.add('show-all')
                })
            }else{
                this.$el.querySelectorAll('.label-name').forEach(label=>{
                    label.classList.remove('show-all')
                })
            }
        },
        addColorLabel(label){
            this.colorLabelToAdd = label
        },
        addColorLabel2(state){
            if(state){
                this.popupSettings = {
                    type: 'label-add',
                    data: null,
                    coords:{
                        top: event.target.getBoundingClientRect().top,
                        left: event.target.getBoundingClientRect().left,
                        elHeight: event.target.offsetHeight
                    }
                }
            }else{
                this.popupSettings = null
            }
        },
    },
    created(){
        if(this.chosenColorLabel){
            this.colorLabelToAdd = this.chosenColorLabel
        }
    }
}
</script>

<style>
#Color-Label{
    transition: 1s;
}
#Color-Label.single{
    position: fixed;
    top: 50%;
    left: 20px;
}
#Color-Label h2{
    font-weight: normal;
    font-size: 1.2em;
    text-align: center;
}
#Color-Label > p.label{
    display: inline-block;
    padding: 5px 15px;
    border-radius: 2px;
    margin: 5px auto;
    border: black solid 2px;
    position: relative;
    cursor: pointer;
    transition: .5s;
    font-weight: bold;
}
#Color-Label p.label.active::before{
    content: '>';
    position: absolute;
    left: -15px;
    color: white;
}
#Color-Label .example{
    display: flex;
    justify-content: center;
}
#Color-Label button{
    margin: auto;
    display: block;
    width: 50%;
    border: none;
    background: transparent;
    border: solid 1px rgba(0,0,0,.6);
    color: rgba(0,0,0,.6);
    padding: 5px;
    border-radius: 0 20px 20px 0;
    outline: none;
    cursor: pointer;
}
#Color-Label button:first-of-type{
    border-right: none;
    border-radius: 20px 0 0 20px;
}
#Color-Label .label-container{
    display: flex;
    flex-direction: column;
    align-items: center;
}
#Color-Label i{
    display: block;
    margin: 10px auto;
    text-align: center;
    font-size: 1.5em;
    color: white;
    cursor: pointer;
    width: 100%;
}
#Color-Label .form-container{
    position: relative;
}

#Color-Label .field{
    display: flex;
    position: relative;
}

#Color-Label .buttons{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
}
#Color-Label .buttons button{
    width: 50%;
}
/* Week View */
#Color-Label.week{
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    left: auto;
}
#Color-Label.week .label-container{
    flex-direction: row;
}
#Color-Label.week .label-container i{
    width: auto;
}
</style>