## 基本使用

都是用来改变一个函数的this指向，用法略有不同。

call：后面的参数为调用函数的参数列表

```
function greet(name) {  console.log(this.animal,name);}
var obj = {  animal: 'cats'};
greet.call(obj,'猫咪');
```

apply：第二个参数为调用函数的参数数组

```
function greet(name) {  console.log(this.animal,name);}
var obj = {  animal: 'cats'};
greet.apply(obj,['猫咪']);
```

bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。


```javascript
const module = {
  x: 42,
  getX: function() {
    return this.x;
  }
};

const unboundGetX = module.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// expected output: undefined

const boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// expected output: 42
```

## 手动实现

1. context 为可选参数，如果不传的话默认上下文为 window；
2. context 创建一个 Symbol 属性，调用后即删除，不会影响context

```javascript
Function.prototype.myCall = function (context) {     
   if (typeof this !== 'function') {        
     return undefined; 
// 用于防止 Function.prototype.myCall() 直接调用    
  }     
   context = context || window;      
   const fn = Symbol();      
   context[fn] = this;      
   const args = [...arguments].slice(1);    
   const result = context[fn](...args);     
  delete context[fn];      
  return result;    
}
```

apply实现类似call，参数为数组

> func.apply(thisArg, [argsArray])

```javascript
Function.prototype.myApply = function (context) {    
  if (typeof this !== 'function') {        
    return undefined; 
  // 用于防止 Function.prototype.myCall() 直接调用    
  }      
  context = context || window;      
  const fn = Symbol();      
  context[fn] = this;      
  let result;      
  if (arguments[1] instanceof Array) {        
    result = context[fn](...arguments[1]);      
  } else {        
    result = context[fn]();     
  }      
  delete context[fn];      
  return result;    
}
```

1.判断是否为构造函数调用

2.注意参数要插入到目标函数的开始位置

```javascript
  // Does not work with `new (funcA.bind(thisArg, args))`
if (!Function.prototype.bind) (function(){
  var slice = Array.prototype.slice;
  Function.prototype.bind = function() {
    var thatFunc = this, thatArg = arguments[0];
    var args = slice.call(arguments, 1);
    if (typeof thatFunc !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - ' +
             'what is trying to be bound is not callable');
    }
    return function(){
      var funcArgs = args.concat(slice.call(arguments))
      return thatFunc.apply(thatArg, funcArgs);
    };
  };
})();  
```