---
titile:执行shell命令方式总结
---

### 0.执行shell命令方式

一般有三种

```
sh filename         : sh build.sh
source filename     : source build.sh
./filename            ：./build.sh
```

注意：如果直接通过 `./filename`无法执行，`line 5: ./xxx.sh: Permission denied,`;可以通过 `chmod +x ./filename` 设置权限;

三者的区别和联系：

1.当shell脚本具有可执行权限时，用 sh filename与 ./filename 执行脚本是没有区别得。./filename是因为当前目录没有在PATH中，所有"."是用来表示当前目录的。
 2.sh filename 重新建立一个子shell，在子shell中执行脚本里面的语句，该子shell继承父shell的环境变量，但子shell新建的、改变的变量不会被带回父shell，除非使用export。
 3.source filename：这个命令其实只是简单地读取脚本里面的语句依次在当前shell里面执行，没有建立新的子shell。那么脚本里面所有新建、改变变量的语句都会保存在当前shell里面。

### 1.shell中的变量类型

- **Local Variables** − A local variable is a variable that is present within the current instance of the shell. It is not available to programs that are started by the shell. They are set at the command prompt.
- **Environment Variables** − An environment variable is available to any child process of the shell. Some programs need environment variables in order to function correctly. Usually, a shell script defines only those environment variables that are needed by the programs that it runs.
- **Shell Variables** − A shell variable is a special variable that is set by the shell and is required by the shell in order to function correctly. Some of these variables are environment variables whereas others are local variables.

| Sr.No. |                    Variable & Description                    |
| :----: | :----------------------------------------------------------: |
|   1    | **DISPLAY**Contains the identifier for the display that **X11** programs should use by default. |
|   2    | **HOME**Indicates the home directory of the current user: the default argument for the cd **built-in** command. |
|   3    | **IFS**Indicates the **Internal Field Separator** that is used by the parser for word splitting after expansion. |
|   4    | **LANG**LANG expands to the default system locale; LC_ALL can be used to override this. For example, if its value is **pt_BR**, then the language is set to (Brazilian) Portuguese and the locale to Brazil. |
|   5    | **LD_LIBRARY_PATH**A Unix system with a dynamic linker, contains a colonseparated list of directories that the dynamic linker should search for shared objects when building a process image after exec, before searching in any other directories. |
|   6    | **PATH**Indicates the search path for commands. It is a colon-separated list of directories in which the shell looks for commands. |
|   7    | **PWD**Indicates the current working directory as set by the cd command. |
|   8    | **RANDOM**Generates a random integer between 0 and 32,767 each time it is referenced. |
|   9    | **SHLVL**Increments by one each time an instance of bash is started. This variable is useful for determining whether the built-in exit command ends the current session. |
|   10   |             **TERM**Refers to the display type.              |
|   11   | **TZ**Refers to Time zone. It can take values like GMT, AST, etc. |
|   12   | **UID**Expands to the numeric user ID of the current user, initialized at the shell startup. |

Following is the sample example showing few environment variables −

```
$ echo $HOME
/root
]$ echo $DISPLAY

$ echo $TERM
xterm
$ echo $PATH
/usr/local/bin:/bin:/usr/bin:/home/amrood/bin:/usr/local/bin
$
```

总结来说就是局部变量、环境变量、以及shell变量

局部变量

```bash
LOCALVARIABLE="variable1"
```

环境变量

PATH 环境变量中存放的是：执行文件命令搜索路径。终端的命令程序都是从这里的路径中开始查找的。

```
终端输入 env  可以查看所有的 shell 环境变量
PATH：决定了shell将到哪些目录中寻找命令或程序
HOME：当前用户主目录
MAIL：是指当前用户的邮件存放目录。
SHELL：是指当前用户用的是哪种Shell。
HISTSIZE：是指保存历史命令记录的条数
LOGNAME：是指当前用户的登录名。
HOSTNAME：是指主机的名称，许多应用程序如果要用到主机名的话，通常是从这个环境变量中来取得的。
LANG/LANGUGE：是和语言相关的环境变量，使用多种语言的用户可以修改此环境变量。
PS1：是基本提示符，对于root用户是#，对于普通用户是$。
PS2：是附属提示符，默认是“>”。可以通过修改此环境变量来修改当前的命令符，比如下列命令会将提示符修改成字符串“Hello,My NewPrompt :) ”。
# PS1=" Hello,My NewPrompt :) "
————————————————

```

