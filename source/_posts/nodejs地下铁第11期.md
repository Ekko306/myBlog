---
title: nodejs地下铁第11期
categories:
  - 个人提升
  - 分享大会
tags:
  - nodejs地下铁
thumbnailImage: 'http://cdn.ekko306.top/cover/Made%20In%20The%20A.M..jpg'
date: 2021-06-28 13:19:20
coverImage:
coverCaption:
gallery:
---

2021年5月23日，武汉，nodejs地下铁前端分享会，第11期
https://subway.midwayjs.org/
🥳修改于2021-06-28 20:53:14
<!-- more -->
<!-- toc -->
# nodejs地下铁第11期分享会
运气好，这次分享会来武汉开了，并且很近，主要是讲nodejs的一些服务端等技术，我连前端JavaScript可能不是太精通，后端的nodejs也是没有接触过：
- 一方面是初接触nodejs理解他是干什么的，真正前端开发用到他什么和规范，
- 另一方面是也听说了很多进阶现在不能理解的内容，可以作为以后学习的方向深入研究

## Nodejs在TARS微服务框架中的实践
邹成卓 (czzou)

> ppt目录：
> • 1 TARS是什么
> • 2 进程管理
> • 3 RPC调用
> • 4 日志与监控
> • 5 节点运维
https://tars.tencent.com/base/tars_index/cn/index.html
### 1. TARS是什么
TARS是后端微服务框架， 15年前端尝试node，
当时要考虑配置成本，研发分离，加入nodejs，开元
设计：透明部署，输入接口，平台将协议转换成代码，RPC框架日志上报，PAI，自动化运营
组成部分：主控节点，运维管理平台
原先是：passnode c++的上传后执行部署
要加入nodejs吗？快速安装 docker 节点上跑

### 2. 进程管理
node-age 作master进程，cluster模块负载均衡
worker进程：心跳上报，worker进程异常时被杀死 重拉worker
master进程：铜鼓rpc调用本机，重调nodejs，消息通信：由tars
### 3.  RPC调用
nodejs跑起来，服务可能需要其他通信
![[Pasted image 20210628135356.png]]
服务带
RCP工作：
1. 负载均衡，节点轮询，取模哈希，特定节点缓存，一致性哈希，提高缓命中率，有状态服务（语言）
2. 熔断：节点异常，熔断处理，一段时间内超时，次数超限
3. 单向调用，请求发出后丢弃掉异常对象
4. 分组调用，IDC分组(地区，就近调用)，set分组(服务业务分组)
5. 接口测试：部署业务服务，上传协议文件
6. 压力测试

### 4. 日志与监控（前面已跑起来）
1. 日志输出模块（大小/时间/远程日志，日志等级）
2. 调用上报（调用量，接口，耗时等，TARS一套做了），异常率
3. rpx调用上报异常
4. 用量键控上报（也有别的键控组件）
5. 自定义特性上报（重频，自定义），平台查看
6. 报警，opcana


### 5. 节点运维
1. 打包发布@tars/deploy 上传后发布，平台由版本管理功能
2. 热更新，一个更新，夏芳节点
3. 无损操作(名字设置为无流量状态，停止，重启发布)
4. 扩容压缩平台
5. k8s，让TAR在k8s上
	1. 开放API开发agent在pod启动/关闭时 对管理TARS服务生命周期
	2. k8sTARS项目，TARS服务快速将服务在k8s上(方便，但看少些node的)
	3. k8sFramework，TARS+k8s深度结合（不用分多平台操作）


## Node.js & Midway.js 源码贡献指北
目录：
1. 个人
2. nodejs
3. midway.js与 web框架 开源建设

### 1. 个人
2018年，开源开发，nodejs，core collaborator

### 2. nodejs
Node is a **runtime built on Chrome's V8** JavaScript engine.

Nodejs社区运作机制
1. TSC 技术方向，知道未来 提名
2. Collaborators，维护者 帮助用户 PS 工作组
3. Triagers，答疑组，issues管理 tags
4. Emeriti，退休状态，随时回归

nodejs介绍
- src：c++源码， node api，I/O api
- lib：js源代码，require模块，fs
- deps：第三方依赖，v8，openssl，uv，http，npm
- test：测试
- benchmark：性能测试，变更性能影响
- tools：各种脚本
- doc：文档

运行时结构：
![[Pasted image 20210628140804.png]]

