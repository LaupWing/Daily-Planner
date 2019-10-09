<template>
    <div 
        id="Custom-Context"
        :style="setPosition"
    >
        <div class="title">
            <h2>{{settings.data.task}}</h2>
        </div>
        <div class="notification">
            <h2>Notification</h2>
            <p class="switch" :class="{'active':checkSwitch('on')}"><i class="fas fa-check" v-if="checkSwitch('on')"></i>on</p>
            <p class="switch" :class="{'active':checkSwitch('off')}"><i class="fas fa-check" v-if="checkSwitch('off')"></i>off</p>
            <i class="fas fa-caret-right"></i>
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
                <p class="label-name">{{color.label}}</p>
            </div>
        </div>
        <div class="delete">
            <i class="fas fa-trash-alt"></i>
        </div>
        <div class="done">
            <input type="checkbox" name="" id="done">
            <label for="done">Done <i class="fas fa-check"></i></label>
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
    }  
}
</script>

<style>
#Custom-Context{
    position: fixed;
    background: white;
    width: 200px;
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
#Custom-Context i.close{
    position: absolute;
    right: -18px;
    top: -18px;
    font-size: 25px;
    color: white;
    cursor: pointer;
}
#Custom-Context h2{
    padding: 10px;
    color: black;
    font-size: .8em;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
}
#Custom-Context .notification,
#Custom-Context .title{
    padding: 10px;
    border-bottom: solid rgba(0,0,0,.4) 1px;
    padding-top: 0;
    position: relative;
}
#Custom-Context .notification i.fa-caret-right{
    position: absolute;
    padding: 3px;
    cursor: pointer;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    bottom: 0;
}
#Custom-Context .notification i.fa-caret-right:hover{
    background: rgba(0,0,0,.2);
}
#Custom-Context .title{
    padding: 5px;
}
#Custom-Context .title h2{
    opacity: .5;
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
#Custom-Context .colors .color:hover .label-name{
    opacity: 1;
}
#Custom-Context .colors .color i{
    position: absolute;
    opacity: 0;
    transition: .5s;
}
#Custom-Context .colors .color .label-name{
    position: absolute;
    opacity: 0;
    color: white;
    background: black;
    z-index: 2;
    padding: 10px 5px;
    white-space: nowrap;
    border-radius: 5px;
    top: -180%;
    user-select: none;
    pointer-events: none;
}
#Custom-Context .colors .color .label-name::after{
    content: '';
    width: 15px;
    height: 15px;
    background: black;
    display: block;
    position: absolute;
    transform: rotate(45deg) translate(-50%,30%);
    bottom: -10px;
    left: 50%;
    z-index: -1;
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
#Custom-Context .delete{
    border-bottom: solid rgba(0,0,0,.4) 1px;
}
#Custom-Context .delete i:hover{
    background: rgba(0,0,0,.4);
    color: white;
}
#Custom-Context .done input[type="checkbox"]{
    display: none;
}
#Custom-Context .done input[type="checkbox"]:checked+label{
    background: lightgreen;
    color: white;
}
#Custom-Context .done label{
    text-align: center;
    padding: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: block;
    cursor: pointer;
    transition: .5s;
    border-radius: 0 0 5px 5px;
}
#Custom-Context .done label:hover{
    background: rgba(0,0,0,.4);
    color: white;
}
</style>