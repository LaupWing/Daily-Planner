<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380.65 376">
        <path class="cls-1" d="M190.33,0C86.5,0,2.33,84.17,2.33,188s84.17,188,188,188,188-84.17,188-188S294.16,0,190.33,0Zm0,29.71A157.7,157.7,0,0,1,294,68.38L188.48,173.91,84.68,70.11A157.74,157.74,0,0,1,190.33,29.71Zm-126,62.47,103,103L70.71,291.68a158.32,158.32,0,0,1-6.4-199.5Zm126,254.11a157.69,157.69,0,0,1-97.9-33.89l96-96L286.14,314A157.63,157.63,0,0,1,190.33,346.29Zm117.88-52.64-98.52-98.52,105-105a158.31,158.31,0,0,1-6.51,203.55Z"/>
    </svg>
</template>

<script>
export default {
    name: 'Close'
}
</script>

<style scoped>
.cls-1{
    fill: white;
    transition: .25s;
}
svg{
    width: 30px;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    cursor: pointer;
    z-index: 100000000;
}
svg:hover .cls-1{
    fill: black;
}
</style>