---
title: Ajax(Asynchronous JavaScript and XML) 
date: 2016-04-17 12:36:00
categories: http 
tags: http
comments : true 
updated : 
layout : 
---

## 一:Ajax(Asynchronous JavaScript and XML)

客户端:发送请求，确定请求方式以及处理请求的URL,发送给服务器——>>ajxa(javascript+XMLHttpRequset):作为媒介，xhr的open() send() 以及onreadystatechange()方法处理客户端和服务器之间的联系<<——服务器:处理请求，后台程序处理数据，返回给客户端;可以实现异步交互。

同步交互:客户端向服务器发送请求，客户端的页面进行响应，刷新页面

异步交互:客户端向服务器发送请求，客户端的页面进行响应，并不会刷新页面。

(这个是我们对于页面感官上感受)

从浏览器和服务器之间来理解同步和异步

同步:浏览器发送请求，等待服务器的响应，等服务器返回响应，然后浏览器继续执行

异步:浏览器通过javascript内置XMLHttpRequest对象向服务器发送请求，不等待服务器响应，浏览器继续执行代码，等服务器状态改变，onreadystatechange监听到改变，会执行回调函数；

Ajax 采用一种沙箱安全模型。因此，Ajax 代码（具体来说就是 XMLHttpRequest 对象）只能对所在的同一个域发送请求

我们需要检测并判断响应头的MIME类型后确定使用request.responseText或者request.responseXML

## JS——Ajax

1 ajax的要点是XMLHttpRequset对象,根据不同浏览器兼容性，下面代码可以创建兼容性极强的XMLHttpRequset对象

```javascript
<script type="text/javascript">
function GetXmlHttpObject()
{
  var xmlHttp=null;
  try
    {
    // Firefox, Opera 8.0+, Safari
    xmlHttp=new XMLHttpRequest();
    }
  catch (e)
    {
    // Internet Explorer
    try
      {
      xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
      }
    catch (e)
      {
      xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
  return xmlHttp;
}
</script>
```

2 XMLHttpRequest对象重要的属性

- readystate存储着服务器相应状态的信息**每当服务器响应状态改变的时候，onreadystatechange函数就会被执行**
- status由服务器返回的HTTP状态代码 200一切正常 404 NOT FOUND 403  Forbidden  
- statusText由服务器返回的HTTP状态描述，比如200  "OK"  404  "NOT FOUND"
- 以上三个当响应不完成的时候，可以通过输出它们判断问题所在

```javascript
xhr.onreadystatechange = function(){
  if(xhr.readyState == 4 ){  //代表服务器已经完全接受响应
    if(xhr.status == 200 ){  //代表服务器响应状态OK
      sone code
    }else{
      alert("status is "+xhr.status) ;
    }
  }
}
//以上代码可以用来检测状态码的问题
```



当readyState小于3的时候，status  statusText 读取这些属性会导致一个异常。(注意S大写)

| 0    | Uninitialized | 初始化状态。XMLHttpRequest 对象已创建或已被 abort() 方法重置。 |
| :--- | ------------- | ---------------------------------------- |
| 1    | Open          | open() 方法已调用，但是 send() 方法未调用。请求还没有被发送。   |
| 2    | Sent          | send() 方法已调用，HTTP 请求已发送到 Web 服务器。未接收到响应。 |
| 3    | Receiving     | 所有响应头部都已经接收到。响应体开始接收但未完成。                |
| 4    | Loaded        | HTTP 响应已经完全接收。                           |

- onreadystatechange属性存有服务器响应的函数，readyState数字每次改变都会执行该函数；

  ```javascript
  xmlHttp.onreadystatechange = function(){  };
  ```

- responseText 用来获取由服务器返回的数据,返回**字符串形式** ；(json格式)或者如果还没有接收到数据的话，就是**空字符串** 。

