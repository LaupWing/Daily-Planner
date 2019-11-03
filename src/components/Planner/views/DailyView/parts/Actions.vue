<template>
    <div class="actions" :style="{marginTop : marginTop}">
        <i class="fas fa-arrow-circle-up" @click="goToTask('up')"></i>
        <i class="far fa-circle" @click="goToTask('current')"></i>
        <i class="fas fa-arrow-circle-down" @click="goToTask('down')"></i>
    </div>
</template>

<script>
export default {
    name: 'Actions',
    props:['visibleTask'],
    data(){
        return{
            marginTop: 0,
        }
    },
    methods:{
        goToTask(direction){
            const tasks = Array
                .from(document.querySelectorAll('#Tasks .task'))
                .sort((a,b)=>a.offsetTop - b.offsetTop)
            
            const container = document.querySelector('#planner')
            let scrollTo = null
            if(this.visibleTask){
                const index = tasks.indexOf(this.visibleTask)
                if(direction=== 'up'){
                    const dest = index === 0 ? (tasks.length-1) : (index-1) 
                    scrollTo = Number((tasks[dest].offsetTop + (tasks[dest].offsetHeight/2)))
                }
                else if(direction === 'current'){
                    scrollTo = tasks[index].offsetTop + (tasks[index].offsetHeight/2)
                }
                else if(direction === 'down'){
                    const dest = index === (tasks.length-1) ? 0 : (index+1)
                    scrollTo = (tasks[dest].offsetTop + (tasks[dest].offsetHeight/2))
                }
            }else{
                const currentScroll = container.scrollTop + (container.offsetHeight/2)
                if(direction=== 'up'){
                    const filterBelow = tasks
                        .filter(task=> task.offsetTop < currentScroll)
                    if(filterBelow.length>0){
                        const closest = filterBelow.reduce((prev, curr)=> {
                            return (Math.abs(curr.offsetTop - currentScroll) < Math.abs(prev.offsetTop - currentScroll) ? curr : prev);
                        });
                        scrollTo = closest.offsetTop + (closest.offsetHeight/2)
                    }
                    else{
                        scrollTo = tasks[tasks.length-1].offsetTop + (tasks[tasks.length-1].offsetHeight/2)
                    }
                }
                else if(direction === 'current'){
                    return
                }
                else if(direction === 'down'){
                    const filterUp = tasks
                        .filter(task=> task.offsetTop > currentScroll)
                    if(filterUp.length>0){
                        const closest = filterUp.reduce((prev, curr)=> {
                            return (Math.abs(curr.offsetTop - currentScroll) < Math.abs(prev.offsetTop - currentScroll) ? curr : prev);
                        });
                        scrollTo = closest.offsetTop + (closest.offsetHeight/2)
                    }else{
                        scrollTo = tasks[0].offsetTop + (tasks[0].offsetHeight/2)
                    }
                }
            }
            container.scrollTo(0,scrollTo - (container.offsetHeight/2))
        }
    },
    mounted(){
        this.marginTop =  (document.querySelector('#planner').offsetHeight/2) - (this.$el.offsetHeight/2) +'px'
    }
}
</script>

<style>
.actions{
    position:fixed;
    display: flex;
    flex-direction: column;
}
.actions i{
    margin: 10px 0;
    font-size: 2em;
    opacity: .4;
    transition: .25s;
    cursor: pointer;
}
.actions i:hover{
    opacity: 1;
}
</style>