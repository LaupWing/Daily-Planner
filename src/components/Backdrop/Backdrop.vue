<template>
    <div class="backdrop">
        <slot class="content">
        </slot>
    </div>
</template>

<script>
export default {
    name: 'Backdrop'
}
</script>

<style>
.backdrop{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.5);
    z-index: 10;
    transition: all 1s;
}
.content{
    z-index: 100;
}
</style>