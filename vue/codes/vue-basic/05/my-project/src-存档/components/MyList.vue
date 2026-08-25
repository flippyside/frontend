<template lang="">
    <ul class="todo-main">
        <MyItem v-for="todoObj in todos" :key="todoObj.id" 
                :todo="todoObj" 
                :checkTodo="checkTodo" 
                :deleteTodo="deleteTodo"></MyItem>
    </ul>
</template>
<script>
import MyItem from "./MyItem.vue";
import {nanoid} from 'nanoid'
export default {
    name:'MyList',
    components:{
        MyItem,
    },
    data(){
        return {
            // todos:[
            //     {id:'001', title:'吃饭', done:true},
            //     {id:'002', title:'hello', done:false},
            //     {id:'003', title:'123', done:true},
            // ]
        }
    },
    methods:{

    },
    props:['todos','checkTodo', 'deleteTodo']
}
</script>

<style scoped>

/*main*/
.todo-main {
  margin-left: 0px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}

.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
</style>