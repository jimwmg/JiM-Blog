---
title:String小结
date: 2017-08-28
categories: string
tags: 
---

### 1 字符串的操作在工作中用的很频繁，每个API的一些基本用法以及细节，技巧等需要我们掌握的透彻，才能融会贯通

### 2 基本API

* str.charAt(index) :index的值是0-str.length,index如果没有提供值，则默认是0，该方法返回字符串指定位置处的字符；

  ​	如果index值超过了索引范围，那么返回空字符串；

* str.charCodeAt(index):index的值是0-str.length,index如果没有提供值，则默认是0,该方法返回字符串指定位置处字符的UTF-16的数值，如果index值超过了索引值，那么返回NaN；

* str.indexOf(searchValue,[,fromIndex]) : searchValue是要搜索的字符串，如果在str中找到了要被搜索的字符串，则返回该字符串第一次出现的索引，如果在str中找不到要搜索的字符串，则返回-1；fromIndex的值

* str.substr(start,[,length] ) : start开始截取 的字符串位置，length从开始截取的字符串位置，的字符个数。如果没有赋值，则截取从开始到最后的所有字符；并不改变原来的字符串；

  ```javascript
  eg: var str = 'http:aaa/bb/ccc '  str.substr(0,str.lastIndexOf('/'))  // http:aaa/bb
  ```

* str.replace(regexp|substr, newSubStr|function) ：该方法并不会改变原来的字符串，而是生成一个新的字符串；

  如果是function,那么function接受的参数包括match(匹配的字符串) p1….pn. 正则中由（）扩起来的匹配到的表达式，offset 匹配到的字符串在原字符串中的偏移量（从0开始） string 被匹配的字符串；需要注意的是p1..pn，如果正则表达式中没有用（） 扩起来的正则表达式，那么function函数则不会被传递p1...pn参数；

* str.match(reg)  ：当一个字符串与一个正则表达式匹配的时候，match方法检索匹配项，如果正则带g标志，那么返回匹配到的所有字符串组成的数组，如果不带g标志，那么返回第一个匹配的的正则的数组；如下

```javascript
var str = 'nameaammmgagagegeagage'
var r = str.match(/a/g);
console.log(r)
VM196:1 (7) ["a", "a", "a", "a", "a", "a", "a"]
var arr = str.match(/a/)
console.log(arr)
VM252:1 ["a", index: 1, input: "nameaammmgagagegeagage"]
```

* 静态 **String.fromCharCode()** 方法返回由指定的UTF-16代码单元序列创建的字符串。