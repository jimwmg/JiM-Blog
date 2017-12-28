---
title: Canvas 
date: 2016-09-28 12:36:00
categories: javascript
tags: canvas
comments : true 
updated : 
layout : 
---

## Canvas

### 1 Canvas对象的大多数功能都是通过CanvasRenderingContext2D对象获得的，该对象通过canvas对象的getContext(contextID),只支持传递2d

```html
<canvas id="myCanvas" width="200" height="100"></canvas>
<script type="text/javascript">
var c=document.getElementById("myCanvas");
var cxt=c.getContext("2d");//getContext() 方法返回一个用于在画布上绘图的环境。
  //getContext("2d") 对象是内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。
</script>
```

### 2 CanvasRenderingContext2D 对象的属性

*  fillStyle  用来指定**填充**路径所围成的区域的当前颜色、模式或者渐变; **fill( ) 方法调用后才能生效**
*  strokeStyle  用来指定**画笔**绘制的路径的颜色、模式或者渐变；**stroke( )方法调用后才能生效**
*  lineCap 指定线条末端如何绘制，合法值是 "butt" "round" "square"
*  lineJoin 指定**两条线** 如何连接，合法值是"round" "bevel" "miter"
*  lineWidth **注意是数值类型的属性值**  指定绘制线条的画笔的宽度  cxt.lineWidth = 40;(大于1 即可)，**以所画的路径为基准，宽度向两边扩展增加，就像钢笔写字一个道理；
*  shadowBlur 属性指定羽化阴影的程度。默认值是 0。阴影效果得到 safari 的支持，但是并没有得到 FireFox 1.5 或 Opera 9 的支持。
*  shadowColor 属性 把阴影的颜色指定为一个 CSS 字符串或 Web 样式字符串，并且可以包含一个 alpha 部分来表示透明度。默认值是 black。阴影效果得到 Safari 的支持，但是并没有得到 FireFox 1.5 或 Opera 9 的支持
*  shadowOffsetX, shadowOffsetY 属性  指定阴影的水平偏移和垂直偏移。较大的值使得阴影化的对象似乎漂浮在背景的较高位置上。默认值是 0。阴影效果得到 Safari 的支持，但是并没有得到 FireFox 1.5 或 Opera 9 的支持。

### 3  CanvasRenderingContext2D 对象的方法 

上述的属性都是作用在绘制的**线条**或者**线条围成的区域中** ，那么生成线条和生成填充的命令(方法也就是核心的实现)；当然咯，最根本的你还得有路径，路径的绘制也是根本，表急；

*  stroke()  方法用来绘制当前路径；

* strokeRect()  方法用来以strokeStyle 和 lineWidth 属性指定，矩形边角的形状由 [lineJoin 属性](prop_canvasrenderingcontext2d_linejoin.asp)指定绘制一个矩形

      有独立路径，不影响其他路径;好像已经调用了beginPath()一样，**不改变当前位置**；  

* fill( )  方法用来填充绘制的路径形成的区域(即使该区域没有闭合)

      使用 fillStyle 属性所指定的颜色、渐变和模式来填充**当前路径** 。这一路径的每一条**子路径** 都单独填充。任何未闭合的子路径都被填充，就好像已经对他么调用了 [closePath() 方法](met_canvasrenderingcontext2d_closepath.asp)一样

* fillRect( )  方法用 fillStyle 属性所指定的颜色、渐变和模式来填充指定的矩形。

      有独立路径，不影响其他路径;好像已经调用了beginPath()一样，**不改变当前位置**；

* clearRect( ) 方法清除所定义的矩形区域；

```javascript
cxt.fill();//只要路径可以形成闭合空间，就会被填充
//填充一条路径并不会清除该路径。你可以在调用 fill() 之后再次调用 stroke()，而不需要重新定义该路径。
cxt.stroke();
cxt.fillRect(x,y,width,height);
cxt.strokeRect(x,y,width,height);
```

