---

---

### 1 dart中的异常

dart 中提供了 Exception 和 Error 类型，以及一些子类型；

| Exception 类型                               |
| -------------------------------------------- |
| 延迟加载异常: DeferredLoadException          |
| 格式异常 : FormatException                   |
| 整数除零异常: IntegerDivisionByZeroException |
| IO 异常 : IOException                        |
| 隔离产生异常: IsolateSpawnException          |
| 超时异常 : TimeoutException                  |

| Error 类型                                         |
| -------------------------------------------------- |
| 抽象类实例化错误 : AbstractClassInstantiationError |
| 参数错误 : ArgumentError                           |
| 断言错误 : AssertionError                          |
| 异步错误 : AsyncError                              |
| Cast 错误 : CastError                              |
| 并发修改错误 : ConcurrentModificationError         |
| 周期初始错误 : CyclicInitializationError           |
| Fall Through 错误 : FallThroughError               |
| json 不支持错误 : JsonUnsupportedObjectError       |
| 没有这个方法错误 : NoSuchMethodError               |
| Null 错误 : NullThrownError                        |
| 内存溢出错误 : OutOfMemoryError                    |
| 远程错误 : RemoteError                             |
| 堆栈溢出错误 : StackOverflowError                  |
| 状态错误 : StateError                              |
| 未实现的错误 : UnimplementedError                  |
| 不支持错误 : UnsupportedError                      |

等

### 2 异常的语法

Dart 中使用 try-catch 处理异常

- 使用关键字 throw 抛出异常
- 使用 on 捕获 某种具体类型异常
- 使用catch 处理任意类型的异常
- finally 语句块会在无论是否发生异常的情况下都执行

##### 2.1 抛出异常

```dart
main(List<String> args) {
  divide(10, 0);
}
 
divide(int a, int b) {
  if (b == 0) {
    throw new IntegerDivisionByZeroException();
  }
  return a / b;
}

```

也可以在抛出异常中添加说明信息

```dart
main(List<String> args) {
  divide(10, 0);
}
 
divide(int a, int b) {
  if (b == 0) {
    throw new Exception('divided by zero');
  }
  return a / b;
}
```

##### 2.2 使用 on 捕获某种类型的异常  使用catch 捕获异常

```dart
main(List<String> args) {
  try{
    divide(10, 0);
  } on IntegerDivisionByZeroException {
    print('exception');
  } catch(e){
    print(e is Exception);
  }
}
 
divide(int a, int b) {
  if (b == 0) {
    throw new Exception('divided by zero');
  }
  return a / b;
}
//true
```

```dart
main(List<String> args) {
  try{
    divide(10, 0);
  } on Exception {
    print('exception');
  } catch(e){
    print(e is Exception);
  }
}
 
divide(int a, int b) {
  if (b == 0) {
    throw new Exception('divided by zero');
  }
  return a / b;
}
//exception
```

##### 2.3 finally 语句块，无论是否发生异常都会执行

```dart
main(List<String> args) {
  try{
    divide(10, 0);
  } on Exception {
    print('exception');
  } catch(e){
    print(e is Exception);
  } finally{
    print('finally');
  }
}
 
divide(int a, int b) {
  if (b == 0) {
    //throw new Exception('divided by zero'); 无论是否有异常抛出，finally 语句块都会执行
  }
  return a / b;
}
```

### 3 泛型

平时我们写代码，如果不注意数据的类型，那么可能经常会出现一些问题；

泛型的出现很好的规范了我们的代码的 规范 和 以及减少重复的代码；

##### 3.1 变量定义中的泛型-- 保证类型安全

```dart
main(List<String> args) {
  
  var map = {
      'index.html': 111,
      'robots.txt': 'Hints for web robots',
      'humans.txt': 'We are people, not machines'
   };
  var map1 = Map();
  map1['key'] = 'value';
  map1[2] = 'value1';
  
  var list = [1,'dss'];
  var list1 = List();
  list1.add(2);
  list1.add('str');
  
  //这里通过泛型 规定了定义的 list  map 的值的类型，规范了代码
  var map2 = Map<int, String>();
  var list2 = List<String>();
  print(list2 is List<String>);
  map2[2] = 'str';
//   map2[2] = 2;
  
//   list2.add(3);
}
```

##### 3.2 函数声明中的泛型 

