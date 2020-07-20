<template>
    <div id="NavBar">
        <div class="left-panel">
            <div class="open-side-menu">
                <router-link :to="{
                    name: 'Daily'
                }">
                    <i 
                        class="fas fa-stop"
                        :class="{
                            active: $route.name === 'Daily'
                        }"
                    ></i>
                </router-link>
                <router-link :to="{
                    name: 'Week'
                }">
                    <i 
                        class="fas fa-th"
                        :class="{
                            active: $route.name === 'Week'
                        }"
                    ></i>
                </router-link>
            </div>
            <Temperature/>
        </div>
        <CurrentTime :currentTask="currentTask" />
        <div class="right-panel">
            <Auth />
        </div>
    </div>
</template>

<script>
import Temperature from "@/components/Navbar/parts/Temperature"
import Auth from "@/components/Navbar/parts/Auth"
import CurrentTime from "@/components/Navbar/parts/CurrentTime"

export default {
    name: "NavBar",
    props: ["currentTask"],
    components: {
        Temperature,
        Auth,
        CurrentTime
    },
    mounted(){
        // To be sure that the navbar loads first in order to render the view
        setTimeout(() => {
            this.$emit("navbarLoaded");
        }, 200);
    }
};
</script>

<style scoped>
#NavBar {
    display: flex;
    justify-content: center;
    background: white;
    border-bottom: 1px rgba(0, 0, 0, 0.4) solid;
    z-index: 1000;
    padding: 5px 8px;
    position: relative;
}
#NavBar .left-panel {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
}
#NavBar .right-panel {
    position: absolute;
    right: 0;
}
#NavBar .open-side-menu {
    display: flex;
    align-items: center;
    color: black;
    font-size: 25px;
    transition: 0.25s;
    cursor: pointer;
    margin: 0 20px;
    margin-right: 30px;
}
#NavBar .open-side-menu i{
    width: 45px;
    height: 45px;
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
}
#NavBar .open-side-menu i:hover,
#NavBar .open-side-menu i.active {
    color: white;
    background: grey;
}
</style>