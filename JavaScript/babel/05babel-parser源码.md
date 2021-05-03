---

---

### 1 使用

```javascript
const parser = require('@babel/parser');
const code  = `<view v-bind:id="value"></view>`
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx']
});

```

`这里以jsx解析为例`

### 2 入口

`lib/index.js`

```javascript
exports.parse = parse;
exports.parseExpression = parseExpression;
exports.tokTypes = types;
```

```javascript
var mixinPlugins = {
  estree: estree,
  jsx: jsx,
  flow: flow,
  typescript: typescript
};
function parse(input, options) {
  debugger;
  //...
  return getParser(options, input).parse();
}
function getParser(options, input) {
  var cls = Parser;

  if (options && options.plugins) {
    validatePlugins(options.plugins);
    cls = getParserClass(options.plugins);
  }

  return new cls(options, input);
}
function getParserClass(pluginsFromOptions) { //pluginsFromOptions: ['jsx']
  var pluginList = mixinPluginNames.filter(function (name) {
    return hasPlugin(pluginsFromOptions, name);
  });
  var key = pluginList.join("/");
  var cls = parserClassCache[key];

  if (!cls) {
    cls = Parser;

    for (var _i2 = 0; _i2 < pluginList.length; _i2++) {
      var plugin = pluginList[_i2]; //'jsx'
      cls = mixinPlugins[plugin](cls); //jsx(Parser)
    }

    parserClassCache[key] = cls;
  }

  return cls;
}
```

继承函数

```javascript
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  //=> {__proto__:superClass.prototype}
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
```
Object.create(proto，[propertiesObject])
Object.setPrototypeOf(obj, prototype)   //obj.__proto__ = prototype
```javascript 
function _inherit(subClass,superClass){
  subClass.prototype = Object.create(superClass.prototype,{value:subClass,configurable:true,writable:true})
  Object.setPrototypeOf(subClass,superClass);

}
```

接下来重点看下 `jsx(Parser)`;

函数`jsx`的定义如下

```javascript
//jsx(Parser) ==> cls ==> new cls(options, input);
var jsx = (function (superClass) { //jsx函数执行的时候，会返回内部自执行函数的返回值 即 _class
  return function (_superClass) { 
    // debugger
    _inheritsLoose(_class, _superClass);

    function _class() { //new cls(options, input);
      return _superClass.apply(this, arguments) || this; //_superClass 也就是 Parser
    }

    var _proto = _class.prototype;

    //_proto.jsxReadToken = function(){} ....

    return _class;//cls 返回的这个函数就是cls
  }(superClass); //Parser
});
```

`Parser`的定义简析如下,都是自执行函数，这些自执行函数执行之后会将原型链串起来

```javascript
function _class() { //new cls(options, input);
  return _superClass.apply(this, arguments) || this; //_superClass 也就是 Parser
}
```

之后以下函数都会接着执行：

```javascript
_superClass.apply(this, arguments)  ==> Parser.apply(this, arguments) ;
_StatementParser.call(this, options, input)  ==> StatementParser.call(this, options, input);
_ExpressionParser.apply(this, arguments) ==> ExpressionParser.apply(this, arguments)
//....所有的构造函数都会执行
```



