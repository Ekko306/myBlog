---
title: git卷1--命令与核心概念
categories:
  - 专业知识
  - git
tags:
  - 版本管理
thumbnailImage: 'http://cdn.ekko306.top/cover/Memories...Do%20Not%20Open.jpg'
date: 2021-05-28 18:03:26
coverImage:
coverCaption:
gallery:
---

git第3章和第4章阅读笔记，第3章是先操作体会git命令，第4章由四个基本对象库对象的概念和操作让你体会git的核心基本概念，有点多和绕人，但是理解清楚利于后面复杂操作学习，是基石。
<!-- more -->
<!-- toc -->

# 第3章 起步
通过简短例子操作git，理解基本概念，之后第4章深度说明数据结构对象之类东西
1. git分主命令（git）和子命令（git add index.html）
2. git命令有选项[Args]（--version），主命令选项少，分命令选项多，例如一个命令有两个选项：`git --git-dir=project.git  repack -d`
3. 选项有长选项（--message="my"）和短选项（-m "my"）
4. 可以用“裸双破折号”分离命令指令和被操作部分：`git diff -w master origin -- tools/Makefile`
5. git分成多个部分![[Pasted image 20210528183755.png]]
6. git记录：1 目录/文件变化 2 提交的记录 3 日志/作者信息
7. git可以查看 单独提交 一次提交摘要 所有提交细节
8. git rm 删除 git mv重命名 先删除后增加
9. Git的配置文件是.ini文本文件，三大类配置
- 个人偏好（是否用color.paper）
- 正常运作重要（core.repositoryformatversion）
- 晒为改变命令行为（gc.auto）
10. 配置分成三优先级：
- .git/config  --file 选项修改 版本库特定配置
- ~/.gitconfig --global选项修改 用户特定配置
- /etc/gitconfig --system选项修改 系统范围配置
11. 多个配置和环境优先级
- GIT_EDITOR环境变量
- core.editor配置选项
- VISUAL环境变量
- EDITOR环境变量
- vi命令
12. 可以给命令配置别名命令 `git config --global alias.show-graph \ 'log --graph --abbrev-commit --pretty=oneline'`
13. git clone 可以创建版本库副本，和linux的 cp -a 或rsync命令相似，但是git clone后有更多可用方法，创建出来也有细微区别

# 第4章 基本概念
通过讨论Git的关键架构组成和一些重要概念探讨Git的不同之处和原因。
- 第4章：基础知识，并演示如何与一个版本库交互
- 第12章：同样适用，追踪多个版本库
- 第9章，看到索引，在合并，允许管理、检查和同时操作同一个文件的多版本中作用

## 4.1 基本概念
有点晕的概念，慢理解三大方面：
1. 版本库（对象库+索引）
2. 可寻址内容名称
3. 打包文件
4. 对象库图示

### 4.1.1 版本库
1. Git版本库是一个数据库，包含：
	-  所有文件副本
	-  版本库本身副本
2. GIt对每个用户和每个版本库的配置和设置信息管理和检查（设置版本库用户名等）
3. 版本库存中维护两个主要数据结构：**对象库和索引**，在.git文件夹里
4. 对象库支持有效复制；索引是暂时信息，可按需求更改

### 4.1.2 Git对象类型
**Git对象库**是Git版本库实现的心脏，包含原始数据和所有日志消息、作者信息、日期，以及其他用来重建**项目任意版本或分支的信息**。

概念 | 介绍
------------ | -------------
块（blob） | 文件的每一个版本是块（blob是“二进制大对象”，黑盒保存一个文件的数据）
目录树（tree） | 一层目录信息（blob标识符、路径名和目录文件的元数据，层次结构）
提交（commit）| 每次版本变化的元数据（作者、提交着、提交日期、日志消息），一个提交对象指向一个目录树对象
标签（tag）| 提交对象的可读名字（commit对象的命名）


### 4.1.3 索引
- 索引是临时的、动态的二进制文件，描述整个版本库的目录结构。
- 索引可以捕获项目在某个时刻的整体结构的一个版本，可以是任何一个历史版本或未来版本。项目的状态可以由提交和一棵目录树表示。
- 索引的原理是记录提交前的文件变更操作，支持从复杂版本库到可推测的更好状态的逐步过度。

