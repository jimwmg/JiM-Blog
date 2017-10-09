---
title:  Git command detail Branch 
date: 2016-09-15 12:36:00
categories: git
comments : true
tags :  git  
updated : 
layout : 
---

在不同的分支上的内容是不一样的，切换到不同分支，工作区的文件内容也是不一样的

### 分支管理

*  创建与合并分支
*  git branch   可以查看当前分支状态，分支的个数 此时master一个分支
*  git checkout -b newBranch   新建一个分支 newBranch 
*  git branch   此时分支多了一个newBranch 
*  git add  index.html    将文件的变动添加到newBranch分支上
*  git commit -m'newBranch first'   新建分支第一次commit,新建分支线延长
*  git checkout master   回到master主分支
*  在newBranch分支上对文件做的改动并没有在master分支上的文件上显示
*  git merge newBranch   将新建的分支和主分支合并 
*  此时在新建的分支上做的变动会在之分支上显示出来

### 解决冲突 

*  echo  'content' >  index.html   可以向文件中写入内容，会先清空文件中的内容
*  echo  'content'  >>  index.html   可以向文件中添加内容，原来的内容不会被清空
*  git checkout -b newBranch2 
*  git add index.html  
*  git commit -m'commitNewBranch2'
*  以上操作在 newBranch2 将文件内容改动，commit一次
*  git checkout master 
*  git add index.html  
*  git commit -m'commitmaster2'
*  以上操作在master主分支将文件改动，commit一次
*  git merge newBranch2   此时合并会发生冲突，根本原因是master分支和newBrach2分支都提交了
*  注意这个时候必须先手动解决冲突，然后再次提交
*  在主分支上再次commit
*  git add index.html 
*  git commit -m' conflict fix'  
*  git log --graph --pretty=oneline --abbrev-commit  可以查看分支合并的状况

在分支合并之后可以选择将被合并的分支删除

* git branch -d newBranch   可以删除newBranch 分支

### 分支管理策略

通常，合并分支时，如果可能，Git会用Fast forward模式，但这种模式下，删除分支后，会丢掉分支信息。如果要强制禁用Fast forward模式，Git就会在merge时生成一个新的commit，这样，从分支历史上就可以看出分支信息。

合并分支时，加上--no-ff`参数就可以用普通模式合并，合并后的历史有分支，能看出来曾经做过合并，而`fast forward`合并就看不出来曾经做过合并

* git merge --on-ff -m'merge with --on-ff' dev   dev是一个新的分支，在这个新的分支上做改动

和远程仓库进行对接

* 本地master ——>push本地master ——>远程就有了master分支 ——> 本地新建分支teacher——> push本地teacher——>

merge之后可以删除分支，不删除也可以

当从远程仓库克隆的时候，仅仅克隆的是master分支，如果想要远程其他分支上的数据，比如master2分支

*  可以在本地新建一个分支master2，用于存放pull下来的分支
* 然后切换到本地该分支，进行pull远程仓库那个分支 git  pull origin master2