---
titile：webpack-plugin-api
---

原文：https://zhuanlan.zhihu.com/p/40930680

Webpack大家应该很熟悉了，一个让前端开发者从入门到放弃的典型代表。webpack提供了两个特别重要的机制：loader和plugin。

\- loader就像一个翻译人员，能够将原文件经过转换输出新的结果，并且一个文件还可以链式的经过多个文件进行转换。所以，loader功能就是转换，其本质就是一个函数。

\- plugin就是用来增强webpack的功能的。webpack通过plugin机制可以让其更灵活，来适应不同的开发场景。plugin的本质是一个类，可以在webpack的生命周期中被多次的调用。

webpack的plugin是事件驱动的，在webpack运行的生命周期中会广播很多的事件。我们可以监听这些事件，在合适的时机通过webpack提供的api来改变编译的输出结果。

前面说过，plugin的本质是一个类。这个类必须实现的方法就是apply。所以，一个基础的plugin如下：

```js
class MyPlugin {
 constructor(options) {

    }
 // 必须要实现的方法，这个方法接收一个参数：compiler对象
 apply(compiler) {
 // 可以在这个参数上来监听事件
 compiler.plugin('event-name', (compilation) => {

        })
    }
}

modulee.exports = MyPlugin
```




我们可以在webpack配置中使用这个插件：

```js
const MyPlugin = require('./MyPlugin)

module.exports = {
 // ...
 plugins: [
 new MyPlugin(options)
    ]
 // ...
}
```



这里，我们需要先明白webpack是怎样运行插件的。
webpack在启动之后，在读取配置的过程中会先执行`new MyPlugin(options)`操作，初始化一个`MyPlugin`实例对象。在初始化compiler对象之后，会调用上述实例对象的apply方法并将compiler对象传入。这样我们就可以在插件实例的apply方法中，通过compiler对象来监听webpack生命周期中广播出来的事件。在事件中，我们也可以通过compiler对象来操作webpack的输出。

在webpack的plugin运行的过程中存在两个非常重要的对象：`compiler`和`compilation`。

\- compiler：在初始化compiler对象之后，通过调用插件实例的apply方法，作为其参数传入。这个对象包含了webpack环境的所有的配置信息，比如options，loaders，plugins等。这个对象会在webpack被启动的时候进行实例化，全局且唯一的。

\- compilation：这个对象会作为plugin内置事件回调函数的参数。包含了当前的模块资源，编译生成的资源，变化的文件等信息。如果我们运行在开发模式，每当检测到一个文件的变化，就会生成一个新的compilation对象。

所以，compiler代表了webpack从启动到关闭的整个生命周期，而compilation仅仅代表了一次新的编译。

传递给每一个插件的compiler和compilation对象都是同一个引用。如果我们在一个插件中修改了compiler或者compilation对象上的属性，就会影响到后面的插件。关于这一点，我们在写插件的时候需要注意。

wenpack在运行的过程中会广播事件，plugin应该只需要监听它所关注的事件。webpack的事件机制是基于观察者模式的。plugin不仅能够监听事件，也能够广播事件和其他的插件进行通信。

webpack提供了很多的内置事件，我们可以根据插件所需要实现的功能有选择的监听这些事件。事件有同步和异步之分。异步事件会接收两个参数，第二个参数为回调函数，在插件处理完任务的时候我们需要调用这个函数来通知webpack进入下一个处理流程。否则，运行将会被阻塞。

~~~js
compiler.plugin('event', (compilation, callback) => {
 // 这种形式就表明这是一个异步事件
 // 处理结束后需要调用callback参数，否则流程会被一直卡在这里不会向下运行
 callback()
})
```
除了监听内置事件外，我们也可以监听和广播自定义事件。这种功能就实现了插件之间进行通信的功能。
```js
// 这些都是自定义事件

// 广播事件
compiler.apply('event-name', params)
// 监听同名的事件，当这个事件触发的时候，回调函数就会被执行
compiler.plugin('event-name', params => {

})
~~~



