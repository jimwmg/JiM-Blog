---

---

参考：

[plugin参考](https://zhaoda.net/2015/11/09/gitbook-plugins/s)

[参考2](http://gitbook.zhangjikai.com/)

[gitbook-plugins](https://zhaoda.net/2015/11/09/gitbook-plugins/)

```javascript
{
  "title":"light-ui组件库",
  "plugins": [ 
      "github", //增加github地址图标
      "splitter",//左侧可以伸缩
      "toggle-chapters",
      "anchors",//锚点
      "ace",
      "prism",//代码高亮
      "-highlight",
      "highlight-code",
      "sectionx",
      "anchor-navigation-ex",
      "-lunr",
      "-search",
      "search-pro",//支持中文搜索
      "advanced-emoji",//支持表情
      "duoshuo",
      "include",
      "-sharing",
      "code3"//支持复制代码
  ],
  "pluginsConfig": {
    "github": {
        "url": "https://github.com/zhangjikai"
    },
    "duoshuo": {
      "short_name": "your duoshuo's shortname",
      "theme": "default"
    },
    "anchor-navigation-ex": {
      "isShowTocTitleIcon": false,
      "multipleH1": false,
      "showLevel": false,
      "float": {
        "showLevelIcon": true,
        "level1Icon": "fa fa-hand-o-right",
        "level2Icon": "fa fa-hand-o-right",
        "level3Icon": "fa fa-hand-o-right"
      }
    },
    "prism": {
      "css": [
          "prism-themes/themes/prism-base16-ateliersulphurpool.light.css"
      ]
    },
    "code": {
      "copyButtons": true
    }
  }
}
```

