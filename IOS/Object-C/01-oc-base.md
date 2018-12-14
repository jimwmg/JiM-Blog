---

---

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

4. object-c 类

- 类定义在两个不同的部分，即`@interface`和`@implementation`。
- 几乎所有东西都是对象的形式。
- 对象接收消息，对象通常称为接收者。
- 对象包含实例变量。
- 对象和实例变量具有范围。
- 类隐藏对象的实现。
- 属性用于提供用于其他类对此类实例变量的访问。

```objectivec
#import <Foundation/Foundation.h>

@interface Box:NSObject {
   double length;    // Length of a box
   double breadth;   // Breadth of a box
   double height;    // Height of a box
}

@property(nonatomic, readwrite) double height;  // Property，属性通过关键字 @property声明
-(double) volume; //方法
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

