---
title:shell 命令使用总结
---

## 基本操作

### export

展示所有的环境变量

### whatis  whereis

展示 `/usr/bin` 下某些命令的使用方式

```
whatis ls
whereis ls
```

### which 

在环境变量中搜索可执行文件，并打印变量；环境变量指的是 export 命令之后  PATH 字段，也可以通过 $PATH 快速访问

```
which node 
```

### clear 

清空终端



### pwd:

- print work directory 打印当前目录 显示出当前工作目录的绝对路径

**输出启动  sh 脚本所在的绝对目录路径；和 node 里面 process.cwd() 是一样的，在哪个目录下启动命令就代表哪个目录下的绝对路径；**

假如有个 sh 文件，目录结构如下

```
08ssh-learn
  ├── command.sh
```

command.sh

```sh'
pwd
```

在 ssh-learn 目录下执行  `sh command.sh`

输出

```
/Users/learn/learnSPace/08node/08sh-learn
```

在 ssh-learn 所在目录下执行 `sh 08ssh-learn/command.sh`

输出

```
/Users/learn/learnSPace/08node/
```

### cd

Linux cd命令用于切换当前工作目录至 dirName(目录参数)。

```sh
echo "$(pwd)"
cd './project'
echo "$(pwd)"
```

**需要注意一点 cd 的命令是以 pwd 这个路径为基准的**

这个 shell 的 pwd 是会被改变了的，但是 如果使用 `()`来执行 cd 命令，则不会影响当前 shell 的 pwd 路径，因为 `()`在执行命令的时候开了一个子 shell 执行的命令；

### dirname

输出已经去除了尾部的"/"字符部分的名称；如果名称中不包含"/"， 则显示"."(表示当前目录)。

```
echo $0
echo "$(dirname $0)"
echo "$(dirname /user/path/to/index.test)"
```

执行`sh /Users/learn/learnSPace/08node/08sh-learn/command.sh `

输出

```
/Users/learn/learnSPace/08node/08sh-learn/command.sh
/Users/learn/learnSPace/08node/08sh-learn
/user/path/to
```

```sh
echo "$(dirname /user/path/to/index.test)"
echo "$(dirname index.test)"
```

输出

```
/user/path/to
.
```

### basename

获取路径的 basename

### sleep 

- --help : 显示辅助讯息
- --version : 显示版本编号
- number : 时间长度，后面可接 s、m、h 或 d
- 其中 s 为秒，m 为 分钟，h 为小时，d 为日数

```
sleep 4
echo 'sleep done'
```

## **cut**

cut命令可以从一个文本文件或者文本流中提取文本列。

cut语法

```
[root@www ~]# cut -d'分隔字符' -f fields <==用于有特定分隔字符
[root@www ~]# cut -c 字符区间            <==用于排列整齐的信息
选项与参数：
-d  ：后面接分隔字符。与 -f 一起使用；
-f  ：依据 -d 的分隔字符将一段信息分割成为数段，用 -f 取出第几段的意思；
-c  ：以字符 (characters) 的单位取出固定字符区间；
```

## **wc**

统计文件里面有多少单词，多少行，多少字符。

wc语法

```
[root@www ~]# wc [-lwm]
选项与参数：
-l  ：仅列出行；
-w  ：仅列出多少字(英文单字)；
-m  ：多少字符；
```

### exit

退出shell 程序，在exit 之后可有选择的指定一个数位作为返回状态

### [read](https://www.runoob.com/linux/linux-comm-read.html)

```sh
read INPUT
echo "你的输入是：${INPUT}"
```

### .   

使bash读入指定的bash程序文件并依次执行文件中的所有语句。

### command

调用并执行指定的命令

补充说明

**command命令** 调用指定的指令并执行，命令执行时不查询shell函数。command命令只能够执行shell内部的命令。

POSIX compatible:

```sh
command -v <the_command>

```

```
command echo Linux            
```

For `bash` specific environments:

```sh
hash <the_command> # For regular commands. Or...
type <the_command> # To check built-ins and keywords
```

### set

作用主要是显示系统中已经存在的shell变量，以及设置shell变量的新变量值。使用set更改shell特性时，符号"+"和"-"的作用分别是打开和关闭指定的模式。set命令不能够定义新的shell变量。如果要定义新的变量，可以使用declare命令以`变量名=值`的格式进行定义即可。

```shell
-a：标示已修改的变量，以供输出至环境变量。
-b：使被中止的后台程序立刻回报执行状态。
-C：转向所产生的文件无法覆盖已存在的文件。
-d：Shell预设会用杂凑表记忆使用过的指令，以加速指令的执行。使用-d参数可取消。
-e：若指令传回值不等于0，则立即退出shell。
-f：取消使用通配符。
-h：自动记录函数的所在位置。
-H Shell：可利用"!"加<指令编号>的方式来执行history中记录的指令。
-k：指令所给的参数都会被视为此指令的环境变量。
-l：记录for循环的变量名称。
-m：使用监视模式。
-n：只读取指令，而不实际执行。
-p：启动优先顺序模式。
-P：启动-P参数后，执行指令时，会以实际的文件或目录来取代符号连接。
-t：执行完随后的指令，即退出shell。
-u：当执行时使用到未定义过的变量，则显示错误信息。
-v：显示shell所读取的输入值。
-x：执行指令后，会先显示该指令及所下的参数。
```

