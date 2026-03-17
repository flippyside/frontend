//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//引入VueRouter
import VueRouter from 'vue-router'
//引入路由器
import router from './router'

// 引入 Element UI
import ElementUI from 'element-ui'
// 引入 Element UI 的样式
import 'element-ui/lib/theme-chalk/index.css'

// 全局使用 ElementUI
Vue.use(ElementUI)

//关闭Vue的生产提示
Vue.config.productionTip = false
//应用插件
Vue.use(VueRouter)

//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	router:router
})
