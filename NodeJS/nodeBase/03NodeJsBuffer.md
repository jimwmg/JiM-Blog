---
title:  NodeJs Buffer 
date: 2016-10-22 12:36:00
categories: nodejs
tags : Buffer
comments : true 
updated : 
layout : 
---

###1 Buffer类的定义:本质上是创建了一块专门存放二进制数据的缓存区

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。

在 Node.js 中，Buffer 类是随 Node 内核一起发布的核心库。Buffer 库为 Node.js 带来了一种存储原始数据的方法，可以让 Node.js 处理二进制数据，每当需要在 Node.js 中处理I/O操作中移动的数据时，就有可能使用 Buffer 库。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

###2 如何创建Buffer实例 

```javascript
var buf = new Buffer(arg) //1 必须传入参数 2  传入的参数类型 string, Buffer, ArrayBuffer, Array, or array-like object.
```

```javascript
var buf1 = new Buffer(10);//这个是指定Buffer实例的长度，区分 var buf1 = new Buffer('10');
console.log(buf1);
console.log(buf1.length);
console.log(buf1.toString());

var buf2 = new Buffer([10, 40, 30]);//数组的长度 作为Buffer实例的长度
console.log(buf2);
console.log(buf2.length);
//buf2.write('hahhahahahhah')
console.log(buf2.toString());

var buf3 = new Buffer({length:12});//类数组对象 的长度作为Buffer的长度
console.log(buf3);
console.log(buf3.length);
console.log(buf3.toString());

var buf4 = new Buffer('this is it yeah'); //直接将字符串写入Buffer实例，长度等于字符串的长度
console.log(buf4);
console.log(buf4.length);
console.log(buf4.toString());

var buf5 = new Buffer(buf4);//将Buffer实例直接作为参数传入
console.log(buf5);
console.log(buf5.length);
console.log(buf5.toString());
```

###3 向缓冲区写入数据以及读取数据

```javascript
buf.write(string[, offset[, length]][, encoding])
参数描述如下：
    string - 写入缓冲区的字符串。
    offset - 缓冲区开始写入的索引值，默认为 0 。
    length - 写入的字节数，默认为 buffer.length
    encoding - 使用的编码。默认为 'utf8' 。
返回值
	返回实际写入的大小。如果 buffer 空间不足， 则只会写入部分字符串。
```

```javascript
buf.toString([encoding[, start[, end]]])
参数描述如下：
    encoding - 使用的编码。默认为 'utf8' 。
    start - 指定开始读取的索引位置，默认为 0。
    end - 结束位置，默认为缓冲区的末尾。
返回值
	解码缓冲区数据并使用指定的编码返回字符串。
```

```javascript
buf.length;  返回Buffer实例实际所占据的内存的长度
```

```javascript
buf.toJSON();将Buffer实例转化为JSON对象
```

```javascript
buf.slice(start,end);默认start 0 end 为buf.length 
返回一个新的缓冲区，它和旧缓冲区指向同一块内存，但是从索引 start 到 end 的位置剪切。
```

```javascript
Buffer.concat(list[, totalLength]) 返回一个多个成员合并的新 Buffer 对象。
```

```javascript
buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
targetBuffer - 要拷贝的 Buffer 对象。
targetStart - 数字, 可选, 默认: 0
sourceStart - 数字, 可选, 默认: 0
sourceEnd - 数字, 可选, 默认: buffer.length
返回值
没有返回值。
```



```javascript
//console.log(Buffer) 可以尝试着输入下Buffer类，看下其属性和方法
var buf = new Buffer('this is it yeah');
console.log(buf);
console.log(buf.length);//15
console.log(buf.toString());

var wLen = buf.write('changed?');
console.log(buf.toString());//changed?it yeah

console.log(wLen);//8
console.log(buf.toJSON());
/*{
	type: 'Buffer',
 	data: [ 99, 104, 97, 110, 103, 101, 100, 63, 105, 116, 32, 121, 101, 97, 104 ] 
 }
 */
var sliceBuf = buf.slice(2,5);
console.log(sliceBuf);
console.log(sliceBuf.length);//3
console.log(sliceBuf.toString());//ang

var con = Buffer.concat ([buf,sliceBuf]);
console.log(con);
console.log(con.length);//18
console.log(con.toString());//changed?it yeahang
```

