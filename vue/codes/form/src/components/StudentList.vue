<script setup>
import { inject } from "vue";
import StudentItem from "./StudentItem.vue";

// const { students, delStu, addNewStu } = inject("student");
</script>

<template>
  <h1>Hello!</h1>
  <table>
    <caption>
      Students List
    </caption>
    <thead>
      <tr>
        <th>id</th>
        <th>name</th>
        <th>age</th>
        <th>gender</th>
        <th>address</th>
        <th>opration</th>
      </tr>
    </thead>
    <StudentItem></StudentItem>
  </table>
</template>

<style scoped>
table {
  width: 50px;
  border-collapse: collapse;
  margin-left: 20px;
  text-align: center;
  width: 400px;
}

th {
  border: 2px solid black;
  /* margin-left: 10px; */
  width: 15px;
  font-size: 20px;
}
</style>