```dart
main() {
    K addCache1<K, V>(K key, V value) {
        K temp = key;
        print('${key} : ${value}');  // dart : flutter
       	return temp;
    }
    
    var key1 = addCache1('dart-key1', 'flutter');
    print(key1); 
    X addCache2<X, Y>(X key, Y value) {
        X temp = key;
        print('${key} : ${value}');  // dart : flutter
       	return temp;
    }
    
    var key2 = addCache2('dart-key2', 'flutter');
    var key3 = addCache2('dart-key3', 2);
    print(key2);  // dart
    print(key3);
  //函数参数可以不定义类型
  	addCache3(key, value) {
        var temp = key;
        print('${key} : ${value}');  // dart : flutter
       	return temp;
    }
    print(addCache3('str',2));
    print(addCache3('str',2));
}
//类中泛型的使用
class PrintClass<T>{
      List list=new List<T>();
      void add(T value){
          this.list.add(value);
      }
      void printInfo(){          
          for(var i=0;i<this.list.length;i++){
            print(this.list[i]);
          }
      }
 }
main() { 
  PrintClass p=new PrintClass<int>();
  p.add(12);
  p.add(23);
  p.printInfo(); 
}
```

##### 3.3 提高代码复用性

```dart
//比如要声明一个内存缓存的接口
abstract class ObjectCache {
  Object getByKey(String key);
  void setByKey(String key, Object value);
}
//但这时候你发现你需要一个 String类型的接口，而不是 Object类型的，所以你要再创建一个：
abstract class StringCache {
  String getByKey(String key);
  void setByKey(String key, String value);
}
//如果你需要再声明一个数字类型的呢？再来一遍吗？很明显泛型就是为这种场景设计的：
abstract class Cache<T> {
  T getByKey(String key);
  void setByKey(String key, T value);
}
```

### 4 库

#### 使用核心库

```dart
import 'dart:math';
import 'dart:io';
import 'dart:convert';

void main() {
    print(sqrt(4));  // math > 开平方2.0
}
```

### 5 元数据

(注解) - @deprecated 被弃用的。　　

- **含义**：若某类或某方法加上该注解之后，表示此方法或类不再建议使用，调用时也会出现删除线，但并不代表不能用，只是说，不推荐使用，因为还有更好的方法可以调用。
- **作用**：因为在一个项目中，工程比较大，代码比较多，而在后续开发过程中，可能之前的某个方法实现的并不是很合理，这个时候就要新加一个方法，而之前的方法又不能随便删除，因为可能在别的地方有调用它，所以加上这个注解，就方便以后开发人员的方法调用了。

```dart
class Television {
  @deprecated
  void activate(){
    turnOn();
  }

  void turnOn(){
    print('Television Turn On!');
  }

}

main(){
   dynamic tv = new Television();
   tv.activate();
   tv.turnOn();
}


```

 \- @override重写。

- - 帮助自己检查是否正确的复写了父类中已有的方法
  - 告诉读代码的人，这是一个复写的方法

```dart
//动物类
class Animal {
    //动物会吃
    void eat(){
      print('动物会吃');
    }
    //动物会跑
    void run(){
      print('动物会跑');
    }
}
//人类
class Human extends Animal {
  void say (){
     print('人会说话');
  }

  void study(){
    print('人类也会吃');
  }

  @override 
  void eat(){
     print('人类也会吃');
  }
}

main (){
  print('实例化一个动物类');
  var animal = new Animal();
  animal.eat();
  animal.run();

  print('实例话一个人类');
  var human = new Human();
  human.eat(); //这个就是重写了 Animal 的 eat 方法
  human.run();
  human.say();
  human.study();
}

```

### 6 注释

单行注释以 `//` 开始。 `//` 后面的一行内容 为 Dart 代码注释。

多行注释以 `/*` 开始， `*/` 结尾。 多行注释 可以 嵌套。

文档注释可以使用 `///` 开始， 也可以使用 `/**` 开始 并以 */ 结束。

```dart
/// A domesticated South American camelid (Lama glama).
///
/// Andean cultures have used llamas as meat and pack
/// animals since pre-Hispanic times.

main() {
  // TODO: refactor into an AbstractLlamaGreetingFactory?
  print('Welcome to my Llama farm!');
  /*
   * This is a lot of work. Consider raising chickens.

  Llama larry = new Llama();
  larry.feed();
  larry.exercise();
  larry.clean();
   */
}

```







[flutter-FE](https://book.flutterchina.club/)

[dartpad](https://dartpad.cn/)

[flutter中文网](https://flutterchina.club/setup-macos/)

[dart 文档](http://dart.goodev.org/guides/language/language-tour)

