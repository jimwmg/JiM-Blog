Babel-generator

----

### 1 ast解析

[参考](<https://astexplorer.net/>)

#### ast节点

所有的节点都有的属性值如下，描述该节点的类型以及位置信息

```javascript
{
	type:String,节点类型
  start:Number,该节点的起始位置
  end:Number,该节点的结束位置
  loc:{
    start:{  该节点开始行和列的描述
      line:Number,该节点所在行数
      column:Number,该节点所在列数
    }
    end:{
      line:Number,该节点所在行数
      column:Number,该节点所在列数
    }
  }
}
```

