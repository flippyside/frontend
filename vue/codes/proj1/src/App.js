import MyButton from "./MyButton";

export default {
  data() {
    return {
      message: "hellovue",
      count: 0,
    };
  },

  components: {
    MyButton,
  },

  template: `
  {{message}}
  <MyButton></MyButton>
  <MyButton></MyButton>
  <MyButton></MyButton>
  <MyButton></MyButton>
  `,
};
