---
title:  underscore template js
date: 2016-09-19 12:36:00
categories: nodejs
tags : Http
comments : true 
updated : 
layout : 
---

### 一 underscore_template.js模板引擎的使用

1 语法

```html
<script type="text/template">
	_.template模板函数只能解析3种模板标签（这比Smarty、JSTL要简单得多）：

<%  %>：用于包含JavaScript代码，这些代码将在渲染数据时被执行。

<%= %>：用于输出数据，可以是一个变量、某个对象的属性、或函数调用（将输出函数的返回值）。

<%- %>：用于输出数据，同时会将数据中包含的HTML字符转换为实体形式（例如它会将双引号转换为&quot;形式），用于避免XSS攻击。

</script>	
```

2-0 **template**模板函数基础

```html
_.template(templateString, [settings]) 
将 JavaScript 模板编译为可以用于页面呈现的函数, 对于通过JSON数据源生成复杂的HTML并呈现出来的操作非常有用。 模板函数可以使用 <%= … %>插入变量, 也可以用<% … %>执行任意的 JavaScript 代码。 如果您希望插入一个值, 并让其进行HTML转义,请使用<%- … %>。 当你要给模板函数赋值的时候，可以传递一个含有与模板对应属性的data对象 。 如果您要写一个一次性的, 您可以传对象 data 作为第二个参数给模板 template 来直接呈现, 这样页面会立即呈现而不是返回一个模板函数. 参数 settings 是一个哈希表包含任何可以覆盖的设置 _.templateSettings.

var compiled = _.template("hello: <%= name %>");
compiled({name: 'moe'});
=> "hello: moe"

var template = _.template("<b><%- value %></b>");
template({value: '<script>'});
=> "<b>&lt;script&gt;</b>"
您也可以在JavaScript代码中使用 print. 有时候这会比使用 <%= ... %> 更方便.

var compiled = _.template("<% print('Hello ' + epithet); %>");
compiled({epithet: "stooge"});
=> "Hello stooge"
```

2 -1模板解析

```html
<!-- 用于显示渲染后的标签 -->  
<ul id="element"></ul>  
 
<!-- 定义模板，将模板内容放到一个script标签中 -->  
<script type="text/template" id="tpl"> 
//注意type类型  "text/template"
    <% for(var i = 0; i < list.length; i++) { %>  
        <% var item = list[i] %>  
        <li>  
            <span><%=item.firstName%> <%=item.lastName%></span>  
            <span><%-item.city%></span>  
        </li>  
    <% } %>  
</script>  
<script type="text/javascript" src="underscore/underscore-min.js"></script>  
<script type="text/javascript">  
    // 获取渲染元素和模板内容  
    var element = $('#element'),  
        tpl = $('#tpl').html();  
 
    // 创建数据, 这些数据可能是你从服务器获取的  
    var data = {  
        list: [  
            {firstName: '<a href="#">Zhang</a>', lastName: 'San', city: 'Shanghai'},  
            {firstName: 'Li', lastName: 'Si', city: '<a href="#">Beijing</a>'},  
            {firstName: 'Wang', lastName: 'Wu', city: 'Guangzhou'},  
            {firstName: 'Zhao', lastName: 'Liu', city: 'Shenzhen'}  
        ]  
    }  
 
    // 解析模板, 返回解析后的内容  
    var html = _.template(tpl, data); 
//注意data 必须是javascript对象                                      
    // 将解析后的内容填充到渲染元素  
    element.html(html);  
</script>
```

在本例中，我们将模板内容放到一个<script>标签中，你可能已经注意到标签的type是text/template而不是text/javascript，因为它无法作为JavaScript脚本直接运行。

我也建议你将模板内容放在<script>中，因为如果你将它们写在一个<div>或其它标签中，它们可能会被添加到DOM树中进行解析（即使你隐藏了这个标签也无法避免）。

```html
1 将模板内容解析为可执行的JavaScript（解析模板标签）
2 通过with语句将解析后的JavaScript作用域修改为我们传递的数据对象，这使我们能够直接在模板中通过变量形式访问3 3 数据对象的属性执行解析后的JavaScript（将数据填充到模板）
4 返回执行后的结果
```

2 -2

```javascript
// 解析模板, 返回解析后的内容  
var render = _.template(tpl);
//用render函数解析数据
var html = render(data);  
element.html(html);
```

你会发现细微的差别：我们在调用template方法时只传递了模板内容，而没有传递数据，此时template方法会解析模板内容，生成解析后的可执行JavaScript代码，并返回一个函数，而函数体就是解析后的JavaScript，因此当我们调用该函数渲染数据时，就省去了模板解析的动作。

你应该将返回的函数存储起来（就像我将它存储在render变量中一样），再通过调用该函数来渲染数据，特别是在同一个模板可能会被多次渲染的情况下，这样做能提高执行效率（具体提升多少，应该根据你的模板长度和复杂度而定，但无论如何，这都是一个良好的习惯）

2 -3 another栗子

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <style>
        th,td{
            padding: 5px;
            border: 1px solid #ccc;
        }
    </style>
    <table>
        <thead>
            <tr>
                <th>序号</th>
                <th>名字</th>
                <th>年龄</th>
                <th>性别</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
<!--定义模版-->
<!-- 执行js代码  获取解析函数传入的数据 -->
<!-- 在 <% 写js代码 %> -->
<!-- 获取值显示在页面当中 <%=属性名称 %> -->
<script type="text/template" id="temp">
    <% $.each(list,function(index,item){ %>
    <!--model是传入的对象列表，第一个参数是索引，第二个参数是dom对象-->
        <tr>
            <td><%=index%></td>
            <td><%-item.name%></td>
            <td><%=item.age%></td>
            <td><%=item.sex%></td>
        </tr>
    <% }); %>
</script>
<script src="../lib/jquery/jquery.min.js"></script>
<script src="../lib/underscore/underscore-min.js"></script>
    <script>
        $(function(){
            var data = [
                {
                    name:'小明1',
                    age:18,
                    sex:'女'
                },
                {
                    name:'小明1',
                    age:18,
                    sex:'女'
                },           
            ];
            var templateStr = $('#temp').html();//不写内容代表获取对象中的内容，返回是一个字符
            // 将获取到的模板字符串转化成模板函数，模板函数可以多次调用
            var templateFuc = _.template(templateStr);
            var htmlStr = templateFuc({list:data});
          //键值对:  m  取值是  data  ,m 作为 值传入 模板函数，代表data这个数据
          // var HTMLStr = _.template(templateStr,{m:data})
            /*5.渲染到页面当中*/
//            将转化成的字符串渲染到页面中
            $('tbody').html(htmlStr);
        })
    </script>
</body>
</html>
```

