---
title： viewport的理解
---

### 1 viewport的出现

[链接](http://www.runoob.com/w3cnote/viewport-deep-understanding.html)

通俗的讲，移动设备上的viewport就是设备的屏幕上能用来显示我们的网页的那一块区域，在具体一点，就是浏览器上(也可能是一个app中的webview)用来显示网页的那部分区域，但viewport又不局限于浏览器可视区域的大小，它可能比浏览器的可视区域要大，也可能比浏览器的可视区域要小。在默认情况下，一般来讲，移动设备上的viewport都是要大于浏览器可视区域的，这是因为考虑到移动设备的分辨率相对于桌面电脑来说都比较小，所以为了能在移动设备上正常显示那些传统的为桌面浏览器设计的网站，**移动设备上的浏览器都会把自己默认的viewport设为980px或1024px**（也可能是其它值，这个是由设备自己决定的），但带来的后果就是浏览器会出现横向滚动条，因为浏览器可视区域的宽度是比这个默认的viewport的宽度要小的。下图列出了一些设备上浏览器的默认viewport的宽度。

网上有各种文章都会将这个viewport分为 visaul viewport  ,layout viewport , ideal viewport 个人觉得不太好理解，所以决定换个角度去理解这个viewport；

### 2 首先理解 HTML 和 css 中的最基本的 **文档** 坐标系统 和 **视口** 坐标系统

2.1 文档坐标是整个HTML 形成的坐标体系，视口是显示文档内容的  **浏览器的一部分**,它不包括浏览器的"外壳"，如菜单和工具栏和标签页 

2.2 如果文档比视口要小，或者说文档还没有出现滚动，那么这个时候文档左上角就是视口左上角，文档坐标和视口坐标是同一个系统；

2.3 文档坐标比视口坐标更加基础，因为文档坐标系统是固定不变的，元素相对于文档坐标的位置是不变的；但是视口坐标系统就不一样了，元素相对于视口坐标的位置，在发生滚动的时候，是实时变化的；

#### idealViewport: 这个值是固定的，是一个理想的值，我们打开浏览器的控制台，可以切换不同的移动终端型号，可以看到每次切换的时候，都会变化的数值（[移动端不同设备的idealviewport的固定值](http://viewportsizes.com/)）[另外一个链接](https://www.quirksmode.org/mobile/metaviewport/devices.html)

#### layoutViewPort(布局视口) : 可以通过document.documentElement.clientWidth来获取；(变化的)

一下案例中的div作为一个参考；

* **移动设备上的浏览器都会把自己默认的viewport设为980px或1024px**: 也可能是其它值，这个是由设备自己决定的，首先注意理解这句话；

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
    <style>
 #dv{
    width:300px;
    height:20px;
    background-color:aqua;
  }
  </style>
  <div id='dv'></div>
</body>
</html>
```

打开控制台，在控制面板输入(可以不停的切换设备)看下iphone和iPad  ipad pro  Galaxy等的不同；

```
document.documentElemtnt.clientWidth //980  1024 绝大部分是980 或者 1024
```

这样子在常规情况下，会因为移动端屏幕比较小，而产生横向的滚动条，而理想的状况是 viewport的宽度等于设备的宽度，不会再出现横向的滚动条；那么如何得到 这个viewport呢？

* 方式一：使用initial-scale

这个时候就需要meta标签的出现了，meta的具体解释见下文

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="initial-scale=1"> 增加这行代码
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
    <style>
 #dv{
    width:300px;
    height:20px;
    background-color:aqua;
  }
  </style>
  <div id='dv'></div>
</body>
</html>
```

同样再次打开控制台

```
document.documentElemtnt.clientWidth ; 得到的值就是每个设备固定的 ideal viewport的值；可以改变initial-scale的值看下不同的效果；
```

**由此可见，layoutviewport = idealviewport / initial-scale (idealviewport的值是根据不同的设备就自带的一个固定的值)**

* 方式二：使用width=device-width

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width" >
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
   <style>
 #dv{
    width:300px;
    height:20px;
    background-color:aqua;
  }
  </style>
  <div id='dv'></div>
    
</body>
</html>
```

同样再次打开控制台

```
document.documentElemtnt.clientWidth ; 得到的值就是每个设备固定的 ideal viewport的值；可以改变width的的值看下不同的效果；
```

但是当width和initial-scale同事出现的时候，浏览器会如何解决呢？当遇到这种情况时，浏览器会取它们两个中较大的那个值。例如，当width=400，ideal viewport的宽度为320时，取的是400；当width=400， ideal viewport的宽度为480时，取的是ideal viewport的宽度。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=0.2" >
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
<style>
 #dv{
    width:300px;
    height:20px;
    background-color:aqua;
  }
  </style>
  <div id='dv'></div>
</body>
</html>
```

width=400表示把当前viewport的宽度设为400px，initial-scale=1则表示把当前viewport的宽度设为ideal viewport的宽度，那么浏览器到底该服从哪个命令呢？是书写顺序在后面的那个吗？不是。当遇到这种情况时，浏览器会取它们两个中较大的那个值。例如，当width=400，ideal viewport的宽度为320时，取的是400；当width=400， ideal viewport的宽度为480时，取的是ideal viewport的宽度。（ps:在uc9浏览器中，当initial-scale=1时，无论width属性的值为多少，此时viewport的宽度永远都是ideal viewport的宽度）

