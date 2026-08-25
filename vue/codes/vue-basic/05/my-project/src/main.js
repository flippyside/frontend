import Vue from 'vue'
// import Vue from 'vue/dist/vue'
import App from './App.vue'
import obj from './plugins'
import pubsub from 'pubsub-js'

// 引入插件
Vue.use(obj)

Vue.config.productionTip = false

new Vue({
  el:'#app',
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this
  },
})
