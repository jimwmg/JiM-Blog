---

---

### 1 dart 

#### dart 中的基本数据类型

首先明确 dart 中的数据类型

| 数据类型 | 描述                   |      |
| -------- | ---------------------- | ---- |
| num      | 数字类型（int double） |      |
| String   | 字符串类型             |      |
| bool     | 布尔类型               |      |
| list     | 列表类型               |      |
| Set      | 集合类型               |      |
| Map      | map类型                |      |
| Runes    | UTF-32                 |      |
| Symbols  | 标识                   |      |

num、int和double都是Dart中的类，也就是说它是对象级别的，所以他们的默认值为null。

##### 可以重新赋值的

变量类型固定，可以再次赋值同类型的值，而不可以赋值其他类型的值；

```javascript
var 定义的变量会自动通过值推断出来，定义的类型只能再次赋值同类型的值，不能赋值其他类型
String  
num  int double  
List 
Set 
Map
```

变量类型不固定，那么对于该变量，可以赋值其他任何类型的值

```
Object
dynamic

```

### 2 变量定义

##### 数字类型

```dart
main(){
  num age = 18;//num数据类型
  int height =180;//int整型
  double weight=62.5;//double 浮点型

  print(height/weight is double);//true
  print(height*age is double);//false
  print(age/height is double);//true
}
```

#####  字符串 类型

字符串是一种语言不可或缺的部分，Dart也不例外。它支持单引号、双引号、以及三引号。需要注意的是单引号中的单引号需要转义，三引号中的字符内容会原样输出。

```dart
main() {
  var str1 = 'this is 单引号';
  var str2 = "这是双引号";
  var str3 = """ 这是三引号   --""";
  print(str1);
  print('${str2}');
  print("${str3}");
}
```

#####  布尔类型

```dart
bool isMan = true;
bool isMarried = false;
```

#####  [List](https://api.dartlang.org/stable/2.6.0/dart-core/List-class.html)

```javascript
var list1 = [1,'fff']; //使用字面量声明的 List
var list2 = List(); //使用List 构造函数声明的 List
list2.add(1);
list2.add('ste');
var list3 = List<String>(); //List 是参数化类型，因此可以指定 List 应该包含的元素类型
list3.add(1); //报错
```

```dart
main() {
    List<String> colorList = ['red', 'yellow', 'blue', 'green'];//直接使用[]形式初始化
    var colorList2 = <String> ['red', 'yellow', 'blue', 'green'];//字面量形式的 泛型
}
```

#####  [Set](https://api.dartlang.org/stable/2.6.0/dart-core/Set-class.html)

```javascript
var set1 = {1,'str'};

var set2 = Set();
set2.add(1);
set2.add('str');

var set3 = Set<String>();
//set3.add(1); //报错

```

```dart
main() {
    Set<String> colorSet= {'red', 'yellow', 'blue', 'green'};//直接使用{}形式初始化
    var colorList = <String> {'red', 'yellow', 'blue', 'green'};
}
```

#####  [Map](https://api.dartlang.org/stable/2.6.0/dart-core/Map-class.html)

```javascript
var map1 = {
  1:[1,2,3],
  'name':'jim',
  'age':14
};

var map2 = Map();

map2['name'] = 'jhon';
map2[1] = [1,2,3];

```
```dart
main() {
    Map<String, int> colorMap = {'white': 0xffffffff, 'black':0xff000000};
    var pages = <String, String>{
      'index.html': 'Homepage',
      'robots.txt': 'Hints for web robots',
      'humans.txt': 'We are people, not machines'
    };

    print(colorMap.containsKey('green'));//false
    print(colorMap.containsValue(0xff000000));//true
    print(colorMap.keys.toList());//['white','black']
    print(colorMap.values.toList());//[0xffffffff, 0xff000000]
    colorMap['white'] = 0xfffff000;//修改指定key的元素
    colorMap.remove('black');//移除指定key的元素
}
```



#####  动态类型

```javascript
 dynamic t;
 Object x;
 t = "hi world";
 x = 'Hello Object';
 //下面代码没有问题
 t = 1000;
 x = 1000;
```

dynamic：定义没有指定类型的变量
Object：所有对象的根基类
共同点
声明的变量可以在后期改变赋值类型
不同点（针对声明的对象）
dynamic：编译器会提供所有可能的组合
Object：只能使用Object的属性与方法, 否则会报错

```javascript
 dynamic a;
 Object b;
 main() {
     a = "";
     b = "";
     printLengths();
 }   

 printLengths() {
     // no warning
     print(a.length);
     // warning:
     // The getter 'length' is not defined for the class 'Object'
     print(b.length);
 }

```

