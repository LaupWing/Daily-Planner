<template>
    <div 
        class="label"
        :class="hoverClass" 
        :style='{background: label.color}'
        @contextmenu.prevent="openEditPopup"
        @click="checkTaskWithThisColor"
    >
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
         <!-- <EditLabelForm 
            v-if="nonEditedLabel === label"
            :colorLabels="colorLabels"
            :nonEditedLabel="nonEditedLabel"
            :editLabel="editLabel"
            :user="user"
            v-on:cancel="cancel"
        />  -->
    </div>
</template>

<script>
// import EditLabelForm from '@/components/Planner/ColorLabels/ColorForms/EditLabelForm'
export default {
    name: 'Label',
    props:['label' ,'taskColor', 'user', 'colorLabels', 'editLabel', 'nonEditedLabel', 'preventActions'],
    components:{
        
    },
    data(){
        return{
            nothingFound: false,
            taskIndicator: 0
        }
    },
    methods:{
        checkTaskWithThisColor(){
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
        openEditPopup(){
            this.$emit('openPopup', {
                data: this.label,
                type: 'label',
                coords:{
                    top: this.$el.getBoundingClientRect().top,
                    left: this.$el.getBoundingClientRect().left,
                    elHeight: this.$el.offsetHeight
                },
                elPrio2: '#Color-Label'
            })
        },
        cancel(){
            this.$emit('cancel')
        }
    },
    watch:{
        nonEditedLabel: function(newLabel, oldLabel){
            // console.log(newLabel, oldLabel, this.nonEditedLabel)
        }
    },
    computed:{
        checkTaskColor(){
            if(this.taskColor === null || this.taskColor === undefined){
                return
            }
            return {
                'show': this.label.color.toLowerCase() === this.taskColor.toLowerCase() && !this.nonEditedLabel && this.preventActions.type !== 'label'
            }
        },
        hoverClass(){
            if(this.preventActions.type !== 'label'){
                return 'hover'
            }else{
                return ''
            }
        }
    },
    created(){
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
  animation: bounce-in 1s ease-in;
}
.slide-width-leave-active {
  animation: bounce-in 1s reverse;
}
@keyframes bounce-in {
    from{
        max-width: 0px
    }
    to{
        max-width: 600px;
    }
}
</style>