---
title: Axure学习1
categories:
  - 个人提升
  - 产品类工具
thumbnailImage: 'http://cdn.ekko306.top/cover/%E4%BB%8A%E3%80%81%E3%81%9D%E3%81%93%E3%81%AB%E3%81%82%E3%82%8B%E6%98%8E%E6%BB%85%E3%81%A8%E7%BE%A4%E7%94%9F.jpg'
date: 2021-12-09 09:22:02
tags:
coverImage:
coverCaption:
gallery:
---
Axure的随手笔记，简洁一点快速上手，这一部分是文档，下篇文章是Tutorials教程
<!-- more -->
<!-- toc -->
# Getting Started
## Getting Started with Axure RP
几个基础概念：
1. Pages，最左边窗口，分不同的页面
2. Canvas，画布，主要设计的地方，可以无限的设计，或者设计画布大小
3. widgets，组件，就是画布上的可复用组件，一个是可以下载别人的组件库，一个是有**Style**在右边窗口设计组件的样式
4. interaction，设置在widgets上可以交互，在右边窗口和style一起分页，比如可以设计交互是点击跳到别的页面，这个最关键，相当于javascript，是复杂的交互工作，还有复杂的功能只能根据他的选项配置，重要熟悉几个例子就会了
5. 比如文档里说了interaction的功能可以
	1. 展示或隐藏widgets
	2. 或者改变样式
6. 还能分享，简单

