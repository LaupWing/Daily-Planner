<template>
    <div id="Tasks"> 
        
    </div>
</template>

<script>
export default {
    name: 'Tasks',
    data(){
        return{
            tasks:[
                {
                    task:'Cleaning Room',
                    begin: '02:00',
                    end: '02:30'
                },
                {
                    task:'Cleaning Room',
                    begin: '01:50',
                    end: '02:00'
                },
                {
                    task:'Cleaning Room',
                    begin: '13:15',
                    end: '16:59'
                }
            ],
            currentTask: null
        }
    },
    methods:{
        checkCurrentTask(){
            setInterval(()=>{
                // Ik kan ook de tijd vertalen naar secondes en dan vergelijken
                const date = new Date()
                const hours = Number(date.getHours())
                const minutes = Number(date.getMinutes())
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
            },5000)
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
                    li.classList.add('highlight')
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
        }
    },
    mounted(){
        this.checkCurrentTask()
    }
}
</script>

<style>
#Tasks{
    width: 100%;
}
</style>