shell变量可以通过 `export` 进行定义

### 2.使用案例

#### source:这个命令其实只是简单地读取脚本里面的语句依次在当前shell里面执行，没有建立新的子shell。那么脚本里面所有新建、改变变量的语句都会保存在当前shell里面。

简单理解就是只有一个shell环境，所以所有的变量都是互通的。

parent.sh

```sh
PARENT="this is PARENT"
source ./child-shell.sh
echo $myfile
```

child-shell.sh

```sh
echo $PARENT
myfile="child-shell"
```

输出：

```
this is PARENT
child-shell
```

#### sh filename : 这个每次执行都是创建了一个新的shell,父shell和子shell之间的变量都是互相隔离的

- 不用export定义的变量只对该shell有效，对子shell也是无效的。
- 一个shell中的系统环境变量只对该shell或者它的子shell有效，该shell结束时变量消失 （并不能返回到父shell中）
- 没有被export导出的变量（即非环境变量）是不能被子shell继承的

比如将上例子改为  sh 执行 `child-shell.sh`

parent.sh

```sh
PARENT="this is PARENT"
sh ./child-shell.sh
echo $myfile
```

child-shell.sh

```sh
echo $PARENT
myfile="child-shell"
```

输出为空

shell 环境变量可以通过 export 进行定义 

parent.sh

```sh
# 新增导出
export PARENT="this is PARENT"
source ./child-shell.sh
echo $myfile
```

child-shell.sh

```sh
echo $PARENT
myfile="child-shell"
# 新增导出
export myfile
```

### 3 参考命令

#### chmod

用来变更文件或目录的权限

概要

```shell
chmod [OPTION]... MODE[,MODE]... FILE...
chmod [OPTION]... OCTAL-MODE FILE...
chmod [OPTION]... --reference=RFILE FILE...
```

主要用途

- 通过符号组合的方式更改目标文件或目录的权限。
- 通过八进制数的方式更改目标文件或目录的权限。
- 通过参考文件的权限来更改目标文件或目录的权限。

参数

mode：八进制数或符号组合。

file：指定要更改权限的一到多个文件。

选项

```shell
-c, --changes：当文件的权限更改时输出操作信息。
--no-preserve-root：不将'/'特殊化处理，默认选项。
--preserve-root：不能在根目录下递归操作。
-f, --silent, --quiet：抑制多数错误消息的输出。
-v, --verbose：无论文件是否更改了权限，一律输出操作信息。
--reference=RFILE：使用参考文件或参考目录RFILE的权限来设置目标文件或目录的权限。
-R, --recursive：对目录以及目录下的文件递归执行更改权限操作。
--help：显示帮助信息并退出。
--version：显示版本信息并退出。
```

返回值

返回状态为成功除非给出了非法选项或非法参数。

例子

> 参考`man chmod`文档的`DESCRIPTION`段落得知：
>
> - `u`符号代表当前用户。
> - `g`符号代表和当前用户在同一个组的用户，以下简称组用户。
> - `o`符号代表其他用户。
> - `a`符号代表所有用户。
> - `r`符号代表读权限以及八进制数`4`。
> - `w`符号代表写权限以及八进制数`2`。
> - `x`符号代表执行权限以及八进制数`1`。
> - `X`符号代表如果目标文件是可执行文件或目录，可给其设置可执行权限。
> - `s`符号代表设置权限suid和sgid，使用权限组合`u+s`设定文件的用户的ID位，`g+s`设置组用户ID位。
> - `t`符号代表只有目录或文件的所有者才可以删除目录下的文件。
> - `+`符号代表添加目标用户相应的权限。
> - `-`符号代表删除目标用户相应的权限。
> - `=`符号代表添加目标用户相应的权限，删除未提到的权限。

