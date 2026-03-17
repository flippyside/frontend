// 类： 类的组成： 构造函数、属性（实例属性，原型属性、静态属性）、方法 （实例的方法，原型方法，静态方法） 访问器， 静态相关的配置


class Circle {
    // 给这个类来声明属性 
    private x:number
    public y:number
    public fn: ()=> void
    constructor(x:number,y:number = 200){ // 函数
        this.x = x;
        this.y = y;
        this.fn = ()=>{}
    }
}
// 类的修饰符
// public 公开属性，类的实例在外部可以访问这个属性，类的内部也可以访问，继承的子类也可以访问
// protected (我自己能访问，儿子能访问，外部无法访问)
// private (私有的 自己能访问)

// 平时我们一般采用public 或者private的场景比较多.

// readonly 标识仅读属性，意味着如果初始化后，不能被修改

// let circle = new Circle(100,100)

class Animal {
    constructor(protected  name:string){ // 等价于 每个属性增添了public
    }
    // 原型方法 就是每一个实例共享的方法 , 父类提供的方法 子类是可以进行方法重写的
    // 原型的函数：void 意味着是不关心函数的返回值，并不是空的意思
    protected changeName(value:string,age:number):void{
        this.name = value
    }
    // 原型属性 需要通过访问器来实现
    get aliasName(){ 
        return '$' + this.name;
    }
    set alisName(name:string){
        this.name = name;
    }
    static a = 1;
    static getA(){
        return this.a
    }
}
// super在构造函数 指向的是父类，在原型的方法中调用的时候指向的是父类的原型
class Cat extends Animal {
    constructor(name:string,public readonly age:number){
        super(name); // Animal.call(this)
        // this.age = age;
    }
    // 子类在重写父类方法要兼容, 赋予的函数可以兼容父类
    protected changeName(value:string){
        super.changeName(value,100)
        return 'abc'
    }
}
const tom1 = new Cat('tom',30)
const tom2 = new Cat('tom',30)

console.log(Cat.getA()); 

// console.log(tom1.aliasName === tom2.aliasName)
// tom.changeName('jerry')
// 以上用法同es6

// super在 类中访问 constructor / static函数中执指向的都是父类  ,在原型方法中， 属性访问器都是 父类的原型


class Singleton{
    static instance = new Singleton(); // 自己本身创造一个实例，后续一致用这一个，不产生多个
    protected constructor(){ } // 增加protected之后 构造函数不能被new了
    static getInstance(){
        return this.instance
    }
}
// 类在什么时候 不用外面new
let instance = Singleton.getInstance();


// ts 中有抽象类概念， abstract 不存在的
// 抽象类 可以含义非抽象的方法和属性 ， 不会new它 , 抽象类可以被继承，抽象类中抽象方法子类必须要实现

{
    abstract class Animal{
        public abstract a:string
        drink(){ // 非抽象，已经有实现了
            console.log('喝水')
        }
        abstract eat():void // 抽象的方法，父类没有实现，那么子类必须实现
    }
    class Cat extends Animal{
        public a!: string;
        eat(): void {
            throw new Error("Method not implemented.");
        }
    }
    // 因为我们编写的代码的时候 ， 慢慢的脱离继承了。 组合优于继承。   类的装饰器（redux，nest， mobx）
}



export {}