#####  常量

```
const 
final
```

const  final 声明的变量，必须在声明的时候同时赋值，声明并且赋值之后，不能再改变它的值；

注意点

一个 final 变量只能赋值一次:它的值可以在运行时获取
 一个 const 变量是编译时常量:码还没有运行时我们就知道它声明变量的值
 如下，同样是当前时间，final修饰的f对象是正确的，但const修饰的c是错误的，原因是final可以在运行时对变量初始化，但const不行。

```dart
//可以省略String这个类型声明
final str = "hi world";
//final String str = "hi world"; 
const str1 = "hi world";
//const String str1 = "hi world";
final f = DateTime.now(); // OK
const c = DateTime.now(); // ERROR Const variables must be initialized with a constant value.
```

####  函数:Dart是一种真正的面向对象的语言，所以即使是函数也是对象，并且有一个类型**Function**。这意味着函数可以赋值给变量或作为参数传递给其他函数，这是函数式编程的典型特征。

#####  函数的定义

```javascript
bool isNoble(int atomicNumber) {
  return _nobleGases[atomicNumber] != null;
}
```

也可以忽略类型定义

```javascript
isNoble(atomicNumber) {
  return _nobleGases[atomicNumber] != null;
}
```

对于函数体的内容只有一个表达式的情况，可以类比箭头函数

```javascript
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

#####  函数类型

在 Dart 中，方法是对象，就像字符串和数字也是对象。typedef ,又被称作函数类型别名，让你可以为函数类型命名，并且该命名可以在声明字段和返回类型的时候使用。当一种函数类型被分配给一个变量的时候，typedef 会记录原本的类型信息。

```dart
typedef int Compare(int a, int b);
int sort(int a, int b,[String str]) => a - b;
main() {
  String str = 'this is string';
  print(str is String);
  print(sort is Compare); // True!
}
```

#####  函数传参

1 正常传参

```dart
void main(){
  getPerson('Lucy',12,'woman');
}
//下面这个表示 {} 为可选参数，
getPerson(String name, num age,String gender){
  print ("name = $name, age = $age, gender = $gender");
}
```

2 可选命名参数

```javascript
void main(){
  getPerson('Lucy') ;

  getPerson('Lucy', age: 12 );
  
  getPerson('Lucy', gender: "小萝莉" );

  getPerson('Lucy', age: 12, gender: "小萝莉");
}
//下面这个表示 {} 为可选参数，
getPerson(String name, {int age, String gender}){
  print ("name = $name, age = $age, gender = $gender");
}
```

3 可选位置参数

```javascript
void main(){
  getPerson('Lucy') ;

  getPerson('Lucy',12 );
  
//   getPerson('Lucy','lucy' );

  getPerson('Lucy',12,'lucy');
}
//下面这个表示 {} 为可选参数，
getPerson(String name, [num age,String gender]){
  if(age != null){
    print ("传入了age:name = $name, age = $age, gender = $gender");
  }else if(gender != null){
    print ("传入了age和gender:name = $name, age = $age, gender = $gender");
  }else{
    print ("name = $name, age = $age, gender = $gender");
  }
}
```

默认参数:对于可选命名参数和可选位置参数，可以给这些可选的参数赋值一个默认值

- 可选命名参数提供默认值的形式

```dart
void main(){
  getPerson('Lucy',age:14);
}
//下面这个表示 {} 为可选参数，
getPerson(String name, {int age = 20, String gender = "大叔"}){
  print ("name = $name, age = $age, gender = $gender");
}
```

- 可选位置参数提供默认值的方式

```javascript
void main(){
  getPerson('Lucy',14);
}
//下面这个表示 {} 为可选参数，
getPerson(String name, [int age = 20, String gender = "大叔"]){
  print ("name = $name, age = $age, gender = $gender");
}
```

**注意第一个参数是必传的参数**；

可以使用位置可选参数或命名可选参数，但不能同时使用相同的功能或方法。以下是不允许的

```dart
void main(){
  getPerson('Lucy',12,gender:'woman');
}
//下面这个表示 {} 为可选参数，
getPerson(String name,[ num age],{String gender} ){
  print ("name = $name, age = $age, gender = $gender");
}

