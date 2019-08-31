<template>
    <div id="Temperature" @click="check">
        <div class="celcius">
            <canvas id="icon" width="80px" height="80px"></canvas>
            <h2>{{temperature}} &deg</h2>
        </div>
        
        {{summary}}
    </div>
</template>

<script>
import Skycons from '@/components/helpers/skycons'
export default {
    name: 'Temperarture',
    props:['weatherData'],
    data(){
        return{
            temperature:  null,
            summary:  null,
            icon:  null,
            timezone:  null
        }
    },
    methods:{
        fromFahrenheitToCelcius(valNum){
            valNum = parseFloat(valNum)
            return (valNum-32) / 1.8
        },
        check(){
            console.log(this.icon)
        },
        setIcon(icon, iconId){
            const skycon = new Skycons({'color': 'white'})
            const currentIcon = icon.replace(/-/g,'_').toUpperCase()
            skycon.play()
            return skycon.set(iconId, Skycons[currentIcon])
        }
    },
    watch:{
        weatherData: function(){
            if(this.weatherData){
                this.temperature = Math.round(this.fromFahrenheitToCelcius(this.weatherData.currently.temperature))
                this.timezone = this.weatherData.timezone
                this.summary = this.weatherData.currently.summary
                this.icon = this.weatherData.currently.icon
                this.setIcon(this.icon, this.$el.querySelector('#icon'))
            }
        }
    }
}
</script>

<style>
#Temperature{
    position: fixed;
    top: 10px;
    left: 10px;
}
#Temperature .celcius{
    display: flex;
    justify-content: flex-start;
}
#Temperature h2{
    font-size: 3.5em;
    font-weight: normal;
}
</style>