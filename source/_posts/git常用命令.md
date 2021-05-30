---
title: git常用命令
categories:
  - 专业知识
  - git
tags:
  - 版本管理
  - 常用命令
thumbnailImage: 'http://cdn.ekko306.top/cover/%E4%BD%A0%E8%A6%81%E5%A6%82%E4%BD%95%2C%20%E6%88%91%E4%BB%AC%E5%B0%B1%E5%A6%82%E4%BD%95.jpg'
date: 2021-05-30 10:44:02
coverImage:
coverCaption:
gallery:
---
git常用命令记下来作为cheatbook常看
<!-- more -->
<!-- toc -->
# 第3章
## 基本
```bash
git                                       # 查看所有命令
git --verison                             # 查看版本
git help --all                            # 查看完整帮助
git commit -amend                         # 子命令例子
git --git-dir=project.git  repack -d      # 主要命令与子命令分开
git commit -m "Fixed a typo."
git commit --mseeage="Fixed a typo."      # 长与短选项

# 分离命令行的控制部分与操作数部分（文件名）
git diff -w master origin -- tools/Makefile   

# --区分功能
git checkout main.c                       # chackout main.c标签
git checkout -- main.c                    # checkout main.c文件
``` 
## 创建
```bash
git init
# 不关心当前目录是否有文件，从一个完全空白目录/满文件目录开始，讲本地目录转到Git版本库的过程是一样的
```

## 添加文件
```bash
git add index.html                       # 添加文件到暂存区
git status                               # 查看状态
# 暂存区到版本库，完全限定的提交，需要提供日志和作者信息
git commit -m "Initial contents of public_html" --author="Jon Loeliger <jdl@example.com>"

# 用编辑器写commit信息
setenv GIT_EDITOR emacs                  # 在tcsh中
export GIT_EDITOR=vim                    # 在bash中
```

## 配置git
```bash
git config user.name "Jon Loeliger"
git config user.email "jdl@example.com"

# 三种选项
--file        # 最高优先级 默认
--global      # 全局
--system      # 系统范围的配置设置


git config -l                            # 列出配置全局变量
```

## 查看提交历史
```bash
git log                                  # 版本库里多个单独提交的历史
git show <id>                            # 特定提交历史
git show-branch --more=10                # 当前开发分支简介摘要
git diff <aID> <bID>                     # a到b历史的不同
```

## 暂存区修改删除
```bash
git rm poem.html                        
git commit -m "Remove a poem"            # 暂存区一个文件不需要提交到版本库

# git rm + git add文件重新命名 = git mv
mv foo.html bar.html
gir rm foo.html
git add.bar.html
# 等同如下
git mv foo.html bar.html 
```

## 创建版本库副本