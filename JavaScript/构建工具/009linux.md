---
title: linux
---

* 查看当前mac下JDK

```
打开终端：/usr/libexec/java_home -V（V必须大写）

1.8.0_131, x86_64:	"Java SE 8"	/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home
/Library/Java/JavaVirtualMachines/jdk1.8.0_131.jdk/Contents/Home

以上输出分别表示：输入命令； 当前Mac已安装jdk目录； Mac默认使用的jdk版本；
```

* ls  列出当前目录

```
-a ：全部的文件，连同隐藏档( 开头为 . 的文件) 一起列出来(常用)   ls -a
-d ：仅列出目录本身，而不是列出目录内的文件数据(常用)           ls-d
-l ：长数据串列出，包含文件的属性与权限等等数据；(常用)			ls-l

```

* Linux系统中使用以下命令来查看文件的内容：

```
- cat  由第一行开始显示文件内容
- tac  从最后一行开始显示，可以看出 tac 是 cat 的倒著写！
- nl   显示的时候，顺道输出行号！
- more 一页一页的显示文件内容
- less 与 more 类似，但是比 more 更好的是，他可以往前翻页！
- head 只看头几行
- tail 只看尾巴几行
```

* Linux系统中编辑文件内容. 

```
touch filename 可以用来创建一个文件名
命令模式   <—ESC————i a s —>输入模式     
命令模式   <-ESC ———— : > 底线命令模式 
```

