http://www.zhangxinxu.com/wordpress/2013/06/html5-history-api-pushstate-replacestate-ajax/

```javascript
var eleMenus = $("#choMenu a").bind("click", function(event) {
  var query = this.href.split("?")[1];//this指的是某个a标签，href上对应该a标签的后台地址；
  if (history.pushState && query && !$(this).hasClass(clMenuOn)) {
    /*
            ajax载入~~
        */

    // history处理
    var title = "上海3月开盘项目汇总-" + $(this).text().replace(/\d+$/, "");
    document.title = title;
    if (event && /\d/.test(event.button)) {            
      history.pushState({ title: title }, title, location.href.split("?")[0] + "?" + query);
    }
  }
  return false;
});

var fnHashTrigger = function(target) {
  var query = location.href.split("?")[1], eleTarget = target || null;
  if (typeof query == "undefined") {
    if (eleTarget = eleMenus.get(0)) {
      // 如果没有查询字符，则使用第一个导航元素的查询字符内容
      history.replaceState(null, document.title, location.href.split("#")[0] + "?" + eleTarget.href.split("?")[1]) + location.hash;    
      fnHashTrigger(eleTarget);
    }
  } else {
    eleMenus.each(function() {
      if (eleTarget === null && this.href.split("?")[1] === query) {
        eleTarget = this;
      }
    });

    if (!eleTarget) {
      // 如果查询序列没有对应的导航菜单，去除查询然后执行回调
      history.replaceState(null, document.title, location.href.split("?")[0]);    
      fnHashTrigger();
    } else {
      $(eleTarget).trigger("click");
    }        
  }    
};
if (history.pushState) {
  window.addEventListener("popstate", function() {
    fnHashTrigger();                             
  });

  // 默认载入
  fnHashTrigger();
}
```

