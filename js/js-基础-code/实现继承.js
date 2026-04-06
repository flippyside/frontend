var Father = (function () {
    Father.staticFatherName = 'FatherName'
    Father.staticGetFatherName = function () {
        console.log(Father.staticFatherName)
    }

    Father.prototype.getName = function () {
        console.log(this.name)
    }

    function Father(name) {
        this.name = name
    }
    return Father
})()

function _extends(Child, Father) {
    // 1. 静态继承：让Child继承Father的static属性
    Child.__proto__ = Father;
    // 2. 让Child继承Father原型上的属性，即让new child()实例对象的__proto__指向Father.prototype，且不破坏constructor
    function Temp() {
        // constructor指向Child的构造函数
        this.constructor = Child
    }
    Temp.prototype = Father.prototype
    Child.prototype = new Temp()
}

var Child = (function (_super) { // _super = father
    // 继承Father的static属性和Father原型上的属性
    _extends(Child, _super);
    function Child(name) {
        // 3. 继承Father的私有属性：对Child的实例 执行Father构造函数
        _super.call(this, name)
        this.age = age
    }
    Child.staticChildName = 'ChildName'
    Child.staticGetChildName = function () {
        console.log(Child.staticChildName)
    }

    Child.prototype.getAge = function () {
        console.log(this.age)
    }
    return Child
})()