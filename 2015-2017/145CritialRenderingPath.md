---
title: Critial Rendering Path 
date: 2016-11-02 12:36:00
categories: render
tegs : rendering
comments : true 
updated : 
layout : 
---

### 1 理解关键渲染路径是提高页面性能的关键所在。总体来说，关键渲染路径分为六步。

- 创建DOM树(Constructing the DOM Tree)
- 创建CSSOM树(Constructing the CSSOM Tree)
- 执行脚本(Running JavaScript)
- 生成渲染树(Creating the Render Tree)
- 生成布局(Generating the Layout)
- 绘制(Painting)

**创建 DOM 树**

DOM（文档对象模型）树是HTML页面完全解析后的一种表示方式。从根元素<html>开始，页面上每个元素或者文本都会创建一个对应的节点。每个节点都包含了这个元素的所有属性，并且嵌套在元素内的元素会被解析成外层元素对应的节点的子节点。

**创建CSSOM 树**

CSSOM（CSS对象模型）树是对附在DOM结构上的样式的一种表示方式。它与DOM树的呈现方式相似，只是每个节点都带上样式 ，包括明确定义的和隐式继承的。

CSS是一种渲染阻塞资源(render blocking resource)，它需要完全被解析完毕之后才能进入生成渲染树的环节。CSS并不像HTML那样能执行部分并显示，因为CSS具有继承属性， 后面定义的样式会覆盖或者修改前面的样式。如果我们只使用样式表中部分解析好的样式，我们可能会得到错误的页面效果。所以，我们只能等待CSS完全解析之后，才能进入关键渲染路径的下一环节。

需要注意的是，只有CSS文件适用于当前设备的时候，才能造成渲染阻塞。标签<link rel=”stylesheet”>接受media属性，该属性规定了此处的CSS文件适用于哪种设备。如果我们有个设备属性值为orientation: landscape(横向)的样式，当我们竖着浏览页面的时候，这个CSS资源是不会起作用的，也就不会阻塞渲染的过程了。

因为JavaScript脚本的执行必须等到CSSOM生成之后，所以说CSS也会阻塞脚本(script blocking)。

**执行JavaScript**

JavaScript是一种解析阻塞资源(parser blocking resource)，它能阻塞HTML页面的解析。

当页面解析到`<script>`标签，不管脚本是內联的还是外联，页面解析都会暂停，转而加载JavaScript文件（外联的话）并且执行JavaScript。这也是为什么如果JavaScript文件有引用HTML文档中的元素，JavaScript文件必须放在那个元素的后面。

为了避免JavaScript文件阻塞页面的解析，我们可以在`<script>`标签上添加async属性，使得JavaScript文件异步加载。

**生成渲染树**

渲染树是DOM和CSSOM的结合，是最终能渲染到页面的元素的树形结构表示。也就是说，它包含能在页面中最终呈现的元素，而不包含那些用CSS样式隐藏的元素，比如带有display: none;属性的元素。

**生成布局**

布局决定了视口的大小，为CSS样式提供了依据，比如百分比的换算或者视口的总像素值。视口大小是由meta标签的name属性为viewport的内容设置所决定的，如果缺少这个标签，默认的视口大小为980px。

**绘制**

最后，页面上可见的内容就会转化为屏幕上的像素点。

### 2 绘制过程所需要花费的时间取决于DOM的大小以及元素的CSS样式。有些样式比较耗时，比如一个复杂的渐变背景色比起简单的单色背景需要更多的时间来渲染。

转化： 浏览器从磁盘或网络读取 HTML 的原始字节，浏览器会将这段原始文件按照相应编码规范进行解码（现在一般为 utf-8）。

符号化：根据 W3C 标准转化为对应的符号（一般在尖括号内）。

DOM 构建：HTML 解析器会解析其中的 tag 标签，生成 token ，遇到 CSS 或JS 会发送相应请求。HTML 解析时阻塞主进程的，CSS 一般也是阻塞主进程的（媒体查询时例外），也就是说它们在解析过程中是无法做出响应的。而 JS 手动添加 async 后达到异步加载，根据 token 生成相应 DOM 树。

CSSDOM 构建，添加 CSS 样式生成 CSSDOM 树。

渲染树构建，从 DOM 树的根节点开始，遍历每个可见的节点，给每个可见节点找到相应匹配的 CSSOM 规则，并应用这些规则，连带其内容及计算的样式。

