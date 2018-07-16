---
title: the performance optimization of the JS code
date: 2016-04-17 12:36:00
categories: http 
tags: http
comments : true 
updated : 
layout : 
---

## Javascritp代码性能优化

### 1 代码性能测试 : 简单方法 根据运行前后的时间来判断

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<script>
    //先定义一个数组
    var arr = [];
//    console.log(Boolean(arr));
    for(var i = 0,len = 10000 ;i <　len ; i++){
        arr.push(i);
    }
    //定义一个函数累加求和
    var sum = 0 ;//全局的sum变量
    function loopFor (arr){
         for(var i = 0 ; i < arr.length ; i++){
            sum += arr[i]
         }

    }
    //定义一个递归方法删除数组,shift()函数删除数组第一个函数，并返回删除元素

    function loopShift(arr) {
        if (!!arr.length) {
            sum += arr.shift();
            arguments.callee(arr);
        }
    }
    //定义一个测试性能的函数
    function test (fn,param){
        //记录开始执行函数的时间
        var start = new Date().getTime();
        //开始执行函数
        fn(param);
        //记录结束执行函数的时间
        var end = new Date().getTime();
        //输出执行结果
        console.log("sum="+sum+";"+"执行时间是"+(end - start)+"ms");
    }
    //分贝执行，看下效果
//    test(loopFor,arr); //我电脑上大概0~1 ms
    test(loopShift,arr);//这个大概10ms
</script>
</body>
</html>
```

综合来看，递归这种方法还是十分消耗性能的

### 2 浏览器开发者工具提供性能分析

开发者工具----profiles ----Record Javascript CPU Profile

### 3 javascript性能优化

| async        | 设置或返回是否脚本一旦可用，就应异步执行。   |
| ------------ | ----------------------- |
| charset      | 设置或返回脚本的 charset 属性值。   |
| cross Origin | 设置或返回脚本的 CORS 设置。       |
| defer        | 设置或返回当页面完成解析后是否执行脚本。    |
| src          | 设置或返回脚本的 src 属性值。       |
| text         | 设置或返回属于脚本子节点的所有文本节点的内容。 |
| type         | 设置或返回脚本的 type 属性值。      |

当浏览器解析页面的时候，遇到了javascript代码，无论该代码是在内嵌式文件中还是在外链式文件中，页面的加载和渲染都必须停止下来等待脚本执行完毕，因为脚本可能改变页面或者javascript的命名空间；

改善性能的方法：

3.1 为了不影响页面的渲染，尽量将script标签放在body的底部

3.2 每个script标签在加载的时候，都会阻塞页面渲染，所以减少页面包含的script标签数量有助于改善这一情况；包括减少内嵌式或者外链式的script标签；async 属性规定一旦脚本可用，则会异步执行。类似于告诉浏览器链接进来的脚本不会生成文档内容，因此浏览器可以在下载脚本的时候继续解析和渲染文档；

注释：async 属性仅适用于外部脚本（只有在使用 src 属性时）。

注释：有多种执行外部脚本的方法：

- 如果 async="async"：脚本相对于页面的其余部分异步地执行（当页面继续进行解析时，脚本将被执行） 
- 如果不使用 async 且 defer="defer"：脚本将在页面完成解析时执行 
- 如果既不使用 async 也不使用 defer：在浏览器继续解析页面之前，立即读取并执行脚本 

3.3 动态创建脚本

文档对象模型允许我们使用javascript动态创建HTML的几乎全部文档内容，script标签和页面中的其他元素一样，很容易被创建；

```javascript
var script =document.createElement("script");
script.type = "text/javascript";
script.src = 'script1.js';
document.getElementsByTagName("head")[0].appendChild(script);
//getElementsByTagName获取到的是一个nodeList(一个伪数组)
```

```javascript
 var script =document.createElement("script");
	script.type = "text/javascript";
    script.onload = function(){
        console.log("script is loaded");
    }
    script.src = 'script1.js';
    document.getElementsByTagName("head")[0].appendChild(script);
//通过监听onload事件加载script脚本
```

```javascript
//对于比较** 的IE有着另外一种实现方式 script有一个属性  readyState 
var script = document.createElement("script");
script.type = "text/javascript";
script.onreadystatechange = function(){
  if(script.readyState == 'loaded' || script.readyState == "complete"){
    script.onreadystatechange = null;
    console.log("script is loaded");
  }
};
script.src = "script1.js";
//script的readyState的属性值随着外部下载文件的过程而改变；
//uninitialized  loading loaded interactive complete
```

如果想要实现兼容，我们需要封装一个代码

```javascript
function loadScript (url,callback){
        var script = document.createELement("script");
        script.type = "text/javascript";
        if(script.readyState ){	//表示是IE
            script.onreadystatechange = function(){
                if(script.readyState == 'loaded' || script.readyState == "complete"){
                    script.onreadystatechange = null;//不在使用的函数需要清除掉，减少对内存的占用
                    callback();
                }
            }
        }else{
            script.onload = function(){
                callback();
            }
        }
        script.src = url ;
        document.getElementsByTagName("head")[0].appendChild(script);
 }
loadScript('script1.js',function(){
  console.log("script1.js is loaded");
})
```

3.4 通过对XHR发送请求，加载javascript脚本

```javascript
var xhr = new XMLHttpRequest();
xhr.open('get','script1.js','true');
xhr.onreadystatechange = function(){
  if(xhr.status >=200 && xhr.status <300 || xhr.status == 304){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.text = xhr.responseText;
    document.body.appendChild(script);
  }
};
//有个缺点就是javascript文件必须与页面同域，不能从CDN(Content Delivery Network)下载
```

### 4 内存管理

虽然javascript具有垃圾回收机制，但是为了让页面具有更好地性能，还是需要进行内存的优化；对于局部变量，在其执行完毕之后，会被自动清除(闭包除外)，但是对于全局变量以及全局的函数，如果数据不再使用，最好通过设置为null的形式进行手动接触占用

