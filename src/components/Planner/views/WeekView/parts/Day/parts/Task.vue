<template>
    <div    
        class="task"
        :data-begin="task.begin"
    >
        {{task.task}}
    </div>
</template>

<script>
export default {
    name: 'TaskInWeekView',
    props: ['task', 'index'],
    computed:{
        
    },
    data(){
        return{

        }
    },
    methods:{
        calculatePoint(begin){
            const findLi = Array.from(document.querySelectorAll('#Timeline li'))
                .find(li=>{
                    const liHours = li.textContent.split(':')[0]
                    const beginHours  = begin.split(':')[0] 
                    if(liHours===beginHours)    return li
                })
            const startingHour = findLi.offsetTop + (findLi.offsetHeight/2)
            const minutes =  (findLi.offsetHeight/30) * Number(begin.split(':')[1])
            return findLi.offsetTop + (findLi.offsetHeight/2) + minutes
        },
        calculateHeight(){
            return this.calculatePoint(this.task.end) - this.calculatePoint(this.task.begin)
        }
    },
    mounted(){
        this.$el.style.top = this.calculatePoint(this.task.begin) +'px'
        console.log(this.calculateHeight() + 'px', this.task.color.color)
        this.$el.style.height = this.calculateHeight() + 'px'
        this.$el.style.background = this.task.color.color
    }
}
</script>

<style>

</style>