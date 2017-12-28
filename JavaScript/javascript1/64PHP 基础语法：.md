---
title: PHP base  
date: 2016-12-11 12:36:00
categories: php
tags: php
comments : true 
updated : 
layout : 
---

PHP 基础语法(运行在服务器端的脚本语言)

1 定义变量  $str = "strings" \$num = 4 ; \$Bool = true ; \$float = 4.5;数据类型包括字符串，数值，布尔类型，浮点类型

2 定义数组 $arr = **array( )** ,php提供了  array这个函数帮助我们去定义一个数组；

$arr = **array** (2,"hello world",4)  这是索引数组，可以通过下标进行访问，注意array函数是关键

$arr =**array** ("name"=>"Jhon","age"=>23,"address"=>"china") 这是关联数组，类似于js的键值对；

4 echo  只能输出简单数据类型; print_r( ):可以输出复杂数据类型,比如数组;var_dump( )可以输出详细的信息，比如数组和对象

```php
<?php
header("Content-Type:text/html;charset=utf-8");
 $arr = array("name"=>"jhon","age"=>5);
 /*echo: 可以输出简单数据类型*/
// echo array["name"];
// echo array["age"];
 echo $arr["name"];
 echo "<br/>";
 echo $arr["age"];
 echo "<br/>";
 echo $arr;
 echo "<br/>";
 echo "next print";echo "<br/>";
 /*print_r()可以输出复杂数据类型*/
 print_r($arr["name"]);
 echo "<br/>";
 print_r($arr["age"]);
 echo "<br/>";
 print_r($arr);
 echo "<br/>";
 echo "next dump";echo "<br/>";
 /*var_dump()输出详细信息*/
 var_dump($arr["name"]);
 echo "<br/>";
 var_dump($arr["age"]);
 echo "<br/>";
 var_dump($arr);
 echo "<br/>";

 ?>
 //输出结果如下:
 /*jhon
   5
   Array
   next print
   jhon
   5
   Array ( [name] => jhon [age] => 5 )
   next dump
   string 'jhon' (length=4)

   int 5

   array
     'name' => string 'jhon' (length=4)
     'age' => int 5
*/
```
(对于布尔类型，echo print_r( ) 输出true为1，对于false 则不会输出内容 )
```php
<?php
header("Content-Type:text/html;charset=utf-8");
 $flag1 = false ;
 echo $flag1;//什么都不会输出
 print_r( $flag1);//什么都不输出
 var_dump($flag1);//boolean false
 $flag2 = true ;
 echo $flag2;//1
 print_r($flag2);//1
 var_dump($flag2);//boolean true
 $flag3 = 4 ;
 echo $flag3 ;//4
 $flag4 = "hello";
 echo $flag4;//hello
 $arr = array("name","Jhon");
 echo $arr;//Array
 echo {"name":"Jim","age":12};//直接报错
?>
```

5 php文件和HTML文件的关系，php文件中可以直接写HTML代码，会被解析成相应的标签，但是HTML文件却不能识别php代码,同样如果想在php代码中向页面输出标签，需要用  echo 或者print_r( )  向页面输出标签;

```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
    div{
        width:100px;
        height:100px;
        background-color:red;
    }
    </style>
</head>
<body>

    <div>欢迎</div>
    <?php
      		header("Content-Type:text/html;charset=utf-8");
            //这个代码是在服务端运行的，
            //我就可以在这里 从数据库取数据. 输出到页面上面
            echo "Jhon";
			echo "<P>你好</p>";
    ?>
</body>
</html>
```

```php
   <?php
//        <div>这个div在php里面</div> 如果HTMl代码出现在php代码块里面会直接报错
            //这个代码是在服务端运行的，
            //我就可以在这里 从数据库取数据. 输出到页面上面
            echo "Jhon";
    ?>
```

6 PHP  header()函数

```
header(string,replace,http_response_code)
```

| 参数                 | 描述                                       |
| ------------------ | ---------------------------------------- |
| string             | 必需。规定要发送的报头字符串。                          |
| replace            | 可选。指示该报头是否替换之前的报头，或添加第二个报头。默认是 true（替换）。false（允许相同类型的多个报头）。 |
| http_response_code | 可选。把 HTTP 响应代码强制为指定的值。即返回给客户端的数据格式       |

