---

---

### 0 概述

IOS开发中，MVC（Model  View Controller)是构建IOS应用的标准模式；在MVC下，所有的对象被归类为一个Model，一个View，和一个Controller。Model持有数据，View显示与用户交互的界面，而ViewController调解Model和View之间的交互。现在，MVC 依然是目前主流客户端编程框架

### 1 base

[菜鸟教程](http://www.runoob.com/ios/ios-objective-c.html)

[oc](https://www.yiibai.com/objective_c)

1. Objective-C程序基本上由以下部分组成 -

- 预处理程序命令
- 接口
- 实现
- 方法
- 变量
- 声明和表达
- 注释

```objectivec
#import <Foundation/Foundation.h> //预处理程序命令
 
@interface SampleClass:NSObject //创建接口 SampleClass，继承了NSObject  NSObject是所有对象的基类
- (void)sampleMethod;           //声明一个方法
@end                            //标记接口的结束

@implementation SampleClass    //表示它实现了接口 SampleClass

- (void)sampleMethod {         //表示实现了 sampleMethod
   NSLog(@"Hello, World! \n");
}

@end							//表示实现接口的过程结束

int main() {					//main主程序入口
   /* my first program in Objective-C */
   SampleClass *sampleClass = [[SampleClass alloc]init];
   [sampleClass sampleMethod]; //类的方法执行
   return 0;
}
```

2.  Objective-C程序由各种令牌组成，令牌可以是关键字，标识符，常量，字符串文字或符号。 例如，以下Objective-C语句由六个令牌组成 -

3. 数据类型

| 编号 | 类型     | 描述                                                         |
| ---- | -------- | ------------------------------------------------------------ |
| 1    | 基本类型 | 它们是算术类型，由两种类型组成：(a)整数类型和(b)浮点类型。   |
| 2    | 枚举类型 | 它们又是算术类型，用于定义只能在整个程序中分配某些离散整数值的变量。 |
| 3    | void类型 | 类型说明符`void`表示没有可用的值。                           |
| 4    | 派生类型 | 它们包括(a)指针类型，(b)数组类型，(c)结构类型，(d)联合类型和(e)函数类型。 |

4. [object-c 类](https://www.cnblogs.com/mjios/archive/2013/04/06/3002814.html)

- 类定义在两个不同的部分，即`@interface`和`@implementation`。
- 几乎所有东西都是对象的形式。
- 对象接收消息，对象通常称为接收者。
- 对象包含实例变量。
- 对象和实例变量具有范围。
- 类隐藏对象的实现。
- 属性用于提供用于其他类对此类实例变量的访问。

#### 类

1> .h：类的声明文件，用于声明成员变量、方法。类的声明使用关键字@interface和@end。

注意：.h中的方法只是做一个声明，并不对方法进行实现。也就是说，只是说明一下方法名、方法的返回值类型、方法接收的参数类型而已，并不会编写方法内部的代码。

2> .m：类的实现文件，用于实现.h中声明的方法。类的实现使用关键字@implementation和@end。

#### 方法

\> 方法的声明和实现，都必须以 + 或者 - 开头

- \+ 表示类方法(静态方法) : 比如NSObject的 +alloc 方法
- \- 表示对象方法(动态方法) : 比如NSObject的 -init方法

在oc中一个 ： 代表对应一个参数；

2> 在.h中声明的所有方法作用域都是public类型，不能更改

#### 成员变量

成员变量的常用作用域有3种：

1> @public 全局都可以访问
2> @protected 只能在类内部和子类中访问
3> @private 只能在类内部访问

```objectivec
#import <Foundation/Foundation.h>
// @interface用来声明一个类， : 表示继承  
@interface Box:NSObject {  //默认作用于是 @protected,即可以在 Box类每部和子类中访问；成员变量必须在大括号中
   double length;    // Length of a box
   double breadth;   // Breadth of a box
   double height;    // Height of a box
}

@property(nonatomic, readwrite) double height;  // Property，属性通过关键字 @property声明
-(double) volume; //方法
- (void)setAge:(int)newAge andHeight:(float)newHeight;
//表示类的声明结束了
@end

@implementation Box

@synthesize height; 

-(id)init {
   self = [super init];
   length = 1.0;
   breadth = 1.0;
   return self;
}

-(double) volume {
   return length*breadth*height;
}

- (void)setAge:(int)newAge andHeight:(float)newHeight {
    age = newAge;
    height = newHeight;
}

@end

int main() {
   NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];    
    //声明Box类的对象
   Box *box1 = [[Box alloc]init];    // Create box1 object of type Box
   Box *box2 = [[Box alloc]init];    // Create box2 object of type Box

   double volume = 0.0;             // Store the volume of a box here

   // box 1 分配值
   box1.height = 15.0;  //类的属性获取 通过 . 操作符

   // box 2 分配值
   box2.height = 20.0;

   // volume of box 1
   volume = [box1 volume];//类的方法 volume 的执行
   NSLog(@"Volume of Box1 : %f", volume);

   // volume of box 2
   volume = [box2 volume];
   NSLog(@"Volume of Box2 : %f", volume);

   [pool drain];
   return 0;
}
```

5. 属性

Object-c引用了属性

- 属性以`@property`开头，它是一个关键字
- 接下来是访问说明符，它们是非原子，读写或只读，强，不安全或不完整。 这取决于变量的类型。 对于任何指针类型，可以使用`strong`，`unsafe_unretained`或`weak`。 类似地，对于其他类型，可以使用`readwrite`或`readonly`。
- 接下来是变量的数据类型。
- 最后，将属性名称以分号结束。
- 在实现类中添加`synthesize`语句。 但是在最新的`XCode`中，合成部分由`XCode`处理，不需要包含`synthesize`语句。

括号括起来的部分就是属性修饰符。

总共有3类属性修饰符：**多线程类型**、**读写类型**、**内存管理类型**。

**(1) 多线程修饰符**

- `nonatomic` 非原子的
- `atomic`原子的。适用于多线程，默认类型

**(2) 读写修饰符**

- `readwrite` 可读写。默认类型
- `readonly` 只读

`readwrite`意味着系统实现了`setter`和`getter`方法。`readonly`意味着只实现`getter`方法。

**(3)内存管理修饰符**

- `strong` 强引用
- `weak` 弱引用。避免循环强引用出现内存泄露问题
- `copy` 拷贝
- `unsafe_unretained`

6. 在OC中，引用文件可以通过`#include、#import、@class`三种方式，本文将讲解这三种方式的不同之处以及选择方式。

#include

1.在C语言中，我们使用`#include`来引入头文件。使用`#include “xx.h”`来引入自定义的头文件，使用`#include<xx.h>`来引入库中的头文件。

2.但是`#include`并不能防止重复引用头文件，如果在文件中，重复引用头文件，将会报错。（如：A引入了B，B引入了C，A再引入C，就会报错） 所以在OC中，几乎没有使用`#incldue`引头的情况。

 #import

1.`#import`是`#include`的升级版，可以防止重复引入头文件这种现象的发生。

2.`#import`在引入头的时候，就是完全将头文件拷贝到现在的文件中。所以也有效率上的问题。

3.`#import`最大的问题在于，需要避免出现头文件递归引入的现象。（如：A引入B，B引入A，那么A、B的头文件会互相不停的拷贝）

 @class

1.`@class`用来告诉编译器，有这样一个类，使书写代码时，不报错。

2.因为`#import`引入头文件有效率问题，所以，当还没有调用类中方法，仅仅是定义类变量的时候，使用`@class`来提醒编译器。而在真正需要调用类方法的时候，进行`#import`。 （如：

现在需要在Student.h文件中定义一个Book类的变量book

那么不需要在Student.h中`#import “Book.h”`

而是在Student.h中`@class Book` 来是编译器不报错，告诉编译器我现在使用的Book是一个类，可以定义变量book

在之后的Student.m文件中，需要调用book方法时，在`#import “Book.h”`

从而降低`#import`在效率上的问题。）

3.如果A是B的父类，那么这是在B.h中就必须要使用#import来引入A的头，因为需要知道A类中有哪些变量和方法，以免B类中重复定义。

7. Objcet-c扩展

类扩展与类别有一些相似之处，但它只能添加到编译时具有源代码的类中(类与类扩展同时编译)。

类扩展声明的方法是在原始类的实现块中实现的，因此不能在框架类上声明类扩展，例如`Cocoa`或`Cocoa Touch`类，如`NSString`。

扩展名实际上是没有类别名称的类别，它通常被称为匿名类别。

声明扩展的语法使用`@interface`关键字，就像标准的Objective-C类描述一样，但不表示子类的任何继承。 它只是添加括号，如下所示 -

```objectivec
@interface ClassName ()

@end


Objective-C
```

#### 扩展的特征

- 不能为任何类声明扩展，仅适用于原始实现源代码的类。
- 扩展是添加仅特定于类的私有方法和私有变量。
- 扩展内部声明的任何方法或变量即使对于继承的类也是不可访问的

### 2 数据

| 编号 | 功能                                                         | 描述                                                         |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1    | [数据存储](https://www.yiibai.com/objective_c/objective_c_data_storage.html) | `NSArray`，`NSDictionary`和`NSSet`为Objective-C任何类的对象提供存储。 |
| 2    | [文本和字符串](https://www.yiibai.com/objective_c/objective_c_texts_and_strings.html) | `NSCharacterSet`表示`NSString`和`NSScanner`类使用的各种字符分组。`NSString`类表示文本字符串，并提供搜索，组合和比较字符串的方法。 `NSScanner`对象用于扫描`NSString`对象中的数字和单词。 |
| 3    | [日期和时间](https://www.yiibai.com/objective_c/objective_c_dates_and_times.html) | `NSDate`，`NSTimeZone`和`NSCalendar`类存储时间和日期并表示日历信息。它们提供了计算日期和时间差异的方法。它们与`NSLocale`一起提供了以多种格式显示日期和时间以及根据世界中的位置调整时间和日期的方法。 |
| 4    | [异常处理](https://www.yiibai.com/objective_c/objective_c_exception_handling.html) | 异常处理用于处理意外情况，它在Objective-C中提供`NSException`类对象。 |
| 5    | [文件处理](https://www.yiibai.com/objective_c/objective_c_file_handling.html) | 文件处理是在`NSFileManager`类的帮助下完成的。                |
| 6    | [URL加载系统](https://www.yiibai.com/objective_c/objective_c_url_loading_system.html) | 一组提供对常见Internet协议访问的类和协议。                   |

[object-c对象的创建](http://mouxuejie.com/blog/2016-05-28/ios-learn-4/)

1. 对象

创建

```object-c
Party *partyInstance = [Party alloc];
[partyInstance init];
```

等价于

```c
[[Party alloc] init];
```

销毁

```c
partyInstance = nil;
```

2. 字符串:字符胡灿内容以 @ 开头；字符串类型以 %@标识

NSString：不可变字符串

NSMutableString:可变字符串，继承自NSString

```c
NSString *myString = @"hello world" 
```

3. 数组的创建

NSArray:不可变数组

NSMutableArray:可变数组，继承自NSArray

```
NSArray *items = [NSArray alloc] initWithObjects:@"string1",@"string2"];
NSString *str1 = [items objectAtIndex:0];
```

数组的遍历

```c
for (int i = 0; i < [items count]; i++) {
    NSString *item = [items objectAtIndex:i];
    NSLog(@"%@", item);
}

for(NSString *item in items) {
    NSLog(@"%@", item);
}

```

关于添加空值：

NSArray或NSMutableArray不允许添加nil，但可以使用NSNull。

 ```
[items addObject:[NSNull null]]
 ```

`NSArray`用于保存不可变对象数组，`NSMutableArray`用于保存可变对象数组。
`Mutablility`有助于在运行时更改预分配数组中的数组，但如果使用`NSArray`，只替换现有数组，并且不能更改现有数组的内容。

`NSArray`的重要方法如下 -

- `alloc/initWithObjects` − 用于使用对象初始化数组。
- `objectAtIndex` − 返回指定索引处的对象。
- `count` − 返回对象数量。

`NSMutableArray`继承自`NSArray`，因此`NSArray`的所有实例方法都可在`NSMutableArray`中使用

`NSMutableArray`的重要方法如下 -继承自NSArray,所以也会有` alloc initWithObjects  objectAtIndex  count`

- `removeAllObjects` − 清空数组。
- `addObject` − 在数组的末尾插入给定对象。
- `removeObjectAtIndex` − 这用于删除`objectAt`指定的索引处的对象。
- `exchangeObjectAtIndex:withObjectAtIndex` − 在给定索引处交换数组中的对象。
- `replaceObjectAtIndex:withObject` − 用Object替换索引处的对象。

#### 关于`autoreleasepool`和`ARC`

`ARC`即`Automatic Reference Counting`，自动引用计数。是相对于`MRC`(Manual Reference Counting，手动引用计数)而言的。

若使用`autoreleasepool`关键字括起来，当括号里方法执行完时，实例对象会自动释放。

```c
@autoreleasepool {
    BNRItem *item = [BNRItem someItem];
}

```

