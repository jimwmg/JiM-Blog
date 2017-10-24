---
title:  isNaN And NumberisNaN
date: 2017-04-19 12:36:00
categories: ES6
tags : [NaN]
comments : true 
updated : 
layout : 
---

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <script>
        //Number.isNaN() 不会进行类型转化，直接进行isNaN的判断；简而言之就是分两步
        //第一步，如果传入的参数不是类型不是number直接返回 false 
        //第二步，如果传入的参数类型是number,判断是不是NaN，如果是返回true,否则返回false
        //这里需要注意的一点是  NaN也是number类型的数据
        /*
        Number.isNan() does not convert the values to a Number, and will  return false for any value that is not of the type Number【

If Type(number) is not Number, return false.
If number is NaN, return true.
Otherwise, return false.*/
        console.log(Number.isNaN(1));//false
        console.log(Number.isNaN('str'));//false  
        console.log(Number.isNaN(NaN));//True  

        //全局方法isNaN（）会先将参数转为Number 类型，在判断是否为NaN ，所以在类型转换失败或运算错误时值为NaN，返回true，其他全为false

        //全局isNaN会先进行类型转化为Number类型,这个时候需要掌握Number类型转化的规则，如果转化结果是NaN，那么isNaN返回true,其他全部为false

        /*
        The global isNaN() function converts the tested value to a Number, then tests it.【

            If value can not convert to Number, return true.
            else If number arithmethic result  is NaN, return true.
            Otherwise, return false.*/
        console.log(isNaN('str'));//true
        console.log(isNaN(1));//fasle
        console.log(isNaN(undefined));//true
        console.log(isNaN("Hello"));//true

        /*
        isNaN() 函数通常用于检测 parseFloat() 和 parseInt() 的结果，以判断它们表示的是否是合法的数字。当然也可以用 isNaN() 函数来检测算数错误，比如用 0 作除数的情况。*/
    </script>
</body>
</html>
```

