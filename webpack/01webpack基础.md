---
title:webpack基础

---

###1 [webpack CLI](https://doc.webpack-china.org/api/cli) （Command Line Interface） 

#### 常用配置

```
webpack --help (webpack -h)  列出命令行所有可用的配置选项
webpack --config example.config.js
webpack 命令默认执行  webpack.config.js
```

#### 环境变量. [nodeProcess.env](http://javascript.ruanyifeng.com/nodejs/process.html#toc5)

```
webpack --env.production    # 设置 env.production == true
webpack --env.platform=web  # 设置 env.platform == "web"
webpack --env.NODE_ENV=local --env.production --progress
如果设置 env 变量，却没有赋值，--env.production 默认将 --env.production 设置为 true
```
####[其他配置](https://doc.webpack-china.org/api/cli#%E8%BE%93%E5%87%BA%E9%85%8D%E7%BD%AE)

### 2管理资源

```javascript
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```

这种配置方式会使你的代码更具备可移植性，因为现有的统一放置的方式会造成所有资源紧密耦合在一起。假如你想在另一个项目中使用 `/my-component`，只需将其复制或移动到 `/components` 目录下。

### 3 webpack 缓存管理[链接](https://doc.webpack-china.org/guides/output-management/#manifest)