### 4.1.4 可寻址内容名称
- Git对象库被组织及实现成一个内容寻址的存储系统。
- 就是4.1.2节的四个概念内容寻址（SHA1散列值形成的）
- 所以认为一个对象的完整内容和散列值一一对应
- SHA1是一个40位的十六进制数（实际160位，但是显示成较小的，唯一的），SHA散列值重要特性是不管环境，SHA1哈希ID产生值是完全相同的。有效的全局唯一标识符。


### 4.1.5 Git追踪内容
Git对象对象库是一个版本控制系统（VCS），还是一个内容追踪系统。

Git内容追踪系统的两种表现方式：
1. Git的对象库基于**对象内容的散列计算值**，而不是基于用户原始文件布局的文件名或目录名设置，**即Git追踪的是内容而不是文件**。（举例如果两个文件的内容完全一样，无论在什么目录，Git在对象库里只保存一份blob形式的内容副本）
2. 文件从一个版本变到另一个版本的时候，**Git存储的是每个文件的每个完整版本，不能存储差异**。Git使用一个文件的全部内容的散列值作为文件名。


### 4.1.6 路径名与内容
- Git需要维 护一个明确的文件列表组成**版本库**的内容，但是这个文件列表的表头不是文件名，而是路径名。
- 文件名和目录名来自底层的文件系统，但是Git并不真正关心这些名字，仅仅记录每个路径名
- 即Git的物理数据布局不模仿文件目录结构，而是用完全不同结构重构布局，更高效


### 4.1.7 打包文件
直接存储每个文件每个版本的完整内容太低效了，每次文件改变都要存储完整的内容，效率行吗？ 答案是：”不完全是“
1. Git用一种打包文件（pack file）的更有效的存储机制，创建一个打包文件，定位内容相似的全部文件，然后给一个存储完整内容，其他相似文件只存储差异，这个被其他VCS已经用了好几年
2. 但Git文件打包巧妙一些，因为Git是内容驱动，并不真正关心计算出来的两个文件是不是同一个文件的两个版本，可以任意取两个文件计算差异，要是足够相似就压缩一套打包。代价是Git要想当复杂的算法定位和匹配版本库中潜在的候选差异。
3. 打包时，Git还维护打包文件中每个完整文件的原始blob的SHA1值，给定位包内对象的索引机制提供了基础。 


## 4.2 对象库图示
### 基本图示
![[Pasted image 20210608135456.png]]
上图演示Git对象之间协作形成完整系统：

| 图形       | 含义     | 说明                                  |
| ---------- | -------- | ------------------------------------- |
| 矩形       | blog对象 | 底层结构，文件数据                    |
| 三角形     | 树对象   | 一层目录信息，包含多个元数据          |
| 圆圈       | 提交对象 | 一个提交指向特定树对象                |
| 平行四边形 | 标签     | 每个标签只能指向最多一个提交对象      |
| 圆角矩形   | 分支     | 不是基本Git对象但是命名提交对象很重要 |

比如图4-1表示一个版本库在添加了两个文件的初始提交后的状态，两个文件都在顶级目录中。同时他们的master分支和一个叫V1.0的标签都指向ID为1492的提交对象。
### 复杂图示
![[Pasted image 20210608135601.png]]
- 上图是保持原来两个文件不变，添加一个包含一个文件的新子目录，对象库如上。
- 和第一张图对比，新提交对象新增了一个三角的树对象表示目录和文件关系，因为定居目录被添加的新子目录改变了。顶级树对象的内容也变了，所以引入了cafed00d，
- 再一个要注意的是，第二张图是父提交指向子提交是画反的，第6张扩展了这些图来展示版本库的历史是如何建立和被不同命令操作的。


## 4.3 Git在工作时的概念
前面理论看的迷迷糊糊的，这里用代码看理解
### 4.3.1 进入.git目录
```bash
mkdir hello
cd hello
git init

find . // 列出当前目录中所有文件

find .git/objects

echo "hello world" > hello.txt
git add hello.txt

find .git/objects
```

