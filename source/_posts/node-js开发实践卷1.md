---
title: node.js开发实践卷1-模块
categories:
  - 专业知识
  - node.js
tags:
  - 服务器端
  - node.js开发实践
thumbnailImage: 'http://cdn.ekko306.top/cover/Some%20Nights.jpg'
date: 2021-05-26 09:46:07
updated: 2021-06-27 12:33:29
coverImage:
coverCaption:
gallery:
---
node.js开发实践06～08节，nodejs的基本介绍，09~12节，nodejs的**模块**

<!-- more -->
<!-- toc -->

# 06 技术预研
程序开发前分析需求找出技术难点，进行攻克和测试，更加顺利。
现在是BFF。
![[Pasted image 20210526094759.png]]
为了前端服务的后台服务

BFF两个 功能：
1. 对用户侧提供HTTP服务
2. 使用后端RPC服务

# 07 Node.js环境
- chrome
- vscode
- nodejs 12.0.1 current版本

windows配置环境变量，所有终端可能运行的安装地址
![[Pasted image 20210526095157.png]]

# 08 Node.js第一个实战 石头剪刀布


# 09 | 模块：CommonJS规范
js以前唯一加载脚本的方法`<script />`
- 脚本变多，需要手动管理加载顺序（管理顺序）
- 不同脚本之间逻辑调用，需要用全局变量的方式通信（jQuery都是在$变量里，每个脚本间输出都是在一个变量上，脚本多，全局变量多，很难管理）
- 没有html怎么办（运行nodejs，无标签）

所以node需要模块管理机制 就是CommonJS规范
- JavaScript社区发起，在Node.js上应用并推广
- 后续也影响到浏览器端JavaScript（比如webpack可以用后端模块写前端）

两个关键变量：
1. require引入，函数返回一个变量，这个变量可以是模块里修改exports变量的，也可以是定义module.exports，定义了module.exports会覆盖之前的exports
2. webpack解析文件可以更好看逻辑（不会webpack要学）

# 10 | 模块改进石头剪刀布

# 11 | 模块：npm
npm是什么
- Node.js的包管理工具

包是什么
- 别人写的Node.js模块
 
 一个目录是npm包才能安装别的npm包 要先`npm init`
 
 ## 安装
 `npm install glob`
 执行后 package.json ：删除到代码仓库的时候 可以去除node_modules
 之后`npm install`就可以 依赖package.json
 
 dependencies 是用来存储依赖的
 
 ## 卸载
 删除 也会在package.json声明
 `npm uninstall extend`

## 换源
用nrm更好
他是说 npm.taobao.org

注意 npm install 会直接在package.json里增加
而cnpm 需要加上--save

## 解释说明
npmjs.com
docs.npmjs.com
比较全的说明 可以去找 有很全的说明

## npm著名大神
TJ Holowaychunk : express
Mafintosh
Dominictarr
很多常用模块是他们做成的

### npm event-stream事件
第三位这个模块给了别的同学维护，不熟，结果新的维护者加了恶意代码，npm安装的时候恶意代码存在了别的同学电脑里，让这个人赚了很多虚拟货币，增加了更好的安全性，现在会有校验机制
### npm
npm丰富了整个node.js开发者社区


# 12 | 模块：Node.js内置模块
node.js的内置模块实现了很多功能
![[Pasted image 20210531161828.png]]

nodejs两句定义：
- nodejs是一个基于Chrome v8引擎的Javascript运行环境
- nodejs使用一个事件驱动非阻塞式的I/O结构，使其轻量化业务高效

可以图里看出来
- 第一句话：application是写的代码 v8引擎把写的代码转到操作系统层面
- 右边是事件驱动和非阻塞式的I/O模型
- js到v8到操作系统很大部分是nodejs内置模块提供

## nodejs内置模块
文档也main列出所有模块https://nodejs.org/api/
比如

- File System 操作系统的能力
- Net模块 可以操作系统的网络能力
- Process node进程信息
- OS模块 用来表示和操作系统相关的事情

### OS
os.arch()：操作系统的架构
os.cpus(): 电脑的cpu和核参数
os.fremem()：剩余内存
都是操作系统的数据和能力

js怎么获取？ 本质js没有获取能力

### 刨析nodejs源代码

可以看到目录结构很复杂
打开OS.js
找到exports
文档上就是内置模块的输出
研究cpus

`function cpus()`
调用getCPUSs方法，组装后返回去，是getCPUS()方法，是internalBinding调用回来了
实际上是v8层面的方法

在src里，src全是c++的文件，是node_os.cc 找到getCPUs，initialize方法里面，指向GetCPUInfo，这个c++模块的输出，用的v8的库，都是v8的能力，遵循v8的方法 FunctionCallbackInfo调用js放的参数，在args里取到，涉及取方法操作，用uv_free_cpu_info获取cpu信息，然后用args.GetReturnValue()的v8接口，把执行结果转边成v8的变量，实现c++到js数据的转换，然后经过组装返回到node.js里面去

实现nodejs和app的交互

### 分析之前代码
![[Pasted image 20210531161828.png]]
上诉源头代码分析就是典型node v8 操作系统然后返回的机制

有些数据可能是操作系统直接通知到nodejs代码做一些事情

经典例子：石头剪刀布游戏
```nodejs
process.stdin.on('data', (buffer) => {
    const action = buffer.toString().trim();
})
```

操作系统会把终端信息存到nodejs里

#### 事件
有个addEventListener模块，可以类似绑定一些事件
是一个EventEmitter 是一个class：
EventEmitter
- 观察者模式：事件收发的模式
	- addEventListener
	- removeEventListener

这种模式，用一个例子演示
- 放到模块里面 外面的业务代码 通过事件监听器 可以方便知道子模块变换  
- 好处是可以无限添加 监听新课程人数 geektime类不用改变 扩展一些逻辑 不需要改动底层 提高逻辑性

#### 观察者模式
观察者模式用来解决两个对象的通信，可以直接用函数调用，也可以用观察者模式

什么时候用哪一种？

网上观察者模式举例 关注于“通知”
观察者模式好处：
- 观察者模式不知道通知者的人是谁，比如老板要求做一件事，可能秘书和门卫都知道了
- 要处理事件是否被监听到 是否执行的问题，最好用调用有更好的可靠性

调用 vs 抛事件：
- 关键在于 “不知道被通知者是否存在”
- 以及 “没有人听还能继续下去”

- 抛事件是设计模式上的问题，坏处不如调用有更好可靠性和私密性
- 抛事件好处是 调用的人不知道人的存在 比如极客时间可以不断上新课 但监听可以自由 有扩展性

### nodejs设计模式
讲了很多设计模式，
但nodejs内置模块 是实现应用层面到操作系统层面的通信，nodejs调用操作系统的能力，nodejs通知能力 有了强大的交互能力 能够做服务端应用
