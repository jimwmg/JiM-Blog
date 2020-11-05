---
title: typeScript
date: 2017-9-26
categories: typescript
tags: 
---

### 1 基础数据类型

**TypeScript 中，使用 `:` 指定变量的类型，`:` 的前后有没有空格都可以。**

* 基础数据类型 number boolean string null undefined symbol 以及typescript新增的void; 声明变量的时候， ： 之后限制了变量的类型，那么，该变量就只能被赋值为限定的数据类型的值；
* any表示变量可以被赋值为任意类型的值；可以访问任意类型的任意属性；
* 联合类型表示取值可以为多种类型中的一种，当访问联合类型的属性的时候，如果联合类型不确定，那么typescript只能访问联合类型的共有属性；当联合类型可以推断出来的时候，那么只能访问该类型对应的属性

```typescript
let num:number = 5 ;   let bool:boolean = true ;     let str:string = 'myStr' ; 
let n:null = null ;    let u:undefined = undefined ; 
//=====
let anyThing:any = 'name';
anyThing = 5;
anyThing = true ;
//====
let union : string|number ;
union = 5 ;
union = 'five';
union = true; //报错；
```

### 2 复杂数据类型

* 复杂数据类型（对象接口）在 TypeScript 中，使用接口（Interfaces）来定义对象的类型。

  在面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implements）。

  TypeScript 中的接口是一个非常灵活的概念，除了可用于[对类的一部分行为进行抽象](https://ts.xcatliu.com/advanced/class-and-interfaces.html#类实现接口)以外，也常用于对「对象的形状（Shape）」进行描述。

  **变量的形状必须和接口保持一致，属性不允许比接口多，也不允许比接口少；**

* 可选属性和只读属性：对于可选属性，在声明变量的时候，可以不进行声明，对于只读属性，声明之后则不在允许变更

* 函数类型

```typescript
interface  Person {
    name:string;
  	age :number;
}
let libei :Person = {
    name:"liubei",
  	age:14
}
//===========
interface Dog {
    color:"string";
    age?:number;          //属性后面加一个 ？  表示该属性在声明变量的时候可有可无
    readonly id:number;   //属性前面加一个readonly。表示该属性在声明之后不在允许改变
}
let dog :Dog = {
    color:'yellow',
    age:13 , //可有可无
    id:17897
}
dog.id = 6666; //报错；
interface Func {
    (s:string,n:number) : boolean ;
}
let f:Func ;
f = function(str:string,num:number):boolean{
    return str.length > num ;
}
```

* 内置对象(ECMAScript内置对象和DOM ，BOM 内置对象)

**D**ocument **O**bject **M**odel（文档对象模型），就是把「文档」当做一个「对象」来看待。
相应的，**B**rowser **O**bject **M**odel（浏览器对象模型）,即把「浏览器」当做一个「对象」来看待。

在 DOM 中，文档中的各个组件（component），可以通过 object.attribute 这种形式来访问。一个 DOM 会有一个根对象，这个对象通常就是 document。

而 BOM 除了可以访问文档中的组件之外，还可以访问浏览器的组件，比如问题描述中的 navigator（导航条）、history（历史记录）等等。

比如 document. Event NodeList 

```typescript
let o:Object = {name:"Jhon",age:13} ;
let b:Boolean = new Boolean(1);
let r:RegExp = new RegExp('abc');
let d:Date = new Date();
//===========
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function(e: MouseEvent) {
  // Do something
});
```

* 数组类型

```typescript
let arr :number[];
arr = [1,2,3];
let arr2 :(number|string)[];
arr2 = [1,2,3,'Jim'];
let arr3 : Array<number> ;
arr3 = [4,5,6];
let arr4 : Array<number|string|boolean>;
arr4 = [1,false,'Jhon'] ;
let arr5 :any[];
arr5 = [1,'Jhon',false,null];
interface StringArray { 
    [index:number]:string;//对象的元素为字符串,对象的索引为number类型
} 
let myArr : StringArray = ['Jhon',"Jim"];
```

### 3 类实现接口

实现（implements）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 `implements` 关键字来实现。这个特性大大提高了面向对象的灵活性。

#### 3.1.先看类的基本定义和使用

JS中的基本写法

```javascript
class ClassWithStaticField {
  static staticField = 'static field';
	//static staticField;  如果没有设定初始值，那么该值会被设定为undefined
 static staticMethod() {
    return 'static method has been called.';
  }
	instanceField = 'instance field';
	//instanceField  没有设定初始化程序的字段将默认被初始化为undefined
	publicMethod() {
    return 'hello world';
  }
}
const classWithStaticField = new ClassWithStaticField()
console.log(ClassWithStaticField.staticField);
// 预期输出值: "static field"​
console.log(classWithStaticField.instanceField)
//预期输出值：instance field
```

TS中的基本写法

```typescript
class Animal {
    static origin = new Point(0, 0);
    /** 静态方法，计算与原点距离 */
    static distanceToOrigin(p: Point) {
        return Math.sqrt(p.x * p.x + p.y * p.y);
    }
    name:string;//实例属性
  	constructor(theName:string){
        this.name = theName;
    }
  	setName(newName:string){
        this.name = newName;
    }
}
```

#### 3.2.类实现接口

```typescript
interface ClockInterface1 {
  currentTime: Date;
  setTime(d: Date);
}
class Clock1 implements ClockInterface1 {
  currentTime: Date;//currentTime是类Clock1的一个成员，和其中的函数setTime以及构造函数constructor同等的地位，他的作用是限制了currentTime的数据类型为Date,(Typesctipt的内置对象)
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) { }
} 
```



举例来说，门是一个类，防盗门是门的子类。如果防盗门有一个报警器的功能，我们可以简单的给防盗门添加一个报警方法。这时候如果有另一个类，车，也有报警器的功能，就可以考虑把报警器提取出来，作为一个接口，防盗门和车都去实现它：

```javascript
interface Alarm {
    alert(): void;
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}
```

一个类可以实现多个接口

```javascript
interface Alarm {
    alert(): void;
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```



