<template>
    <div class="time-popup-bg">
        <div class="time-popup">
            <div class="field">
                <input type="checkbox" name="day" id="">
                <label for="">mon</label>
            </div>
            <div class="field">
                <input type="checkbox" name="day" id="">
                <label for="">tue</label>
            </div>
            <div class="field">
                <input type="checkbox" name="day" id="">
                <label for="">wed</label>
            </div>
            <div class="field">
                <input type="checkbox" name="day" id="">
                <label for="">thu</label>
            </div>
            <div class="field">
                <input type="checkbox" name="day" id="">
                <label for="">fri</label>
            </div>
            <div class="field">
                <input type="checkbox" name="day" id="">
                <label for="">sat</label>
            </div>
            <div class="field">
                <input type="checkbox" name="day" id="">
                <label for="">sun</label>
            </div>
        </div>
    </div>  
</template>

<script>
export default {
    nasme:'Time-Popup',
    props:['period'],
    data(){
        return{

        }
    },
    methods:{

    }
}
</script>

<style>

</style>