---
title:  Vue-Extend Vue-Component
date: 2017-11-28
categories: vue
---

### 1 Vue构造函数一节分析了Vue对象上的属性和方法如何一步步挂载上去的，接下来分析这些方法的具体实现

#### 1.1 Vue.extend(option)

```javascript
export function initExtend (Vue: GlobalAPI) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0
  let cid = 1

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production') {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        )
      }
    }

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    //这里就是调用Vue.extend(option)之后的返回值
    return Sub
  }
}

function initProps (Comp) {
  const props = Comp.options.props
  for (const key in props) {
    proxy(Comp.prototype, `_props`, key)
  }
}

function initComputed (Comp) {
  const computed = Comp.options.computed
  for (const key in computed) {
    defineComputed(Comp.prototype, key, computed[key])
  }
}

```

来看下这个时候Sub构造函数上有哪些方法和属性

* 静态属性

```javascript
Sub.cid 
Sub.options
Sub.extend
Sub.mixin
Sub.use
Sub.component
Sub.directive
Sub.filter

// 新增
Sub.super  // 指向父级构造函数
Sub.superOptions // 父级构造函数的options
Sub.extendOptions  // 传入的extendOptions
Sub.sealedOptions  // 保存定义Sub时，它的options值有哪些
```

* 原型属性

```javascript
Sub.prototype.constructor ==> Super(Vue)
Sub.__proto__ ==> Vue.prototype
//以下还有不可枚举和不可配置的一些属性
Sub.prototype.$props
Sub.prototype.$data
Sub.prototype.$ssrContext
Sub.prototype.$isServer
```

#### 1.2 Vue.component(option)

```javascript
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            )
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          //===========================
          //主要是下面这两行代码，可以看到Vue.component(id,option),最终还是调用的Vue.extend(option)
          //其中option中增加了name属性键值对
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
          //===========================
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        //无论我们传入Vue.component(id,defination)中的defination是一个纯对象or一个函数，都会执行到这里，这里的this指的是Vue构造函数，将我们传递进来的defination给到Vue.options[type]
        //其中type可以是component ,filter directive
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}

```

### 2 接下来我们分析下使用以及所谓的全局注册组件和局部注册组件是如何实现的

* 全局注册:对于全局注册的组件，可以在任意Vue的实例中使用，因为全局注册的组件挂载在Vue.options.components上

```html
	<div id="box">
        <myComp></myComp>
    </div>
	<div id="box2">
        <myComp></myComp>
    </div>
    <script>
        var myCopm = Vue.extend({
            data() {
                return {
                    msg: '我是标题^^'
                };
            },
            methods: {
                change() {
                    this.msg = 'changed'
                }
            },
            template: '<h3 @click="change">{{msg}}</h3>'
        });
//会在Vue.options.components数组上增加一个aaa
        var ret = Vue.component('myComp', myComp);
        console.dir(myComp);
        console.dir(ret);
      //发现以上两个输出都是Sub构造函数
        console.dir(Vue);
      //在这里我们可以去输出里看下。Vue.options.components中多了 myComp
      //这也就实现了全局注册一个Vue组件，然后在
     /** Vue.options = {
            components: {KeepAlive,transition,transitionGroup,myComp}
            directives: {},
            filters: {},
            _base: Vue
         }
	  */
      //全局注册的组件在以下两个Vue的实例上都可以访问到
        var vm = new Vue({
            el: '#box',
            data: {
                bSign: true
            }
        });
      var vm2 = new Vue({
        el:'#box2'
      })
    </script>
```

* 局部注册

```html
<div id="box">
        <myComp></myComp>
    </div>
    <div id='box2'>
      <!-- 不能使用myComp组件，因为myComp是一个局部组件，它属于#box-->
        <myComp></myComp>
    </div>
    <script>
      //声明一个子组件
        var Aaa = Vue.extend({
            data() {
                return {
                    msg: '我是标题^^'
                };
            },
            methods: {
                change() {
                    this.msg = 'changed'
                }
            },
            template: '<h3 @click="change">{{msg}}</h3>'
        });

        var vm = new Vue({
            el: '#box',
            data: {
                bSign: true
            },
            components:{
                'myComp':myComp
            }
        });
      console.log(vm);
      //这里在vm.$option.components上可以看到{myComp:f VueComponent(options)}
      //所以这个就是局部注册的组件
        /**var vm2 = new Vue({
            el:"#box2"
        })*/
    </script>
```

