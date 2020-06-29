<template>
    <ul id="Timeline">
        <li data-time="00:00">00:00</li>
        <li data-time="00:30">-</li>
        <li data-time="01:00">01:00</li>
        <li data-time="01:30">-</li>
        <li data-time="02:00">02:00</li>
        <li data-time="02:30">-</li>
        <li data-time="03:00">03:00</li>
        <li data-time="03:30">-</li>
        <li data-time="04:00">04:00</li>
        <li data-time="04:30">-</li>
        <li data-time="05:00">05:00</li>
        <li data-time="05:30">-</li>
        <li data-time="06:00">06:00</li>
        <li data-time="06:30">-</li>
        <li data-time="07:00">07:00</li>
        <li data-time="07:30">-</li>
        <li data-time="08:00">08:00</li>
        <li data-time="08:30">-</li>
        <li data-time="09:00">09:00</li>
        <li data-time="09:30">-</li>
        <li data-time="10:00">10:00</li>
        <li data-time="10:30">-</li>
        <li data-time="11:00">11:00</li>
        <li data-time="11:30">-</li>
        <li data-time="12:00">12:00</li>
        <li data-time="12:30">-</li>
        <li data-time="13:00">13:00</li>
        <li data-time="13:30">-</li>
        <li data-time="14:00">14:00</li>
        <li data-time="14:30">-</li>
        <li data-time="15:00">15:00</li>
        <li data-time="15:30">-</li>
        <li data-time="16:00">16:00</li>
        <li data-time="16:30">-</li>
        <li data-time="17:00">17:00</li>
        <li data-time="17:30">-</li>
        <li data-time="18:00">18:00</li>
        <li data-time="18:30">-</li>
        <li data-time="19:00">19:00</li>
        <li data-time="19:30">-</li>
        <li data-time="20:00">20:00</li>
        <li data-time="20:30">-</li>
        <li data-time="21:00">21:00</li>
        <li data-time="21:30">-</li>
        <li data-time="22:00">22:00</li>
        <li data-time="22:30">-</li>
        <li data-time="23:00">23:00</li>
        <li data-time="23:30">-</li>
        <li data-time="00:00">00:00</li>
    </ul>
</template>

<script>
export default {
    name: 'Timeline'
}
</script>

<style>
ul#Timeline{
    display: flex;
    flex-direction: column;
    padding-right: 15px;
    padding-top: calc(var(--dailyPlanner-height)/2);
    margin-left: 20px;
    padding-bottom: calc(var(--dailyPlanner-height)/2);
    box-sizing: content-box;
}
#Timeline li{
    padding: 10px 0;
    list-style: none;
    text-align: right;
    display: inline;
    font-size: 1.5em;
    transform-origin: right;
    opacity: .3;
    transition: 1s;
    position: relative;
}
#Timeline li.highlight{
    transform: scale(1.2);
}
#Timeline li.opacity{
    opacity: 1;
}
@media only screen and (max-height: 800px) {
    #Timeline li{
        padding: 5px 0;
        font-size: 1.2em;
    }
}
</style>