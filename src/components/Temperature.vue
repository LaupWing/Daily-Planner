<template>
    <div id="Temperature">

    </div>
</template>

<script>

export default {
    name: 'Temperarture',
    props:['weatherData'],
    data(){
        return{
            temperature: null,
            summary: null,
            icon: null,
            timezone: null
        }
    },
    methods:{
        fromFahrenheitToCelcius(valNum){
            valNum = parseFloat(valNum)
            return (valNum-32) / 1.8
        },
        getIcons(){
            
        }
    },
    watch:{
        weatherData: function(){
            if(this.weatherData){
                this.temperature = Math.round(this.fromFahrenheitToCelcius(this.weatherData.currently.temperature))
                this.timezone = this.weatherData.timezone
                this.summary = this.weatherData.currently.summary
                this.getIcons()
            }
        }
    },
    mounted(){
    }
}
</script>

<style>

</style>