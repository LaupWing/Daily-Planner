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
            <transition :name="notificationState" mode="out-in">
                <div class="notification-toggle" key="1" v-if="notificationState==='toggle'">
                    <p 
                        class="switch" 
                        :class="{'active':checkSwitch('on')}"
                        @click="setSwitch('on')"    
                    >
                        <i class="fas fa-check" v-if="checkSwitch('on')"></i>on
                    </p>
                    <p 
                        class="switch" 
                        :class="{'active':checkSwitch('off')}"
                        @click="setSwitch('off')"    
                    >
                        <i class="fas fa-check" v-if="checkSwitch('off')"></i>off
                    </p>
                    <i @click="changeNotificationState" class="fas fa-caret-right"></i>
                </div>
                <div class="notification-time" @click="test"  key="2" v-else>
                    <p>Minutes notify before</p>
                    <select name="setNotifyTime" id="setNotifyTime" :class="disabledSelect">
                        <option value="">5 min</option>
                        <option value="">10 min</option>
                        <option value="">15 min</option>
                        <option value="">20 min</option>
                        <option value="">25 min</option>
                        <option value="">30 min</option>
                        <option value="">60 min</option>
                    </select>
                    <i @click="changeNotificationState" class="fas fa-caret-left"></i>
                </div>
            </transition>
        </div>
        <div class="colors" v-if="userData.colorLabels">
            <div 
                class="color"
                v-for="(color, index) in userData.colorLabels"
                :key="index"
                :style="{background: color.color}" 
                :class="{active :setActiveColor(color)}"
                @click="setColorLabel(color)"
            >
                <i class="fas fa-check"></i>
                <p class="label-name">{{color.label}}</p>
            </div>
        </div>
        <div class="delete" 
            :class="{active : deleteTask}"
            @click="toggleDelete"
        >
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
            switch: 'off',
            notificationState: 'toggle',
            activeColor: this.settings.data.color.color,
            deleteTask: false
        }
    },
    methods:{
        test(){
            console.log(this.switch)
        },
        checkSwitch(state){
            if(state=== this.switch){
                return true
            }else{
                return false
            }
        },
        changeNotificationState(){
            this.notificationState === 'toggle' ? this.notificationState = 'time' : this.notificationState = 'toggle' 
        },
        toggleDelete(){
            this.deleteTask  = !this.deleteTask
        },
        setColorLabel(color){
            this.activeColor = color.color
        },
        setSwitch(val){
            this.switch = val
        },
        setActiveColor(color){
            return this.activeColor === color.color
        }
    },
    computed:{
        setPosition(){
            return{
                top: `${this.settings.coords.y}px`,
                left: `${this.settings.coords.x}px`
            }
        },
        disabledSelect(){
            return this.switch === 'off' ? 'disabled' : ''
        },
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
}
#Custom-Context .notification{
    position: relative;
    overflow: hidden;
    padding: 0;
}
#Custom-Context .notification h2{
    padding: 10px 15px;
    padding-bottom: 5px;
}

#Custom-Context .notification .notification-time,
#Custom-Context .notification .notification-toggle{
    height: 70px;
    padding: 10px;
    position: relative;
}
#Custom-Context .notification .notification-time{
    display: flex;
    justify-content: center;
    align-items: center;
}
#Custom-Context .notification-time p{
    position: absolute;
    top: 3px;
    left: 0;
    right: 0;
    font-size: .7em;
    text-align: center;
    opacity: .5;
}
#Custom-Context .notification-time select{
    padding: 5px 15px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 1em;
    border-radius: 5px;
}
#Custom-Context .notification-time select.disabled {
    pointer-events:none;
    color: #bfcbd9;
    cursor: not-allowed;
    background-image: none;
    background-color: #eef1f6;
    border-color: #d1dbe5;   
}
#Custom-Context .notification i.fa-caret-right,
#Custom-Context .notification i.fa-caret-left{
    position: absolute;
    padding: 3px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    bottom: 0;
}
#Custom-Context .notification i.fa-caret-right{
    right: 0;
}
#Custom-Context .notification i.fa-caret-left{
    left: 0;
}
#Custom-Context .notification i.fa-caret-right:hover,
#Custom-Context .notification i.fa-caret-left:hover{
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
#Custom-Context .delete.active{
    background: red;
    color: white;
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
.toggle-enter-active {
    animation: slideLeft .5s reverse;
}
.toggle-leave-active {
    animation: slideRight .5s;
}
.time-enter-active {
    animation: slideRight .5s reverse;
}
.time-leave-active {
    animation: slideLeft .5s;
}
@keyframes slideLeft {
    from{
        transform: translate(0,0);
    }
    to{
        transform: translate(-100%,0);
    }
}
@keyframes slideRight {
    from{
        transform: translate(0,0);
    }
    to{
        transform: translate(100%,0);
    }
}
</style>