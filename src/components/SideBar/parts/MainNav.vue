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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

nav#Main-Nav a{
    color: rgba(0,0,0,.7);
    text-decoration: none;
    padding: 15px;
    border-bottom: 1px solid rgba(0,0,0,.2);
    width: 100%;
    text-transform: uppercase;
    letter-spacing: 1px;
}
nav#Main-Nav a.router-link-exact-active{
    background: rgba(0,0,0,.1);
    color: black;
}
nav#Main-Nav a.router-link-exact-active:hover{
    background: rgba(0,0,0,.1);
    color: black;
}
nav#Main-Nav a:hover{
    background: rgba(0,0,0,.1);
    color: black;
}
</style>