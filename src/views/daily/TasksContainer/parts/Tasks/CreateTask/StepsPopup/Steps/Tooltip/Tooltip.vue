<template>
    <div class="tooltip">
        <h2>Testing tooltip</h2>
    </div>
</template>

<script>
export default {
    name: 'Tooltip',
    props:{
        left:{
            type: Number,
            required: true
        },
        top:{
            type: Number,
            required: true
        },
        coord:{
            type: Number,
            required: true
        }
    }
}
</script>

<style>

</style>