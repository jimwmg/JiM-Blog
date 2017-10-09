---
title: get and set
date: 2016-11-13 12:36:00
categories: javascript
comments : true 
updated : 
layout : 
---

1 设置对象的属性，Object.definedProperty(obj.prop,descriptor)

```javascript
//第一种方式
var obj= {};
Object.defineProperty(obj,"name",{     
  configurable:true,
  enumerable : false, 
  value:"Jhon",
  writable:true,     
});
```

```javascript
//第二种方式
var obj= {};
Object.defineProperty(obj,"name",{
  configurable:true,
  enumerable : false,    
  get : function(){
    return "JiM";
  }
  set:function(){

  }
});
```

2 一个属性的descriptor可能由以下组成 value writable configurable emuerable get set  , descriptor是一个属性的详细信息描述的对象；

```javascript
//通过键值对的方式直接设置对象的属性
const obj = {
   foo:'bar',
 };
var descriptors = Object.getOwnPropertyDescriptors(obj);
console.log(descriptors);//foo属性的descriptor对象的详细信息
console.log(obj);
```

```javascript
//通过get set方法可以直接给对象设置属性以及设置属性值，大致了解下get和set的作用，以及对obj对象的属性改变
const obj = {
  get foo() {
    return 'bar';
  },
  get foo1() {
    return 'bar1';
  },
  get foo2(){
    return 'bar2'
  }
};
var descriptors = Object.getOwnPropertyDescriptors(obj);
console.log(descriptors);
console.log(obj);
console.log(obj.foo);//bar
console.log(obj.foo1);//bar1
console.log(obj.foo2);//bar2
obj.foo = 'bar4';//不会修改foo属性的值
console.log(obj.foo);//bar
```

3 set方法可以用来设置属性的值，get可以用来获取属性的值，来个栗子感受下

```javascript
var test = {  
_Name : "Lilei",  
_Age : 20,    
//_Name的只读   
get name() {return this._Name;},  //通过
//_Age的读写  
set age(age) {this._Age = age;},   
get age() {return this._Age;}  
}  
console.log(test);//可以查看obj对象的所有属性，加深理解
var descriptors = Object.getOwnPropertyDescriptors(obj);
console.log(descriptors);//查看obj对象的所有属性的descriptor对象
//------------------------------------------------
console.log(test.name + " " + test.age);//Lilei 20  
test.name = 'Lily';  
test.age = 18;  
console.log(test.name + " " + test.age);//Lilei 18   
console.log(test._Name + " " + test._Age);//Lilei 18 _Name 只读，只写了_Age属性 
```

