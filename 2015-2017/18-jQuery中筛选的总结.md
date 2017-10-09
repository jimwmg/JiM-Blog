---
title: jQuery选择器
date: 2016-09-17 12:36:00
tags: jQuery
categories: jQuery
comments : true 
updated : 
layout : 
---

jQuery中筛选的总结：

1  查找子代  children( ),如果不加选择器，那么将选择所有的子代元素，可以加一个选择器进行筛选；注意仅仅匹配子代元素，不匹配后代（子代的子代）；

   查找所有后代 find( " selector" ),可以选择所有的后代元素，包括子代的子代；

2 查找同辈元素：next() prev( ) 查找当前匹配到所有的对象的紧邻的后(前)一个元素；nextAll( ) prevAll( ),查找当前匹配对象的所有的对象的后面(前面)的所有元素；

3 查找匹配元素：first( )  last( ) ，查找匹配元素的第一个或者最后一个元素；

```html
<ul id="ulist">
    <li>list item 0</li>
    <li>list item 1
      <ul>
        <li>最里面的li</li>
      </ul>
  	</li>
    <li id="list">list item 2</li>
    <li>list item 3</li>
    <li>list item 4</li>
    <li>list item 5</li>
</ul>
$("#ulist").children()
$("#ulist").children("li");//不包括最里面的li
$("#ulist").find("li");//包括最里面的Li
$("#list").prev();//获取list item1 
$("#list").prevAll();//获取当前对象前面的所有的同辈元素
$("li").first();//查找匹配元素的第一个或者最后一个元素,此时匹配的是listitem0 
```