理解了上面的基本原理及webpack的事件机制后，下面介绍一些webpack常用的内置事件。webpack内置事件有很多，具体的可以参考[webpack文档]([https://webpack.docschina.org/api/plugins/](https://link.zhihu.com/?target=https%3A//webpack.docschina.org/api/plugins/))。

**1. emit事件**

当这个事件被触发的时候，表示源文件的转换和归并已经完成，我们可以通过监听这个事件读取最将输出的资源、代码块、模块及其依赖，并且也可以在这个事件中修改输出的资源的内容。

```js
class MyPlugin {
 apply(compiler) {
 // 监听emit事件
 compiler.plugin('emit', (compilation, callback) => {
 // 这是一个异步事件
 // 得到compilation对象
 // compilation.chunks是一个数组，存放了所有的代码块
 compilation.chunks.forEach(chunk => {
 // 一个chunk是一个代码块
 // 一个代码块是由多个模块组成的。
 // 我们可以通过chunk.forEachModule来读取代码块中的每一个模块
 chunk.forEachModule(module => {
 // module就表示了我们代码中的每一个模块了
 // 我们可以通过module.fileDependencies获取当前模块所依赖模块的文件路径
 // 也是一个数组
 module.fileDebpenencies.forEach(file => {

                    })
                })

 // 我们也可以通过chunk.files属性获取到这个chunk包含了哪些文件
 chunk.files.forEach(file => {
 // 结合compilation，我们可以获取到每个文件的源文件
 // compilation.assets属性包含了当前即将输出的所有的资源
 // 调用一个资源的source()方法就能获取这个资源的内容了
 const source = compilation.assets[file].source()
 // ...操作
                })
            })
        })
    }
}
```



**2. watch-run事件**

当我们运行在开发模式下，每次文件改变的时候都会触发一次新的编译，生成一个新的compilation对象。如果我们想知道哪个文件发生了变化，我们就可以监听 watch-run 事件

```js
class MyPlugin {
 apply(compiler) {
 compiler.plugin('watch-run', (watching, callback) => {
 // 我们可以通过以下属性获取变化的文件的列表
 // watching.compiler.watchFileSystem.watcher.mtimes
        })
    }
}
```



**3. after-compile事件**


这个事件会在每次编译结束后被调用。我们可以在这个事件中修改compilation对象来改变后面的编译的行为。比如，webpack在默认情况下只会监听入口及其依赖的文件是否发生了变化。对于某些情况下，webpack并不会监视html文件的变化，所以，我们可以将html文件加入到依赖列表中，这样在html文件变化的时候也会触发一次新的编译。

```js
class MyPlugin {
 apply(compiler) {
 compiler.plugin('after-compile', (compilation, callback) => {
 // 把对应的html文件添加到文件的依赖列表中，当html文件发生变化的时候触发一次新的编译
 compilation.fileDependencies.push(htmlFilePath)
 callback()
        })
    }
}

```



**4. 修改输出**


在emit事件中我们说过，webpack所有需要输出的资源都存放在compilation.assets中。这个属性是一个键值对，键就是要输出的文件的名称，值就是这个文件所对应的内容。我们可以通过修改这个对象来修改、添加或者删除将要输出的资源。

```js
class MyPlugin {
 apply(compiler) {
 compiler.plugin('emit' (compilation, callback) => {
 // 修改名称为filename的文件的输出
 	if(compilation.assets[subPageJSPath]){
    compilation.assets[subPageJSPath] = {
      source(){
        return finalContent;
      },
      size(){
        return finalContent.length;
      }
    }
  }
}
                 
//不要使用 compilation.assets['pathtoasset']._value = 'xxx' 这种情况下可能会导致某些修改不会更新
```


**5. 读取webpack的配置**

compiler对象可以看作是webpack的实例。我们可以在插件中通过这个对象直接获取我们在配置webpack时候传递的配置参数。

```js
class MyPlugin {
 apply(compiler) {
 // 传递给webpack的配置就保存在 compiler.options 对象中

 // 获取设置的loader列表
 console.log(compiler.options.loaders)
 // 获取context
 console.log(compiler.options.context)
 // 获取插件列表
 console.log(compiler.options.plugins)
 // ....
    }
}
```

### 6 添加额外的watch文件

由于webpack只会对入口依赖以及其相关的依赖文件进行监听，当这些文件变化的时候会触发重新编译，但是某些情况下我们可能需要对于一些非webpack构建的依赖树上的文件变化的时候进行重新编译

方案一：可以自己写一个简单的插件进行实现

```javascript
compiler.hooks.afterCompile.tap('after-compile', compilation => {
    // for adding a specific file
    fileDependencies.forEach(file => {
      compilation.fileDependencies.add(resolve(file));
    });

    // for adding a dir
    dirDependencies.forEach(dir => {
      compilation.contextDependencies.add(dir);
    });
});
```

方案二：可以使用现有的插件 extra-watch-webpack-plugin

[extra-watch-webpack-plugin](https://github.com/pigcan/extra-watch-webpack-plugin)

[
](https://link.zhihu.com/?target=https%3A//webpack.docschina.org/api/plugins/)