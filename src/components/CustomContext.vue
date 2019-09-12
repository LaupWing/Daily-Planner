<template>
    <div 
        id="Custom-Context"
        class="popup"
        :style="setPosition"

    >
        <div class="notification">
            <h2>Notification</h2>
            <p class="switch" :class="{'active':checkSwitch('on')}"><i class="fas fa-check" v-if="checkSwitch('on')"></i>on</p>
            <p class="switch" :class="{'active':checkSwitch('off')}"><i class="fas fa-check" v-if="checkSwitch('off')"></i>off</p>
        </div>
        <div class="colors" v-if="userData.colorLabels">
            <div 
                class="color"
                v-for="(color, index) in userData.colorLabels"
                :key="index"
                :style="{background: color.color}" 
                :class="{'active':JSON.stringify(settings.data.color)===JSON.stringify(color)}"
            >
                <i class="fas fa-check"></i>
            </div>
        </div>
        <div class="delete">
            <i class="fas fa-trash-alt"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomContext',
    props:['settings', 'userData'],
    data(){
        return{
            switch: 'off'
        }
    },
    methods:{
        checkSwitch(state){
            if(state=== this.switch){
                return true
            }else{
                return false
            }
        }
    },
    computed:{
        setPosition(){
            return{
                top: `${this.settings.coords.y}px`,
                left: `${this.settings.coords.x}px`
            }
        }
    },
    created(){
        console.log(this.userData, this.settings)
    }   
}
</script>

<style>
#Custom-Context{
    position: fixed;
    background: white;
    width: 200px;
    z-index: 10000;
    box-shadow: 0px 0px 13px 0px rgba(0,0,0,0.48);
    border-radius: 5px;
    color: black;
    transform-origin: 0px 0px;
    transform: scale(0);
    animation: scaleUp forwards .5s;
}
@keyframes scaleUp {
    to{
        transform: scale(1);
    }
}
#Custom-Context h2{
    padding: 10px;
    color: black;
    font-size: .8em;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
}
#Custom-Context .notification{
    padding: 10px;
    border-bottom: solid rgba(0,0,0,.4) 1px;
}
#Custom-Context p.switch{
    color: rgba(0,0,0,.4);
    font-size: 1.2em;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding-left: 30%;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
}
#Custom-Context p.switch:hover{
    background: rgba(0,0,0,.1);
}
#Custom-Context p.switch i{
    position: absolute;
    left: 10%;
}
#Custom-Context p.switch.active{
    color: black;
}
#Custom-Context .colors{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 10px;
    border-bottom: solid rgba(0,0,0,.4) 1px;
}
#Custom-Context .colors .color{
    width: 25px;
    height: 25px;
    margin: 5px;
    border-radius: 50%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    transition: .25s;
    cursor: pointer;
}
#Custom-Context .colors .color.active::before,
#Custom-Context .colors .color:hover:before{
    content: '';
    width: 140%;
    height: 140%;
    background: rgba(0,0,0,.2);
    border-radius: 50%;
    position: absolute;
    z-index: -2;
}
#Custom-Context .colors .color i{
    position: absolute;
    opacity: 0;
    transition: .5s;
}

#Custom-Context .colors .color.color.active i{
    opacity: 1;
}
#Custom-Context .delete i{
    width: 100%;
    text-align: center;
    color: rgba(0,0,0,.4);
    padding: 10px;
    transition: .25s;
    cursor: pointer;
}
#Custom-Context .delete i:hover{
    background: rgba(0,0,0,.4);
    color: white;
}

</style>