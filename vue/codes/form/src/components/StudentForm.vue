<script setup>
import { inject, ref } from 'vue';

const { addNewStu } = inject("student");

const newStu = ref({
  id: 0,
  name: "yx",
  age: 10,
  gender: "female",
  address: "hahaha",
});


const submitHandler = () => {
  console.log(newStu.value);
  addNewStu(Object.assign({}, newStu.value))
  newStu.value.name = ""
  newStu.value.age = 1
  newStu.value.gender = "male"
  newStu.value.address = ""
}
</script>

<template>
  <form @submit.prevent="submitHandler">
    <div>
      姓名 <input type="text" v-model="newStu.name"></input>
    </div>
    <div>
      年龄 <input type="text" min="1" max="130" v-model="newStu.age"></input>
    </div>
    <div>
      性别 <input type="radio" name="gender" value="male" v-model="newStu.gender">男</input>
      <input type="radio" name="gender" value="female" v-model="newStu.gender">女</input>
    </div>
    <div>
      地址 <input type="text" v-model="newStu.address"></input>
    </div>
    <button>提交</button>

  </form>
</template>