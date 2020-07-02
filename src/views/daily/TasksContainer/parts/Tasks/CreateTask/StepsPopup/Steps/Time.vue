<template>
    <div class="step">
        <div class="starting">
                <input 
                    type="number" 
                    name="hours" 
                    min="00" 
                    max="23" 
                    v-model="starting.hour"
                >
                <input 
                    type="number" 
                    name="hours" 
                    min="00" 
                    max="23" 
                    v-model="starting.minute"
                >
            </div>
            <div class="end">
                <input 
                    type="number" 
                    name="hours" 
                    min="00" 
                    max="23" 
                    v-model="ending.hour"
                >
                <input 
                    type="number" 
                    name="hours" 
                    min="00" 
                    max="23" 
                    v-model="ending.minute"
                >
            </div>
    </div>
</template>

<script>
export default {
    name: 'Time',
    props:{
        starting:{
            type: Object,
            required: true
        },
        ending:{
            type: Object,
            required: true
        },
    }
}
</script>

<style>

</style>