---
title: jQuery serialize
date: 2016-07-22 12:36:00
categories: javascript jquery
tags : serialize
comments : true 
updated : 
layout : 
---

## jQuery  对象$("selector").serialize()方法的使用

1 表单元素:from 表单能够包含 [input 元素](tag_input.asp.htm)，比如文本字段、复选框、单选框、提交按钮等等。表单还可以包含 [menus](tag_menu.asp.htm)、[textarea](tag_textarea.asp.htm)、[fieldset](tag_fieldset.asp.htm)、[legend](tag_legend.asp.htm) 和 [label 元素](tag_label.asp.htm)。表单用于向服务器传输数据。

* input : type 类型 button checkbox file hidden image password radio reset submit text   。如果要表单元素的值包含到序列字符串中，元素必须使用 name 属性。**默认text类型** 
* textarea  必须属性 col row  该标签也有 name属性，也可以上传数据

2 select select 元素可创建单选或多选菜单。当提交表单时，浏览器会提交选定的项目，或者收集用逗号分隔的多个选项，将其合成一个单独的参数列表，并且在将 \<select> 表单数据提交给服务器时包括 name 属性。

| 属性                                      | 值        | 描述              | DTD  |
| --------------------------------------- | -------- | --------------- | ---- |
| [disabled](att_select_disabled.asp.htm) | disabled | 规定禁用该下拉列表。      | STF  |
| [multiple](att_select_multiple.asp.htm) | multiple | 规定可选择多个选项。      | STF  |
| [name](att_select_name.asp.htm)         | *name*   | 规定下拉列表的名称。      | STF  |
| [size](att_select_size.asp.htm)         | *number* | 规定下拉列表中可见选项的数目。 | STF  |

*  option 元素必须位于select元素内部,不能单独的使用，没有name属性

| 属性                                      | 值        | 描述                        | DTD  |
| --------------------------------------- | -------- | ------------------------- | ---- |
| [disabled](att_option_disabled.asp.htm) | disabled | 规定此选项应在首次加载时被禁用。          | STF  |
| [label](att_option_label.asp.htm)       | *text*   | 定义当使用 <optgroup> 时所使用的标注。 | STF  |
| [selected](att_option_selected.asp.htm) | selected | 规定选项（在首次显示在列表中时）表现为选中状态。  | STF  |
| [value](att_option_value.asp.htm)       | *text*   | 定义送往服务器的选项值。              | STF  |

3 首先理解jQuery ajax - serialize() 方法注意：只会将”成功的控件“序列化为**字符串** 。如果不使用按钮来提交表单，则不对提交按钮的值序列化。如果要表单元素的值包含到序列字符串中，元素必须使用 name 属性。 

什么是"成功的控件"？可以简单理解为   被选中的  表单元素 有name属性的表单元素；**注意name属性不能是js或者jQuery中的关键字，否则无法序列化 ；其实就是用户操作选中的那些控件内容会被序列化；

```html
input 	type = text password hidden 可以直接被选中序列化为字符串
        type = checkbox  radio  只有当check="checked" 的时候才能被选中序列化为字符串
        type =  file button image 则不会被选中序列化为字符串
input   元素有name 属性，发往服务器的是input元素的name属性值  和 input元素的 value 值
select  元素有name 属性，发往服务器的数据是select的name属性值和 其子元素的option元素的 value值;注意不是option标签包裹的内容 <option value="man">男</option>  上传到服务器的是   man ;
```

```html
textarea 元素有name 属性，发往服务器的数据是textarea的name属性值和textarea元素的内容；
```

### 如果要表单元素的值包含到序列字符串中，元素必须使用 name 属性。否则无法序列化该元素的值；

序列化的"键值对"是   

*  对于input  select 元素是 name 属性 的值 和  value 属性的值；如果value属性也有值，那么就提交value属性的值，如果没有value属性，或者value属性值为空字符串，则序列化的结果没有value值，如果value值是一个空的字符串，那么序列化的结果是一个  +  字符。
*  对于textarea 元素是textarea元素的 name属性值  和内容值

4 明白以上的内容，具体到serialize()的用法,是对所有选中的表单元素进行序列化；序列化表单值的作用是将表单中的值拼装成字符串形式的key-value键值对提交给后台服务器程序解析，来获取用户的输入值

*  定义:serialize()方法通过序列化表单值，创建标准的URL编码文本**字符串** ，它的操作对象是代表表单元素集合的**jQuery 对象**.你可以选择一个或多个表单元素（比如input或文本框），或者 form 元素本身。序列化的值可在生成 AJAX 请求时用于 URL 查询字符串中，然后发送到服务器。
*  我们可以单独的获取某个表单元素的序列化的值，$("input").serialize(),序列化所有的input元素，\$("input:password").serialize(),序列化password ; \$("form").serialize()  序列化 form；

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="jquery-1.12.2.js"></script>
    <title>serializeArray()与serialize()</title>
    <script type="text/javascript">
        function onClik(){
            $("#results").html("serializeArray()与serialize()的区别如下：");
            var data1 = $("#form1").serializeArray(); //自动将form表单封装成json
            $("#results").append("<br/><b>serializeArray:</b>");
            $.each(data1, function(i, field){
                $("#results").append(field.name+":"+field.value+" ");
            });
            $("#results").append("<br/>");
            var data2 = $("#form1").serialize(); //自动将form表单封装成json
            $("#results").append("<b>serialize():</b>"+data2);
        }
    </script>
