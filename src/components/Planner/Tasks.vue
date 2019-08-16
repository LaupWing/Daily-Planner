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
                    end: '14:59'
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
                    const time = this.splitTime(task)
                    this.converDateToMS(task.begin.split(':')[0], task.begin.split(':')[1])
                    if(time.taskHourBegin===hours && time.taskHourEnd >= hours){
                        if(time.taskMinuteBegin<=minutes){
                            if(time.taskHourEnd>hours){
                                return task
                            }
                            else if(time.taskMinuteEnd >= minutes){
                                return task
                            }
                            
                        }
                    }
                })
                console.log(findTask)
                if(findTask){
                    const time = this.splitTime(findTask)
                    this.changeTimeSize(time)
                    this.currentTask = findTask
                }else{
                    this.currentTask = 'No Tasks Right now!'
                }
            },5000)
        },
        splitTime(task){
            const taskTimeBegin = task.begin.split(':')
            const taskHourBegin = Number(taskTimeBegin[0])
            const taskMinuteBegin = Number(taskTimeBegin[1]) 

            const taskTimeEnd = task.end.split(':')
            const taskHourEnd = Number(taskTimeEnd[0])
            const taskMinuteEnd = Number(taskTimeEnd[1])

            return {
                taskHourBegin,
                taskMinuteBegin,
                taskHourEnd,
                taskMinuteEnd
            }
        },
        changeTimeSize(time){
            const allLi = document.querySelectorAll('li').forEach(li=>{
                console.log(li[date-time])
                const hour = Number(li.textContent.split(':')[0]) 
                console.log(hour, time.taskHourBegin)
                if(hour === time.taskHourBegin && task.taskMinuteBegin < 15){
                    console.log(li)
                }
            })
        },
        converDateToMS(hours, minutes){
            const date = new Date()
            const day = date.getDay()
            const month = date.getMonth()
            const year = date.getFullYear()

            console.log(`${month}/${day}/${year} ${hours}:${minutes}:00`)
            const dateToConvert = new Date(`${month}/${day}/${year} ${hours}:${minutes}:00`)
            const milliseconds = dateToConvert.getTime()
            console.log(milliseconds)
            // var date = new Date("11/21/1987 16:00:00"); // some mock date
            // var milliseconds = date.getTime(); 
            // // This will return you the number of milliseconds
            // // elapsed from January 1, 1970 
            // // if your date is less than that date, the value will be negative
            console.log(day,month,year)
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