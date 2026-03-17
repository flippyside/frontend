<script setup>
const props = defineProps(["meal"]);
const meal = props.meal;
// console.log(meal);
</script>

<template>
  <div class="meal">
    <div class="img">
      <img :src="meal.img" />
    </div>
    <div class="info">
      <h3>{{ meal.title }}</h3>
      <p>
        {{ meal.desc }}
      </p>
      <span>{{ meal.price }}</span>
    </div>
  </div>
</template>

<style scoped>
.meal {
  height: 280rem;
  display: flex;
  padding: 10rem;
  border-bottom: 1px black solid;
}
.img {
  width: 200rem;
}
.img img {
  width: 100%;
  height: 100%;
}
</style>
