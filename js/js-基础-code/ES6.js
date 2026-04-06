// 模拟ES6中的执行上下文变化

function fn() {
    var a = 1
    let b = 2
    {
        let b = 3
        var c = 4
        let d = 5
        console.log(a, b, c, d);
    }
    {
        let b = 6
        let d = 7
        console.log(a, b, c, d);
    }
}
fn();


// 1. 全局下编译
let globalEC = {
    outer: null, // outer: 外部执行上下文环境，相当于ScopeChain
    variableEnvironment: { fn() { } },
    lexicalEnviroment: {}
}
// 2. 编译fn
// 静态作用域
let fnEC = {
    this: globalThis,
    // fnEC.outer等于声明fn变量的执行上下文环境对象中的variableEnvironment
    outer: globalEC.variableEnvironment,
    variableEnvironment: { a: undefined, c: undefined },
    lexicalEnviroment: { b: undefined }
}

// 执行fn
fnEC.variableEnvironment.a = 1
fnEC.variableEnvironment.b = 2
// 进入第一个代码块
// 每当函数执行遇到了一个新的代码块，会创建一个新的词法环境对象
fnEC.lexicalEnviroment.push({ b: undefined, d: undefined })
fnEC.lexicalEnviroment[1].b = 3
fnEC.variableEnvironment.c = 4
fnEC.lexicalEnviroment[1].d = 5
// 进入第二个代码块
fnEC.lexicalEnviroment.pop()
fnEC.lexicalEnviroment.push({
    b: undefined, d: undefined
})
fnEC.lexicalEnviroment[1].b = 6
fnEC.lexicalEnviroment[1].d = 7


// 沿着作用域链，寻找变量的值的过程：
function getValue(name, ec) {
    for (let i = ec.lexicalEnviroment.length - 1; i >= 0; i--) {
        if (name in ec.lexicalEnviroment[i]) {
            return ec.lexicalEnviroment[i][name]
        }
        if (name in ec.variableEnvironment) {
            return ec.variableEnvironment[name]
        }
    }
    if (ec.outer) {
        return getValue(name, ec.outer)
    }
}