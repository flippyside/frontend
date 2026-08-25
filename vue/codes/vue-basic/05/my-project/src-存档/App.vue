<template>
<div id="root">
  <div class="todo-container">
    <div class="todo-wrap">
      <!-- <MyHeader @addTodo="addTodo"></MyHeader> -->
      <MyHeader :addTodo="addTodo"></MyHeader>
      <MyList :todos="todos" :checkTodo="checkTodo" :deleteTodo="deleteTodo"></MyList>
      <MyFooter :todos="todos" :checkAllTodo="checkAllTodo" :clearAllTodo="clearAllTodo"></MyFooter>
    </div>
  </div>
</div>
</template>

<script>
import MyHeader from "./components/MyHeader.vue";
import MyItem from "./components/MyItem.vue";
import MyList from "./components/MyList.vue";
import MyFooter from "./components/MyFooter.vue";
    export default {
        name:'App',
        data(){
            return {
                todos: JSON.parse(localStorage.getItem('todos')) || []
            }
        },
                // todos:[
                //     {id:'001', title:'吃饭', done:true},
                //     {id:'002', title:'hello', done:false},
                //     {id:'003', title:'123', done:true},
                // ],
        components:{
            MyFooter, MyHeader, MyItem, MyList,MyFooter
        },
        methods:{
            // addTodo(todo){
            //     todos.push(todo)
            // },
            addTodo(todo){
                // console.log(x);
                this.todos.push(todo)
            },
            checkTodo(id){
                this.todos.forEach(e => {
                    if(e.id === id) {
                        e.done = !e.done
                    }
                });
            },
            deleteTodo(id){
                this.todos = this.todos.filter(e => e.id !== id);
            },
            checkAllTodo(isAll){
                this.todos.forEach(element => {
                    element.done = isAll ? true : false
                });
            },
            clearAllTodo(){
                this.todos = this.todos.filter((e)=>{
                    return !e.done
                })
            }
        },
        watch: {
            todos:{
                deep:true,
                handler(val){
                    localStorage.setItem('todos', JSON.stringify(val))
                }
            }
        }
        
    }
</script>

<style>
/*base*/
body {
  background: #fff;
}

.btn {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.btn-danger {
  color: #fff;
  background-color: #da4f49;
  border: 1px solid #bd362f;
}

.btn-danger:hover {
  color: #fff;
  background-color: #bd362f;
}

.btn:focus {
  outline: none;
}

.todo-container {
  width: 600px;
  margin: 0 auto;
}
.todo-container .todo-wrap {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}


/*footer*/
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}

.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}

.todo-footer button {
  float: right;
  margin-top: 5px;
}

</style>