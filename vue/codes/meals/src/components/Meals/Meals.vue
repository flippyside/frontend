<script setup>
import { useMealsStore } from "../meals";
import Meal from "./Meal.vue";
const meals = useMealsStore();
</script>

<template>
  <!-- 所有汉堡的容器 -->
  <div class="meals">
    <Meal v-for="item in meals.data" :meal="item"></Meal>
  </div>
</template>

<style scoped>
.meals {
  height: 100vh;
  padding-top: 120rem;
  padding-bottom: 120rem;
  background-color: #fff;
  color: black;
  overflow: auto;
}
</style>
