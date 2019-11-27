---

---

### 1 shell 中 字符串操作

通过下面的语法来学习字符串相关操作

```
${variable#pattern}         # 如果 pattern 匹配变量值的起始部分，删除匹配 pattern 的最短的部分，然后返回剩余的
${variable##pattern}        # 如果 pattern 匹配变量值的起始部分，删除匹配 pattern 的最长的部分，然后返回剩余的
${variable%pattern}         # 如果 pattern 匹配变量值的结束部分，删除匹配 pattern 的最短的部分，然后返回剩余的
${variable%%pattern}        # 如果 pattern 匹配变量值的结束部分，删除匹配 pattern 的最长的部分，然后返回剩余的
${variable/pattern/string}  # 把变量值中匹配 pattern 的最长的部分替换为 string，只替换第一个匹配的部分
${variable//pattern/string} # 把变量值中匹配 pattern 的最长的部分替换为 string，全局进行替换
${#varname}     # 返回变量值作为一个字符串的长度
```

```sh
var=http://www.glmapper.com
# # 号是运算符，*/ 表示从左边开始删除第一个 / 号及左边的所有字符,即删除 http://
echo ${var#*/} 
#   ==> /www.glmapper.com  可以理解为非贪婪匹配
echo ${var##*/} #  ==> www.glmapper.com   可以理解为贪婪匹配
echo ${var%/*} #  ==> http:/
echo ${var%%/*} # ==> http:
echo ${#var} # ==> 23  字符的长度
echo ${var:0-4} # .com 从右边开始第四个字符，一直到结束  0-4
echo ${var:0:4} # http 从左边第几个字符开始，以及字符的个数 0 表示开始 4 表示字符的个数；
echo ${var:5} # ==> //www.glmapper.com  从左边第五个字符开始一直到结束

```





[shell中的并发操作](https://blog.csdn.net/wzy_1988/article/details/8811153)

[bash-guide](https://github.com/vuuihc/bash-guide/blob/master/README.md)

[bash-handbook](https://github.com/denysdovhan/bash-handbook/blob/master/translations/zh-CN/README.md)

