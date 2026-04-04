## 讲讲 Vuex 的使用方法

Vuex：Vue的状态管理模式+库

用于解决多个组件共享状态的问题。将组件的共享状态抽取出来，以一个全局单例模式管理

安装：`npm install vuex@next --save`

store类似一个容器，存放状态state

- 响应式存储
- 不能直接改变store中的状态，而要通过commit mutation，使得状态变化可以被跟踪
- 使用getter对state进行计算得到结果， 使用 mutation（同步操作）、action（mutation、异步操作） 改变 state
- 可以将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、嵌套子模块
- 每个应用仅包含一个 store 实例。

```js
const store = createStore({
    state(){ // 状态
        return {
            count: 0
        }
    },
    mutations: { // 操作
        increment(state) {
            state.count++
        }
    }
})

app.use(store) // 将 store 实例作为插件安装

store.commit('increment')
console.log(store.state.count) // 1
```

模块：

```js
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

在 Vue 组件中， 可以通过 `this.$store` 访问store实例：

```js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

getter：对 state 进行一些计算并返回结果。使用 `store.getter`访问getter。

- 属性getter：作为 Vue 的响应式系统的一部分缓存其中
- 方法getter：每次都会去进行调用，而不会缓存结果。

```js
const store = createStore({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos (state) { // 通过属性访问。作为 Vue 的响应式系统的一部分缓存其中
      return state.todos.filter(todo => todo.done)
    }
    getTodoById: (state) => (id) => { // 通过方法访问。每次都会去进行调用，而不会缓存结果。
      return state.todos.find(todo => todo.id === id)
    }
  }
})

store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态。
- mutation 必须同步执行，而 Action 可以包含异步操作。
- Action 通过 store.dispatch 方法触发

```js
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    incrementAsync ({ commit }) {
        setTimeout(() => {
            commit('increment')
        }, 1000)
    }
  }
})
```

## mvvm 和 mvc 区别是什么

MVVM：Model - View - View Model

- 模型 Model：应用的数据及业务逻辑。对应 data 中的数据
- 视图 View：应用的展示效果，各类UI组件。对应 模板
- 视图模型 View Model：框架封装的核心，它负责将数据与视图关联起来。对应 Vue 实例对象

View Model的主要功能：

* 数据变化后更新视图
* 视图变化后更新数据

View Model由两个主要部分组成

* 监听器（Observer）：对所有数据的属性进行监听
* 解析器（Compiler）：对每个元素节点的指令进行扫描跟解析,根据指令模板替换数据,以及绑定相应的更新函数

## 讲讲 Vue 双向绑定原理

单向绑定：所有数据只有一份，一旦数据变化，就去更新页面(只有data-->DOM，没有DOM-->data)。

双向绑定(v-model)：`View`的改变能实时让 `Model`发生变化，而 `Model`的变化也能实时更新 `View`。使用场景：表单的input输入框

什么情况下用户可以更新View呢？如：`填写表单`。当用户填写表单时，View的状态就被更新了，如果此时MVVM框架可以自动更新Model的状态，那就相当于把Model和View做了双向绑定。

双向数据绑定可以理解为是在单向绑定的基础上给可输入元素（input、textarea等）添加了change(input)事件，来动态修改model和 view。

```html
<input v-model="xxx">

