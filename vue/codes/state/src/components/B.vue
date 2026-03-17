<script setup>
import { ref } from "vue";
import A from "./A.vue";
import C from "./C.vue";

const isShow = ref(true);
</script>

<template>
  <h3>ComponentB</h3>
  <ul>
    <li v-if="isShow">
      <C></C>
    </li>
  </ul>
</template>
