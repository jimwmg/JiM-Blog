---
title:  Vue中组件之间的通信机制
date: 2017-12-05
categories: vue
---

**首先要注意的一些细节就是，**

**1 给组件添加props的时候，只能以 -  链接符，然后再组件内部通过驼峰的形式接受**

**2 组件内部接受props的时候，可以通过制定对象的形式对值的类型进行限定**

**3 传递的props，组件内部没有通过props接受，那么对应的props（组件可以接收任意传入的特性）特性都会被添加到组件的根元素上。**

**4 组件内部定义的props,没有传递，可以为其设置默认值**

```javascript
Vue.component('example', {
  props: {
    // 基础类型检测 (`null` 指允许任何类型)
    propA: Number,
    // 可能是多种类型
    propB: [String, Number],
    // 必传且是字符串
    propC: {
      type: String,
      required: true
    },
    // 数值且有默认值
    propD: {
      type: Number,
      default: 100
    },
    // 数组/对象的默认值应当由一个工厂函数返回
    propE: {
      type: Object,
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        return value > 10
      }
    }
  }
})

```



### 1 父子组件之间的通信

**父子组件的之间的额通信在工作中使用的也是特别频繁，接下来简单分析下**
[demo1-html模板的props不支持驼峰](https://jsfiddle.net/JiMWmg/eywraw8t/376489/)
[demo2-template模板的props支持驼峰](https://jsfiddle.net/JiMWmg/eywraw8t/376474/)

* HTML 中的特性名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符。
* 重申一次，如果你使用字符串模板，那么这个限制就不存在了。
产生这样的原因,对于html的模板是通过 outerHTML解析的，但是template的模板是可以通过vue内部解析的；这也就解释了上面两句话
[vue源码中的解析-outerHTML会序列化这样的值-打开控制台看下输出](https://jsfiddle.net/JiMWmg/fatsd240/4/)
[platforms/web/entry-runtime-with-compiler.js](https://github.com/jimwmg/vue/tree/dev/src/platforms/web)



简单注意一点在HTML结构中，属性名要使用 - 连字符的形式，在javascript中需要将驼峰命名的形式转化为驼峰命名的形式

组件定义如下：

```html
<script>
    var myComp = Vue.extend({
        props:['parentIncrease','msg'],
        template:'<div>{{msg}}<button v-on:click="parentIncrease">子按钮</button></div>'
    })
     var vm = new Vue({
         el:"#dv",
         data:{
             total:0,
             msg:'bindResult'
         },
         methods:{
             increatment:function(){
                 this.total++;
             }
         },
         components:{'my-comp':myComp}
     })
    console.log(vm)
    </script>
```

#### 1.1 父组件简单的向子组件传递一个字符串

```html
<div id='dv'>
  <span>{{total}}</span>
  <div>{{msg}}   <button @click='increatment'>父按钮</button>
  <my-comp parent-increase='increatment' msg='msg'></my-comp>
</div>
```

这个时候去vm实例的对象的	$children上可以看到子组件上msg.  parentIncrease属性值都是对应的这些字符串

如果想传递一个数值,下面这种写法传递给组件my-comp的是一个字符串 '123' 

```html
<div id='dv'>
  <span>{{total}}</span>
  <div>{{msg}}   <button @click='increatment'>父按钮</button>
  <my-comp parent-increase='increatment' msg='msg' num='123'></my-comp>
</div>
```

**需要通过v-bind,传递给子组件的才是数值Number类型（或者Boolean 类型，对象等 v-bind:bool='true'）**

```html
<div id='dv'>
  <span>{{total}}</span>
  <div>{{msg}}   <button @click='increatment'>父按钮</button>
  <my-comp parent-increase='increatment' msg='msg' v-bind:num='123'></my-comp>
</div>
```

#### 1. 2 父组件向子组件传递父组件中的数据

向子组件传递的时候通过v-bind（简写 ：）传递父组件数据

此时无论点击子按钮还是父按钮，都可以改变父组件中的total数据；这个时候也就实现了子组件向父组件通信的机制；

```html
<div id='dv'>
  <span>{{total}}</span>
  <div>{{msg}}   <button @click='increatment'>父按钮</button>
  <my-comp :parent-increase='increatment' :msg='msg'></my-comp>
</div>
```

#### 1.3 父组件向子组件传递父组件中的数据

向子组件传递的时候，通过v-on（简写@）向子组件传递数据，v-on向子组件传递数据的时候，其实就是给子组件的 `_events`添加了传递的对象，通过`vm._$children._events`中可以看到传递过去了，所以这个时候可以通过子组件的$emit方法触发传递进来的函数执行；

**同样，$emit可以发出一个广播，即使这个广播没有注册响应的事件，也可以出发，只不过此时不会有其他反应**

在instance/events.js中可以看到，如果触发一个没有注册的事件，那么Vue不会做任何处理，直接返回vm实例对象

```vue
<!-- 通过 $props 将父组件的 props 一起传给子组件 -->
<child-component v-bind="$props"></child-component>
<!-- 绑定一个有属性的对象 -->
<div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

```

```html
    <div id='dv'>
        <span>{{total}}</span>
        <div>{{msg}}   <button @click='increatment'>父按钮</button>
        <my-comp @parent-increase='increatment' :msg='msg'></my-comp>
    </div>

    <script>
    var myComp = Vue.extend({
        props:['parentIncrease','msg'],
      //增加一个方法
        methods:{
            emitIncrease:function(){
                console.log('触发emit')
                this.$emit('parent-increase')
            }
        },
        template:'<div>{{msg}}<button v-on:click="emitIncrease">子按钮</button></div>'
    })
     var vm = new Vue({
         el:"#dv",
         data:{
             total:0,
             msg:'bindResult'
         },
         methods:{
             increatment:function(){
                 this.total++;
             }
         },
         components:{'my-comp':myComp}
     })
    
    </script>
```

#### 1.4 父子组件之间的通信除了通过事件机制和props传递之外，还可以通过组件实例自身上的` $parent $children`等来访问父组件或者子组件，或者在子组件上添加ref属性，然后可以在父组件实例上通过vm.$refs这个对象获取到;

```html
<div id='dv'>
  <span>{{total}}</span>
  <div>{{msg}}<button @click='increatment'>父按钮</button></div>
  <my-comp @parent-increase='increatment' ref='compChild' :msg.sync='msg'></my-comp>
</div>
```

还是上面的例子，父组件实例 vm.$refs.compChild就可以获取到my-comp组件实例对象

```vue
<my-comp @parent-increase='increatment' @change='$emit(myGroupChange,$event)' ref='compChild' :msg.sync='msg'></my-comp>
这样在组件上可以绑定两个事件，事件的名字分别是 parent-increase 和 change
执行this.$emit('parent-increase') 会触发increatment函数;
执行this.$emit('change') 会触发$emit(myGroupChange,$event)函数;
这样用于嵌套父子组件传递事件；
```



### 2 非父子组件之间的通信机制

实现原理就是通过一个空的Vue实例对象作为一个中转站，然后在在这个空的实例对象上绑定事件，注意绑定的事件处理函数要bind其所在的子组件this值；

```html
<script src="https://unpkg.com/vue"></script>
<body>
    <div id='dv'>
        <comp1></comp1>
        <comp2></comp2>
    </div>
    <script>
        
        var eventBus = new Vue({});//声明一个空的Vue实例对象，使用这个空Vue实例对象的事件机制
        var comp1 = Vue.extend({
            template:"<div><span>{{oneCount}}</span><button @click='increaseTwo'>按钮1</button></div>",
            data:function(){
                return {
                    oneCount:1
                }
            },
            methods:{
                increaseTwo:function(){
                    eventBus.$emit('increaseTwo')
                }
            },
            mounted:function(){
                eventBus.$on('increaseOne',function(){
                    this.oneCount++;
                }.bind(this))
            }

        })  ;
        var comp2 = Vue.extend({
            template:"<div><span>{{twoCount}}</span><button @click='increaseOne'>按钮2</button></div>",
            data:function(){
                return {
                    twoCount:10
                }
            },
            methods:{
                increaseOne:function(){
                    eventBus.$emit('increaseOne');
                }
            },
            mounted:function(){
                eventBus.$on('increaseTwo',function(){
                    this.twoCount++;
                }.bind(this))
            }

        })    ;
        var vm = new Vue({
            el:'#dv',
            components:{
                'comp1':comp1,
                'comp2':comp2
            }
        })
        
    </script>
</body>
```