#### find .
.git目录包含很多内容，这些文件基于模板目录现实，根据需要可以进行调整。这些”隐藏“的文件是Git底层或配置的一部分。Git有一小部分底层命令来处理这些隐藏的文件，但是你很少会用到它们。

#### find .git/objects
看起来奇怪，下面几节解释原因
### 4.3.2 对象、散列和blob
1. 当创建hello.txt并增加到Git对象库，Git不关心hello.txt的文件名，而是关系内容"hello world"，并计算SHA1散列值，存储在对象库
2. 两个SHA1散列值的碰撞几率十分渺茫
3. Git在40个字节的十六进制前两个数字后插入一个”/“提高文件系统效率

代码验证：
```bash
git cat-file -p 3b18e512dba79e4c8300dd08aeb37f8e728b8dad
=> hello wolrd

git rev-parse 3b18e512d
=> 3b18e512dba79e4c8300dd08aeb37f8e728b8dad
```
### 4.3.3 文件和树
1. 上面命令将”hello world“的blob存储到对象库了，但是如何查找文件名文件？
2. 答案是Git用目录树来跟踪文件的路径名
3. 但是`git add`命令时，并不会创建目录树，而是更改索引，位于.git/index，跟踪文件名和相应blob，每次对暂存区内容修改 `git add/rm/mv`的时候，Git会更新索引
4. 任何时候可以根据索引创建一个树对象，用`git write-tree`，生成的对象就是文件的目录关系即目录树
5. 第一个树10064是对象的文件属性八进制表示，要熟悉UNIX的chmod命令
6. git cat-file -p 68aba6结果清晰：3b18e代表的是文件内容”hello world“，后面跟着”hello.txt“是路径名的文件名

代码验证：
```bash
git ls-files -s                # 查看文件关联
=> 100644 3b18e512dba79e4c8300dd08aeb37f8e728b8dad 0       hello.txt

git write-tree                 # 从当前索引创建一个树对象
=> 68aba62e560c0ebc3396e8ae9335232cd93a3f60

git cat-file -p 68aba6         # 从散列值恢复内容
100644 3b18e512dba79e4c8300dd08aeb37f8e728b8dad 0       hello.txt

```
### 4.3.4 对Git使用SHA1的一点说明
1. 重复调用`git write-tree`结果相同，即每次对相同的索引计算树对象，得到的SHA1散列值完全一样
2. 得出散列函数（根据内容计算出散列值）在数学一样上是一个完全函数，对于给定输入总是相同输出，这样的散列函数有时也被称为摘要。
3. 这样好处是无论何时何地工作，相同的散列值就足以证明全部内容一致。
4. 还是前面的SHA1不是唯一问题，万亿人产生万亿个blog散列值相同，这时不算碰撞。只有两个不同的对象产生相同的散列值才算碰撞。
5. 意思和第2点一样，举例说明：Git以来SHA1散列函数的好处：只要树对象散列值一样如`68aba62e560c0ebc3396e8ae9335232cd93a3f60`，不管你是怎么得到的，搞来搞去，只要最后散列值和别人一致，那么和别人的文件目录是一样的，有利于分布式开发。还有如果查看`68aba62e560c0ebc3396e8ae9335232cd93a3f60`并且能够找到这个对象，同时是加密散列算法，可以确信和创建者的对象数据相同的。
6. 反过来一致，如果对象没有特定散列值对象，那么肯定没有这个文件，就是可以用散列值判断对象库有没有特定的对象，散列好似可靠标签或名称。
7. 对于Git实际应用。散列值的确定性更强，因为它包含父提交以及树的散列，它通过原始提交的散列值唯一标识整个数据结构在提交时的状态。
8. 最后，在上一段声明可以推出散列函数的强大应用：它提供了一种有效的方法比较两个对象。


