<template>
    <form id="GoTo" @submit.prevent="goTo">
        <div class="addTask">
            <button type="button" @click="addTask">
                Add New Task
                <i class="far fa-calendar-plus"></i>
            </button>
        </div>    
        <h3>Go to</h3>
        <button type="button" @click="setupCurrentPos">Current Time</button>
        <div class="field">
            <div class="time">
                <div class="hours">
                    <input type="number" name="hours" min="00" max="23" value="00">
                </div>
                <div class="minutes">
                    <input type="number" name="minutes" min="00" max="59" value="00">
                </div>
            </div>
            <button>Go</button>
        </div>
    </form>
</template>

<script>
export default {
    name: 'GoTo',
    methods:{
        setupCurrentPos(){
            this.$emit('setupCurrentPos')
        },
        goTo(){
            const hours = this.$el.hours.value
            const minutes = this.$el.minutes.value
            const time = `${hours}:${minutes}`
            const correspondingTime = Array.from(document.querySelectorAll('#Timeline li')).find(li=>{
                if(li.dataset.time === time){
                    return li
                }
            })
            if(!correspondingTime){
                const correspondingLi = Array.from(document.querySelectorAll('#Timeline li'))
                    .filter(li=>{
                        if(Number(li.dataset.time.split(':')[0]) === Number(hours)){
                            return li
                        }
                    })
                    .reduce((prev,curr)=>{
                        const prevTime = Number(prev.dataset.time.split(':')[1])
                        const currTime = Number(curr.dataset.time.split(':')[1])
                        const goal = Number(minutes)
                        return (Math.abs( currTime - goal) < Math.abs(prevTime - goal) ? curr : prev);
                    })
                const diffrence = Number(minutes) - Number(correspondingLi.dataset.time.split(':')[1])
                const midpoint = (correspondingLi.offsetTop + (correspondingLi.offsetHeight/2)) - (document.querySelector('#planner').offsetHeight/2)
                const pxPerMinutes = correspondingLi.offsetHeight/30
                const scrollToPoint = midpoint + (diffrence*pxPerMinutes)
                this.$emit('goToSpecifikTime', scrollToPoint)
                // document.querySelector('#planner').scrollTo(0,scrollToPoint)
            }else{
                const midpoint = (correspondingTime.offsetTop + (correspondingTime.offsetHeight/2)) - (document.querySelector('#planner').offsetHeight/2)
                this.$emit('goToSpecifikTime', midpoint)
                // document.querySelector('#planner').scrollTo(0,midpoint)
            }
        },
        addTask(){
            this.$emit('addTask')
        }
    }
}
</script>

<style>
#GoTo{
    position: absolute;
    z-index: 10;
    display: flex;
    align-items: flex-end;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
}
#GoTo .addTask{
    margin-bottom: 20px;
    width: 100%;
    text-align: center;
}
#GoTo .addTask button{
    font-size: .6em;
    width: 60%;
    border-radius: 0 0 20px 20px;
    text-transform: uppercase;
    letter-spacing: 2px;
}
#GoTo button{
    border: none;
    border: solid white 2px;
    padding: 5px 15px;
    background: transparent;
    border-radius: 25px;
    color: white;
    cursor: pointer;
    transition: .25s;
}
#GoTo button:hover{
    background: white;
    color: black;
}
#GoTo > button,
#GoTo .field{
    margin: 0 20px;
}
#GoTo .field,
#GoTo .time{
    align-items: flex-end;
    display: flex;
}
#GoTo .time{
    margin-right: 5px;
}
#GoTo input[type='number']{
    font-size: 1.5em;
    width: 50px;
}
#GoTo .hours,
#GoTo .minutes{
    position: relative;
    margin-top: 15px; 
}
#GoTo .hours::before{
    content: 'H';
    position: absolute;
    top: -18px;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
}
#GoTo .minutes::before{
    content: 'M';
    position: absolute;
    top: -18px;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
}

</style>