可以入手贡献的：
- lib/：直接给用户require，例如fs, js, event.js 
- lib/internal/：内部js，不希望被用或被修改，和c++用intrenalBing（不给用户），加载c++通信
- src选手：熟悉c++，调查并C++bug
- lib选手：熟悉js，秀相关bug
- deps： eslint 是否默认绑定 eslint问题？
- doc/guides writing-test md 单测 测试通过 benchmarks
- doc/guides/writing-and-running-benchmarks.md 
- docs 最重要，markdown=> doc/guides 周边改进
- doc/guides都能找
- 构建：building, configure, make

#### 简单上手
1. coverage 提升单测覆盖率
2. issue tracker 追踪
3. refactor 重构

coverage：看那又没有被测试覆盖的东西，https、lib/interal/repljs 快通过

issue tracker:
- confirmd-bug：打标签，确定要修改的/ 抢先修
- good first issue: 新贡献，适合第一次解决
- help wanted: 这里PR里有问题 需要解决

refactor: 
重构，内部功能调整
refactor to use primordials：不影响 core 换内部实现
refactor to 提高issue，关注细节小PR
提交前测试：
1. make test
2. make test-only 

匹配：tools
单个测试 tools/test.py
测试覆盖率，debug.js

提交要注意commit规范
url： align
code review：至少一个 collatborator approved

注意评论缩写 glossary.md
定制git命令，git land命令，commit message



### 3. midway.js 
内部七年，node.js web框架应用
Class+ IoC+Decorator
运维端一体功能 issue 实际应用中：
issue tracker BUG Feature



## 复杂系统的原理及其在 Node.js 系统开发中的应用
nodejs在不同层面上 复杂度都需要和环境匹配
### 通过拆分组件管理系统
微服务架构，领域驱动设计，效率与适应性，多组成共同残余处理的任务怎么办
Conway定律系统架构，设计需要适应组织沟通
分需求，报表系统
### 通过分层管理系统
稳定的高层抽象从易变的底层细节中分离
敏捷开发，features，内部灵活
function的team拆分，节省成本
### 通过进化过程应对环境不确定性
让字团队探索不一样方式
敏捷实践，迭代回顾会议
跨国团队知识交流会，性能监控
多框架，express，koa，nest.js，egg.js，midway，不同方向
stage 2 草案，stage3 候选， stage 4 完成

总结
- 系统复杂度等于描述系统行为所需要的文字长度
- 适应性与效率不可兼得
- 系统在不同层面上的复杂度都需要和环境匹配
- 可以通过拆分子系统或者系统分层来管理复杂度，但拆分和分层方式需要环境匹配
- 通过进化过程来应对环境的不确定性
- JavaScript语言简单，nodejs生态强大，支持多种环境，且不断进化，适合用来构建多种复杂应用程序




## App Engine——一个轻量级的 Node.js 服务托管和调度平台
APP Engine 轻量级 Node.js 服务托管调度
12年浙江工业大学， 14年有赞，应用引擎 背景/设计/产品/总结

前端node服务特点
- 轻量级，模型简单
- 轻CPU，重I/O
- 二方以来少
- 改动频繁，随产品快速迭代

存在问题：
- 缺少应用框架/库版本控制和治理：一个框架多版本
- 缺动态定制
- 缺底层apm能力
- 缺应用诊断
- 利用率缺少
- 轻量级js容器环境，目标和价值
- 包版本治理，私有

### 1. 应用设计实践总结
一、自主运行模式：不改变现有架构，渐进
二、平台托管模式：只需要加一个应用引擎
三、Fasas模式，serverless类似

### 2. 应用引擎设计及实践总结
原有Master-worker 由 clusten借鉴
机房A，B，至少占用4个docker实例：浪费
多个worker难共享资源，worker难通信
对worker优化，总舵worker，agent模型
master，appworker
servervice much 模式 加上全局控制面板

阶段一：自主运行模式，串联起来：
1. 进程模型改变
2. 控制平面
3. 总控与分控机制

接短儿：平台托管模式
用户端，开发者，底下源数据手机，AE，总控，调度中心
开发者：启动，重启，停止，上线，下线，状态，动态配置
AE总控，调度算法，容器，一，二，三

AE运维操作：重启，停止，上/下线，应用隔离
用户：网管统一网关，AD网关=> 全局路由表，路线对应的应用，key与port
网关负载均衡，轮询算法，应用引擎网关，多个产品线
![[Pasted image 20210628153201.png]]
多层gateway架构，统一几十个node应用，应用鉴权，升级的话20-30个多，所以
统一一个流量或整数的AE网关（统一鉴权，只用看业务逻辑）