```shell
linux文件的用户权限说明：

# 查看当前目录（包含隐藏文件）的长格式。
ls -la
  -rw-r--r--   1 user  staff   651 Oct 12 12:53 .gitmodules

# 第1位如果是d则代表目录，是-则代表普通文件。
# 更多详情请参阅info coreutils 'ls invocation'（ls命令的info文档）的'-l'选项部分。
# 第2到4位代表当前用户的权限。
# 第5到7位代表组用户的权限。
# 第8到10位代表其他用户的权限。
# 添加组用户的写权限。
chmod g+w ./test.log
# 删除其他用户的所有权限。
chmod o= ./test.log
# 使得所有用户都没有写权限。
chmod a-w ./test.log
# 当前用户具有所有权限，组用户有读写权限，其他用户只有读权限。
chmod u=rwx, g=rw, o=r ./test.log
# 等价的八进制数表示：
chmod 754 ./test.log
# 将目录以及目录下的文件都设置为所有用户拥有读写权限。
# 注意，使用'-R'选项一定要保留当前用户的执行和读取权限，否则会报错！
chmod -R a=rw ./testdir/
# 根据其他文件的权限设置文件权限。
chmod --reference=./1.log  ./test.log
```

注意

1. 该命令是`GNU coreutils`包中的命令，相关的帮助信息请查看`man chmod`或`info coreutils 'chmod invocation'`。
2. 符号连接的权限无法变更，如果用户对符号连接修改权限，其改变会作用在被连接的原始文件。
3. 使用`-R`选项一定要保留当前用户的执行和读取权限，否则会报错！

#### export

export

为shell变量或函数设置导出属性。

概要

```
export [-fn] [name[=word]]...
export -p
```

主要用途

- 定义一到多个变量并设置导出属性。
- 修改一到多个变量的值并设置导出属性。
- 删除一到多个变量的导出属性。
- 显示全部拥有导出属性的变量。
- 为一到多个已定义函数新增导出属性。
- 删除一到多个函数的导出属性。
- 显示全部拥有导出属性的函数。

选项

```shell
-f：指向函数。
-n：删除变量的导出属性。
-p：显示全部拥有导出属性的变量。
-pf：显示全部拥有导出属性的函数。
-nf：删除函数的导出属性。
--：在它之后的选项无效。
```

参数

name（可选）：变量名或已定义函数名。

value（可选）：变量的值。

返回值

export返回true除非你提供了非法选项或非法名称。

例子

```shell
# 显示全部拥有导出属性的变量。
# export -p
# export
# 显示全部拥有导出属性的函数。
# export -pf
# 首先删除要演示的变量名
#unset a b
# 定义变量的同时增加导出属性
export a b=3
# 当然也可以先定义后增加导出属性
b=3
export b

# 修改拥有导出属性的变量的值
export a=5 b=7
# 当然也可以直接赋值修改
a=5;b=7

# 删除变量的导出属性
export -n a b
# 首先删除要演示的函数名
unset func_1 func_2
# 创建函数
function func_1(){ echo '123'; }
function func_2(){ echo '890'; }

# 为已定义函数增加导出属性
export -f func_1 func_2

# 删除函数的导出属性
export -fn a b
# 添加环境变量（JAVA）到`~/.bashrc`
PATH=/usr/local/jdk1.7.0/bin:$PATH
# 添加当前位置到动态库环境变量
export LD_LIBRARY_PATH=$(pwd):${LD_LIBRARY_PATH}
```

错误用法

- 对未定义的函数添加导出属性。
- 对没有导出属性的函数/变量执行删除导出属性操作。
- 在 `--` 后使用选项。

Q&A

#### Q：对变量或函数设置导出属性有什么用？

