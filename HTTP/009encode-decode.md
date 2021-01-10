---

---

### 查询字符串的编码与解码

`xxx.html?a=x&b=x&url=xxxx/xx/x.html?aa=1`

```
encodeURIComponent('?')
"%3F"
我们又 encode一遍这个符号 

encodeURIComponent('=')
"%3D"
encodeURIComponent('%3D')
"%253D"
encodeURIComponent('%253D')  //百分号不会再被encode了
"%253D"
encodeURIComponent('/')
"%2F"
encodeURIComponent('%2F')
"%252F"
encodeURIComponent('%252F') //百分号不会再被encode了
"%252F"
```

易出现问题一：编码解码问题   url的值没有经过编码  xxx.html?a=x&b=x&url=redict.html?aa=1

```javascript
'xxx.html?a=x&b=x&url=redict.html?aa=1'.split('?')

["xxx.html", "a=x&b=x&url=redict.html", "aa=1"]

开发直接拿到 'xxx.html?a=x&b=x&url=xxxx.html?aa=1'.split('?')[1] 机型解析，那么 redict.html 后面的参数肯定全部都丢了
​```
```

易出现问题二：开发某些情况下拼成如右所示字符串   xxx.html??a=xb=x  带有两个问号

```javascript
'xxx.html??a=x&b=x'.split('?')
['xxx.html','','a=x&b=x']

```

