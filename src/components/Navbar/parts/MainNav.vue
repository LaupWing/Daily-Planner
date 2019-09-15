<template>
    <nav id="Main-Nav">
        <router-link :to="{name: 'Home'}">Daily Planner</router-link>
        <router-link :to="{name: 'AllTasks'}">All Tasks</router-link>
        <a>Habit Tracker</a>
    </nav>
</template>

<script>
export default {
    name: 'MainNav',

}
</script>

<style>
nav#Main-Nav{
    /* display: flex;
    margin: 20px auto;
    justify-content: center;
    align-items: center; */
}
nav#Main-Nav li{
    /* list-style: none; */
}
nav#Main-Nav a{
    /* text-decoration: none;
    color: white;
    padding: 5px 12px;
    opacity: .5;
    display: inline-block;
    border: solid white 1px;
    font-size: .8em; */
}
nav#Main-Nav a.router-link-exact-active{
    /* opacity: 1;
    background: white;
    color: black; */
}
nav#Main-Nav a:nth-child(even){
    /* border-left: none;
    border-right: none; */
}
nav#Main-Nav a:first-of-type{
    /* border-radius: 10px 0 0 10px; */
}
nav#Main-Nav a:last-of-type{
    /* border-radius: 0 10px 10px 0; */
}
</style>