```javascript
//jsx(Parser) ==> cls ==> new cls(options, input);
var jsx = (function (superClass) { //jsx函数执行的时候，会返回内部自执行函数的返回值 即 _class
  return function (_superClass) { 
    // debugger
    _inheritsLoose(_class, _superClass);

    function _class() { //new cls(options, input);
      return _superClass.apply(this, arguments) || this; //_superClass 也就是 Parser
    }

    var _proto = _class.prototype;

    //_proto.jsxReadToken = function(){} ....

    return _class;//cls 返回的这个函数就是cls
  }(superClass); //Parser
});
var Parser = function (_StatementParser) {
  _inheritsLoose(Parser, _StatementParser);

  function Parser(options, input) {
    var _this;

    options = getOptions(options);
    _this = _StatementParser.call(this, options, input) || this;
    _this.options = options;
    _this.inModule = _this.options.sourceType === "module";
    _this.input = input;
    _this.plugins = pluginsMap(_this.options.plugins);
    _this.filename = options.sourceFilename;
    return _this;
  }

  var _proto = Parser.prototype;

  _proto.parse = function parse() {
    //...
  };

  return Parser;
}(StatementParser);
var StatementParser = function (_ExpressionParser) {
  _inheritsLoose(StatementParser, _ExpressionParser);

  function StatementParser() {
    return _ExpressionParser.apply(this, arguments) || this;
  }

  var _proto = StatementParser.prototype;

  _proto.parseTopLevel = function parseTopLevel(file, program) {
    program.sourceType = this.options.sourceType;
    program.interpreter = this.parseInterpreterDirective();
    this.parseBlockBody(program, true, true, types.eof);
    file.program = this.finishNode(program, "Program");
    file.comments = this.state.comments;
    if (this.options.tokens) file.tokens = this.state.tokens;
    return this.finishNode(file, "File");
  };

  _proto.stmtToDirective = function stmtToDirective(stmt) {
   //...
  };

  //....
  return StatementParser;
}(ExpressionParser);
var ExpressionParser = function (_LValParser) {
  _inheritsLoose(ExpressionParser, _LValParser);

  function ExpressionParser() {
    return _LValParser.apply(this, arguments) || this;
  }
  //...
  return ExpressionParser;
}(LValParser)
var LValParser = function (_NodeUtils) {
  _inheritsLoose(LValParser, _NodeUtils);
  function LValParser() {
    return _NodeUtils.apply(this, arguments) || this;
  }
  //...
  return LValParser
}(NodeUtils)
var NodeUtils = function (_UtilParser) {
  
  _inheritsLoose(NodeUtils, _UtilParser);

  function NodeUtils() {
    return _UtilParser.apply(this, arguments) || this;
  }
//...
  return NodeUtils;
}(UtilParser)
var UtilParser = function (_Tokenizer) {
  _inheritsLoose(UtilParser, _Tokenizer);
  function UtilParser() {
    return _Tokenizer.apply(this, arguments) || this;
  }
//...
  return UtilParser
}(Tokenizer)
var Tokenizer = function (_LocationParser) {
  _inheritsLoose(Tokenizer, _LocationParser);
  function Tokenizer(options, input) {
    var _this;

    _this = _LocationParser.call(this) || this;
    _this.state = new State();

    _this.state.init(options, input);

    _this.isLookahead = false;
    return _this;
  }
  //...
  return Tokenizer
}(LocationParser)
var LocationParser = function (_CommentsParser) {
  _inheritsLoose(LocationParser, _CommentsParser);

  function LocationParser() {
    return _CommentsParser.apply(this, arguments) || this;
  }
//...
  return LocationParser
}(CommentsParser)
var CommentsParser = function (_BaseParser) {
  _inheritsLoose(CommentsParser, _BaseParser);

  function CommentsParser() {
    return _BaseParser.apply(this, arguments) || this;
  }
//...
  return CommentsParser
}(BaseParser)
var BaseParser = function (_BaseParser) {
  function BaseParser() {
    this.sawUnambiguousESM = false;
  }
//...
  return BaseParser
}(BaseParser)
//....
```

重点看下 分词器的执行

- options参数的默认值

在`Parser`函数中

```javascript
options = getOptions(options);
```

```javascript
var defaultOptions = {
  sourceType: "script",
  sourceFilename: undefined,
  startLine: 1,
  allowAwaitOutsideFunction: false,
  allowReturnOutsideFunction: false,
  allowImportExportEverywhere: false,
  allowSuperOutsideMethod: false,
  plugins: [],
  strictMode: null,
  ranges: false,
  tokens: false
};
function getOptions(opts) {
  var options = {};

  for (var key in defaultOptions) {
    options[key] = opts && opts[key] != null ? opts[key] : defaultOptions[key];
  }

  return options;
}
```

