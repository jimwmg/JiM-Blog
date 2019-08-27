---

---

### 1 首先明确webpack中chunk和module含义

#### chunk

总共有三种：

| chun类型                              | 含义                                                         |      |
| ------------------------------------- | ------------------------------------------------------------ | ---- |
| initial chunk(入口chunk)              | 表示所有入口处配置的每个文件都是一个chunk,这个chunk可以理解为祖先chunk |      |
| async chunk(异步加载的chunk)          | 通过 require.ensure 或者 import() 动态加载的chunk为异步chunk,这些chunk可以理解为是祖先chunk的子chunk |      |
| common chunk(即其他chunks的公用chunk) | 入口模块引用的公用chunk会被分离到这里                        |      |

#### module

module就是我们写的那些模块

比如

`utils.js`

```javascript
module.exports = {
	foo:function(){
	//...
	}
}
```

这个模块经过webpack打包后会成为一个模块，很多这样的模块被融合在一起就是一个chunk,chunk最后会被输出成一个个文件；

### 2 webpack 使用commonChunkPlugin

接受的配置项如下

```javascript
{
  name: string, // or
  names: string[],
  // 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
  // 如果一个字符串数组被传入，这相当于插件针对每个 chunk 名被多次调用
  // 如果该选项被忽略，同时 `options.async` 或者 `options.children` 被设置，所有的 chunk 都会被使用，
  // 否则 `options.filename` 会用于作为 chunk 名。
  // When using `options.async` to create common chunks from other async chunks you must specify an entry-point
  // chunk name here instead of omitting the `option.name`.

  filename: string,
  // common chunk 的文件名模板。可以包含与 `output.filename` 相同的占位符。
  // 如果被忽略，原本的文件名不会被修改(通常是 `output.filename` 或者 `output.chunkFilename`)。
  // This option is not permitted if you're using `options.async` as well, see below for more details.

  minChunks: number|Infinity|function(module, count) -> boolean,
  // 在传入  公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
  // 数量必须大于等于2，或者少于等于 chunks的数量
  // 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
  // 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）

  chunks: string[],
  // 通过 chunk name 去选择 chunks 的来源。chunk 必须是  公共chunk 的子模块。
  // 如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。

  children: boolean,
  // 如果设置为 `true`，所有公共 chunk 的子模块都会被选择

  deepChildren: boolean,
  // 如果设置为 `true`，所有公共 chunk 的后代模块都会被选择

  async: boolean|string,
  // 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
  // 它会与 `options.chunks` 并行被加载。
  // Instead of using `option.filename`, it is possible to change the name of the output file by providing
  // the desired string here instead of `true`.

  minSize: number,
  // 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。
}
```



```javascript
new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // minChunks:2, 至少两个以上chunk引用这个模块才会打入公用chunk
      minChunks: function(module,count){
        debugger;
        let isVendor = /module\.common/.test(module.resource);
        console.log('count',count,module)
        // return module.resource && (count >= 1)
        return isVendor
      },
    }),
    
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename:'manifest.js',
      minChunks: Infinity,
    }),
```

### 3 commonsChunkPlugin 入口

```javascript
class CommonsChunkPlugin{
  constructor(options){
    const normalizedOptions = this.normalizeOptions(options);
    //....
  }
  normalizeOptions(options) {
    if(Array.isArray(options)) {
      return {
        chunkNames: options,
      };
    }

    if(typeof options === "string") {
      return {
        chunkNames: [options],
      };
    }

    // options.children and options.chunk may not be used together
    if(options.children && options.chunks) {
      throw new Error("You can't and it does not make any sense to use \"children\" and \"chunk\" options together.");
    }

    /**
		 * options.async and options.filename are also not possible together
		 * as filename specifies how the chunk is called but "async" implies
		 * that webpack will take care of loading this file.
		 */
    if(options.async && options.filename) {
      throw new Error(`You can not specify a filename if you use the "async" option.
