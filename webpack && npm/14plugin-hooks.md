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
    // 6 before-run Compiler.js [compiler,callback]
    debugger;
    let callback = args[1];
    callback();//必须执行该回调，webpack才会继续执行
  })//AsyncSeriesHook
  compiler.plugin('run',function pluginsHooksCb(...args){
    // 7 run Compiler.js [compiler,callback]
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
    //compilation 这个对象上基本都是key对应的value大部分都是空值
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
    f
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

### 3 webpack中常用对象key-value的简单分析



| **compilation**           |                                                              | 备注                                                         |
| ------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **属性**                  |                                                              |                                                              |
| assets                    | 打包后的资源，将要输出到对应目录                             |                                                              |
| chunks                    | 打包后的chunk，包括 initial chunk，async chunk,comon chunk；initial chunk又有一个属性 chunks,表示这个初始化的 initial chunk依赖了那些异步chunk; |                                                              |
| compiler                  | webpack的构建对象 compiler                                   |                                                              |
| modules                   | 包括所有的模块，异步模块 是一个数组 `[NormalModule]`         |                                                              |
| options                   | 传入webpack的配置对象经过webpack加工过之后的值； 等于 compiler.options |                                                              |
| _modules                  | 包括所有的模块，是一个对象`{pathto:NormalModule}`            |                                                              |
|                           |                                                              |                                                              |
| **方法**                  |                                                              |                                                              |
| addChunk                  | 增加一个chunk：compilation.addChunk(chunkName)，返回一个新的chunk; | 会在chunks数组中新增一个chunk;                               |
|                           |                                                              |                                                              |
|                           |                                                              |                                                              |
| **chunk**                 |                                                              |                                                              |
| **属性**                  |                                                              |                                                              |
| blocks                    | 入口chunk: [ ], 异步chunk: [RequireEnsureDependenciesBlock]  | 这个chunk的类型                                              |
| chunks                    | 入口chunk: [chunk1,chunk2],依赖的异步chunk,没有异步chunk，则为[ ]<br />从每个入口递归循环分析依赖，找到所有的异步chunk，放到这个入口chunk里面；<br /> | 这个chunk的子chunk                                           |
| entryModule               | 入口chunk才有这个属性                                        |                                                              |
| _modules                  | 包括这个入口文件或者异步文件模块在内的所有递归循环依赖的模块信息；<br />需要注意的是，这里不包括异步引用的模块的信息，只有同步模块的信息；<br />也就是说至少一个是这个模块本身，其他的是这个模块依赖的同步模块；Set数据结构 |                                                              |
|                           |                                                              |                                                              |
| parents                   | 入口chunk:[ ] ,异步chunk: [parentChunk],这个指向入口chunk<br /> |                                                              |
| name                      | 对于入口chunk，每个chunk都会有自己的名字；对于异步chunk，则该name对应的value为 null; |                                                              |
| **方法**                  |                                                              |                                                              |
| chunk.hasRuntime()        | 判断这个chunk是不是入口chunk,入口chunk一般都会有webpack的runtime代码 | hasRuntime() {<br/>		if(this.entrypoints.length === 0) return false;<br/>		return this.entrypoints[0].chunks[0] === this;<br/>	} |
| chunk.addModule(module)   | 往 chunk._modules 添加模块                                   |                                                              |
| chunk.addChunk(addChunk)  | chunk.chunk = [addChunk]                                     |                                                              |
|                           |                                                              |                                                              |
| **compiler**              |                                                              |                                                              |
| options                   | 传入webpack的配置对象经过webpack加工过之后的值；             |                                                              |
|                           |                                                              |                                                              |
|                           |                                                              |                                                              |
|                           |                                                              |                                                              |
|                           |                                                              |                                                              |
|                           |                                                              |                                                              |
| **NormalModule**          | _modules 数组中存放的模块的具体信息                          |                                                              |
| **属性**                  |                                                              |                                                              |
| assets                    |                                                              |                                                              |
| blocks                    |                                                              |                                                              |
| loaders                   | 表示这个module经过那些loader处理                             |                                                              |
| _chunks                   | 表示这个模块在哪个chunk中                                    |                                                              |
|                           |                                                              |                                                              |
| **方法**                  |                                                              |                                                              |
| module.size()             | 获取某个模块的大小                                           |                                                              |
| module.source()           | 获取某个模块的代码                                           |                                                              |
| module.removeChunk(chunk) | `1 移除module上的某个chunk(module._chunks中的chunk); 2 同时移除所传chunk中的有的这个module,这个removeChunk会调用chunk.removeModule(this);那么chunk._modules中的对应的这个模块也会被移除` |                                                              |
| module.addChunk(chunk)    | 往module._chunks添加chunk                                    |                                                              |
|                           |                                                              |                                                              |
|                           |                                                              |                                                              |
|                           |                                                              |                                                              |

### 备忘

`Module.js`

```javascript
const DependenciesBlock = require("./DependenciesBlock");
const ModuleReason = require("./ModuleReason");
const SortableSet = require("./util/SortableSet");
const Template = require("./Template");

let debugId = 1000;

const sortById = (a, b) => {
	return a.id - b.id;
};

const sortByDebugId = (a, b) => {
	return a.debugId - b.debugId;
};

class Module extends DependenciesBlock {

	constructor() {
		super();
		this.context = null;
		this.reasons = [];
		this.debugId = debugId++;
		this.id = null;
		this.portableId = null;
		this.index = null;
		this.index2 = null;
		this.depth = null;
		this.used = null;
		this.usedExports = null;
		this.providedExports = null;
		this._chunks = new SortableSet(undefined, sortById);
		this._chunksDebugIdent = undefined;
		this.warnings = [];
		this.dependenciesWarnings = [];
		this.errors = [];
		this.dependenciesErrors = [];
		this.strict = false;
		this.meta = {};
		this.optimizationBailout = [];
	}

	disconnect() {
		this.reasons.length = 0;
		this.id = null;
		this.index = null;
		this.index2 = null;
		this.depth = null;
		this.used = null;
		this.usedExports = null;
		this.providedExports = null;
		this._chunks.clear();
		this._chunksDebugIdent = undefined;
		this.optimizationBailout.length = 0;
		super.disconnect();
	}

	unseal() {
		this.id = null;
		this.index = null;
		this.index2 = null;
		this.depth = null;
		this._chunks.clear();
		this._chunksDebugIdent = undefined;
		super.unseal();
	}

	setChunks(chunks) {
		this._chunks = new SortableSet(chunks, sortById);
		this._chunksDebugIdent = undefined;
	}

	addChunk(chunk) {
		this._chunks.add(chunk);
		this._chunksDebugIdent = undefined;
	}

	removeChunk(chunk) {
		if(this._chunks.delete(chunk)) {
			this._chunksDebugIdent = undefined;
			chunk.removeModule(this);
			return true;
		}
		return false;
	}

	isInChunk(chunk) {
		return this._chunks.has(chunk);
	}

	getChunkIdsIdent() {
		if(this._chunksDebugIdent !== undefined) return this._chunksDebugIdent;
		this._chunks.sortWith(sortByDebugId);
		const chunks = this._chunks;
		const list = [];
		for(const chunk of chunks) {
			const debugId = chunk.debugId;

			if(typeof debugId !== "number") {
				return this._chunksDebugIdent = null;
			}

			list.push(debugId);
		}

		return this._chunksDebugIdent = list.join(",");
	}

	forEachChunk(fn) {
		this._chunks.forEach(fn);
	}

	mapChunks(fn) {
		return Array.from(this._chunks, fn);
	}

	getChunks() {
		return Array.from(this._chunks);
	}

	getNumberOfChunks() {
		return this._chunks.size;
	}

	hasEqualsChunks(otherModule) {
		if(this._chunks.size !== otherModule._chunks.size) return false;
		this._chunks.sortWith(sortByDebugId);
		otherModule._chunks.sortWith(sortByDebugId);
		const a = this._chunks[Symbol.iterator]();
		const b = otherModule._chunks[Symbol.iterator]();
		while(true) { // eslint-disable-line
			const aItem = a.next();
			const bItem = b.next();
			if(aItem.done) return true;
			if(aItem.value !== bItem.value) return false;
		}
	}

	addReason(module, dependency) {
		this.reasons.push(new ModuleReason(module, dependency));
	}

	removeReason(module, dependency) {
		for(let i = 0; i < this.reasons.length; i++) {
			let r = this.reasons[i];
			if(r.module === module && r.dependency === dependency) {
				this.reasons.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	hasReasonForChunk(chunk) {
		for(let i = 0; i < this.reasons.length; i++) {
			if(this.reasons[i].hasChunk(chunk))
				return true;
		}
		return false;
	}

	rewriteChunkInReasons(oldChunk, newChunks) {
		for(let i = 0; i < this.reasons.length; i++) {
			this.reasons[i].rewriteChunks(oldChunk, newChunks);
		}
	}

	isUsed(exportName) {
		if(this.used === null) return exportName;
		if(!exportName) return !!this.used;
		if(!this.used) return false;
		if(!this.usedExports) return false;
		if(this.usedExports === true) return exportName;
		let idx = this.usedExports.indexOf(exportName);
		if(idx < 0) return false;
		if(this.isProvided(exportName))
			return Template.numberToIdentifer(idx);
		return exportName;
	}

	isProvided(exportName) {
		if(!Array.isArray(this.providedExports))
			return null;
		return this.providedExports.indexOf(exportName) >= 0;
	}

	toString() {
		return `Module[${this.id || this.debugId}]`;
	}

	needRebuild(fileTimestamps, contextTimestamps) {
		return true;
	}

	updateHash(hash) {
		hash.update(this.id + "" + this.used);
		hash.update(JSON.stringify(this.usedExports));
		super.updateHash(hash);
	}

	sortItems(sortChunks) {
		super.sortItems();
		if(sortChunks)
			this._chunks.sort();
		this.reasons.sort((a, b) => sortById(a.module, b.module));
		if(Array.isArray(this.usedExports)) {
			this.usedExports.sort();
		}
	}

	unbuild() {
		this.disconnect();
	}
}

Object.defineProperty(Module.prototype, "entry", {
	configurable: false,
	get() {
		throw new Error("Module.entry was removed. Use Chunk.entryModule");
	},
	set() {
		throw new Error("Module.entry was removed. Use Chunk.entryModule");
	}
});

Object.defineProperty(Module.prototype, "chunks", {
	configurable: false,
	get: util.deprecate(function() {
		return Array.from(this._chunks);
	}, "Module.chunks: Use Module.forEachChunk/mapChunks/getNumberOfChunks/isInChunk/addChunk/removeChunk instead"),
	set() {
		throw new Error("Readonly. Use Module.addChunk/removeChunk to modify chunks.");
	}
});

Module.prototype.identifier = null;
Module.prototype.readableIdentifier = null;
Module.prototype.build = null;
Module.prototype.source = null;
Module.prototype.size = null;
Module.prototype.nameForCondition = null;

module.exports = Module;

});
```

`Entrypoint.js`

```javascript
class Entrypoint {
	constructor(name) {
		this.name = name;
		this.chunks = [];
	}

	unshiftChunk(chunk) {
		this.chunks.unshift(chunk);
		chunk.entrypoints.push(this);
	}

	insertChunk(chunk, before) {
		const idx = this.chunks.indexOf(before);
		if(idx >= 0) {
			this.chunks.splice(idx, 0, chunk);
		} else {
			throw new Error("before chunk not found");
		}
		chunk.entrypoints.push(this);
	}

	getFiles() {
		const files = [];

		for(let chunkIdx = 0; chunkIdx < this.chunks.length; chunkIdx++) {
			for(let fileIdx = 0; fileIdx < this.chunks[chunkIdx].files.length; fileIdx++) {
				if(files.indexOf(this.chunks[chunkIdx].files[fileIdx]) === -1) {
					files.push(this.chunks[chunkIdx].files[fileIdx]);
				}
			}
		}

		return files;
	}
}

module.exports = Entrypoint;

});
```

