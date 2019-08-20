<template>
    <div id="Tasks"> 
        <div 
            class="task"
            v-for="(task, index) in tasks"
            :key="index"
            :style="styleObj"
            :data-begin="task.begin"
            :data-end="task.end"
        >
            {{task.task}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Tasks',
    data(){
        return{
            tasks:[
                // {
                //     task:'Cleaning Room',
                //     begin: '02:00',
                //     end: '02:30'
                // },
                {
                    task:'Cleaning Room',
                    begin: '01:40',
                    end: '02:00'
                },
                {
                    task:'Cleaning Room',
                    begin: '16:15',
                    end: '19:59'
                },
                {
                    task:'Cleaning Room',
                    begin: '12:15',
                    end: '14:30'
                }
            ],
            currentTask: null
        }
    },
    methods:{
        checkCurrentTask(){
            setTimeout(()=>{
                this.taskWatcher()
            },1000)
            setInterval(()=>{
                this.taskWatcher()
            },60000)
        },
        taskWatcher(){
            const findTask = this.tasks.find((task)=>{
                const begin = this.converDateToMS(task.begin)
                const end = this.converDateToMS(task.end)
                const currentTimeInMS = this.converDateToMS()
                if(begin<=currentTimeInMS && end>=currentTimeInMS){
                    return task
                }

            })
            if(findTask){
                this.changeTimeSize(findTask)
                this.currentTask = findTask
            }else{
                this.currentTask = 'No Tasks Right now!'
            }

        },
        changeTimeSize(task){
            const quarterInMs = 900000
            const allLi = Array.from(document.querySelectorAll('li'))
            const taskBegin = this.converDateToMS(task.begin)
            const taskEnd = this.converDateToMS(task.end)
            let beginLi = null
            let endLi = null
            
            allLi.forEach((li,index)=>{
                const time = this.converDateToMS(li.dataset.time)
                const timeToCompareMax = time+quarterInMs
                const timeToCompareMin = time-quarterInMs
                if(timeToCompareMin<=taskBegin && timeToCompareMax>=taskBegin){
                    beginLi = index
                }
                if(timeToCompareMin<=taskEnd && timeToCompareMax>=taskEnd){
                    endLi = index
                }
            })
            
            const highlight = allLi.filter((li,index)=>{
                if(index>=beginLi && index <= endLi){
                    return li
                }
            })

            if(highlight[0].classList.contains('highlight')){
                return
            }
            else{
                highlight.forEach(li=>{
                    li.classList.add('highlight', 'opacity')
                })
            }
        },
        converDateToMS(time){
            const date = new Date()
            const day = date.getDate()
            const month = date.getMonth()+1
            const year = date.getFullYear()
            if(time){
                const dateToConvert = new Date(`${month}/${day}/${year} ${time}:00`)
                const milliseconds = dateToConvert.getTime()
                return milliseconds
            }
            return date.getTime()
        },
        taskHeightAndPosition(){
            const allTasks = this.$el.querySelectorAll('.task')
            allTasks.forEach(task=>{
                const startingPoint = this.calculatePoint(task.dataset.begin)
                task.style.top = `${startingPoint}px`

                const height = this.calculatePoint(task.dataset.end) - startingPoint
                task.style.height = `${height}px`
            })
        },
        calculatePoint(state){
            const allLi = Array.from(document.querySelectorAll('#Timeline li'))
            const li = allLi
                .find(li=>{
                    const liHour = li.dataset.time.split(':')[0]
                    const taskHour = state.split(':')[0]
                    if(liHour===taskHour){
                        return li
                    }
                })
            const calcMinutes = ((li.offsetHeight*2)/60)*state.split(':')[1]
            const point = li.offsetTop + (li.offsetHeight/2) + calcMinutes
            return point
        }
    },
    computed:{
        styleObj:function(){
            return {
                background: 'orange'
            }
        }
    },
    mounted(){
        this.taskHeightAndPosition()
        this.checkCurrentTask()
    }
}
</script>

<style>
#Tasks{
    width: 100%;
    position: relative;
}

.task{
    position: absolute;
}
</style>