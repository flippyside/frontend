<script setup>
import { ref } from "vue";
import { provide } from "vue";

import StudentList from "./components/StudentList.vue";
import StudentForm from "./components/StudentForm.vue";
const STU_ARR = ref([
  {
    id: 1,
    name: "aa",
    age: 32,
    gender: "female",
    address: "b1",
  },
  {
    id: 2,
    name: "bb",
    age: 12,
    gender: "female",
    address: "f1",
  },
  {
    id: 3,
    name: "cc",
    age: 22,
    gender: "female",
    address: "q1",
  },
]);

const delStuByIdx = (index) => {
  STU_ARR.value.splice(index, 1);
};

const addNewStu = (student) => {
  const id = STU_ARR.value.at(-1)?.id;
  const newId = !isNaN(id) ? id + 1 : 1;
  student.id = newId;
  STU_ARR.value.push(student);
};

provide("student", {
  students: STU_ARR,
  delStu: delStuByIdx,
  addNewStu: addNewStu,
});
</script>

<template>
  <!-- @del-stu: 将组件中的方法以自定义事件的形式发送给其他的组件 -->
  <student-list></student-list>
  <StudentForm></StudentForm>
</template>

<style scoped></style>
