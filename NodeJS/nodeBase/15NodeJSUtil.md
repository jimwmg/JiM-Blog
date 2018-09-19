---
title:  NodeJs Util
date: 2017-10-26 12:36:00
categories: nodejs
comments : true 
updated : 
layout : 
---

[源码地址](https://github.com/jimwmg/node/blob/master/lib/util.js)

NodeJS中经常会用到Util模块，下面总结下常用工具的源码实现

* util.inherits(actor,superCtor) :实现的效果就是 actor.prototype.`__proto__` = superstar.prototype ;

```javascript
function inherits(ctor, superCtor) {

  if (ctor === undefined || ctor === null)
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'ctor', 'function');

  if (superCtor === undefined || superCtor === null)
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'superCtor', 'function');

  if (superCtor.prototype === undefined) {
    throw new errors.TypeError('ERR_INVALID_ARG_TYPE', 'superCtor.prototype',
                               'function');
  }
  //
  ctor.super_ = superCtor;
  //以下主要实现：ctor.prototype.__proto__ = super.prototype ;
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
}
```

* util.inspect(obj) : util.inspect(object,[showHidden],[depth],[colors])是一个将任意对象转换 为字符串的方法，通常用于调试和错误输出。它至少接受一个参数 object，即要转换的对象。

  showHidden 是一个可选参数，如果值为 true，将会输出更多隐藏信息。

  depth 表示最大递归的层数，如果对象很复杂，你可以指定层数以控制输出信息的多 少。如果不指定depth，默认会递归2层，指定为 null 表示将不限递归层数完整遍历对象。 如果color 值为 true，输出格式将会以ANSI 颜色编码，通常用于在终端显示更漂亮 的效果。

```javascript
function inspect(obj, opts) {
  // Default options
  const ctx = {
    seen: [],
    stylize: stylizeNoColor,
    showHidden: inspectDefaultOptions.showHidden,
    depth: inspectDefaultOptions.depth,
    colors: inspectDefaultOptions.colors,
    customInspect: inspectDefaultOptions.customInspect,
    showProxy: inspectDefaultOptions.showProxy,
    maxArrayLength: inspectDefaultOptions.maxArrayLength,
    breakLength: inspectDefaultOptions.breakLength,
    indentationLvl: 0
  };
  // Legacy...
  if (arguments.length > 2) {
    if (arguments[2] !== undefined) {
      ctx.depth = arguments[2];
    }
    if (arguments.length > 3 && arguments[3] !== undefined) {
      ctx.colors = arguments[3];
    }
  }
  // Set user-specified options
  if (typeof opts === 'boolean') {
    ctx.showHidden = opts;
  } else if (opts) {
    const optKeys = Object.keys(opts);
    for (var i = 0; i < optKeys.length; i++) {
      ctx[optKeys[i]] = opts[optKeys[i]];
    }
  }
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  if (ctx.maxArrayLength === null) ctx.maxArrayLength = Infinity;
  return formatValue(ctx, obj, ctx.depth);
}

function formatValue(ctx, value, recurseTimes, ln) {
  // Primitive types cannot have properties
  if (typeof value !== 'object' && typeof value !== 'function') {
    return formatPrimitive(ctx.stylize, value);
  }
  if (value === null) {
    return ctx.stylize('null', 'null');
  }

  if (ctx.showProxy) {
    const proxy = getProxyDetails(value);
    if (proxy !== undefined) {
      if (recurseTimes != null) {
        if (recurseTimes < 0)
          return ctx.stylize('Proxy [Array]', 'special');
        recurseTimes -= 1;
      }
      ctx.indentationLvl += 2;
      const res = [
        formatValue(ctx, proxy[0], recurseTimes),
        formatValue(ctx, proxy[1], recurseTimes)
      ];
      ctx.indentationLvl -= 2;
      const str = reduceToSingleString(ctx, res, '', ['[', ']']);
      return `Proxy ${str}`;
    }
  }
  
  function formatPrimitive(fn, value) {
  if (typeof value === 'string')
    return fn(strEscape(value), 'string');
  if (typeof value === 'number')
    return formatNumber(fn, value);
  if (typeof value === 'boolean')
    return fn(`${value}`, 'boolean');
  if (typeof value === 'undefined')
    return fn('undefined', 'undefined');
  // es6 symbol primitive
  return fn(value.toString(), 'symbol');
}
```

