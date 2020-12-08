---
title: Math 相关算法
---

尾递归： 递归函数最后调用自己，尾递归的实现就是所有用到的变量全部改写成函数的参数；

ES6 的尾调用优化只在严格模式下开启，正常模式是无效的。这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈。

### 1 阶乘

```javascript
function main(f,...args) {
    const start = new Date().valueOf();
    console.log(f(...args));
    const end = new Date().valueOf();
    console.log(end - start)
}
function factorial(num){
    let result = 1 ;
    for(let i = 1 ; i <= num ; i++ ) {
        result = result * i;
    }
    return result;
}  
main(factorial,100)
function factorial1(n) {
    if(n === 1) {
        return 1
    }else{
        return n * factorial(n-1)
    }
}
main(factorial1,100)
function factorial2(n,result = 1) {
    if(n === 1) {
        return result;
    }else{
        return factorial2(n-1,n*result)
    }
}
main(factorial2,100,1)

```

### 2 斐波那契数列 1 1 2 3 5 8 13 ....

```javascript
//递归实现
// terrible ~ very terrible O(2^N)
function fibonacci0 (n) {
    if ( n <= 1 ) {return 1};

    return fibonacci0(n - 1) + fibonacci0(n - 2);
}

function fibonacci1(pos,previous = 0,current = 1) {
    if(typeof pos !== 'number' || pos <= 0 ) {
        throw new Error();
    }
    if(pos === 1) {
        return current;
    }
    return fibonacci1(pos - 1, current,previous+current);
}
console.log(fibonacci1(4))

//递推实现
//good  O(n)
function fibonacci(pos) {
    if(typeof pos !== 'number' || pos <= 0 ) {
        throw new Error();
    }
    if(pos === 1) {
        return 1;
    }
    let previous = 0 ;
    let current = 1;

    let counter = pos - 1 ;
    while(counter > 0 ) {
        current = current + previous;
        previous = current - previous;
        counter -= 1;
    }
    return current;
}  
console.log(fibonacci(1))

function fibonacc(n){
    let current = 0;
    let next = 1;
    for(let i = 0; i < n; i++){
        [current,next] = [next,current + next]
    }
    return current
}
console.log(fibonacc(4))
```

```javascript
let map = new Map();
let fibonacci = function(n){
    if(n === 1 || n === 2){
        return n;
    }
    if(map.get(n)){
        return map.get(n)
    }
    let result = fibonacci(n-1) + fibonacci(n -2);
    map.set(n,result);
    return result;
}
```

### 3 [最大公约数-百科](https://baike.baidu.com/item/%E6%9C%80%E5%A4%A7%E5%85%AC%E7%BA%A6%E6%95%B0/869308?fr=aladdin)

```javascript
//如果数a能被数b整除，a就叫做b的倍数，b就叫做a的约数。
//最大公因数，也称最大公约数、最大公因子，指两个或多个整数共有约数中最大的一个。
//欧几里得算法： 用于求最大公约数；也叫做辗转相除法
function euclideanAlgorithm(originalA, originalB) {
    const a = Math.abs(originalA);
    const b = Math.abs(originalB);

    if (a === 0 && b === 0) {
        return null;
    }

    if (a === 0 && b !== 0) {
        return b;
    }

    if (a !== 0 && b === 0) {
        return a;
    }
    if (a > b) {
        return euclideanAlgorithm(a % b, b);
    }

    return euclideanAlgorithm(b % a, a);
}  
console.log(euclideanAlgorithm(5,2))
function euclideanAlgorithm1(originalA,originalB) {
    let a = Math.abs(originalA);
    let b = Math.abs(originalB);
    let count = 0;
    return euclidean(a,b);
    function euclidean(a, b) {
        if( a === b ) {
            return a * Math.pow(2,count);
        }
        if(a % 2 === 0 && b % 2 === 0 ) {
            a = a / 2;
            b = b / 2;
            count += 1;
        }
        if (a > b) {
            return euclidean(a - b, b);
        }

        return euclidean(b - a, a);
    }
}
```

### 4 进制数之间的互相转化  十进制转化为二进制

```javascript
function divideBy(num) {
    const stack = [];
    while( num > 0 ) {
        rem = num % 2;
        stack.push(rem);
        num = Math.floor(num / 2);
    }
    return stack.reverse().join('');
}

function divideBy(num,by) {
	const stack = [];
    // 对应16进制的适用
    const digitsMap = '0123456789ABCDEF';
    const rem = null;
    while( num > 0) {
        rem = Math.floor( num % by ) ;
        stack.push(digitsMap[rem]);
        num = Math.floor(num / by);
    }
    return stack.reverse().join('');
}
```

