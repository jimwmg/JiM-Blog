---
title: template 
date: 2016-09-27 12:36:00
categories: javascript
tags : template
comments : true 
updated : 
layout : 
---

### table 表格操作,如何将这些后台传过来的数据动态的添加到table表格里

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<table border = 1></table> 
<script>
  	var data = [{
        id : 1,
        name : '西游记',
        author : '吴承恩',
        price : '40',
        desc : '佛教与道教的斗争'
    },{
        id : 2,
        name : '水浒传',
        author : '施耐庵',
        price : '30',
        desc : '草寇与政府的斗争'
    },{
        id : 3,
        name : '红楼梦',
        author : '曹雪芹',
        price : '60',
        desc : '封建社会的缩影'
    },{
        id : 4,
        name : '三国演义',
        author : '罗贯中',
        price : '30',
        desc : '一个杀伐纷争的年代'
    }];
</script>
</body>
</html>
//一般传过来的是JSON数据，然后需要进行转化，JSON.stringify(data)方法转化为对象
```

1 动态创建表格

1.1 innerHTML    数组和字符串

```html
<script>
 //--------------------------------------------------
  //通过字符串，这种方法有一个很大的弊端，就是字符串的不可变性，导致每次都会重新给字符串分配内存空间，特别耗费内存
	var table = document.querySelector("table");
    var str = "";
    for(var i = 0 ; i < data.length ; i++){
        var item = data[i];
         console.dir(item);
        str += '<tr>' +
                '<td>'+item['id']+'</td>' +
                '<td>'+item['name']+'</td>' +
                '<td>'+item['author']+'</td>' +
                '<td>'+item['price']+'</td>' +
                '<td>'+item['desc']+'</td>' +
                '</tr>'
    }
    table.innerHTML = str ;
//-----------------------------------------------------
    var table = document.querySelector("table");
    var arr = [];
    for(var i = 0 ; i < data.length ; i++){
        var item = data[i];
        console.dir(item);
        arr.push(

                '<tr>' +
                '<td>'+item['id']+'</td>' +
                '<td>'+item['name']+'</td>' +
                '<td>'+item['author']+'</td>' +
                '<td>'+item['price']+'</td>' +
                '<td>'+item['desc']+'</td>' +
                '</tr>'
        )
    }
    var html = arr.join("");
    table.innerHTML = html ;
//---------------------------------------------------------------
</script>
```

1.2 模板引擎创建，传入数据

```html
<script src="template-native.js"></script>

<script>
//    模板引擎的使用，第一步，改变script标签的type属性 = text/html  或者text/template，编写模板
//    第二步，调用模板，传入数据和模板的id
</script>

<script type="text/template" id="tempalteId">
    <% for(var i = 0 ;i < list.length; i++){ %>
    <tr>
        <td> `<%=list[i].id%>` </td>
        <td> `<%=list[i].name%>` </td>
        <td> `<%=list[i].author%> `</td>
        <td> `<%=list[i].price%> `</td>
        <td>`<%=list[i].desc%>`</td>
    </tr>
    <% } %>
</script>

<script>
    var tepData = { list: data } //这个位置要传入对象形式的数据

    var html = template("tempalteId",tepData); //注意第一个参数传入的是id ,引号勿忘
    var table = document.querySelector("table")
    table.innerHTML = html;
</script>
```