- 分词器的解析生成state对象，这个state对象在一个一个字符解析的过程中是动态变化的，;

```javascript
_Tokenizer.apply(this, arguments) 
```

```javascript
function Tokenizer(options, input) {
  var _this;

  _this = _LocationParser.call(this) || this;
  _this.state = new State();

  _this.state.init(options, input);

  _this.isLookahead = false;
  return _this;
}
var State = function () {
  function State() {}
  var _proto = State.prototype;

  _proto.init = function init(options, input) {
    this.strict = options.strictMode === false ? false : options.sourceType === "module";
    this.input = input;//记录当前解析的整段文本
    this.labels = [];
    this.type = types.eof; //解析字符的过程中动态变化，记录当前解析字符的类型，比如 { }  < > a-z等等
    this.context = [types$1.braceStatement]; //解析过程中会动态push进去types的值；
    //记录当前字符的位置信息
    this.pos = this.lineStart = 0;
    this.start = this.end = this.pos;
    this.startLoc = this.endLoc = this.curPosition();
    //....
  };
//...
  return State
}()
```

- 原型链的指向如下：

```javascript
jsx.prototype = {__proto__:Parser.prototype}
Parser.prototype = {__proto__:StatementParser.prototype}
StatementParser.prototype = {__proto__:ExpressionParser.prototype}
ExpressionParser.prototype = {__proto__:LValParser.prototype}
LValParser.prototype = {__proto__:NodeUtils.prototype}
//....
```

当最后执行

```javascript
//new cls(options, input);
function _class() { //new cls(options, input);
  return _superClass.apply(this, arguments) || this; //_superClass 也就是 Parser
}
```

返回的对象的原型链就指向了 `Parser.prototype`

`const parser = require('@babel/parser');` `parser对象如下`

```javascript
{
  parse:function parse(){},
  __proto__:Parser.prototype
}
```

### 3 parse函数的执行

```javascript
const code  = `<view v-bind:id="value"></view>`
const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx']
});
```

执行 `parse`函数，得到ast语法树；

```javascript
_proto.parse = function parse() {
  debugger;
  var file = this.startNode();
  var program = this.startNode();
  this.nextToken(); //顺着原型链在Tokenizer的原型上找到了定义
  return this.parseTopLevel(file, program);
};
```

#### 3.1 startNode解析

```javascript
var file = this.startNode();
var program = this.startNode();
```

在 `NodeUtils`中

```javascript
var _proto2 = NodeUtils.prototype;

_proto2.startNode = function startNode() {
  return new Node(this, this.state.start, this.state.startLoc);
};
```

```javascript
var Node = function () {
  function Node(parser, pos, loc) {
    this.type = "";
    this.start = pos;
    this.end = 0;
    this.loc = new SourceLocation(loc);
    if (parser && parser.options.ranges) this.range = [pos, 0];
    if (parser && parser.filename) this.loc.filename = parser.filename;
  }

  var _proto = Node.prototype;

  _proto.__clone = function __clone() {
    var _this = this;

    var node2 = new Node();
    Object.keys(this).forEach(function (key) {
      if (commentKeys.indexOf(key) < 0) {
        node2[key] = _this[key];
      }
    });
    return node2;
  };

  return Node;
}();
var SourceLocation = function SourceLocation(start, end) {
  this.start = start;
  this.end = end;
};
```

#### 3.2 this.nextToken();

```javascript
var TokenType = function TokenType(label, conf) {
  if (conf === void 0) {
    conf = {};
  }

  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.rightAssociative = !!conf.rightAssociative;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop === 0 ? 0 : conf.binop || null;
  this.updateContext = null;
};
```

`Tokenizer`构造函数原型中

