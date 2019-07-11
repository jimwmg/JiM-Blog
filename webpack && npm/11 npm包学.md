---
title: npm包学习

### 1 npm基础
```javascript
npm init -yes
npm install package
```

### 2 package
[optimist](https://www.npmjs.com/package/optimist):(source-code-done)

index.js
```javascript
var argv = require('optimist')
    .boolean('v')
    .argv
;
console.dir(argv);
```

```javascript 
node index.js -v -r -p

```

```javascript
{ _: [ 'foo', 'baz' ],
  v: true,
  p: 3000,
  '$0': '/usr/local/bin/node ./index.js' }
```
[portfinder](https://www.npmjs.com/package/portfinder)

index.js
```javascript 
var portfinder = require('portfinder');
portfinder.basePort = 9080;
portfinder.getPort(function (err, port) {
  //
  // `port` is guaranteed to be a free port
  // in this scope.
  //
  console.log(port) //9080
```
[union](https://www.npmjs.com/package/union)

[ip](https://www.npmjs.com/package/ip)

[prompt](https://www.npmjs.com/package/prompt)

[ora](https://www.npmjs.com/package/ora)

[node-notifier](https://www.npmjs.com/package/node-notifier) : 错误提示

[commander](https://www.npmjs.com/package/commander):（source-code-done）

[glob](https://www.npmjs.com/package/glob)

[async](https://www.npmjs.com/package/async)

[fs-readdir-recursive](https://www.npmjs.com/package/fs-readdir-recursive)

[resolve](https://www.npmjs.com/package/resolve)



