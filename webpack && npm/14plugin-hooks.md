---

---

### 1 webpack  compiler和compilation的钩子函数

webpack简单配置

```javascript
const LearnPluginHooks = require('./plugins/plugins-hooks.js')
module.exports = {
  context: path.resolve(__dirname, './'),
  entry: {
    app: './src/index.js'
  },
  output: {
    path: dist,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules'
      },
      {
        test: /\.jpe?g$/,
        loader: 'url-loader'
      },
      {
        test: /\.png$/,
        loader: 'file-loader?name=[name]_[hash].[ext]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new LearnPluginHooks(), //这里引入这个插件，在这个插件中看各个钩子函数的执行时机
  ]
}

```

项目的`node_module/.bin/webpack`顶部加一行代码用于调试

```javascript
#! /usr/bin/env node --inspect-brk
```

执行之后浏览器地址栏输入  `chrome://inspect`

### 2 plugins-hooks.js

```javascript
function PluginsHooks (){
  
}
PluginsHooks.prototype.apply = function(compiler){
  debugger;
  
  compiler.plugin('entry-option',function pluginsHooksCb(...args){ //3 WebpackOptionsApply.js [options.context, options.entry]
    debugger;
  }) ;//syncBialHook
  compiler.plugin('after-plugins',function pluginsHooksCb(...args){ //4 WebpackOptionsApply.js [compiler]
    debugger;
  }) ;//syncHook
  compiler.plugin('after-resolvers',function pluginsHooksCb(...args){ //5 WebpackOptionsApply.js [compiler]
    debugger;
  });//syncHook
  compiler.plugin('environment',function pluginsHooksCb(...args){ //1 webpack.js []
    debugger;
  })//syncHook
  compiler.plugin('after-environment',function pluginsHooksCb(...args){ //2  webpack.js []
    debugger;
  })//syncHook
  compiler.plugin('before-run',function pluginsHooksCb(...args){
    // 6 before-run Compiler.js [cimpiler,callback]
    debugger;
    let callback = args[1];
    callback();//必须执行该回调，webpack才会继续执行
  })//AsyncSeriesHook
  compiler.plugin('run',function pluginsHooksCb(...args){
    // 7 run Compiler.js [cimpiler,callback]
    debugger;
    let callback = args[1];
    callback();//必须执行该回调，webpack才会继续执行
  })//AsyncSeriesHook
  compiler.plugin('normal-module-factory',function pluginsHooksCb(...args){
    //8  normal-module-factory Compiler.js [normalModuleFactory] 
    debugger;
  })//syncHook
  compiler.plugin('context-module-factory',function pluginsHooksCb(...args){
    //9 context-module-factory Compiler.js [contextModuleFactory] 
    debugger;
  })//AsyncSeriesHook
  compiler.plugin('before-compile',function pluginsHooksCb(...args){
    //10 before-compile Compiler.js [compilationParams,callback] 
    debugger;
    let callback = args[1];
    callback();//必须执行该回调，webpack才会继续执行
  })//AsyncSeriesHook
  /** 
   * params:newCompilationParams() {
		const params = {
			normalModuleFactory: this.createNormalModuleFactory(),
			contextModuleFactory: this.createContextModuleFactory(),
			compilationDependencies: []
		};
		return params;
	}
  */
  compiler.plugin('compile',function pluginsHooksCb(...args){
    //11 compile Compiler.js [compilationParams] 
    debugger;
  })//syncHook
  //对于compilation的钩子函数一般放在this-compilation 和 compilation 里面
  compiler.plugin('this-compilation',function pluginsHooksCb(...args){
    //12 this-compilation Compiler.js [compilation,params] 
    debugger;
    let compilation = args[0];
    compilation.plugin('build-module',function(...args){
      //1 [ module] 此时的 module._source = null 所有的依赖的模块都会经过这个
      debugger;
    })
    compilation.plugin('rebuild-module',function(...args){
      debugger;
    })
    compilation.plugin('failed-module',function(...args){
      debugger;
    })
    compilation.plugin('succeed-module',function(...args){
      //3  [ module] 此时的 module._source = {_name,_value} 表示某个模块已经经过loader编译完毕
      debugger;
    })
    compilation.plugin('finish-rebuilding-module',function(...args){
      debugger;
    })
    compilation.plugin('seal',function(...args){
      // 4 build-module  normal-module-loader succeed-module 这三个声明周期执行完所有的module编译之后，然后才会执行seal这里；
      debugger;
    })
    compilation.plugin('unseal',function(...args){
      debugger;
    })
    compilation.plugin('optimize-dependencies-basic',function(...args){
      debugger;
    })
    compilation.plugin('optimize-dependencies',function(...args){
      debugger;
    })
    compilation.plugin('optimize-dependencies-advanced',function(...args){
      debugger;
    })
    compilation.plugin('after-optimize-dependencies',function(...args){
      debugger;
    })
    compilation.plugin('optimize',function(...args){
      //5 [] 一个空数组
      debugger;
    })
    compilation.plugin('optimize-module-basic',function(...args){
      debugger;
    })
    compilation.plugin('optimize-modules',function(...args){
      //6 [module1,module2,....] 编译后的module数组，里面存放着经过loader编译之后的结果 module._source : {_value,_name} _name:表示文件路径，_value:表示文件经过loader编译之后的值；
      debugger;
    })
    compilation.plugin('optimize-modules-advanced',function(...args){
      //7 [module1,module2,....] 编译后的module数组，里面存放着经过loader编译之后的结果 module._source : {_value,_name} _name:表示文件路径，_value:表示文件经过loader编译之后的值；
      debugger;
    })
    compilation.plugin('after-optimize-modules',function(...args){
      /*8 [module1,module2,....] 编译后的module数组，里面存放着经过loader编译之后的结果
      module:{request:资源路径,resource：资源路径,context:webpack上下文，dependencies：依赖，_source:编译后资源信息} 
      module._source : {_value,_name} _name:表示文件路径，_value:表示文件经过loader编译之后的值；*/
      debugger;
    })
    compilation.plugin('optimize-chunks-basic',function(...args){
      /*9 [chunk1,chunk2,...] 
      chunk:{entryModule:入口模块编译之后的信息,
        entryoptions,
        origins:该chunk编译之后的信息，
        name:chunk的名字，比如入口配置的 app等
        _modules:{}
      }*/
      debugger;
    })
    compilation.plugin('optimize-chunks',function(...args){
      /*10 [chunk1,chunk2,...] 
      chunk:{entryModule:入口模块编译之后的信息,
        entryoptions,
        origins:该chunk编译之后的信息，
        name:chunk的名字，比如入口配置的 app等
        _modules:{}
      }*/
      debugger;
    })
    compilation.plugin('optimize-chunks-advanced',function(...args){
      /*11 [chunk1,chunk2,...] 
      chunk:{entryModule:入口模块编译之后的信息,
        entryoptions,
        origins:该chunk编译之后的信息，
        name:chunk的名字，比如入口配置的 app等
        _modules:{}
      }*/
      debugger;
    })
    compilation.plugin('after-optimize-chunks',function(...args){
      /*12 [chunk1,chunk2,...] 
      chunk:{entryModule:入口模块编译之后的信息,
        entryoptions,
        origins:该chunk编译之后的信息，
        name:chunk的名字，比如入口配置的 app等
        _modules:{}
      }*/
      debugger;
    })
    compilation.plugin('optimize-tree',function(...args){
      /*13 [chunk1,chunk2,...],[module1,module2,...],callback
      */
      debugger;
      let callback = args[2];
      callback()
    })
    compilation.plugin('optimize-chunk-modules-basic',function(...args){
      //14 [chunks:[chunk1,chunk2,...],modules:[module1,module2,...]]
      debugger;
    })
    compilation.plugin('optimize-chunk-modules',function(...args){
      //15 [chunks:[chunk1,chunk2,...],modules:[module1,module2,...]]
      debugger;
    })
    compilation.plugin('optimize-chunk-modules-advanced',function(...args){
      //16 [chunks:[chunk1,chunk2,...],modules:[module1,module2,...]]
      debugger;
    })
    compilation.plugin('after-optimize-chunk-modules',function(...args){
      //[chunks:[chunk1,chunk2,...],modules:[module1,module2,...]]
      debugger;
    })
    compilation.plugin('should-record',function(...args){
      //Called to determine whether or not to store records. Returning anything !== false will prevent every other "record" hook from being executed (record, recordModules, recordChunks and recordHash )
      //[]
      debugger;
    })
    compilation.plugin('revive-modules',function(...args){
      //[chunks:[chunk1,chunk2,...],modules:[module1,module2,...]]
      debugger;
    })
    compilation.plugin('optimize-module-order',function(...args){
      //modules:[module1,module2,...]]
      debugger;
    })
    compilation.plugin('advanced-optimoze-module-order',function(...args){
      debugger;
    })
    compilation.plugin('before-module-ids',function(...args){
      //Executed before assigning an id to each module.
      //modules:[module1,module2,...]] 此时module.id = null
      debugger;
    })
    compilation.plugin('module-ids',function(...args){
      //Called to assign an id to each module.
      //modules:[module1,module2,...]] 此时module.id = './src/index.js'
      debugger;
    })
    compilation.plugin('optimize-module-ids',function(...args){
      debugger;
    })
    compilation.plugin('after-optimize-module-ids',function(...args){
      debugger;
    })
    compilation.plugin('revive-chunks',function(...args){
      debugger;
    })
    compilation.plugin('optimize-chunk-order',function(...args){
      debugger;
    })
    compilation.plugin('before-chunk-ids',function(...args){
      debugger;
    })
    compilation.plugin('chunk-ids',function(...args){
      debugger;
    })
    compilation.plugin('before-optimize-chunk-ids',function(...args){
      debugger;
    })
    compilation.plugin('optimize-chunk-ids',function(...args){
      debugger;
    })
    compilation.plugin('after-optimize-chunk-ids',function(...args){
      debugger;
    })
    compilation.plugin('record-modules',function(...args){
      debugger;
    })
    compilation.plugin('record-chunks',function(...args){
      debugger;
    })
    compilation.plugin('optimize-code-generation',function(...args){
      debugger;
    })
    compilation.plugin('before-module-hash',function(...args){
      debugger;
    })
    compilation.plugin('after-module-hash',function(...args){
      debugger;
    })
    compilation.plugin('before-hash',function(...args){
      debugger;
    })
    compilation.plugin('after-hash',function(...args){
      debugger;
    })
    compilation.plugin('record-hash',function(...args){
      debugger;
    })
    compilation.plugin('before-module-assets',function(...args){
      debugger;
    })
    compilation.plugin('additional-chunk-assets',function(...args){
      debugger;
    })
    compilation.plugin('before-chunk-assets',function(...args){
      debugger;
    })
    compilation.plugin('additional-assets',function(...args){
      let callback = args[0];
      callback();
      debugger;
    })
    compilation.plugin('optimize-chunk-assets',function(...args){
      debugger;
    })
    compilation.plugin('after-optimize-chunk-assets',function(...args){
      debugger;
    })
    compilation.plugin('optimize-assets',function(...args){
      debugger;
    })
    compilation.plugin('after-optimize-assets',function(...args){
      debugger;
    })
    compilation.plugin('need-additional-seal',function(...args){
      debugger;
    })
    compilation.plugin('after-seal',function(...args){
      debugger;
    })
    compilation.plugin('chunk-hash',function(...args){
      debugger;
    })
    compilation.plugin('module-assets',function(...args){
      debugger;
    })
    compilation.plugin('chunk-assets',function(...args){
      debugger;
    })
    compilation.plugin('asset-path',function(...args){
      debugger;
    })
    compilation.plugin('need-additional-pass',function(...args){
      debugger;
    })
    compilation.plugin('child-compiler',function(...args){
      debugger;
    })
    compilation.plugin('normal-module-loader',function(...args){
      //2 [loaderContext module] 此时的 module._source = null
      debugger;
    })
    compilation.plugin('dependency-reference',function(...args){
      debugger;
    })
  })//syncHook
  compiler.plugin('compilation',function pluginsHooksCb(...args){
    //12 this-compilation Compiler.js [compilation,params] 
    debugger;
  })//syncHook
  compiler.plugin('make',function pluginsHooksCb(...args){
    //13 make Compiler.js [compilation,callback] compilation.chunks  modules  assets都是空
    debugger;
    let callback = args[1];
    callback();//必须执行该回调，webpack才会继续执行
  })//AsyncParalleHook
  compiler.plugin('after-compile',function pluginsHooksCb(...args){
    debugger;
    //14 after-compile Compiler.js [compilation,callback] 
    let callback = args[1];
    callback();//必须执行该回调，webpack才会继续执行
  })//AsyncSeriesHook
  compiler.plugin('should-emit',function pluginsHooksCb(...args){
    //14 should-emit Compiler.js [compilation] 
    debugger;
  })//syncBailHook
  compiler.plugin('need-additional-pass',function pluginsHooksCb(...args){
    debugger;
  })//syncBailHook
  compiler.plugin('emit',function pluginsHooksCb(...args){
    //15 emit Compiler.js [compilation,callback] 
    debugger;
    let callback = args[1];
    callback();//必须执行该回调，webpack才会继续执行
  })//AsyncSeriesHook
  compiler.plugin('after-emit',function pluginsHooksCb(...args){
    //16 after-emit Compiler.js [compilation,callback] 
    debugger;
    let callback = args[1];
    callback();//必须执行该回调，webpack才会继续执行
  })//AsyncSeriesHook
  compiler.plugin('done',function pluginsHooksCb(...args){
    debugger;
  })//synchook
  compiler.plugin('failed',function pluginsHooksCb(...args){
    debugger;
  })//synchook
}

module.exports = PluginsHooks;
```

