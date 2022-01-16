---
title: Axios by Typescript 卷1
categories:
  - uncategorized
date: 2021-05-24 13:35:39
tags:
---
> 第三章类型系统
## 基本类型
过一遍基础类型
上半部分
```ts
// 布尔
let isDone: boolean = 1

// 数字进制 四种进制表示二十
let decLiteral: number = 20
let hexLiteral: number = 0x14 // 十六进制
let binaryLiteral: number = 0b10100 //二进制
let octalLiteral: number = 0o24 // 八进制

// 字符串
let name: string = 'bob'
name = "smith"

let name: string = 'Yee'
let age: number = 30
// let sentence = `Hello, my name is ${name}.
// 
// I'll be ${ age + 1} years old next month.`

let sentence = 'Hello, my name is ' + name + '.\n\n'' + 'I\'ll be ' + (age + 1) + 'years old next month'


// 数组
// let list: number[] = [1, 2, 3] //加上中括号
let list: Array<number> = [1, 2, 3] //数组范型 只能是数字 如何支持多种let list: Array<number> = [1, 2, 's'] //数组范型 只能是数字 如何支持多种

// 元组 已知元素个数和类型的数组
let x: [string, number] 
x = ['hello', 10]
//x = [10, 'hello'] ❌

console.log(x[0].substring(''))
console.log(x[1].substring('')) // ❌
x[3] = 'world' // ✅ 越界元素 是联合类型 可以的
console.log(x[5].toString()) //✅
x[6] = true // ❌
```


下半部分
```ts
// 枚举类型 给数组给更好的名字
enum Color {
  Red = 1, //改变编号
  Green = 2,
  Blue = 4
}

let c:Color = Color.Blue

//还可以反查能力
enum Color {
  Red = 1, //改变编号
  Green,
  Blue
}

let colorName: string = Color[2] //✅
console.log(colorName) // 返回Green

编译完是什么样子？
```
![[Pasted image 20210503092726.png]]
```ts
//本质是一个立即执行函数 可以看看编译后的js

// any类型 编程阶段还不知道 的类型 可以定义全局的any类型 或者第三方库 不知道 也不希望检查 就是用了any类型 就不做ts检查了 全部用any 就和js一样了
let notSure: any = 4
notSure = 'maybe a string instead'
notSure = false //可以选择性移除检查

// 比如数组 不知道什么顺序 可以any 需要时使用 不滥用
let list: any[] = [1, true, 'free']
list[1] = 100

// void 和any差不多相反 表示没有任何类型 通常函数使用
function warnUser(): void {
  console.log('This is my warning message')
}

let unusable: void = undefined // 没有意义  并且只能赋值 undefined 或 null

// null和undefined类型 他们是js里的值 类型就是自己
let u: undefined = undefined
let n: null = undefined // null和undefined是所有类型的子类型 子类型可以赋值

let num: number = 3
num = null // 子类型 可以的 不会报错 可以在编译设置严格选项
// 可以加上 tsc index.ts --strictNullChecks 加了就出错了

//有些时候可以用子类型 也可以用联合类型 null/undefined本身没意义是所有子类型 所以可以直接赋予值
let num: number | null = 3
num = null 


//never类型 表示永远不存在的数据类型 通常用在函数中 没有返回值时候抛出异常的时候 是任何类型子类型  但never没有子类型 下面看例子

function error(message: string):never {
  throw new Error() //never类型不能返回 直接throw就可以了
}

function fail() {
  return error('something failed') //never泪习惯
}


// 另一场景

function inifiniteLoop(): never {
  while(true) {
    
  }// 无限循环就不会报错了
}


// object类型 表示非原始类型 通常和Object.create的api类似
declare function create(o: object | null): void; //declare关键字 表示声明

create({prop: 0})
create(null) //非原始的可以
create(42) // ❌
create('string') // ❌
create(false) // ❌
create(undefined) // ❌

//object是范的对象 之后会说接口定义好

// 类型断言 有些时候 自己ts更了解数据类型 更加确切 相当于告诉编译器 自己在干什么
let someValue: any = 'this is a string'
someValue.length //如果是any 编辑器不认得

// 可以类型推断
let strLength: number = (<string>somValue).length // 转成number
let strLength:number = (someValue as string).length // jsx也是这种语法 规范选一种
```

补充
```ts
// 元祖访问越界 报错 ts3.1 版本之后报错 之前不报错

let x: [string, number]
x = ['hello', 3]
x[3] = 'world' //报错

// 去搜源代码 TS2493 报错的文本 key复制
```
![[Pasted image 20210503100029.png]]
```ts
ts降级 
sudo npm install -g typescript@3.1
// 报错信息编程2733 之前不报错 
// 类型长度固定元祖一般 越界一般没意义 所以3.1之后版本报错了
// 学会看源代码 nodejs 根据错误信息找报错位置
```
## 变量声明
### var声明
es5是 var关键字定义变量
es6定义很多，ts支持js所有的

```js
function f() {
  var message = 'Hello world'
  return message
}

function f() {
  var a = 10;
  return function g() {
    var b = a + 1
	return b
  }
}

var g = f() //返回 11 是闭包场景  g函数访问了 a 变量 g引用了a 没有释放
g()
```

var 作用域规则
```js
function f(shouldInitialize) {
  if(shouldInitialize) {
    var x = 10
  }
  return x
}

f(true) // 10
f(false) // undefined 因为var潜规则 声明提前

//实际等同于下面
function f(shouldInitialize) {
  var x
  if(shouldInitialize) {
    x = 10
  }
  return x
}
```

复杂例子 矩阵运算
```js
function sumMatrix(matrix) {
  var sum = 0
  for(var i = 0; i<matrix.length; i++) {
    var currentRow = matrix[i]
	for(var i=0; i<currentRow.length; i++) {
	  sum += currentRow[i] //有问题 因为内部也定义了 i 会覆盖外面的i 导致隐蔽错误
	}
  }
}

