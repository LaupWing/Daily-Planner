<template>
    <nav class="task-nav">
        <li>General</li>
        <li>Time</li>
        <li>Delete</li>
    </nav>
</template>

<script>
export default {

}
</script>

<style>
.task-nav{
    display: flex;
    font-size: .6em;
    width: 100%;
    justify-content: center;
}
.task-nav li{
    margin: 5px;
    padding: 5px 10px;
    border: white solid 2px;
    border-radius: 20px;
}
</style>