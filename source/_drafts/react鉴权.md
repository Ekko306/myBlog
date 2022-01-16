---
title: react鉴权
categories:
  - 个人提升
  - 木犀工作台
thumbnailImage: 'https://portal.qiniu.com/kodo/bucket/resource?bucketName=hello-mo'
date: 2021-11-26 09:54:11
tags:
coverImage:
coverCaption:
gallery:
---
找一种好的鉴权方式
<!-- more -->
<!-- toc -->
# react鉴权
想找一种好的鉴权方式
先谷歌搜所有的鉴权方法再比较

## Userfont
https://css-tricks.com/react-authentication-access-control/
先说服务端的鉴权思路
然后说Uerfont怎么在前端配合好鉴权


## RBAC
https://tarunnagpal78.medium.com/tutorial-how-to-create-rbac-role-based-access-control-in-reactjs-87cb9a960cf3
文章简单 代码不对应 有些粗制滥造

主要介绍rbac的概念


## Managing Access Control in a react ui
https://levelup.gitconnected.com/access-control-in-a-react-ui-71f1df60f354

> 四年前的文章，比较详细 代码也是对应的，可能有些老，而且代码是React Native的跑不起来，还好找到了另外codesandbox是react的，[链接](https://codesandbox.io/s/react-redux-rbac-converted-from-rn-rj328?file=/src/AccessControl.js)

[原仓库代码](https://github.com/duhseekoh/demo-access-control-in-react)

Managing Access Control in a React App
在React应用里处理权限管理


想象你正在构建一个React.js应用。想象应用的目的是管理一个原子核反应器。现在……想象一下这个应用程序只存在这样我就可以写一篇关于在 React 中实现访问控制的 Medium 文章。很好，让我们开始吧（提示：这篇文章所有例子都是基于React Native 但是可以很方便用到web React）

![img1](https://miro.medium.com/max/1400/0*NznbEzq8NNWeNy3K)
用于核电站控制应用程序的线框和应用程序 UI

什么决定了用户在应用里可以看见什么（权限）？
我知道我仅仅想要一些用户来控制反应器，其他用户只能读取反应器当前的状态，其他很少的用户可以激活一个紧急能量供应，还有一些只能每小时读取安全检查，还有一些可以在发电厂内部发出警报的用户等。很明显我对原子反应堆了解很多。

### 基础——React的条件情况
在我们谈论控制一个原子反应堆前，我们要了解如何在React得到一些基本逻辑？

在React中定义UI的声明性让添加条件显示逻辑变得简单明了。我们可以在组件控制页面的展示和消失，React很容易。

```
// Conditionally display a LoginScreen if there's no user  
const App = ({ user }) => (  
<View>  
{!user && <LoginScreen />}  
{user && <WelcomeScreen user={user} />}  
</View>  
);
```
如果我们\<App\>有一个用户通过，然后我们会展示WelcomeScreen，其他情况展示LoginScreen。这个是权限控制最简单的基础，一个简单的控制。

我们如何围绕这个构建一个模式？我们不仅需要知道用户是否登录，还需要实时确定用户在应用程序有哪些特定的功能。

### 细化——基于权限的访问控制
维基百科有一篇很好的文章关于 ‘[Role-based access control](https://en.wikipedia.org/wiki/Role-based_access_control)’

> 在一个组织里，角色从不同的工作函数创建。执行某些操作的权限分配给特定角色。成员或职员（或其他系统用户）会被分配特定角色，然后通过那些角色分配分配一些系统功能的特定权限。

在前端，我们不用太多角色roles，只用考虑角色对应的一些权限。

如果你正在创建一个售卖系统，你可能给商家权限去用折扣重写特定商品的价格，而其他的店员没有这个权限。你可能甚至在UI例隐藏操作特性给那些不能操作的人，这可以通过为每个用户分配一组权限来实现。

对于核电站控制应用呢？让我们想一些可以分配给程序用户的权限，为了简单，是一个有限的集合，每一个权限对应于一个UI面板。（就是特定人员显示特定的按钮）

![img2](https://miro.medium.com/max/418/1*dHGxDyEELs83oGZWNrt8gg.png)

然后这些用户有什么特点？
```
User: Plant Manager
Permissions: read:stats, control:emergencyalert, control:reactor

User: Safety Inspector
Permissions: read:stats
```

Plant Manger可以做任何事情，然而Safety Inspector只能看下反应堆的的状态。

我们有我们的UI布局定义，一些用户，一些权限，然后怎么让这些权限在UI例能够获取到？

### 编码为React组件
现在UI的关系，权限和用户定义了,一个React组件可以被构建来实现上述关系

它将会提供一个良好定义的接口来管理一些变量用来决定组件的视图，决定是否展示被保护的视图。

属性：
- `children`—如果用户有权限，那么这个"被保护的组件"会被展示
- `userPermissions`—分配给登录用户的权限
- `allowedPermissions`—权限列表，如果登录用户拥有其中之一，那么他们可以看到`children`
- `renderNoAccess`—当用户无权访问受保护组件时运行/显示的渲染道具

这种组件的名字：`<AccessControl>`

逻辑图：
![img3](https://miro.medium.com/max/1232/0*4JlEvljl_xK89J9M)


使用例子：
```
<AccessControl
  userPermissions={userPermissions}
  allowedPermissions={["read:stats"]}
  renderNoAccess={() => <NoAccess permissionsNeeded="read:stats" />}
>
  <StatsPanel />
</AccessControl>
```

这里`AccessControl`组件包裹了一个`StatsPanel`组件，在这种特定情况下，用户有一个权限`readLstats`并且`allowedPermissions`的一个内容是`read:stats`，那么用户就能看见StatsPanel组件

组件实现方法：
```js
// v1 AccessControl.js...const AccessControl = ({  
  userPermissions,  
  allowedPermissions,  
  children,  
  renderNoAccess,  
}) => {  
  // checkPermissions function verifies that one of the userPermissions is in the set of allowedPermissions  
  const permitted = checkPermissions(userPermissions, allowedPermissions);  
  
  if (permitted) {  
    return children;  
  }  
  return renderNoAccess();
};
```

### 构建核反应堆App
`AccessControl`组件构建好了，让我们来使用来构建反应app。

这里是简单的UI，动图的形式
![imgGif](https://miro.medium.com/max/774/1*BRnhOYwk_cChehWdJF_yBQ.gif)

代码实现，有多个AccessControl
```
...
<ScrollView style={styles.container}>
  ...
  <UserDetails user={loggedInUser} />
  <AccessControl
    userPermissions={userPermissions}
    allowedPermissions={["read:stats"]}
    renderNoAccess={() => <NoAccess permissionsNeeded="read:stats" />}
  >
    <StatsPanel />
  </AccessControl>
  <AccessControl
    userPermissions={userPermissions}
    allowedPermissions={["control:emergencyalert"]}
    renderNoAccess={() => (
      <NoAccess permissionsNeeded="control:emergencyalert" />
    )}
  >
    <EmergencyAlertPanel />
  </AccessControl>
  <AccessControl
    userPermissions={userPermissions}
    allowedPermissions={["control:reactor"]}
    renderNoAccess={() => (
      <NoAccess permissionsNeeded="control:reactor" />
    )}
  >
    <ShutdownPanel />
  </AccessControl>
</ScrollView>
...
```

上面展示的是三个AccessControl 组件的用法，他们每个都有自己保护的组件和权限来控制获取到被保护的组件。假设 userPermissions 是一个作为 prop 出现的数组，由您存储登录用户信息的任何位置提供。


### 一个更简洁的接口——通过Redux
(上面说userPermission是一个存储的信息的地方，这里可用redux存储)

任何与由权限控制的应用内条件 UI 相关的应用都已经足够复杂，以至于这些条件访问控制情况会经常出现。所以你可能在一个页面有成千上万个AccessControl组件，不断地在当前范围内提供用户的权限并将它们作为道具传递给 AccessControl 的每个实例会变得很乏味。相反，让我们将 AccessControl 连接到 Redux，它始终可以访问用户的权限。

更新的原理图：
![img5](https://miro.medium.com/max/1232/0*l5_Qs2QQldfSuEl4)

实现代码：
```
const AccessControl = ({
  userPermissions,
  allowedPermissions,
  children,
  renderNoAccess,
}) => {
  const permitted = checkPermissions(userPermissions, allowedPermissions);
if (permitted) {
    return children;
  }
  return renderNoAccess();
};
...
// Compose AccessControl component with redux
export default connect(state => ({
  userPermissions: state.auth.user && state.auth.user.permissions,
}))(AccessControl);
```

通过connecting（连接）AccessControl到redux，这个组件自动有`userPermissions`属性应用到上面，无论组件在什么地方（不用传递userPermissions）


```
**_// ----------------------------------------------  
// without redux  
// ----------------------------------------------_**<AccessControl  
   ** userPermissions={userPermissions}**  
    allowedPermissions={["read:stats"]}  
    renderNoAccess={() => <NoAccess permissionsNeeded="read:stats" />}  
  >  
    <StatsPanel />  
  </AccessControl>**_// ----------------------------------------------  
// with redux - no need to supply userPermissions  
// ----------------------------------------------_**<AccessControl  
  allowedPermissions={["read:stats"]}  
  renderNoAccess={() => <NoAccess permissionsNeeded="read:stats" />}  
>  
  <StatsPanel />  
</AccessControl>
```

[例子链接](https://github.com/duhseekoh/demo-access-control-in-react/blob/master/example-apps/v2-access-control-redux/ExampleApp.js)

注意：Redux 可以替换为您使用的任何状态管理解决方案（MobX、Apollo、Realm、localstorage 等……）注意：Redux 可以替换为您使用的任何状态管理解决方案（MobX、Apollo、Realm、localstorage 等……）

### 不是所有东西可以用权限Permissions解决
（简单来说就是可能普通管理员有很多normal user，但是user有不同国家的，对于不同国家的normal user 还可以增加额外的权限，更加细分灵活）

有一些情况例如静态的权限不能提供足弓的信息判断一个用户能否做一些事情。关于该用户或其与某个其他实体的关系的其他变量可能最终确定该用户是否具有许可。

让我们考虑一个更复杂的例子。 原来我们的电厂应用程序现在是一个 SaaS 产品，来自世界各地的运营商可以登录并控制他们自己的电厂。我们不希望朝鲜的电厂经理控制美国的电厂，即使他们拥有使用这个全球可用的 SaaS 产品的必要权限。 这个更具体的限制可以通过向我们的组件添加一个更多的 prop 来实现，这个函数中的访问逻辑太复杂而无法仅凭权限来处理，可以被烘焙到其中。

就是额外增加一些prop（三个字段），来判断额外的权限，代码里是，多加入user的字段，看user的权限：`accessCheck(extraAccessData, user) &&`

实现：
```js
...
const AccessControl = ({
  user,
  userPermissions,
  allowedPermissions,
  children,
  renderNoAccess,
  accessCheck,
  extraAccessData,
}) => {
  let permitted;
  // when an accessCheck function is provided, ensure that passes as well as the permissions
  if (accessCheck) {
    permitted =
      accessCheck(extraAccessData, user) &&
      checkPermissions(userPermissions, allowedPermissions);
  } else {
    // otherwise only check permissions
    permitted = checkPermissions(userPermissions, allowedPermissions);
  }
  if (permitted) {
    return children;
  }
  return renderNoAccess();
};
...
export default connect(state => ({
  userPermissions: state.auth.user && state.auth.user.permissions,
  user: state.auth.user,
}))(AccessControl);
```

新增三个字段：
- accessCheck——一个函数拥有自定义函数，如果提供了，对于权限的看保护组件的用户返回true
- extraAccessData——一种使数据可用于访问 accessCheck 方法的便捷方法，而无需在定义 accessCheck 方法时“关闭”该数据，就是辅助accessCheck的数据
- user——通常，运行自定义访问检查所需的必要数据存储在用户身上，因此这里我们将存储在 redux 中的用户提供给 AccessControl 组件，并在运行时将其传递给 accessCheck 函数（就是state.auth.user）

然后下面的使用例子，来阻止朝鲜的操作
```
<AccessControl
  extraAccessData={{ allowedNationality: "USA" }}
  accessCheck={(extraAccessData, user) =>
    user && user.nationality === extraAccessData.allowedNationality
  }
  renderNoAccess={() => (
    <View style={styles.countryWarning}>
      <Text style={styles.noAccessText}>
        Only Nuclear engineers from the USA 🇺🇸 can access this system.
      </Text>
    </View>
  )}
>
... // protected content
</AccessControl>
```


### 就是这样
这不是唯一的方法再React写权限控制逻辑，但我喜欢，因为它对于React的声明式原则很符合。它遵循久经考验的基于角色/权限的访问控制模型，您的后端、系统可以围绕相同的设置构建其访问逻辑。从这个基本的 AccessControl 定义开始，可以围绕它构建很多东西。 添加 redux 集成，创建一个封装逻辑的 HOC，创建一个烘焙附加逻辑的包装器组件。

### 在浏览器中运行不同版本的原生电厂应用程序
[https://snack.expo.io/@git/github.com/duhseekoh/demo-access-control-in-react](https://snack.expo.io/@git/github.com/duhseekoh/demo-access-control-in-react)
### 或者在Github查看相同的源代码
[https://github.com/duhseekoh/demo-access-control-in-react](https://github.com/duhseekoh/demo-access-control-in-react)


### 代码
例子代码和转换成React的代码有bug

一个是在AccessControl里写好connect
外面页面就不需要connect了（这个组件自动连接到store获取属性）


另一个是在每个特定的页面给大组件连接store获取属性
这样每个页面写的地方比较多


但第一个方法考虑效率？ 每个组件获取store但是省事

暂时用第一种 其他再说