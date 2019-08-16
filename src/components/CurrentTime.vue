<template>
    <div id="Current-Time">
        <h2 class="date">{{day}} {{month}} {{year}}</h2>
        <h2 class="time">{{hours}}:{{minutes}}</h2>
    </div>
</template>

<script>
export default {
    name: 'CurrentTime',
    data(){
        return{
            hours: null,
            minutes: null,
            day: null,
            month: null,
            year: null
        }
    },
    methods:{
        addZero(number){
            if(number<10) return '0'+number
            else          return number
        }
    },
    created(){
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        setInterval(()=>{
            const date = new Date()
            this.hours = this.addZero(date.getHours())
            this.minutes = this.addZero(date.getMinutes())
            this.day = this.addZero(date.getDay())
            this.month = monthNames[date.getMonth()]
            this.year = date.getFullYear()
        },1000)
    }
}
</script>

<style>
#Current-Time{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    text-align: center;
}    
</style>