You can however specify the name of the async chunk by passing the desired string as the "async" option.`);
    }

    /**
		 * Make sure this is either an array or undefined.
		 * "name" can be a string and
		 * "names" a string or an array
		 */
    const chunkNames = options.name || options.names ? [].concat(options.name || options.names) : undefined;
    return {
      chunkNames: chunkNames,
      filenameTemplate: options.filename,
      minChunks: options.minChunks,
      selectedChunks: options.chunks,
      children: options.children,
      deepChildren: options.deepChildren,
      async: options.async,
      minSize: options.minSize
    };
  }
}
apply(compiler) {
  compiler.plugin("this-compilation", (compilation) => {
    compilation.plugin(["optimize-chunks", "optimize-extracted-chunks"], (chunks) => {
      // only optimize once
      //"optimize-chunks" 执行之后，
//      "optimize-extracted-chunks"中chunks就多了一个commonsChunkPlugin命名的chunk,并且该chunk的entrypoints是指向入口chunk的entrypoints
      debugger;///Users/didi/learn/learnSPace/14webpack-learn/webpack-share/node_modules/webpack/lib/optimize/CommonsChunkPlugin.js0  这里用于控制只优化一次；
      if(compilation[this.ident]) return;
      compilation[this.ident] = true;

      /**getTargetChunks
				 * Creates a list of "common"" chunks based on the options.
				 * The list is made up of preexisting or newly created chunks.
				 * - If chunk has the name as specified in the chunkNames it is put in the list
				 * - If no chunk with the name as given in chunkNames exists a new chunk is created and added to the list
				 *
				 * These chunks are the "targets" for extracted modules.
				 简单来说，如果配置的name名字和入口中某个重复，那么入口中对应的chunk以及后续的公用模块都会被打包进[name].js这个chunk;
				 如果没有和入口的某个名字重复，那么就只有公用的chunk被打包进[name].js这个chunk
				 */
      const targetChunks = this.getTargetChunks(chunks, compilation, this.chunkNames, this.children, this.async);

      // iterate over all our new chunks
      targetChunks.forEach((targetChunk, idx) => {

        /**
					 * These chunks are subject to get "common" modules extracted and moved to the common chunk
					 */
        const affectedChunks = this.getAffectedChunks(compilation, chunks, targetChunk, targetChunks, idx, this.selectedChunks, this.async, this.children, this.deepChildren);

        // bail if no chunk is affected
        if(!affectedChunks) {
          return;
        }

        // If we are async create an async chunk now
        // override the "commonChunk" with the newly created async one and use it as commonChunk from now on
        let asyncChunk;
        if(this.async) {
          // If async chunk is one of the affected chunks, just use it
          asyncChunk = affectedChunks.filter(c => c.name === this.async)[0];
          // Elsewise create a new one
          if(!asyncChunk) {
            asyncChunk = this.createAsyncChunk(
              compilation,
              targetChunks.length <= 1 || typeof this.async !== "string" ? this.async :
              targetChunk.name ? `${this.async}-${targetChunk.name}` :
              true,
              targetChunk
            );
          }
          targetChunk = asyncChunk;
        }

        /**
					 * Check which modules are "common" and could be extracted to a "common" chunk
					 */
        const extractableModules = this.getExtractableModules(this.minChunks, affectedChunks, targetChunk);

        // If the minSize option is set check if the size extracted from the chunk is reached
        // else bail out here.
        // As all modules/commons are interlinked with each other, common modules would be extracted
        // if we reach this mark at a later common chunk. (quirky I guess).
        //如果公用chunk大小不满足 miniSize,那么不提取
        if(this.minSize) {
          const modulesSize = this.calculateModulesSize(extractableModules);
          // if too small, bail
          if(modulesSize < this.minSize)
            return;
        }

        // Remove modules that are moved to commons chunk from their original chunks
        // return all chunks that are affected by having modules removed - we need them later (apparently)
        const chunksWithExtractedModules = this.extractModulesAndReturnAffectedChunks(extractableModules, affectedChunks);

        // connect all extracted modules with the common chunk
        this.addExtractedModulesToTargetChunk(targetChunk, extractableModules);

        // set filenameTemplate for chunk
        if(this.filenameTemplate)
          targetChunk.filenameTemplate = this.filenameTemplate;

        // if we are async connect the blocks of the "reallyUsedChunk" - the ones that had modules removed -
        // with the commonChunk and get the origins for the asyncChunk (remember "asyncChunk === commonChunk" at this moment).
        // bail out
        if(this.async) {
          this.moveExtractedChunkBlocksToTargetChunk(chunksWithExtractedModules, targetChunk);
          asyncChunk.origins = this.extractOriginsOfChunksWithExtractedModules(chunksWithExtractedModules);
          return;
        }

        // we are not in "async" mode
        // connect used chunks with commonChunk - shouldnt this be reallyUsedChunks here?
        this.makeTargetChunkParentOfAffectedChunks(affectedChunks, targetChunk);
      });
      return true;
    });
  });
}

getTargetChunks(allChunks, compilation, chunkNames, children, asyncOption) {
  const asyncOrNoSelectedChunk = children || asyncOption;

  // we have specified chunk names
  if(chunkNames) { //['vendor']
    // map chunks by chunkName for quick access
    const allChunksNameMap = allChunks.reduce((map, chunk) => {
      if(chunk.name) {
        map.set(chunk.name, chunk);
      }
      return map;
    }, new Map());

    // Ensure we have a chunk per specified chunk name.
    // Reuse existing chunks if possible
    return chunkNames.map(chunkName => {
      if(allChunksNameMap.has(chunkName)) {
        return allChunksNameMap.get(chunkName);
      }
      // add the filtered chunks to the compilation
      return compilation.addChunk(chunkName);
    });
  }

  // we dont have named chunks specified, so we just take all of them
  if(asyncOrNoSelectedChunk) {
    return allChunks;
  }

  /**
		 * No chunk name(s) was specified nor is this an async/children commons chunk
		 */
  throw new Error(`You did not specify any valid target chunk settings.
Take a look at the "name"/"names" or async/children option.`);
}
```

