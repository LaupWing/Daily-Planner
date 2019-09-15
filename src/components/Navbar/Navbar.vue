<template>
    <div id="NavBar">
        <div class="left-panel">
            <Temperature
                :weatherData="weatherData"
            />
        </div>
        <CurrentTime
            :currentTask="currentTask"
        />
        <div class="right-panel">
            <Auth/>
        </div>
    </div>
</template>

<script>
import Temperature from '@/components/Navbar/parts/Temperature'
import Auth from '@/components/Navbar/parts/Auth'
import CurrentTime from '@/components/Navbar/parts/CurrentTime'
export default {
    name: 'NavBar',
    props:['weatherData', 'currentTask'],
    components:{
        Temperature,
        Auth,
        CurrentTime
    }
}
</script>

<style>
#NavBar{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    background: white;
    border-bottom: 1px rgba(0,0,0,.4) solid;
}
#NavBar .left-panel{
    position: absolute;
    top: 0;
    left: 0;
}
#NavBar .right-panel{
    position: absolute;
    top: 0;
    right: 0;
}
</style>