var matrix = [
  [1, 2, 3],
  [4, 5, 6]
]
//期望是 1 + 2 + 3 + 4 + 5 + 6 但是i不对 内部循环 3 跳出了 问题结果6 把内部i换成j没问题

```

面试例子
```js
for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i)
  }, 100 * i)
}
// 结果全是10 不是期望的，因为每个循环创建定时器 但是js是单线程 循环到结束 编程10了 但是异步执行 外层i是10 所以每次输出都是10

//改用立即执行的表达式 这样每次i都能缓存下来
for (var i = 0; i < 10; i++) {
  (function (j) {
    setTimeout(function () {
	  console.log(j)
    }, 100 * j)
  })(i)
}
```
### let声明
let和 var 语法类似，区别不是语法 更多是语义
```js
let hello = 'Hello'
```

块级作用域
```js
function f(input: bollean) {
  let a = 100
  
  if (input) {
    let b = a + 1
	return b
  }
  
  return b //❌报错因为 b是if里声明的 但是a可以找到 向上找父级作用域
}

// 也能写try
try {
  thrtow 'Oh no'
}cach (e) {
  console.log('Catch it')
}

console.log(e) //❌
```

还有块级特点 是声明之前 不能读写 术语叫做 暂时性死区 声明之前不能访问 只能声明后

```js
a++ // ❌
let a = 1
a++ // ✅
```

```js
function foo() {
  return a
}
foo()

let a //没有死区？

//上面ts不会报错

//编译后代码
function foo() {
  return a;
}
foo();
var a;

// 但是如果编译成es2015     tsc index.ts --target es2015
function foo() {
  return a;
}
foo();
let a;
//运行报错❌，因为有暂时性死区
```

let另外特性 不能重定义 和屏蔽
```js
function f(x) {
  var x
  var x
  if(true) {
    var x //都不会报错 但是最终只有一个
  }
}

// 用let就不行

let x = 10
let x = 20 //重复 ❌
function f(x) {
  let x = 10 //干扰参数 ❌
  
}
// 但是不能重复声明是在块内 不是局限于函数内

function f(condition, x) {
  if (condition) {
    let x = 100
	return x
  }
  return x
}
f(false, 0) //上面重复定义x是可以的 因为进入了if内部 重新声明的x 并且可以返回 
f(true, 100)
```

屏蔽功能

```js
function sumMatric(matrix: number[][]) {
  let sum = 0
  for (let i = 0; i<matrix.length; i++) {
    let currentRow = matrix[i]
	for (let i = 0; i<currentRow.length; i++) { //✅ 因为是在新的块级里 不会像var覆盖报错
	  sum += currentRow[i]
	}
  }
}
// 虽然结果对 但是强烈不建议 让逻辑混乱 把i换成j
```

块级变量作用域获取
```js
for(var i=0; i<10; i++) {
  setTimeout(function () {
    console.log(i)
  }, 100 * i)
}
//❌10次10 因为 i循环结束后为10 解决方案 立即执行函数 就是为变量创建新的变量环境

//用ts就不用写立即执行函数给环境了
for(let i=0; i<10; i++) {
  setTimeout(function () {
    console.log(i)
  }, 100 * i)
}
//✅ 行为是对的 循环体 有新的变量环境 每次迭代有新的作用域 和立即执行函数表达式一样 尽量使用let 不用var
```
### const声明
和let类似，但是不同于const 是不能重新赋值的
const可以理解为let的增强

```js
const kitty = {
  name: 'Kitty',
  numLives: numliveForCat
}

kitty = {
  name: 'Kitty',
  numLives: numliveForCat
} //❌ 引用变化不允许 

kitty.name = 'Jerry' //✅ 引用值变化 不会影响 
kitty.numLives-- //可以设置 readonly语法 接口章节

```

使用let和const情况：
除非计划修改的 否则不修改的变量 都用 const
### 解构
```js
let input = [1, 2]
let [first, second] = input

// first second对应更方便
let first = input[0]
let second = input[1]

function f([first, second]: [number, number]) {
  console.log(first)
  console.log(second)
}

f(input)
```


剩余变量
```js
let [first, ...rest] = [1, 2, 3, 4]
console.log(first)
console.log(rest)

let [, second, fourth] = [1, 2, 3, 4]
console.log(second)
console.log(fourth)
```

解构object
```js
let o = {
  a: 'foo',
  b: 12,
  c: 'bar'
}

let {a, b} = o

let {a, ...passthrough} = 0
let total = passthrough.b + passthrough.c.length
console.log(total) // 15

let {a: newName1, b: newName2} = o //新创建newName1和newName2两个变量

//但是在ts里下面 不好写
let newName1 = o.a // 等同于这种
let newName2 = o.b

//如果想制定类型，只能对完整对象类型制定
let {a, b}: {a: string, b: number} = o
```

默认值情况
```js
function keepWhooleObject(wholeObject: {a: stirng, b?: number}) {
  let {a, b=1001} = wholeObject //b给默认值 也可以拿到a 和b两个值 
}
```

函数声明的场景 （解构对于函数声明）
```ts
// type语法之后讲
type C = {a: string, b?: number}

// 解构的值的默认值 b是undefined的时候 b 
function f({g, b}: C): void {
  
}


function f({a, b = 0} = {a:''}): void {


}
f({a: 'yes'})
f()
f({}) // 没有a报错 函数解构在参数声明里用到

// 甚至还有嵌套 还是难以理解的 解构这样子

```
### 展开

