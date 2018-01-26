---
title: code-matrix源码
date: 2018-01-16
categories: vue
---

###1 目的：Manage your code block use middleware model.

```javascript
/**
 * Created by yaoyi on 2017/8/17.
 */
import Promise from 'es6-promise';
//判断route是否在list中
function routeInList(route,list){
    for(let i=0;i<list.length;i++){
        let rule=list[i];
      //'dddsss'.indexOf(s) ==>3    ~'dddsss'.indexOf(s) ==>-4
      //~-1 ==> 0 也就是说找不到，返回0 ，表示false,其余都是true;
        if(typeof rule=='string'&&~route.indexOf(rule)){
            return true;
        }
        if(rule!=null&&typeof rule.test=='function'&&rule.test(route)){
            return true;
        }
    }
    return false;
}
function next(middlewares,now,resolve){
    this.__now=now;
    if(now>=middlewares.length){
        resolve(this);
        return;
    }

    let {whiteList,blackList}=this;
    Array.isArray(whiteList)||(whiteList=[]);
    Array.isArray(blackList)||(blackList=[]);
    let nowMiddleware=middlewares[now];
    const {route,cb}=nowMiddleware;
  //配置一个whitelist和blacklist名单
    let inWhiteList=routeInList(route,whiteList),
        inBlackList=routeInList(route,blackList);
    let nnext=next.bind(this,middlewares,now+1,resolve);
    if(!inBlackList&&inWhiteList){ //对于符合黑白名单列表的use注册函数，都会进入执行，直接next
        let r=cb.call(this,nnext);//	这里类似于递归进入所有通过use注册的函数，然后再一层层的退出
        if(!(r instanceof Promise)&&this.__now==now){
            resolve(this);
            return;
        }
    }
    else{
      //直接处理next，通过use注册的函数；
        nnext();
    }

}
export default class Router{
    constructor(){
        this.middlewares=[];
    }
  //先通过use注册一个{route,cb}对象给到 middlewares数组，可以注册多个这样的数组
    use(route,cb){
        if(typeof route=='string'&&typeof cb=='function'){
            this.middlewares.push({route,cb});
        }
    }
    send(context){
        const {middlewares}=this;
        return new Promise((resolve,reject)=>{
            next.call(context,middlewares,0,resolve);
        });
    }
}
```

### 2 使用

```javascript
 const router = new Router();
```

```javascript
const Router=require('code-matrix').default;
let router=new Router();
router.use('/test/output0',function(next){
    this.text+=0;
    console.log(0);
    next();
});
router.use('/test/output1',function(next){
    this.text+=1;
    console.log(1);
    next();
});
router.use('/test/output2',function(next){
    this.text+=2;
    console.log(2);
    next();
});
router.send({
    whiteList:['/test'],
    blackList:['/test/output1'],
    text:''
  //这里的context就是use注册的函数中要使用的this
}).then(function(context){
    console.log(context.text);
});

```

