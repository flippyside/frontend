<script setup>
import { useMealsStore } from "./components/meals";
import Meals from "./components/Meals/Meals.vue";

const meals = useMealsStore();
</script>

<template>
  <h1>hi</h1>
  <Meals></Meals>
</template>

<style scoped></style>
