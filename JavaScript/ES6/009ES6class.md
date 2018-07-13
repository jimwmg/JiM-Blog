---
title:  ES6 class 
date: 2016-12-15 12:36:00
categories: ES6
comments : true 
updated : 
layout : 
---

### 1 class declarations 可以用以下三种方式声明class类，必须先声明在使用；每一个使用class方式定义的类默认都有一个**constructor**函数， 这个函数是构造函数的主函数， 该函数体内部的**this**指向生成的实例

An important difference between **function declarations** and **class declarations** is that function declarations are  hoisted(变量提升) and class declarations are not. You first need to declare your class and then access it,

```javascript
 var Rect = class Rect {
        constructor(height,width){		
            this.height = height ;
            this.width = width ;
        }
    }

    var Rect = class {
        constructor(height,width){
            this.height = height ;
            this.width = width ;
        }
    }
    
    class Rect {
        constructor(height,width){
            this.height = height ;
            this.width = width ;
        }
    }
```



### 2 对比ES5和ES6中的差别

constructor内定义的方法和属性是实例对象自己的，而constructor外定义的方法和属性则是所有实例对象可以共享的。

2.1 创建类的过程差别

ES5中:

```javascript
function RectAngle(height,width){
  this.height = height ;
  this.width = width ;
}
RectAngle.prototype.getArea = function(){
  return this.calcArea();
}
RectAngle.prototype.calcArea = function(){
  return this.height*this.width;
}
console.dir(RectAngle) ;//输出下构造函数
var rectAngle = new RectAngle(10,10);
console.log(rectAngle);
console.log(rectAngle.getArea());
console.log(rectAngle.__proto__ === Rectangle.prototype); //true
```

ES6中:

```javascript
 class Rect {
   //定义构造函数，类似于上面的RectAngle函数
   constructor(height,width){
     this.height = height ;
     this.width = width ;
   }
   //定义原型方法 类似于ES5中的Rect.prototype.getArea = function(){};
   getArea(){
     return this.calcArea();
   }
   calcArea(){
     return this.height*this.width ;
   }   
  //以上所有定义的函数，都在Rect.prototype这个对象上；
 }
console.dir(Rect) ;
const square = new Rect(10,10);
console.log(square);
console.log(square.getArea());
console.log(square.__proto__ === Rect.prototype); //true
//class类的prototype属性和其实例化对象的__proto__ 全等,这点和ES5中的构造函数prototype和其实例化对象的__proto__全等一致
```

思考下，为什么ES6中 new 一个class会调用constructor函数？对比上面两种ES5 ES6的写法

```javascript
console.log(Rect === Rect.prototype.constructor) // true
```

所以new Rect() ==> 会调用constructor函数，同样因为两者都是指向Rect类，那么通过Rect.prototype.constructor 也可以访问到 Rect 类，以及Rect上的的静态方法等

2.2 类中的方法独立调用的时候，函数内部this指向不同

ES5中:原型上的方法被独立调用，非严格模式下，this会指向window，严格模式下指向undefined

```javascript
function RectAngle(height,width){
  this.height = height ;
  this.width = width ;
}
RectAngle.prototype.getArea = function(){
  return this;
}

var rectAngle = new RectAngle(10,10);
let getArea = rectAngle.getArea;
console.log(getArea());//window
```

ES6中: static方法或者原型上的方法被独立调用的时候，无论是否严格模式，其this指向都是undefined

```javascript
class Rect {
  constructor(height,width){
    this.height = height ;
    this.width = width ;
  }
  //定义原型方法 类似于ES5中的Rect.prototype.getArea = function(){};
  getArea(){
    return this;
  }
}
const square = new Rect(10,10);
let getArea = square.getArea;
console.log(getArea());//undefined
```

经过编译之后，其实就是

```javascript
let Rect = (function(){
    function Rect(height,width){
        this.height = height;
      	this.width = width;
    }
  	Rect.prototype.getArea = function(){
        return this
    }
    return Rect
})()
```

**ES6经过编译之后，其实就是上面的实现形式；所以当我们new Rect类的时候，其实就是和之前new Rect构造函数是一样的；**

