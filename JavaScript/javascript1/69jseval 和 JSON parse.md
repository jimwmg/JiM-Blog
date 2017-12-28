---
title:  eval JSONparse
date: 2016-10-27 12:36:00
categories: javascript json
tags : json
comments : true 
updated : 
layout : 
---

### js 的 eval( ) 和 JSON.parse(  ) 的用法和区别:

1 eval(string):这个全局函数可以用来接受一个字符串作为javascript代码去执行，也就是说，传入的参数可以作为脚本代码进行执行；比如创建变量，创建对象，执行函数等

*  如果传入的值  是一个字符串，那么则将字符串作为代码执行，如果有返回值，则返回该值，如果没有返回值，则返回undefined
*  如果传入的值   不是一个字符串，那么则直接返回传入的值
*  需要特别注意的是对象的声明语法 { }  如果直接将{ } 声明的对象作为值传入，则直接返回该对象，如果是 '{  }'  作为参数传入eval( )则会直接报错;

```html
<script>
    eval("var a=1");//声明一个变量a并赋值1。传入参数是一个字符串，则将该字符串作为代码执行
    console.log( eval("var a=1") );//undefined   因为没有返回值，所以结果是undefined
    eval("2+3");//执行加运算，并返回运算值。
    console.log(  eval("2+3") );//5
    eval("{b:2}");//声明一个对象。 
	eval("mytest()");//执行mytest()函数。
	console.log( eval( {b:2,"nema":"jhon"}) );//Object {b: 2, nema: "jhon"}，传入参数不是一个字符串，那么直接返回传入的值
	console.log( eval('{"b":2,"nema":"jhon"}') );//会直接报错
//如果想要将字符串    '{"b":2,"nema":"jhon"}'  转化为常用的对象输出，则需要将其加上小括号，转化为表达式，才能正确输出对象，以下几种写法都是正确的
	var code2 = '{"b":2,"nema":"jhon"}';
//    console.log( eval('{"b":2,"nema":"jhon"}') );//浏览器报错
    console.log( eval('('+code2+')') ); //Object {b: 2, nema: "jhon"}
    console.log( eval('('+'{b:2,"nema":"jhon"}'+')') ); //Object {b: 2, nema: "jhon"}
    console.log( eval('({b:2,"nema":"jhon"})') );//Object {b: 2, nema: "jhon"}
</script>
```

2 eval(string)函数的作用域:关键记住，val()函数并不会创建一个新的作用域，并且它的作用域就是它所在的作用域。这在所有主流浏览器都是如此，但是有时候需要将eval()函数的作用域设置为全局，当然可以将eval()在全局作用域中使用，但是往往实际应用中，需要在局部作用域使用具有全局作用域的此函数，这个时候可以用window.eval()的方式实现

```html
<script>
    function test (){
        eval("var num = 4");
        console.log(num);//4
    }
    test();
//    console.log(num);//num is not defined

    function test1 (){
        window.eval("var num = 4");
        console.log(num);//4
    }
    test1();
    console.log(num);//4
</script>
```

3 eval()可以将字符串解析为对象，同样JSON.parse()也可以将字符串解析为对象

```javascript
var data = '{"b":2,"nema":"jhon"}'; //这是一个字符串
//第一种方法，通过eval()将其解析成对象
var objData1 = eval( "("+data+")"  ); ////Object {b: 2, nema: "jhon"}
//第二种方法
var objData2 = JSONparse(data);//Object {b: 2, nema: "jhon"}
```

它们有什么区别和不同呢?

*  JSON.parse()之可以解析json格式的数据，并且会对要解析的字符串进行**格式检查**，必须符合JSON的数据格式，属性和值都必须要用“” 包裹，如果格式不正确则不进行解析，而eval()则可以解析任何字符串，对字符串格式并不要个要求，eval是不安全的。

* JSON.parse(  ' {"name":"Jhon","age":13 } ' ) 解析的结果是一个对象   {"name":"Jhon","age":13 }

* JSON.parse( ' [{"name":"Jhon","age":13 } , {"name":"Jhon","age":13 }] ' ) 解析的结果是一个数组，里面有两个对象

    [{"name":"Jhon","age":13 } , {"name":"Jhon","age":13 }]

   总结来说:JSON.parse()可以将字符串类型的数组，转化为数组，将字符串类型的对象，转化为对象

*  eval( )里面可以传入非字符串的数据类型，会直接返回该类型值，比如直接传递数组 [ {"name":"jhon"} ]  或者对象 {"name":"jhon"} ,或者基本数据类型和复杂数据类型，但是JSON.parse( )，只能接受字符串类型的 ; 如果传入数组 

   [ {"name":"jhon"} ] 或者对象 {"name":"jhon"} 会报错；

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<script>
    //从后台返回的数据一般是字符串类型的，需要将其解析成javascirpt对象
    var data = '[{"name":"jhon"},{"age":16}]';
//    var data = [{"name":"jhon"},{"age":16}];
    var objData1 = eval(data);
    var objData2 = JSON.parse(data);
    console.log("this is objData1"+objData1);
    console.log(objData1);
    console.log("this is objData2"+objData2);
    console.log(objData2);
    
    var num = 3 ;
    console.log(eval(num));//3
    console.log(eval(true));//true
    console.log(eval(null));//null
    console.log(eval(undefined));//undefined
    console.log(eval({"name":"jhon"}));//Object {name: "jhon"} 对象
    console.log(eval([{"name":"jhon"}]));//[Object] 数组
    console.log(JSON.parse(num));//3
    console.log(JSON.parse(true));//true
    console.log(JSON.parse(null));//null
//  console.log(JSON.parse(undefined));//报错
// console.log(JSON.parse({"name":"jhon"}));//报错
  console.log(JSON.parse('{"name":"jhon"}'));Object {name: "jhon"} 对象
 //console.log(JSON.parse([{"name":"jhon"}]));//报错
  console.log(JSON.parse('[{"name":"jhon"}]'));//[Object] 数组
  console.log(JSON.parse('[1,2,3]'));  //[1,2,3]
</script>
</body>
</html>
```

