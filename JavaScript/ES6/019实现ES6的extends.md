---
title: 实现ES6的extends
---

### 1 ES6 中extends的核心作用

```javascript
class Parent{
    constructor(){

    }
    parentMethod() {
        console.log('parentMethod')
    }
}
class Child extends Parent{
    constructor(){

    }
    childMethod() {
        console.log('childMethod');
    }
}
console.log(Child.prototype.__proto__ === Parent.prototype); // true
console.log(Child.__proto__ === Parent) // true
console.dir(Parent);
console.dir(Child); 
```

### 2 实现 extends

`Object.setPrototypeOf(obj,proto)`  ==>  `obj.__proto__ = proto`

```javascript
// Only works in Chrome and FireFox, does not work in IE:
Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.__proto__ = proto;
  return obj; 
}
```

```javascript
function myExtends(child,parent) {
	Object.setPrototypeOf(child,parent);
    Object.setPrototypeOf(child.prototype,parent.prototype)
}
```

```javascript
class Parent{
    constructor(){

    }
    parentMethod() {
      console.log('parentMethod')
    }
  }
  class Child {
    constructor(){

    }
    childMethod() {
      console.log('childMethod');
    }
  }
  myExtends(Child,Parent);
  console.log(Child.prototype.__proto__ === Parent.prototype); // ture
  console.log(Child.__proto__ === Parent) // true
  console.dir(Parent);
  console.dir(Child);
```

