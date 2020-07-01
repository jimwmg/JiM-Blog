---
title:  NodeJsFileSystem WriteFileAndReadFile 
date: 2017-01-08 12:36:00
categories: nodejs
comments : true 
tags : fs
updated : 
layout : 
---

### FileSystem

文件 I/O 是由简单封装的标准 POSIX 函数提供的。 通过 require('fs')使用该模块。 **所有的方法都有异步和同步的形式。**

* 异步形式始终以完成回调作为它最后一个参数。 传给完成回调的参数取决于具体方法，但第一个参数总是留给异常。 如果操作成功完成，则第一个参数会是 null或 undefined，如果操作失败，则第一个参数将是一个错误对象；

  需要注意一点，异步操作无法通过try-catch来捕获异常

* 当使用同步形式时，任何异常都会被立即抛出。 可以使用 try/catch 来处理异常，或让它们往上冒泡。

查找文件路径是基于 `node`进程启动的目录作为基准进行查找；

### nodejs fs

#### fs.exists(path,cb)  用于判断给定的路径是否存在，无论是否存在都会执行回调函数，true表示存在，false表示不存在

```javascript
fs.exists('index.html',function(isExists){
  console.log(isExists)
})
```

#### fs.existsSync(path) 用于同步的判断某个文件是否存在



#### fs.open(path,flag,cb)

```javascript
fs.open('index.html','r',(err,data))=>{
    if(err){
        throw err
    }
    //如果读取到了数据则操作读取到的数据
    dealData(data)
}
```

**write (不推荐)**

```
fs.exists('myfile', (exists) => {
  if (exists) {
    console.error('myfile already exists');
  } else {
    fs.open('myfile', 'wx', (err, fd) => {
      if (err) throw err;
      writeMyData(fd);
    });
  }
});

```

**write (推荐)**

```
fs.open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  writeMyData(fd);
});

```

**read (不推荐)**

```
fs.exists('myfile', (exists) => {
  if (exists) {
    fs.open('myfile', 'r', (err, fd) => {
      readMyData(fd);
    });
  } else {
    console.error('myfile does not exist');
  }
});

```

**read (推荐)**

```
fs.open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  readMyData(fd);
});
```

#### fs.readFile(file,options,callback)

* file是要读取的文件的路径
* options
  * encoding  <string> | null     //默认值是null,所以如果不指定编码方式，读取文件的结果**默认返回的值是二进制数据**,返回的结果会作为参数传递给callback回调函数
  * flag  <string>  默认是  ‘r'
* callback 回调函数又有两个参数，第一个参数是error对象，第二个参数是读取到的数据
  - 如果读取文件成功，err返回null  data返回读取到的文件数据;(如果字符编码未指定，则返回原始的buffer数据)
  - 如果读取文件失败，err返回一个错误对象，data返回undefined;
* 注意读取文件的内容返回的结果要么是**Buffer类型**的数据，要么是**字符串类型**的数据

```javascript
//创建文件读取对象
var fs = require('fs');
fs.readFile('input.txt',function(err,data){ //假如input.txt里面的内容是  hello world
    //   ./input.txt是一样可以读取到，但是 /input.txt是表示绝对路径，读取不到
  console.log(arguments);//我们可以打印出来回调函数的参数进行查看，即使文件读取失败，回调函数也会执行
  console.log(err);
  console.log(data);//readFile返回的data数据是buffer类型的数据
  if(err){
    console.log(err.stack);
  }
  console.log(data.toString());//需要调用toString方法转化为字符串
});
console.log("program is done");
//program is done
//hello world 
//程序无阻塞运行
```

```javascript
//readFile语法
fs.readFile('etc/passwd',(err,data)=>{
  if(err) throw err;  //使用箭头函数可以使代码更加简洁
  console.log(data);
});
//readFile用于异步读取文件内容，
```

#### fs.writeFile(file,data,[option],callback)

* file可以是文件名或者文件描述
* data是异步地写入的数据内容，可以是一个string或者buffer
* option 编码格式，如果data是一个buffer,则默认encoding是utf-8
* callback 回调函数,该回调函数里面只有一个参数就是err错误处理对象，如果写入成功err返回null

如果说` file` 表示的路径已经存在，那么就会直接改写这个文件的内容，如果说 不存在，那么就说新建一个文件；

看下面这个简单的例子

```javascript
var fs = require('fs');
fs.writeFile('../write.txtf','hello nodejs',function(err){
    console.log(arguments);

    if (err){
        return console.log("写入文件失败")
    }
    console.log("写入文件成功");
});
console.log("pro is done");
```

需要注意的是，我们只能写入字符串或者Buffer类型的数据，如果写入复杂数据类型

```javascript
fs.writeFileSync('./text',' sync write'); // 写入文件的内容是    sync write  
fs.writeFileSync('./text.txt',{name:"Jhon"});//写入文件的内容是[object Object]
fs.writeFileSync('./text.txt',function(){});//写入文件的内容是  function(){} 
fs.writeFileSync('./text.txt',[1,2,3]); //写入文件的内容是  1,2,3
fs.writeFileSync('./text.txt',1);//写入文件的内容是 1 
//这些事同步的
```

3 以上文件的读写都是异步进行的，不会阻塞程序的执行，同时我们在日常工作中通过服务器端的数据的读写也会经常用到这两个API 

4 对于异步 的任务，很多时候，每个任务的执行先后顺序是无法控制的，那么如何去解决这个问题？

**此时，如果需要异步任务按照我们的意愿顺序进行，那么则需要将形成异步嵌套，形成一个回调链**

#### fs.watch(filename,[options],listener)

监听某个文件的变化，然后执行对应的动作；

### fs.readdirSync(path,[options]) (同步)  fs.readdir(path,[options],[callback]) (异步)

返回该路径下所有的 文件夹或者文件名组成的数组；

```
[ 
  'cml-learn-one',
  'cml-learn-two',
  'index.cml',
  'index.js',
  'index.vue' 
 ]
```

`existsSync   statSync`

调用 `fs.statSync(filePath) `的时候，要先判断 路径是否存在，比如判断一个路径是文件或者目录

```javascript
function isDir(filePath){
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}
function isFile(filePath){
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}
```
还有以下这种，注意错误捕获
```javascript
function tryStat(path) {
  debug('stat "%s"', path);

  try {
    return fs.statSync(path);
  } catch (e) {
    return undefined;
  }
}

let stat = tryStat(path);

if (stat && stat.isFile()) {
  return path;
}
```

