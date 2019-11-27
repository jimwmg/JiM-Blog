---

---

来源：https://www.runoob.com/w3cnote/shell-special-char.html

### ；分号

连续运行命令

```
# ifdown eth0;ifup eth0
```

### | 管道

正则表达式中表示或者

```
# echo "ooooee" |egrep '(oo|ee)'{2}   表示匹配 oooo 或者 eeee 的字符
```

前面命令的标准输出作为后面命令的标准输入

```
# ifconfig|grep eth0     表示ifconfig查出来的信息然后过滤出eth0的这一行
```

### &

将命令放到后台执行

```
# mysqld_safe --user=mysql &        将MySQL放到后台启动
```

表示标准输出和标准错误输出

```
# ifconfig &>/dev/null   将ifconfig执行得到的结果输出到/dev/null里面
```

### &&

前面命令返回值为0才执行后面的命令

```
# ls && echo "ok"  
```

### ||

前面命令返回值为非0才执行后面的命令

```
# lls || echo "ok" 
```

### # 井号

**#** 表示注释

**$#** 表示位置参数的个数

```
# echo $#
0
```

**${#变量名}** 表示变量的长度

```
# a='hello'
# echo ${#a}
5
```

**${#变量名[@]}** 表示数组的个数

```
# a=(1 2 3)
# echo ${#a[@]}
3
```

### ！惊叹号

将命令或者条件表达式的返回值取反

```
# if ! [ 1<2 ]; then echo 'ok'; else echo 'no'; fi
ok
```

执行历史命令

```
# history 
1  ls
2  tail test1.txt
3  mysql -uroot -p123
4  ls /tmp/
5  cd /tmp/
[root@localhost ~]# !994
ls /tmp/
account.sql  data.sql  mysql.sock  t1.txt  t2.txt 
```

vi或者ftp中执行外部shell命令

例如：在vim中，想要执行一条命令，就在末行模式，输入！感叹号后面加上要执行的命令

间接应用变量

例如：${!a} ---- 间接取b 的值

### $ 美元符号

取变量的值

```
# a=10
# echo $a
10
```

正则表达式表示行尾

```
egrep ':$' /etc/inittab 
egrep ‘^hello$'  file
```

### > 大于号

输出重定向,会覆盖掉原有的内容

```
echo '123' >test.txt       表示将123 输入到文件test.txt中
echo '123' >test1.txt >test2.txt  将输出重定向到这两个文件中
```

条件测试中的大于号

对于输出重定向，我们要理解shell中的基本原理

在shell中，每个进程都和三个系统文件 相关联：标准输入stdin，标准输出stdout、标准错误stderr，三个系统文件的文件描述符分别为0，1、2。

也就是说，如果我们执行一个脚本，那么这个脚本的 标准输入  标准输出 标准错误都是在终端进行的；比如 vim 编辑器这些是输入，脚本执行的过程中的输出就是标准输出，比如echo  date  等，脚本执行过程中的报错是 标准错误；

假如有个脚本 `command.sh`内容如下

t 是一个不存在的命令，执行之后会报错，错误会输出到 stderr

echo 则能正确执行，默认输出到 stdout

```sh
t
echo 'this is stdout'
```

直接执行这个脚本

`sh command.sh` 输出如下：

```
command.sh: line 1: t: command not found
this is stdout
```

`sh command.sh > command.log`  输出默认 stdout 1 ；等价于 `sh command.sh 1>command.log `输出如下

```
command.sh: line 1: t: command not found
```

而 正确执行的命令会被生成一个文件  `command.log` 内容如下

```
this is stdout
```

`sh command.sh > command1.log >command2.log`  等价于` sh command.sh 1> command1.log 1>command2.log`

会生成两个文件 command1.log  command2.log;内容都是 `this is stdout`

终端依然输出 `command.sh: line 1: t: command not found`

sh command.sh > command.log  2>err.log 

此时发现终端也没有输出了，因为它的输出被重定向到 err.log,打开 err.log

`err.log` 内容如下：

```
command.sh: line 1: t: command not found
```

& 表示标准输出和标准错误输出; 

`sh command.sh &>all.log`

终端没有输出，所有的输出都在 all.log 中

`all.log`

```
command.sh: line 1: t: command not found
this is stdout
```

`sh command.sh 1>1.log 2>&1` 也可以理解为等同于,这个命令表示 2 重定向输出的位置和 1 重定向输出的位置一样；

`1.log`

```
command.sh: line 1: t: command not found
this is stdout
```



### <小于号

输入重定向

条件测试中的小于号

### = 等号

**变量赋值** - 例如：设置变量a=10

**条件测试中的等号** - 例如：[ a=b ] 判断变量a是否等于b

**数值比较 ==** - 例如：(( a==20 )) 判断变量a是否等于20

### + 加号

算术运算中的加号 - 例如：1+3

正则表达式中1个或多个前面的字符 - 例如：ab+c 表示匹配ab和c之间有1个或者多个 字符

### >>

**输出重定向追加** - 例如：echo "123" >> test.txt 将123追加到文件test.txt中

### <<

here document

例如：

```
# passwd <<end
> 123
> 123
> end
```

更改用户 root 的密码 。

### - 减号

算术运算中的减号 - 例如：10-2

命令的选项 - 例如：ls -l

上一次工作目录 - 例如：cd -

通配符和正则表达式中表示范围 - 例如：[a-z]

```
tar -cvf - /home | tar -xvf - 
```

表示输出流或输入流

将前面的输出 ，通过管道交给后面的命令，前面的压缩，后面的解压

### '' 单引号

解决变量赋值空格的问题

例如：a='1 2'

阻止shell替换

### "" 双引号

解决变量赋值空格的问题

例如：a="1 2"

阻止shell部分字符替换，对$、！等无效

### `` 反引号 相当于 $()

命令行替换

例如：可以设变量a=`ls`

### % 百分号

算术运算中的模运算

例如：echo $((100%10)) 就是100除以10的余数为0

vi中替换操作中表示所有行 （末行模式下，替换所有前面加 %）

例如：在末行模式下输入 :% s/D/d 表示将文本中的所有的D替换为d

### () 单圆括号

子shell中执行命令，会继承父shell的变量

括起数组元素

例如：定义一个数组 **a=(1 2 3 4)**

### (()) 双圆括号

算术运算

例如：**echo $((10/2))** 结果就是5

整数比较测试

例如：**(( 10>2 ))** 判断10是否大于2

### [] 单方括号

通配符和正则中表示匹配括号中的任意一个字符

例如：**[abc]** 表示匹配abc中的任意一个字符

条件测试表达式

例如： **[ -f /etc/passwd ]** // 测试是不是文件

数组中下标括号

例如：**echo ${a[0]}** 表示取数组中下标为0的值

### [[]] 双方括号

字符串比较测试

例如：[[a=b]] 用来字符串的比较

### . 英文句点号

正则中表示任意1个字符

例如：a...b 表示 匹配 a和b之间夹三个字符的字符串

当前shell执行脚本命令

例如：./test.sh 执行当前路径下的shell脚本test.sh

表示当前目录

例如：cd ./bgk 进入当前目录下的bgk目录下

### {} 大括号

通配符扩展 abc{1,2,3}

正则表达式中表示范围

例如：a{3} 匹配3个 a

for i in {1...10} 循环指定范围

匿名函数{ cmd1；cmd2；cmd3；} &> /dev/null

{ } 里面的命令，是在当前shell执行

注意：{ } 第一条命令前面要有空格，后面的命令要有分号

括起变量名 **${abc}a**

### / 正斜杠

算术运算中的除法

例如：**echo $((10/2))** 结果就是5

根目录或路径分割符

例如：**cd /usr/local/** 表示路径

### ^

在通配符中表示取反

例如：**[^abc]** 表示匹配除了abc外的任意一个字符

在正则表达式中表示以什么开头

例如：

```
egrep ‘^hello$'  file
```



| Sr.No. |                    Variable & Description                    |
| :----: | :----------------------------------------------------------: |
|   1    |          **$0**The filename of the current script.           |
|   2    | **$n**These variables correspond to the arguments with which a script was invoked. Here **n** is a positive decimal number corresponding to the position of an argument (the first argument is $1, the second argument is $2, and so on). |
|   3    |     **$#**The number of arguments supplied to a script.      |
|   4    | **$\***All the arguments are double quoted. If a script receives two arguments, $* is equivalent to $1 $2. |
|   5    | **$@**All the arguments are individually double quoted. If a script receives two arguments, $@ is equivalent to $1 $2. |
|   6    |     **$?**The exit status of the last command executed.      |
|   7    | **$$**The process number of the current shell. For shell scripts, this is the process ID under which they are executing. |
|   8    |   **$!**The process number of the last background command.   |







[linux命令查找](https://wangchujiang.com/linux-command/c/type.html)