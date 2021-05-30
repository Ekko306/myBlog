---
title: git1
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

git第3章和第4章阅读笔记
<!-- more -->
<!-- toc -->

# 第3章
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
