---
title:  fetch请求(promise的封装)
date: 2017-06-20 12:36:00
categories: ES6
tags : fetch
comments : true 
updated : 
layout : 
---

## 1 一般的fetch用法

```javascript
fetch(url,option).then(response=>{
  //handle HTTP response
}).then(error=>{
  //handle HTTP error
})
```

具体的栗子如下

```javascript
fetch(url, { //option
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "same-origin"
}).then(function(response) {
  response.status     //=> number 100–599
  response.statusText //=> String
  response.headers    //=> Headers
  response.url        //=> String

  return response.text()
}, function(error) {
  error.message //=> String
})
```

## 2 参数解析 

### url 地址: './path'

### option :

- `method` (String) - HTTP request method. Default: `"GET"`
- `body` (String, [body types](https://github.github.io/fetch/#request-body)) - HTTP request body
- `headers` (Object, [Headers](https://github.github.io/fetch/#Headers)) - Default: `{}`
- `credentials` (String) - Authentication credentials mode. Default: `"omit"``"omit"` - don't include authentication credentials (e.g. cookies) in the request`"same-origin"` - include credentials in requests to the same site`"include"` - include credentials in requests to all sites


### Response

Response represents a HTTP response from the server. Typically a Response is not constructed manually, but is available as argument to the resolved promise callback.

#### Properties

- `status` (number) - HTTP response code in the 100–599 range
- `statusText` (String) - Status text as reported by the server, e.g. "Unauthorized"
- `ok` (boolean) - True if `status` is HTTP 2xx
- `headers` ([Headers](https://github.github.io/fetch/#Headers))
- `url` (String)

#### Body methods 注意每个方法返回的都是一个Promise对象,

Each of the methods to access the response body returns a Promise that will be resolved when the associated data type is ready.

- `text()` - yields the response text as String
- `json()` - **yields the result of `JSON.parse(responseText)`**
- `blob()` - yields a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- `arrayBuffer()` - yields an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- `formData()` - yields [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) that can be forwarded to another request

#### Other response methods

- `clone()`
- `Response.error()`
- `Response.redirect()`