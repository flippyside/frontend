
import { createApp } from 'vue'
import App from './App.vue'

// 创建应用实例对象
const app = createApp(App)
console.log(app);

app.mount('#app')

/**
const vm = new Vue({
    render: h => h(App)
})
vm.$mount('#app')
*/
