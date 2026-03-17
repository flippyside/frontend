<script setup>
import { inject } from "vue";

const { students, delStu } = inject("student");
</script>

<template>
  <tbody>
    <tr v-for="(stu, index) in students">
      <td>{{ stu.id }}</td>
      <td>{{ stu.name }}</td>
      <td>{{ stu.age }}</td>
      <td>{{ stu.gender }}</td>
      <td>{{ stu.address }}</td>
      <td>
        <a href="#" @click.prevent="delStu(index)">del</a>
      </td>
    </tr>
  </tbody>
</template>

<style scoped>
td {
  border: 2px solid black;
  /* margin-left: 10px; */
  width: 15px;
  font-size: 20px;
}
</style>