- responseXML 与 responseText 以**字符串** 返回 HTTP 响应不同，responseXML 以 XML 返回响应。

  ```
    responseXML 属性返回 **XML 文档对象** ，可使用节点树的方法和属性来检查和解析该对象;这些从数据库中选取的数据将被转换为 XML 文档，然后我们将使用 DOM 来提取要显示的值。
  ```

- 所谓的服务器返回的数据，其实就是echo 输出的内容(这个内容就是服务器端的响应体)，如果响应体是XML格式的文本，则需要用responseXML，如果响应体是字符串格式的文本，则需要用responseText来获取响应的内容；

3 XMLHttpRequest对象的重要方法:如何将请求发送到服务器

  3.1 open( type,url,async) type代表客户端向服务器发送数据的方式，url代表服务器处理客户端发送数据的程序，async代表是异步处理还是同步处理，默认是true，异步处理，false是同步处理;

open(HEAD,url,true) ,

  3.2 setRequestHeader('Content-Type','application/x-www-form-urlencoded');

getAllResponseHeaders()

```
 使用open("post",url)的时候必须这样设置；表示相应返回的资源格式
 get请求可以不设置；setRequestHeader() 方法指定了一个 HTTP 请求的头部，它应该包含在通过后续 send() 调用而发布的请求中。这个方法只有当 readyState 为 1 的时候才能调用，在调用了 open() 之后，但在调用 send() 之前。
```

   3.3 send( string ),将请求发往服务器;send() 把 readyState 设置为 2，并触发 onreadystatechange 事件句柄。必须在open()方法之后才能调用 ; 注意:添加一个随机数，以防服务器使用缓存的文件 

  3.4 栗子解释:

- get请求   请求发送给服务器的数据直接附在URL地址的后面

```javascript
         xmlhttp.open("GET","demo_get2.asp?fname=Bill&lname=Gates&r="+Math.random(),true);
         xmlhttp.send();
```

- post请求 请求发送的数据在send(string) ；

```javascript
        xmlhttp.open("POST","ajax_test.asp",true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("fname=Bill&lname=Gates&r="+Math.random());
```

- async  异步处理 (true)  同步处理(false)

```javascript
        //async = true ;需要规定响应处于 onreadystatechange 事件中的就绪状态时执行的函数：
        xmlhttp.onreadystatechange=function()
          {
          if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
            document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
            }
          }
        xmlhttp.open("GET","test1.txt",true);
        xmlhttp.send();
        //async =false ; 规定必须在响应完成之后才能执行javascript,此时不需要编写onreadystatechange,javascript代码紧跟在send()之后便可以;
        xmlhttp.open("GET","test1.txt",false);
        xmlhttp.send();
        document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
```

4 XMLHttpRequest对象监听服务器变化 onreadystatechanges属性发生变化的时候，可以执行函数体；responseText和responseXML得到响应体。

5 XMLHttpRequest是javascript的一个内置对象，这个对象可以用来给后台服务器发送数据，同时接受后台返回来的数据，通过javascript动态的操作返回的数据，从而实现了交互的友好型，不会再反复的刷新页面。因为之前发送请求的时候，都是通过document对象发送请求，所以会刷新页面，后来直接用XHR发送请求，则不会再刷新页面了；

## jQuery--- Ajax

1 ajax方法里面封装了底层的XMLHttpRequest对象，建立了发送请求和响应请求的过程，并且在发送请求和得到响应这个过程中定义了一系列的函数的函数;

2 jQuery Ajax是一个十分强大的封装体，ajax所有的技术基本上都可以设置，一个$.ajax(url,settings)基本上可以处理大部分服务器和客户端的通信；

3 下面一步步来用栗子了解 jQuery-Ajax底层实现原理；(有关XMLHttpRequest对象的兼容上面以及解释过，此处不再做兼容)

