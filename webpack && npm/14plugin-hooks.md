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
      debugger;
    })
    compilation.plugin('rebuild-module',function(...args){
      debugger;
    })
    compilation.plugin('failed-module',function(...args){
      debugger;
    })
    compilation.plugin('succeed-module-module',function(...args){
      debugger;
    })
    compilation.plugin('finish-rebuilding-module',function(...args){
      debugger;
    })
    compilation.plugin('seal',function(...args){
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
      debugger;
    })
    compilation.plugin('optimize-module-basic',function(...args){
      debugger;
    })
    compilation.plugin('optimize-modules',function(...args){
      debugger;
    })
    compilation.plugin('optimize-modules-advanced',function(...args){
      debugger;
    })
    compilation.plugin('after-optimize-modules',function(...args){
      debugger;
    })
    compilation.plugin('optimize-chunks-basic',function(...args){
      debugger;
    })
    compilation.plugin('optimize-chunks',function(...args){
      debugger;
    })
    compilation.plugin('optimize-chunks-advanced',function(...args){
      debugger;
    })
    compilation.plugin('after-optimize-chunks',function(...args){
      debugger;
    })
    compilation.plugin('optimize-tree',function(...args){
      debugger;
    })
    compilation.plugin('optimize-chunk-modules-basic',function(...args){
      debugger;
    })
    compilation.plugin('optimize-chunk-modules',function(...args){
      debugger;
    })
    compilation.plugin('optimize-chunk-modules-advanced',function(...args){
      debugger;
    })
    compilation.plugin('after-optimize-chunk-modules',function(...args){
      debugger;
    })
    compilation.plugin('should-record',function(...args){
      debugger;
    })
    compilation.plugin('revive-modules',function(...args){
      debugger;
    })
    compilation.plugin('optimize-module-order',function(...args){
      debugger;
    })
    compilation.plugin('advanced-optimoze-module-order',function(...args){
      debugger;
    })
    compilation.plugin('before-module-ids',function(...args){
      debugger;
    })
    compilation.plugin('module-ids',function(...args){
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
    //13 make Compiler.js [compilation,callback] 
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

