<template>
    <div id="Temperature">
        <div class="celcius">
            <canvas id="icon" width="50px" height="50px"></canvas>
            <h2>{{temperature}} &deg;</h2>
        </div>
        <div class="more">
            <p class="summary">{{summary}}</p>
            <p class="timezone">{{timezone}}</p>
        </div>
        
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
        setIcon(icon, iconId){
            const skycon = new Skycons({'color': 'black'})
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
    padding: 5px 10px;
    color: black;
    display: flex;
    align-items: center;
}
#Temperature .celcius{
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
#Temperature h2{
    font-size: 2em;
    white-space: nowrap;
    font-weight: normal;
}
#Temperature .summary{
    width: 100%;
    text-align: center;
}
#Temperature .timezone{
    width: 100%;
    font-size: .8em;
    text-align: center;
    opacity: .6;
}
</style>