```javascript
obj = {"type":"GET","data":"data","URL":"url"}
var $ = {
  ajax : function(obj){
    var xhr = new XMLHttpRequest();
    if(typeof obj.data === "object"){
      //因为data有可能是一个对象，将data自动转化为字符串;
      var str = this.params(obj.data);//将data转化为字符串，这个就是 jQuery底层发送到服务器的数据。将自动转换为请求字符串格式的原理；
      obj.data= str ;
    }
    if(obj.type == "GET"){
      obj.url = obj.url+"?"+obj.data;
      obj.data = null ;
    }
    xhr.open(obj.type,obj.url,true);
    if(obj.type =="POST"){
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    xhr.send(obj.data);
    xhr.onreadystatechange = function(){  //每次readyState值变化的时候，都活触发这个onreadystatechange监听器，所以要设定一些条件，来限制函数体的执行，
      if(xhr.readyState == 4){  //响应完成
        if(xhr.status == 200) {  //状态ok
          var res = xhr.responseText ;//(如果返回是XML类型的数据，则用 xhr.responseXML接受)
          var resObj = JSON.parse(res);//这个就是jQuery底层实现：当dataType设置为json的时候，返回的数据类型是javascript对象;
          obj.sucess(resObj);
        }else{
          obj.reeor();
        }else{
          obj.complete();
        }
      }
    };
  },
   params: function (obj) {
        var str = "";
        for (var key in obj) {
            //console.log(key);
            str += key + "=" + obj[key] + "&"
        }
        console.log(str);
        str = str.substr(0, str.length - 1);

        console.log(str);

        return str;
    }
} 
```

4 用法 语法: $.ajax({ URL  [settings]    }) 传入键值对形式的设置和URL

```javascript
$.ajax ({
  url : "url" ,  //表示要访问的服务器后台地址
  settings :     //以下详细说明settings设置
})
```

settings 设置

- dataType  :  请求服务器返回的数据类型；

  "text": 返回纯文本字符串

  "xml": 返回 XML 文档，可用 jQuery 处理。

  "html": 返回纯文本 HTML 信息；包含的script标签会在插入dom时执行。

  "script": 返回纯文本 JavaScript 代码。不会自动缓存结果。除非设置了"cache"参数。'''注意：'''在远程请求时(不在同一个域下)，所有POST请求都将转为GET请求。(因为将使用DOM的script标签来加载)

  "json": 返回 JSON 数据 ，服务器返回javascript对象;即经过JSON.parse()解析成javascript对象

  "jsonp" : **如果跨域的话，这个时候就不是XMLHttpRequest对象发送请求了，而是script标签发送请求，服务器返回的script代码会直接执行**  

  表示可以进行跨域请求；使用这种类型的话，会创建一个查询字符串参数 callback=? 

  ，这个参数会加在请求的URL后面。服务器端应当在JSON数据前加上回调函数名，以便完成一个有效的JSONP请求。如果要指定回调函数的参数名来取代默认的callback

  如果指定了text html javascript 则将返回字符串；如果指定了XML 则将返回XML格式的数据，可以用XML DOM 对象操作

  我们必须确保网页服务器报告的MIME类型与我们选择的dataType所匹配。比如说，如果我们将dataType设置为xml，则要求服务器返回xml类型的数据，服务器端就必须声明 text/xml 或者 application/xml 来获得一致的结果。
```javascript
<?php
            $callback=$_GET['back'];
            $data='{"username":"zhangsanlisiwangwsu"}';
            echo $callback."(".$data.")";
?>
```

situation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script> 
        function getInfo(obj){
            console.log(obj);
        }     
    </script>
    <script src="js/jquery-1.12.4.js"></script>
    <script>
        $.ajax({
             url:"04jsonp.php?callback=getInfo",
            type:"GET",
            dataType:"jsonp",//如果没有这行代码，就是返回纯文本的javascript代码
          //既支持跨域资源，也支持本地资源，服务器返回的以javascript代码直接执行
          //{ username: "zhangsanlisiwangwsu" }
            success:function(res){
                console.log(res);
            }
        })
    </script>
