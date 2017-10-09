---
title: HTML5 web存储
date: 2016-07-01 12:36:00
categories: HTML5
comments : true 
updated : 
layout : 
---

HTML5 web存储：

1 window.localStorage.setItem(key[string],data[string]);  可以将数据存储在用户端；

2 window.localStorage.getItem(key[string]);可以将setItem存储的数据取出来；

3 window.localStorage.clear(),会将客户端存储的数据全部清空；

4 window.localStorage.removeItem(key) ; 可以删除客户端指定的已经存储起来的数据；

```html
<body>
<h1>请输入你的名字</h1>
姓名<input type="text" value="1"/>
年龄<input type="text" value="2"/>
<input type="button" value="保存"/>
</body>
</html>
<script>
//    用户第一次进来点击保存，将用户输入的内容保存在客户端
//    获取点击保存按钮，将内容保存在客户端
    document.querySelector("input[type=button]").onclick = function(){
//        获取输入的内容
        var inputValue = document.querySelector("input[type=text]").value ;
        console.log(inputValue);
//        如何创建一个HTMl5的WEB存储,将inoutValue 存储在userName中
//        window.localStorage.setItem(key[string],data[string]);
        window.localStorage.setItem('userName',inputValue);
    }
//    用户第二次进入的时候，页面加载完毕之后，将第一次输入的内容保存
    window.onload = function(){
        window.localStorage.clear()
        //可以将所有存储在客户端的数据清除;
        //window.localStorage.key(2);
        //将之前web存储的内容取出来
//        var userName = window.localStorage.getItem(key[string])
        var userName = window.localStorage.getItem('userName');
        console.log("取出来的userName值为"+userName);
        if(userName == undefined && userName !== ""){
            document.querySelector("h1").innerHTML = '请输入您的名字';
        }else{
          //        将取出来的内容添加到欢迎行
            document.querySelector("h1").innerHTML = userName +"欢迎您";
        }
    }
</script>
```