```

##### 匿名函数

```dart
main() {
  num add(num a){
    return a * a;
  }
  num deal(num a,num b,add){
    return add(a) + add(b);
  }
  print(deal(2,3,add));
}
```

###  作用域

##### 静态作用域：dart 是静态作用于语言，变量的作用域在写代码的时候就确定了

函数的返回值默认是 null;  

```dart
var topLevel = 'toplevel variable';
main() {
  var mainVar = 'mainVariable';
  myFunc (){
    var insideFunc = 'insideFuncVariable';
    print(insideFunc);
    print(mainVar);
    print(topLevel);
  };
  var ret = myFunc();
  print('ret=${ret}');//ret=null  当定义函数的时候，如果没有显示的声明返回值，那么默认 return null;
}
```

##### 词法闭包: 

```dart
main() {
  Function getAdd(num innerArg){
    var innerGetAdd = 'this is innerAdd';
    add() {
      print('innerGetAdd${innerGetAdd}');
      print('innerArg${innerArg}');
    };
    return add;
  }
  var add = getAdd(2);
  add();
}
```

### 4 类

类本身也是一个对象，和类相关属性总体可以分为两类，一种是静态属性，一种是实例属性

#### 4.1  静态属性通过 static 关键字生成，它可以理解为就是类这个对象上的属性；(和实例没没有任何关系)

```dart
class Point {
  static String ns1 = 'ns-1';
  static void staticGetValue(){
    print(Point.ns1);
  }
  Point(this.n1,this.n2);
}

void main() { 
  print(Point.ns1);
  Point.staticGetValue();
}
//ns-1
//ns-1
```

#### 4.2 实例属性:通过 const final var 定义，同时也可以声明默认值; 函数内可以直接访问实例的实例属性，并且可以省略this;

```dart

class Point {
  num n1;
  num n2;
  num n3 = 5;
  var n4;
  String n5;
  void getValue(){
    //函数体内可以直接访问 实例的属性值，而不需要使用 this;
    print('直接访问 ${n1}');
    print('通过this访问 ${this.n1}');
  }
  Point(this.n1,this.n2);
}

void main() {
  var p1 = Point(1,2);
  print(p1.n1);
  print(p1.n2);
  print(p1.n3);
  p1.n4 = 'str';
  p1.n5 = 'str';//只能赋值字符串
  p1.getValue();
}
```

Getters 和 setters 是用来设置和访问对象属性的特殊 函数。每个实例变量都隐含的具有一个 getter， 如果变量不是 final 的则还有一个 setter。 你可以通过实行 getter 和 setter 来创建新的属性， 使用 `get` 和 `set` 关键字定义 getter 和 setter：

```dart
class Rectangle {
  num left;
  num top;
  num width;
  num height;

  Rectangle(this.left, this.top, this.width, this.height);

  // Define two calculated properties: right and bottom.
  num get right             => left + width;
      set right(num value)  => left = value - width;
  num get bottom            => top + height;
      set bottom(num value) => top = value - height;
}

main() {
  var rect = new Rectangle(3, 4, 20, 15);
  assert(rect.left == 3);
  rect.right = 12;
  assert(rect.left == -8);
}
```

### 4.3 构造函数

使用new语句来构造一个类，构造函数的名字可能是 `ClassName`，也可以是 `ClassName.otherName`

定义一个和 类 名字一样的方法就定义了一个构造函数；

```dart
class Example {
    int x;
    int y;
    Example(int x, int y) {
        this.x = x;
        this.y = y;
    }
}

// 但在 Dart 中是可以简化成这样的 (推荐)
class Example {
    int x;
    int y;
    Example(this.x, this.y);
}
```

#### Default constructors（默认构造函数）

如果你没有定义构造函数，则会有个默认构造函数。 默认构造函数没有参数，并且会调用超类的 没有参数的构造函数。

#### Constructors aren’t inherited（构造函数不会继承）

子类不会继承超类的构造函数。 子类如果没有定义构造函数，则只有一个默认构造函数 （没有名字没有参数）。

#### Named constructors（命名构造函数）

使用命名构造函数可以为一个类实现多个构造函数， 或者使用命名构造函数来更清晰的表明你的意图：

```dart
var example = Example.fromJson({'x': 2, 'y': 2});

class Example {
    int x;
    int y;
    
    Example(this.x, this.y);
    
    // 命名构造函数
    Example.fromJson(Map json) {
		x = json['x'];
        y = json['y'];
    }
}
```

重定向构造函数

```dart
var example = Example.alongXAxis(0);
print(example);

class Example {
    int x;
    int y;
    
    Example(this.x, this.y);
    
    // 重定向构造函数，使用冒号调用其他构造函数
    Example.alongXAxis(int x) : this(x, 0);
}
```





















[flutter-FE](https://book.flutterchina.club/)

[dartpad](https://dartpad.cn/)

[flutter中文网](https://flutterchina.club/setup-macos/)

[dart 文档](http://dart.goodev.org/guides/language/language-tour)