```javascript
//
_proto.curContext = function curContext() {
  return this.state.context[this.state.context.length - 1];
};
_proto.nextToken = function nextToken() {
  var curContext = this.curContext();
  //preserveSpace为false,会跳过空格、换行的解析
  if (!curContext || !curContext.preserveSpace) this.skipSpace();
  this.state.containsOctal = false;
  this.state.octalPosition = null;
  this.state.start = this.state.pos;
  this.state.startLoc = this.state.curPosition();

  if (this.state.pos >= this.input.length) {
    this.finishToken(types.eof);//eof: new TokenType("eof"),
    return;
  }

  if (curContext.override) {
    curContext.override(this);
  } else {
    //这里的readToken是jsx原型上的定义函数
    this.readToken(this.input.codePointAt(this.state.pos));
  }
};
```

##### 3.2.1 skipSpace() : 这个方法用来直接跳过空格，js注释等

```javascript
_proto.skipSpace = function skipSpace() {
  loop: while (this.state.pos < this.input.length) {
    var ch = this.input.charCodeAt(this.state.pos);

    switch (ch) {
      case 13: // ''
        if (this.input.charCodeAt(this.state.pos + 1) === 10) {
          ++this.state.pos;
        }

      case 10: // "↵"
      case 8232: //''
      case 8233: // ''
        ++this.state.pos;
        ++this.state.curLine;
        this.state.lineStart = this.state.pos;
        break;

      case 47: // / 
        switch (this.input.charCodeAt(this.state.pos + 1)) {
          case 42: // *
            this.skipBlockComment();
            break;

          case 47: // /
            this.skipLineComment(2);
            break;

          default:
            break loop;
        }

        break;

      default:
        if (isWhitespace(ch)) {
          ++this.state.pos;
        } else {
          break loop;
        }

    }
  }
};
```

##### 3.2.2 readToken和updateContext

`readToken updateContext`目前的配置`['jsx']`的情况下下只有两个原型上有

**一个是 jsx构造函数上的**

```javascript
//__proto__  ==> jsx.prototype 
_proto.readToken = function readToken(code) {
  debugger;//jsx
  if (this.state.inPropertyName) return _superClass.prototype.readToken.call(this, code);
  //  _superClass.prototype.readToken.call(this, code);这个才是 Tokenizer上的readToken方法
  var context = this.curContext();

  if (context === types$1.j_expr) {
    return this.jsxReadToken();
  }

  if (context === types$1.j_oTag || context === types$1.j_cTag) {
    if (isIdentifierStart(code)) {
      return this.jsxReadWord();
    }

    if (code === 62) {
      ++this.state.pos;
      return this.finishToken(types.jsxTagEnd);
    }

    if ((code === 34 || code === 39) && context === types$1.j_oTag) {
      return this.jsxReadString(code);
    }
  }

  if (code === 60 && this.state.exprAllowed) {
    ++this.state.pos;
    return this.finishToken(types.jsxTagStart);
  }

  return _superClass.prototype.readToken.call(this, code);
};
_proto.updateContext = function updateContext(prevType) {
  //JSX
  if (this.match(types.braceL)) {
    var curContext = this.curContext();

    if (curContext === types$1.j_oTag) {
      this.state.context.push(types$1.braceExpression);
    } else if (curContext === types$1.j_expr) {
      this.state.context.push(types$1.templateQuasi);
    } else {
      _superClass.prototype.updateContext.call(this, prevType);
    }

    this.state.exprAllowed = true;
  } else if (this.match(types.slash) && prevType === types.jsxTagStart) {
    this.state.context.length -= 2;
    this.state.context.push(types$1.j_cTag);
    this.state.exprAllowed = false;
  } else {
    return _superClass.prototype.updateContext.call(this, prevType);
  }
};
```

**一个是Tokenizer构造函数中**

```javascript
_proto.readToken = function readToken(code) {
  if (isIdentifierStart(code) || code === 92) { // 92 ==> \
    this.readWord();
  } else {
    this.getTokenFromCode(code);
  }
};
_proto.updateContext = function updateContext(prevType) {
  //Tokenizer
  var type = this.state.type;
  var update;

  if (type.keyword && (prevType === types.dot || prevType === types.questionDot)) {
    this.state.exprAllowed = false;
  } else if (update = type.updateContext) { //这里就会用到type.jsxTagStart types.jsxTagEnd这两个对象上的 updateContext 函数
    update.call(this, prevType);
  } else {
    this.state.exprAllowed = type.beforeExpr;
  }
};
```

