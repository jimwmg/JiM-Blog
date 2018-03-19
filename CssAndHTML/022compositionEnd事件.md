---
title:compositionend事件
---

### 1 [oninput. oncompositionstart.  oncompositionend事件](https://developer.mozilla.org/zh-CN/docs/Web/Events/input)

简单来说，当我们的编辑框内，在输入中文字体的时候，开始输入的时候，会先触发oncompisitionstart 事件，然后在每次按下字母都会触发`oninput` 事件，但是只有当字母组合（composition)成真正的文字之后，在编辑区域呈现的时候，才会触发，最后才会触发 ` oncompositionend`事件

以下demo可以在页面中打开，切换成中文输入法看下效果；

```html
<div >
    <input id='txt' type="text">
  </div>
  <script>
    var txt = document.getElementById('txt');
    txt.addEventListener('compositionstart',function(){
      console.log('compositionStart')
    })
    txt.addEventListener('compositionend',function(){
      console.log('compositionEnd')
    })
    txt.addEventListener('input',function(){
      console.log('Input')
    })
  </script>
```

### 2 问题： 显然，在输入法中每次都触发input事件，很明显不是我们想要的

这里可以通过 设置一个开关，在chorm中 

`oncompositionstart` > `input ` > ` oncompositionend`

**注意有的浏览器测试结果可能是在** `oncompositionend`事件之后还会触发 `input `

```html
<div >
    <input id='txt' type="text">
        </div>
<script>
        function handle(el){
        console.log(el.value)
    }
    var inputLock = false;
var txt = document.getElementById('txt');
txt.addEventListener('compositionstart',function(){
    console.log('compositionStart')
    inputLock = true;

})
txt.addEventListener('compositionend',function(){
    console.log('compositionEnd')
    inputLock = false;
    //处理输入的逻辑
    handle(txt)
})
txt.addEventListener('input',function(){
    console.log('Input')
    if(!inputLock){
        console.log('真正处理input内容')
        handle(txt)
    }
})
```

### 3 一个解决方案[https://github.com/julytian/issues-blog/issues/15]

在 Web 开发中，经常要对表单元素的输入进行限制，比如说不允许输入特殊字符，标点。通常我们会监听 input 事件:

```
inputElement.addEventListener('input', function(event) {
  let regex = /[^1-9a-zA-Z]/g;
  event.target.value = event.target.value.replace(regex, '');
  event.returnValue = false
});
```

这段代码在 Android 上是没有问题的，但是在 iOS 中，input 事件会截断非直接输入，什么是非直接输入呢，在我们输入汉字的时候，比如说「喜茶」，中间过程中会输入拼音，每次输入一个字母都会触发 input 事件，然而在没有点选候选字或者点击「选定」按钮前，都属于非直接输入。

这显然不是我们想要的结果，我们希望在直接输入之后才触发 input 事件，这就需要引出我要说的两个事件—— `compositionstart`和`compositionend`。

`compositionstart` 事件在用户开始进行非直接输入的时候触发，而在非直接输入结束，也即用户点选候选词或者点击「选定」按钮之后，会触发 `compositionend` 事件。

```
var inputLock = false;
function do(inputElement) {
    var regex = /[^1-9a-zA-Z]/g;
    inputElement.value = inputElement.value.replace(regex, '');
}

inputElement.addEventListener('compositionstart', function() {
  inputLock = true;
});


inputElement.addEventListener('compositionend', function(event) {
  inputLock = false;
  do(event.target);
})


inputElement.addEventListener('input', function(event) {
  if (!inputLock) {
    do(event.target);
    event.returnValue = false;
  }
});
```

添加一个 inputLock 变量，当用户未完成直接输入前，inputLock 为 true，不触发 input 事件中的逻辑，当用户完成有效输入之后，inputLock 设置为 false，触发 input 事件的逻辑。这里需要注意的一点是，compositionend 事件是在 input 事件后触发的，所以在 compositionend事件触发时，也要调用 input 事件处理逻辑。