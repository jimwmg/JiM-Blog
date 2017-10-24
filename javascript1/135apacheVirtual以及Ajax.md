---
title: apache virtual and Cross Origin
date: 2016-09-13 12:36:00
categories: http  
tags : [apache,跨域]
comments : true 
updated : 
layout : 
---

写在前面:有兴趣的还是可以阅读下httpd.conf以及httpd-vhosts.conf 文件里面的注释，方便理解；

### 1 如何搭建本地apache服务器?

下载wamp软件，安装完毕之后，启动apache服务器，在浏览器URL地址栏输入127.0.0.1或者localhost便可以进入apache主页(此时服务器默认的访问路径是(D是我安装在D盘) D/wamp/www/    文件夹下面的index开头的文件,)

1.1 配置服务器访问路径

找到wamp —>bin —>apache  目录下面的   httpd.conf  修改默认访问路径,将 D/wamp/www/ 比如修改为 F:/mywork/

* httpd.conf  中 DocumentRoot 可以修改默认访问的路径  F:/mywork/

* httpd.conf 中 Directory 也要修改默认路径F:/web/

* 如果该路径F:/mywork/  里面有index.html  index.php 等以index命名的文件,会直接打开该文件，如果没有则进入F:/mywork/该目录

* 为什么会默认打开index开头的文件呢？在httpd.conf文件中,如下代码设置了默认打开目录下面的文件名字

   DirectoryIndex决定打开虚拟主机的时候，默认打开的文件名称

```
<IfModule dir_module>
    DirectoryIndex index.php index.php3 index.html index.htm
</IfModule>
```

* 访问自己的服务器的三种方式：本机的IP地址   127.0.0.1  localhost    httpd.conf   文件中listen 可以更改端口
* 此时在通过localhost或者127.0.0.1 再次进入的时候就会进入F:/mywork目录里面来(如果该目录下面有index开头的文件会默认直接打开该文件，如果没有的话则打开该目录) 
* 只有在这里配置了目录之后，在配置虚拟主机的时候，虚拟主机的目录也必须是这个目录，或者这个目录的子目录

```
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot " F:/mywork/"    //如果在虚拟主机配置的目录和F:/web不一致，则没有权限进入该目录，无论是通过localhost 还是通过127.0.0.1 都无法进入虚拟主机，必须要和服务器设置的访问路径保持一致;
    ServerName test.com
    ServerAlias www.test.com
    ErrorLog "logs/dummy-host.example.com-error.log"
    CustomLog "logs/dummy-host.example.com-access.log" common
</VirtualHost>
```

1.2 配置服务器**通过域名访问** 虚拟主机

* 先要明确配置虚拟主机的目的，上面第一步所实现的功能是，我们可以通过localhsot或者127.0.0.1以及本机ip地址来访问我们的服务器(也就是后来修改的文件目录 F:/mywork/)

httpd.conf 文件中找到 # Virtual hosts 打开这行代码下面一行的 # 号

```
Include conf/extra/httpd-vhosts.conf
```

当我们打开虚拟主机之后，重启apache服务，在通过localhost或者127.0.0.1已经无法进入 F:/mywork/目录，需要重新配置wamp —>bin —>apache—>extra—>httpd-vhosts.conf文件

```
VirtualHost example:
# Almost any Apache directive may go into a VirtualHost container.
# The first VirtualHost section is used for all requests that do not
# match a ServerName or ServerAlias in any <VirtualHost> block.
也就是说当我们设置虚拟主机的时候，Apache在所有的VirtualHost container中如果没有找到匹配的serverName或者ServerAlias的时候，会直接进入第一个Virtual Block
```

如下配置，我设置了三个主机，分别是mainVirtual   myVirtual1    myVirtual2  对应不同的路径，但是都是F:/web/或者F:/web/的子目录，然后通过 ServerName  ServerAlias设置的对应值，在浏览器的URL地址栏就可以访问了

1.2.1 设置host文件 C:\Windows\System32\drivers\etc  下面的host文件,我们在这里配置的域名，如果在URL地址栏输入该域名，我们就可以访问这个本机虚拟主机；

```javascript
127.0.0.1   www.mainVirtual.com
127.0.0.1   www.myVirtual1.com
127.0.0.1   www.myVirtual2.com
```