但是需要注意的是`updateContext`在`type.jsxTagStart types.jsxTagEnd`上也会有

```javascript
types.jsxText = new TokenType("jsxText", {
  beforeExpr: true
});
types.jsxTagStart = new TokenType("jsxTagStart", {
  startsExpr: true
});
types.jsxTagEnd = new TokenType("jsxTagEnd");

types.jsxTagStart.updateContext = function () {
  this.state.context.push(types$1.j_expr);
  this.state.context.push(types$1.j_oTag);
  this.state.exprAllowed = false;
};

types.jsxTagEnd.updateContext = function (prevType) {
  var out = this.state.context.pop();

  if (out === types$1.j_oTag && prevType === types.slash || out === types$1.j_cTag) {
    this.state.context.pop();
    this.state.exprAllowed = this.curContext() === types$1.j_expr;
  } else {
    this.state.exprAllowed = true;
  }
};
```



[charcode对应表]([http://ascii.911cha.com/](http://ascii.911cha.com/))

原型链中的`finishToken`就在`Tokenizer.prototype`中有一个；

每次执行 `finishToken`的时候都会更新 `this.state.type`的值，标识当前处理的字符是属于那种字符；

比如上文中解析到 `<`的时候会更新这个 `type`,在文件全局有一个`types`对象，参考文章最后

基本如下

```javascript
var types = {
  num: new TokenType("num", {
    startsExpr: startsExpr
  }),
  //....
};
```

```javascript
_proto.readToken = function readToken(code) {
  //...
  if (code === 60 && this.state.exprAllowed) {
    ++this.state.pos;
    return this.finishToken(types.jsxTagStart);
  }
  //...
}
```

```javascript
_proto.finishToken = function finishToken(type, val) {
    debugger;//Tokenizer
    this.state.end = this.state.pos;
    this.state.endLoc = this.state.curPosition();
    var prevType = this.state.type;
    this.state.type = type;
    this.state.value = val;
    this.updateContext(prevType);
  };
```

总结以上过程

```javascript
_proto.parse = function parse() {
  debugger;
  var file = this.startNode();
  var program = this.startNode();
  this.nextToken(); //顺着原型链在Tokenizer的原型上找到了定义
  return this.parseTopLevel(file, program);
};
```

```javascript
nextToken ==> readToken ==> finishToken ==> updateContext
```

#### 3.3 parseTopLevel函数的执行

```javascript
//StatementParser原型链上
_proto.parseTopLevel = function parseTopLevel(file, program) {
  debugger;
  program.sourceType = this.options.sourceType;
  program.interpreter = this.parseInterpreterDirective();
  this.parseBlockBody(program, true, true, types.eof);
  file.program = this.finishNode(program, "Program");
  file.comments = this.state.comments;
  if (this.options.tokens) file.tokens = this.state.tokens;
  return this.finishNode(file, "File");
};
```

接下来解析成ast的部分就是这个 `finishNode`

```javascript
//NodeUtils
_proto2.finishNode = function finishNode(node, type) {
  return this.finishNodeAt(node, type, this.state.lastTokEnd, this.state.lastTokEndLoc);
};
```





















types声明如下

```javascript
var types = {
  num: new TokenType("num", {
    startsExpr: startsExpr
  }),
  bigint: new TokenType("bigint", {
    startsExpr: startsExpr
  }),
  regexp: new TokenType("regexp", {
    startsExpr: startsExpr
  }),
  string: new TokenType("string", {
    startsExpr: startsExpr
  }),
  name: new TokenType("name", {
    startsExpr: startsExpr
  }),
  eof: new TokenType("eof"),
  bracketL: new TokenType("[", {
    beforeExpr: beforeExpr,
    startsExpr: startsExpr
  }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{{", { // jsx支持cml语法
    beforeExpr: beforeExpr,
    startsExpr: startsExpr
  }),
  braceBarL: new TokenType("{|", {
    beforeExpr: beforeExpr,
    startsExpr: startsExpr
  }),
  braceR: new TokenType("}}"), // jsx支持cml语法
  braceBarR: new TokenType("|}"),
  parenL: new TokenType("(", {
    beforeExpr: beforeExpr,
    startsExpr: startsExpr
  }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", {
    beforeExpr: beforeExpr
  }),
  semi: new TokenType(";", {
    beforeExpr: beforeExpr
  }),
  colon: new TokenType(":", {
    beforeExpr: beforeExpr
  }),
  doubleColon: new TokenType("::", {
    beforeExpr: beforeExpr
  }),
  dot: new TokenType("."),
  question: new TokenType("?", {
    beforeExpr: beforeExpr
  }),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", {
    beforeExpr: beforeExpr
  }),
  template: new TokenType("template"),
  ellipsis: new TokenType("...", {
    beforeExpr: beforeExpr
  }),
  backQuote: new TokenType("`", {
    startsExpr: startsExpr
  }),
  dollarBraceL: new TokenType("${", {
    beforeExpr: beforeExpr,
    startsExpr: startsExpr
  }),
  at: new TokenType("@"),
  hash: new TokenType("#"),
  interpreterDirective: new TokenType("#!..."),
  eq: new TokenType("=", {
    beforeExpr: beforeExpr,
    isAssign: isAssign
  }),
  assign: new TokenType("_=", {
    beforeExpr: beforeExpr,
    isAssign: isAssign
  }),
  incDec: new TokenType("++/--", {
    prefix: prefix,
    postfix: postfix,
    startsExpr: startsExpr
  }),
  bang: new TokenType("!", {
    beforeExpr: beforeExpr,
    prefix: prefix,
    startsExpr: startsExpr
  }),
  tilde: new TokenType("~", {
    beforeExpr: beforeExpr,
    prefix: prefix,
    startsExpr: startsExpr
  }),
  pipeline: new BinopTokenType("|>", 0),
  nullishCoalescing: new BinopTokenType("??", 1),
  logicalOR: new BinopTokenType("||", 1),
  logicalAND: new BinopTokenType("&&", 2),
  bitwiseOR: new BinopTokenType("|", 3),
  bitwiseXOR: new BinopTokenType("^", 4),
  bitwiseAND: new BinopTokenType("&", 5),
  equality: new BinopTokenType("==/!=", 6),
  relational: new BinopTokenType("</>", 7),
  bitShift: new BinopTokenType("<</>>", 8),
  plusMin: new TokenType("+/-", {
    beforeExpr: beforeExpr,
    binop: 9,
    prefix: prefix,
    startsExpr: startsExpr
  }),
  modulo: new BinopTokenType("%", 10),
  star: new BinopTokenType("*", 10),
  slash: new BinopTokenType("/", 10),
  exponent: new TokenType("**", {
    beforeExpr: beforeExpr,
    binop: 11,
    rightAssociative: true
  })
};
types.jsxText = new TokenType("jsxText", {
  beforeExpr: true
});
types.jsxTagStart = new TokenType("jsxTagStart", {
  startsExpr: true
});
types.jsxTagEnd = new TokenType("jsxTagEnd");

types.jsxTagStart.updateContext = function () {
  this.state.context.push(types$1.j_expr);
  this.state.context.push(types$1.j_oTag);
  this.state.exprAllowed = false;
};

types.jsxTagEnd.updateContext = function (prevType) {
  var out = this.state.context.pop();

  if (out === types$1.j_oTag && prevType === types.slash || out === types$1.j_cTag) {
    this.state.context.pop();
    this.state.exprAllowed = this.curContext() === types$1.j_expr;
  } else {
    this.state.exprAllowed = true;
  }
};
```