PHP文件中header的作用，给客户端一个响应头：1)规定文件以什么格式解析；2)charset规定**客户端浏览器以什么方式解析编码** 对**文件编码解析** 方式; 3)**charset需要设置编码方式** 的和**文件的自身编码** 方式一致，否则浏览器解析将出现乱码；4)Refresh可以服务器给客户端的相应;5)解决乱码问题 服务器到客户端，通过header头进行规定，

```php
header("Content-Type:text/javascript;charset=utf-8");//php文件将text解析成javascript,返回给浏览器,然后浏览器进行解析；浏览器文件编码解析方式是utf-8 
header("Content-Type:text/html;charset=GBK");//php文件将text解析成HTML，返回给浏览器，浏览器以html格式将其解析；浏览器文件编码解析方式是GBK；
header("Refresh:5;url=http://m.youyuanwang")
```

7 数组的方法，在php中没有length属性来获取数组的长度，那么如何获取数组的长度呢？count 方法

```php
count($arr1)   :  求数组arr1的长度 返回整形数值
in_array("value",$arr2) : arr2首先得是一个普通数组，可以判断在数组arr2中是否存在value，返回布尔类型值;
array_key_exists("vale",$arr3):arr3首先得是一个关联数组，可以判断数组arr3中是否存在value，返回布尔类型值
```

```php
<?php
header("Content-Type:text/html;charset=utf-8");
    $arr1 = array("name",2,"hello");//定义普通数组
    $arr2 = array("name"=>"jhon","age"=>17,"gender"=>"male");//定义关联数组
    //求数组的长度，返回数值类型
echo "getArrLength";
var_dump ( count($arr1) );//int 3
var_dump ( count($arr2) );//int 3
//求数组中是否存在某一个，返回布尔类型的值,只能用于普通数组
echo "getin-array";
var_dump (in_array("name",$arr1));// boolean true
var_dump (in_array("name",$arr2) );//boolean false
//判断数组中是否存在某个key，返回布尔类型数值,只适用于关联数组
echo "array_key_exists";
var_dump ( array_key_exists("name",$arr1));//boolean false
var_dump( array_key_exists("name",$arr2));//boolean true
?>
```

7 表单处理 注释：form 元素是块级元素，其前后会产生折行。

​	1)HTML代码

```html
表单name属性的是用来提供给服务端接收所传递数据而设置的；
表单action属性设置接受数据的处理程序,比如action="progress_form.php"，表示用progress_form.php程序处理form；
表单method属性设置发送数据的方式,method="get"  method="post",设置数据的上传到后台的的方式；
超链接和地址栏默认 method="get" 数据提交方式，如果想要上传文件，必须：form表单设置enctype="multipart/form-data",method="post"
```

​	2)PHP代码获取用户上传数据

```php 
$_GET  接受HTML代码部分以get方式的传值，比如超链接，地址栏,form表单设置method="get";$_GET是一个关联数组
$_POST 接受HTML代码部分以post方式的传值，比如form表单设置method="post";$_POST 是一个关联数组
$_FILES 接受文件上传
```

​	3)  \$_POST  客户端向服务器发送请求的时候，发送的信息不会在地址栏显示；变量是一个数组，内容是由 HTTP POST 方法发送的变量名称和值。并且对发送信息的量也没有限制。

### 例子

地址栏  		scheme://host.domain:post/pash/filename

```php+HTML
 <form action="login.php" method="post">
        昵称: <input type="text" name="username"> <br><br> //假设输入 Jhon
        密码：<input type="password" name="psw"><br><br> //假设输入 123456
        <input type="submit" value="post提交">
  </form>
  <?php
       header("Content-Type:text/html;charset=utf-8");
        //接收数据
       var_dump($_POST); //输出$_POST，查看$_POST的详细内容；
       $username=$_POST['username'];
       $password=$_POST['password'];
?>
//$_POST = array("username"=>"John","psw"=>"12345")，$_POST是一个关联数组，该数组内存放着用户上传的数据
//地址栏显示:http://127.0.0.1/02-php/02-get-post/03-loginphp.php
//127.0.0.1 这是我的域名   02-php/02-get-post/03-loginphp.php 这是我的电脑服务器处理程序的存储路径
```

​		$_GET    客户端向服务器发送请求的时候，发送的数据在地址栏的后面显示出来，\$_GET 变量用于收集来自 method="get" 的表单中的值。该变量是一个数组，内容是由 HTTP GET 方法发送的变量名称和值。对发送信息量有限制（最多 100 个字符）。

