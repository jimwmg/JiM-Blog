---
title: 数组API
---

### 1 数组

日常开发中数组是我们用的最多的数据结构，那么他的那些API都有哪些，并且这些API的返回值，参数，以及是否开辟了新的内存空间之类的，我们是否真的知道，这些都是很基础的东西，但是也是容易被忽略的地方；

### 2 改变原数组的一些API

* push: 向数组最后添加元素，**返回改变之后的数组的长度**；**改变原来的数组** `arr.push(ele1,ele2,...)`
* pop: 将数组最后一个元素删除，**返回被删除的元素**，如果数组为空，则返回undefined;**改变原来的数组**
* unshift: 向数组的前面添加元素，**返回改变之后数组的长度**；**改变原来的数组**
* shift: 将数组的第一个元素删除，**返回被删除的元素**，如果数组为空，返回undefined;**改变原来的数组**
* splice: 移除数组中的一些元素，**或者向数组中添加一些元素，返回被删除的元素组成的数组**，如果没有元素被删除，则返回一个空数组，**改变原来的数组**；

### 3 不改变原来数组的API

* concat: 将数组和传入的元素融合，返回一个新的数组；**不改变原来的数组，开辟新的内存** `arr.concat(ele1,ele2,...)`如果ele是数组，则会一个个放入；
* slice: 返回一个数组中从开始位置（包括）到结束位置（不包括）的新的数组，**不改变原数组，开辟新的内存**

### 4 数组的遍历方法

* map: 返回一个通过传入map中的函数处理数组每一项之后的新数组；

使用 map 方法处理数组时，**数组元素的范围是在 callback 方法第一次调用之前就已经确定了**。在 map 方法执行的过程中：原数组中新增加的元素将不会被 callback 访问到；若已经存在的元素被改变或删除了，则它们的传递到 callback 的值是 map 方法遍历到它们的那一时刻的值；而被删除的元素将不会被访问到。`map `不修改调用它的原数组本身（当然可以在 `callback` 执行时改变原数组）。

```javascript
let numArr = [1,2,3,4];
const ret = numArr.map((num,i,arr) => {
    console.log(num)
    if(num === 2) {
        // arr.shift();
        numArr.push('5')
    }
    return num * 2;
})
console.log(ret)
console.log(numArr);
```



* reduce:

* reduceRight:

* filter:

* every:

* some:

* find:

* includes:

* indexOf:

* forEach: 该函数遍历的范围在第一次调用 callback的时候就会确定；

  -- `forEach` **遍历的范围在第一次调用 `callback` 前就会确定**。调用`forEach` 后添加到数组中的项不会被 `callback` 访问到。如果已经存在的值被改变，则传递给 `callback` 的值是 `forEach` 遍历到他们那一刻的值。已删除的项不会被遍历到。如果已访问的元素在迭代时被删除了(例如使用 [`shift()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)) ，之后的元素将被跳过 - 参见下面的示例。

  -- `forEach()` 为每个数组元素执行callback函数；不像[`map()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 或者[`reduce()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) ，它总是返回 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)值，并且不可链式调用。典型用例是在一个链的最后执行副作用。

  -- **注意：** 【没有办法中止或者跳出 forEach 循环】，除了抛出一个异常。如果你需要这样，使用forEach()方法是错误的，你可以用一个简单的循环作为替代。如果您正在测试一个数组里的元素是否符合某条件，且需要返回一个布尔值，那么可使用 [`Array.every`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every) 或 [`Array.some`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)。如果可用，新方法 [`find()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find) 或者[`findIndex()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) 也可被用于真值测试的提早终止。

```javascript
let numArr = [1,2,3,4];
numArr.forEach((num,i,arr) => {
    if(num === 2) {
        // arr.shift();
        numArr.push('5')
    }
    console.log(num)
})
var words = ['one', 'two', 'three', 'four'];
words.forEach(function(word) {
  console.log(word);
  if (word === 'two') {
    words.shift();
  }
});
// one
// two
// four
```

```javascript
let arr = [1,4,5,2,7,8]
function ret(){
  arr.forEach((v) => {
    if(v === 2){

      return ;
    }
    console.log('v',v)

  })
}
ret() //1 4 5 7 8
//函数将会在return语句执行后立即中止。
function ret2(){
  for(let i = 0;i < arr.length;i++){
    if(arr[i] === 2){
      return
    }
    console.log(arr[i])
  }
}
ret2() // 1 4 5
```



对于`forEach map`等数组API是在调用的时候就确定了数组的遍历范围不同，`for-of`可以在访问到循环的过程中push进数组的新值；

```javascript
let numArr = [1,2,3,4];
for(let v of numArr) {
    console.log(v);
    if(v === 2) {
        numArr.push(9);
    }
}
```

### 5 数组静态API

#### Array.from

The `**Array.from()**` method creates a new, shallow-copied `Array` instance from an array-like or iterable object.

```javascript
Array.from(arrayLike[, mapFn[, thisArg]])
```

数组的深拷贝

```javascript
function deepCloneArr(value){
  return Array.isArray(value) ? Array.from(value,deepCloneArr) : value;
}
```

```javascript
let set = new Set();
set.add({age:"18"});
set.add('ssdad');
let map = new Map();
map.set('key1',{age:18})
map.set({},{obj:'obj'})
function arrayFrom(value,fn){
  return Array.from(value,fn)
}
arrayFrom(map,function(val,index){
  console.log('map-val,index',val,index);
  return val
})
//'map-val,index' ['key1',{age:18}]  0
//'map-val,index' [{},{obj:'obj'}]  1
arrayFrom(set,function(val,index){
  console.log('set-val,index',val,index);
  return val
})
//set-val,index {age: "18"} 0
//set-val,index ssdad 1
```