1.2.2 设置wamp —>bin —>apache—>extra—>httpd-vhosts.conf文件

```
#  operation by JiM
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "F:/web/"
    ServerName  mainVirtual.com   
    ServerAlias www.mainVirtual.com
    ErrorLog "logs/dummy-host.example.com-error.log"
    CustomLog "logs/dummy-host.example.com-access.log" common
</VirtualHost>
# this is JiM's test for the Virtual container for myVirtual1
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "F:/web/myVirtual1"
    ServerName myVirtual1.com    
    ServerAlias www.myVirtual1.com
    ErrorLog "logs/dummy-host.example.com-error.log"
    CustomLog "logs/dummy-host.example.com-access.log" common
</VirtualHost>
# this is JiM's test the Virtual container for myVirtual2
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "F:/web/myVirtual2"
    ServerName myVirtual2.com    
    ServerAlias www.myVirtual2.com
    DirectoryIndex doc.html     //假如文件目录下有一个doc命名的文件，则DirectoryIndex的设置可以默认打开该文件
    ErrorLog "logs/dummy-host.example.com-error.log"
    CustomLog "logs/dummy-host.example.com-access.log" common
</VirtualHost>
```

1.2.3 这个时候我们通过www.mainVirtual.com    www.myVirtual1.com   www.myVirtual2.com就可以访问我们对应的主机咯(每个路径对应的目录要事先创建好)

### 2 在本地搭建的服务器测试跨域的几种方案(同一域名下的不同子域之间也受同源策略的限制)

假如 我在之前搭建的www.myVirtual1.com域下，也就是F:/web/myVirtual1文件夹下面有一个文件 test1.php  

www.myVirtual2.com这个域内的文件想访问www.myVirtual1.com下面的test1.php文件

URL(Uniform Resource Locator) 地址用于描述一个网络上的资源,  基本格式如下

```
scheme://host[:port#]/path/.../[?query-string][#anchor]
```

scheme  host   port三者有一个不一样就发生了跨域，如何解决跨域？

2.1 Access-Control-Allow-Origin:域名   表示设置允许哪个域名进行访问

header("Access-Control-Allow-Origin: http://www.myvirtual2.com") 通过对访问的跨域资源设置响应头，允许某个指定的域名来访问该文件;

```php
//F:/web/myVirtual1/test1 .php     这个是我的虚拟主机1 里面的文件
<?php
    header("Access-Control-Allow-Origin: http://www.myvirtual2.com");
    $username = $_GET['username'];
    $array = ["Jhon","Jim","James","Robe"];
    $flag = in_array($username,$array);
    if($flag){
        echo '您可以登录';
    }else{
        echo "该用户名已经被注册";
    }
?>
```

这个是虚拟主机2 里面的请求文件

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<form action="test1.php" method="post">
    <input type="text" id="username" name="username"/><span id="message"></span><br>
    <input type="password" id="psw" name="psw"/>
</form>
<script src="jquery-1.12.4.js"></script>
<script>
    $(function(){
        $('#username').blur(function(){
            var username = $(this).val();
            console.log(username);
            $.ajax({
                url:'http://www.myvirtual1.com/test1.php?username=Jhon',
                type:'get',
                data:{"username": username} ,//代表发送到服务器的数据
                success:function(data){//如果请求成功了，则可以执行该函数
                    console.log(data);
                    $("#message").html(data)  ;
                }
            })
        })
    })
</script>
</body>
</html>
```

2.2 通过script标签 src属性

```php
<?php 
    header("Content-Type:text/script;charset=utf-8");//如果没有这个响应头，在开发者network里面可以查看请求和响应的详细信息,默认返回的是Content-Type:text/html文本格式的数据，不过这个也不影响，script标签还是会将其解析成javascript代码运行
    $callback = $_GET['callback'];
    $username = $_GET['username'];
    $array = ["Jhon","Jim","James","Robe"];
    $flag = in_array($username,$array);
    $data = "{0:'您可以登录',1:'该用户已经被注册'}";
    echo $callback.'('.$data.','.$flag.')';
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
<h1>请注册</h1>
<form action="" method="get">
    <input type="text" id="username" name="username"/><span id="message"></span><br>
    <input type="password" id="psw" name="psw"/>
