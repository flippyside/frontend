import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

const app = createApp(App);
// 使用pinia
const pinia = createPinia();
app.use(pinia);

app.mount("#app");
