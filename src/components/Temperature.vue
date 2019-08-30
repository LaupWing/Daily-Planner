<template>
    <div id="Temperature" @click="check">
        {{temperature}}
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
        getIcon(){
            // const skycon = new Skycons
        }
    },
    watch:{
        weatherData: function(){
            if(this.weatherData){
                this.temperature = Math.round(this.fromFahrenheitToCelcius(this.weatherData.currently.temperature))
                this.timezone = this.weatherData.timezone
                this.summary = this.weatherData.currently.summary
                this.icon = this.weatherData.currently.icon
                this.getIcon()
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
</style>