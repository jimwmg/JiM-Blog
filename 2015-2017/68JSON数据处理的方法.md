---
title: JSON operate 
date: 2016-11-21 20:36:00
categories: javascript 
tags: JSON
comments : true 
updated : 
layout : 
---

JSON数据处理的方法

1 json数据格式:

* 以键值对的形式存在 json={"key":"value","key1":"value1","key2":"value2"};
* key对应的值可以使数组或者对象 json={"key" :  {  } , "key1" : [   ] , "key2" : function(){ } } ;
* json是一种规范，一种数据格式的规范
* json实际上是字符串

2 json数据格式，"存前读后"，也就是说存储json格式的数据之前，要进行将其转化为字符串，读取的时候，要转化为对象

 JSON.stringify()  将一个**对象**解析成**字符串**  将**JavaScript值**转换为**JSON字符串**

 JSON.parse() 将一个**字符串**解析成**对象** ，构造由字符串描述的JavaScript值或对象。

```html
<script>
    var myJson={"UserName":"Jim"};
    console.log(myJson);//Object {UserName: "Jim"}
    var strMyJson = JSON.stringify(myJson);//将myJson存进去，记得JSON.stringify转成字符串
    console.log(strMyJson);//  字符串   '{UserName: "Jim"}'
    console.log(typeof strMyJson);//string
    var objMyJson=JSON.parse(strMyJson);//取出来的是字符串，记得JSON.parse还原为对象
    console.log(objMyJson);//Object {UserName: "Jim"}
    console.log(typeof objMyJson);//object
 	var data = [{"name":"jhon"},{"age":16}];//数组也可以
    var strData = JSON.stringify(data);
	console.dir(strData);
    console.dir(typeof strData);
</script>
```

3 JSON.parse用法在JSON.parse and eval 博文已经总结过

4 JSON.stringify()详解 (参阅MDN)

语法  返回值是一个JSON格式的字符串

```javascript
JSON.stringify(value[, replacer [, space]])
```

* value是要序列化为一个JSON字符串的值
* replacer可选参数
  * 如果该参数是一个函数，那么在序列化的过程中的被序列化的每个属性都会经过该函数的转换和处理
  * 如果该参数是一个数组，那么只有包含在该数组中的属性名才能被最终序列化为JSON字符串
  * 如果该参数为null或者未提供， 那么对象的所有属性都会被序列化
* space 可选参数，用于梅花输出
  * 如果该参数是一个数字，代表有多少个空格，上限为10 ，如果该数字小于1，则没有空格
  * 如果该参数为null或者没有提供将没有空格

注意事项

* 字符串，数字，布尔类型的数据值会被直接 转化为原始值
* undefined  函数  以及symbol值
  * 在数组中出现的时候，会被转化为null
  * 作为对象的属性值出现的时候，整个键值对都会被忽略
* 不可枚举的属性不会被序列化为字符串

走几个demo便于理解和记忆

```javascript
 var obj = Object.create({ foo: 1 }, { // foo is on obj's prototype chain.
        bar: {
            value: 2  // bar is a non-enumerable property.默认值false
        },
        baz: {
            value: 3,
            enumerable: true  // baz is an own enumerable property.
        }
    });
   
    console.log(JSON.stringify(obj));//'{"baz":3}'
    console.log(JSON.stringify({}));//'{}'
    console.log(JSON.stringify(false));//"false"
    console.log(JSON.stringify(4));//"4"
    console.log(JSON.stringify('foo'));//"foo"
    console.log(JSON.stringify(['foo',2,true]));//'["foo",2,true]'
    console.log(JSON.stringify([undefined,Array,Symbol("")]));//'[null,null,null]'
    console.log(JSON.stringify({x:undefined,y:Array,z:Symbol("")}));//'{}'
```

replacer函数 

- 如果返回一个 Number 转换成相应的字符串被添加入JSON字符串。
- 如果返回一个 String, 该字符串作为属性值被添加入JSON。
- 如果返回一个 Boolean, "true" 或者 "false"被作为属性值被添加入JSON字符串。
- 如果返回任何其他对象，该对象递归地序列化成JSON字符串，对每个属性调用replaceer方法。除非该对象是一个函数，这种情况将不会被序列化成JSON字符串。
- 如果返回undefined，该属性值不会在JSON字符串中输出。

```javascript
var obj = {name:'Jhon',age:19,gender:"man"};
function replacer (key,value){
  if(typeof value === 'number'){
    return undefined;
  }
  return value ;
}
var jsonString = JSON.stringify(obj,replacer);
console.log(jsonString);
//'{"name":"Jhon","gender":"man"}'
```

```javascript
var obj = {name:'Jhon',age:19,gender:"man"};
var jsonString = JSON.stringify(obj,['age','other']);//多余的会被忽略
console.log(jsonString);//'{"age":19}' ;
```





