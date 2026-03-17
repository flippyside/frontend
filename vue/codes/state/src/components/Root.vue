<script setup>
import { provide } from "vue";
import A from "./A.vue";
import B from "./B.vue";
import C from "./C.vue";
import { ref } from "vue";

const count = ref(0);
const increment = () => {
  count.value++;
};
provide("count", {
  count,
  increment,
});
</script>

<template>
  <h2>Root component</h2>
  <ul>
    <li>
      <A></A>
    </li>
    <li>
      <B> </B>
    </li>
  </ul>
</template>
