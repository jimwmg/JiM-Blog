---
title: npm包学习

### 1 npm基础
```javascript
npm init -yes
npm install package
```

### 2 package
[optimist](https://www.npmjs.com/package/optimist)

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
