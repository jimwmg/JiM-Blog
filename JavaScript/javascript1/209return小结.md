---
title:  return小结
date: 2017-05-08 12:36:00
categories: javascript
tags : return
comments : true 
updated : 
layout : 
---

1 函数执行的时候,如果遇到return,则终止当前函数的执行,直接返回return后面的结果

2 for(var k in  obj ) {   }  循环,只有在obj被定义的情况下,才会执行for后面的代码块

```html
<script>
        var obj = {name:'Jhon',age:13};
        function f1(obj){
            console.log('2');
            
            for (var k in obj ){
              //如果obj为定义,则for语句后面的代码块不会执行
                return false ;
            }
            //如果obj是一个对象,下面的代码不会执行,函数在执行的时候,遇到return就会直接退出当前函数执行,返回return的值
            console.log('11');
            
            return true ;

            cconsole.log('1');
            
        }

        var a = f1(obj);//传入obj
        var b = f1();//不传值,默认undefined
        console.log(a);//false
        console.log(b);//true
        
        function isEmptyObject(obj) {
                for (var k in obj) {
                    return false;
                }
                return true;
            }
    </script>
```

3 返回一个函数以及返回一个函数执行(return 一个函数执行)

```javascript
function f2(){
  console.log('f2执行了');
}
function f1(){
  console.log('f1执行了')
  return f2()
}
var exF1 = f1();
console.log(exF1);
//控制台输出
f1执行了
f2执行了
undefined

```

4 函数嵌套函数，内部函数return，return仅仅是终止了内部函数向下继续执行，外部函数还是会继续执行；

```javascript
let f1 = ()=>{
  console.log('hello');
  return ;
  //some code will not be excuted
  console.log('not excuted')
}
let f2 = ()=>{
  if(true){
    f1();
  }
  console.log('world');
}
f2();
```

控制台输出

```javascript
hello
world
```

```javascript
let f1 = ()=>{
  console.log('hello');
  return ;
  //some code will not be excuted
  console.log('not excuted')
}
let f2 = ()=>{
  if(true){
     return f1();
    //f1();
    //return ;
  }
  console.log('world');
}
f2();
```

控制台输出

```javascript
hello 
```

这些可能都很简单，但是工作中总是会有一些小的疏忽，导致一些bug的存在，以此铭记；