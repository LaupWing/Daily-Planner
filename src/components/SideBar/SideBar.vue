<template>
    <backdrop
        :style="{
            opacity: visible ? 1 : 0
        }"
        @click.native="closeNav"
    >
        <div 
            id="SideBar"
            :class="visible ? 'visible': ''"
            @click.stop
        >
            <nav id="Main-Nav">
                <router-link 
                    @click.native="closeNav" 
                    :to="{name: 'Daily'}"
                >
                    Daily Planner
                </router-link>
                <router-link 
                    @click.native="closeNav" 
                    :to="{name: 'Week'}"
                >
                    Week Planner
                </router-link>
                <router-link 
                    @click.native="closeNav" 
                    :to="{name: 'AllTasks'}"
                >
                    All Tasks
                </router-link>
                <a>Habit Tracker</a>
                <a>Skills</a>
                <a>Projects</a>
            </nav>
        </div>
    </backdrop>
</template>

<script>
import Backdrop from '@/components/Backdrop/Backdrop'
export default {
    name: 'SideBar',
    data(){
        return{
            visible: false
        }
    },
    components:{
        Backdrop
    },
    methods:{
        closeNav(){
            this.$emit('closeNav')
        }
    },
    mounted(){
        this.$el.querySelector('#SideBar').style.top = `${document.querySelector('#NavBar').offsetHeight}px`
        this.visible = true
    }
}
</script>

<style>
#SideBar{
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    background: white;
    font-size: .8em;
    z-index: 100;
    transform: translate(-100%,0);
    transition: transform 1s;
}

#SideBar.visible{
    transform: translate(0,0);
}

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