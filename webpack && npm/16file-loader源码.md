---
title
---

### 1 file-loader依赖

```
"loader-utils": "^1.0.2",
 "schema-utils": "^0.4.5"
```



[loader-utils文档](https://www.npmjs.com/package/loader-utils)

其中 interpolateName 这个接口决定了 `file-loader`中的某些参数;

### `interpolateName`

Interpolates a filename template using multiple placeholders and/or a regular expression. The template and regular expression are set as query params called `name` and `regExp` on the current loader's context.

```
const interpolatedName = loaderUtils.interpolateName(loaderContext, name, options);
```

The following tokens are replaced in the `name` parameter:

- `[ext]` the extension of the resource

- `[name]` the basename of the resource

- `[path]` the path of the resource relative to the `context` query parameter or option.

- `[folder]` the folder of the resource is in.

- `[emoji]` a random emoji representation of `options.content`

- `[emoji:<length>]` same as above, but with a customizable number of emojis

- `[contenthash]` the hash of `options.content` (Buffer) (by default it's the hex digest of the md5 hash)

- ```
  [<hashType>:contenthash:<digestType>:<length>]
  ```

   

  optionally one can configure

  - other `hashType`s, i. e. `sha1`, `md5`, `sha256`, `sha512`
  - other `digestType`s, i. e. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  - and `length` the length in chars

- `[hash]` the hash of `options.content` (Buffer) (by default it's the hex digest of the md5 hash)

- ```
  [<hashType>:hash:<digestType>:<length>]
  ```

   

  optionally one can configure

  - other `hashType`s, i. e. `sha1`, `md5`, `sha256`, `sha512`
  - other `digestType`s, i. e. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  - and `length` the length in chars

- `[N]` the N-th match obtained from matching the current file name against `options.regExp`

In loader context `[hash]` and `[contenthash]` are the same, but we recommend using `[contenthash]` for avoid misleading.

Examples

```
// loaderContext.resourcePath = "/app/js/javascript.js"
loaderUtils.interpolateName(loaderContext, "js/[hash].script.[ext]", { content: ... });
// => js/9473fdd0d880a43c21b7778d34872157.script.js
 
// loaderContext.resourcePath = "/app/js/javascript.js"
loaderUtils.interpolateName(loaderContext, "js/[contenthash].script.[ext]", { content: ... });
// => js/9473fdd0d880a43c21b7778d34872157.script.js
 
// loaderContext.resourcePath = "/app/page.html"
loaderUtils.interpolateName(loaderContext, "html-[hash:6].html", { content: ... });
// => html-9473fd.html
 
// loaderContext.resourcePath = "/app/flash.txt"
loaderUtils.interpolateName(loaderContext, "[hash]", { content: ... });
// => c31e9820c001c9c4a86bce33ce43b679
 
// loaderContext.resourcePath = "/app/img/image.gif"
loaderUtils.interpolateName(loaderContext, "[emoji]", { content: ... });
// => 👍
 
// loaderContext.resourcePath = "/app/img/image.gif"
loaderUtils.interpolateName(loaderContext, "[emoji:4]", { content: ... });
// => 🙍🏢📤🐝
 
// loaderContext.resourcePath = "/app/img/image.png"
loaderUtils.interpolateName(loaderContext, "[sha512:hash:base64:7].[ext]", { content: ... });
// => 2BKDTjl.png
// use sha512 hash instead of md5 and with only 7 chars of base64
 
// loaderContext.resourcePath = "/app/img/myself.png"
// loaderContext.query.name =
loaderUtils.interpolateName(loaderContext, "picture.png");
// => picture.png
 
// loaderContext.resourcePath = "/app/dir/file.png"
loaderUtils.interpolateName(loaderContext, "[path][name].[ext]?[hash]", { content: ... });
// => /app/dir/file.png?9473fdd0d880a43c21b7778d34872157
 
// loaderContext.resourcePath = "/app/js/page-home.js"
loaderUtils.interpolateName(loaderContext, "script-[1].[ext]", { regExp: "page-(.*)\\.js", content: ... });
// => script-home.js
```

### 2 file-loader源码

[file-loader文档](https://www.npmjs.com/package/file-loader)

```javascript
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.raw = undefined;
exports.default = loader;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _schemaUtils = require('schema-utils');

var _schemaUtils2 = _interopRequireDefault(_schemaUtils);

var _options = require('./options.json');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable
  multiline-ternary,
*/
function loader(content) {
  if (!this.emitFile) throw new Error('File Loader\n\nemitFile is required from module system');

  var options = _loaderUtils2.default.getOptions(this) || {};

  (0, _schemaUtils2.default)(_options2.default, options, 'File Loader');

  var context = options.context || this.rootContext || this.options && this.options.context;

  var url = _loaderUtils2.default.interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp
  });

  var outputPath = url;

  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url);
    } else {
      outputPath = _path2.default.posix.join(options.outputPath, url);
    }
  }

  if (options.useRelativePath) {
    var filePath = this.resourcePath;

    var issuer = options.context ? context : this._module && this._module.issuer && this._module.issuer.context;

    var relativeUrl = issuer && _path2.default.relative(issuer, filePath).split(_path2.default.sep).join('/');

    var relativePath = relativeUrl && `${_path2.default.dirname(relativeUrl)}/`;
    // eslint-disable-next-line no-bitwise
    if (~relativePath.indexOf('../')) {
      outputPath = _path2.default.posix.join(outputPath, relativePath, url);
    } else {
      outputPath = _path2.default.posix.join(relativePath, url);
    }
  }
//https://webpack.js.org/api/module-variables/#__webpack_public_path__-webpack-specific-
  var publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

  if (options.publicPath) {
    if (typeof options.publicPath === 'function') {
      publicPath = options.publicPath(url);
    } else if (options.publicPath.endsWith('/')) {
      publicPath = options.publicPath + url;
    } else {
      publicPath = `${options.publicPath}/${url}`;
    }

    publicPath = JSON.stringify(publicPath);
  }

  if (options.emitFile === undefined || options.emitFile) {
    this.emitFile(outputPath, content);
  }
  // TODO revert to ES2015 Module export, when new CSS Pipeline is in place
  return `module.exports = ${publicPath};`;
}

var raw = exports.raw = true;
```

### 3 url-loader源码

```javascript
var loaderUtils = require('loader-utils')
var mime = require("mime")

module.exports = function(content) {

	// 获取 options 配置，上面已经讲过了就不在重复
  var options =  loaderUtils.getOptions(this) || {};
  // Options `dataUrlLimit` is backward compatibility with first loader versions
	// limit 参数，只有文件大小小于这个数值的时候我们才进行base64编码，否则将直接调用 file-loader
  var limit = options.limit || (this.options && this.options.url && this.options.url.dataUrlLimit);

  if(limit) {
    limit = parseInt(limit, 10);
  }

  var mimetype = options.mimetype || options.minetype || mime.lookup(this.resourcePath);

  // No limits or limit more than content length
  if(!limit || content.length < limit) {
    if(typeof content === "string") {
      content = new Buffer(content);
    }

		// 直接返回 base64 编码的内容
    return "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"));
  }

	// 超过了文件大小限制，那么我们将直接调用 file-loader 来加载
  var fallback = options.fallback || "file-loader";
  var fallbackLoader = require(fallback);

  return fallbackLoader.call(this, content);
}

// 一定别忘了这个，因为默认情况下 webpack 会把文件内容当做UTF8字符串处理，而我们的文件是二进制的，当做UTF8会导致图片格式错误。
// 因此我们需要指定webpack用 raw-loader 来加载文件的内容，而不是当做 UTF8 字符串传给我们
// 参见： https://webpack.github.io/docs/loaders.html#raw-loader
module.exports.raw = true

```

