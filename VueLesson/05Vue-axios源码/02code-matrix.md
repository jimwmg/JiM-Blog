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
            resolve(this); //这里resolve的this,指的就是send中的context上下文，所以在链式调用中下一个then中的函数参数context就是传入的send中的context
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
router.use('/result/analysis', function (next) {
  const { result } = this;//这里对请求回来的结果进行判断
  if (!(result instanceof Error)) {
    if (result.status === 200) {
      if (result.data.code === 0) {
        this.result = result.data.data;
      } else {
        console.error([result.config.url, result]);
        this.result = Error(result.data.msg || '未知错误');
        this.result.data = result;
      }
    } else if (result.data.code >= 500) {
      console.error([result.config.url, result]);
      this.result = Error('系统错误，请联系管理员');
    }
  } else {
    this.result.message = '网络异常';
  }
  next();
});
router.use('/result/handle-error', function (next) {
  const { result } = this
  if (result instanceof Error) {
    result.code = result.data.data.code;
    Message.closeAll();
    Message.error({
      message: result.message,
    });
  }
  next();
});
router.send({
    whiteList:['/test'],
    blackList:['/test/output1'],
    text:''
  //这里的context就是use注册的函数中要使用的this
}).then(function(context){  //这个context就是send中的参数
    console.log(context.text);
});

```

```javascript
export function ajax(config, whiteList = [], blackList = []) {
  return new Promise((resolve, reject) => {
    ajaxRouter.send({ //第一次使用，配置请求参数
      whiteList: ['/config'].concat(whiteList),
      blackList,
      config, //这里就是要配置的参数
    }).then(context => {
      return new Promise((resolve) => {
        axios
          .request(context.config)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            resolve(error);
          });
      });
    }).then(result => {
      return ajaxRouter.send({
        whiteList: ['/result'].concat(whiteList),
        blackList,
        result, //这里就是请求回来的结果，根据请求回来的结果
      }).then((context) => {
        if (context.result instanceof Error) {
          reject(context.result);
        } else {
          resolve(context.result);
        }
      });
    });
  });
}
```

