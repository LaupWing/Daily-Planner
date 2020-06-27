<template>
    <div class="edit-day-bg" @click="checkBg">
        <div class="edit-day">
            <h2>{{dayToEdit.day}}</h2>
            <div class="field time-span">
                <label for="task">Begin:</label>
                <div class="time">
                    <div class="hours">
                        <input type="number" name="hours" min="00" max="23" v-model="day.begin.hours">
                    </div>
                    <span>:</span>
                    <div class="minutes">
                        <input type="number" name="minutes" min="00" max="59" v-model="day.begin.minutes">
                    </div>
                </div>
            </div>
            <div class="field time-span">
                <label for="task">End:</label>
                <div class="time">
                    <div class="hours">
                        <input type="number" name="hours" min="00" max="23" v-model="day.end.hours">
                    </div>
                    <span>:</span>
                    <div class="minutes">
                        <input type="number" name="minutes" min="00" max="59" v-model="day.end.minutes">
                    </div>
                </div>
            </div>
            <i class="fas fa-trash-alt"></i>
            <div class="buttons">
                <button @click="cancel">cancel</button>
                <button @click="accept">Apply</button>
            </div>
        </div>
    </div>
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
export default {
    name: 'SetTimeTask',
    props:['dayToEdit', 'pos', 'elClicked'],
    data(){
        return{
            section: 'change',
            day:{
                day:this.dayToEdit.day,
                begin:{
                    hours: this.dayToEdit.begin.split(':')[0],
                    minutes: this.dayToEdit.begin.split(':')[1]
                },
                end:{
                    hours: this.dayToEdit.end.split(':')[0],
                    minutes: this.dayToEdit.end.split(':')[1]
                }
            }
        }
    },
    methods:{
        checkBg(){
            if(event.target.classList.length>0){
                if(event.target.classList[0]=== 'edit-day-bg'){
                    this.$emit('cancel')
                }
            }
        },
        cancel(){
            this.$emit('cancel')
        },
        setSection(section){
            this.section = section
        },
        accept(){
            const newDay = {
                day: this.day.day,
                begin: `${addZero(this.day.begin.hours)}:${addZero(this.day.begin.minutes)}`,
                end: `${addZero(this.day.end.hours)}:${addZero(this.day.end.minutes)}`
            }
            this.$emit('accept', newDay)
        },
        setPos(){
            const container = this.$el.querySelector('.edit-day')
            const timeSpanEl = this.elClicked
            if(Number(this.pos.top) < Number((window.innerHeight/2))){
                container.classList.add('after')
                container.style.top = (this.pos.top + timeSpanEl.offsetHeight + 15) + 'px'
            }else{
                container.classList.add('before')
                container.style.top = (this.pos.top - container.offsetHeight - 15) + 'px'
            }
            container.style.left = (this.pos.left - (container.offsetWidth/2)+(timeSpanEl.offsetWidth/2)) + 'px'
        }
    },
    mounted(){
        this.setPos()
    },
}
</script>

<style scoped>
.edit-day-bg .edit-day .buttons{
    position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
}
.edit-day-bg .edit-day .buttons button{
    color: black;
    padding: 7px;
    width: 50%;
    background: white;
    border-top: solid rgba(0,0,0,.4) 1px;
    text-transform: uppercase;
    font-size: .6em;
    letter-spacing: 2px;
    cursor: pointer;
    transition: .25s;
}
.edit-day-bg .edit-day .buttons button:first-of-type{
    border-right: solid rgba(0,0,0,.4) 1px;
    border-radius: 0 0 0 5px;
}

.edit-day-bg .edit-day .buttons button:last-of-type{
    border-radius: 0 0 5px 0;
}
.edit-day-bg{
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
}
.edit-day-bg .edit-day{
    box-shadow: 0px 0px 17px 0px rgba(0,0,0,0.75);
    background: white;
    color: var(--task-color);
    border-radius: 5px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    position: fixed;
    z-index: 10000;
}
.edit-day-bg .edit-day.before::after{
    content: '';
    width: 30px;
    height: 30px;
    transform: rotate(45deg);
    z-index: -1;
    background: white;
    position: absolute;
    bottom: -10px;
}
.edit-day-bg .edit-day.after::after{
    content: '';
    width: 30px;
    height: 30px;
    transform: rotate(45deg);
    z-index: -1;
    background: white;
    position: absolute;
    top: -10px;
}
.edit-day-bg .edit-day h2{
    width: 100%;
    text-align: center;
    padding: 10px 40px;
    border-bottom: rgba(0,0,0,.2) solid 1px;
    opacity: .5;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 1.2em;
}

.edit-day .field.time-span{
    padding: 10px;
    border-bottom: rgba(0,0,0,.2) solid 1px;
    width: 100%;
}
.edit-day .time-span label{
    padding-left: 10px;
}

.edit-day .field.time-span .time{
    margin: 10px auto;
    justify-content:center;
    width: 100%;
    display: flex;
    font-size: .7em;
}
.edit-day .time .hours,
.edit-day .time .minutes{
    width: 25%;
    margin-top: 5px;
}
.edit-day .time span{
    font-size: 2.5em;
    margin: 0 5px;
    font-weight: bold;
}
.edit-day i{
    width: 100%;
    text-align: center;
    padding: 10px; 
    cursor: pointer;
}
.edit-day input[type="number"]{
    font-size: 2em;
    width: 100%;
    border: none;
    border-bottom: 1px rgba(0,0,0,.2) solid;
}
</style>