<!-- 上面的代码等价于 -->
<input :value="xxx" @input="xxx = $event.target.value">
<!-- 双向绑定 = 单向绑定 + UI事件监听 -->
```

### 实现双向绑定

数据劫持：

- 是 vue 中用来 实现数据绑定 的一种 技术
- 基本思想: 通过 defineProperty()来监视 data 中所有属性(任意层次)数据的变化, 一旦变化就去更新界面。
  - 即，给data中的属性添加set(监视变化)，get方法

基于**数据劫持**的实现思路：

- 利用Proxy或Object.defineProperty生成的Observer针对对象/对象的属性进行"劫持",在属性发生变化后通知订阅者
- 解析器Compile解析模板中的Directive(指令)，收集指令所依赖的方法和数据,等待数据变化然后进行渲染
- Watcher属于Observer和Compile之间的桥梁,它将接收到的Observer产生的数据变化,并根据Compile提供的指令进行视图渲染,使得数据变化促使视图变化

流程

- 模板编译(Compile)
- 数据劫持(Observer)
- 发布的订阅(Dep)
- 观察者(Watcher)

## Vue 组件间通信方式有哪些

组件中的数据共有三种形式：data、props、computed。

vue 中通信方式大概可以分为：父子通信，兄弟通信，跨级通信。

父子组件通信可以用：

- props
- $emit / v-on(@)
- $attrs / listeners
- $emit / ref
- .sync （双向绑定）
- v-model（双向绑定）
- $children / parent

兄弟组件通信可以用：

- EventBus
- Vuex(状态管理器，集中式存储管理所有组件的状态)
- $parent

跨层级组件通信可以用：

- provide/inject
- EventBus
- Vuex
- $attrs / listeners
- $root
- 路由传参
- localStorage / sessionStorage

## computed 和 watch 区别是什么

computed：计算属性，要用的属性不存在，要通过已有属性计算得来。

watch：监视属性，当被监视的属性变化时, 回调函数自动调用, 进行相关操作

computed 和 watch 之间的区别：

- 1.computed 能完成的功能，watch 都可以完成。
- 2.watch 能完成的功能，computed 不一定能完成，例如：watch 可以进行异步操作。

## v-for 和 v-if 同时使用有问题吗（有）

- v-for : 遍历数组/对象/字符串
- v-if : 条件渲染（动态控制节点是否存存在）

在vue2和vue3的官方文档里都写到不推荐 v-if 和 v-for 同时使用，如下代码所示：

<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.text }}
</li>

在vue3中，是因为当它们同时存在于一个节点上时，v-if 比 v-for 的优先级更高。这意味着 v-if 的条件将无法访问到 v-for 作用域内定义的变量别名。 v-if里是无法访问到todo的，这将会报错。

在vue2中，v-for 比 v-if 的优先级更高，也就是说在v-if中可以访问到v-for作用域内定义的变量别名 ，因此不会跟vue3一样报错，但并不推荐这么做，原因如下：

- 性能问题：将 v-for 和 v-if 放在同一个元素上会导致性能下降。Vue 必须为每一个在 v-for 中的项目都检查 v-if 的条件，这会增加不必要的计算量。特别是当 todos 数组很大时，这种性能问题会更加明显。详见文章末尾的附录。
- 逻辑可读性：从逻辑和可读性的角度来看，将过滤逻辑（v-if）和渲染逻辑（v-for）混合在一起可能会导致代码难以理解和维护。最好是先过滤数据，然后再进行渲染。

推荐写法：

- 1. 先过滤数据，再使用v-for
- 2. 利用`<template>`元素，将 v-if 放在 v-for 的子元素中

```js
    <template v-for="todo in todos" :key="todo.id">
      <li v-if="!todo.isComplete">
        {{ todo.text}}
      </li>
    </template>
```

## 讲讲前端路由原理。比较一下 history 和 hash 这两种路由

SPA（single page web application）单页 Web 应用：整个应用只有一个完整的页面，点击页面中的导航链接不会刷新页面，只会做页面的局部更新，数据需要通过 ajax 请求获取

一个路由就是一组映射关系（key-value），key 为路径,value 可能是 function 或 component

路由的两种方式：history 和 hash

* 对于一个 url 来说，什么是 hash 值？—— `#`及其后面的内容就是 hash 值。
* hash 值不会包含在 HTTP 请求中，即：hash 值不会给服务器。
* hash 模式：
  1. 地址中永远带着#号，不美观 。
  2. 若以后将地址通过第三方手机 app 分享，若 app 校验严格，则地址会被标记为不合法。
  3. 兼容性较好。
* history 模式：
  1. 地址干净，美观 。
  2. 兼容性和 hash 模式相比略差。
  3. 应用部署上线时需要后端人员支持，解决刷新页面服务端 404 的问题。

### Hash模式

把前端路由的路径用#拼接在真实url后面,当#后的地址变化时,浏览器不会重新发起请求,而是触发onhashchange事件

特点：

- hash的变化会触发网页的跳转,及浏览器的后退和前进
- hash可以改变url,但不会触发页面的重新请求(hash的变化记录在window.history),所有的页面跳转都是在客户端进行的,并不算一次新的http请求;
- hash只能修改#后的部分,即只能跳转到与当前url同源的url

实现原理：基于 ` windows.location.hash`实现，通过监听  `hashchange` 事件来实现路由导航。