2.3 class类中static声明的方法不能被实例调用，也不会出现在实例化对象上 ; 可以直接通过类名调用；

The static keyword defines a static method for a class. Static methods are called without [instantiating ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#The_object_(class_instance))their class and **cannot **be called through a class instance. Static methods are often used to create utility functions for an application.

```javascript
class Rect {
  constructor(height,width){ 	
    this.height = height ;
    this.width = width ;
  }
  getArea(){		//这个是Rect类的属性prototype上的方法
    return this.calcArea();
  }
  calcArea(){
    return this.height*this.width ;
  }
  //静态方法为class类定义了一个方法，该方法不能再class类的实例对象上使用
  static shortHBW (H,W){
    return H-W ;
  }
  //类似于 Rect.shortHBW = function(){return H-W }  直接声明的属性可以遍历到
  //不同之处在于static声明的静态属性是不可枚举的，即通过for-in循环无法遍历到；
}
console.log(Rect);//static方法其实就是class类的属性(函数的直接属性)
console.log(Rect.shortHBW(21,12) );//9  //static方法直接通过类名可以直接调用
console.log(Rect.getArea() ); //prototype method 不能直接通过类名调用，因为getArea方法在Rect.prototype.getArea()调用
//同时Rect函数，从对象的角度来看，getArea和clearArea方法都是在prototype属性上的，而属性的查找是沿着原型链__proto__取查找的，并不是沿着函数(对象)的prototype查找的；
```

**总结以上两者：**

**一，声明一个函数的时候，创建一个类的时候（类也是来自最基本的声明构造函数的封装），会创建一个prototype对象，该对象是所声明函数的一个属性（对象），同时该对象有一个constructor属性，指向所声明的函数（互相引用，无限循环）**

**二，extends关键字的作用就是 ：**主要是以下两个作用：

--**将子类(函数）的prototype对象上的`__proto__`指向父类（函数）的prototype属性,**

**`Dog.prototype.__proto__ = Animal.prototype`**

—**将子类`__proto__` 指向 父类 ` Dog.__proto__ = Animal`**

2.4 先来看下extends关键字的作用 class类实现继承的根本原因就是通过extends关键字，将子类的prototype.__ proto __ 属性指向父类构造函数prototype; 

constructor和其他方法均在 类的 prototype 对象上；

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + ' makes a noise.');
  }
}
class Dog {  //没有继承的情况下
  speak1() {
    console.log(this.name + ' barks.');
  }
}

console.dir(Dog);
console.dir(Animal);
console.log(Dog.__proto__ === Animal);//true
console.log(Dog.prototype.__proto__ === Animal.prototype) ;//true
```

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name + ' makes a noise.');
  }
}
class Dog extends Animal{   
  speak1() {
    console.log(this.name + ' barks.');
  }
}
Dog.speak1();//报错，因为查找一个对象的属性的时候，会沿着__proto__原型链去查找，并不会查找prototype属性
console.dir(Dog);
console.dir(Animal);
console.log(Dog.prototype.__proto__ === Animal.prototype) //true 这个是extends关键字的作用核心
//当我们通过new操作赋创建一个实例对象的时候，实例对象的__proto__属性会指向构造函数的prototype属性
//所以当我们new一个子类 的时候，实例对象dog.__proto__ = Dog.prototype 
//而在Dog.prototype.__proto__ = Animal.prototype ，所以实现了基于原型的继承；
//所以可以在子类里面重写继承的属性或者方法

console.log(Dog.__proto__ === Animal);//true  
//下面有关于new和__proto__的解释；
var dog = new Dog();
console.log(dog);
console.log(dog.__proto__ === Dog.prototype);//true  实例化的对象的原型属性指向的是构造函数的原型,而构造函数的原型属性指向的是父类构造函数
//关于__proto__属性的指向，指向的是对象的构造函数的prototype属性
```

先来看下什么是原型链：简单来说，在 javascript 中每个对象都会有一个` __proto__` 属性，当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么他就会去 `__proto__` 里找这个属性，这个` __proto__` 又会有自己的 `__proto__`，于是就这样一直找下去，也就是我们平时所说的原型链的概念。

**三：new操作符的作用**

