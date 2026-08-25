<template lang="">
    <div class="todo-footer" v-show="total">
    <label>
        <!-- <input type="checkbox" :checked="isAll" @click="checkAll"/> -->
        <input type="checkbox" v-model="isAll" @click="checkAll"/>
    </label>
    <span>
        <span >已完成{{doneTotal}}</span> / 全部{{total}}
    </span>
    <button class="btn btn-danger" @click="clearAll">清除已完成任务</button>
    </div>
</template>
<script>
export default {
    name:'MyFooter',
    props:['todos', ],
    computed: {
        total(){
            return this.todos.length
        },
        doneTotal(){

            return this.todos.reduce((prev,cur) => {
                return prev += cur.done ? 1 : 0
            }, 0)
        },
        isAll:{
            get(){
                return this.doneTotal === this.total && this.total > 0
            },
            set(val){
                this.checkAll(val)
            }
        }
    },
    methods: {
        clearAll(){
            this.$emit('clearAllTodo')
        },
        checkAll(isChecked){
            this.$emit('checkAllTodo', isChecked)
        }
    }
}
</script>
<style lang="">
    
</style>