最后，总结一下，要把当前的viewport宽度设为ideal viewport的宽度，既可以设置 width=device-width，也可以设置 initial-scale=1，但这两者各有一个小缺陷，就是iphone、ipad以及IE 会横竖屏不分，通通以竖屏的ideal viewport宽度为准。所以，最完美的写法应该是，两者都写上去，这样就 initial-scale=1 解决了 iphone、ipad的毛病，width=device-width则解决了IE的毛病：

### 3 **meta标签的属性取值**

作用：meta标签作为元数据，提供了HTML文档的基本信息，meta元素可以用来指定网页的描述，关键词，文件最后的修改时间，作者以及其他元数据；元数据可以被浏览器使用，来规定如何加载页面，也可以用来搜索引擎提取关键字，也可以用来其他web服务；

**注意：`**<meta> 标签通常位于 <head> 区域内。`

**注意：** 元数据通常以 名称/值 对出现。

**注意：** 如果没有提供 name 属性，那么名称/值对中的名称会采用 http-equiv 属性的值。

 

```javascript
实例 1 - 定义文档关键词，用于搜索引擎：

<meta name="keywords" content="HTML, CSS, XML, XHTML, JavaScript">
实例 2 - 定义web页面描述：

<meta name="description" content="Free Web tutorials on HTML and CSS">
实例 3 - 定义页面作者：

<meta name="author" content="Hege Refsnes">
实例 4 - 每30秒刷新页面：

<meta http-equiv="refresh" content="30">

```

另外一个就是 viewport 属性

| width         | 设置**\*layout viewport***  的宽度，为一个正整数，或字符串"width-device" |
| ------------- | ------------------------------------------------------------ |
| initial-scale | 设置页面的初始缩放值，为一个数字，可以带小数                 |
| minimum-scale | 允许用户的最小缩放值，为一个数字，可以带小数                 |
| maximum-scale | 允许用户的最大缩放值，为一个数字，可以带小数                 |
| height        | 设置**\*layout viewport***  的高度，这个属性对我们并不重要，很少使用 |
| user-scalable | 是否允许用户进行缩放，值为 "no" 或 "yes", no 代表不允许，yes 代表允许 |

度量单位：CSS像素。

1）width：用于设置layout viewport(布局视口)的宽度

 width规则下有一个特殊的值device-width，通过设置width=device-width可以将layout viewport(布局视口)的宽度等于 ideal viewport(理想视口)的宽。

理想视窗：这个理想视窗是为了布局视窗而生的，为什么这么说，因为它是基于布局视窗的。他其实就是变了尺寸的布局视窗。理想视窗就是把布局视窗调整到合适的状态，让页面有最好的表面效果，这也是它名字的由来。设置了理想视窗用户就不再需要对页面进行缩放，因为浏览器已经帮你把页面调整到最佳的显示状态了。

2）重点：这个值得默认值initial-scale：设置页面的初始缩放比**和** layout viewport(布局视口)的宽度

**我们可以在iphone和ipad上得到一个结论，就是无论你给layout viewpor设置的宽度是多少，而又没有指定初始的缩放值的话，那么iphone和ipad会自动计算initial-scale这个值，以保证当前layout viewport的宽度在缩放后就是浏览器可视区域的宽度，也就是说不会出现横向滚动条。比如说，在iphone上，我们不设置任何的viewport meta标签，此时layout viewport的宽度为980px，但我们可以看到浏览器并没有出现横向滚动条，浏览器默认的把页面缩小了。**

先来看下initial-scale的作用

设置 initial-scale这条规则实际上做了如下2件事： 
​      1、将页面初始缩放因子（zoom factor）设置为给定的值，计算出相对于ideal viewport，得到visual viewport的宽。 
​      2、设置layout viewport的宽等于刚刚计算出来的visual viewport的宽

​      如果一个IPhone手机处于竖屏模式，设置其initital-scale=2并且没有其他设置。那么不要奇怪，它其实是设置了visual viewport的宽为160px (=320px/2)，这就是缩放规则的工作方式。

​      而且，它同时也设置了layout viewport的宽度为160px。因此我们现在拥有一个在最小缩放比例下160px宽的网页。(visual viewport不能比layout viewport大，所以页面不可能放大了)

```javascript
visual viewport width = ideal viewport width / zoom factor 
zoom factor = ideal viewport width / visual viewport width
```

3）minimum-scale：设置页面最小缩放比例，即用户能将页面缩小多少

​      maximum-scale：设置页面最大缩放比例，即用户能将页面放大多少

这两个都是相对于ideal-portrail的尺寸而言的；

height：应该是用于设置layout viewport(布局视口)的高度，但该属性无效

user-scalable：当设置为no时，可禁止用户缩放页面。但请不要这样去做。 

可以看到，通过设置 viewport的属性值，将其width设置为和屏幕的宽度一致，即可得到所谓的visual viewport；





