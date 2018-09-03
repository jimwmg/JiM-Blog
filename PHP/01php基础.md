---
title:PHP基础
---

[菜鸟教程](http://www.runoob.com/php/php-variables.html)

### 1 php基本概念

#### 1.1 变量和输出

PHP 变量规则：（php没有变量声明的命令，变量在第一次赋值的时候被创建，所有在函数外声明的变量拥有全局作用域，全局作用域可以通过global关键字进行访问）

- 变量以 $ 符号开始，后面跟着变量的名称
- 变量名必须以字母或者下划线字符开始
- 变量名只能包含字母数字字符以及下划线（A-z、0-9 和 _ ）
- 变量名不能包含空格
- 变量名是区分大小写的（$y 和 $Y 是两个不同的变量）

变量的作用域是脚本中变量可被引用/使用的部分。

PHP 有四种不同的变量作用域：

- local
- global
- static
- parameter

在所有函数外部定义的变量，拥有全局作用域。除了函数外，全局变量可以被脚本中的任何部分访问，要在一个函数中访问一个全局变量，需要使用 **global** 关键字。

当一个函数完成时，它的所有变量通常都会被删除。然而，有时候您希望某个局部变量不要被删除。

要做到这一点，请在您第一次声明变量时使用 **static** 关键字：

echo 和 print 区别:

- echo - 可以输出一个或多个字符串
- print - 只允许输出一个字符串，返回值总为 1

**提示：**echo 输出的速度比 print 快， echo 没有返回值，print有返回值1。

#### 1.2 数据类型：函数 var_dump($cars)  可以用来判断数据类型；

String（字符串）, Integer（整型）, Float（浮点型）, Boolean（布尔型）, Array（数组）, Object（对象）, NULL（空值）。

#### 1.3 常量：常量是一个简单值的标识符。该值在脚本中不能改变。

通过define（）函数定义；

一个常量由英文字母、下划线、和数字组成,但数字不能作为首字母出现。 (常量名不需要加 $ 修饰符)。

**注意：** 常量在整个脚本中都可以使用，默认是全局变量；

该函数有三个参数:

- **name：**必选参数，常量名称，即标志符。
- **value：**必选参数，常量的值。
- **case_insensitive** ：可选参数，如果设置为 TRUE，该常量则大小写不敏感。默认是大小写敏感的。

#### 1.4 [php string ](http://www.runoob.com/php/php-ref-string.html)   [php运算符](http://www.runoob.com/php/php-operators.html)  

#### 1.5 [php数组](http://www.runoob.com/php/php-arrays.html)

在 PHP 中，有三种类型的数组：

- **数值数组** - 带有数字 ID 键的数组

```php
这里有两种创建数值数组的方法：

自动分配 ID 键（ID 键总是从 0 开始）：

$cars=array("Volvo","BMW","Toyota");
人工分配 ID 键：

$cars[0]="Volvo";
$cars[1]="BMW";
$cars[2]="Toyota";
```

- **关联数组** - 带有指定的键的数组，每个键关联一个值

```php
这里有两种创建关联数组的方法：

$age=array("Peter"=>"35","Ben"=>"37","Joe"=>"43");
or:

$age['Peter']="35";
$age['Ben']="37";
$age['Joe']="43";
<?php
$x=array("one","two","three");
foreach ($x as $value)
{
    echo $value . "<br>";
}
?>


```

```php
<?php 
$age=array("Peter"=>"35","Ben"=>"37","Joe"=>"43"); 

foreach($age as $x=>$x_value) 
{ 
    echo "Key=" . $x . ", Value=" . $x_value; 
    echo "<br>"; 
} 
Key=Peter, Value=35
Key=Ben, Value=37
Key=Joe, Value=43
```

- **多维数组** - 包含一个或多个数组的数组

```php
<?php
// 二维数组:
$cars = array
(
    array("Volvo",100,96),
    array("BMW",60,59),
    array("Toyota",110,100)
);
?>

```

 #### 1.6 php超级全局变量

PHP 超级全局变量列表:

- $GLOBALS
- $_SERVER
- $_REQUEST
- $_POST
- $_GET
- $_FILES
- $_ENV
- $_COOKIE
- $_SESSION

