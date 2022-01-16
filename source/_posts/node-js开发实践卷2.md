---
title: node.js开发实践卷2--异步
categories:
  - 专业知识
  - node.js
thumbnailImage: 'http://cdn.ekko306.top/cover/Wishes%2C%20Vol.%201%20-%20EP.jpg'
date: 2021-05-31 12:18:34
tags: 
  - 服务器端
  - node.js开发实践
coverImage:
coverCaption:
gallery:
---

nodejs开发实战深入一点的部分，13~17节，nodejs的**异步**
<!-- more -->
<!-- toc -->


# 13 | 异步：非阻塞I/O
主题是nodejs异步，两种点
- nodejs事件循环
- 非阻塞I/O

搞清楚nodejs的机制和异步方法
![[Pasted image 20210531161828.png]]

## Node.js的非阻塞I/O
- I/O即Input/Outpu，一个系统的输入和输出
- 阻塞I/O和非阻塞I/O的区别就在于{% hl_text yellow %} 系统接收输入再到输出期间，能不能接收其他输入 {% endhl_text %}

### 饭堂例子解析
具体例子，吃饭：
- 去食堂吃：排队打饭
	- 排队，等前面人打饭，轮到你打饭，吃饭
- 出去吃：餐厅点菜
	- 坐下，点菜，等待，吃饭

上面隐藏了阻塞和非阻塞I/O例子

排队打饭 vs 餐厅点菜
对于点菜人员：
- 排队打饭是阻塞I/O
- 餐厅点菜是非阻塞I/O

系统=食堂阿里/服务生，输入=点菜，输出=端菜
饭堂阿姨只能一份一份地打 -> 阻塞I/O
服务生点完菜之后可以服务其他客人 -> 非阻塞I/O

### 狼叔论坛例子
- “这个Node.js问题怎么解决？在线等，急”
提出问题不断刷新等待，是阻塞I/O

要是提出之后去学习了，再回来看，就是非阻塞I/O

### 小学生题目
![[Pasted image 20210531174626.png]]
B 25分钟完成这些事情，经典非阻塞I/O的例子
所以是性能提升


### 理解要点
理解非阻塞I/O的要点在于
- 确定一个进行Input/Outpu的系统（如果没有确定系统眼光到厨师身上混淆理解了，如果只放在点菜人员上容易理解非阻塞的）
- 思考在I/O过程中，能不能进行其他I/O

## 代码演示
```nodejs
var result = null;
console.time('glob')
glob(__dirname + '/**/*', function (err, res) {
    result = res;
    // console.log(result)
    console.log('got result')
})//传入回调
console.timeEnd('glob')
console.log(1 + 1);
```

## 回到图片
![[Pasted image 20210531161828.png]]
左边是应用程序，v8层，binding层，libuv是一个异步操作的模块

确定系统边界：一个线程有libuv的一半
![[Pasted image 20210531175644.png]]
把计算能力给C++去计算，然后返回node.js线程，其他c++线程是厨师，node.js线程是服务生，实现了整个nodejs的非阻塞I/O

# 14 | 异步：异步编程之callback
nodejs有非阻塞I/O，非阻塞I/O的结果通过回调函数获取，就是异步编程
nodejs异步编程的技巧和知识点
## 简单回调的操作
面试完成后等通知，异步非阻塞I/O操作
## 回调规范
nodejs回调函数格式规范，所有的callback函数需要遵循参数格式：
- error-first callback
- Node-first callback


第一个参数是error，后面的参数才是结果
```js
try {
    interview(function () {
        console.log('smile')
    })
} catch (e) {
    console.log('cry', e)
}


function interview(callback) {
    setTimeout(() => {
        if (Math.random() < 0.8) {
            callback('success')
        } else {
            throw new Error('fail')
        }
    }, 500)
}
```
上面是错的，造成全局错误，导致nodejs程序崩溃，不能捕捉
与调用栈很有关系，Chrome有调用栈
- 调用栈： 函数调用函数，每个函数进入另一个函数，有一个调用链条关系，就是堆栈，加元素，把栈加的很高
- try，catch机制，被函数调用的函数出错回向上级一级级给父亲捕捉到
- 但是这里没有捕捉到，因为nodejs的事件循环，每一个事件循环就是一个调用栈，因为() => {
        if (Math.random() < 0.8) {
            callback('success')
        } else {
            throw new Error('fail')
        }
    }这个函数是一个新的调用栈，不能被外面调用到
	