### 4.3.5 树层次结构
单个文件信息好管理，但是项目包含复杂和深层嵌套的目录结构，观察GIt如何处理。先看操作
```bash
mkdir subdir
cp hello.txt subdir/
git add subdir/hello.txt
git write-tree
=> 492413269336d21fac079d4a4672e55d5d2147ac


find .git/objects 
=> 
.git/objects
.git/objects/68
.git/objects/68/aba62e560c0ebc3396e8ae9335232cd93a3f60  # 第一次顶级树结构
.git/objects/3b
.git/objects/3b/18e512dba79e4c8300dd08aeb37f8e728b8dad  # hello world内容
.git/objects/pack
.git/objects/info
.git/objects/49
.git/objects/49/2413269336d21fac079d4a4672e55d5d2147ac  # 第二次顶级树结构（subdir和第一次顶级树结构相同，所以散列值相同）

```
这个时候就还包含三个对象

| 编号 | 散列值    | 含义                                                           |
| ---- | --------- | -------------------------------------------------------------- | 
| 1    | 3b18e512d | 包含“hello world”的blob                                        | 
| 2    | 68aba62e5 | 一颗包含hello.txt的目录树，内容是3b18e512d散列值对应           | 
| 3    | 492413269 | 和68aba623e5相同的目录树，树底下还有一个和68aba523e5相同的子树 | 

用散列值对应就能看出结构
```bash
git cat-file -p 3b18e512d
=> hello world

git cat-file -p 68aba62e5
=> 100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad    hello.txt

git cat-file -p 492413269
=>
100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad    hello.txt
040000 tree 68aba62e560c0ebc3396e8ae9335232cd93a3f60    subdir

```

### 4.3.6 提交
前面树对象已经通过`git-write`根据索引生成了，再通过`git-commit`命令来提交对象

```bash
echo -n "Commit a file that says hello\n" | git commit-tree 492413269
=> d5265b5687bae3a8ab7dae301618900dd70a919f

git cat-file -p d5265b
=> 
tree 492413269336d21fac079d4a4672e55d5d2147ac
author Ekko306 <1186179435@qq.com> 1623138430 +0800
committer Ekko306 <1186179435@qq.com> 1623138430 +0800

Commit a file that says hello
```
书上的和每个人的d5265b这种序列不同，因为是不同的提交。每个提交包含名字和创建提交的时间。虽然树对象相同，但是因为提交人信息不同导致提交对象不同，这样的好处是：不同的提交经常指向同一颗树对象，Git能够通过提交对象判别不同（解决冲突等）

一个基本提交对象具体简单，是真正的RCS(Revision Control System)：
- 标识关联文件的树对象的名称
- 创作新版本的人（作者）的名字和创作的时间
- 把新版本放到版本库的人（提交者）的名字和提交的时间
- 对本次修订原因的说明（提交消息 ）

```bash
git commit = git write-tree + git commit-tree
```
`git commit`的底层实际上是上面两个命令。

尽管提交对象和树对象结构完全不同，但是叶子啊对象库里，当有新的提交可以给他一个或多个父提交。通过继承链来回溯，可以查看项目历史。


### 4.3.7 标签
最后一个GIt的对象是标签对象，标签对象分为两类：
1. 轻量级的（lightweight）：只是一个提交对象的引用，通常被版本库视为私有的，不会被创建在版本库
2. 带附注的（annotated）：更加充实，并且会创建一个对象，包含一条消息，可以根据RFC 4880来使用GnuPG秘钥进行数字签名

Git在命名一个提交的时候对轻量级的标签和带标注的标签同等对待，不过，默认情况下，很多命令支队有标注的标签起作用，因为认为是“永久的”，会创建一个对象

代码操作
```bash
git tag -m "Tag version 1.0" V1.0 d5265b

git rev-parse V1.0
=> 8f980a4b8c7fff4c3818ee31dc225c773edeacd2

git cat-file -p 8f980
=> 
object d5265b5687bae3a8ab7dae301618900dd70a919f
type commit
tag V1.0
tagger Ekko306 <1186179435@qq.com> 1623139878 +0800

```

- Git打标签的特色是对提交对象打标签，提交对象吧包含了具体的树对象（树对象包含了文件和目录的整个层次），**因此这个标签间接也指向了树的所有文件**
- 这个和CVS不同，CVS是对每个单独的文件应用标签，然后以来打过标签的文件来重建一个完整的标记修订。并且CVS允许移动单独文件的标签。而Git需要做新的提交。