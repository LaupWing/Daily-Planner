<template>
    <div    
        class="task"
        :style="{top: 100*index +'px'}"
    >
        {{task.task}}
    </div>
</template>

<script>
export default {
    name: 'TaskInWeekView',
    props: ['task', 'index']
}
</script>

<style>

</style>