### 库和框架

- 库：我们调用库中的方法，实现逻辑
- 框架：我们将代码写到特定的位置上，框架调用我们的逻辑



### MVC和MVVM

- MVC：Model-View-Controller，数据-视图-控制器，通常是全栈开发，视图的变化后，由控制器来操作数据，然后手动渲染到视图。
- MVVM：Model-View-ViewModel，数据-视图-视图模型，通常是前后端分离，视图与数据是自动映射的关系，不需要手动操作DOM
  - 特点：双向绑定

vue没有严格遵循MVVM：

- MVVM中，view和model不能通信，必须通过view model。
- 而vue可以不通过viewmodel，直接操作数据

### VUE渐进式框架

可以使用vue的局部功能，也可以使用完整功能。

vue的响应式原理 + vue的组件化的功能 + vue-router + vuex + vue-cli

```js
new Vue({
    el: '#app',
    render: h => h(App)
})
```

 `render: h => h(App)`：告诉 Vue 要渲染哪个组件。

- **`h`**：是 `createElement` 函数的简写（来自 `hyperscript` ），用于创建虚拟 DOM 节点。
- **`h(App)`**：创建一个 `App` 组件的虚拟节点。
- **最终效果**：将 `App` 组件渲染到 `#app` 容器中。

使用 `render` 函数：

- 在**运行时（runtime-only）** 构建下，不包含模板编译器，代码体积更小。
- 直接处理虚拟 DOM，效率更高。
- 可以更方便地使用 JSX 或动态组件。