```html
 <a href="01get.php?username=zhangsan&age=11">get 方式提交</a>
地址栏显示:http://127.0.0.1/02-php/02-get-post/01-getphp.php?username=zhangsan&age=11
```

```php+HTML
<form action="login.php" method="get">
        昵称: <input type="text" name="username"> <br><br> //假设输入 Jhon
        密码：<input type="password" name="psw"><br><br> //假设输入 123456
        <input type="submit" value="get提交">
  </form>
  <?php
       header("Content-Type:text/html;charset=utf-8");
        //接收数据
       var_dump($_GET); //输出$_GET ,查看$_GET的详细内容
       $username=$_GET['username'];
       $password=$_GET['psw'];
?>
//$_GET = array("username"=>"John","psw"=>"12345")，$_POST是一个关联数组，该数组内存放着用户上传的数据
//地址栏显示:http://127.0.0.1/02-php/02-get-post/03-loginphp.php?username=lupan&psw=123456
 ?username=lupan&psw=123456  这是用户上传的数据,get方式上传数据可以直接在地址栏看到
```

​		$_FILES   input  type="file" \$FILES 将会包含<input type="file" name="photo">标签的相关信息；<form> 标签的 enctype 属性规定了在提交表单时要使用哪种内容类型。在表单需要二进制数据时，比如文件内容，必须使用 
"multipart/form-data"。

*  文件上传form**必须** 用method="post"方法，get方法无法上传file数据
*  form**必须** 有 enctype="multipart/form-data 属性，如果没有设置该属性，无法上传数据；
*  input  type 类型**必须** file;  这三者同时满足了才能 $_FILES才存在 。否则 var_dump(\$_FILES) 结果为 empty;

```php+HTML
<form action="01-filesupload.php" method="post" enctype="multipart/form-data" >
    <input type="file" name="lifephoto"/>
    <input type="submit" value="提交"/>
</form>
<?php
    header("Content-Type:text/html;charset=utf-8");
    var_dump($_FILES);
    //$_FILES是一个关联数组，(二维数组)
/*输出结果如下:
array
    'lifephoto' =>
      array
        'name' => string 'DSC_0002.JPG' (length=12)  //文件名
        'type' => string 'image/jpeg' (length=10)	//文件类型
        'tmp_name' => string 'D:\wamp\tmp\php3971.tmp' (length=23)  //临时存储地址
        'error' => int 0  	
        'size' => int 1672087
*/
    $tmp_name =  $_FILES['lifephoto']['tmp_name'];
    $fileName =$_FILES['lifephoto']['name'];
    $newFile = './'.time().'.jpg'
    move_uploaded_file($tmp_name,$newFile);
?>
//地址栏显示:http://127.0.0.1/02-php/03-files/01-filesupload.php
```

```php
move_uploaded_file($tmp_name,"images/".$fileName); 该方法可以用来改变用户上传的文件存储的地址。
```

8 file_get_contents() 函数把整个文件读入一个**字符串** 中。

和 [file()](func_filesystem_file.asp.htm) 一样，不同的是 file_get_contents() 把文件读入一个字符串。

file_get_contents() 函数是用于将文件的内容读入到一个字符串中的首选方法。如果操作系统支持，还会使用内存映射技术来增强性能。

```
file_get_contents(path,include_path,context,start,max_length)
```

| 参数           | 描述                                       |
| ------------ | ---------------------------------------- |
| path         | 必需。规定要读取的文件。                             |
| include_path | 可选。如果也想在 include_path 中搜寻文件的话，可以将该参数设为 "1"。 |
| context      | 可选。规定文件句柄的环境。context 是一套可以修改流的行为的选项。若使用 null，则忽略。 |
| start        | 可选。规定在文件中开始读取的位置。该参数是 PHP 5.1 新加的。       |
| max_length   | 可选。规定读取的字节数。该参数是 PHP 5.1 新加的。            |

该方法是服务器读取数据的常用方法，然后可以返回数据给到客户端。







** 注意:**

*  php每一行代码的最后必须有分号 “ ; ” ,必须在每一行作为结束;
*  单引号里面的变量不会被执行，会被当做字符串运行，双引号里面的变量会被执行，可以解析成变量代表的值；
*  echo   print_r()可以向页面中输出HTMl代码，但是var_dump()向页面输出的是<pre>标签
*  php里面的字符串拼接用的是  “ . ” 等价于js中的 “ + ”,会将结果转化为字符串；
*  php代码块里面不能出现HTML代码，会报错；