改进：
但是理解每一个参数类型不实际，所以nodejs制定规范，第一个参数是error，集中处理错误，其他处理成功
```js
if (res) {
 return console.log('cry')  
}


if (Math.random() < 0.8) {  
 callback(null, 'success')  
} else {  
 callback(new Error('fail'))  
}

```

## 异步流程控制问题
- 串行面试，面试3面，嵌套三层，回调地狱，callback的异步流程控制问题
- 也可能两个任务并发，同时去两家公司，异步流程并发，很恶心

- 社区有一个async.js一个包
https://www.npmjs.com/package/async
async库帮助异步并发控制，三个异步操作，forEachOf，三个callback执行后，再执行后面的，有点过时了
- thunk 一个编程范式，也推出历史舞台

下一节课深入理解事件循环


# 15 | 异步：事件循环
![[Pasted image 20210531161828.png]]
看图，前面讲了最右边的callback箭头，事件循环是能让nodejs实现非阻塞I/O的基础

都基于libuv的基础能力，理解nodejs的异步就能理解这个库的能力


## 例子

![[Pasted image 20210610102703.png]]
基本的理解例子

## 基本eventloop

代码演示

每一个事件循环都是一个全新调用栈，
例如代码里的 callback() 底部，这个回调函数开始才有 js的调用栈

看面试代码：
```js
try {
    interview(function () {
        console.log('smile')
    })
} catch (e) {
    console.log('cry', e)
}


function interview(callback) {
    setTimeout(() => {
        if (Math.random() < 0.8) {
            callback('success')
        } else {
            throw new Error('fail')
        }
    }, 500)
}
```

setTimeout 就是把回调添加到callback里面，然后callback就是一个新的调用栈底部，作为底部不能有try catch捕获了，所以这里`interview`和`() => {if (Math.random() < 0.8) {` 不是在一个调用栈里，不符合习惯，但是是nodejs高性能基础


# 16 | 异步：异步编程之Promise
promise是另一种异步编程方法，promise和模块化规范一样，都是commonjs规范，最终被js采用，所以是通用的

## Promise状态机
- Promise
	- 当前事件循环得不到的结果，但未来的事件循环会给到你结果
	- 是一个状态机
		- pending，没有得到结果
		- fulfilled/resolved，得到结果
		- rejected

![[Pasted image 20210610104104.png]]

成功状态扭转
![[Pasted image 20210610104356.png]]

错误状态扭转
![[Pasted image 20210610104501.png]]

报错：是因为当一个promise进入reject状态，但是错误没有正确捕捉，就抛到全局报错

上面说明promise确实是一个状态机

还有问题，resove能不能转换成reject？
![[Pasted image 20210610104912.png]]
只能转换成resolve或reject，但是不能结果转化了

## Promise解决异步
想要Promise得到结果马上通知，怎么写？（不可能定时去检测状态变化）

then,和catch方法
发现被catch捕捉之后 reject不会被抛到全局


- .then和.catch
	- resolved状态的Promise会回调后面的**第一个**.then （只找想要的，别的不需要的忽略）
	- rejected状态的Promise会回调后面的**第一个**.catch
	- 任何一个rejected状态且后面没有.catch的Promise，都会造成浏览器/node环境的全局错误


## Promise优势
比callback的异步流程控制的问题，解决前面多个公司面试的异步流程控制问题
### 对应情况，得到offer了，决定拒绝
更复杂操作：将成功的结果拒绝
![[Pasted image 20210610111143.png]]


- 发现promise2里的then状态变成rejected了，说明.then会返回全新的promise，然后这个promise的状态根据then的参数回调函数的执行结果决定的，如果是throw就是reject状态，如果是return，应该是resolve状态✅
- 同样catch也有这个功能，可以先rejected，面对结果可以resolve的accept






### 对应情况，得到offer了，考虑300毫秒决定接受
思考：对于异步流程控制有什么好处？
- 在异步promise2 返回新的promise会怎么样？


![[Pasted image 20210610112320.png]]
- 先面试结果成功，等待考虑pending
- 1000ms，就是promise状态

也就是说如果返回return一个新的Promise ，状态会和新的Promise一致，这里是相同的pending