### History模式

使用正常的 URL 路径，例如：`http://example.com/about`。

允许开发者直接更改前端路由，也就是更改 url 地址而无需向后端发送 http 请求。

history特点：

- 新的url可以是与当前url同源的任意url,也可以是与当前url同样的url,但会导致把重复的这次操作记录到栈中
- 通过 history.state ，添加任意类型的数据到记录中。
- 通过 pushState 、 replaceState 来实现无刷新跳转的功能

存在问题：

- 使用history刷新页面时,浏览器会重新发起请求,此时如果nginx没有匹配到url,就会出现404；而hash模式虽然看着是改变了url,但不会包括在http请求中,页面路径还是之前的,nginx不会拦截
- 因此，在使用 history 模式时，需要通过服务端来允许地址可访问，如果没有设置，就很容易导致出现 404 的局面。

实现原理  ：基于 HTML5 的 `history.pushState` 和 `history.replaceState` 实现，通过 `popstate` 事件监听路由变化。

在实际项目中，历史路由（History Mode）通常更常用，主要原因如下：

1. **用户体验** ：历史路由的 URL 更加美观，用户体验更好。
2. **SEO优化** ：历史路由的 URL 结构有利于搜索引擎索引，能够提升网站的 SEO 效果。
3. **现代浏览器支持** ：随着现代浏览器的普及，HTML5 的 `history` API 已经得到了广泛的支持，历史路由的兼容性问题逐渐减少

## 讲讲 Vue 的虚拟 DOM，原理，好处是什么？相对于手动操作 DOM，性能更好吗



> Virtual Dom(vdom，虚拟DOM)：用于描述真实dom节点的JavaScript对象。



- 虚拟dom本质上是js对象,是对真实dom的抽象,在状态变化时,记录新树和旧树的差异,最后把差异更新到真实dom中
- 轻量级的抽象层，对应于真实DOM的结构，包含了与真实DOM相同的层次结构、属性和内容信息
- 操作、更新高效（diff算法）：虚拟dom将dom的对比放在了js层,通过对比不同之处来选择新的渲染节点,从而提高渲染效率
- 只存在于内存中，并不直接渲染到浏览器中

优缺点:
- 虚拟dom能保证下限,通过diff算法找出最小差异,然后批量patch,这样虽比不上手动优化,但相较于粗暴的dom操作性能要好很多,保证了性能
- 无需手动操作
- 跨平台: 虚拟DOM本质上是JavaScript对象,而DOM与平台强相关,相比之下虚拟DOM可以进行更方便地跨平台操作,例如服务器渲染、移动端开发等等
- 无法进行极致优化,在一些要求极高的应用中虚拟dom无法极致优化,需要手动操作

为什么使用虚拟dom：

- 频繁的DOM操作开销大（例如大量页面元素的重绘和回流），处于性能优化的考虑我们应该减少重绘和回流的操作。而对虚拟节点的DOM操作，并不会触发重绘和回流，把处理后的虚拟节点映射到真是DOM上，只需要进行一次重绘和回流，提高了性能。

![1775047499750](image/vue/1775047499750.png)

虚拟 DOM 的更新：通过对比前后两个虚拟 DOM 树的差异，然后将差异部分应用到真实 DOM 上，从而减少直接操作真实 DOM 的次数。

与真实 DOM 相比，虚拟 DOM 具有以下区别：
- 效率：虚拟 DOM 可以减少对真实 DOM 的直接操作次数，通过一次虚拟 DOM 的比较和更新，来代替多次的直接 DOM 操作。由于虚拟 DOM 可以批量处理更新，它通常能提供更好的性能表现。
- 批量更新：虚拟 DOM 可以将多个更新操作批量处理，最终只触发一次真实 DOM 的更新。相比之下，直接操作真实 DOM 往往需要立即进行更新，这可能导致多次无谓的重排和重绘。
- 反应式编程：虚拟 DOM 结合了反应式编程的思想，通过声明式的方式描述 UI，并自动处理 UI 的更新。React 和其他虚拟 DOM 库提供了基于组件的开发模式，使得构建复杂交互界面更加简单、高效。
- 跨平台支持：虚拟 DOM 不仅能够在浏览器环境中使用，还可以在其他环境中使用，比如服务器端渲染（Server-side Rendering）或移动应用开发中。

![alt text](image.png)

