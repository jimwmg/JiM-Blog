---
nttitle: javascript数据结构
date: 2017-01-03
categories: javascript
---

### 1 Javascript数据类型

最新的 ECMAScript 标准定义了 7 种数据类型: 

原始类型:除 Object 以外的所有类型都是不可变的（值本身无法被改变）。例如，与 C 语言不同，JavaScript 中字符串是不可变的（译注：如，JavaScript 中对字符串的操作一定返回了一个新字符串，原始字符串并没有被改变）。我们称这些类型的值为“原始值”。

- [Boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
- [Null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
- [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
- [Number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
- [String](https://developer.mozilla.org/en-US/docs/Glossary/String)
- [Symbol](https://developer.mozilla.org/en-US/docs/Glossary/Symbol) (ECMAScript 6 新定义)


- 和 [Object](https://developer.mozilla.org/en-US/docs/Glossary/Object):对象中有两种属性：数据属性和访问器属性。

#### 数据属性

数据属性是键值对，并且每个数据属性拥有下列特性:

**数据属性的特性(Attributes of a data property)**

| 特性               | 数据类型           | 描述                                       | 默认值       |
| ---------------- | -------------- | ---------------------------------------- | --------- |
| [[Value]]        | 任何Javascript类型 | 包含这个属性的数据值。                              | undefined |
| [[Writable]]     | Boolean        | 如果该值为 `false，`则该属性的 [[Value]] 特性 不能被改变。  | true      |
| [[Enumerable]]   | Boolean        | 如果该值为 `true，`则该属性可以用 [for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) 循环来枚举。 | true      |
| [[Configurable]] | Boolean        | 如果该值为 `false，`则该属性不能被删除，并且 除了 [[Value]] 和 [[Writable]] 以外的特性都不能被改变。 | true      |

#### 访问器属性

访问器属性有一个或两个访问器函数 (get 和 set) 来存取数值，并且有以下特性:

| 特性               | 类型               | 描述                                       | 默认值       |
| ---------------- | ---------------- | ---------------------------------------- | --------- |
| [[Get]]          | 函数对象或者 undefined | 该函数使用一个空的参数列表，能够在有权访问的情况下读取属性值。另见 `get。` | undefined |
| [[Set]]          | 函数对象或者 undefined | 该函数有一个参数，用来写入属性值，另见 `set。`               | undefined |
| [[Enumerable]]   | Boolean          | 如果该值为 `true，则该属性可以用` [for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) 循环来枚举。 | true      |
| [[Configurable]] | Boolean          | 如果该值为 `false，则该属性不能被删除，并且不能被转变成一个数据属性。`  | true      |

### 2 javascript数据结构

* 栈：是一种LIFO(last in first out)后进先出的数据结构

栈需要有如下的方法:

- push(element(s)): 添加几个元素到栈顶
- pop(): 移除并返回栈顶元素
- peek(): 返回栈顶元素,如果栈为空，返回undefined;
- isEmpty: 检查栈是否为空，为空则返回true
- clear: 移除栈中所有元素
- size: 返回栈中元素个数。
- print: 以字符串显示栈中所有内容

```javascript
function Stack(){
  var items = [];
  this.push = function(ele){
    items.push(ele);
  };
  this.pop = function(){
    items.pop();
  };
  this.peek = function(){
    //return items.length > 0 ? items[items.length-1] : undefined
    //加入栈为空，那么此时返回的items[-1]仍然是undefined,也符合预期；
    return items[items.length - 1 ]
  };
  this.isEmpty = function(){
    return items.length == 0 ;
  };
  this.clear = function(){
    items = [];
  };
  this.size = function(){
    return items.length;
  };
  this.print = function(){
    return items.toString();
  }
}
```

* 队列：是一种FIFO(first in first out)先进先出的数据结构

队列需要有如下的方法:

- enqueue(element(s)): 向队列尾部添加几个项
- dequeue(): 移除队列的第一项(也就是排在最前面的项),并返回该值
- front(): 返回队列的第一个元素，也就是最早添加的那个
- isEmpty: 检查栈是否为空，为空则返回true
- clear: 移除栈中所有元素
- size: 返回栈中元素个数。
- print: 以字符串显示栈中所有内容

```javascript
function Queue(){
  var items = [];
  this.enqueue = function(eles){
    items.push(eles)
  };
  this.dequeue = function(){
    items.shift();
  };
  this.front = function(){
    return items[0];
  };
  this.isEmpty = function(){
    return items.length == 0 ;
  };
  this.clear = function(){
    items = [];
  };
  this.size = function(){
	return items.length;
  };
  this.print = function(){
    return items.toString();
  }
}
```

* 单向链表：链表中最简单的形式就是单向链表，链表中的节点都包含两个部分，第一部分储存着自身信息，第二部分则储存有指向下一节点的指针。最后一个节点则指向`NULL`

单向链表需要有如下的方法:

- append(element): 添加元素到链表尾部
- insert(position,element): 向单向链表中某个位置插入元素，插入成功返回true,插入失败返回false;
- indexOf(element): 寻找某个元素在单向链表中的位置，找到第一次出现的位置；
- remove(element): 移除给定的元素
- removeAt(position): 移除单向链表中某个位置的元素，引出成功返回被移除的元素，移除失败返回null;
- getHead(): 获取单向链表的头部
- isAmpty(): 检查单向链表是否为空，为空则返回true
- toString(): 将链表所有内容以字符串输出
- size(): 返回单向链表长度

```javascript
function linkedList(){
  var Node = function(element){
    //链表节点都包含两个部分，第一部分存储着自身的信息ele,第二部分存储着指向下一个节点的指针；
    this.element = element;
    this.next = null;
  };
  var head = null ;//初始化链表的头部节点为null;
  var length = 0 ;//初始化链表的长度为 0;
  this.append = function(elemenet){ //对一个链表多次append操作
    var node = new Node(element);
    var current ;
    //单向链表的操作
    if(head == null){
      head = node;
    }else{
      current = head;
      while(current.next){
        current = next;
      }
      current.next = node;
    }
    //单向链表的操作
    length ++;
  };
  this.insert = function(position,element){
    //注意函数的入参的边界的判断
    if(position >= 0 && position <= length){
      var node = new Node(ele);
      var current = head;
      var previous ;
      var index = 0 ;
      //这种while循环的形式值得借鉴，很好的代替了for循环
      if(position == 0){
        node.next = current ;
        head = node ;
      }else{
        while(index++ < position){
          previous = current;
          current = current.next;
        }
        previous.next = node ;
        node.next = current;
      }

      //执行插入成功
      length ++;
      return true
    }else{
      return false
    }
  };
  this.indexOf = function(element){
    var current = head ;
    var index = 0 ;
    while(current){
      if(current.element == element){
        return index;
      };
      index++;
      current = current.next;
    }
    return -1
  };
  this.removeAt = function(position) {
    if (position > -1 && position < length) {
      var current = head;
      var previous;
      var index = 0;

      if (position == 0) {
        // 因为之前head指向第一个元素，现在把head修改为指向第二个元素。
        // 核心概念在于链表前后全靠指针链接，而非数组一般。
        // 所以只需要改变head的元素。
        head = current.next;
      } else {
        while (index++ < position) {
          // previous指要操作元素位置之前的那个元素，current表示之后的那个元素。
          previous = current;
          current = current.next;
        }

        previous.next = current.next;
      }

      length--;

      return current.element;
    } else {
      return null;
    }
  };
  this.remove = function(element) {
    var index = this.indexOf(element);
    return this.removeAt(index);
  };

}
```

链表数据结构的另外一种实现思路： 可以对比这两种实现在算法复杂度种的优劣

```javascript

```



* 集合：某些指定的对象集在一起就成为一个集合，简称集，其中每一个对象叫元素；(ES6提供了这种数据结构)

  特点：无序性，互异性 

集合需要有如下方法:

- has(value): 检测集合内是否有某个元素
- add(value): 给集合内添加某个元素
- delete(value): 移除集合中某个元素
- clear(value): 清空集合
- size(): 返回集合长度
- values(): 返回集合转换的数组
- union(otherSet): 返回两个集合的并集
- intersection(otherSet): 返回两个集合的交集
- difference(otherSet): 返回两个集合的差集
- subset(otherSet): 判断该集合是否为传入集合的子集

```javascript
function set(){
  var items = {};
  this.has = function(value){
    return items.hasOwnProperty(value);
  };
  this.add = function(value){
    if(!this.has(value)){
      items[value] = value ;
      retrun items ;
    }else{
      return items ;
    }
  };
  this.delete = function(value){
    if(this.has(value)){
      delete items[value]; //delete操作符如果删除数组元素，会留下一个空位，如果删除一个对象元素，则不会
      return true ;
    }
    return false;
  };
  this.clear = function(){
    items = {};
  };
  this.size = function(){
    return Object.keys(items).length;//Object.keys(o)接受的参数可以是空对象，空数组，空字符串，此时返回的是一个空数组
  };
  this.values = function(){
    return Object.keys(items);
  }
  
}
```



