---
title: ES6 Set Map 
date: 2017-06-08 12:36:00
categories: ES6 
tags : set map
comments : true 
updated : 
layout : 
---

最近一直在忙react项目,好久没写博客了,需要用到immutable数据,这里先预热下map和set数据

### 1 Set数据结构,是ES6的新的数据结构,该数据结构类似于数组,但是和数组不同的一点就是,数组中可以有相同的成员,但是Set数据结构不允许数据成员有一样的,Set数据结构的成员都是唯一的.

有序且不可重复的列表

```
Set(4) {"car", "buble", "dog", "name"}
```

Set是一个构造函数,可以用来生成set数据结构,生成的

```
 var set1 = new Set()
 console.log(set);
 var set2 = new Set([1,2,3,4,4]) //这里的4最终在Set数据结构中只存在一项
```

**Set构造函数可以直接接受一个数组作为参数,然后将该数组初始化为Set数据结构,但是不能接受一个对象作为参数,会报错**

```javascript
var obj = {name:'Jhon',age:'13'}
var set = new Set(obj)
console.log(set) //报错
```

1.1 Set数据结构的属性和方法,通过输出我们在控制台可以看到Set构造函数原型链上的所有的API 

```  
-size          输出Set数据结构的成员个数
-add(value)    向Set数据实例添加成员,返回Set数据结构,可以进行链式操作
-clear()       删除Set数据结构中所有的成员,没有返回值
-delete(value) 删除Set数据结构中某一个成员,返回布尔值,表示是否删除成功
-has(value)    判断Set数据结构中是否包括某个成员,返回布尔值,表示是否包括某个成员
```

对于我们常用的数组去重,这里就有了更好的实现方法

这里需要明确Array.from() 方法的使用,该方法接受

* 类数组对象:拥有一个length属性和若干索引属性的任意对象
* 可遍历对象:比如Map 和Set 数据结构

```
数组去重的更加简单的方式
var s = new Set([1,2,3,5,5])
console.log(Array.from(s)) 
```

1.2 Set数据结构的遍历方法(Set数据结构可以理解为键名和键值是相同的)

```
-keys     返回遍历器对象(由于Set数据结构没有键名,只有键值,或者说键名和键值一样)所以keys和values方法行为完全一致
-values          (这个是Set数据结构默认遍历器接口,for-of循环)
-entries         返回遍历器对象
-forEach         没有返回值,对每个成员执行操作
```

```javascript
var set = new Set(['car','buble','dog'])
set.add('name')
console.log(set)
for(let i of set){  //Set结构实例默认可遍历,默认遍历器生成函数是values方法
  console.log(i);  //car bubble dog name 
}
console.log('setForeach=====')
set.forEach((value,key)=>console.log(value,key))
/*
car  car 
bubble bubble 
dog dog 
name name 
**/
```



### 2 Map数据结构,是ES6的新的数据结构,该数据结构类似于对象,也是键值对的集合,但是和对象不同的一点就是,对象中的中键名只能是字符串,但是Map数据结构的键名可以是任何数据类型,包括对象和数组 

键值对集合,对应于Object,Map对象

```
Map(2) {"a" => 1, "b" => 2}
```

所以这里需要注意的是Map数据结构的键名如果是复杂数据类型,那么判断键名是否一致的根本比较方式是判断的键名的内存地址,也就是说`{ }` 和 `{ }` 这两个键名代表的是不同的键名.

```javascript
var obj = {name:'Jhon',age:'13'}
var map = new Map()
console.log(map)
map.set(obj,'hello Map')  //对象作为键名
console.log(map.get(obj))
```

Map是一个构造函数,用来生成一个Map结构的数据对象

```
var map = new Map()
console.log(map)
```

1.1 Map数据结构的属性和方法,通过输出我们在控制台可以看到Set构造函数原型链上的所有的API 

```
-set(key,value)      给Map数据结构设置键值对,返回Map实例,所以可以进行链式调用,如果包含该键名,则会更新
-get(key)			获取Map数据结构键名对应的键值,如果找不到则返回undefined
-has(key)            判断Map数据结构是否包含某个键名,返回布尔类型值
-delete(key)		删除Map数据结构某个key,如果成功删除则返回ture,删除失败返回false
-clear()             方法清除所有成员,没有返回值
```

1.2 Map数据结构的遍历

```
-keys()  -values()  返回键名的遍历器 和键值的遍历器
-entries()          返回键名和键值组成的遍历器(Map数据默认遍历器接口就是这个 for-of )
```

```javascript
var obj = {name:'Jhon',age:'13'}
var arr = [1,2,3 ]

var map = new Map()
console.log(map)
map.set(obj,'hello Map')
map.set('heh',"hahahahh")
console.log(map.set(obj,'hello Map'))
console.log(map.get(obj))
console.log(map.has(obj))
console.log(map.get(obj))
for(let key of map.keys()){
  console.log(key)
}
for(let key of map.values()){
  console.log(key)
}
for(let key of map.entries()){
  console.log(key)
}
```

1.3 Map构造函数接受的参数:原生数据结构具有Iterator接口,比如数组,类数组对象,Map和Set数据

```javascript
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"
```

1.4 Map数据结构转化为数组,通过使用 `...` 扩展运算符,数组转化为Map结构,可以作为Map构造函数参数直接传入

```javascript
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```







 



