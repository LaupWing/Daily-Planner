<template>
    <div    
        class="task"
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
        calculateBegin(begin){
            const findLi = Array.from(document.querySelectorAll('#Timeline li'))
                .find(li=>{
                    const liHours = li.textContent.split(':')[0]
                    const beginHours  = begin.split(':')[0] 
                    if(liHours===beginHours)    return li
                })
            console.log(findLi, findLi.offsetTop)
            return findLi.offsetTop
        }
    },
    mounted(){
        this.$el.style.top = this.calculateBegin(this.task.begin) +'px'
    }
}
</script>

<style>

</style>