---
title:  NodeJs url模块 
date: 2016-12-21 12:36:00
categories: nodejs 
---

### 1 创建一个服务器

```javascript
var http = require('http');
var url = require('url');
var server = http.createServer((req,res)=>{
    console.log(url.parse(req.url))
}).listen(3000,'localhost')
//打开浏览器访问：http://localhost:8080/user?name=jim&url=www.runoob.com
```

### 2 具体看下如何使用

首先看下一个url字符串包含的内容

url  string <=====>    url Object

```
                           href
 -----------------------------------------------------------------
                            host              path
                      --------------- ----------------------------
 http: // user:pass @ host.com : 8080 /p/a/t/h ?query=string #hash
 -----    ---------   --------   ---- -------- ------------- -----
protocol     auth     hostname   port pathname     search     hash
                                                ------------
                                                   query
```

#### url.parse(stringUrl)

```

Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?name=jim&url=www.runoob.com',
  query: 'name=jim&url=www.runoob.com',
  pathname: '/user',
  path: '/user?name=jim&url=www.runoob.com',
  href: '/user?name=jim&url=www.runoob.com' }
```

#### url.parse(stringUrl,true)

第二个参数等于`true`时，该方法返回的URL对象中，`query`字段不再是一个字符串，而是一个经过`querystring`模块转换后的参数对象。第三个参数等于`true`时，该方法可以正确解析不带协议头的URL，例如`//www.example.com/foo/bar`。

```
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?name=jim&url=www.runoob.com',
  query: { name: 'jim', url: 'www.runoob.com' },
  pathname: '/user',
  path: '/user?name=jim&url=www.runoob.com',
  href: '/user?name=jim&url=www.runoob.com' }
```

#### url.format(urlObject)

```javascript
url.format({
    protocol: 'http:',
    host: 'www.example.com',
    pathname: '/p/a/t/h',
    search: 'query=string'
});
/* =>
'http://www.example.com/p/a/t/h?query=string'
*/
```

#### url.resolve(from,to)

```javascript
const url = require('url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
url.resolve('http://example.com/one/two','../three') //'http://example.com/three'
```

### 3 querystring模块用于专门解析查询字符串

#### querystring.escape(str)   query string.unescape(str)  用于对字符串进行编码和解码

```javascript
var queryString = require('querystring');
console.log(queryString.escape('age=jim')); //age%3Djim
console.log(queryString.unescape(queryString.escape('age=jim')));//age=jim
```

#### querystring.parse(str, sep,eq,options) 将查询字符串转化为javascript对象

该方法返回的对象不继承自 JavaScript 的 `Object` 类。 这意味着 `Object` 类的方法如 `obj.toString()`、`obj.hasOwnProperty()` 等没有被定义且无法使用

```javascript
querystring.parse('foo=bar&abc=xyz&abc=123')
//转化为如下
{
  foo: 'bar',
  abc: ['xyz', '123']
}
```

#### querystring.stringify(str, sep,eq,options) 将javascript对象转化为查询字符串

```javascript
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// 返回 'foo=bar&baz=qux&baz=quux&corge='
```