**虚拟 DOM 并不意味着一定比直接操作真实 DOM 更快，对于简单的应用场景来说，直接操作真实 DOM 的性能可能更好。但是在处理大规模更新、频繁变化的复杂 UI 时，虚拟 DOM 技术能够提供更好的性能和开发体验**

### 虚拟 DOM 的工作原理

可以概括为以下几个步骤：
- 初始渲染：当应用程序加载时，首先进行一次初始渲染，将虚拟 DOM 结构构建出来。虚拟 DOM 是由 JavaScript 对象构成的树形结构，它对应于真实 DOM 的层次结构。
- 更新生成新虚拟 DOM：当应用程序的状态发生变化时（比如用户交互），需要更新 UI。这时会生成一个新的虚拟 DOM 树，新的虚拟 DOM 表示了更新后的 UI 状态。
- 对比差异：将新的虚拟 DOM 树与之前的虚拟 DOM 树进行对比，找出两者之间的差异（即哪些节点需要被更新、添加或删除）。这个对比过程的算法被称为"Diffing"。
- 生成更新：根据对比得出的差异，生成一个表示更新操作的"补丁"（Patch）对象。该补丁对象包含了需要修改真实 DOM 的具体操作，比如添加节点、删除节点、更新属性等。
- 应用更新：将补丁对象应用到真实 DOM 上，即将所有的变更操作一次性地应用到真实 DOM 上，从而实现 UI 的更新。这个过程通常使用最小化 DOM 操作的方式进行，以提高性能。


## 说说 Vue 的 keep-alive(组件缓存) 使用及原理

keep-alive：vue的一个内置组件。作用是缓存组件，让其不被销毁。可以使被包含的组件保留状态，或避免重新渲染。

提供了include(缓存),exclude(不缓存)两个属性，可以选择性保存组件。

因为keep-alive会将组件保存在内存中，并不会销毁以及重新创建，所以不会重新调用组件的created等方法，需要用activated与deactivated这两个生命钩子来得知当前组件是否处于活动状态。

### 实现 keep-alive 组件

created、destroyed钩子：
 - created：创建一个cache，用来做缓存容器，保存vnode节点
 - destroyed：在组件被销毁时，清除cache里的组件实例

render钩子：首先通过getFirstComponentChild获取第一个子组件，获取该组件的name（存在组件名则直接使用组件名，否则会使用tag）。接下来会将这个name通过include与exclude属性进行匹配，匹配不成功（说明不需要进行缓存）则不进行任何操作直接返回vnode，vnode是一个VNode类型的对象

```js
render () {
    /* 得到slot插槽中的第一个组件 */
    const vnode: VNode = getFirstComponentChild(this.$slots.default)

    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
        // check pattern
        /* 获取组件名称，优先获取组件的name字段，否则是组件的tag */
        const name: ?string = getComponentName(componentOptions)
        /* name不在inlcude中或者在exlude中则直接返回vnode（没有取缓存） */
        if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
        )) {
            return vnode
        }
        const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
        /* 如果已经做过缓存了则直接从缓存中获取组件实例给vnode，还未缓存过则进行缓存 */
        if (this.cache[key]) {
            vnode.componentInstance = this.cache[key].componentInstance
        } else {
            this.cache[key] = vnode
        }
        /* keepAlive标记位 */
        vnode.data.keepAlive = true
    }
    return vnode
}
```

## 生命周期

单一组件钩子执行顺序：

1. beforeCreate
2. created
3. beforeMount
4. mounted
5. beforeUpdate
6. updated
7. activated
8. deactivated
9. beforeDestroy
10. destroyed
11. errorCaptured

activated, deactivated 是组件keep-alive时独有的钩子

![1775049240951](image/vue/1775049240951.png)


## Vue 父子组件生命周期触发顺序是怎样的

顺序：父组件先创建，然后子组件创建；子组件先挂载，然后父组件挂载。

```
父beforeCreate -> 父create -> 子beforeCreate-> 子created -> 子mounted -> 父mounted
```

加载渲染过程：
```
父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted
```

更新过程：
```
父beforeUpdate->子beforeUpdate->子updated->父updated
```

销毁过程：
```
父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
```

常用钩子简易版：
```
父create->子created->子mounted->父mounted
```

