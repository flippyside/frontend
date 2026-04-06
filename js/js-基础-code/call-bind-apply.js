
function func(...args) {
    console.log(this.name);
    console.log(args);
}

let obj = { name: 'hello' }

/* call的原理：
obj.func = func
obj.func() 
delete obj.func
*/

!(
    function (prototype) {
        function getDefaultContext(context) {
            // 如果没有传入context，默认为window
            context = context || window

            // 包装成对象类型，以防传入的是基本数据类型
            context = Object(context)
            return context
        }

        function my_call(context, ...args) {
            context = getDefaultContext(context)
            let symbol = Symbol('fn')
            context[symbol] = this
            context[symbol](...args)
            delete context[symbol]
        }
        function my_apply(context, ...args) {
            context = getDefaultContext(context)
            let symbol = Symbol('fn')
            context[symbol] = this
            context[symbol](...args)
            delete context[symbol]
        }
        function my_bind(context, ...outerArgs) {
            return (...args) => {
                this.call(context, ...outerArgs, ...args)
            }
        }
        prototype.my_bind = my_bind
        prototype.my_call = my_call
        prototype.my_apply = my_apply
    }
)(Function.prototype)

func.my_call(obj)
func.my_call(obj, 10, 'beijing')

func.my_apply(obj, [10, 'beijing'])

let bindedFunc = func.my_bind(obj, 10)
bindedFunc('123')


Function.prototype.call = function (obj, ...args) {
    const context = obj
    const fn = Symbol()
    context[fn] = this
    const result = context[fn](...args)
    delete context[fn]
    return result
}

Function.prototype.apply = function (obj, args) {
    const context = obj
    const fn = Symbol()
    context[fn] = this
    const result = context[fn](...args)
    delete context[fn]
    return result
}
