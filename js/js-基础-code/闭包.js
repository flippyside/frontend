function one() {
    var a = 1
    function two() {
        var b = 2
        function three() {
            var c = 3
            return () => {
                var d = 4
                console.log(a, b, c, d);
            }
        }
        return three()
    }
    return two()
}

var fn = one()
fn()

let globalEC = {
    this: globalThis,
    outer: null,
    VE: { one: () => { }, fn: undefined }
}

let oneEC = {
    outer: globalEC,
    VE: { a: 1, two: () => { } }
}

let twoEC = {
    outer: oneEC,
    VE: { b: 2, three: () => { } }
}

let threeEC = {
    outer: twoEC,
    VE: { c: 3 }
}

let fnEC = {
    outer: globalEC, // 注意，fn在全局声明
    VE: { d: 4 },
    closures: [{ c: 3 }, { b: 2 }, { a: 1 }]
}

// 寻找变量的值的过程：先找自己的VE，再找闭包，最后找outer作用域链
function getValue(name, ec) {
    if (name in ec.VE) {
        return ec.VE[name]
    }

    for (let i = ec.closures.length - 1; i >= 0; i--) {
        if (name in ec.closures[i]) {
            return ec.closures[i][name]
        }
    }

    if (ec.outer) {
        return getValue(name, ec.outer)
    }
}

console.log(getValue('a', fnEC));
