---
title: RegExp Review
date: 2016-10-22 12:36:00
categories: javascript
comments : true 
updated : 
layout : 
---

先来看下正则中的特殊字符


| **特别字符** | **说明**                                   |
| -------- | ---------------------------------------- |
| $        | 匹配输入字符串的结尾位置。如果设置了 RegExp 对象的 Multiline 属性，则 $ 也匹配 ‘\n' 或 ‘\r'。要匹配 $ 字符本身，请使用 \$。 |
| ( )      | 标记一个子表达式的开始和结束位置。子表达式可以获取供以后使用。要匹配这些字符，请使用 \\( 和 \\)。 |
| *        | 匹配前面的子表达式零次或多次。要匹配 * 字符，请使用 \*。          |
| +        | 匹配前面的子表达式一次或多次。要匹配 + 字符，请使用 \+。          |
| .        | 匹配除换行符 \n之外的任何单字符。要匹配 .，请使用 \。           |
| [ ]      | 标记一个中括号表达式的开始。要匹配 [，请使用 \[。              |
| ?        | 匹配前面的子表达式零次或一次，或指明一个非贪婪限定符。要匹配 ? 字符，请使用 \?。 |
| \        | 将下一个字符标记为或特殊字符、或原义字符、或向后引用、或八进制转义符。例如， ‘n' 匹配字符‘n'。'\n' 匹配换行符。序列 ‘\\' 匹配 “\”，而 ‘\(' 则匹配 “(”。 |
| ^        | 匹配输入字符串的开始位置，除非在方括号表达式中使用，此时它表示不接受该字符集合。要匹配 ^ 字符本身，请使用 \^。 |
| { }      | 标记限定符表达式的开始。要匹配 {，请使用 \{。                |
| \|       | 指明两项之间的一个选择。要匹配 \|，请使用 \|。               |

正则中的限定符

| 字符    | 描述                                       |
| ----- | ---------------------------------------- |
| *     | 匹配前面的子表达式零次或多次。例如，zo* 能匹配 “z” 以及 “zoo”。* 等价于{0,}。 |
| +     | 匹配前面的子表达式一次或多次。例如，’zo+’ 能匹配 “zo” 以及 “zoo”，但不能匹配 “z”。+ 等价于 {1,}。 |
| ?     | 匹配前面的子表达式零次或一次。例如，”do(es)?” 可以匹配 “do” 或 “does” 中的”do” 。? 等价于 {0,1}。 |
| {n}   | n 是一个非负整数。匹配确定的 n 次。例如，’o{2}’ 不能匹配 “Bob” 中的 ‘o’，但是能匹配 “food” 中的两个 o。 |
| {n,}  | n 是一个非负整数。至少匹配n 次。例如，’o{2,}’ 不能匹配 “Bob” 中的 ‘o’，但能匹配 “foooood” 中的所有 o。’o{1,}’ 等价于 ‘o+’。’o{0,}’ 则等价于 ‘o*’。 |
| {n,m} | m 和 n 均为非负整数，其中n <= m。最少匹配 n 次且最多匹配 m 次。例如，”o{1,3}” 将匹配 “fooooood” 中的前三个 o。’o{0,1}’ 等价于 ‘o?’。请注意在逗号和两个数之间不能有空格。 |

正则中的操作符优先级

| 操作符                       | 描述      |
| ------------------------- | ------- |
| \                         | 转义符     |
| (), (?:), (?=), [ ]       | 圆括号和方括号 |
| *, +, ?, {n}, {n,}, {n,m} | 限定符     |
| ^, $, \anymetacharacter   | 位置和顺序   |
| \|                        | “或”操作   |

1  单词字符包括 0-9 a-z A-Z  _   下划线

元字符 \w 查找单词字符   \W 查找非单词字符

```javascript
var reg = /\byou/g; //  \b可以匹配单词的边界,单词中以you开头的you将会被匹配到
var result ;
while((result = reg.exec(str)) != null){
  console.log(result);
  console.log(reg.lastIndex);
}
```

2 \b  元字符匹配单词边界  在单词边界匹配的位置，单词字符后面或前面不与另一个单词字符直接相邻

\B 元字符匹配非单词边界  通常用于查找不处在单词的开头或结尾的匹配

```javascript
var str = 'hello youthereyou yourighthere ';
var reg2 = /\Bthere/g  ;//用来匹配 不在单词开头的there
var result ;
while((result = reg2.exec(str)) != null){
  console.log(result);
  console.log(reg2.lastIndex);
}
//---------------------------------------------
var reg2 = /there\B/g ;//匹配不在单词结尾的there 
```

3       .  元字符用于查找单个字符，除了换行和行结束符。

```javascript
//exec() 方法用于检索字符串中的正则表达式的匹配。如果找不到，则返回null
var str = 'that is hot';
var reg = /h.t/g;
var ret ;
while( (ret = reg.exec(str) ) != null){
  console.log(ret);// Array[1][0:"hat"index:1,input:"that is hot",length:1]
  //Array[1][0:"hot"index:8,input:"that is hot",length:1]

  console.log(reg.lastIndex);// 4 11  exec()方法 RegExpObject 的 lastIndex 属性设置为匹配文本的最后一个字符的下一个位置
}
```

```javascript
//match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。返回匹配结果的数组，如果找不到返回null
var str = 'that is hot';
var reg = /h.t/g;
var ret = str.match(reg);
console.log(ret1);//["hat", "hot"]
```

4 \s