样式计算，浏览器会将所有的相对位置转换成绝对位置等一系列的样式计算。

布局，浏览器将元素进行定位、布局。

绘制，绘制元素样式，颜色、背景、大小、边框等。

合成，将各层合成到一起、显示在屏幕上。

其他优化：

- 使用 requestAnimationFrame，将 setTimeout 换成requestAnimationFrame，因为 setTimeout 时间控制可能造成在一帧的中间，目前各浏览器对 requestAnimationFrame 的支持已经比较好了。
- 使用 Web Workers，将复杂计算的 JS 采用 Web Workers 进行处理。
- 减少垃圾回收，垃圾回收是一个容易被忽略的问题，因为垃圾回收的时间是不受控制的，它可能在一个动画的中途，阻塞动画的执行，更理想的情况是在循环中复用对象

### 3 浏览器计算 DOM 元素的几何信息的过程：元素大小和在页面中的位置。每个元素都有一个显式或隐式的大小信息，决定于其 CSS 属性的设置、或是元素本身内容的大小、或者是其父元素的大小。在Blink/WebKit 内核的浏览器和 IE 中，这个过程称为 Layout。在基于 Gecko 的浏览器（比如 Firefox）中，这个过程称为Reflow。

3.1 避免触发布局

目前，transform 和 opacity 只会引起合成，不会引起布局和重新绘制。整个流程中比较耗费性能的布局和绘制流程将直接跳过，性能显然是很好的。其他的 CSS 属性改变引起的流程会有所不同，有些属性也会跳过布局，具体可以查看 CSS Triggers。所以，优化的第一步就是尽可能避免触发布局

3.2 为什么 DOM 很慢

谈到这里需要对浏览器利用 HTML/CSS/JavaScript 等资源呈现出精彩的页面的过程进行简单说明。浏览器在收到 HTML 文档之后会对文档进行解析开始构建 DOM (Document Object Model) 树，进而在文档中发现样式表，开始解析 CSS 来构建 CSSOM（CSS Object Model）树，这两者都构建完成后，开始构建渲染树

在每次修改了 DOM 或者其样式之后都要进行 DOM树的构建，CSSOM 的重新计算，进而得到新的渲染树。浏览器会利用新的渲染树对页面进行重排和重绘，以及图层的合并。通常浏览器会批量进行重排和重绘，以提高性能。但当我们试图通过 JavaScript 获取某个节点的尺寸信息的时候，为了获得当前真实的信息，浏览器会立刻进行一次重排。

3.3 避免强制性同步布局

在 JavaScript 中读取到的布局信息都是上一帧的信息，如果在 JavaScript 中修改了页面的布局，比如给某个元素添加了一个类，然后再读取布局信息。这个时候为了获得真实的布局信息，浏览器需要强制性对页面进行布局。因此应该避免这样做。

3.4 批量操作 DOM

在必须要进行频繁的 DOM 操作时，可以使用 fastdom 这样的工具，它的思路是将对页面的读取和改写放进队列，在页面重绘的时候批量执行，先进行读取后改写。因为如果将读取与改写交织在一起可能引起多次页面的重排。而利用 fastdom 就可以避免这样的情况发生。

虽然有了 fastdom 这样的工具，但有的时候还是不能从根本上解决问题，比如我最近遇到的一个情况，与页面简单的一次交互（轻轻滚动页面）就执行了几千次 DOM 操作，这个时候核心要解决的是减少 DOM 操作的次数。这个时候就要从代码层面考虑，看看是否有不必要的读取。

3.5  使用 requestAnimationFrame 来更新页面

我们希望在每一帧刚开始的时候对页面进行更改，目前只有使用 requestAnimationFrame 能够保证这一点。使用setTimeout 或者 setInterval 来触发更新页面的函数，该函数可能在一帧的中间或者结束的时间点上调用，进而导致该帧后面需要进行的事情没有完成，引发丢帧。

3.6 优化 CSS

CSS 选择器在匹配的时候是由右至左进行的，因此最后一个选择器常被称为关键选择器，因为最后一个选择越特殊，需要进行匹配的次数越少。要千万避免使用 *（通用选择器）作为关键选择器。因为它能匹配到所有元素，进而倒数第二个选择器还会和所有元素进行一次匹配。这导致效率很低下。

**总结**

我们可以利用Chrome开发者工具下的Timeline去观察整个关键路径渲染的过程。