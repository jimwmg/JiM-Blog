---

---

### 1 启动webpack编译 - webpack[github源码](https://github.com/webpack/webpack)

[webpack打包机制](<https://github.com/happylindz/blog/issues/6>)

#### 1.1 通过 [webpack-cli](https://github.com/webpack/webpack-cli)

这里贴出来主要的核心代码

```javascript
//....
const webpack = require('webpack');
//.....
const compiler = webpack(options);
function processOptions(options){
    function compilerCallback(){....}
    if (firstOptions.watch || options.watch) {
        const watchOptions =
              firstOptions.watchOptions ||
              firstOptions.watch ||
              options.watch ||
              {};
        if (watchOptions.stdin) {
            process.stdin.on("end", function(_) {
                process.exit(); // eslint-disable-line
            });
            process.stdin.resume();
        }
        compiler.watch(watchOptions, compilerCallback);
        if (outputOptions.infoVerbosity !== "none")
            console.log("\nwebpack is watching the files…\n");
    } else compiler.run(compilerCallback);
}
processOptions(options);
//...
```

可以看到如果通过`webpack-cli`去开始构建webpack项目

* 首先执行 `const compiler = webpack(options)`
* 然后根据配置执行`compiler.watch(watchOptions, compilerCallback) 或者compiler.run(compilerCallback)`

#### 1.2 通过node API

```javascript
//....
const webpack = require('webpack');
//.....
const compiler = webpack(options);
compiler.run();
```

### 2 webpack

首先了解下 [tapable](https://github.com/webpack/tapable)

`lib/webpack.js`

[WebpackOptionsDefaulter](https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js)

[`/lib/`](https://github.com/webpack/webpack/tree/master/lib)

lib文件夹下面可以找到以下引用的对象具体实现；

```javascript
const Compiler = require("./Compiler");
const MultiCompiler = require("./MultiCompiler");
const NodeEnvironmentPlugin = require("./node/NodeEnvironmentPlugin");
const WebpackOptionsApply = require("./WebpackOptionsApply");
const WebpackOptionsDefaulter = require("./WebpackOptionsDefaulter");
const validateSchema = require("./validateSchema");
const WebpackOptionsValidationError = require("./WebpackOptionsValidationError");
const webpackOptionsSchema = require("../schemas/WebpackOptions.json");
const RemovedPluginError = require("./RemovedPluginError");
const version = require("../package.json").version;
const webpack = (options, callback) => {
    //校验传入webpack的options
	const webpackOptionsValidationErrors = validateSchema(
		webpackOptionsSchema,
		options
	);
	if (webpackOptionsValidationErrors.length) {
		throw new WebpackOptionsValidationError(webpackOptionsValidationErrors);
	}
	let compiler;
    //这里当我们配置的options是一个数组的时候，就会执行这个多构建
	if (Array.isArray(options)) {
		compiler = new MultiCompiler(options.map(options => webpack(options)));
	} else if (typeof options === "object") {
        //1 设置options的默认值；
		options = new WebpackOptionsDefaulter().process(options);
		//2 生成compiler对象
		compiler = new Compiler(options.context);
		compiler.options = options;
        //3 在compiler.hooks.beforeRun钩子上注册 NodeEnvironmentPlugin 插件
		new NodeEnvironmentPlugin().apply(compiler);
        //4 注册用户在options中配置的插件，具体注册在compiler对象的那个声明周期，得具体看这个插件上的apply函数的实现；
		if (options.plugins && Array.isArray(options.plugins)) {
			for (const plugin of options.plugins) {
                //这里可以看到每个plugin插件上的apply函数都会接受这个 compiler对象
				plugin.apply(compiler);
			}
		}
		compiler.hooks.environment.call();
		compiler.hooks.afterEnvironment.call();
        //5 应用实际传入的options,Compiler实例化的时候 this.options = {},这里给其赋值；
		compiler.options = new WebpackOptionsApply().process(options, compiler);
	} else {
		throw new Error("Invalid argument: options");
	}
	if (callback) {
		if (typeof callback !== "function") {
			throw new Error("Invalid argument: callback");
		}
		if (
			options.watch === true ||
			(Array.isArray(options) && options.some(o => o.watch))
		) {
			const watchOptions = Array.isArray(options)
				? options.map(o => o.watchOptions || {})
				: options.watchOptions || {};
			return compiler.watch(watchOptions, callback);
		}
		compiler.run(callback);
	}
    //返回compiler对象
	return compiler;
};

exports = module.exports = webpack;
exports.version = version;
```

在webpack-cli中可以看到，对返回的`compiler`对象根据配置是否有 `watch`选择执行 `compiler`的watch或者run方法

#### 2.1 `Compiler.js`

```javascript
class Compiler extends Tapable {
    constructor(context) {
        super();
        //这里存放所有钩子函数
        this.hooks = {
            /** @type {SyncBailHook<Compilation>} */
            shouldEmit: new SyncBailHook(["compilation"]),
            /** @type {AsyncSeriesHook<Stats>} */
            done: new AsyncSeriesHook(["stats"]),
            /** @type {AsyncSeriesHook<>} */
            additionalPass: new AsyncSeriesHook([]),
            /** @type {AsyncSeriesHook<Compiler>} */
            beforeRun: new AsyncSeriesHook(["compiler"]),
            /** @type {AsyncSeriesHook<Compiler>} */
            run: new AsyncSeriesHook(["compiler"]),
            /** @type {AsyncSeriesHook<Compilation>} */
            emit: new AsyncSeriesHook(["compilation"]),
            /** @type {AsyncSeriesHook<Compilation>} */
            afterEmit: new AsyncSeriesHook(["compilation"]),

            /** @type {SyncHook<Compilation, CompilationParams>} */
            thisCompilation: new SyncHook(["compilation", "params"]),
            /** @type {SyncHook<Compilation, CompilationParams>} */
            compilation: new SyncHook(["compilation", "params"]),
            /** @type {SyncHook<NormalModuleFactory>} */
            normalModuleFactory: new SyncHook(["normalModuleFactory"]),
            /** @type {SyncHook<ContextModuleFactory>}  */
            contextModuleFactory: new SyncHook(["contextModulefactory"]),

            /** @type {AsyncSeriesHook<CompilationParams>} */
            beforeCompile: new AsyncSeriesHook(["params"]),
            /** @type {SyncHook<CompilationParams>} */
            compile: new SyncHook(["params"]),
            /** @type {AsyncParallelHook<Compilation>} */
            make: new AsyncParallelHook(["compilation"]),
            /** @type {AsyncSeriesHook<Compilation>} */
            afterCompile: new AsyncSeriesHook(["compilation"]),

            /** @type {AsyncSeriesHook<Compiler>} */
            watchRun: new AsyncSeriesHook(["compiler"]),
            /** @type {SyncHook<Error>} */
            failed: new SyncHook(["error"]),
            /** @type {SyncHook<string, string>} */
            invalid: new SyncHook(["filename", "changeTime"]),
            /** @type {SyncHook} */
            watchClose: new SyncHook([]),

            // TODO the following hooks are weirdly located here
            // TODO move them for webpack 5
            /** @type {SyncHook} */
            environment: new SyncHook([]),
            /** @type {SyncHook} */
            afterEnvironment: new SyncHook([]),
            /** @type {SyncHook<Compiler>} */
            afterPlugins: new SyncHook(["compiler"]),
            /** @type {SyncHook<Compiler>} */
            afterResolvers: new SyncHook(["compiler"]),
            /** @type {SyncBailHook<string, EntryOptions>} */
            entryOption: new SyncBailHook(["context", "entry"])
        };
        //....

        /** @type {string|null} */
        this.recordsInputPath = null;
        /** @type {string|null} */
        this.recordsOutputPath = null;
        this.records = {};
        /** @type {Map<string, number>} */
        this.fileTimestamps = new Map();
        /** @type {Map<string, number>} */
        this.contextTimestamps = new Map();
        /** @type {ResolverFactory} */
        this.resolverFactory = new ResolverFactory();
        //...

        this.options = {};

        this.context = context;

        this.requestShortener = new RequestShortener(context);

        /** @type {boolean} */
        this.running = false;
    }

    watch(watchOptions, handler) {
        if (this.running) return handler(new ConcurrentCompilationError());

        this.running = true;
        this.fileTimestamps = new Map();
        this.contextTimestamps = new Map();
        return new Watching(this, watchOptions, handler);
    }

    run(callback) {
        if (this.running) return callback(new ConcurrentCompilationError());

        const finalCallback = (err, stats) => {
            this.running = false;

            if (callback !== undefined) return callback(err, stats);
        };

        const startTime = Date.now();

        this.running = true;

        const onCompiled = (err, compilation) => {
            if (err) return finalCallback(err);

            if (this.hooks.shouldEmit.call(compilation) === false) {
                const stats = new Stats(compilation);
                stats.startTime = startTime;
                stats.endTime = Date.now();
                this.hooks.done.callAsync(stats, err => {
                    if (err) return finalCallback(err);
                    return finalCallback(null, stats);
                });
                return;
            }

            this.emitAssets(compilation, err => {
                if (err) return finalCallback(err);

                if (compilation.hooks.needAdditionalPass.call()) {
                    compilation.needAdditionalPass = true;

                    const stats = new Stats(compilation);
                    stats.startTime = startTime;
                    stats.endTime = Date.now();
                    this.hooks.done.callAsync(stats, err => {
                        if (err) return finalCallback(err);

                        this.hooks.additionalPass.callAsync(err => {
                            if (err) return finalCallback(err);
                            this.compile(onCompiled);
                        });
                    });
                    return;
                }

                this.emitRecords(err => {
                    if (err) return finalCallback(err);

                    const stats = new Stats(compilation);
                    stats.startTime = startTime;
                    stats.endTime = Date.now();
                    this.hooks.done.callAsync(stats, err => {
                        if (err) return finalCallback(err);
                        return finalCallback(null, stats);
                    });
                });
            });
        };
//这里执行 beforeRun -> run -> normalModuleFactory -> contextModuleFactory -> beforeCompile -> compile -> thisCompilation -> compilation -> make -> afterCompile -> shouldEmit ->  afterEmit -> additionalPass ->  done
        
        //hooks.beforeRun
        this.hooks.beforeRun.callAsync(this, err => {
            if (err) return finalCallback(err);
			//hooks.run钩子数组被执行
            this.hooks.run.callAsync(this, err => {
                if (err) return finalCallback(err);

                this.readRecords(err => {
                    if (err) return finalCallback(err);

                    this.compile(onCompiled);
                });
            });
        });
    }
    //....
    createCompilation() {
		return new Compilation(this);
	}

	newCompilation(params) {
		const compilation = this.createCompilation();
		compilation.fileTimestamps = this.fileTimestamps;
		compilation.contextTimestamps = this.contextTimestamps;
		compilation.name = this.name;
		compilation.records = this.records;
		compilation.compilationDependencies = params.compilationDependencies;
		this.hooks.thisCompilation.call(compilation, params);
		this.hooks.compilation.call(compilation, params);
		return compilation;
	}
    compile(callback) {
        //hooks.normalModuleFactory  hooks.contextModuleFactory 钩子被执行
        const params = this.newCompilationParams();
        //hooks.beforeCompile钩子被执行
        this.hooks.beforeCompile.callAsync(params, err => {
            if (err) return callback(err);
			//hooks.compile钩子被执行
            this.hooks.compile.call(params);
			//hooks.thisCompilation  hooks.compilation
            const compilation = this.newCompilation(params);
			//hooks.make钩子被执行
            this.hooks.make.callAsync(compilation, err => {
                if (err) return callback(err);

                compilation.finish();

                compilation.seal(err => {
                    if (err) return callback(err);
					//hooks.afterCompile钩子被执行
                    this.hooks.afterCompile.callAsync(compilation, err => {
                        if (err) return callback(err);
					//callback就是上面的onCompiled函数，在这里面
         //hooks.shouldEmit  hooks.emit  hooks.afterEmit  hooks.additionalPass   hooks.done
                        return callback(null, compilation);
                    });
                });
            });
        });
    }
}
```

`webpack`执行的时候：

```javascript
hooks.environment
hooks.afterEnvironment
```

从 `run `方法中可以看到钩子执行的顺序如下

```
beforeRun -> run -> normalModuleFactory -> contextModuleFactory -> beforeCompile -> compile -> thisCompilation -> compilation -> make -> afterCompile -> shouldEmit -> emit ->  afterEmit -> additionalPass ->  done
```

在webpack.js中

```javascript
compiler.options = new WebpackOptionsApply().process(options, compiler);
```

`WebpackOptionsApply.js`

```javascript
class WebpackOptionsApply extends OptionsApply {
    constructor() {
        super();
    }
    process(options,compiler){
        //....
        //EntryOptionPlugin.js   SingleEntryPlugin.js在hooks.entryOption 钩子中注册了compilation.addEntry这个方法
        new EntryOptionPlugin().apply(compiler);
        //这里执行hooks.entryOption钩子中的添加的compilation.addEntry，开始了webpack的构建之旅；
        compiler.hooks.entryOption.call(options.context, options.entry);
        //...
    }
}
```

`EntryOptionPlugin.js`

```javascript
const itemToPlugin = (context, item, name) => {
	if (Array.isArray(item)) {
		return new MultiEntryPlugin(context, item, name);
	}
	return new SingleEntryPlugin(context, item, name);
};

module.exports = class EntryOptionPlugin {
	/**
	 * @param {Compiler} compiler the compiler instance one is tapping into
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
			if (typeof entry === "string" || Array.isArray(entry)) {
                //这里对应配置 entry:String || Array
				itemToPlugin(context, entry, "main").apply(compiler);
			} else if (typeof entry === "object") {
                //这里对应配置 entry:{key:value,key1:value1}
				for (const name of Object.keys(entry)) {
					itemToPlugin(context, entry[name], name).apply(compiler);
				}
			} else if (typeof entry === "function") {
                //这里对应 entry:function
				new DynamicEntryPlugin(context, entry).apply(compiler);
			}
			return true;
		});
	}
};

```

[`SingleEntryPlugin.js`](https://github.com/jimwmg/webpack/blob/master/lib/SingleEntryPlugin.js)

[MultiEntryPlugin.js](https://github.com/jimwmg/webpack/blob/master/lib/MultiEntryPlugin.js)

[DynamicEntryPlugin.js)](https://github.com/jimwmg/webpack/blob/master/lib/DynamicEntryPlugin.js)

相同的是在这是哪个Plugins中都会在 `hooks.make`中增加钩子函数执行 `compilation.addEntry`;

```javascript
compiler.hooks.make.tapAsync(
    "SingleEntryPlugin",
    (compilation, callback) => {
        const { entry, name, context } = this;

        const dep = SingleEntryPlugin.createDependency(entry, name);
        compilation.addEntry(context, dep, name, callback);
    }
);
compiler.hooks.make.tapAsync(
    "MultiEntryPlugin",
    (compilation, callback) => {
        const { context, entries, name } = this;

        const dep = MultiEntryPlugin.createDependency(entries, name);
        compilation.addEntry(context, dep, name, callback);
    }
);
compiler.hooks.make.tapAsync(
    "DynamicEntryPlugin",
    (compilation, callback) => {
        /**
				 * @param {string|string[]} entry entry value or array of entry values
				 * @param {string} name name of entry
				 * @returns {Promise<any>} returns the promise resolving the Compilation#addEntry function
				 */
        const addEntry = (entry, name) => {
            const dep = DynamicEntryPlugin.createDependency(entry, name);
            return new Promise((resolve, reject) => {
                compilation.addEntry(this.context, dep, name, err => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        };

        Promise.resolve(this.entry()).then(entry => {
            if (typeof entry === "string" || Array.isArray(entry)) {
                addEntry(entry, "main").then(() => callback(), callback);
            } else if (typeof entry === "object") {
                Promise.all(
                    Object.keys(entry).map(name => {
                        return addEntry(entry[name], name);
                    })
                ).then(() => callback(), callback);
            }
        });
    }
);
```

接下来看下 `make`钩子函数中执行的  `compilation.addEntry`;

#### 2.2 [compilation](https://github.com/jimwmg/webpack/blob/master/lib/Compilation.js)

**重点看下在make钩子函数中**

context默认值是 `process.cwd()`

```javascript
compilation.addEntry(context, dep, name, callback);
dep:{
loc: {name: "app"}
module: null
optional: false
request: "/Users/didi/learn/learnSPace/14webpack-learn/01webpack-base/src/index.js"
userRequest: "/Users/didi/learn/learnSPace/14webpack-learn/01webpack-base/src/index.js"
weak: false
type: "single entry"}
```

`compilation.js`

`addEntry中又会调用_addModuleChain`，这里需要注意的是

```javascript
this.dependencyFactories.get(Dep);
```

在每个plugin执行的时候，比如`SingleEntryPlugin`中给 `compilation.dependencyFactories.set`

```javascript
apply(compiler) {
    compiler.hooks.compilation.tap(
        "SingleEntryPlugin",
        (compilation, { normalModuleFactory }) => {
            compilation.dependencyFactories.set(
                SingleEntryDependency,
                normalModuleFactory
            );
        }
    );
```

这些钩子函数是在 `Compiler.js`中的`newCompilation`函数中执行的

```javascript
compile(callback) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err => {
        if (err) return callback(err);

        this.hooks.compile.call(params);

        const compilation = this.newCompilation(params);

        //....
    });
}
newCompilation(params) {
    const compilation = this.createCompilation();
    compilation.fileTimestamps = this.fileTimestamps;
    compilation.contextTimestamps = this.contextTimestamps;
    compilation.name = this.name;
    compilation.records = this.records;
    compilation.compilationDependencies = params.compilationDependencies;
    this.hooks.thisCompilation.call(compilation, params);
    //这里执行 compilation 钩子函数
    this.hooks.compilation.call(compilation, params);
    return compilation;
}
newCompilationParams() {
    //这里生成params对象
    const params = {
        normalModuleFactory: this.createNormalModuleFactory(),
        contextModuleFactory: this.createContextModuleFactory(),
        compilationDependencies: new Set()
    };
    return params;
}
```

addEntry中执行_addModuleChain

```javascript
_addModuleChain(context, dependency, onModule, callback) {
    const start = this.profile && Date.now();
    const currentProfile = this.profile && {};

    const errorAndCallback = this.bail
    ? err => {
        callback(err);
    }
    : err => {
        err.dependencies = [dependency];
        this.errors.push(err);
        callback();
    };

    if (
        typeof dependency !== "object" ||
        dependency === null ||
        !dependency.constructor
    ) {
        throw new Error("Parameter 'dependency' must be a Dependency");
    }
    debugger;
    const Dep = /** @type {DepConstructor} */ (dependency.constructor);
    const moduleFactory = this.dependencyFactories.get(Dep);
    if (!moduleFactory) {
        throw new Error(
            `No dependency factory available for this dependency type: ${
            dependency.constructor.name
            }`
        );
    }

    this.semaphore.acquire(() => {
        moduleFactory.create(
            {
                contextInfo: {
                    issuer: "",
                    compiler: this.compiler.name
                },
                context: context,
                dependencies: [dependency]
            },
            (err, module) => {
                if (err) {
                    this.semaphore.release();
                    return errorAndCallback(new EntryModuleNotFoundError(err));
                }

                let afterFactory;

                if (currentProfile) {
                    afterFactory = Date.now();
                    currentProfile.factory = afterFactory - start;
                }
	//这里讲模块添加到模块记录表中
                const addModuleResult = this.addModule(module);
                /*{
                    module: module,
                    issuer: true,
                    build: true,
                    dependencies: true
                };*/
                module = addModuleResult.module;

                onModule(module);

                dependency.module = module;
                module.addReason(null, dependency);

                const afterBuild = () => {
                    if (currentProfile) {
                        const afterBuilding = Date.now();
                        currentProfile.building = afterBuilding - afterFactory;
                    }

                    if (addModuleResult.dependencies) {
                        this.processModuleDependencies(module, err => {
                            if (err) return callback(err);
                            callback(null, module);
                        });
                    } else {
                        return callback(null, module);
                    }
                };

                if (addModuleResult.issuer) {
                    if (currentProfile) {
                        module.profile = currentProfile;
                    }
                }

                if (addModuleResult.build) {
                    this.buildModule(module, false, null, null, err => {
                        if (err) {
                            this.semaphore.release();
                            return errorAndCallback(err);
                        }

                        if (currentProfile) {
                            const afterBuilding = Date.now();
                            currentProfile.building = afterBuilding - afterFactory;
                        }

                        this.semaphore.release();
                        afterBuild();
                    });
                } else {
                    this.semaphore.release();
                    this.waitForBuildingFinished(module, afterBuild);
                }
            }
        );
    });
}
```

主要流程总结如下

1 `Compilation.js` : 开始执行模块的构建

```javascript
addEntry -> _addModuleChain -> buildModule
```

2 `NormalModule.js` ：构建模块的时候执行对应的loader处理对应的文件

```javascript
build -> doBuild -> runLoaders
```

3 将处理过后的文件再次通过ast解析，包装成webpack

```javascript
this.parser.parse
```

 在 `Compiler.js`中`compile`函数中可以看到执行了 `hook.make`之后会接着执行 `Compilation.seal`,然后`emitAssets`

4 封装构建结果（seal）

webpack 会监听 seal事件调用各插件对构建后的结果进行封装，要逐次对每个 module 和 chunk 进行整理，生成编译后的源码，合并，拆分，生成 hash 。 同时这是我们在开发时进行代码优化和功能添加的关键环节。

```
createChunkAssets()
```

通过模板（MainTemplate、ChunkTemplate）把chunk生产_webpack_requie()的格式。

5 输出资源（emit）

把Assets输出到output的path中

**通过runLoaders函数找到对应的loader(css-loader,vue-loader,babel-loader...)处理源码**

`NormalModule.js`

```javascript
//NormalModule.js里dobuild的实现
doBuild(options, compilation, resolver, fs, callback) {
   ...
   //构建loader运行的上下文环境
   const loaderContext = 
   this.createLoaderContext(resolver, options, compilation, fs);
	
  
  //环境，loader列表，源码传给runLoaders
   runLoaders({
      resource: this.resource,
      loaders: this.loaders,
      context: loaderContext,
      readResource: fs.readFile.bind(fs)
   }  

```

在上一步doBuild后的回调里，对已经转化成js的文件进行了如下处理

`NormalModule.js`

```javascript
try {
    const result = this.parser.parse(
        this._ast || this._source.source(),
        {
            current: this,
            module: this,
            compilation: compilation,
            options: options
        },
        (err, result) => {
            if (err) {
                handleParseError(err);
            } else {
                handleParseResult(result);
            }
        }
    );
    if (result !== undefined) {
        // parse is sync
        handleParseResult(result);
    }
} catch (e) {
    handleParseError(e);
}
});
```

附构建流程图

![webpack-构建流程](../img/webpack.jpg)

### 3 参考

[webpack-源码-知乎](https://zhuanlan.zhihu.com/p/29551683)

[如何写一个webpack插件-附源码解析](https://juejin.im/post/5beb8875e51d455e5c4dd83f)