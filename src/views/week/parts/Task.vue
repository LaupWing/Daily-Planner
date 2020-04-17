<template>
    <div    
        class="task"
        :data-begin="task.begin"
        :data-end="task.end"
        @mousemove="handleMouserover"
        @mouseout="tooltip = null"
    >
        <p>{{task.task}}</p>
        <Tooltip
            v-if="tooltip"
            :settings="tooltip"
            :task="task"
        />
    </div>
</template>

<script>
import Tooltip from './Tooltip'
export default {
    name: 'Task',
    props: ['task', 'index'],
    components:{
        Tooltip
    },
    computed:{
        
    },
    data(){
        return{
            tooltip: null
        }
    },
    methods:{
        handleMouserover(){
            this.tooltip ={
                top: event.clientY,
                left: event.clientX
            }
        },
        calculatePoint(begin){
            const findLi = Array.from(document.querySelectorAll('#Timeline li'))
                .find(li=>{
                    const liHours = li.textContent.split(':')[0]
                    const beginHours  = begin.split(':')[0] 
                    if(liHours===beginHours)    return li
                })
            console.log(findLi)
            const startingHour = findLi.offsetTop + (findLi.offsetHeight/2)
            const minutes =  (findLi.offsetHeight/30) * Number(begin.split(':')[1])
            return findLi.offsetTop + (findLi.offsetHeight/2) + minutes
        },
        calculateHeight(){
            return this.calculatePoint(this.task.end) - this.calculatePoint(this.task.begin)
        }
    },
    mounted(){
        console.log(this.task)
        this.$el.style.top = this.calculatePoint(this.task.begin) +'px'
        this.$el.style.height = this.calculateHeight() + 'px'
        this.$el.style.background = this.task.color.color
    }
}
</script>

<style>
#Week-View #Week .day .task{
    position: absolute;
    font-size: 10px;
    width: 100%;
    border-radius: 5px;
    border: solid 1px white;
}
#Week-View #Week .day .task p{
    pointer-events: none;
}
</style>