```javascript
(1)创建一个构造函数，同时，该构造函数有一个pprototype属性，该属性是一个对象；
var F=function(){
  //this指向谁，在定义时是不知道的
};

var p=new F;
用new调用一个函数发生了这些事：（1）新建一个对象instance=new Object();
（2）设置原型链instance.__proto__=F.prototype;
（3）让F中的this指向instance，执行F的函数体。
（4）判断F的返回值类型：如果是值类型，就丢弃它，还是返回instance。如果是引用类型，就返回这个引用类型的对象，替换掉instance。
```

也就是说，所有的**对象o**都会有`__proto__`属性，该属性指向**对象o**的构造函数的prototype属性

以上所有建议读者在浏览器中打印台看下实际效果，理解更深刻；

2.5 constructor 方法，以及super关键字

2.5.1 The constructor method is a special method for creating and initializing an object created with a class； There can only be one special method with the name "constructor" in a class. A SyntaxError will be thrown if the class contains more than one occurrence of a constructor method.

A constructor can use the super keyword to call the constructor of a parent class.

constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。**constructor函数默认返回实例对象**

* 当创建一个新类的时候,如果没有显式的添加constructor函数,**那么默认将会添加一个空的constructor函数**

```javascript
class Parent {
  
}
//等价于
class Parent {
  constructor(){
    
  }
}
```

* 当子类继承父类的时候,如果子类没有显式的添加constructor函数,那么默认将会添加一个constructor,并且自动调用super方法;如果子类显式的添加了constructor函数，那么必须手动调用super方法，否则new实例对象的时候会报错；

```javascript
class Parent(){
  constructor(x){
    this.x = x
  }
}
class Child extends Parent{
  
}
//等价于
class Child extends Parent{
  constructor(){
    super()
    //此处的super虽然代表了父类的构造函数,但是其返回的是子类Child的实例对象,即super内部的this指的是Child类,相当于super( ) ==>  Parent.prototype.constructor.call(this)
  }
}
//这个在项目中有使用，要注意这个特性，勿忘记；
```

2.5.2 super有三种作用， **第一是作为构造函数直接调用**，**第二种是在普通方法中指向父类的原型对象prototype**， 第三种是在子类中的静态方法中指向父类(class函数)；super关键字，它指代父类的实例（即父类的this对象）。子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象

**注意使用super关键字的时候,必须要显式的指定是作为构造函数还是作为对象(prototype对象或者类的实例对象),否则会报错,比如直接console.log(super),则会报错**

```javascript
class Cat {
  constructor(name,color) {
    this.name = name;
    this.color = color;
  }
  speak() {
    console.log(this.name + ' makes a noise.');
  }
}
class Lion extends Cat {
  constructor(name,color,age){
    super(name,color);//第一个作用，作为构造函数直接调用，必须先调用，用来确定子类实例对象的this指向
    this.age = age ;
  }
  speak() {
    super.speak();//第二个作用，super 作为父类实例调用父类的方法
    console.log(this.name + ' roars.');
  }
}
var lion = new Lion("JErry","white",12);
lion.speak();
```

* 注意,通过super调用父类的方法的时候,super会绑定子类的this


  其实super关键字指向的是使用该关键字对象的prototype属性，正好结合extends作用是子函数(对象)的prototype.`__proto__` 指向父函数的prototype；所以就可以访问到父函数中的prototype对象上的属性和方法

```javascript
//MDN上关于super关键字作用的解释；
var obj1 = {
  method1() {
    console.log('method 1');
  }
}

var obj2 = {
  method2() {
    super.method1();
  }
}

Object.setPrototypeOf(obj2, obj1);
obj2.method2(); // logs "method 1"
```


2.6 classs类中的 get 和 set    对某个属性设置存值函数和取值函数， 拦截该属性的存取行为

下面这个栗子是对name属性的设置值以及获取值

```javascript
class People {
        constructor(name) { //构造函数
            this.name = name;
        }
        get name() {
            return this._name.toUpperCase();
        }
        set name(value) {
            this._name = value;
        }
        sayName() {
            console.log(this.name);
        }
    }
    var p = new People("tom");
    console.log(p);
    console.log(p.name);    //TOM
    console.log(p._name);    //tom
    p.sayName(); //TOM
```

