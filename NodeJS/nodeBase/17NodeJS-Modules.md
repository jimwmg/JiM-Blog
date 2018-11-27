---
 title: Modules
---

### 1[ Modules] (https://nodejs.org/api/modules.html)

### 2 node-modules

* 文件模块

```javascript
#
If the exact filename is not found, then Node.js will attempt to load the required filename with the added extensions: .js, .json, and finally .node.

.js files are interpreted as JavaScript text files, and .json files are parsed as JSON text files. .node files are interpreted as compiled addon modules loaded with dlopen.

A required module prefixed with '/' is an absolute path to the file. For example, require('/home/marco/foo.js') will load the file at /home/marco/foo.js.

A required module prefixed with './' is relative to the file calling require(). That is, circle.js must be in the same directory as foo.js for require('./circle') to find it.

Without a leading '/', './', or '../' to indicate a file, the module must either be a core module or is loaded from a node_modules folder.

If the given path does not exist, require() will throw an Error with its code property set to 'MODULE_NOT_FOUND'.


```

* 文件夹模块

Loading from `node_modules` Folders[#](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders)

Loading from the global folders

```javascript
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```



```javascript
If this was in a folder at ./some-library, then require('./some-library') would attempt to load ./some-library/lib/some-library.js.

This is the extent of Node.js's awareness of package.json files.

If there is no package.json file present in the directory, or if the 'main' entry is missing or cannot be resolved, then Node.js will attempt to load an index.js or index.node file out of that directory. For example, if there was no package.json file in the above example, then require('./some-library') would attempt to load:

./some-library/index.js
./some-library/index.node
If these attempts fail, then Node.js will report the entire module as missing with the default error:

```

### 3 module wrapper

```javascript
(function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here
});
```

`exports、module`

```javascript
Module {
  id: '.',
  exports: {}, //这个就是exports
  parent: null,
  filename: '/Users/didi/learn/learnSPace/08node/01learn-npm/cmd.js',//The fully resolved filename to the module.
  loaded: false,//Whether or not the module is done loading, or is in the process of loading.
  children: [],
  paths://The search paths for the module.
   [ '/Users/didi/learn/learnSPace/08node/01learn-npm/node_modules',
     '/Users/didi/learn/learnSPace/08node/node_modules',
     '/Users/didi/learn/learnSPace/node_modules',
     '/Users/didi/learn/node_modules',
     '/Users/didi/node_modules',
     '/Users/node_modules',
     '/node_modules' ] }
```

`require`

`resolve.resolve(<path>) :返回文件路径`

```java
{ [Function: require]
  resolve: { [Function: resolve] paths: [Function: paths] },
  main:
   Module {
     id: '.',
     exports: {},
     parent: null,
     filename: '/Users/didi/learn/learnSPace/08node/01learn-npm/cmd.js',
     loaded: false,
     children: [],
     paths:
      [ '/Users/didi/learn/learnSPace/08node/01learn-npm/node_modules',
        '/Users/didi/learn/learnSPace/08node/node_modules',
        '/Users/didi/learn/learnSPace/node_modules',
        '/Users/didi/learn/node_modules',
        '/Users/didi/node_modules',
        '/Users/node_modules',
        '/node_modules' ] },
  extensions: { '.js': [Function], '.json': [Function], '.node': [Function] },
  cache:
   { '/Users/didi/learn/learnSPace/08node/01learn-npm/cmd.js':
      Module {
        id: '.',
        exports: {},
        parent: null,
        filename: '/Users/didi/learn/learnSPace/08node/01learn-npm/cmd.js',
        loaded: false,
        children: [],
        paths: [Array] } } }
```

