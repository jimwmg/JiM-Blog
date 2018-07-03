---
title:  js 事件对象参数 
date: 2016-08-02 12:36:00
categories: javascript event
tags : event 
comments : true 
updated : 
layout : 
---

### 一 : js中事件参数的总结：

1 所有的事件都有默认的事件对象参数，事件对象参数可以通过arguments属性查看,在不同浏览器中，事件对象参数支持不一样，谷歌和火狐支持事件对象参数 e ,而IE支持 window.event,针对不同浏览器需要兼容

```html
e = window.event ? window.event : e 
```

DragEvent  TouchEvent 继承event和MouseEvent的事件对象参数属性值；

2 事件(Event)  window事件 keyBoard事件 Form表单事件 

```html
Event:
bubbles:false	返回布尔值，指示该事件是否是冒泡事件，true代表是冒泡事件，false代表是捕获事件		
cancelBubble:false 阻止事件冒泡，设置该属性值为true,可以阻止事件冒泡，默认false
cancelable:false  cancelable 事件返回一个布尔值。如果用 preventDefault() 方法可以取消与事件关联的默认动作，则为 true，否则为 fasle。默认false
composed:false  
currentTarget:		即当前处理该事件的元素、文档或窗口。即事
件绑定的元素
defaultPrevented:false
eventPhase:2	eventPhase 属性返回事件传播的当前阶段。它的值是下面的三个常量之一，它们分别表示捕获阶段(1:事件通过捕获触发)、正常事件派发(2:直接点击事件绑定元素)和起泡阶段(3:事件通过冒泡触发)。	
isTrusted:true
path:Array[1]
returnValue:true
srcElement:		返回触发其他元素的绑定事件的 节点:即直接点击的节点
target: 		返回触发其他元素的绑定事件的 节点:即直接点击的节点
timeStamp:
type:"load"
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<style>
		#dv1 {
			height: 300px;
			width: 300px;
			background-color: red;
		}
		#dv2 {
			height: 200px;
			width: 200px;
			background-color: blue;
		}
		#dv3 {
			height: 100px;
			width: 100px;
			background-color: green;
		}
		#dv4 {
			height: 50px;
			width: 50px;
			background-color: pink;
		}

	</style>
</head>
<body>
<div id="dv1">1
	<div id="dv2">2
		<div id="dv3">3
			<div id="dv4">4</div>
		</div>
	</div>
</div>
<script src="common.js"></script>
<script>
// e.target记录触发事件的目标
	// my$("dv2").onclick = function(e){
	// 	console.log(e.target+"==="+window.event.srcElement+"=="+e.currentTarget);
	//这句代码里面的
	// 	console.log(e.target.id+"==="+window.event.srcElement.id+"=="+e.currentTarget.id);
	// };
	my$("dv2").onclick = function(e){
		e = e || window.event;
		console.log(e.target+"====="+e.currentTarget);
		console.log(e.srcElement.id+"=="+e.target.id+"==="+"=="+e.currentTarget.id+"=="+e.bubbles+"=="+ e.eventPhase);
	};
// 	在 2 级 DOM 中，事件传播分为三个阶段：

// 第一，捕获阶段。事件从 Document 对象沿着文档树向下传递给目标节点。如果目标的任何一个先辈专门注册了捕获事件句柄，那么在事件传播过程中运行这些句柄。

// 第二个阶段发生在目标节点自身。直接注册在目标上的适合的事件句柄将运行。这与 0 级事件模型提供的事件处理方法相似。

// 第三，起泡阶段。在此阶段，事件将从目标元素向上传播回或起泡回 Document 对象的文档层次。
	
// 	target 事件属性可返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口;
// 	currentTarget currentTarget 事件属性返回其监听器触发事件的节点，即当前处理该事件的元素、文档或窗口。
// 在捕获和起泡阶段，该属性是非常有用的，因为在这两阶段，它不同于 target 属性
// srcElement.id + target.id +currentTarget.id  + e.bubbles e.eventPhase
// 	如点击dv2  控制台输出：dv2  dv2   dv2 true   2  
// 	点击dv3  控制台输出   dv3  dv3   dv2  true  3
  //点击dv4  控制台输出   dv4  dv4   dv2  true  3
</script>
</body>
</html>
```

3 鼠标事件(MouseEvent)

```html
altKey:false
bubbles:true
button:0
buttons:0
cancelBubble:false
cancelable:true
clientX:230
clientY:58
composed:true
ctrlKey:false
currentTarget:null
defaultPrevented:false
detail:1
eventPhase:0
fromElement:null
isTrusted:true
layerX:230
layerY:58
metaKey:false
movementX:0
movementY:0
offsetX:64
offsetY:50
pageX:230
pageY:58
path:Array[5]
relatedTarget:null
returnValue:true
screenX:371
screenY:205
shiftKey:false
sourceCapabilities:InputDeviceCapabilities
srcElement:div
target:div
timeStamp:141604.27000000002
toElement:div
type:"click"
view:Window
which:1
x:230
y:58
```

4 拖拽事件(DragEvent)

```html
dataTransfer:DataTransfer
  dropEffect:"none"
  effectAllowed:"uninitialized"
  files:FileList
  items:DataTransferItemList
  types:Array[0]
  __proto__:DataTransfer
```

5 触摸事件(TouchEvent)

```html
- changedTouches   所有改变的触摸点的集合
- targetTouches  目标元素上方的触摸点的
- touches 改变的触摸点
```

6 messageEvent

```javascript
message 属性表示该message 的类型； 
data 属性为 window.postMessage 的第一个参数；
origin 属性表示调用window.postMessage() 方法时调用页面的当前状态； 
source 属性记录调用 window.postMessage() 方法的窗口信息。
```

7 storageEvent

```javascript
key  属性用来表示storage存储的键值对属性的键
oldValue 属性用来表示storage存储的原来的属性值
newValue 属性用来表示storage存储的原来的属性值
```

### 二 : jQuery中事件参数,多了两个属性，e . originalEvent : 用于存放所有的事件对象参数值 ;  e . data :  

```html
originalEvent:Event
originalEvent:MouseEvent
originalEvent:DragEvent
originalEvent:TouchEvent
data : undefined (如果没有传值给这个参数，那么就是undefined)
```

对于drag事件和touch 事件的新增属性dataTransfer  changedTouches  targetTouches  touches  存放在originalEvent属性里面.

### 三 : 标准Event方法

```tex
preventDefault() : 该方法将通知 Web 浏览器不要执行与事件关联的默认动作（如果存在这样的动作）。例如，如果 type 属性是 "submit"，在事件传播的任意阶段可以调用任意的事件句柄，通过调用该方法，可以阻止提交表单。注意，如果 Event 对象的 cancelable 属性是 fasle，那么就没有默认动作，或者不能阻止默认动作。无论哪种情况，调用该方法都没有作用。
stopPropagation() : 不再派发事件。
终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播。调用该方法后，该节点上处理该事件的处理程序将被调用，事件不再被分派到其他节点。
该方法将停止事件的传播，阻止它被分派到其他 Document 节点。在事件传播的任何阶段都可以调用它。注意，虽然该方法不能阻止同一个 Document 节点上的其他事件句柄被调用，但是它可以阻止把事件分派到其他节点。
```

