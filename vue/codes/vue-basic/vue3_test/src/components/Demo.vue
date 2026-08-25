<template>
  <h2>sum: {{ sum }}</h2>
  <h2>msg: {{ msg }}</h2>

  <h2>{{ name }}</h2>
  <h2>{{ person.age }}</h2>
  <h2>{{ person.job.j1.salary }}</h2>
  <button @click="person.age++">add</button>
  <button @click="person.name+='!'">addmsg</button>
  <button @click="person.job.j1.salary++">addsal</button>
</template>

<script>
import { watch, reactive, ref, computed, watchEffect, onMounted, onBeforeUnmount, toRef } from "vue"
import usePoint from '../hooks/usePoint'
export default {
  name: 'Demo',
  props: ['msg'],
  emits:['hello'],
  components: {
  },
  setup(prop, context){
    let sum = ref(0)
    let msg = ref('hello')

    let person = reactive({
        name:"jyx",
        age: 20,
        job:{
            j1:{
                salary:20
            }
        }
    })

    const name = toRef(person, 'name')




    
    function changeInfo() {  
        
        name.value = 'asf'
        age.value = 109
        
        job.num = 98312
    }
    function addSex() {
        
    }
    function deleteName() {  }
    return {
        sum,
        msg,
        person,
        changeInfo,
        addSex,
        deleteName,
        name,
    }
  }
}
</script>

<style>

</style>