</head>
<body>
</body>
</html>
```



- jsonp : 在一个jsonp请求中重写回调函数的名字。这个值用来替代在"callback=?"中的 callback
- jsonpCallback : 为jsonp请求指定一个回调函数名。这个值将用来取代jQuery自动生成的随机函数名。
```javascript
 $.ajax({
        url:'http://study.com/data.php',
        dataType : 'jsonp',
        jsonpCallback:"myCall",
        jsonp:"funcName",
        success:function(data){
        }
    })
//  ?funcName=myCall&_=1488624180015
 //如果不设置 jsonp和 jsonpCallback 
 // ?callback=jQuery111103367937101396201_1488624279118&_=1488624279119
```



- type :  jQuery默认  GET   其他值 POST ,规定请求的方式；

- async  Boolean (默认: true) 默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。

- cache : 默认为true ，缓存 ，dataType : jsonp script  的时候默认为false

- data : 传递给服务器的数据 ，如果是对象，则自动转化为字符串；必须为key/value 格式，如果value值是数组，则将为相应 的key对应每个数组的值；**如果是GET请求，需要将参数附在url之后**　

  ```html
  data:{ "name":"Jhon", "age":[13,14] },
  jQuery将解析成这样的字符串 :   ?name=Jhon&age%5B%5D=13&age%5B%5D=14  传递给服务器；
  ```

  **必须** 为 data: { "name":"Jhon","age":14 }   这种格式，其他的都会报错；

  **即使** 是data: ' {"name":"Jhon","age":15} '  这种形式，发送到服务器的数据有误；

  **当以键值对的对象发送给后台数据的时候，可以被转化为JSON的数据格式，key值方便后台查询** 

- processData : (默认: true) 默认情况下，通过data选项传递进来的数据，如果是一个对象(技术上讲只要不是字符串)，都会处理转化成一个查询字符串，以配合默认内容类型 
  "application/x-www-form-urlencoded"。如果要发送 DOM 树信息或其它不希望转换的信息，请设置为 false。

  发送 XML 数据至服务器。设置 processData 选项为 false，防止自动转换数据格式。
*  jsonp : JSON with padding 底层实现原理其实就是动态的创建<script>标签，然后利用scritp的src属性不受同源策略的约束来跨域获取数据；

- timeout : 设置请求超时时间，以毫秒计；比如设置了 timeout:3000,如果服务器3 秒内没有响应的阿虎，那么则断开这个请求链接；

- success : function( data,textStatus,XHR){    }     请求成功才会执行该函数体，从服务器返回的数据直接返回给该函数的参数；参数：由服务器返回，并根据dataType参数进行处理后的数据；描述状态的字符串

  注意:此时返回的data的类型由dataType 决定，html text script返回的是  字符串类型的文本；

  ​	json 会返回javascript对象  ;  xml  会返回xml 文档 ；

- beforeSend : function( XHR ){  }

  传入一个xhr对象，包含XMLHttpRequset相关的属性详细的信息；

```php
<?php
    echo "ok";
    echo $_GET["name"];
    echo $_GET["age"];
?>
```

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<input type="button" value="触发ajax"/>
<script src="jquery-1.12.4.js"></script>
<script>
    $.ajax({
        url:"05-ajxacallback.php",

        type:"GET",
        data:{"name":"Jhon","age":15},
//        data:{
//            "name":"Jhon",
//            "age":[13,14]
//        },//不能这种形式
        //  ?name=Jhon&age%5B%5D=13&age%5B%5D=14
//       data :{
//            "name":[{"name":"Jhon","age":14}]
//        } ,不能这种形式
        dataType:"html", //可以改变属性值，
        beforeSend:function(){
            console.log(arguments);
        },
        complete:function(){
            console.log(arguments);
        },
        success:function(res){
            console.log(res);
            console.log(typeof res);
           console.log(arguments);
        }
    })
</script>
</body>
</html>
```

如果请求的数据类型和返回的数据类型不同的话，则不会执行success函数













