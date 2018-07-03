---
title: HTML5 文件读取API
date: 2016-07-08 12:36:00
categories: HTML5
comments : true 
updated : 
layout : 
---

HTML5 文件读取   `<input type="file"/>`  元素input=file的新增API 

fileAPI主要有5个: 

FileUpload:当用户选择或编辑一个文件名，file-upload 元素触发 onchange 事件句柄

FileList:可以看成一个对象，包含上传文件的相关信息，其中包括了File对象

File:可以看成是FileList的一个属性，它包含了文件的基本信息

FileReader:HTML5新增的API ,可以理解成一个封装好的函数，文件的读取都是由它完成的,如果需要使用需要new操作符创建一个读取对象；

FileError:这个类可以自己生成，主要用来提示文件操作中的错误，

DataTransfer,，Blob，。

首先，从源头来理解:看一下demo我们简单做一个工作中常用的头像上传的功能：

html代码：

```html
<body>
<input type="file"/>
<input type="button" value="上传头像"/>
<div style="border: 1px solid #000 ;width:200px;height: 200px;">
    <img src="" alt="" width="200px"/>
</div>
</body>
```

script代码:功能实现是点击input=button上传头像的按钮，可以将input=file里面的选择的文件上传；

```html
<script>
    document.querySelector("input[type=button]").onclick = function(e){
        var fileDom = document.querySelector("input[type=file]");
        console.log(fileDom.files);//FileList
        console.log(fileDom.files[0]);//File
//        获取文件
        var file = fileDom.files[0];//File
//        创建HTML5文件读取对象
        var reader = new FileReader();
        console.log(reader);
//        从这个File对象可以获取name、size、lastModifiedDate和type等属性。
//把这个File对象传给FileReader对象的读取方法，就能读取文件了。
////        调用文件读取对象的方法

        reader.onload = function(){
            console.log("读取完毕");
            console.log(reader.result);
            document.querySelector("img").src = reader.result;
        }
        //        reader.readAsText(file);
        reader.readAsDataURL(file);
//注意执行顺序，onload之后，会执行 reader.readAsDataURl(file),然后才进入函数体，无阻塞事件
    }
</script>
```

1 当我们没有先选择文件的时候，直接点击button按钮，此时控制台输出如下



因为没有选择文件上传，所以此时FileList的length为0 ；

```html
FileList {length: 0}//fileDom.files
FileReader {readyState: 0, result: null, error: null, onloadstart: null, onprogress: null…}//
```

2 如果我们选择一个文件上传之后，此时在点击button，此时控制台输出：(注意fileDom.files[0]中的0 代表什么，注意比较两种情况下FileList对象的属性，第一种没有上传文件的情况下，FileList对象只有一个属性值 length:0;而在第二种首先上传文件的情况下，FileList对象的属性为 0:File, length:1,console.log(fileDom.files[length])也能输出length属性对应的值)

```html
FileList {0: File, length: 1} //fileDom.files
File {name: "04_kiss.jpg", lastModified: 1486178231000, lastModifiedDate: Sat Feb 04 2017 11:17:11 GMT+0800 (中国标准时间), webkitRelativePath: "", size: 47689…}   //fileDom.files[0]
FileReader {readyState: 0, result: null, error: null, onloadstart: null, onprogress: null…}
```

3 文件上传之后——FileList对象——FileList对象包含File对象——File对象里面又包含了以下API:

```html
lastModified   :文件修改
lastModifiedDate
name  :文件名
type  :文件类型
size  :文件大小
```

4 FileReader 对象的相关API如下:

该对象的 方法将确定如何读取文件的方式，然后将读取到的文件存在其属性reader.result里面

```html	
error: null
onabort: null
onerror: null
onload: null
onloadend: null
onloadstart: null
onprogress: null
readyState: 
result:
DONE: 2
EMPTY: 0
LOADING: 1
abort: 
function abort() 
function readAsBinaryString: 
function readAsBinaryString(File Object) 
function readAsDataURL(File Object)
function readAsText(File Object);
```

5 .FileError这个类可以自己生成，主要用来提示文件操作中的错误，以下基本为常量，可直接使用【类名.属性】

```html
ABORT_ERR: 3
ENCODING_ERR: 5
INVALID_MODIFICATION_ERR: 9
INVALID_STATE_ERR: 7
NOT_FOUND_ERR: 1
NOT_READABLE_ERR: 4
NO_MODIFICATION_ALLOWED_ERR: 6
PATH_EXISTS_ERR: 12
QUOTA_EXCEEDED_ERR: 10
SECURITY_ERR: 2
SYNTAX_ERR: 8
TYPE_MISMATCH_ERR: 11
```



