import { defineStore } from "pinia";
import { computed, ref } from "vue";

// /*
// 通过函数来创建store
// 定义形式：defineStore("store的id", 配置对象)
// 配置对象：state是一个函数，将需要由pinia维护的数据以对象的形式返回
// */
// export const useCountStore = defineStore("count", {
//   // 数据
//   state: () => ({
//     count: 100,
//   }),

//   // 计算属性
//   getters: {
//     double: (state) => state.count * 2,
//   },

//   //方法
//   actions: {
//     increment() {
//       this.count++;
//     },
//   },
// });

export const useCountStore = defineStore("count", () => {
  const count = ref(50);
  const name = ref("abc");
  const double = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }
  return { count, name, double, increment };
});