### 4 用CanvasRenderingContext2D 对象的方法绘制路径

4.1 当前位置的概念的理解，每次线条绘制完毕，包括绘制直线，圆形，矩形等，**当前位置** 都会发生变化

4.2 如何理解路径，就是没有调用beginPath()之前进行绘制路线的方法，所绘制的路线都是当前路径，当前路径内的包括直线，圆形，矩形以及曲线都会被stroke()方法和fill()绘制成框或者添加填充；调用beginPath()之后绘制的路径，然后在stroke()和fill()渲染了路径不会将之前的路径重新渲染;

4.3 绘制一条子路径:

*  绘制直线确定起始位置: cxt.moveTo(x,y)  将**当前位置**设置移动到该位置(x,y)，并且不产生线条，

   moveTo() 方法设置当前位置并开始一条**新的子路径**;

* 绘制直线，进行直线延伸: cxt.lineTo(x,y)  绘制直线完成之后，设置(x,y)为**当前位置**；

* 绘制矩形cxt . rect(x,y,width,height); x,y 矩形的左上角的坐标。为**当前路径**(画布)添加一条**矩形子路径**。绘制完成之后**当前位置** 是矩形左上角；？当前位置是 (0,0)。

* 绘制圆形 cxt . arc(x,y,radius,startAngle,endAngle,counterclockwise)  为一个画布的**当前子路径** 添加一条弧。

   * x,y 代表圆心坐标，

   * angle的取值问题:90deg = 100grad = 0.25turn ≈ 1.570796326794897rad，

     沿着圆指定弧的开始点和结束点的一个角度。这个角度用**弧度** 来衡量。
     沿着 X 轴正半轴的方向的角度为 0，角度 **沿着逆时针** 方向而增加。

   * counterclockwise  true  false 逆时针 ture  顺时针 false

   * 绘制过程:

     1 这个方法的前 5 个参数指定了圆周的一个**起始点**和**结束点** 。

     2 调用这个方法会在**当前点**和**弧的起点** 之间添加一条直线。

     3 接下来，沿着**弧的起始点**和**结束点** 之间添加弧(根据true或者false判断逆时针还是顺时针画弧)

     4 最后将 **弧的终点**  设置为 **当前位置** 

   * 在绘制圆形的时候，为了避免一些莫名其妙的填充效果，尽量将当前点移到圆心处；

4.4 如果想要对一个新的路径渲染不同于上一条子路径的边框和填充，那么可以新建一条子路径，并且重新渲染和填充就可以获取不一样子路径样式

*  当前路径 : 画布的一项强大功能是，它能够从基本的绘图操作来构建图形，然后，绘制这些图形的框架（勾勒它们）或者给这些图形的内容涂色（填充它们）。累计起来的操作统一叫做*当前路径*。一个画布只保持一条当前路径。
*  子路径: 每次使用beginPath()方法之后，就开辟了一条新的子路径；


* beginPath() 方法在一个画布中开始子路径的一个**新的集合**。 重新渲染为不同的样式；丢弃任何当前定义的路径并且开始一条新的路径。它把当前的点设置为 (0,0)。

  当一个画布的环境第一次创建，beginPath() 方法会被显式地调用；

  每次stroke对应一个beginPath;

* closePath( ) 将当前子路径闭合；如果画布的子路径是打开的，closePath() 通过添加一条线条连接**当前点**和**子路径起始点** 来关闭它。

  如果子路径已经闭合了，这个方法不做任何事情。

  一旦子路径闭合，就不能再为其添加更多的直线或曲线了。要继续向该路径添加，需要通过调用 [moveTo()](met_canvasrenderingcontext2d_moveto.asp.htm) 开始一条新的子路径。

