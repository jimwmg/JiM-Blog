---
title: Array Sort
date: 2016-10-02 12:36:00
categories: javascript 
tegs : sort
comments : true 
updated : 
layout : 
---

## 数组的sort方法----改变原数组

简单粗暴直接上代码咯(sort方法的定义请查阅W3C或者搜索)

**注意:sort(fn) 方法可以接受一个 方法为参数 ，这个方法有两个参数。分别代表每次排序比较时的两个数组项。sort()排序时每次比较两个数组项都回执行这个参数，并把两个比较的数组项作为参数传递 给这个函数。**

### **当函数返回值为  1  的时候就交换两个数组项的顺序，否则就不交换。**　

sort方法排序的关键是在于传入函数的返回值;**改变原数组**，并不产生新的数组；如果fn这个参数被省略，那么元素将按照 ASCII 字符顺序进行升序排列。

### 一  数字类型数组排序

```javascript
 var arr = [21,35,24,12,15,2,3,65,64]
  arr.sort(function(){
       console.log(arguments);
       console.log(this);
   })
  
  //从控制台结果可以看出sort传递的函数默认有两个参数，这两个参数就是要排序的数组里面的两项
  //函数执行的this指向window;
  //如果调用该方法时没有使用参数，将按字母顺序对数组中的元素进行排序，是按照字符编码的顺序进行排序。
```

```javascript
 var arr = [21,35,24,12,15,2,3,65,64]
    arr.sort(function(a,b){
        return a - b ;
    })
    //这种方法可以排序数字数组，却不能排序字符串数组，如下有代码案例
    console.log(arr);
//注意 - 操作符的运算，对于数字类型的运算数，结果返回数字  
//a-b输出从小到大排序，b-a输出从大到小排序。
```

```javascript
var arr = ['eca','bda','acf','dfe'];
arr.sort()
console.log(arr);
//["acf", "bda", "dfe", "eca"]
//如果调用该方法时没有使用参数，将按字母顺序对数组中的元素进行排序，说得更精确点，是按照字符编码的顺序进行排序。要实现这一点，首先应把数组的元素都转换成字符串（如有必要），以便进行比较
```

```javascript
var arr = ['eca','bda','acf','dfe'];
    arr.sort(function(a,b){
        return a - b ;
    })
    //这种方法不能排序字符串
console.log(arr);
//["eca", "bda", "acf", "dfe"]
//这个排序功能就没有了，因为 - 运算符操作的运算数如果有一个不是数字，那么就会返回NaN，没有返回1 -1 或者0任意一个;
```

### 二  字符串数组排序

那么如何才能排序字符串呢？这个之前需要先了解，字符串的比较 < <= > >= 返回一个布尔类型的值

对于字符串，第一个字符串中每个字符的代码都与会第二个字符串中对应位置的字符的代码进行数值比较。完成这种比较操作后，返回一个 Boolean 值。

所以对于字符串的排序，需要进行比较运算的运用，判断字符代码的大小，然后选择返回 1  -1  还是 0 

```javascript
 var arr = ['eca','bda','acf','dfe'];
    function sortStr (str1,str2){
        if(str1 > str2){    //如果str1 > str2 交换二者的位置
            return 1 ;
        }else if (str1 < str2 ){ //如果str1 < str2 则不交换
            return -1;
        }else{
            return 0;
        }
    }
    
    arr.sort(sortStr);
    console.log(arr);
    //["acf", "bda", "dfe", "eca"]  按字母升序排列
```

```javascript
var arr = ['eca','bda','acf','dfe'];
function sortStr (str1,str2){
    if(str1 > str2){
        return -1 ;//1  变为-1 
    }else if (str1 < str2 ){
        return 1;// -1 变为1 
    }else{
        return 0;
    }
}

arr.sort(sortStr);
console.log(arr);
//["eca", "dfe", "bda", "acf"]  按字母降序排列
```

此方法通用数字数组

### 三  如果数组里面存放一组对象呢？如何按照对象的某一个数据进行排序？

```javascript
 function  sortByProperty(sortName){
       return function (o1,o2){
           if(o1[sortName] > o2[sortName] ){
               return 1 ;
           }else if(o1[sortName] < o2[sortName]){
               return -1 ;
           }else{
               return 0 ;
           }
       }
   }
    arr.sort(sortByProperty("id"))
    console.log(arr);
//同样，可以按照不同的属性进行排序
```

### 四 如何打乱一个随机数组

```javascript
function randomsort(a, b) {
  return Math.random()>.5 ? -1 : 1;
  //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
}
var arr = [1, 2, 3, 4, 5];
arr.sort(randomsort);
console.log(arr);
```

或者更简洁

```javascript
arr.sort(function(){
    return Math.random() - 0.5;
})
```









