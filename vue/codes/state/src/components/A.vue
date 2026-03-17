<script setup>
// import { count } from "@/store/count";
import { useCountStore } from "@/store/countStore";
import { inject, ref } from "vue";
const countStore = useCountStore();
// const { count, increment } = inject("count");
</script>
<template>
  <!-- <h3>
    ComponentA -- {{ count.count }} --
    <button @click="count.increment">A</button>
  </h3> -->
  <h3>
    ComponentA2 -- {{ countStore.count }} --
    {{ countStore.double }}
    <button @click="countStore.increment">A</button>
  </h3>
</template>
