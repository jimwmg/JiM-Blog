---
title: select 值提交选择哪一个？ 
date: 2016-03-11 12:36:00
categories: javascript
tags: form
comments : true 
updated : 
layout : 
---

### select 的值选择的哪一个？

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <style>
        div{
            height: 20px;
            overflow: hidden;
        }
    </style>
</head>
<body>
<select name="car" id="carId">汽车

        <option value="">福特</option>
        <option value="fort1">福特1</option>
        <option value="fort2">福特2</option>
        <option >福特3</option>
        <option value="">福特4</option>
        <option value="fort5">福特5</option>
        <option value="fort6">福特6</option>
        <option value="fort7">福特7</option>
        <option value="fort8">福特8</option>
        <option value="fort9">福特9</option>
        <option value="fort10">福特10</option>

</select>
<script>
    var selectObj = document.querySelector("select");
    selectObj.onchange = function(){
        console.log(this.value);//选择中哪个，则输出哪个option对应的value值
       
    };
</script>
</body>
</html>
```

每次改变选择的值的时候，都会输出  select 的value值，那么这个value的值到底指的是哪一个？

这里总结如下：

*  如果option标签有value属性，那么当选中该option选项的时候，select的value值就是option标签的value属性的值；如果value属性值为为空字符串，那么就是空字符串
*  如果option标签没有value属性，那么当选中该option选项的时候，select的value值就是option标签的文本节点的值；
*  对于select的value取值 :  option标签的value属性值优先于option标签的文本节点的值