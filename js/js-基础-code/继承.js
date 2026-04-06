// 继承
class Father {
    name;
    static staticFatherName = 'FatherName';
    static staticGetFatherName = function () {
        console.log(Father.staticFatherName);
    };
    constructor(name) {
        this.name = name;
        this.name = name;
    }
    getName() {
        console.log(this.name);
    }
}
class Child extends Father {
    name;
    age;
    static staticChildName = 'ChildName';
    static staticGetChildName = function () {
        console.log(Child.staticChildName);
    };
    constructor(name, age) {
        super(name);
        this.name = name;
        this.age = age;
        this.age = age;
    }
    getAge() {
        console.log(this.age);
    }
}
let child = new Child("abc", 10);
child.getName();
child.getAge();
Child.staticGetChildName();
Child.staticGetFatherName();
export {};
