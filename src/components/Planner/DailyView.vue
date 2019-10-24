<template>
    <div 
        v-if="view === 'single'"
        id="planner"
        @scroll="scrollEvent"
        @click="createTask"
    >
        <div class="indicator" @click="turnoff"></div>
        <Timeline
            :hours="hours"
            :minutes="minutes"
        />
        <Tasks
            :visibleTask="visibleTask"
            :userData="userData"
            v-on:setTask='setTask'
            v-on:checkActiveTask='checkTaskByScroll'
            v-on:togglePopup="togglePopup"
        />
    </div>
</template>

<script>
import Timeline from '@/components/Planner/Timeline'
import Tasks from '@/components/Planner/Tasks/Tasks'

export default {
    name: 'DailyView',
    components:{

    },
    data(){
        return{

        }
    },
    computed:{

    },
    methods:{

    }
}
</script>

<style>

</style>