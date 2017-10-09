---
title: Git Cmd Command Enhence Memory
date: 2016-09-27 12:36:00
tags: 
categories: git
comments : true 
updated : 
layout : 
---

Bash 命令

* $ cd ../  可以进入上层目录
* $ cd ./目录名  可以进入下层目录
* $ cd mkdir  创建一个目录
* $ touch + 文件名 可以创建某个文件  \$ touch index / index.js / index.html etc
* $ cat + 文件名可以查看文件内容,工作区的文件内容；\$ cat index / index.js /index.html etc
* $ echo + content + > 文件  
  * $ echo hello you > index.html       //会清空之前的内容
  * $ echo good bye >> index.html    //新添加内容，不会
* $ cat index.html   可以查看文件
* $ less index.html  全屏查看文件
* $ tail -f  可以实时监看文件后面几行的内容变化
* q    全屏查看之后可以通过q退出
* $ rm index.html  (remove)可以删除文件
* $ vi  index.html   可以打开文件，直接进行编辑
* tab键可以自动补全
* |  管道操作符   
* ​

VI 命令模式

*  $ vi index.html  进入命令模式
*  之后
*  a  A    i   I  o   O  s可以进入编辑模式,可以直接编辑文件，esc可以退出编辑模式
*  退出(ESC)编辑模式之后进入命令模式，以下操作都在命令模式
*  ZZ  可以直接保存并退出当前文件
*  dd  可以直接删除当前行，还在命令模式
*  大写S  可以直接删除当前光标所在行，并直接进入编辑模式
*  大写C 可以直接删除当前光标后面的所有的字符，然后直接进入编辑模式
*  x  可以直接删除当前光标的后面一个字符串
*  gg  将光标移动到文件首部
*  p 直接复制一整行
*  u  后退上次编辑
*  h j k l  左下上右移动
*  : 0 定位光标至行首
*  : $ 定位光标至行尾
*  : q !  可以直接退出命令模式
*  : wq  可以直接退出命令模式


Git  命令

**工作区** ——>git add  将工作区的文件添加到   **暂存区**—— > git commit 将暂存区的文件添加到  **分支**

**git 版本库**(工作区有一个.git文件夹)管理的是所在目录的文件的**修改**， 而不是文件，也就是说，

当  文件修改 1  —— git add  将文件修改1提交到暂存区——再接着 文件修改2 —— git commit 提交到分支，这个时候提交的只有修改1 ，修改2 并未被提交到分支；

git add 命令实际上做的工作是提交的**文件的修改**到暂存区，不是提交的文件本身，这个对于git版本库管理工具理解至关重要；

git status 可以随时查看  工作区  暂存区 以及分支的状态

工作区**文件**的状态:未跟踪 untracked    已暂存staged    已提交 committed    已修改 modefied

*  $ git   用于检测是否安装了了git\

* $ mkdir learngit (Make Directory)   //创建一个新的目录

* \$ cd learngit (Change Directory)    //进入一个目录

* $ pwd(Print Working Directory)  //打印当前工作目录

* $ git init  命令可以将**该目录**变成git可以管理的仓库，初始化git仓库(initial:初始化)

* 创建一个文件   比如    “readme.txt" 创建文件之后，如果没有add命令，那么文件属于为被跟踪状态

* $ git add readme.txt   将创建的文件添加到仓库,或者将文件的修改提交到暂存区

* $ git commit -m " 文件说明"   将添加的文件的修改提交到仓库(commit:提交)

* $ git status  命令可以让我们时刻掌握仓库当前的状态，上面的命令告诉我们，readme.txt被修改过了，但还没有准备提交的修改。但是我们无法知道什么内容被修改了

* $ git diff   可以查看那些内容被修改了，被修改的一列最前面会有   +   号(difference:不同)

* $ git add readme.txt   再次添加给仓库，不要commit提交

* $ git add -A     表示将文件全部提交到仓库暂存区

* $ git add *  表示将工作区全部文件提交到暂存区

* $ git rm --cached  readme.txt 将提交到缓存区的文件移除

* $ git status  查看下状态

* $ git  commit -m "文档说明"   commit之后会在git仓库object文件夹下新建一个文件夹，保存了commit的信息

     版本退回

* $ git log   可以获取文档被修改的过程

* $ git log --pretty=oneline   可以让显示更加优雅

* $ git reset --hard HEAD^    其中  ^  代表回退到上一个版本，^^ 代表回退到倒数第二个版本，HEAD~100  回退到地一百个版本。工作区 暂存区 本地仓库都会改变

* $ git reset hard 4444   如果我们退回以后后悔了，又想回去怎么办？可以回到某个特定的版本，只需要知道某个版本号即可，部分内容，系统会自动去匹配

* $ git reset soft  只会改变历史HEAD指向

* $ git reflog  可以查看历史命令

* $ git ls  (list)   查看当前目录下的内容和 \$ ll 命令功能类似

* $ git branch 可以查看当前分支  

      branch     List, create, or delete branches

* $ git branch myMaster  可以添加一个myMaster分支 

* $ git branch  可以查看分支，有了新增的分支

* $ git checkout myMaster  可以切换到该分支

      checkout   Switch branches or restore working tree files

* $ git checkout -b myMaster **等价于**  \$ git branch myMaster  \$git checkout myMaster

* $ git branch -d  删除分支

* $ git branch -d myMaster ;

* $ git clone + 地址  可以直接从github上下载文件

* $ git push   可以将本地文件推送到服务器

* $ git stash 可以保存当前的工作内容

创建共享仓库

*  $ git init --bare    创建共享仓库
*  $ git push 远程仓库的地址 本地分支:远程分支
*  $ git push 远程仓库的地址 本地分支
*  $ git pull 远程仓库的地址 远程分支 : 本地分支
*  $ git pull 远程仓库的地址 远程分支 
*  $ git clone 远程仓库的地址 文件名称
*  $ git fecth  从远程仓库获取分支内容，但是不会合并分支
*  $ git merge  然后可以通过git merge进行合并

分支操作

* git branch myMaster  新建分支
* git branch -r  查看远程分支
* git branch -a 查看所有分支
* git branch -d 删除本地分支
* git push origin : 分支名称   删除远程仓库分支

  ​