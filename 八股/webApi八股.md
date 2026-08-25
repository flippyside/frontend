## MutationObserver：监测 DOM 的变化并执行回调

MutationObserver可以观察目标节点或其子节点的任何更改，例如添加、删除或修改子节点、属性变化、文本变化等等。

与事件不同，Mutation Observer 则是微任务异步触发，DOM 的变动并不会马上触发，而是要等到当前所有 DOM 操作都结束才触发。

- 它等待所有脚本任务完成后，才会运行（即异步触发方式）。
- 它把 DOM 变动记录封装成一个数组进行处理，而不是一条条个别处理 DOM 变动。
- 它既可以观察 DOM 的所有类型变动，也可以指定只观察某一类变动。

具体步骤
- 使用MutationObserver创建一个observer实例，传入参数为DOM变化时要执行的回调。
- 将要监视的DOM节点绑定到observer上。


```js
// 选择一个要监听的节点
const targetNode = document.body

// 创建一个新的 MutationObserver
const observer = new MutationObserver(() => {
  if (document.getElementById('xxx')) {
    // TODO: 一些依赖于xxxDOM节点的操作
    observer.disconnect(); // 销毁监视者
  }
})

const config = { childList: true, subtree: true } // 对哪些更改做出反应

// 绑定目标节点并启动监视者
observer.observe(targetNode, config)
```

应用场景
- 编辑器自动保存：MutationObserver监听编辑器节点，在文本变化时执行保存操作