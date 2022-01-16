---
title: node.js开发实践卷3
categories:
  - 专业知识
  - node.js
tags:
  - 服务器端
  - node.js开发实践
thumbnailImage: 'http://cdn.ekko306.top/cover/%E5%A4%A7%E5%AE%9D%20-%20Single.jpg'
date: 2021-06-10 14:57:40
coverImage:
coverCaption:
gallery:
---

node.js开发实践18~25节，nodejs的HTTP部分
<!-- more -->
<!-- toc -->

# 18 | HTTP：什么是HTTP服务器？
什么是HTTP服务？

5. 应用层
4. 运输层
3. 网络层
2. 数据联路层
1. 物理层

- HTTP是什么？
	- 应用层协议
	- 五层网络协议

- HTTP是什么？从上到下
	- 极客主编的一份神秘大礼
	- 经过打包之后 （HTTP层）
	- 送到了快递员手里
	- 在茫茫世界找到了目的地
	- 然后搭着快递车
	- 通过高速公路送到了目的地

- HTTP是什么？从下到上
	- 变成了手上的一个神秘大礼
	- 极客粉丝把包裹拆开之后 （HTTP层）
	- 快递员送到了家里
	- 看到了要送到哪里
	- 上面卸下来一个包裹
	- 一辆快递车开进了物流中心


- 一个网页请求，包含两次HTTP包交换
	- 浏览器向HTTP服务器发送请求HTTP包
	- HTTP服务器向浏览器返回HTTP包


以极客时间首页为例，分析HTTP格式：
![[Pasted image 20210610150835.png]]


- HTTP服务要做什么事情
	- 解析进来的HTTP请求报文
	- 返回对应的HTTP返回报文

# 19 | HTTP: 简单实现一个HTTP服务器
```js
const http = require('http')

http.createServer(function (request, response) {
    console.log(request);
    response.writeHead(200)
    response.end('hello')
}).listen(3000)
```
https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage



打印了两次
```bash
/
/favicon #浏览器默认行为，请求标签图标
```


这个就是最简单的http服务程序，可以用http协议展示，而不是file格式
```js
const http = require('http')
const fs = require('fs')

http.createServer(function (request, response) {
    if (request.url == '/favicon.ico') {
        response.writeHead(200)
        response.end();
        return;
    }
    console.log(request.url);
    response.writeHead(200)
    // response.end('hello')
    fs.createReadStream(__dirname + '/index.html').pipe(response)
}).listen(3000)
```

还推荐一个npm模块`httpserver`，快速启动静态服务器，用网络方式访问
https://www.npmjs.com/package/httpserver

可以看别人模块怎么写的提升自己技巧

# 20 | HTTP: 实现网页版石头剪刀布

代码写完70多行，功能模块混杂在一起 维护困难 ，下一节课用一些http的开源库，来优化我们的复杂逻辑

# 21 | HTTP: 用express优化石头剪刀布游戏
老牌一点的http库express

- 要了解一个框架，最好的方法是
	- 了解它的关键功能
	- 推导出它要解决的问题是什么

最简单去官网去看

https://www.npmjs.com/package/express

features是关键功能
- Robustt routing 强壮的路由系统（后台开发是一个请求包进入服务器，根据请求包的内容分发到不同的逻辑单元处理，分发过程叫做路由，就是express可以快速写出路由功能并且健壮）
- Focus on high performance （设计思路：高性能，因为别的框架困难关注多功能，express选择性能）
- Super-high test coverage （广泛的支持覆盖率，维护的基础，单元测试）
- HTTP helpers (redirection, caching, etc)（http重定向规范，希望网页到重定向另外一个页面，http返回302，带上location跟着新地址的url，express简化了操作，不用知道细节，只用给地址调用express函数就行，caching也类似，304工作机制，也有一系列函数给你做好）
- View system supporting 14+ template engines（模板引擎，nodejs输出页面的时候，重要是把后台返回的数据嵌入到html里面，这个嵌入的过程，一般用模板引擎实现，支持多）
- Content negotiation（提供一系列强大脚手架，快速帮助创建应用加速上手）
- Executable for generating applications quickly （请求包困难有accept的头，代表浏览器只接受某种格式的返回包，希望服务器返回对应的，内容协商，4和6都是http处理简化的操作，他的功能是简化）

