---

---

基于 "webpack": "^3.6.0",

----

### 1 webpack-target

什么是webpack的target? 

[官方文档-target](https://www.webpackjs.com/configuration/target/#target)

看完之后，其实还是不理解，什么是webpack的target,以及target有什么用处，所有的结果只能是自己去体验和测试以及看webpack相关源码才能理解

`target:string|function(compiler)`

```
string: async-node  node  node-webkit web webworker electron-main  electron-renderer
```

```javascript
const options = {
  target: () => undefined
};

const webpack = require("webpack");

const options = {
  target: (compiler) => {
    compiler.apply(
      new webpack.JsonpTemplatePlugin(options.output),
      new webpack.LoaderTargetPlugin("web")
    );
  }
};
```

`webpack`配置，参考业内开源mpvue和chameleon的构建目标，可以看下对应源码的实现

```
npm i chameleon-miniapp-target -S
npm i mpvue-webpack-target -S
```

```javascript
'use strict'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}

const dist = resolve('dist/')

module.exports = {
  //字符串形式
  // target:"node",//web  
  //function形式
  target:require('chameleon-miniapp-target'),
  // target:require('mpvue-webpack-target'),
  context: path.resolve(__dirname, './'),
  entry: {
    app: './src/index.js',
  },
  output: {
    path: dist,
    filename: '[name].js',
    chunkFilename:'[name].non-entry.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    
  ]
}

```

多次改变target的值以后，看下构建的结果，同时参考webpack对应的源码以及`chameleon-miniapp-target mpvue-webpack-target`的源码，应该会对webpack target的构建有个清晰的认识；



### 2 webpack内部如何处理`target`?

关于webpack开始启动的源码解析，参考之前的文章[webpack源码]([https://github.com/jimwmg/JiM-Blog/blob/master/webpack%20%26%26%20npm/08webpack%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90.md](https://github.com/jimwmg/JiM-Blog/blob/master/webpack %26%26 npm/08webpack源码解析.md))

`webpack.js`

主要相关源码文件`WebpackOptionsDefaulter.js WebpackOptionsApply.js` 

```javascript
new WebpackOptionsDefaulter().process(options);//处理webpack配置的对象，校验配置对象，增加默认值等
//在 entry 配置项处理过之后，执行插件
compiler.options = new WebpackOptionsApply().process(options, compiler);
```

当`compalation`对象在生成chunk文件代码的时候,createChunkAssets的调用用来生成主chunk和异步chunk;

`mainTemplate.js`用来生成入口打包后的bundle,如果有一些需要异步加载的chunk,那么`JsonpMainTemplatePlugin.js`用来在bundle中生成 `webpackJsonp`函数，这些最终的生成的代码也是通过一个个`tapable`的插件机制来实现的；

具体的需要大家自己看代码了；

接下来讲下流程,以`target:web`为例

`WebpackOptionsApply.js`中

```javascript
switch(options.target) {
  case "web":
    JsonpTemplatePlugin = require("./JsonpTemplatePlugin");
    NodeSourcePlugin = require("./node/NodeSourcePlugin");
    /** 
					 * 
					Tapable.prototype.apply = function apply() {
						for(var i = 0; i < arguments.length; i++) {
							arguments[i].apply(this);
						}
					};
					这里理论上可以直接用 plugin的apply函数
					*/

    compiler.apply(
      new JsonpTemplatePlugin(options.output),
      new FunctionModulePlugin(options.output),
      new NodeSourcePlugin(options.node),
      new LoaderTargetPlugin(options.target)
    );
    break;
```

`JsonpTemplatePlugin.js`

```java
class JsonpTemplatePlugin {
	apply(compiler) {
		compiler.plugin("this-compilation", (compilation) => {
			compilation.mainTemplate.apply(new JsonpMainTemplatePlugin());
			compilation.chunkTemplate.apply(new JsonpChunkTemplatePlugin());
			compilation.hotUpdateChunkTemplate.apply(new JsonpHotUpdateChunkTemplatePlugin());
		});
	}
}

module.exports = JsonpTemplatePlugin;
```





### 3 设计的核心源码直接贴出来,感兴趣的可以看下

`compalation.js`

```javascript
createChunkAssets() {
		const outputOptions = this.outputOptions;
		const filename = outputOptions.filename;
		const chunkFilename = outputOptions.chunkFilename;
		for(let i = 0; i < this.chunks.length; i++) {
			const chunk = this.chunks[i];
			chunk.files = [];
			const chunkHash = chunk.hash;
			let source;
			let file;
			const filenameTemplate = chunk.filenameTemplate ? chunk.filenameTemplate :
				chunk.isInitial() ? filename :
				chunkFilename;
			try {
				const useChunkHash = !chunk.hasRuntime() || (this.mainTemplate.useChunkHash && this.mainTemplate.useChunkHash(chunk));
				const usedHash = useChunkHash ? chunkHash : this.fullHash;
				const cacheName = "c" + chunk.id;
				if(this.cache && this.cache[cacheName] && this.cache[cacheName].hash === usedHash) {
					source = this.cache[cacheName].source;
				} else {
					if(chunk.hasRuntime()) {
						source = this.mainTemplate.render(this.hash, chunk, this.moduleTemplate, this.dependencyTemplates);
					} else {
						source = this.chunkTemplate.render(chunk, this.moduleTemplate, this.dependencyTemplates);
					}
					if(this.cache) {
						this.cache[cacheName] = {
							hash: usedHash,
							source: source = (source instanceof CachedSource ? source : new CachedSource(source))
						};
					}
				}
				file = this.getPath(filenameTemplate, {
					noChunkHash: !useChunkHash,
					chunk
				});
				if(this.assets[file])
					throw new Error(`Conflict: Multiple assets emit to the same filename ${file}`);
				this.assets[file] = source;
				chunk.files.push(file);
				this.applyPlugins2("chunk-asset", chunk, file);
			} catch(err) {
				this.errors.push(new ChunkRenderError(chunk, file || filenameTemplate, err));
			}
		}
	}

```



主要看下`WebpackOptionsApply.js`

```javascript
class WebpackOptionsApply extends OptionsApply {
	constructor() {
		super();
	}

	process(options, compiler) {
		let ExternalsPlugin;
		compiler.outputPath = options.output.path;
		compiler.recordsInputPath = options.recordsInputPath || options.recordsPath;
		compiler.recordsOutputPath = options.recordsOutputPath || options.recordsPath;
		compiler.name = options.name;
		compiler.dependencies = options.dependencies;
		if(typeof options.target === "string") {
			let JsonpTemplatePlugin;
			let NodeSourcePlugin;
			let NodeTargetPlugin;
			let NodeTemplatePlugin;

			switch(options.target) {
				case "web":
					JsonpTemplatePlugin = require("./JsonpTemplatePlugin");
					NodeSourcePlugin = require("./node/NodeSourcePlugin");
					/** 
					 * 
					Tapable.prototype.apply = function apply() {
						for(var i = 0; i < arguments.length; i++) {
							arguments[i].apply(this);
						}
					};
					这里理论上可以直接用 plugin的apply函数
					*/
					
					compiler.apply(
						new JsonpTemplatePlugin(options.output),
						new FunctionModulePlugin(options.output),
						new NodeSourcePlugin(options.node),
						new LoaderTargetPlugin(options.target)
					);
					break;
				case "webworker":
					{
						let WebWorkerTemplatePlugin = require("./webworker/WebWorkerTemplatePlugin");
						NodeSourcePlugin = require("./node/NodeSourcePlugin");
						compiler.apply(
							new WebWorkerTemplatePlugin(),
							new FunctionModulePlugin(options.output),
							new NodeSourcePlugin(options.node),
							new LoaderTargetPlugin(options.target)
						);
						break;
					}
				case "node":
				case "async-node":
					NodeTemplatePlugin = require("./node/NodeTemplatePlugin");
					NodeTargetPlugin = require("./node/NodeTargetPlugin");
					compiler.apply(
						new NodeTemplatePlugin({
							asyncChunkLoading: options.target === "async-node"
						}),
						new FunctionModulePlugin(options.output),
						new NodeTargetPlugin(),
						new LoaderTargetPlugin("node")
					);
					break;
				case "node-webkit":
					JsonpTemplatePlugin = require("./JsonpTemplatePlugin");
					NodeTargetPlugin = require("./node/NodeTargetPlugin");
					ExternalsPlugin = require("./ExternalsPlugin");
					compiler.apply(
						new JsonpTemplatePlugin(options.output),
						new FunctionModulePlugin(options.output),
						new NodeTargetPlugin(),
						new ExternalsPlugin("commonjs", "nw.gui"),
						new LoaderTargetPlugin(options.target)
					);
					break;
				case "atom":
				case "electron":
				case "electron-main":
					NodeTemplatePlugin = require("./node/NodeTemplatePlugin");
					NodeTargetPlugin = require("./node/NodeTargetPlugin");
					ExternalsPlugin = require("./ExternalsPlugin");
					compiler.apply(
						new NodeTemplatePlugin({
							asyncChunkLoading: true
						}),
						new FunctionModulePlugin(options.output),
						new NodeTargetPlugin(),
						new ExternalsPlugin("commonjs", [
							"app",
							"auto-updater",
							"browser-window",
							"content-tracing",
							"dialog",
							"electron",
							"global-shortcut",
							"ipc",
							"ipc-main",
							"menu",
							"menu-item",
							"power-monitor",
							"power-save-blocker",
							"protocol",
							"session",
							"web-contents",
							"tray",
							"clipboard",
							"crash-reporter",
							"native-image",
							"screen",
							"shell"
						]),
						new LoaderTargetPlugin(options.target)
					);
					break;
				case "electron-renderer":
					JsonpTemplatePlugin = require("./JsonpTemplatePlugin");
					NodeTargetPlugin = require("./node/NodeTargetPlugin");
					ExternalsPlugin = require("./ExternalsPlugin");
					compiler.apply(
						new JsonpTemplatePlugin(options.output),
						new FunctionModulePlugin(options.output),
						new NodeTargetPlugin(),
						new ExternalsPlugin("commonjs", [
							"desktop-capturer",
							"electron",
							"ipc",
							"ipc-renderer",
							"remote",
							"web-frame",
							"clipboard",
							"crash-reporter",
							"native-image",
							"screen",
							"shell"
						]),
						new LoaderTargetPlugin(options.target)
					);
					break;
				default:
					throw new Error("Unsupported target '" + options.target + "'.");
			}
		} else if(options.target !== false) {
			options.target(compiler);
		} else {
			throw new Error("Unsupported target '" + options.target + "'.");
		}

		if(options.output.library || options.output.libraryTarget !== "var") {
			let LibraryTemplatePlugin = require("./LibraryTemplatePlugin");
			compiler.apply(new LibraryTemplatePlugin(options.output.library, options.output.libraryTarget, options.output.umdNamedDefine, options.output.auxiliaryComment || "", options.output.libraryExport));
		}
		if(options.externals) {
			ExternalsPlugin = require("./ExternalsPlugin");
			compiler.apply(new ExternalsPlugin(options.output.libraryTarget, options.externals));
		}
		let noSources;
		let legacy;
		let modern;
		let comment;
		if(options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)) {
			const hidden = options.devtool.indexOf("hidden") >= 0;
			const inline = options.devtool.indexOf("inline") >= 0;
			const evalWrapped = options.devtool.indexOf("eval") >= 0;
			const cheap = options.devtool.indexOf("cheap") >= 0;
			const moduleMaps = options.devtool.indexOf("module") >= 0;
			noSources = options.devtool.indexOf("nosources") >= 0;
			legacy = options.devtool.indexOf("@") >= 0;
			modern = options.devtool.indexOf("#") >= 0;
			comment = legacy && modern ? "\n/*\n//@ source" + "MappingURL=[url]\n//# source" + "MappingURL=[url]\n*/" :
				legacy ? "\n/*\n//@ source" + "MappingURL=[url]\n*/" :
				modern ? "\n//# source" + "MappingURL=[url]" :
				null;
			let Plugin = evalWrapped ? EvalSourceMapDevToolPlugin : SourceMapDevToolPlugin;
			compiler.apply(new Plugin({
				filename: inline ? null : options.output.sourceMapFilename,
				moduleFilenameTemplate: options.output.devtoolModuleFilenameTemplate,
				fallbackModuleFilenameTemplate: options.output.devtoolFallbackModuleFilenameTemplate,
				append: hidden ? false : comment,
				module: moduleMaps ? true : cheap ? false : true,
				columns: cheap ? false : true,
				lineToLine: options.output.devtoolLineToLine,
				noSources: noSources,
			}));
		} else if(options.devtool && options.devtool.indexOf("eval") >= 0) {
			legacy = options.devtool.indexOf("@") >= 0;
			modern = options.devtool.indexOf("#") >= 0;
			comment = legacy && modern ? "\n//@ sourceURL=[url]\n//# sourceURL=[url]" :
				legacy ? "\n//@ sourceURL=[url]" :
				modern ? "\n//# sourceURL=[url]" :
				null;
			compiler.apply(new EvalDevToolModulePlugin(comment, options.output.devtoolModuleFilenameTemplate));
		}

		compiler.apply(new EntryOptionPlugin());
		//在 entry 配置项处理过之后，执行插件。
		compiler.applyPluginsBailResult("entry-option", options.context, options.entry);

		compiler.apply(
			new CompatibilityPlugin(),
			new HarmonyModulesPlugin(options.module),
			new AMDPlugin(options.module, options.amd || {}),
			new CommonJsPlugin(options.module),
			new LoaderPlugin(),
			new NodeStuffPlugin(options.node),
			new RequireJsStuffPlugin(),
			new APIPlugin(),
			new ConstPlugin(),
			new UseStrictPlugin(),
			new RequireIncludePlugin(),
			new RequireEnsurePlugin(),
			new RequireContextPlugin(options.resolve.modules, options.resolve.extensions, options.resolve.mainFiles),
			new ImportPlugin(options.module),
			new SystemPlugin(options.module)
		);

		compiler.apply(
			new EnsureChunkConditionsPlugin(),
			new RemoveParentModulesPlugin(),
			new RemoveEmptyChunksPlugin(),
			new MergeDuplicateChunksPlugin(),
			new FlagIncludedChunksPlugin(),
			new OccurrenceOrderPlugin(true),
			new FlagDependencyExportsPlugin(),
			new FlagDependencyUsagePlugin()
		);

		if(options.performance) {
			compiler.apply(new SizeLimitsPlugin(options.performance));
		}

		compiler.apply(new TemplatedPathPlugin());

		compiler.apply(new RecordIdsPlugin());

		compiler.apply(new WarnCaseSensitiveModulesPlugin());

		if(options.cache) {
			let CachePlugin = require("./CachePlugin");
			compiler.apply(new CachePlugin(typeof options.cache === "object" ? options.cache : null));
		}
		//设置完初始插件之后，执行插件。
		compiler.applyPlugins("after-plugins", compiler);
		if(!compiler.inputFileSystem) throw new Error("No input filesystem provided");
		compiler.resolvers.normal = ResolverFactory.createResolver(Object.assign({
			fileSystem: compiler.inputFileSystem
		}, options.resolve));
		compiler.resolvers.context = ResolverFactory.createResolver(Object.assign({
			fileSystem: compiler.inputFileSystem,
			resolveToContext: true
		}, options.resolve));
		compiler.resolvers.loader = ResolverFactory.createResolver(Object.assign({
			fileSystem: compiler.inputFileSystem
		}, options.resolveLoader));
		//resolver 安装完成之后，执行插件。
		compiler.applyPlugins("after-resolvers", compiler);
		return options;
	}
}

module.exports = WebpackOptionsApply;
```

`mainTemplate.js`

```javascript
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const ConcatSource = require("webpack-sources").ConcatSource;
const OriginalSource = require("webpack-sources").OriginalSource;
const PrefixSource = require("webpack-sources").PrefixSource;
const Template = require("./Template");

// require function shortcuts:
// __webpack_require__.s = the module id of the entry point
// __webpack_require__.c = the module cache
// __webpack_require__.m = the module functions
// __webpack_require__.p = the bundle public path
// __webpack_require__.i = the identity function used for harmony imports
// __webpack_require__.e = the chunk ensure function
// __webpack_require__.d = the exported propery define getter function
// __webpack_require__.o = Object.prototype.hasOwnProperty.call
// __webpack_require__.n = compatibility get default export
// __webpack_require__.h = the webpack hash
// __webpack_require__.oe = the uncatched error handler for the webpack runtime
// __webpack_require__.nc = the script nonce

module.exports = class MainTemplate extends Template {
	constructor(outputOptions) {
		super(outputOptions);
		this.plugin("startup", (source, chunk, hash) => {
			const buf = [];
			if(chunk.entryModule) {
				buf.push("// Load entry module and return exports");
				buf.push(`return ${this.renderRequireFunctionForModule(hash, chunk, JSON.stringify(chunk.entryModule.id))}(${this.requireFn}.s = ${JSON.stringify(chunk.entryModule.id)});`);
			}
			return this.asString(buf);
		});
		this.plugin("render", (bootstrapSource, chunk, hash, moduleTemplate, dependencyTemplates) => {
			const source = new ConcatSource();
			source.add("/******/ (function(modules) { // webpackBootstrap\n");
			source.add(new PrefixSource("/******/", bootstrapSource));
			source.add("/******/ })\n");
			source.add("/************************************************************************/\n");
			source.add("/******/ (");
			const modules = this.renderChunkModules(chunk, moduleTemplate, dependencyTemplates, "/******/ ");
			source.add(this.applyPluginsWaterfall("modules", modules, chunk, hash, moduleTemplate, dependencyTemplates));
			source.add(")");
			return source;
		});
		this.plugin("local-vars", (source, chunk, hash) => {
			return this.asString([
				source,
				"// The module cache",
				"var installedModules = {};"
			]);
		});
		this.plugin("require", (source, chunk, hash) => {
			return this.asString([
				source,
				"// Check if module is in cache",
				"if(installedModules[moduleId]) {",
				this.indent("return installedModules[moduleId].exports;"),
				"}",
				"// Create a new module (and put it into the cache)",
				"var module = installedModules[moduleId] = {",
				this.indent(this.applyPluginsWaterfall("module-obj", "", chunk, hash, "moduleId")),
				"};",
				"",
				this.asString(outputOptions.strictModuleExceptionHandling ? [
					"// Execute the module function",
					"var threw = true;",
					"try {",
					this.indent([
						`modules[moduleId].call(module.exports, module, module.exports, ${this.renderRequireFunctionForModule(hash, chunk, "moduleId")});`,
						"threw = false;"
					]),
					"} finally {",
					this.indent([
						"if(threw) delete installedModules[moduleId];"
					]),
					"}"
				] : [
					"// Execute the module function",
					`modules[moduleId].call(module.exports, module, module.exports, ${this.renderRequireFunctionForModule(hash, chunk, "moduleId")});`,
				]),
				"",
				"// Flag the module as loaded",
				"module.l = true;",
				"",
				"// Return the exports of the module",
				"return module.exports;"
			]);
		});
		this.plugin("module-obj", (source, chunk, hash, varModuleId) => {
			return this.asString([
				"i: moduleId,",
				"l: false,",
				"exports: {}"
			]);
		});
		this.plugin("require-extensions", (source, chunk, hash) => {
			const buf = [];
			const chunkMaps = chunk.getChunkMaps();
			// Check if there are non initial chunks which need to be imported using require-ensure
			if(Object.keys(chunkMaps.hash).length) {
				buf.push("// This file contains only the entry chunk.");
				buf.push("// The chunk loading function for additional chunks");
				buf.push(`${this.requireFn}.e = function requireEnsure(chunkId) {`);
				buf.push(this.indent(this.applyPluginsWaterfall("require-ensure", "throw new Error('Not chunk loading available');", chunk, hash, "chunkId")));
				buf.push("};");
			}
			buf.push("");
			buf.push("// expose the modules object (__webpack_modules__)");
			buf.push(`${this.requireFn}.m = modules;`);

			buf.push("");
			buf.push("// expose the module cache");
			buf.push(`${this.requireFn}.c = installedModules;`);

			buf.push("");
			buf.push("// define getter function for harmony exports");
			buf.push(`${this.requireFn}.d = function(exports, name, getter) {`);
			buf.push(this.indent([
				`if(!${this.requireFn}.o(exports, name)) {`,
				this.indent([
					"Object.defineProperty(exports, name, {",
					this.indent([
						"configurable: false,",
						"enumerable: true,",
						"get: getter"
					]),
					"});"
				]),
				"}"
			]));
			buf.push("};");

			buf.push("");
			buf.push("// getDefaultExport function for compatibility with non-harmony modules");
			buf.push(this.requireFn + ".n = function(module) {");
			buf.push(this.indent([
				"var getter = module && module.__esModule ?",
				this.indent([
					"function getDefault() { return module['default']; } :",
					"function getModuleExports() { return module; };"
				]),
				`${this.requireFn}.d(getter, 'a', getter);`,
				"return getter;"
			]));
			buf.push("};");

			buf.push("");
			buf.push("// Object.prototype.hasOwnProperty.call");
			buf.push(`${this.requireFn}.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };`);

			const publicPath = this.getPublicPath({
				hash: hash
			});
			buf.push("");
			buf.push("// __webpack_public_path__");
			buf.push(`${this.requireFn}.p = ${JSON.stringify(publicPath)};`);
			return this.asString(buf);
		});

		this.requireFn = "__webpack_require__";
	}

	render(hash, chunk, moduleTemplate, dependencyTemplates) {
		const buf = [];
		buf.push(this.applyPluginsWaterfall("bootstrap", "", chunk, hash, moduleTemplate, dependencyTemplates));
		buf.push(this.applyPluginsWaterfall("local-vars", "", chunk, hash));
		buf.push("");
		buf.push("// The require function");
		buf.push(`function ${this.requireFn}(moduleId) {`);
		buf.push(this.indent(this.applyPluginsWaterfall("require", "", chunk, hash)));
		buf.push("}");
		buf.push("");
		buf.push(this.asString(this.applyPluginsWaterfall("require-extensions", "", chunk, hash)));
		buf.push("");
		buf.push(this.asString(this.applyPluginsWaterfall("startup", "", chunk, hash)));
		let source = this.applyPluginsWaterfall("render", new OriginalSource(this.prefix(buf, " \t") + "\n", `webpack/bootstrap ${hash}`), chunk, hash, moduleTemplate, dependencyTemplates);
		if(chunk.hasEntryModule()) {
			source = this.applyPluginsWaterfall("render-with-entry", source, chunk, hash);
		}
		if(!source) throw new Error("Compiler error: MainTemplate plugin 'render' should return something");
		chunk.rendered = true;
		return new ConcatSource(source, ";");
	}

	renderRequireFunctionForModule(hash, chunk, varModuleId) {
		return this.applyPluginsWaterfall("module-require", this.requireFn, chunk, hash, varModuleId);
	}

	renderAddModule(hash, chunk, varModuleId, varModule) {
		return this.applyPluginsWaterfall("add-module", `modules[${varModuleId}] = ${varModule};`, chunk, hash, varModuleId, varModule);
	}

	renderCurrentHashCode(hash, length) {
		length = length || Infinity;
		return this.applyPluginsWaterfall("current-hash", JSON.stringify(hash.substr(0, length)), length);
	}

	entryPointInChildren(chunk) {
		const checkChildren = (chunk, alreadyCheckedChunks) => {
			return chunk.chunks.some((child) => {
				if(alreadyCheckedChunks.indexOf(child) >= 0) return;
				alreadyCheckedChunks.push(child);
				return child.hasEntryModule() || checkChildren(child, alreadyCheckedChunks);
			});
		};
		return checkChildren(chunk, []);
	}

	getPublicPath(options) {
		return this.applyPluginsWaterfall("asset-path", this.outputOptions.publicPath || "", options);
	}

	updateHash(hash) {
		hash.update("maintemplate");
		hash.update("3");
		hash.update(this.outputOptions.publicPath + "");
		this.applyPlugins("hash", hash);
	}

	updateHashForChunk(hash, chunk) {
		this.updateHash(hash);
		this.applyPlugins("hash-for-chunk", hash, chunk);
	}

	useChunkHash(chunk) {
		const paths = this.applyPluginsWaterfall("global-hash-paths", []);
		return !this.applyPluginsBailResult("global-hash", chunk, paths);
	}
};

```

`JsonpMainTemplatePlugin.js`

```javascript
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Template = require("./Template");

class JsonpMainTemplatePlugin {

	apply(mainTemplate) {
		mainTemplate.plugin("local-vars", function(source, chunk) {
			if(chunk.chunks.length > 0) {
				return this.asString([
					source,
					"",
					"// objects to store loaded and loading chunks",
					"var installedChunks = {",
					this.indent(
						chunk.ids.map(id => `${JSON.stringify(id)}: 0`).join(",\n")
					),
					"};"
				]);
			}
			return source;
		});
		mainTemplate.plugin("jsonp-script", function(_, chunk, hash) {
			const chunkFilename = this.outputOptions.chunkFilename;
			const chunkMaps = chunk.getChunkMaps();
			const crossOriginLoading = this.outputOptions.crossOriginLoading;
			const chunkLoadTimeout = this.outputOptions.chunkLoadTimeout;
			const jsonpScriptType = this.outputOptions.jsonpScriptType;
			const scriptSrcPath = this.applyPluginsWaterfall("asset-path", JSON.stringify(chunkFilename), {
				hash: `" + ${this.renderCurrentHashCode(hash)} + "`,
				hashWithLength: length => `" + ${this.renderCurrentHashCode(hash, length)} + "`,
				chunk: {
					id: "\" + chunkId + \"",
					hash: `" + ${JSON.stringify(chunkMaps.hash)}[chunkId] + "`,
					hashWithLength(length) {
						const shortChunkHashMap = Object.create(null);
						Object.keys(chunkMaps.hash).forEach(chunkId => {
							if(typeof chunkMaps.hash[chunkId] === "string")
								shortChunkHashMap[chunkId] = chunkMaps.hash[chunkId].substr(0, length);
						});
						return `" + ${JSON.stringify(shortChunkHashMap)}[chunkId] + "`;
					},
					name: `" + (${JSON.stringify(chunkMaps.name)}[chunkId]||chunkId) + "`
				}
			});
			return this.asString([
				"var script = document.createElement('script');",
				`script.type = ${JSON.stringify(jsonpScriptType)};`,
				"script.charset = 'utf-8';",
				"script.async = true;",
				`script.timeout = ${chunkLoadTimeout};`,
				crossOriginLoading ? `script.crossOrigin = ${JSON.stringify(crossOriginLoading)};` : "",
				`if (${this.requireFn}.nc) {`,
				this.indent(`script.setAttribute("nonce", ${this.requireFn}.nc);`),
				"}",
				`script.src = ${this.requireFn}.p + ${scriptSrcPath};`,
				`var timeout = setTimeout(onScriptComplete, ${chunkLoadTimeout});`,
				"script.onerror = script.onload = onScriptComplete;",
				"function onScriptComplete() {",
				this.indent([
					"// avoid mem leaks in IE.",
					"script.onerror = script.onload = null;",
					"clearTimeout(timeout);",
					"var chunk = installedChunks[chunkId];",
					"if(chunk !== 0) {",
					this.indent([
						"if(chunk) {",
						this.indent("chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));"),
						"}",
						"installedChunks[chunkId] = undefined;"
					]),
					"}"
				]),
				"};",
			]);
		});
		mainTemplate.plugin("require-ensure", function(_, chunk, hash) {
			return this.asString([
				"var installedChunkData = installedChunks[chunkId];",
				"if(installedChunkData === 0) {",
				this.indent([
					"return new Promise(function(resolve) { resolve(); });"
				]),
				"}",
				"",
				"// a Promise means \"currently loading\".",
				"if(installedChunkData) {",
				this.indent([
					"return installedChunkData[2];"
				]),
				"}",
				"",
				"// setup Promise in chunk cache",
				"var promise = new Promise(function(resolve, reject) {",
				this.indent([
					"installedChunkData = installedChunks[chunkId] = [resolve, reject];"
				]),
				"});",
				"installedChunkData[2] = promise;",
				"",
				"// start chunk loading",
				"var head = document.getElementsByTagName('head')[0];",
				this.applyPluginsWaterfall("jsonp-script", "", chunk, hash),
				"head.appendChild(script);",
				"",
				"return promise;"
			]);
		});
		mainTemplate.plugin("require-extensions", function(source, chunk) {
			if(chunk.chunks.length === 0) return source;

			return this.asString([
				source,
				"",
				"// on error function for async loading",
				`${this.requireFn}.oe = function(err) { console.error(err); throw err; };`
			]);
		});
		mainTemplate.plugin("bootstrap", function(source, chunk, hash) {
			if(chunk.chunks.length > 0) {
				var jsonpFunction = this.outputOptions.jsonpFunction;
				return this.asString([
					source,
					"",
					"// install a JSONP callback for chunk loading",
					`var parentJsonpFunction = window[${JSON.stringify(jsonpFunction)}];`,
					`window[${JSON.stringify(jsonpFunction)}] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {`,
					this.indent([
						"// add \"moreModules\" to the modules object,",
						"// then flag all \"chunkIds\" as loaded and fire callback",
						"var moduleId, chunkId, i = 0, resolves = [], result;",
						"for(;i < chunkIds.length; i++) {",
						this.indent([
							"chunkId = chunkIds[i];",
							"if(installedChunks[chunkId]) {",
							this.indent("resolves.push(installedChunks[chunkId][0]);"),
							"}",
							"installedChunks[chunkId] = 0;"
						]),
						"}",
						"for(moduleId in moreModules) {",
						this.indent([
							"if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {",
							this.indent(this.renderAddModule(hash, chunk, "moduleId", "moreModules[moduleId]")),
							"}"
						]),
						"}",
						"if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);",
						"while(resolves.length) {",
						this.indent("resolves.shift()();"),
						"}",
						this.entryPointInChildren(chunk) ? [
							"if(executeModules) {",
							this.indent([
								"for(i=0; i < executeModules.length; i++) {",
								this.indent(`result = ${this.requireFn}(${this.requireFn}.s = executeModules[i]);`),
								"}"
							]),
							"}",
							"return result;",
						] : ""
					]),
					"};"
				]);
			}
			return source;
		});
		mainTemplate.plugin("hot-bootstrap", function(source, chunk, hash) {
			const hotUpdateChunkFilename = this.outputOptions.hotUpdateChunkFilename;
			const hotUpdateMainFilename = this.outputOptions.hotUpdateMainFilename;
			const crossOriginLoading = this.outputOptions.crossOriginLoading;
			const hotUpdateFunction = this.outputOptions.hotUpdateFunction;
			const currentHotUpdateChunkFilename = this.applyPluginsWaterfall("asset-path", JSON.stringify(hotUpdateChunkFilename), {
				hash: `" + ${this.renderCurrentHashCode(hash)} + "`,
				hashWithLength: length => `" + ${this.renderCurrentHashCode(hash, length)} + "`,
				chunk: {
					id: "\" + chunkId + \""
				}
			});
			const currentHotUpdateMainFilename = this.applyPluginsWaterfall("asset-path", JSON.stringify(hotUpdateMainFilename), {
				hash: `" + ${this.renderCurrentHashCode(hash)} + "`,
				hashWithLength: length => `" + ${this.renderCurrentHashCode(hash, length)} + "`
			});
			const runtimeSource = Template.getFunctionContent(require("./JsonpMainTemplate.runtime.js"))
				.replace(/\/\/\$semicolon/g, ";")
				.replace(/\$require\$/g, this.requireFn)
				.replace(/\$crossOriginLoading\$/g, crossOriginLoading ? `script.crossOrigin = ${JSON.stringify(crossOriginLoading)}` : "")
				.replace(/\$hotMainFilename\$/g, currentHotUpdateMainFilename)
				.replace(/\$hotChunkFilename\$/g, currentHotUpdateChunkFilename)
				.replace(/\$hash\$/g, JSON.stringify(hash));
			return `${source}
function hotDisposeChunk(chunkId) {
	delete installedChunks[chunkId];
}
var parentHotUpdateCallback = window[${JSON.stringify(hotUpdateFunction)}];
window[${JSON.stringify(hotUpdateFunction)}] = ${runtimeSource}`;
		});
		mainTemplate.plugin("hash", function(hash) {
			hash.update("jsonp");
			hash.update("4");
			hash.update(`${this.outputOptions.filename}`);
			hash.update(`${this.outputOptions.chunkFilename}`);
			hash.update(`${this.outputOptions.jsonpFunction}`);
			hash.update(`${this.outputOptions.hotUpdateFunction}`);
		});
	}
}
module.exports = JsonpMainTemplatePlugin;

```