A：它们会成为环境变量，可以在脚本中访问它们，尤其是脚本中调用的子进程需要时。（ **[参考链接4](https://askubuntu.com/questions/26318/environment-variable-vs-shell-variable-whats-the-difference)** ）

#### Q：如果我编写的脚本修改了已有的环境变量的值，那么执行它会在当前终端生效吗？会影响之前以及之后打开的终端吗？

A：只有通过`source`方式调用的脚本会生效，您可以查看`source`命令获得更多信息；其他方式只是在子shell中执行。 之前的不会影响，之后的除非是修改了`~/.bashrc`这种启动终端时加载的脚本。（ **[参考链接1](https://www.cnblogs.com/hongzg1982/articles/2101792.html)** ）

#### Q：我脚本文件中调用`~/.bashrc`中定义的函数和变量。为什么在新打开的终端中通过 `sh` 方式调用该脚本或直接运行

这个当前用户有执行权限的脚本却不能使用这些函数和变量？
A：请在`~/.bashrc`文件中增加export它们的语句。另请参阅 **知识点** 段落。

#### Q：数组和关联数组也可以设置导出属性吗？

A：是可以的（如果你的bash支持它们），不过有些问题（ **[参考链接2](https://stackoverflow.com/questions/5564418/exporting-an-array-in-bash-script)** ）。

#### Q：为什么我在查看变量或函数导出属性的时候显示的开头是`declare`？

A：因为`declare`也能够设置变量或函数的导出属性，详见`declare`命令。

### 注意

1. 该命令是bash内建命令，相关的帮助信息请查看`help`命令。

### 知识点

在`info bash`或 [bash在线文档](http://www.gnu.org/software/bash/manual/bash.html) 的 `3.7.3`节提到了shell执行环境，其中涉及变量和函数的内容如下

> - shell parameters that are set by variable assignment or with set or inherited from the shell’s parent in the environment
> - shell functions defined during execution or inherited from the shell’s parent in the environment

那么第一句话中的参数又和变量有什么关系呢？在`3.4`节第一段中提到：

> A variable is a parameter denoted by a name.

变量是有名字的参数。

那么子shell确实继承了父shell中带有导出属性的变量或函数。

可参考链接： [执行脚本方式的区别](https://blog.csdn.net/soaringlee_fighting/article/details/78759448)

参考链接

1. [关于bashrc profile文件的讨论](https://www.cnblogs.com/hongzg1982/articles/2101792.html)
2. [关于export数组的讨论](https://stackoverflow.com/questions/5564418/exporting-an-array-in-bash-script)
3. [export -pf用法](https://unix.stackexchange.com/questions/22796/can-i-export-functions-in-bash)
4. [环境变量和shell变量的区别](https://askubuntu.com/questions/26318/environment-variable-vs-shell-variable-whats-the-difference)

扩展阅读

一般来说，配置交叉编译工具链的时候需要指定编译工具的路径，此时就需要设置环境变量。查看已经存在的环境变量：

```shell
[root@localhost ~]# export
declare -x G_BROKEN_FILENAMES="1"
declare -x HISTSIZE="1000"
declare -x HOME="/root"
declare -x hostname="localhost"
declare -x INPUTRC="/etc/inputrc"
declare -x LANG="zh_CN.UTF-8"
declare -x LESSOPEN="|/usr/bin/lesspipe.sh %s"
declare -x logname="root"
declare -x LS_COLORS="no=00:fi=00:di=01;34:ln=01;36:pi=40;33:so=01;35:bd=40;33;01:cd=40;33;01:or=01;05;37;41:mi=01;05;37;41:ex=01;32:*.cmd=01;32:*.exe=01;32:*.com=01;32:*.btm=01;32:*.bat=01;32:*.sh=01;32:*.csh=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.gz=01;31:*.bz2=01;31:*.bz=01;31:*.tz=01;31:*.rpm=01;31:*.cpio=01;31:*.jpg=01;35:*.gif=01;35:*.bmp=01;35:*.xbm=01;35:*.xpm=01;35:*.png=01;35:*.tif=01;35:"
declare -x mail="/var/spool/mail/root"
declare -x OLDPWD
declare -x PATH="/usr/kerberos/sbin:/usr/kerberos/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin"
declare -x pwd="/root"
declare -x SHELL="/bin/bash"
declare -x SHLVL="1"
declare -x SSH_CLIENT="192.168.2.111 2705 22"
declare -x SSH_CONNECTION="192.168.2.111 2705 192.168.2.2 22"
declare -x SSH_TTY="/dev/pts/0"
declare -x TERM="linux"
declare -x USER="root"
```