<template>
    <div 
        id="Custom-Context"
        class="popup"
        :style="setPosition"
    >

    </div>
</template>

<script>
export default {
    name: 'CustomContext',
    props:['settings'],
    computed:{
        setPosition(){
            return{
                top: `${this.settings.coords.y}px`,
                left: `${this.settings.coords.x}px`
            }
        }
    },
    created(){
        
    }
}
</script>

<style>
#Custom-Context{
    position: fixed;
    width: 200px;
    height: 200px;
    background: orange;
    z-index: 10000;
}
</style>