| features                                       | 解释                                                                                                                                                                                                       |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Robustt routing                                | 强壮的路由系统（后台开发是一个请求包进入服务器，根据请求包的内容分发到不同的逻辑单元处理，分发过程叫做路由，就是express可以快速写出路由功能并且健壮）                                                      |
| Focus on high performance                      | 设计思路：高性能，因为别的框架困难关注多功能，express选择性能                                                                                                                                              |
| Super-high test coverage                       | 广泛的支持覆盖率，维护的基础，单元测试                                                                                                                                                                     |
| HTTP helpers (redirection, caching, etc)       | http重定向规范，希望网页到重定向另外一个页面，http返回302，带上location跟着新地址的url，express简化了操作，不用知道细节，只用给地址调用express函数就行，caching也类似，304工作机制，也有一系列函数给你做好 |
| View system supporting 14+ template engines    | 模板引擎，nodejs输出页面的时候，重要是把后台返回的数据嵌入到html里面，这个嵌入的过程，一般用模板引擎实现，支持多                                                                                           |
| Content negotiation                            | 提供一系列强大脚手架，快速帮助创建应用加速上手                                                                                                                                                             |
| Executable for generating applications quickly | 请求包困难有accept的头，代表浏览器只接受某种格式的返回包，希望服务器返回对应的，内容协商，4和6都是http处理简化的操作，他的功能是简化                                                                       |
                                                                                                                                                                               |

总结express想解决的问题：
1. 路由功能
2. http处理功能
3. 模板引擎（前三个是为了减小负担提高效率）
4. 帮助快速上手，研究大型项目 第四点没有太重要


- 核心功能
	- 路由
	- request/response 简化
		- request: pathname, query等
		- response: send(), json(), jsonp()等


再看代码改进
1. 先用express的路由功能重构，改进之后结构很清晰，每个路由也可以放到另外的模块里单独维护，不用太臃肿
2. 后面会说别的请求restful
3. express进行了简化`response.status` `response.send`
4. url也不需要进行解析，express自动进行了解析，不需要`url`和`querystring`两个包
5. express还有中间件的能力，比如`'/game'` 逻辑很长 有中间件的能力可以分成多个，实际上优化代码结构，分文件是最简单模式
6. 中间件不一定是不一定是串行一个个向下的，可以这样写
```js
function (request, response, next) {
        if (playerWon >= 3 || sameCount == 9) {
            // response.writeHead(500); //500表示服务器
            // response.end("我再也不和你玩了！")
            response.status(500)
            response.send('我不会再玩了！')
            return
        }
        next();
        
        if (response.playerWon) {
            playerWon++;
        }
    }
```
这里next没有放在最后，而是向下执行完毕之后再返回来判断，洋葱模型机制，中间件可以串入再串出，洋葱模型可以检测http请求花费时间时间统计
7. 洋葱模型有一个问题，比如假设结果需要等待500ms，非阻塞I/O有异步操作，加入异步操作之后，赢三次功能失效了，因为next()中间件是一个普通函数，执行next是阻塞的过程，一直到setTimeout，会到另外一个新的调用栈，统计playerWon在前一个事件循环完成了，后面时间循环统计不到，就是洋葱模型不完善的地方，原本作者设计中间件希望能到洋葱模型，但是对异步操作不好，是缺陷


由于express有洋葱模型等缺陷，出现了新的框架koa

# 22 | HTTP: 用koa优化石头剪刀布游戏
koa是为了弥补express缺陷诞生的
koa去npm

https://www.npmjs.com/package/koa

## 核心功能是特点中间件

中间件可以通过`asyncfunction`编写，就是可以有`await next()`next函数可以中断中间件执行，等中间件执行完之后，继续执行async function 异步函数实现中间件就可以实现洋葱模型
```js
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start; //这里记录时间，得出所有中间件的总耗时
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});
```

## ctx
第二个特点是 request和response的处理，帮助函数
还有context，收集了request和response，有了context之后，不同中间件传递变量上，有了context就比较符合语义了
实际上和express类似

但是有更粗暴的处理
```js
ctx.response.body = fs.createReadStream('really_large.xml')
```

## 路由功能？
koa砍掉了路由功能
koa不会绑定任何中间件，于是koa把路由绑定到中间件里
用极简的思路，希望内核是最精简的，微内核

## 实战
用koa改一遍, 安装`koa`和路由中间件`koa-mount`
1. 接收多个中间件需要多个koa实例
2. 抽离中间件原则
3. 我去 koa的app.use顺序也有关系，最后写`'/'`的 不然会有问题！浪费时间

- 核心功能：
	- 使用async function实现的中间件
		- 有”暂停执行“的能力
		- 在异步的情况下也符合洋葱模型
	- 精简内核，所有额外功能都移到中间件里实现


- Express vs Koa
	- Express门槛更低，koa更强大优雅
	- express封装更多东西，开发更快速，koa可定制型更高

后面了解nodejs和后端通信能力，就是rpc通信