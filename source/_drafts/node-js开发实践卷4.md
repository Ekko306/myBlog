---
title: node.js开发实践卷4
categories:
  - 专业知识
  - node.js
tags:
  - 服务器端
  - node.js开发实践
thumbnailImage: 'http://cdn.ekko306.top/cover/Yellow%20-%20Single.jpg'
date: 2021-06-28 20:54:06
coverImage:
coverCaption:
gallery:
---
node.js开发实践，第23~25节，RPC调用
<!-- more -->
<!-- toc -->
# 24 | RCP调用：什么是RPC调用？
后端熟悉，要用前端的角度解释

RPC调用：Remote Procedure Call（远程过程调用）

相似的知识点：Ajax，有什么相同点？
- 都是两个计算机之间的网络通信（浏览器和服务器，RPC也是，是服务器和另一个服务通信）
- 需要双方约定一个数据格式

Ajax有什么不同点？
- 不一定使用DNS作为寻址服务（RPC一般内网互相请求，一般不用DNS）
- 应用层协议一般不使用HTTP（RPC用二进制协议取代http，性能优势）
- 基于TCP或UDP协议（有可能基于TCP或UDP协议，Ajax一定是http，tcp）


## 寻址/负载均衡
Ajax：使用DNS进行寻址

RPC：使用特有服务进行寻址
也会寻址，但是不是用ip，而是用id：L5腾讯，VIP阿里，统一的标志符，用id获取ip，得到之后客户端服务器


## TCP通信方式
RPC：TCP通信方式，单工通信

单工通信：client或server同时只能单向一个方向通信，并且只能一个方向，不能像半双工通信会随时间改
半双工通信：同一时间内，server不能给client发包，c给s发包之后，s才能给c发包。同一时间内只有一段能给另一端发送数据，=轮番单工通信
全双工通信：C和S能够自由的互相发送通信


1. 独木桥例子：两岸只能一次一个行走 ：半双工通信
2. 双车道例子：全双工通信

方式选择与实现难度和实现成本有区别，全双工通信实现比较复杂

写RPC需要理解如何实现半双工和全双工通信


## 二进制协议
1. 更小的数据包体积
2. 更快的编解码速率

http：
1. html
2. json


rpc： [0001 0000 1111 0001]，不同字段用不同位数代表 
比如前6，中4，最后6，表示是哪个字段，可以任意规划按顺序拼起来，不需要固定的json一样key

另外0 和1 利于计算机理解，所以计算机选出来耗时 比文本协议快很多 效率更好 一般用二进制

刚才说的 
1. 寻址和负载均衡是运维消化
2. 多路复用和二进制协议一般是BF层去理解和实现 


下面讲两部分，并且学node层和相关API

# 24 | RPC调用：Node.js Buffer编解码二进制数据包

1. 了解nodejs负责二进制操作的模块buffer
2. 了解如何使用二进制数buffer 实现编解码


## nodjes buffer模块
https://nodejs.org/api/buffer.html

很多相似方法
Buffer介绍，tcp连接流

### buffer的创建
三种创建方法：Buffer.from()，Buffer.alloc(), Buffer.allocUnsafe()

先讲两个，后面会涉及到buffer模块对内存的管理机制

### buffer的读写
BE，LE是指大段 小段的意思
还有数据类型 readBigInt等

int8 没有 BE LE




