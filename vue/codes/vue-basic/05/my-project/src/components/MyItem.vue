<template lang="">
    <li>
        <label>
            <input type="checkbox" :checked="todo.done" @click="handleCheck(todo.id)" />
            <span v-show="!todo.isEdit">{{todo.title}}</span>
            <input ref="inputTitle" :value="todo.title" v-show="todo.isEdit" @blur="handleBlur(todo, $event)">
        </label>
        <button class="btn btn-danger" @click="handlDelete(todo.id)">删除</button>
        <button class="btn btn-edit" @click="handleEdit(todo)" v-show="!todo.isEdit">编辑</button>
    </li>
</template>
<script>
export default {
    name:'MyItem',
    props:['todo'],
    data(){
        return {
            isChecked: false,
        }
    },
    watch:{
        isChecked(oldVal, newVal){
            console.log(oldVal, newVal);
        }
    },
    methods:{
        handleCheck(id){
            this.$bus.$emit('checkTodo', id)
        },
        handlDelete(id){
            if(confirm('确定删除吗？')){
                this.$bus.$emit('deleteTodo', id)
            }
        },
        handleEdit(todo){
            if(todo.hasOwnProperty('isEdit')){
                todo.isEdit = true
            }
            else this.$set(todo, 'isEdit', true)
            this.$nextTick(function () {
                this.$refs.inputTitle.focus()
            })
        },
        handleBlur(todo, ev){
            todo.isEdit = false
            if(!ev.target.value.trim()) return alert('输入不能为空')
            this.$bus.$emit('updateTodo', todo.id, ev.target.value)
        }
    }
}
</script>
<style scoped>
/*item*/
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  display: none;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}

li:hover {
    background-color: #ffcaca;
}
li:hover button{
    display: block;
}
</style>