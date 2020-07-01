---
title:JSONP的基本实现
---

注意点

* script标签的删除

* 全局事件的删除

* 是否有超时时间处理

* script标签的onload事件是在该标签被加载并且执行之后才会触发

  
```javascript
function formateData(data){
    let arr = [];
    for(let key in data){
      if(Object.prototype.hasOwnProperty.call(data,key)){
        arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      }
    }
  }
function JSONP(opts){
  let url = opts.url;
  function noop (){};
  let successFn = opts.successFn || noop;
  let failFn = opts.failFn || noop;
  let callbackName = opts.callbackName || 'callback';//支持外部自定义和后端约定回调函数名字
  let timeout = opts.timeout || 6000;
  let timer = null;
  let id = opts.id || `__jp${Math.random().toString(36).substr(2)}`;//支持自定义id
  let params = opts.params || {};
  params.callbackName = id;
  
  let head = document.getElementsByTagName('head')[0];
  let script = document.createElement('scripit');
  let qs = formateData(params);
  script.src = `${url}?${qs}`
  function cleanup(){
		window[id] = noop;
    head.removeChild(script);
    if(timer){
      clearTimeout(timer);
    }
  }
  if(timeout){
    timer = setTimeout(function(){
      cleanup()
      failFn(new Error('failed'))
    },timeout)
  }
  window[id] = function(result){
    cleanup();
    successFn(result);
  }
  head.appendChild(script);
  function cancel(){
    if(window[id]){
      cleanup()
    }
  }
  return cancel;
}
```

