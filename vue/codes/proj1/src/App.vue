<script>
import MyButton from "./MyButton.vue";
export default {
  data() {
    return {
      msg: "vue!",
    };
  },
  components: {
    MyButton,
  },
};
</script>

<template>
  <h1>{{ msg }}</h1>
  <MyButton></MyButton>
</template>
