# 权限相关

## 页面权限和按钮权限

- 创建一个简单的 vue 实例并挂载到 vue-router，此时只有一些不用权限的公用的页面（登录，404,403，首页）
- 当用户登录后，获取用户权限，将用户权限整合成最终用户可访问的路由表（路由，按钮权限）。
- 调用 router.addRoutes()将路由表载入
- 使用 vuex 管理路由表（路由，按钮），根据 vuex 中可访问的路由渲染侧边栏组件
- 设置全局的自定义指令，如果按钮有权限则保留，无权限删除按钮 dom
- 特殊权限可在按钮上使用 v-if 特殊判断

### 注意点

> vuex 保存的数据，刷新后会丢失，使用 vue 全局导航守卫，每次刷新的时候重新获取权限，整合路由表

## 后台管理端

- 菜单管理界面，使用 element-UI 的树形表格和懒加载展示权限，可对权限进行增删改查

# 遇到的问题

## 下载文件，后端报错

- 下载文件的时候需要将请求头中的 responseType 设置 Blob
- 一旦后端抛出错误，blob 数据类型，无法捕获,错误会被误认为文件下载下来
- 将 blob 转为对象类型，判断 code，做相应处理
  ```js
  var reader = new FileReader();
  reader.readAsText(data, 'utf-8');
  reader.onload = function () {
    data = JSON.parse(reader.result as string);
  }
  ```

## 富文本框输入连续不间断数字或者字母导致 v-html 插入溢出

- 使用 css 属性 word-wrap

  > normal: 只在允许的断字点换行(浏览器保持默认处理)<br/>
  > break-word:在长单词或 URL 地址内部进行换行<br/>
  > word-break: normal|break-all|keep-all;

## 未登录状态，点击第三方办理事项，登录后无法判断用户事项权限

- 将本系统作为中间件
- 点击事项，如果未登录保存相关信息到缓存中
- 第三方事项变更回调链接地址为当前页面
- 从缓存中查看是否有需要判断权限
- 拿出事项 id，调用判断权限方法

## 父组件异步传值给子组件，子组件拿不到异步获取的值

- 在子组件中监听传递过来的值
- 如果子组件中需要用传过来的值进行接口请求，判断下是否为默认值，避免资源浪费

# 知识点

## 原型原型链

- 所有的引用类型（数组、函数、对象）可以自由扩展属性（除 null 以外）。
- 所有的引用类型都有一个’\_ _ proto_ \_'属性(也叫隐式原型，它是一个普通的对象)。
- 所有的函数都有一个’prototype’属性(这也叫显式原型，它也是一个普通的对象)。
- 所有引用类型，它的’\_ _ proto_ \_'属性指向它的构造函数的’prototype’属性。
- 当试图得到一个对象的属性时，如果这个对象本身不存在这个属性，那么就会去它的’\_ _ proto_ \_'属性(也就是它的构造函数的’prototype’属性)中去寻找。

## 闭包

### 原理

- 闭包就是能够读取其他函数内部变量的函数
- 将函数内部和函数外部连接起来的桥梁

### 作用

- 内部函数可以引用外部变量

### 缺点：

- 占用更多内存，不容易被释放
- 内部函数占用了外部函数的局部变量，同时内部函数被返回出来：导致内部函数不能被释放，进而导致占用了外部函数的局部变量：导致外部函数无法释放内存

## 作用域

- 全局作用域：在任何地方都能被访问，window 对象下的内置属性都是全局作用域
- 函数作用域：函数声明的时候，会生成一个独立的作用域
- 作用域链：作用域呈层级包含状态，形成作用域链，子作用域的对象可以访问父作用域的对象，反之不能；另外子作用域会使用最近的父作用域的对象
- 同一作用域的对象可以互相访问

## this 指向

- 普通函数调用（fn()），this 指向 window
- 对象里函数调用，this 指向该对象
- 构造函数调用，this 指向新创建的对象
- 通过事件绑定的方法，this 指向绑定事件的对象
- 定时器函数，this 指向 window
- 箭头函数，this 始终指向他的父级，没有父级指向 window
- call()、apply()、bind()、可以改变 this 指向

## call()、apply()、bind()区别

- 第一个参数都是 this 的指向对象
- call 传入多个参数 apply 传入数组
- bind 返回函数，需要再执行一下（）

## nodejs 事件循环

- 执行主线程，如果遇到异步任务放到异步队列中
- 检查事件队列，优先执行微任务（nextTick,promise）
- 再执行宏任务（settimerout、事件监听、setImmediate）

## vue 组件通信 bus

- var bus = new vue(); 使用一个空的 vue 实例 或者 定义到全局

```js
var eventBus = {
  install(Vue, options) {
    Vue.prototype.$bus = vue;
  },
};
Vue.use(eventBus);
```

- 触发 事件 this.$bus.$emit('事件名称', 传递参数)
- 监听事件 this.$bus.$on('事件名称', 处理函数),停止监听 this.$bus.$off('事件名称', 处理函数)

## 判断是数组还是对象

```js
  第一种：
  Object.prototype.toString.call({}) // [object Object]
  Object.prototype.toString.call([]) // [object Array]
  第二种：
  Array.isArray([]) // true
  Array.isArray({}) // false
  第三种：
  arr instanceof Array // true
  obj instanceof Array // false
  第四种：
  arr.constructor === Array // true
  obj.constructor === Array // false
```

## 深拷贝和浅拷贝

### JSON.stringfy()和 JSON.parse()

当值为 undefined、function、symbol 会在转换过程中被忽略。对象值有这三种的话用这种方法会导致属性丢失

### JQ extend

- $.extend( [deep ], target, object1 [, objectN ] )
- deep 表示是否深拷贝，为 true 为深拷贝，为 false，则为浅拷贝
- target Object 类型 目标对象，其他对象的成员属性将被附加到该对象上。
- object1 objectN 可选。 Object 类型 第一个以及第 N 个被合并的对象。

## vue hash 模式和 history 模式

- hash 模式下，仅 hash 符号之前的内容会被包含在请求中，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。
- history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如果后端缺少路由处理，将返回 404 错误。