比如下面这段脚本， 当执行到 t 这个错误的命令的时候，就会直接退出 shell 的执行

```sh
set -e
FILENAME='./project'
echo FILENAME
t
echo "done"
```

输出如下

```
FILENAME
command.sh: line 8: t: command not found
```

注释掉 

```sh
# set -e
FILENAME='./project'
echo FILENAME
t
echo "done"
```

输出如下

```
FILENAME
command.sh: line 8: t: command not found
done
```



### wait 

[stackoverflow](https://stackoverflow.com/questions/13296863/difference-between-wait-and-sleep)

**wait命令** 用来等待指令的指令，直到其执行完毕后返回终端。该指令常用于shell脚本编程中，待指定的指令执行完成后，才会继续执行后面的任务。**该指令等待作业时，在作业标识号前必须添加备份号"%"**。

wait %1  等待作业号为 1 的任务完成后在返回；

`command.sh`

```sh
#!/bin/bash

START="$(date +%s)"
sleep 5 & # 这是第一个子任务
sleep 2 & # 这是第二个子任务
wait # 等待所有的子任务完成
#等待10秒后，退出
END="$(date +%s)"
TIME=`expr ${END} - ${START}`
echo "总耗时：${TIME} s"

```

`sh command.sh`   执行之后脚本之后,输出如下

```
总耗时：5 s
```

```sh
#!/bin/bash

START="$(date +%s)"
sleep 5 & # 这是第一个子任务 用 wait %1 表示 等待该命令的执行
sleep 2 & # 这是第二个子任务 用 wait %2 表示 等待该命令的执行
wait %2 # 等待所有的子任务完成
#等待10秒后，退出
END="$(date +%s)"
TIME=`expr ${END} - ${START}`
echo "总耗时：${TIME} s"
```

输出

```
总耗时：2 s
```

```sh
#!/bin/bash

START="$(date +%s)"
sleep 5 & # 这是第一个子任务 用 wait %1 表示 等待该命令的执行
sleep 2 & # 这是第二个子任务 用 wait %2 表示 等待该命令的执行
wait $! # $! 表示 The process number of the last background command. 
#等待10秒后，退出
END="$(date +%s)"
TIME=`expr ${END} - ${START}`
echo "总耗时：${TIME} s"
```



for 循环 里使用 `&` 将命令放于后台执行

```sh
echo "start==>$(date)"
LEN=3
for((i=1;i<4;i++))
do
{
  if [ $i -eq 2 ];then
    echo 'sleep1'
    echo `expr 2 \* ${i}`
    sleep `expr 2 \* ${i}`
  else
    echo 'sleep2'
    echo `expr 2 \* ${i}`
    sleep `expr 2 \* ${i}`
    # exit 1
  fi
} &
done

error_count=0

#等待每一个子进程的结束，记录子进程返回值的失败个数
for((i=1;i<4;i++))
do
{
    j=$(echo "$i" | bc -l)
    echo "this is j ${j}"
    echo %$j
    wait %$j
    # echo "===>$?"
    #子进程返回结果不为0 则记录error_count
    if [ "$?" -ne 0 ]; then
    ((++error_count))
    fi
}
done
echo "${error_count}"
if [ $error_count -ne 0 ]; then
    echo 'parallel release error'
    exit 1
fi

echo 'parallel release end'
echo "end==>$(date)"
```



## 文件管理

### awk

AWK是一种处理文本文件的语言，是一个强大的文本分析工具。

### cat 

cat 命令用于连接文件并打印到标准输出设备上。

**-n 或 --number**：由 1 开始对所有输出的行数编号。

**-b 或 --number-nonblank**：和 -n 相似，只不过对于空白行不编号。

**-s 或 --squeeze-blank**：当遇到有连续两行以上的空白行，就代换为一行的空白行。

**-v 或 --show-nonprinting**：使用 ^ 和 M- 符号，除了 LFD 和 TAB 之外。

**-E 或 --show-ends** : 在每行结束处显示 $。

**-T 或 --show-tabs**: 将 TAB 字符显示为 ^I。

**-A, --show-all**：等价于 -vET。

**-e：**等价于"-vE"选项；

**-t：**等价于"-vT"选项；

#### chmod

可以改变文件和目录的读、写、执行权限 [linux 中的用户、组、文件](https://github.com/OMGZui/bash-step-to-step/blob/master/linux-user-group-file.md)

#### cp

复制文件

### diff [diff](https://www.runoob.com/linux/linux-comm-diff.html)

比较文件内容

### rm

删除文件：-r  删除目录  -f 强制删除

### touch 

创建文件

### mv

移动文件

### mkdir 

创建目录

### rmdir

移除目录

### 

## bash 调试

```
选项与参数:
-n: 不要执行 script,仅查询语法的问题;
-v: 再执行 sccript 前,先将 scripts 的内容输出到屏幕上;
-x: 将使用到的 script 内容显示到屏幕上,这是很有用的参数!
```

```
sh -x command.sh
```







[linux命令大全参考](https://www.runoob.com/linux/linux-command-manual.html)

[linux命令查找](https://wangchujiang.com/linux-command/c/type.html)

[linux常用命令全拼](https://www.runoob.com/w3cnote/linux-command-full-fight.html)