</form>
<script src="jquery-1.12.4.js"></script>
<script>
    function getInfo(arg,flag){
        if(flag){
            console.log(arg);
            console.log(typeof arg);
            $("#message").html(arg[0]);
        }else{
            console.log("this count has been rejected");
            $("#message").html(arg[1]);
        }

    }
</script>
<script src='http://www.myvirtual1.com/test1.php?callback=getInfo&username=Jhon'></script>

</body>
</html>
```

2.3 jQuery.ajax通过jsonp来进行跨域请求,本质上使用script标签发送请求,获取到的数据作为javascript代码直接执行

```php
//F:/web/myVirtual1/test1 .php
<?php
    header("Content-Type:text/script;charset=utf-8");
    $callback = $_GET['callback'];
    $username = $_GET['username'];
    $array = ["Jhon","Jim","James","Robe"];
    $flag = in_array($username,$array);
    $data = "{0:'您可以登录',1:'该用户已经被注册'}
    echo $callback.'('.$data.','.$flag.')';
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
<h1>请注册</h1>
<form action="" method="get">
    <input type="text" id="username" name="username"/><span id="message"></span><br>
    <input type="password" id="psw" name="psw"/>
</form>
<script src="jquery-1.12.4.js"></script>
<script>
    function getInfo(arg,flag){
        console.log(flag);
      //这个flag一直是undefined,因为echo:flase不会有任何结果，不想改了，主要是理解跨域
        if(flag){
            console.log(arg);
            console.log(typeof arg);
            $("#message").html(arg[0]);
        }else{
            console.log("this count has been rejected");
            $("#message").html(arg[1]);
        }
    }
    $(function(){
        $('#username').blur(function(){
            var username = $(this).val();
            $.ajax({
                url:'http://www.myvirtual1.com/test1.php',
                type:'get',
                dataType:'jsonp',
                jsonpCallback:'getInfo',//用来替换jQuery自动生成的函数名,以便于直接执行getInfo函数
                data:{"username": username} ,//代表发送到服务器的数据
            })
        })
    })
</script>
</body>
</html>
```

2.4 通过反向代理进行跨域访问

反向代理作用1：减轻源服务器负载　　2：保障源服务器安全　　3：对源服务器进行负载均衡(Load Balance)。通过在服务器端设置代理服务，可以进行跨域访问

打开httpd-conf文件,打开以下两行代码中的#号

```javascript
LoadModule proxy_module modules/mod_proxy.so 
LoadModule proxy_http_module modules/mod_proxy_http.so  
```

我们在新建两个虚拟主机

```
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "F:/web/4myvirtual4"
    ServerName myvirtual4.com
    ServerAlias www.myvirtual4.com
    ErrorLog "logs/dummy-host.example.com-error.log"
    CustomLog "logs/dummy-host.example.com-access.log" common
</VirtualHost>
<VirtualHost *:80>
    DocumentRoot "F:/web/5myvirtual5"
    ServerName myvirtual5.com
    ServerAlias www.myvirtual5.com
    ProxyRequests Off
    ProxyPass /api http://www.myvirtual4.com
#这个时候访问http://www.myvirtual5.com/api 其实就是访问 http://www.myvirtual4.com
</VirtualHost>
```

- ProxyRequests Off 指令是指采用反向(reverse)代理
- ProxyPass 指令允许将一个远端服务器映射到本地服务器的 URL 空间中。

在F:/web/5myvirtual5 下面有一个文件 01proxy.html

```html
<script src="jquery.js"></script>
<script>
    $.ajax({
        type:'get',
        url:'/api/01proxy.php',
        success:function(data){
            console.log(data);
        }
    })
</script>
```

在F:/web/4myvirtual4 下有一个文件 01proxy.php

```php
<?php
 echo 'this is sonme data from virtual4'
?>
```

2.5 通过document.domain 设置**同一主域不同子域**中的页面相同的主域名，来允许不同子域之间进行访问

2.6 通过HTML5postMessage方法进行跨域操作，参见我的博客HTML5-postMessage

2.7  绕开浏览器，直接通过服务器端发送请求

2.8 关于其他跨域问题，比如其他的服务器会通过请求的referer信息进行访问的限制，可以通过设置

```html
<meta name=''>
```