</head>
<body>
<form id="form1" name="form1" method="post" action="">
    <p>进货人 :
        <label for="name"></label>
        <input type="text" name="name" id="name" />
      <!--没有value值，结果为空-->
    </p>
    <p>性别:
        <label for="sex"></label>
        <select name="sex" size="1" id="sex">
            <!--select有name属性，会序列化选中的option 。这里是第一个option-->
            <option value="man">男</option>
            <option value="女">女</option>
        </select>
        <select name="sex" size="1" id="sex">
            <!--select有name属性，会序列化选中的option 。这里是第二个option-->
            <option value="man">男</option>
            <option value="woman" selected="selected">女</option>
        </select>
        <select>
            <!--select没有name属性，则不会被序列化-->
            <option value ="volvo">Volvo</option>
            <option value ="saab">Saab</option>
            <option value="opel">Opel</option>
            <option value="audi">Audi</option>
        </select>
        <textarea name="txt" id="" cols="30" rows="10">
             这是text
            <!--注意这里面有空格，会被序列化为+-->
        </textarea>
    </p>
    <table width="708" border="1">
        <tr>
            <td width="185">商品名</td>
            <td width="205">商品数量</td>
            <td width="296">商品价格</td>
        </tr>
        <tr>
            <td><label for="pro_name"></label>
                <input type="text" name="pro_name" id="pro_name" /></td>
          <!--没有value值，结果是 pro_name=  -->
            <td><label for="pro_num"></label>
                <input type="text" name="pro_num" id="pro_num" /></td>
            <td><label for="pro_price"></label>
                <input type="text" name="pro_price" id="pro_price" /></td>
            <input type="password" name=""  value="123"/></td>
            <input type="hidden" name="hid"  value="hid" /></td>
            <input type="file" name="fil"  value="filess" /></td>
            <input type="checkbox" name="ck"  value="ckk" checked="checked" /></td>ck
            <input type="checkbox" name="ck"  value="ckk2"  /></td>ck2
		   <input type="radio" name="ra"  value="raa" checked="checked" /></td>ra
            <input type="radio" name="ra2"  value="raa2"  /></td>ra2
			   <!--没有被选中，不会序列化，  -->
        </tr>
        <tr>
            <td><input type="text" name="pro_name2" id="pro_name2" value=" " /></td>
            <!--注意此时的value属性值是一个  空格 序列化为 + -->
            <td><input type="text" name="pro_num2" id="pro_num2"  value=""/></td>
            <!--这个地方的value属性值是  空字符串 -->
            <td><input type="text" name="pro_price2" id="pro_price2" /></td>
        </tr>
    </table>
    <p id="results"></p>
    <input type="button" name="submit" onclick="onClik();" value="提交"/>
</form>
</body>
</html>
<!--serializeArray()与serialize()的区别如下：-->
<!--serializeArray:name: sex:man sex:woman txt: 这是text ck:ckk ra:raa pro_name: pro_num: pro_price: hid:hid pro_name2: pro_num2: pro_price2:-->
<!--serialize():name=&sex=man&sex=woman&txt=+++++++++++++%E8%BF%99%E6%98%AFtext%3C!&#45;&#45;%E6%B3%A8%E6%84%8F%E8%BF%99%E9%87%8C%E9%9D%A2%E6%9C%89%E7%A9%BA%E6%A0%BC%EF%BC%8C%E4%BC%9A%E8%A2%AB%E5%BA%8F%E5%88%97%E5%8C%96%E4%B8%BA%2B&#45;&#45;%3E%0D%0A++++++++&ck=ckk&ra=raa&pro_name=&pro_num=&pro_price=&hid=hid&pro_name2=+&pro_num2=&pro_price2=-->
```

$.param()方法是serialize()方法的核心，用来对一个数组或对象按照key/value进行序列化。

```javascript
param: function( a ) {
        ///    <summary>
        ///        This method is internal.  Use serialize() instead.
        ///    </summary>
        ///    <param name="a" type="Map">A map of key/value pairs to serialize into a string.</param>'
        ///    <returns type="String" />
        ///    <private />
    
        var s = [ ];

        function add( key, value ){
            s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        };

        // If an array was passed in, assume that it is an array
        // of form elements
        if ( jQuery.isArray(a) || a.jquery )
            // Serialize the form elements
            jQuery.each( a, function(){
                add( this.name, this.value );
            });

        // Otherwise, assume that it's an object of key/value pairs
        else
            // Serialize the key/values
            for ( var j in a )
                // If the value is an array then the key names need to be repeated
                if ( jQuery.isArray(a[j]) )
                    jQuery.each( a[j], function(){
                        add( j, this );
                    });
                else
                    add( j, jQuery.isFunction(a[j]) ? a[j]() : a[j] );

        // Return the resulting serialization
        return s.join("&").replace(/%20/g, "+");
    }
```



5 如何 解决空字符串转化为 +  号 的问题？



