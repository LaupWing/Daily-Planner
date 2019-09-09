<template>
    <nav class="task-nav">
        <li
            @click="contractTask"
        ><i class="far fa-arrow-alt-circle-left"></i></li>
        <li 
            v-for="(item, index) in navItems"
            :key="index"
            :class="{'active' : section === item}"
            @click="setSection(item)"
        >
            {{item}}
        </li>
        <li>
            <i class="far fa-trash-alt"></i>
        </li>
    </nav>
</template>

<script>
export default {
    name: 'TaskNav',
    props:['section', 'task'],
    data(){
        return{
            navItems:['general', 'time', 'labels']
        }
    },
    methods:{
        contractTask(){
            this.$emit('contractTask')
        },
        setSection(section){
            this.$emit('setSection', section)
        }
    }
}
</script>

<style>
.task-nav{
    display: flex;
    font-size: .6em;
    width: 100%;
    background: rgba(0,0,0,.4);
}
.task-nav li i{
    font-size: 1.5em;
}
.task-nav li{
    padding: 5px;
    width: 20%;
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