- beforeCreate执行时：data和el均未初始化，值为undefined
- created执行时：Vue 实例观察的数据对象data已经配置好，已经可以得到data的值，但Vue 实例使用的根 DOM 元素el还未初始化
- beforeMount执行时：data和el均已经初始化，但此时el并没有渲染进数据，el的值为“虚拟”的元素节点
- mounted执行时：此时el已经渲染完成并挂载到实例上
- beforeUpdate和updated触发时，el中的数据都已经渲染完成，但只有updated钩子被调用时候，组件dom才被更新。
- 在created钩子中可以对data数据进行操作，这个时候可以进行数据请求将返回的数据赋给data
- 在mounted钩子对挂载的dom进行操作，此时，DOM已经被渲染到页面上。
- 虽然updated函数会在数据变化时被触发，但却不能准确的判断是那个属性值被改变，所以在实际情况中用computed或watch函数来监听属性的变化，并做一些其他的操作。
- 所有的生命周期钩子自动绑定 this 上下文到实例中，所以不能使用箭头函数来定义一个生命周期方法 (例如 created: () => this.fetchTodos()),会导致this指向父级。
- 在使用vue-router时有时需要使用来缓存组件状态，这个时候created钩子就不会被重复调用了，如果我们的子组件需要在每次加载或切换状态的时候进行某些操作，可以使用activated钩子触发。
- 父子组件的钩子并不会等待请求返回，请求是异步的，VUE设计也不能因为请求没有响应而不执行后面的钩子。所以，我们必须通过v-if来控制子组件钩子的执行时机

## Vue.nextTick 的实现

使用`Vue.nextTick()`是为了可以获取更新后的DOM 。
触发时机：在同一事件循环中的数据变化后，DOM完成更新，立即执行`Vue.nextTick()`的回调。

> 同一事件循环中的代码执行完毕 -> DOM 更新 -> nextTick callback触发

