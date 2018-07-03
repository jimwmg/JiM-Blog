---
title: forin 遍历数组和对象细节 
date: 2015-09-19 12:36:00
categories: javascript
comments : true 
updated : 
layout : 
---

##  for  in     

```javascript
//for in 遍历的是数组的索引 ，而不是数组的值 	
	var arr= ["name","age","address"]
    for (let key in arr ){
        console.log(key);
    }
//---------------------------------------
//遍历对象的时候，遍历的是对象的属性，而不是属性值
 	var obj = {name:"Jhon",age:14};
    for(let key in obj){
        console.log(key);
    }

```

