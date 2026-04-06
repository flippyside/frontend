// 模拟执行上下文的产生

function one() {
    var a = 1
    function two() {
        var b = 2
        function three() {
            var c = 3
            console.log(a, b, c);
        }
        three();
    }
    two();
}

one();

// 调用栈，从左往右为栈顶到栈底
var executeContextStack = []

var globalExecuteContext = {
    VO: {
        one: '() => {}'
    }
}

executeContextStack = [globalExecuteContext]

var oneExecuteContext = {
    VO: {
        a: 1,
        two: '() => {}'
    }
}

executeContextStack = [oneExecuteContext, globalExecuteContext]

var twoExecuteContext = {
    VO: {
        b: 2,
        three: '() => {}'
    }
}

executeContextStack = [twoExecuteContext, oneExecuteContext, globalExecuteContext]

var threeExecuteContext = {
    VO: {
        c: 3
    }
}

executeContextStack = [threeExecuteContext, twoExecuteContext, oneExecuteContext, globalExecuteContext]

// 作用域链的查找过程
function getVariableValue(varName) {
    for (let i = 0; i < executeContextStack.length; i++) {
        if (varName in executeContextStack[i].VO) {
            return executeContextStack[i].VO[varName]
        }
    }
}