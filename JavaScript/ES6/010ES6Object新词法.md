---
title:  ES6 object 对象新词法
date: 2016-12-13 12:36:00
categories: ES6
comments : true 
updated : 
layout : 
---

ES6 Object

### 1 对象新词法:允许在声明对象字面量时使用简写语法，来初始化属性变量和函数的定义方法，直接写变量，这时，属性名为变量名, 属性值为变量的值。

```javascript
    function getPerson(name,age,gender){
        return {
            name,
            age,
            gender,
            sayHello(){
                console.log('my name is'+this.name);
            }
        };
    }
//等价于
    function getPerson(name,age,gender){
        return {
            name: name ,
            age :age ,
            gender: gender,
            sayHello:function(){
                console.log('my name is'+this.name);
            }
        };
    }

    let p = getPerson("Jhon",18,'man');
    console.log(p);
    p.sayHello();
//当然了混合这新词法和以前的定义方式定义对象也是可以的
```

```javascript
var foo = 'bar';
var obj = {foo};
//等价于
var obj = {foo:foo};//变量名:变量值
```

#### 1.1 ES6 允许在声明对象的时候，对象的属性名可以是表达式，同时方法名也可以是表达式;

```javascript
//javascript语言中定义对象的属性时候有以下两种方式
var obj = { } ;
//方式一
obj.foo = 'bar';
//方式二
obj['na'+'me'] = "Jhon";
```

```javascript
//在ES5中声明对象字面量时，只允许用第一种方式声明属性名，在ES6中允许使用第二种表达式的方式声明属性名
//ES5中
var obj = {foo:true,abc:123,sayHello:function(){console.log('hello you')}};
//ES6中,对象的属性名可以是表达式
var property = 'foo';
var obj = {[property]:true,['a'+'ba']:123,['say'+'Hello'](){console.log('hello you')}}
```

#### 1.2 注意一点，对象的**属性名可以是表达式**，但是不能和**简写语法**一起用

```javascript
var property = 'foo';
var obj = {[property]} ;//会报错
```

#### 1.3 属性名表达式如果是一个对象的话，默认情况下会转化为对象的字符串表示，属性名会覆盖

```javascript
const keyA = {a: 1};
const keyB = {b: 2};
const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
};
myObject // Object {[object Object]: "valueB"}
```



### 2 对象超类 super,当类继承或者设置了一个对象的原型__ proto __ 的时候，该对象的内使用super的时候，super可以理解为指向该对象的 __ proto __ 属性；

```javascript
var parent = {
  foo(){
    console.log("this is parent");
  }
}

var child = {
  foo(){
    super.foo();
    console.log("this is child");
  }
}

console.log(parent);
console.log(child);

Object.setPrototypeOf(child,parent);//改变child对象的 __proto__指向parent
child.foo();//this is parent   this is child
child.__proto__.foo();//this is parent
```

### 3 对象的getter和setter

```javascript
const obj = {
    _age : 16,
    get name(){
      return function(){
        console.log('this is name function')
      }
    },
    set age(value){
      console.log('value',value,this)
      this._age = value;
    },
}
let nameFn = obj.name;
nameFn() //'this is name function';
obj.age = 20
console.log(obj._age)
```



