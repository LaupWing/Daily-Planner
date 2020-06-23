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
    data(){
        return{
            temperature:  null,
            summary:  null,
            icon:  null,
            timezone:  null,
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
        },
        getWeather(){
            const {lat, lng} = this.$store.getters.geolocation
            const proxy = "https://cors-anywhere.herokuapp.com/"
            const api = `${proxy}https://api.darksky.net/forecast/0bfee81d0d48f12651dd1fc9ef560f04/${lat},${lng}`
            fetch(api)
                .then(res=>{
                    return res.json()
                })
                .then(data=>{
                    this.setBackground(data.currently.summary)
                    this.temperature = Math.round(this.fromFahrenheitToCelcius(data.currently.temperature))
                    this.timezone = data.timezone
                    this.summary = data.currently.summary
                    this.icon = data.currently.icon
                    this.setIcon(this.icon, this.$el.querySelector('#icon'))
                })
        },
        setBackground(summary){
            // document.querySelector('body').style.background = 'orange'
            document.querySelector('body').style.setProperty('--weather-background', `url(https://source.unsplash.com/random/?${summary} weather)`)
            // For some reaseon the css var doesnt work
            fetch(`https://source.unsplash.com/random/?${summary} weather`)
                .then(data=>{
                    document.querySelector('body').style.background = `linear-gradient(0deg,rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url(${data.url})`
                    document.querySelector('body').style.backgroundSize = 'cover'
                })
        },
    },
    created(){
        this.getWeather()
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