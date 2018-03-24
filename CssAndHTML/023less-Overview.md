---
title:less-OverView
---

* ​

```
//@import 导入选项

--@import 可以至于任何你需要导入的地方
在标准的CSS，@import在规则必须先于所有其他类型的规则。但Less.js不关心
example:
.test(){
    color:#ff6a00;
}
.study{
    .test;
}
@import "studyLess.css";

//output css
@import "studyLess.css";
.study {
  color: #ff6a00;
}

--@import 可以根据文件扩展名不同而用不同的方式处理
如果文件是.css的扩展名，将处理为CSS和@import语句保持原样。
如果为其他的扩展名将处理为less导入。
如果没有扩展名，将会为他添加.less扩展名，作为less导入。
example:
@import "foo";      // foo.less 导入为less文件
@import "foo.less"; // foo.less 导入为less文件
@import "foo.php";  // foo.php  导入为less文件
@import "foo.css";  // 语句保持原样，导入为css文件

以下选项可用于覆盖此行为。
语法：@import (keyword) "filename";
reference: 使用该less文件但是不输出它
inline: 包括在源文件中输出，但是不作处理
less: 将该文件视为less文件，无论其扩展名为什么
css: 将文件视为css文件，无论扩展名为什么
once: 该文件仅可导入一次 (默认)
multiple: 该文件可以多次导入
optional: 当没有发现文件时仍然编译

多个关键字 @import 是允许的，你必须使用逗号分隔关键字：
example: @import (optional, reference) "foo.less";
```