### 总结
- 执行then和catch会返回一个新Promise，该Promise最终状态根据then和catch的回调函数的执行结果决定
	- 如果回调函数最终是throw，该Promise是rejected状态
	- 如果回调函数最终是return，该Promise是resolved状态
	- 但如果回调函数最终return了一个Promise，该Promise会和回调函数return的Promise状态保持一致 

这样机制决定了 promise的面试调用里可以串行执行任务👍🏻

## Promise实现面试控制

### 一个公司连续面试3轮
```js
(function () {
    var promise = interview()
        .then(() => {
            return interview(2) //知识点，返回新的promise，状态会和新的promise保持一致，状态扭转之后才会继续
        })
        .then(() => {
            return interview(3)
        })
        .then(() => {
            console.log('smile')
        })
        .catch((err)=> { //知识点，当任何一个失败，都会调用最后这个catch
            console.log('cry at ' + err.round + ' round')
        })

    function interview(round) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) {
                    resolve('success') //resolve和reject只能接收一个参数
                } else {
                    var error = new Error('fail')
                    error.round = round
                    reject(error)
                }
            }, 500)
        })
    }
})()
```

两个知识点：
1. 知识点，返回新的promise，状态会和新的promise保持一致，状态扭转之后才会继续
2. 知识点，当任何一个失败，都会调用最后这个catch

通过promise将回调地狱变成比较线性的代码，看起来舒服一点，能够完成需求

### 并发面试公司
面试两家公司，同时成功之后进行庆祝

```js
//并发面试公司
(function () {
    Promise
        .all([
            interview('geekbang'),
            interview('tencent')
        ])
        .then(() => { // 两家都成功就笑
            console.log('smile')
        })
        .catch((err) => {
            // 任何一家失败哭出名字 接受第一个失败的promise，所以假设两个公司都挂了 只能介绍到先挂的，如果想知道每个结果，
            // 需要在单个promise里存储下来，但是all已经很强了
            console.log('cry for ' + err.name)
        })

    function interview(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) {
                    resolve('success') //resolve和reject只能接收一个参数
                } else {
                    var error = new Error('fail')
                    error.name = name
                    reject(error)
                }
            }, 500)
        })
    }
})()
```




# 17 | 异步：异步编程之async/await
async/await是异步编程的终极解决方案

## async和Promise代码对比
```js
console.log(async function () {
    // return 4
    throw new Error('4')
}())

console.log(function () {
    return new Promise(resolve => {
        // resolve(4)
        reject(new Error('4'))
    })
}())
```
代码总结
- 神奇的发现 两个函数调用后都是Promise，兹阿莱return一个值看结果是否一样  
- 发现两者一样，async其实是一个return promise的普通函数，就是async是一个Promise的语法糖而已，async里执行return或者throw，then和catch一致  
- 如果async里return 就是 resolve状态的promise， 如果throw 就是 reject状态的promise


总结：
- async/await
	- async function是Promise的语法糖封装，异步函数就是一个返回promise的普通函数
	- 异步编程的终极方案-以同步的方式写异步

## async和await两个作用
```js
// 加上await
const result = async function () {
    var content = await new Promise((resolve, reject) => {
        // 这里async函数 执行后等待500ms再向下执行，await会紧跟后面Promise的状态变更，往下执行
        // 并且把值赋值到前面
        setTimeout(()=> {
            resolve(6)
        }, 500)
    })

    console.log(content)
    return 4
}()

setTimeout(()=> {
    console.log(result)
}, 800)
```

## 还有错误处理好处
![[Pasted image 20210610121301.png]]
- 发现await可以把promise的reject抛到try catch里面去，
- 前面说try catch需要依赖调用栈，只能够捕捉到调用栈以上的函数抛出的错误，像异步事件这种创建新的循环执行的代码，那个地方抛出的错误，try catch捕捉不到，但是使用await这种界限被打破了，即使这种错误在异步的回调里面抛出来，但是经过await关键字后可以被trycatch捕捉到

## 总结
- async、await
	- async function是Promise的语法糖封装
	- 异步编程的终极方案 - 以同步的方式写异步
		- await关键字可以“暂停”async function的执行
		- await关键字可以以同步的写法获取Promise的执行结果
		- try-catch可以获取await所得到的结果

## 用async/await重构前面面试代码

看代码，很简洁实现前面的写法，用同步逻辑写了，所以是最终解决方案

- 一个穿越时间循环存在的function
- async await 用try catch可以联系起来，世界上最遥远距离拉近了