## The Axure RP Environment
看下Axure RP的环境界面
界面正中心是canvas画布，你可以通过来别组件创建图标，周围有工具栏，可以自定义。
![123](https://docs.axure.com/assets/screenshots/rp-10/axure-rp/environment-map.png)


1. 1叫做主工具栏和样式工具栏，编辑widgets组件或者调整样式组件和发布，还能切换工具栏
2. 2是主画布可以拖拽组件，可以改变颜色，维度，添加网格线或者调整标尺
3. 3是页面可以添加处理页面
4. 4是一个预览图，可以看当前页面的所有widgets和components和动态的模板
5. 5是库，是一些组件复用的，可以添加别人的库，一些最小的组件
6. 6是组件，可以自定义一个部分 比如登录栏 作为自己的复用的组件，添加库里的最小单元
7. 7是样式编辑样式，对于page可以选择画布大小，Add Adaptive Views可以添加多种尺寸页面
8. 8是交互，动态逻辑
9. 9是注释 可以添加自己的产品逻辑

自定义环境：
可以自己配置自己习惯的东西 这里再说 主要是有东西找不到了 可以去配置方法查找，画布里也可以自己拖动



在View-Toolbars-Customize Main Toolbar配置

底下有个show labels under icons 极简模式
右上角有resotre 还原布局

## Viewing and Sharing Your Prototypes
可以自己浏览器预览原型，也可以发布出去（作为HTML输出打包）

### 预览
右上角播放按钮
预览的时候可以实时刷新，预览只能本机预览，如果要跨设备可以发布到云环境或者导出HTML输出


1. console 预览的时候可以通过console来排除查看故障
2. 预览选项可以在preview里配置，选择Publish-Preview Options
3. 还可以发布到云上，云上还可以讨论
4. 还有个更棒的功能，点击Inspect可以查看设计稿的基本参数，就能直接当设计稿用了
5. 还有更多选项 发布到手机或者 本地发布 自己有用处不大 有兴趣可以学


## Keyboard Shortcuts
快捷键
https://docs.axure.com/axure-rp/reference/keyboard-shortcuts/


## Auto-Saved Backup Files

这个保存，还有历史记录
配置File-Recover File from Backup 可以选择多久保存一次和历史

# Working with Widgets
## Organizing Widgets

1. 可以左边Libraris拖进来，也可以左上角工具栏添加，拖进来后可以在Style配置x和y确定特定的位置，拖进来可以配置是否和网格对齐
2. 可以一次定位多个widgets，可以配置X和Y确定和画布的相对距离，两种配置
	1. 一个是多种一起配置，选择View-Toolbars-Style Tool 打开，然后在顶部配置，其他多选，这样别的会相对位置
	2. 另一个是配置单独的选中之后在右边的style配置
3. 可以改变widgets的大小，可以按住shift来锁定宽高比或者点击锁来锁定，输入一个值之后按Shift Enter来保持宽高比
4. 可以开启两个组件之间的距离，可以按住Alt或者自动出现
5. 给widgets命名，默认widgets没有命名，填写文字也会以文字命名，或者 在Style窗口下命名
6. 给widgets分组，可以将多个组件变成一组
7. 叠层顺序：就是z轴的顺序，outline页面按TAB会按顺序切换，也可以右侧按钮选择排列顺序 ，也可以点击工具栏Front和Back来切换叠层顺序
8. 还可以一键折叠 右上角按钮最底下选项
9. 还可以对齐，在工具栏上方，要至少选择两个组件在选择对齐方式
10. 还可以锁定组件，可以右键选择Locking
11. 还可以点击眼睛隐藏组件

## Widget Groups

1. 有一堆逻辑一起的组件一起可以作为一个组
2. 工具栏有group和ungroup，左侧outline可以编辑group的成员，group以文件夹的形式存在
3. 一些组件称为组之后也会有共同的边界constraints，大的组被缩放之后边界也会一起缩放，可以选择单独一个constraint然后锁定高度或者宽度(RP 10才有)
4. 作为一个组的话，可能对交互也有一些改变，都是整体和单个的冲突/选择问题
	1. 第一个是Push/Pull on Groups 可以让整个group推送出来，或者只推出一部分（大概理解，实际自己碰到操作几遍就懂了）
	2. 设置mouse的style，如果全部设置在group，可以全部触发，也可以自己
	3. group可以设置整体事件 group的事件和小的widgets的事件冲突 优先触发widgets

感兴趣建议完整读完英文文档 这里主要“意会”与“快速上手”或者“首次理解”



## Styling Widgets
样式设置，在Style栏目，自己尝试，找不到再查文档

难一点技巧：
1. 类似office的样式复用，widget style也可以复用
2. widget style manager 默认设置样式，也可以编辑多个
3. team project的 style 团队合作更新整体的style
4. 幅值和粘贴样式，同理interaction也可以幅值，注意操作
5. Format Painter格式编辑器，应用于样式
6. 交互的样式

不用记 自己有需要（搞个项目统一样式好麻烦 看这个复用 多试几遍就记住了 不用的就不用记 可以了解知道有这个东西）


## Widget Libraries
1. 从不同的Libraries之间切换
2. 可以点击增加本地库新的库，也可以搜索云端的库增加
3. 可以自己创建自定义widgets，选择File-New Librarr创建新的库，然后Pages就会变成Widgets，别人就可以使用
4. 还可以创建文件夹，作为库的文件夹形式，库的文件也可以添加交互作为复用
5. 每个widget也可以添加一个封面icon给别人展示，还可以在style添加注释
6. tooltip，widgets的提示 5秒


## The Grid, Guides, and Snapping
软件有一些特性帮助你布局你的组件。您可以显示和自定义背景网格以及可以特定于页面或全局应用于项目中所有页面的垂直和水平参考线。 您可以将它们用作简单的视觉指南，或者让您的小部件自动对齐它们并相互对齐。

1. 网格，在View-Rulers, Grid and Guides设置开启网格和贴近网格，还可以在Arrange-Rulers, Grid and Guides-Grid setting把点设置成网格
2. 点击左边和上边的尺再拉出来可以显示出辅助线（guides），有全局的辅助线也有单个页面的辅助线，自己设置，也可以在View-Rulers, Grid, and Guides-Create Guides创建，也可以选择锁定guide，还可以选择Snap to Guides让组件和辅助线对齐，在guide setting还可以设置组件和辅助下前后欢喜
3. 设置页面大小后还会显示虚线来分割页面大小
4. 在File-Paper Size and Settings 可以设置打印的格式
5. 可以在View-Rulers, Grid and Guides设置是否展示尺，设置标尺前后
6. 在View-Rulers, Grid and Guides-widget Snap settings还可以设置组件是否对齐

# Basic Widgets
很多是比较基础的自带widgets，有些多和繁琐，特别要用可以查一下文档

但是有些组件是特定的不并且有些建议的交互逻辑

比如 radio buttons单选框 还有 drop list

这里重点看几个，别的再查

## Dynamic Panel Widgets
动态面板小部件是内有很多state状态，别的组件可以设置 Set Panel State的操作改变状态，然后这个组件显示不同的内容

动态面板的独特之处在于它们是唯一可以在 Web 浏览器中拖动或滑动的小部件类型。 它们也是唯一可以固定到浏览器窗口中固定位置的小部件类型，使它们成为始终可见的导航标题和侧边栏的理想选择。

1. 创建动态组件：一是可以library里拖出来，而是可以选择普通组件，右键点击create Dynamic Panel，动态组件是有紫色边框包围
2. 管理状态：在画布canvas上：在紫色左上角有几个状态，可以选择看，多个state操作很简单，幅值，删除，增加还有view all；在outline栏目，也可以管理增加幅值删除。也可以换顺序，反正简单
3. 看所有状态：点击view all，break away first state也可删除第一个
4. 样式处理，在style配置就行fill color or image，border啥的
5. 主要特别的有几个特别属性，一是fit to content，勾选后让内容适配紫色边框大小，二是scroll按钮，可以在紫色边框里有滑动轴，三是100% wide是变成浏览器宽度，四是pin to browser讲一个动态组件固定在浏览器相对位置
6. 几个 特别的交互：动态组件有几个别人没有的交互，比如拖拽扫动和滚动，并且状态也可以改变，有个Set Panel State 的时间可以设置某个动态组件的状态，很多选项，ne repeat，previous 易懂
7. 还可以设置过度的效果，叫做fire mouse style effects在交互栏
8. 还有动态组件和内部组件可能有相同冲突的事件，如果冲突了执行内部的而不是外部统一的
9. 这里也可以设置set selected/checked action 和 selection组件差不多 ，下一节看看

## Radio Button Widgets
一个radio按钮可以让用户单选一个选项


radio groups
1. 大多数设计里radio按钮会被弄到一组，可以在interaction选择assign radio group来将多个添加到一个组
2. 还可以设置按钮大小和对齐编辑文本
3. 特殊一点的属性：selected by Default 默认选择 ， Disabled 禁止选择
4. 特别的交互：别的东西可以触发set selected/checked action 让这radio被选择，还可以，这个radio的状态作为别人的判断，有is selected of选项
5. 还有提交按钮，选中radio后回车触发click or tap事件，点击interaction的窗口show all，找到button绑定一个submitbutton来触发提交按钮
6. 按tab的顺序也可以选择




别的用到再查文档也简单，还可以做tutorials熟了就会了

# Managing Pages
## Working with Pages
操作pages，界面 很简单一模就会了，添加删除，文件夹，换顺序啥的

就是有个page的类型可以编程flow 右键选择Diagram Types可以选择变成流程图形式 可以作为思维导图

## Style Pages
这里介绍了所有的page 的style的属性选型
1. page Dddensions选择页面尺寸，一般页面是无限扩展的（auto），但也可以自己指定大小，对手机应用选择Scale to Width
2. Adaptive Views 选择页面多种尺寸
3. Page Alignment 选择对齐方式
4. Fill填充颜色
5. Low Fidelity Mode 减小视觉设计 简化后专注功能UX设计
6. Page Style可以选择预设样式复用，也可以创建管理样式

# Components
## Createing and Using Components
> 1. components 对于某人的项目目的性强
> 2. group 最小组合单位
> 3. library  注重 规范 团队复用


components是widgets的组合来作为自定义复用组件，改变一个会改变所有用到的

一般是headers，footers，和navigation bar作为components


创建：
简单，一个是在canvas放一些widges 选成组之后 右键 create componet，二是在左边components栏目里添加新的 然后编辑

编辑：
在components里打开组件后右边有一些新的属性，不同于page
1. Canvas Color 选择颜色帮助设计 实际使用没用
2. Page notes，可以添加一些components的注释
3. Page Interactions，components的事件会在添加这个组件的时候触发，（就是顺序问题）
4. components views，类似adaptive views允许设置一个组件的不同大小版本组件


增加：
在components 右键点击add 或者 delete 有个弹窗选项


然后右键compoents还有drop behavior，来设置 放置的特性，有几种选项
- Place Anywhere：任意放置
- Lock to Compoents Location 限定在画布上的相对目标，子组件会覆盖第一个
- Break Away：放置到页面上就变成散的了 不作为一个compoent存在

放置同类的compoents之后，可以在style里自定义选择文字和图片 overrides栏目

还可以右键usage report查看components有哪些子组件

也可以添加一些交互，交互跟随开始的定义，好像也可以继承派生啥的


## Component Views
这里具体讲更多一个components的不同view


一个是增加更多Component Views 在窗口右边选择 Add Component Views就行

View也可以继承，在不同窗口选择继承关系，比如继承之后更改父类会影响全部子类


然后是编辑不同的Component Views
可能有的view有一个组件，别的view有不同的，两点技巧：
1. 文档里说的，选择affect All Views，是一次修改所有还是单次只修改被选中的
2. 有个“place”和“unplace”就是对于一个组件可以右键选择place或者unplace选择放不放到页面显示，通用“cross-view”的就设置成unplace之后选择对应版本做到共享和区分


放到页面后 右侧也可以选择对应components view就行

## Raised Events
这个是一种高级一点用法

理解容易

注意这是Components节的技巧

就是可以在很多组合的一个Components外面自定义 多种“函数”（外面选择Interaction定义）

触发函数在Components里定义好，比如点击 会触发某个特定函数

原来Components只是单纯复用的自定义集合

这里相当于给Components添加了另外接口






# Introduction to Interactions

## Event, Cases, and Actions
开始不好理解，试过多种tutorials就好理解了

event=》（定义触发listeners函数）
cases=》（触发函数里写 if 和 else if）（非必须）
actions=》（定义if语句里的操作）

```js

function event(){
	if(case1) {
		action1
	} else if(case2) {
		action2
	} else { (这个被当做else if true，就是default)
		action3
	}
}

var ele=document.getElementById("div1");
ele.onEvent = event

```

如果没有做tutorials还不好做，做了就自然理解了

## List of Events
所有的事件，用到查看，或者从字面也能理解，也可以读一遍了解

但是注意分类：
1. Page and Components Events LIst
2. Widget Events List
	1. All Widgets
	2. Droplists and List Boxes Only
	3. Text Fields and Text Areas Only
	4. Dynamic Panels Only
	5. Repeaters Only

## List of Actions
同理
1. Links
2. Widgets
3. Variables
4. Repeaters
5. Miscellaneous（混杂的）
## Text Link
比较特殊的交互

文本链接

1. 可以选中一段文字 然后右边选择Insert Text Link来创建链接
2. Mask是Axure突出的效果，浏览器不会应用
3. 链接文本的样式也好设置，在Interactions里有默认的mouse over一些样式可以根据需求改
4. 也可以添加更多自定义事件，相当于这个事件之外再添加


## Style Effects
相当于js开发前端的时候，额外定义操作css（classnames包）让样式改变，这里方便的用style effects改变

1. 在Interactions栏里添加 shape properties
2. 同样style effects 也有 不同的events（触发条件），然后定义样式就行
3. 可以copy和paste，在the format painter里


## Animations
很多操作变化之间的过度，可以设置Animations
和css里的 animation属性一样 两个状态之间的过度
https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation

融汇前端开发很容易，所以也还是很好学习前端的启发软件

分成两类，本质没区别，都是animations
1. visibility Effects（给actions，当widgets的可视性改变时触发）
2. movement effects，（当widgets的的位置改变时触发）

# Advanced Interactions
高阶交互
## Variables
做过tutorials好理解了，反而先看这个文章再去尝试会更麻烦，我聪明吧

两类

### Global Variables
容易理解，全局的变量，可以跨pages，在project-global variables里定义
别的地方就可以使用和改变全局变量：
1. 改变：set Variable Value 的actions
2. 使用：set Text的actions，找到对应的使用
3. 使用：也可以在函数表达式的Insert Variable or Function用到全局变量
4. 在发的原型里，右上角可以看到全局变量，一个矩形缺少一遍加上X


### Local Variables
局部变量只能在一个action或者condition的操作里获取（因此每使用变量就要麻烦的定义一次）
tutorials里有，是获取别的组件的top和bottom啥的

## Conditional Logic
就是if else ，如果你写个函数的话，好理解
1. 每一行row就是添加一个表达式比如 name === 'abc'啥的
2. 右上角有Match All 和 Match Any，类似代码的 && 和 ||
3. 然后多重判断，可以多重条件判断，右键选择toggle IF/ELSE
```js
// 例如：
if(text=="") {
	console.log('请输入名字')
} else if (text.length < 2) {
	console.log('请输入大于2的名字')
} else if (true) {
	window.open('页面二')
}


if(text=="") {
	console.log('请输入名字')
}

if (text.length < 2) {
	console.log('请输入大于2的名字')
} else if (true) {
	window.open('页面二')
}
```

每个if是新的一类，if底下再添加if就是嵌套，这种情况是复杂情况使用，例如上面两类判断，上面你会用Axure的condition还原吗？

## Math, Functions, and Expressions
Expressions允许你动态创建表达式或文本，更加灵活，一般是点击f和x的图标

### Writing Expressions
允许用双括号包裹变量和操作
### Numbers and Math
内置的方法，没啥看的，很多是js的方法
### String (Text)
js的字符串方法😂
### Widget Properties
这个特别一点，属性，本质上也是js的element的属性properties，😂 div的啥的属性 width scrollY啥的

### Page, Window, and Cursor
类似js 的window对象，担有特别axure定义的，比如cursor.x，DragX

### Date and Time
时间变量好理解，用到查
### Boolean
js的操作符

## Selection Groups
这个好理解，tutorials用到了，对于set Selected/CHecked的action可以多个分成一组，同一组只能一个被selected
1. 创建，选中多个组件，然后interactions里有selection group选项
2. 可以设置selected style


## Move Action Boundaries
做了是拉动条那个tutorials
move事件选择边界（dynamic Panel）
more options

选择bound可以确定移动的边界
# B站
1. 读基本的reference
2. 读操作Tutorials
3. 反过来读reference的Interaction
4. 留下Reaperters待定（高阶用得少）
5. 自己的毕业设计，和用到的tutorials技巧