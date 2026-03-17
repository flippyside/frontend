<script setup>
// import { count } from "@/store/count";
// import { countStore } from "@/store/count";
import { useCountStore } from "@/store/countStore";
import { useStudentStore } from "@/store/studentStore";
import { storeToRefs } from "pinia";

import { inject, ref } from "vue";
const countStore = useCountStore();
const stuStore = useStudentStore();

const { name, age } = storeToRefs(stuStore);

const clickHandler = () => {
  stuStore.$patch((state) => {
    state.name = "woaini";
    state.skills.push("909");
  });
};

stuStore.$subscribe(
  (mutation, state) => {
    console.log("state发生变化", state);
  },
  { detached: true }
);

// const { count, increment } = inject("count");
</script>
<template>
  <h4>
    ComponentC -- {{ name }} -- {{ age }} -- {{ stuStore.skills }}
    <button @click="clickHandler">hhhh</button>
  </h4>
</template>
