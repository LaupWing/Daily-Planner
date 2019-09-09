<template>
    <nav class="task-nav">
        <li
            @click="contractTask"
        ><i class="far fa-arrow-alt-circle-left"></i></li>
        <li 
            v-for="(item, index) in navItems"
            :key="index"
            :class="{'active' : section === item}"
        >
            {{item}}
        </li>
    </nav>
</template>

<script>
export default {
    name: 'TaskNav',
    props:['section', 'task'],
    data(){
        return{
            navItems:['general', 'time', 'delete']
        }
    },
    methods:{
        contractTask(){
            this.$emit('contractTask')
        }
    },
    mounted(){
        // this.$el.style.setProperty('--task-color', this.task.color.color)
    }
}
</script>

<style>
.task-nav{
    /* --task-color: black; */
    display: flex;
    font-size: .6em;
    width: 100%;
    background: rgba(0,0,0,.4);
    /* justify-content: center; */
}
.task-nav li i{
    font-size: 1.5em;
}
.task-nav li{
    padding: 5px;
    width: 25%;
    text-align: center;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: .25s
}
.task-nav li.active,
.task-nav li:hover{
    background: var(--task-color); 
}

</style>