### 执行上下文 Execution Context

- 函数运行时产生执行上下文
- 执行上下文中会创建对象，叫做变量对象（Value Object）
  - 基础数据类型直接放在变量对象中
  - 引用数据类型保存在堆中

```js
function task(){
	var a = 1;
	var b = {
		name: 'zhufeng'
	}
  var c = [1, 2, 3]
}
```

