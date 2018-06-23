---
title: javascript 乱序算法
---

### 1 打乱一个数组

**需要注意的是 sort 这个乱序一个数组的方式是有问题的，参考MDN **

Specifies a function that defines the sort order. If omitted, the array is sorted according to each character's [Unicode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Values,_variables,_and_literals#Unicode) code point value, according to the string conversion of each element.

```javascript
// Math.random() ==> [0,1) 包括0，不包括1 ；
const arr = [2,3,6,1,'d',5,7];
function shuffle1(arr) {
    return arr.sort(() => {
        return Math.random() - 0.5;
    }) 
}
console.log(shuffle1(arr))
function shffle2(arr) {
    let length = arr.length;
    let randomIndex = 0;
    while(length > 1 ) {
        length = length - 1;
        randomIndex = Math.floor(Math.random() * length);
        [arr[randomIndex],arr[length]] = [arr[length],arr[randomIndex]];
    }
    return arr;
}
console.log(shffle2(arr));
```

### 2 将一个数组转化为二维数组

```javascript
const arrR = [1,3,6,'u',8,5,1,9,0]
/**
@params: arr 表示要转换的数组
len 表示要转化的数组中每个维度有几个元素
*/
function reverseTwo(arr,len) { 
    return arr.reduce((result,current,index) => {
        if(index % len === 0 ) { // 第一个元素，元素下表为0，直接将其放入 [current] 中然后放入result中
            result.push([current]);
        } else {
            result[result.length - 1].push(current);
        }
        return  result;
    },[])
}
console.log(reverseTwo(arrR,2))
```

### 3 将一个多维数组拍平 

```javascript
const arrF = [[1,2,3],[4,5,6],[7,8,[9,10]]]
function flatten(arrF) {
    return arrF.reduce((result,current,index) => {
        return result.concat(Array.isArray(current) ? flatten(current) : current)
    },[])
}
console.log(flatten(arrF))
function flatten(arr){
    console.log(arr)
    while(arr.some(item => Array.isArray(item))){
        //这里的核心是 concat 方法 [].concat(1,2,3,[4,5,[6,7]]) => [1,2,3,4,5,[6,7]]
        arr = [].concat(...arr);
    }
    return arr;
}
```

