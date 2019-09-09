<template>
    <div class="edit-day-bg">
        <div class="edit-day">
            <nav>
                <li
                    :class="{'active': section === 'change'}"
                    @click="setSection('change')"
                >Change</li>
                <li
                    :class="{'active': section === 'delete'}"
                    @click="setSection('delete')"
                >Delete</li>
            </nav>
            <div class="change" v-if="section === 'change'">
                <label class="day">{{dayToEdit.day.slice(0,3).trim()}}</label>
                <div class="time-span-container">
                    <div class="field time-span">
                        <label for="task">Begin:</label>
                        <div class="time">
                            <div class="hours">
                                <label for="hours">Hours</label>
                                <input type="number" name="hours" min="00" max="23" v-model="day.begin.hours">
                            </div>
                            <div class="minutes">
                                <label for="minutes">Minutes</label>
                                <input type="number" name="minutes" min="00" max="59" v-model="day.begin.minutes">
                            </div>
                        </div>
                    </div>
                    <div class="field time-span">
                        <label for="task">End:</label>
                        <div class="time">
                            <div class="hours">
                                <label for="hours">Hours</label>
                                <input type="number" name="hours" min="00" max="23" v-model="day.end.hours">
                            </div>
                            <div class="minutes">
                                <label for="minutes">Minutes</label>
                                <input type="number" name="minutes" min="00" max="59" v-model="day.end.minutes">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="delete" v-if="section === 'delete'">
                <p>Are you sure you want to delete this task on a <span>{{dayToEdit.day}}</span>?</p>
            </div>
            <div class="buttons">
                <button @click="cancel">Cancel</button>
                <button @click="accept">Accept</button>
            </div>
        </div>
    </div>
</template>

<script>
import {addZero} from '@/components/helpers/timeFormat'
export default {
    name: 'ChangeDay',
    props:['dayToEdit'],
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
        }
    }
}
</script>

<style>
.edit-day-bg .edit-day .buttons{
    position: absolute;
    bottom: 0;
    left: 0;
}
.edit-day-bg .edit-day .buttons button{
    color: black;
    padding: 7px;
    border-top: solid rgba(0,0,0,.4) 1px;
}
.edit-day-bg .edit-day .buttons button:first-of-type{
    border-right: solid rgba(0,0,0,.4) 1px;
}
.edit-day-bg{
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0,.6);
    z-index: 1000;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.edit-day-bg .edit-day{
    width: 280px;
    height: 180px;
    background: white;
    color: var(--task-color);
    border-radius: 5px;
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    align-items: center;
}
.edit-day-bg .edit-day .change{
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
}

.edit-day-bg .edit-day nav{
    display: flex;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
.edit-day-bg .edit-day nav li{
    width: 50%;
    padding: 5px;
    text-align: center;
    font-size: .8em;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    background: var(--task-color);
    color: white;
}
.edit-day-bg .edit-day nav li:hover{
    background: white;
    color: var(--task-color);
}
.edit-day-bg .edit-day nav li.active{
    background: white;
    color: var(--task-color);
}
.edit-day-bg .edit-day label.day{
    width: 40px;
    height: 40px;
    line-height: 40px;
    border: solid 1px var(--task-color);
    border-radius: 50%;
    text-align: center;
    font-size: 12px;
    display: inline-block;
    margin: auto;
}
.edit-day-bg .time-span-container{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
.edit-day-bg .field.time-span{
    display: flex;
    flex-direction: column;
    font-size: 1em;
    width: 45%;
}
.edit-day-bg .field.time-span > label{
    width: 100%;
    text-align: center; 
}
.edit-day-bg .field.time-span .time{
    display: flex;
    justify-content: center;
    width: 100%;
}
.edit-day-bg .field.time-span .hours,
.edit-day-bg .field.time-span .minutes{
    display: flex;
    flex-direction: column;
}
.edit-day-bg .edit-day .delete p{
    font-size: .9em;
    width: 70%;
    text-align: center;
    margin: auto;
    color: black;
}
.edit-day-bg .edit-day .delete p span{
    color: var(--task-color);
    font-weight: bold;
}
</style>