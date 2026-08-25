<template>
    <div class="app">
        <h1>App组件 {{ name }} {{ price }}</h1> 
        <Child></Child>
        <Son></Son>
    </div>
    <!-- <Demo @hello="hello" msg="hello">
        <template v-slot:qwe>
            <div>
                <p>what!</p>
            </div>
        </template>
    </Demo> -->
</template>

<script>
import { reactive, ref, toRefs, provide } from "vue"
import Demo from "./components/Demo.vue";
import Child from "./components/Child.vue";
import Son from "./components/Son.vue";
export default {
  name: 'App',
  components: {
    Child, Son
  },
  setup(){
    
    let car = reactive({name:'avbv', price: 30})
    
    provide('car', car)
   
    return {
        ...toRefs(car),
    }
  }
}
</script>

<style>
.app{
    background-color: #ff8b8b;
}
</style>
