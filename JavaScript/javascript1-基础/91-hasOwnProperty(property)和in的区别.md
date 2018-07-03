---
title: hasOwnProperty和in的区别 
date: 2016-04-11 12:36:00
categories: javascript
tags: array
comments : true 
updated : 
layout : 
---

## hasOwnProperty("property")  和  in  的区别

1 先看各自应用

```html
<script>
    function Test(){
        this.foo= "bar";//将属性直接添加给将要实例化的对象
    }
    Test.prototype.name = "Jhon";//将属性值添加在原型上
    var test1 = new Test();
//    console.log(foo in test1);//语法错误，属性必须加上引号
    console.log("foo" in test1);//true
    console.log(test1.hasOwnProperty("foo"));//true
    console.log("name" in test1);//true
    console.log(test1.hasOwnProperty("name"));//false
</script>
```

2 "property"  in obj 返回布尔类型，用于判断某个对象上是否有某个属性，包括其实例化的属性，以及原型链上的属性

  obj.hasOwnProperty("property")  返回布尔类型，用于判断某个对象上是否有某个属性，但是仅仅指的是实例化的属性，不包括原型上的属性,也不包括属性指向一个对象当中的属性；

"property" in obj   可以判断一个对象是否有原生属性或者原型属性;

obj.hasOwnProperty("property") 只能判断原生属性，不能判断原型属性

**注意属性一定要用引号括起来** 

3 我们可以进行一个封装，用来判断某个属性是否在原型上

```javascript
 function hasProperty (property,obj){
            if(property in obj && !obj.hasOwnProperty(property)){
                return true ;//该属性在原型上
            }else{
                return false;
            } 
    }
//注意property传入字符串属性
 	var result1 = hasProperty("foo",test1);
    console.log(result1);//false
    var result2 = hasProperty("name",test1);
    console.log(result2);//true
```

4 对于下面这种情况也要引起注意

```javascript
 var obj = {
        name:"Jhon",
        age:13,
        address:"American",
        InnerObj:{
            gender:"man"
        }
    }
     console.dir(obj);
    console.log( obj.hasOwnProperty("name"));//true
    console.log("name" in obj);				//true
    console.log("gender" in obj);			//fasle  
//"gender"并不是实例化对象的属性，也不是在原型上的属性
    console.log( obj.hasOwnProperty("gender"));//false
```