网关设计模式：
1. 请求路由
2. 负载均衡
3. 服务发现
4. 弹力设计（流量控制）性能聚集
5. 灰度发布
6. 安全设计


高性能，高可用(扩展能力)，可运维，可扩展

### 3. 应用引擎产品设计
定位：渐进式
前端产品研发：规划阶段=>开发实现=>构建阶段=>测试阶段=>发布阶段=>运维阶段

定位为前端node应用的构建发布服务等功能平台
被那些应用使用
API源数据，监控流量平台，流控

## JavaScript 全栈⾼效研发在语雀中的实践
slogan专业云端知识库
语雀是什么?
产品工程师，领域专家，全栈研发流程，不熟悉细节，node专家
产品设计=>全栈细分=>一边做一遍测试=>代码评审(每一阶段覆盖测试)
JavaScript 全栈同构

nodejs的问题：
 - 单线程模型，CPU密集型
 - 异步编程
 - 异常处理
 - 动态的语言难维护


高效的研发解决问题
1. 应用架构
2. 质量保障
3. 监控

### 1. 安全稳定性
安全稳定性，处理用户输出，解析，服务挂掉，脚本
所以迁移引入serverless安全风险任务
迁移到阿里云上，lss，运维通信等，稳定选择多
升级后为混合架构

### 2. 质量保障
社区规避ts，语雀没有用ts，加强测试与code review，质量(比如权限)，可维护性
写测试：
1. 数据准备
2. mock条件
3. 执行放放风
4. 做结果断言

语雀前端分多层视图，View-model，覆盖单测

持续集成提效CI，一个大仓库，多部分

拆分为多个stage，stage下再拆分jobs，出发stage条件

node-moclults 缓存

code review 对团队，对提交者，对评审人
日志采集： 阿里云日志服务，数据分析指定报警
联路跟踪：定位线上问题，trace_ID最终任务，ID还原请求联路

日志最佳实践
1. 重要日志：关键操作步骤，错误信息
2. 规范日志输出

键控 报警，关注键控 

## 圆桌环节
狼叔总结：topic，趋势，话题，成长
嘉宾自我介绍，从前往后：
13年 北京交通大学 腾讯 VR引擎 外包
子健：18年兰州大学 文科生 代码 开元 一年一线业务 二年 nodejs架构组 三年nodejs
王涛：数字心理学，后端全栈，半开发交流，传统，创业，上海
kk：2021年 浙江工业大学 教育技术 Java前端 IoC spring 相通 node Fast
找珊珊：浙江工业大学，数字媒体，远程工作，三年，16年蚂蚁体验，语雀全栈
创始人：浙江工业大学，宁波，腾讯文档，七年阿里，国内第一批nodejs 

### 问题1 不是科班，稳定性问题？
保护，阿里node serverless 运维，应用框架
前期测试，监控工作，修复，k8s，进程挂了，重启，用工具
it代码质量，业务代码底层5%，业务与底层分开，TOA拆开，架构

RPC调用服务 node，TARS与其他RPC框架区别：插件化设计
node对比Java又是，开发成本
Java微服务健全，nodejs计算并行

### 问题2 midway.js
midway hooks 一体化为什么优秀？ serverless前端工作
midway.js：全栈走一遍
midway hoos：用户视角，前后端薄，函数式用hooks，class，egg.js next.js
中间开发过程简化
http body 配置多环境

框架射击自己环境，后端前端环境不同，打通两部分
前后js 框架写法不一样，midway夜壶很多

### 问题3 serverless 
serverless容易有优势，不比较火，后端难做，长链接难，快启动 技术向
serverless 必然趋势，nodejs云特性，nodejs 轻量，云轻量化
轻量化，nodejs很清凉，Docker，node 云端同端，SSR，云原生战略，bus fast体系 低运维

### 问题4 node招人难，全栈？
帮助陆地，应届生，分布式，node，引导发展
node对js要求不太多，偏后端很多相关问题，要求js基础过硬


### 问题5 AE层更新应用
Webserver 转发 应用引擎 网关 k8s 归途发布
k8s 提升资源
fast worker 端口号 服务源数据 路由表发送 egg.js
多worker 多个agent 代码下载
动态配置 appllo配置更新 业务费业务拆开

### 听众体温
数据被爬取：
1. 网关控制
2. 脏数据
3. 去哪儿 请求数据跟踪

流量规划，定时广告
node 前后领域 nodejs前端应用多 node操作数据库 服务端没背景吃力

国外node 后端 写 robbie java 三板斧 RPC MQ缓存 集群
mideway.js k8s 集成联动