4.5 路径绘制完毕之后 ，必须调用cxt.stroke() 或者cxt.fill()进行渲染才能显示；

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<canvas id="myCanvas" height="400px" width="400px" style="border:solid red 1px"></canvas>
<script>
//以下在chorm开发者工具设置断点查看下变化过程
    var myCanvas = document.getElementById("myCanvas");
    var cxt = myCanvas.getContext('2d');
    //console.log(cxt);
    cxt.beginPath();
    cxt.lineWidth = 5;
    cxt.fillStyle = "red";
  
    cxt.rect(200,200,50,50);//将当前位置设置为（0,0）

    cxt.stroke();
    cxt.fill();

    cxt.beginPath();//看下没有这行代码和有这行代码的区别，分析beginPath()的作用
    cxt.lineWidth = 10;
    cxt.fillStyle = "green";
    cxt.rect(100,100,50,50);


    cxt.stroke();
    cxt.fill();
  //lineWidth宽度向两边扩展，fill颜色填充以路径为基准，所以会出现边框变细的错觉
</script>
</body>
</html>
```

### 5 用CanvasRenderingContext2D 对象的方法填充文本

5.1 绘制文本的方法:

*  cxt.fillText(text,x,y,maxWidth)  cxt.strokeText(text,x,y,maxWidth)  绘制文本 ; **不改变当前位置**；

* cxt.measureText(txt)  该方法可以测试文本的大小，返回一个对象 TextMetrics{width : }

    x y 是开始绘制文本的坐标

* cxt.measureText(txt).width ;可以获取文本的大小

5.2 改变文本的属性:

*  cxt.textBaseline = "alphabetic|top|hanging|middle|ideographic|bottom";  以绘制的文本的y坐标为基准;默认。文本基线是普通的字母基线。
*  cxt.textAlign = ="center|end|left|right|start";   以绘制文本坐标x为基准  默认start
*  fillText()或 strokeText() 方法在画布上定位文本时，将使用指定的 textBaseline和textAlign 值。

### 6 用CanvasRenderingContext2D 对象的方法绘制图像 



### 7 用CanvasRenderingContext2D 对象的方法，改变坐标系统

*  cxt.translate(dx,dy) 该方法可以改变画布原始的原点坐标，后期所绘制的路径都是以这个改变后的坐标为原点，坐标轴的执行不变；x轴向右为正方向，y轴向下为正方向

* cxt.rotate(angle) rotate() 方法通过指定一个角度，使得任意后续绘图在画布中都显示为旋转的。它并没有旋转 <Canvas> 元素本身。注意，这个角度是用弧度指定的。如需把角度转换为弧度，请乘以 Math.PI 并除以 180。

    旋转的量，用弧度表示。正值表示顺时针方向旋转，负值表示逆时针方向旋转;

* 每次牵涉到旋转，要考虑两点，第一旋转的中心，第二旋转的角度，这里旋转的角度通过angle赋值，旋转的中心是当前坐标系统的坐标原点，也就是说，如果通过translate(dx,dy)改变了坐标原点，那么旋转的中心就是改变后的坐标原点;
   * 旋转之后在画 的路径都是以旋转后的为基准，对于旋转之前的路径没有影响；

* cxt.scale(sx,sy)  scale() 方法为画布的当前变换矩阵添加一个缩放变换。缩放通过独立的水平和垂直缩放因子来完成。例如，传递一个值 2.0 和 0.5 将会导致绘图路径宽度变为原来的两倍，而高度变为原来的 1/2。指定一个负的 *sx* 值，会导致 X 坐标沿 Y 轴对折，而指定一个负的 sy 会导致 Y 坐标沿着 X 轴对折。


### 8 save( ) 和 restore( ) 方法

*  save( ) 一个画布的图形状态包含了 CanvasRenderingContext2D 对象的所有属性（除了只读的画布属性以外）。它还包含了一个变换矩阵，该矩阵是调用 rotate( )、scale( ) 和 translate( ) 的结果。另外，它包含了剪切路径，该路径通过 clip( ) 方法指定。可是要注意，当前路径和当前位置并非图形状态的一部分，并且不会由这个方法保存。
*  restore( )  回复上一个save( )状态时候的画布所保存的属性，包括变换的矩阵结果;










