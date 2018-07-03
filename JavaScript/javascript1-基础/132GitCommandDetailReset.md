---
title:  Git command detail Reset 
date: 2016-09-30 12:36:00
categories: git
comments : true 
updated : 
layout : 
---

1 撤销修改

git checkout -- index.html   

一种是readme.txt自修改后还没有被放到暂存区，现在，撤销修改就回到和版本库一模一样的状态；

一种是readme.txt已经添加到暂存区后，又作了修改，现在，撤销修改就回到添加到暂存区后的状态。

总之，就是让这个文件回到最近一次 git commit 或 git add 时的状态。

git reset HEAD index.html  

git reset 命令既可以回退版本，也可以把暂存区的修改回退到工作区；也就是说将添加到暂存区的修改退回到工作区；当我们用HEAD时，表示最新的版本。

再用git status查看一下，现在暂存区是干净的，工作区有修改：