<template>
    <form id="GoTo" @submit.prevent="goTo"> 
        <!-- <div class="addTask">
            <button type="button" @click="addTask">
                Add New Task
                <i class="far fa-calendar-plus"></i>
            </button>
        </div>     -->
        <!-- <h3>Go to</h3> -->
        <button type="button" @click="setupCurrentPos">Current Time</button>
        <div class="field">
            <div class="time">
                <div class="hours">
                    <input type="number" name="hours" min="00" max="23" value="00">
                </div>
                <span>:</span>
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
        active(active){
            if(active){
                this.$el.classList.add('active')
            }else{
                this.$el.classList.remove('active')
            }
        }
    },
    mounted(){
        this.$el.style.marginTop = document.querySelector('#planner').offsetHeight+'px'
    }
}
</script>

<style>
#GoTo{
    position: fixed;
    left: 0;
    z-index: 10;
    display: flex;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    transition: .25s;
    opacity: .35;
}
#GoTo:hover{
    opacity: 1;
}
#GoTo.active{
    opacity: 1;
}

#GoTo button{
    border: none;
    border: solid white 2px;
    padding: 5px 15px;
    background: transparent;
    border-radius: 0 0 20px 20px;
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
    display: flex;
}
#GoTo .time{
    border: white solid 2px;
    padding-left: 20px;
    border-radius: 0 0 0 20px;
}
#GoTo .time span{
    font-size: 1.2em;
    font-weight: bold;
    margin: 0 10px 0 -5px;
}
#GoTo .field button{
    border-left: none;
    border-radius: 0 0 20px 0;
}
#GoTo input[type='number']{
    font-size: 1.5em;
    width: 50px;
    background: none;
    color: white;
    border: none;
}
#GoTo .hours,
#GoTo .minutes{
    position: relative;
}
</style>