![img](https://pic1.zhimg.com/v2-4c5d4f1d8ebd197ce9a58038d86e9bf8_1440w.jpg)

概念回顾：事件循环

- 顺序：主线程（调用栈） --> **微任务**  --> 宏任务
- 微任务队列：`Promise`、`mutation observer`、`queneMicrotask`等
- 宏任务队列：`setTimeout`、`setInterval`、`xhr`、`I/O`、`UI rendering`等

![Event Loop](https://wangtunan.github.io/blog/assets/6-CK3rAxLD.png)

背景：当我们更新了状态(数据)的时候，需要立即对更新的 DOM 进行一些操作，但是此时，我们是获取不到更新后的 DOM 的，因为在本次的更新操作当中，DOM 并没有立即更新。Vue在修改数据后，视图不会立刻更新，而是等**同一事件循环**中的所有数据变化完成之后，再统一进行视图更新。

解决方案：使用`nextTick`方法。

![img](https://pica.zhimg.com/v2-2431bed1bef1661c58e9049f47eecf44_1440w.jpg)

`tick`：主线程的执行过程就是一个`tick`，而所有的异步结果都是通过任务队列来调度。`Event Loop` 分为宏任务和微任务，无论是执行宏任务还是微任务，完成后都会进入到一下`tick`，**并在两个`tick`之间进行UI渲染**。

`nextTick`：在下次 DOM 更新后执行回调。在修改数据之后立即使用这个方法，以获取更新后的 DOM。

- 参数：
  - cb：回调函数，存储需要在下次DOM更新后执行的操作
  - ctx：上下文对象，存储回调函数的执行环境

```js
new Vue({
  //...
  methods: {
    //...
    change() {
      // 修改数据改变状态
      this.msg = "hello";
      this.nextTick(() => {
        // 获取更新后的DOM然后执行相对应的操作
        this.changeDom();
      });
    },
  },
});
```

### 下次DOM更新是什么时候？

vue中，状态发生改变 --> 通知`watcher` --> `watcher`通知页面发生更新 --> 触发虚拟DOM的patch流程 --> 更新页面视图

注意， `Watcher` 触发虚拟 Dom 的流程是异步的，Vue 当中有一个队列，每当需要渲染时，会将 `Watcher` 推送到这个队列当中（如果队列当中已经有相同的 `Watcher` 则不添加），在下次事件循环中让 `Watcher` 触发渲染流程。

### nextTick原理

原理：利用事件循环来进行异步操作，然后等 vue 的事件循环结束之后，再执行回调函数。

- 能力检测：检查可以使用的延迟调用方式，记为`timerFunc`
  - 优先级：Promise --> MutationObserver --> setImmediate --> setTimeout。
  - nextTick 优先使用Promise和MutationObserver，因为他俩属于微任务，会在执行栈空闲的时候立即执行，响应速度比setTimeout更快，因为无需等渲染。而setImmediate和setTimeout属于宏任务，执行开始之前要等渲染，即task->渲染->task。
- 假设Promise可以使用，`nextTick` 会通过 `Promise.resolve()`来创建一个成功的 `Promise`，然后再通过 `Promise.then()`或者其他方式将回调函数添加入微任务队列。
- 设置状态锁`pedding`，通过`pedding`来判断当前队列当中是否已经存在一个`nextTick`的任务，避免多次执行`nextTick`的任务

**核心流程**：

- 把传入的回调函数`cb`压入`callbacks`数组
- 执行`timerFunc`函数，延迟调用 `flushCallbacks` 函数
- 遍历执行 `callbacks` 数组中的所有函数



```js
// 存放回调函数的数组
const callbacks = [];

// 判断当前事件循环当中是否存在nextTick
let padding = false;

// 在事件循环当中执行回调函数
function flushCallbacks() {
  // 本轮事件循环当中的nextTick已经执行完成，将pedding的状态变成false
  pedding = false;

  // 拷贝回调函数的数组
  const copies = callbacks.slice(0);

  // 将存放回调函数的数组清空
  callbacks.length = 0;

  // 执行回调函数
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// 微任务
let microTimerFunc;
// 宏任务
let macroTimerFunc;
// 判断当前是否使用宏任务
let useMacroTask = false;

// 进行环境验证
//如果当前环境支持setImmediate，则使用setImmediate将回调函数添加到宏任务队列
if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
  macroTimerFunc = () => {
    setImmediate(flushCallbacks);
  };
}
// 如果当前环境支持MessageChannel，则使用MessageChannel将回调函数添加到宏任务队列
else if (
  typeof MessageChannel !== "undefined" &&
  (isNative(MessageChannel) ||
    MessageChannel.toString() === "[object MessageChannelConstructor]")
) {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = () => {
    port.postMessage(1);
  };
} else {
  macroTimerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

// 判断当前环境是否支持Promise
if (typeof Promise !== "undefined" && isNative(Promise)) {
  //创建一个Promise对象
  const p = Promise.resolve();

  // 将flushCallbacks添加到微任务
  microTimerFunc = () => {
    p.then(flushCallbacks);
  };
} else {
  //当前环境不支持Promise，则直接添加到宏任务当中
  microTimerFunc = macroTimerFunc;
}

export function withMacroTask(fn) {
  return (
    fn._withTask ||
    (fn.withTask = function () {
      useMacroTask = true;
      const res = fn.apply(null, arguments);
      useMacroTask = false;
      return res;
    })
  );
}


/**
 *
 * @param {*} cb 下一次Dom更新后执行的回调函数
 * @param {*} ctx 回调函数的上下文对象
 */
export function nextTick(cb, ctx) {
  let _resolve;
  //将回调函数缓存到callbacks当中
  callbacks.push(() => {
    //判断当前是否有回调函数
    if (cb) {
      // 将当前回调函数的this指向ctx上下文对象并执行
      cb.call(ctx);
    } else if (_resolve) {
      // 将Promise返回出去
      return _resolve(ctx);
    }
  });

  //判断当前事件循环当中是否存在nextTick
  if (!pedding) {
    //将当前状态更改为true，表示事件队列当中已经有nextTick了
    pedding = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }

  //如果回调函数不存在，并且环境支持Promise，则nextTick会返回一个Promise
  if (!cb && typeof Promise !== "undefined") {
    //返回一个成功状态的回调函数
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```



## 讲讲 Vue diff 算法

背景：`vue`节点的更新方式是对`vdom`进行比较。当更新前的容器中的内容是一组子节点时，且更新后的内容仍是一组节点。如果不采用`diff`算法，那么最简单的操作就是将之前的`dom`全部卸载，再将当前的新节点全部挂载。但是直接操作dom对象是非常耗费性能的。



diff算法：找出两组vdom节点之间的差异，并尽可能的复用dom节点，降低更新操作的性能消耗。

