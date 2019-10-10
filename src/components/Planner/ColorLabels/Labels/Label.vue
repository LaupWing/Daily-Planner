<template>
    <div 
        class="label"
        :class="hoverClass" 
        :style='{background: label.color}'
        @contextmenu.prevent="toggleEditPopup(true)"
        @click="checkTaskWithThisColor"
    >
        <Popup
            v-if="popupSettings"
            :settings="popupSettings"
            :componentId="'EditLabelForm'"
            :userData="userData"
            v-on:turnOffPopup="toggleEditPopup(false)"
        />
        <p 
            class="label-name" 
            :style="{background: label.color}"
            :class="checkTaskColor"
        >
            {{label.label}}
        </p>
        <transition name="slide-width">
            <div class="nothing-found" v-if="nothingFound" :style="{background: label.color}">
                <p>There are no tasks today associated with this label</p>
            </div>
        </transition>
    </div>
</template>

<script>
import Popup from '@/components/Popups/Popups'

export default {
    name: 'Label',
    props:['label' ,'taskColor', 'userData', 'colorLabels', 'editLabel', 'preventActions'],
    components:{
        Popup
    },  
    data(){
        return{
            nothingFound: false,
            taskIndicator: 0,
            popupSettings: null
        }
    },
    methods:{
        checkTaskWithThisColor(){
            if(this.popupSettings)  return
            const container = document.querySelector('#planner')
            const tasks = Array.from(container.querySelectorAll('.task'))
            const findTasks = tasks.filter(task=>{
                const taskName = task.style.background
                if(taskName.toLowerCase() === this.label.color.toLowerCase()){
                    return task
                }
            })
            .sort((a,b)=>{
                return a.offsetTop - b.offsetTop
            })
            if(findTasks.length>0){
                const taskOffsetTop = findTasks[this.taskIndicator].offsetTop
                const yVal = (taskOffsetTop - (container.offsetHeight/2))+ (findTasks[this.taskIndicator].offsetHeight/2) 
                container.scrollTo(0,yVal)
                if(this.taskIndicator < (findTasks.length-1)){
                    this.taskIndicator = this.taskIndicator + 1
                }else{
                    this.taskIndicator = 0
                }
            }else{
                this.nothingFound = true
                setTimeout(()=>{
                    this.nothingFound = false
                },3000)
            }
        },
        toggleEditPopup(state){
            if(state){
                this.popupSettings =  {
                    type: 'task',
                    data: this.label,
                    coords:{
                        top: this.$el.getBoundingClientRect().top,
                        left: this.$el.getBoundingClientRect().left,
                        elHeight: this.$el.offsetHeight
                    },
                    elPrio2: '#Tasks .task'
                }
            }else{
                // There has to be a timeout here otherwise it will trigger the click on color event
                setTimeout(()=>{
                    this.popupSettings = null
                },1)
            }
        },
        cancel(){
            this.$emit('cancel')
        }
    },
    computed:{
        checkTaskColor(){
            if(this.taskColor === null || this.taskColor === undefined){
                return
            }
            return {
                'show': this.label.color.toLowerCase() === this.taskColor.toLowerCase() && this.preventActions.type !== 'label'
            }
        },
        hoverClass(){
            if(!this.popupSettings){
                return 'hover'
            }else{
                return ''
            }
        }
    },
    mounted(){
        const colorLabels = document.querySelector('#Color-Label')
        colorLabels.style.top = colorLabels.offsetTop - (colorLabels.offsetHeight/2) + 'px'
    }
}
</script>
<style>
div.label{
    width: 30px;
    height: 30px;
    margin: 5px;
    border-radius: 50%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}
div.label p.label-name{
    user-select: none;
    position: absolute;
    left: 50%;
    max-width: 0px;
    transition: .5s;
    overflow: hidden;
    height: 100%;
    line-height: 30px;
    pointer-events: none;
}
div.label p.label-name.show,
div.label p.label-name.show-all,
div.label.hover:hover p.label-name{
    padding-left: 50px;
    padding-right: 10px;
    max-width: 300px;
    white-space: nowrap;
}
div.label .nothing-found{
    position: absolute;
    left: 50%;
    height: 100%;
    padding-right: 10px;
    z-index: 10000;
    overflow: hidden;
}
div.label .nothing-found p{
    white-space: nowrap;
    height: 100%;
    line-height: 30px;
    text-shadow: -3px -1px 9px rgba(0, 0, 0, 0.62);
}
.slide-width-enter-active {
  animation: slideWidth 1s ease-in;
}
.slide-width-leave-active {
  animation: slideWidth 1s reverse;
}
@keyframes slideWidth {
    from{
        max-width: 0px
    }
    to{
        max-width: 600px;
    }
}
</style>