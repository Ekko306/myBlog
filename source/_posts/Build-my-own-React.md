---
title: Build my own React
categories:
  - 个人提升
  - React进阶
tags:
  - pomb.us
thumbnailImage: 'http://cdn.ekko306.top/cover/huoying1.jpeg'
thumbnailImagePosition: bottom
coverImage: 'http://cdn.ekko306.top/cover/huoying1.jpeg'
date: 2021-06-02 16:23:08
coverCaption:
gallery:
---

Build your own React学习笔记
地址：https://pomb.us/build-your-own-react/
手写仓库地址：https://github.com/Ekko306/build-my-own-React
<!-- more -->
<!-- toc -->


# Build your own React
概览：
讲手动搭建重构React，去掉不需要的细节（研究主干）
这篇文章不同于作者之前的[build your own React](https://engineering.hexacta.com/didact-learning-how-react-works-by-building-it-from-scratch-51007984e5c5)是因为React更新了16.8：
- 改进增加了Hooks，
- 去除了class组件


还有一个涵盖[相同内容的演讲](https://youtu.be/8Kc2REHdwnQ)。 但这是一个独立的帖子。
# Step Zero: Review
  {% tabbed_codeblock Step Zero: Review https://pomb.us/build-your-own-react/#step-zero-review %}
      <!-- tab js -->
// React
const element = <h1 title="foo">Hello</h1>
const container = document.getElementById("root")
ReactDOM.render(element, container)
      <!-- endtab -->
      <!-- tab js -->
// js原生
const elememt = {
    type: "h1",
    props: {
        title: "foo",
        children: "Hello"
    }
}
const container = document.getElementById("root")
const node = document.createElement(elememt.type)
node["title"] = elememt.props.title

const text = document.createTextNode("")
text["nodeValue"] = elememt.props.children

node.appendChild(text)
container.appendChild(node)
      <!-- endtab -->
  {% endtabbed_codeblock %}
  
  ## element实现
  `const element = <h1 title="foo">Hello</h1>`
  这一句有两点：
  1. jsx转换为js（这里不详细，看仓库配babel）
  2. js实际是`React.createELement()`调用，参数为(tag name, the props and the childre)，转换结果为对象

第二点React.createElement()详细：
```js
const element = React.createElement(
  "h1",
  { title: "foo" },
  "Hello"
) //调用函数，传入参数

const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
} //函数结果
```
返回对象有两个参数（实际React有更多）：
1. type是合法标签名，或者函数名（函数组件）
2. props还是一个对象，对象参数有两类
	1. 一类是正常的html的property
	2. 另一个是特殊的children，通常是数组表示子元素/子文本

  ## render实现
`ReactDOM.render(element, container)`
上段是React会改变`id=root`的div，这里手动实现分两步
1. 用`element.type`创建一个dom
2. 把props全部赋予进去
	1. 对于正常property，用`node["title"]`
	2. 对于children(数组)，用`node.appendChild`

{% alert warning %}
这里对于`children:"Hello"`子文本，用`TEXT_ELEMENT或createTextNode`的形式而不是直接给元素一个`innerText` 是为了后面程序一致性实现
{% endalert %}
  
# Step I: The createElement Function
0节是原生js代替官方React，下面写自己的React代替官方React

## 分析createElement
{% tabbed_codeblock Step I: The createElement Function https://pomb.us/build-your-own-react/#step-i-the-createelement-function %}
   <!-- tab js -->
// jsx
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
      <!-- endtab -->
      <!-- tab js -->
// js
const element = React.createElement(
  "div",
  { id: "foo" },
  React.createElement("a", null, "bar"),
  React.createElement("b")
)
      <!-- endtab -->
  {% endtabbed_codeblock %}
  
  jsx转换成createElement会变成上面逻辑，则createElement需要处理三个参数type，props和children
## 手写createElement

### createElement
```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  }
}
```
上面重点...的应用
- 对于children，因为外面是无限多个children，...children收拢成一个数组
- 对于props，无限多个属性包裹在对象里比如{ id: "foo", name: "my" }，...props打散开成一个个


```js
var element = Didact.createElement(
    "div",
    { id: "foo", name: "my" },
    Didact.createElement(
        "a",
        null,
        "bar"
    ),
    Didact.createElement("b", null)
);
// 之后props属性结果
props: 
{
	children: (2) [{…}, {…}]
	id: "foo"
	name: "my"
}
```
### createTextElement
```js
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
```
- children传入的值可能不是`React.createElement`一个节点对象，也可能是数字或字符串的原生值，用“TEXT_ELEMENT”的type封装到element保证一致性
- React对于原生值不会创建节点封装，也不会有children: []，但我们简化


## 转换jsx

{% tabbed_codeblock 配置babel  %}
   <!-- tab js -->
 //手写
const Didact = {
  createElement,
}
const element = Didact.createElement(
  "div",
  { id: "foo" },
  Didact.createElement("a", null, "bar"),
  Didact.createElement("b")
)
      <!-- endtab -->
      <!-- tab js -->
// babel jsx
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)
      <!-- endtab -->
  {% endtabbed_codeblock %}

# Step II: The render Function
先考虑增加元素到DOM上去，之后考虑更新和删除
```js
function render(element, container) {
  const dom = document.createElement(element.type)

  container.appendChild(dom)
}
```
render函数如上干两件事：
1. 把Didact.createELement生成的对象转换成原生js节点对象（多个细节）
2. dom添加到container里去

第一步多个细节⬇️：
## 递归处理children
render里调用render处理children，效率低后面两节改进
```js  
element.props.children.forEach(child =>
    render(child, dom)
)
```
## 注意文本节点
之后递归到里面会有文本children，记得处理（这里一致性就出来了）
```js
var dom = element.type == "TEXT_ELEMENT" 
? document.createTextNode("") 
: document.createElement(element.type);
```
## 处理props
判断出property，并且改变到dom变量上
```js
const isProperty = key => key !== "children"
Object.keys(element.props)
	.filter(isProperty)
	.forEach(name => {
		dom[name] = element.props[name]
})
```

# Step III: Concurrent Mode
重构之前递归逻辑
```js
function render(element, container) {
    const dom = element.type == "TEXT_ELEMENT" 

    // 递归 render里还会render
    element.props.children.forEach(child =>
        render(child, dom)
    )
    container.appendChild(dom)
}
```
上面container.appendChild(dom)是最后一步，之前会不断等待forEach递归，坏处：
- 一旦开始render，不能停，全部等待一个大的element，阻塞大线程
- 如果浏览器需要做高优先级操作比如输入或动画，就只能等待大的render完成，再来，很慢

解决方法：Concurrent Mode（并发模式） [官方链接](https://reactjs.org/docs/concurrent-mode-intro.html)
调用链：
{% hl_text success %}
let nextUnitOfWork ➔ requestIdleCallback(workLoop) ➔ function workLoop(deadline) ➔ function performUnitOfWork(fiber) ➔ function createDom(fiber)
{% endhl_text %}

## let nextUnitOfWork
大体思想：讲不可阻挡的打render任务拆分成unit，每个unit结束之后可以打断rendering，浏览器决定还有什么要干的
## requestIdleCallback
```js
function workLoop(deadline) {
  requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)
```
这里改成递归调用requestIdleCallback
> requestIdleCallback: 类似setTimeout，但不是在传入固定事件后调用callback，它是当主线程完毕的时候调用callback，[链接](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)
{% alert warning%}
React现在[不用requestIdleCallback](https://github.com/facebook/react/issues/11171#issuecomment-417349573)，转用[scheduler package](https://github.com/facebook/react/tree/master/packages/scheduler)了，但原理有相似处
{% endalert %}


## function workLoop
workLoop回调函数，有一个参数`deadline`，可以用来检测到浏览器能够控制还有多长时间（别的时间浏览器渲染不能控制）
## function performUnitOfWork
为了开始循环，需要先定义第一个nextUnitOfWork
然后定义performUnitOfWork，有下面两个功能：
- 定义工作（创建DOM，用createDOM函数完成）
- 返回下一个unitOfWork




# Step IV: Fibers
为了更好管理units of work，我们用叫做fiber tree的数据结构
每个element有一个fiber，每个fiber有一个unit of work
## 改进render
比如我们要创建下面的节点树
```js
Didact.render(
  <div>
    <h1>
      <p />
      <a />
    </h1>
    <h2 />
  </div>,
  container
)
```
在render函数里，我们只创建一个`root fiber`，赋值到`nextUnitOfWork`，然后会启动workloop，将复杂逻辑交给`performUnitOfWork`里
```js
function render(element, container) {
    // TODO set next unit of work
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element],
        },
    }
}
```
## fiber结构特点
用这种fiber tree数据结构的一个目标是方便找到下一个unit of work，因为fiber有链接到第一个孩子、到兄弟、到父母
<img src="https://pomb.us/static/c1105e4f7fc7292d91c78caee258d20d/ac667/fiber2.png" style="background-color: #202226">
### 单个fiber处理逻辑
1. 将element添加到DOM
2. 给element的孩子创建fiber结构
3. 选择下一个unit of work

### 选择unit of work逻辑
#### children
当一个fiber完成之后，他的第一个孩子是下一个单元任务
E.g: div和h1关系，div完成后到h1
#### sibling
如果fiber没有孩子，那么下一个任务是兄弟
E.g: p和a关系，p没有孩子，p完成后到a
#### uncle
如果fiber没有孩子或兄弟，回去找“叔叔”，找他父母的兄弟为下个任务
E.g: a和h2的关系，a没有孩子也没有兄弟，找到父母h1的兄弟h2

#### parent
然后如果父母没有兄弟，继续向上找父母只到找到父母的父母的兄弟或者找到root节点，到达root节点就是说明完成了这次渲染的工作
E.g: 最后向上找div，直到找到root完成工作。

### function createDOM
将创建DOM关系搬移到createDOM函数里（一个fiber对应一个element）
```js
function createDom(fiber) {
    const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)
    const isProperty = key => key !== "children"
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = fiber.props[name]
        })
    return dom
}
```
### function performUnitOfWork
重点部分，代码实现`### 单个fiber处理逻辑`的工作, 完成单次createDOM，并且选行nextUnitOfWork
#### TODO add dom node
```js
if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
if (fiber.parent) { //root
	(fiber.parent.dom.appendChild(fiber.dom))
}
```
1. 将每个真实dom存储在fiber的dom属性里，比如定义render里root fiber的dom: container
2. 然后`fiber.parent.dom.appendChild(fiber.dom)`，就可以渲染到页面了，appendChild是原生方法

#### TODO create new fibers
```js
const elements = fiber.props.children
let index = 0
let prevSibling = null

while (index < elements.length) {
	const element = elements[index]
	const newFiber = {
		type: element.type,
		props: element.props,
		parent: fiber,
		dom: null,
	}
	if (index === 0) { //如果是第一个，就是当前的child
		fiber.child = newFiber
	} else {
		prevSibling.sibling = newFiber
	} //如果不是第一个 就是第一个的兄弟
	prevSibling = newFiber
	index++
}
```
给当前fiber的每个child创建fiber，看上面代码容易
#### TODO return next unit of work
```js
if (fiber.child) {
	return fiber.child
}
let nextFiber = fiber
while (nextFiber) {
	if (nextFiber.sibling) {
		return nextFiber.sibling
	}
	nextFiber = nextFiber.parent
}
```
然后找下一个工作单元，第一个是孩子，然后兄弟，然后舅舅 就是前面的`### 选择unit of work逻辑`逻辑实现
# Step V: Render and Commit Phases
标题：渲染和提交阶段
就是解决一个问题：因为我们第四节的逻辑是，每次一个fiber生成完element，就
`fiber.parent.dom.appendChild(fiber.dom)`添加到页面（浏览器会在整个tree渲染完成钱打断我们工作，有空就渲染），这样如果页面很复杂，可能导致不连续的UI，这里改进，全部生成完再添加到container里
## wipRoot
1. 删除`fiber.parent.dom.appendChild(fiber.dom)`直接更改UI的部分
2. 创建新变量wipRoot

```js
function render(element, container) {
  wipRoot = {...}
  nextUnitOfWork = wipRoot
}
```
让wipRoot做root fiiber tree的追踪
## commitRoot/commitWork
上面删除了更改UI部分，在哪里更改UI？
- 答案是在commitRoot里

```js
function workLoop(deadline) {
  // ...
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  // ...
}
```
注意上面条件是，wipRoot是有效的并且，由上节fiber规则，找到最后nextUnitOfWork为null，就是生成工作完成的时候执行commitRoot()
```js
function commitRoot() {
  commitWork(wipRoot.child)
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```
上面执行很清晰，为什么还封装一个commitWork是为了一次生成element完成后就让wipRoot 等于 null，相当于完成一次，**关闭开关**，然后之后更新或者删除操作可能会变wipRoot
# Step VI: Reconciliation
前面累死已经完成较高效率的增加节点了，下面看修改和删除。
## 变量准备
目的：能够比较新接收的elements和旧的上次提交的fiber tree
实现：
```js
function commitRoot() {
  commitWork(wipRoot.child)
  currentRoot = wipRoot  //currentRoot是旧的上次的 wipRoot是更新的
  wipRoot = null
}


function render(element, container) {
  wipRoot = {
    ...,
    alternate: currentRoot,
  }
}
```
1. currentRoot是旧的上次的，wipRoot是更新的
2. 每个fiber增加了alternate属性和旧的fiber相连，用于修改删除更新等

## 修改performUnitOfWork逻辑
原来performUnitOfWork只有增加节点逻辑
```js
// TODO create new fibers
    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    while (index < elements.length) {
        const element = elements[index]
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
        }
        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }
```
上面单一的删掉封装到`function reconcileChildren(fiber, elements)`里，包含三种情况
## function reconcileChildren
根据三种情况，修改fiber树的elements信息。
### 迭代遍历数组
```js
function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child
  let prevSibling = null

  while (
    index < elements.length ||
    oldFiber != null
  ) {
    const element = elements[index]
	// ...
	}
```

```text
直接谷歌翻译：
我们同时迭代旧 Fiber (wipFiber.alternate) 的子项和我们想要协调的元素数组。

如果我们忽略同时迭代数组和链表所需的所有样板文件，那么我们只剩下这个 while 中最重要的东西：oldFiber 和 element。 元素是我们想要渲染到 DOM 的东西，而 oldFiber 是我们上次渲染的东西。

我们需要比较它们以查看是否需要对 DOM 应用任何更改。
```
简单说就是弄出新旧要比较的元素

### 比较新旧
```js
const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type

if (sameType) {
  // TODO update the node
}
if (element && !sameType) {
  // TODO add this node
}
if (oldFiber && !sameType) {
  // TODO delete the oldFiber's node
}
```
用上面三个逻辑比较出是那种情况
1. 如果老的fiber和新元素有相同类型 只需要更新props
2. 如果type不同 就是新的元素，需要创建新的节点
3. 如果types不同 但是有旧的fiber，就需要删除旧节点

{% alert warning %}
React还会用keys来更好的比较新旧，比如在元素在数组中的位置。
{% endalert %}
### 增加逻辑
```js
if (element && !sameType) {
  newFiber = {
	type: element.type,
	props: element.props,
	dom: null,
	parent: wipFiber,
	alternate: null,
	effectTag: "PLACEMENT",
  }
}
```
增加比较简单，该写的新的加上，然后写好 effectTag是PLACEMENT

### 更新逻辑
```js
if (sameType) {
  newFiber = {
	type: oldFiber.type,
	props: element.props,
	dom: oldFiber.dom,
	parent: wipFiber,
	alternate: oldFiber,
	effectTag: "UPDATE",
  }
}
```
当老fiber和新element有相同type
保留DOM节点，然后添加上element新的props

还增加effectTag属性 之后用于commitWork提交阶段

### 删除逻辑
删除逻辑复杂一点
```js
if (oldFiber && !sameType) {
  oldFiber.effectTag = "DELETION"
  deletions.push(oldFiber)
}

function render(element, container) {
  // ...
  deletions = []
  // ...
}

function commitRoot() {
  deletions.forEach(commitWork)
  // ...
}
```
1. 对于要删除节点的 没有新的fiber 所以 给旧的fiber加上 effectTag就行
然后当我们提交fiber树的时候 再来根据effectTag来删除（处理root过程不会有旧的fibers）
2. 所以新增加一个deletions数组 存放删除的数组
3. 然后在commitRoot里，对每个deletions元素执行commitWork的删除逻辑


### 别的子节点一致处理
```js
if (oldFiber) {
	oldFiber = oldFiber.sibling
}

if (index === 0) {
	wipFiber.child = newFiber
} else {
	prevSibling.sibling = newFiber
}
prevSibling = newFiber
index++
```
## 修改commitWork逻辑
**根据fiber信息，特定处理更改到DOM上**
原来只有增加直接append，这里要处理effectTags分PLACEMENT，UPDATE，DELETION三种
```js
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  domParent.appendChild(fiber.dom)  //原来单一的增加修改成三种
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
```

### 增加逻辑
```js
if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  }
```
增加和以前一致，判断标签是增加后`appendChild`就行

### 更新逻辑
```js
else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
	}
```
定义额外的updateDom函数
然后额外发现，发现createDOM里也有updateDOM
调用是
{% tabbed_codeblock createDom %}
      <!-- tab js -->
function createDom(fiber) {
    const dom =
        fiber.type === "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type)
    updateDom(dom, {}, fiber.props) //这里改用了updateDom
    return dom
}
      <!-- endtab -->
      <!-- tab js -->
function createDom(fiber) {
    const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type)
	// 原来是下面这样
    const isProperty = key => key !== "children"
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = fiber.props[name]
        })
    return dom
}
      <!-- endtab -->
  {% endtabbed_codeblock %}
这里是旧的是空的{}，新的新增的，空变成新的也算是修改，可能这样简洁统一一点

#### 更新节点
```js
const isProperty = key => key !== "children"
const isNew = (prev, next) => key =>
  prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)
function updateDom(dom, prevProps, nextProps) {
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })
}
```
比较新旧的属性 删除不要的 添加新的 上面代码清晰
#### 更新事件EventListener
```js
const isEvent = key => key.startsWith("on")
const isProperty = key =>
  key !== "children" && !isEvent(key)
function updateDom(dom, prevProp, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })
	
  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}
```
但是 有个 on开头的属性 是事件 需要特殊处理，先判断出来然后一个是增加新的和司机爱你监听，一个是删除旧的的事件监听
### 删除逻辑
```js
else if (fiber.effectTag === "DELETION") {
  domParent.removeChild(fiber.dom)
}
```
如果是删除，父节点删除

# Step VII: Function Components
增加函数组件的功能
## 函数组件特点
函数组件本质是一个返回元素的函数，写好jsx和js转换如下：
{% tabbed_codeblock   %}
   <!-- tab js -->
/** @jsx Didact.createElement */
function App(props) {
  return <h1>Hi {props.name}</h1>
}
const element = <App name="foo" />
const container = document.getElementById("root")
Didact.render(element, container)
      <!-- endtab -->
      <!-- tab js -->
function App(props) {
  return Didact.createElement(
    "h1",
    null,
    "Hi ",
    props.name
  )
}
const element = Didact.createElement(App, {
  name: "foo",
})
const container = document.getElementById("root")
Didact.render(element, container)
      <!-- endtab -->
  {% endtabbed_codeblock %}
  

## 修改performUnitOfWork逻辑
函数组件有两点不同：
1. 函数组件的fiber没有fiber.dom的真实dom
2. 函数的子元素需要调用函数的返回值，而不是直接props属性

上面两点通过performUnitOfWork分两个函数实现
### updateHostComponent
```js
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}
```
这个和以前一样，普通的就通过fibe.dom和fiber.props.children处理
### updateFunctionComponent
```js
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
```
fiber.type实际上是App函数，调用后就返回h1元素，然后有了子元素就调用reconcileChildren和以前一样，

**但是函数组件没有fiber.dom咋办**
答案是修改comiitWork逻辑⬇️

## 修改commitWork
之前直接增加和删除，现在增加和删除要重写
```js
const domParent = fiber.parent.dom
    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
        domParent.appendChild(fiber.dom)
    } else if (fiber.effectTag === "DELETION") {
        domParent.removeChild(fiber.dom)
    }
```
#### 修改增加
为了找到一个 DOM 节点的父节点，我们需要沿着 Fiber Tree 向上直到找到一个带有 DOM 节点的 Fiber
```js
let domParentFiber = fiber.parent
while (!domParentFiber.dom) {
	domParentFiber = domParentFiber.parent
}
const domParent = domParentFiber.dom

if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
	domParent.appendChild(fiber.dom)
}
```
#### 修改删除
当删除一个节点时，我们还需要继续下去，直到找到一个具有 DOM 节点的子节点
```js
else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent)
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}
```

# Step VIII: Hooks
最后增加state的功能，这里是useState的hooks形式，useState是额外定义的模块，Counter里调用，再用回调就能用了，可以引入也可以解耦，理解hooks底层原理
```js
/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  )
}
const element = <Counter />
```

## 创建变量存储state
state肯定有全局变量来存储变化的
```js
let wipFiber = null
let hookIndex = null

function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}
```
- `wipFiber`: work in the progress fiber
- `wipFiber.hooks`: 数组，来支持多个调用useState
- `hookIndex`: 来确定当前hook（可能有多个useState）


## 定义useState函数
```js
function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state]
}
```
当函数组件调用 useState 时，我们检查是否有旧的 hook。 我们使用 hookIndex检查fiber的alternate。

如果我们有一个旧 hook，我们将旧 hook 中的状态复制到新 hook，否则我们初始化状态。

然后我们将新的 hook 添加到 fiber 中，将 hook 索引增加 1，并返回状态。
## useState函数返回值setState
```js
function useState(initial) {
	//...
	
    const actions = oldHook ? oldHook.queue : []
    actions.forEach(action => {
        hook.state = action(hook.state)
    })

    const setState = action => {
        hook.queue.push(action)
        wipRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot,
        }
        nextUnitOfWork = wipRoot
        deletions = []
    }
    wipFiber.hooks.push(hook)
    hookIndex++
    return [hook.state, setState]
}
```

useState 还应该返回一个函数来更新状态，因此我们定义了一个 setState 函数来接收一个动作（对于 Counter 示例，这个动作是将状态增加一的函数）。

我们将该操作推送到我们添加到 Hook 的队列中。

然后我们做一些类似于我们在渲染函数中所做的事情，将一个新的正在进行的工作根设置为下一个工作单元，这样工作循环就可以开始一个新的渲染阶段。

但是我们还没有运行这个动作。
我们在下一次渲染组件时这样做，我们从旧的 Hook 队列中获取所有操作，然后将它们一一应用到新的 Hook 状态，因此当我们返回状态时，它会被更新。 
🤔️ 这里还要看：下一次能更新这次的改变吗？
# Epilogue
搞完了，五千多字
这个文章两个目标
1. 理解React如何工作的
2. 深入React的代码基础（所以很多地方用了相同与React的变量名在函数里（为了帮助理解））

例如在React应用里打断点有下面相同的函数名
- `workLoop`
- `performUnitOfWork`
- `updateFunctionComponent`

还有很多React的特性和优化没有涉及，比如下面的：
- 我们的在`render阶段`（生成element对象）中走过了整个fiber tree，相反，React 遵循一些提示和启发法来跳过没有任何变化的整个子树。
- 我们也在`commit阶段`（element对象应用到页面DOM）走过了整个fiber tree。React 保持一个链表，其中只包含有效果的 Fibers 并且只访问这些 Fibers。
- 每次我们构建一个新的正在进行的工作树时，我们都会为每个 Fiber 创建新对象。 React 从之前的树中回收Fiber。
- 当 Didact 在渲染阶段收到新的更新时，它会丢弃正在进行的工作树并从根重新开始。 React 用过期时间戳标记每个更新，并使用它来决定哪个更新具有更高的优先级。
- 还有更多...

然后还有很多特性可以较简单加上：
-   use an object for the style prop
-   [flatten children arrays](https://github.com/pomber/didact/issues/11)
-   useEffect hook
-   reconciliation by key
