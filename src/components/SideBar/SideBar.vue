<template>
    <div id="SideBar">
        <MainNav/>
    </div>
</template>

<script>
import MainNav from '@/components/SideBar/parts/MainNav'
export default {
    name: 'SideBar',
    components:{
        MainNav
    },
    mounted(){
        this.$el.style.top = `${document.querySelector('#NavBar').offsetHeight}px`
        const colorLabels = document.querySelector('#Color-Label')
        if(colorLabels){
            colorLabels.style.left = `${this.$el.offsetWidth+10}px`
        } 
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
    z-index: 100;
}

</style>