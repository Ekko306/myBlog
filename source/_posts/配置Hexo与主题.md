---
title: 配置Hexo与主题
tags:
  - 规范配置
  - Hexo
  - tranquilpeak
categories:
  - 个人提升
  - 博客搭建
date: 2021-05-21 17:31:14
thumbnailImage: http://cdn.ekko306.top/cover/%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF%E3%80%82.jpg
coverImage:
coverCaption:
---
配置Hexo与tranquilpeak主题
<!-- more -->

# 配置hexo
## 为什么配置Hexo
- 决心使用hexo记录自己前端成长
- 之前太傻看博客搭建很不科学，原理不清，现在看官方文档搭建

配置原则
1. Hexo文档：https://hexo.io/zh-cn/
2. tranquilpeak主题：https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak/blob/master/DOCUMENTATION.md

## 基本命令
- `hexo generate`:生成
- `hexo clean`:清除
- `hexo server`:启动服务器
- `hexo server --draft`:查看草稿
- `hexo deploy`:部署出去

## 配置图片
https://hexo.io/zh-cn/docs/asset-folders.html
<code>hexo new post</code>
建立的时候，新建图片文件夹，有两种思路？
1. 服务器本地发送
2. 图床

## Hexo的draft、post、page区别
https://oakland.github.io/2016/05/02/hexo-%E5%A6%82%E4%BD%95%E7%94%9F%E6%88%90%E4%B8%80%E7%AF%87%E6%96%B0%E7%9A%84post/#%E4%BA%8C-layout-%E4%B8%BA-post-%E7%9A%84%E6%83%85%E5%86%B5
上面文章很好
- draft，`hexo s`的时候不会出现，写好草稿后 `hexo publish`到post
- post，`hexo s`的时候出现
- page，新建之后在 域名后面新建路由和页面，相当于自定义，比如'all-archives'

## 如何想好分类和标签
https://zhuanlan.zhihu.com/p/77481557
分类和标签有区别
- 分类是有顺序和不能重合的
- 标签是随意一点可以重合，主要标签概括思想

## 配置图片
官网有

七牛云有缓存的问题
https://www.jianshu.com/p/70255b002f12?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
## 配置搜索
https://metang326.github.io/2017/11/13/[hexo%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2]hexo%20next%E4%B8%BB%E9%A2%98%E9%85%8D%E7%BD%AEalgolia%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD/
要执行hexo algolia

## 配置封面
https://github.com/iissnan/hexo-theme-next/issues/244
https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak/blob/master/DOCUMENTATION.md#writing-posts

- 记得先\<\!\-\- more \-\-\>折叠起来
- 按文档配置额外 Front-matter settings 一开始尝试半天 不知道是hexo配置还是主题，原来是每篇文章配置总算搞懂了