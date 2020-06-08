---
HTML最基础BOM
---

## BOM（Browser Object Model）

### 1.BOM-Window对象

Window 对象表示浏览器中打开的窗口。

如果文档包含框架（frame 或 iframe 标签），浏览器会为 HTML 文档创建一个 window 对象，**并为每个框架创建一个额外的 window 对象。**
#### Window事件

## Window 事件属性

针对 window 对象触发的事件（应用到 <body> 标签）：

| 属性                                                         | 值     | 描述                                             |
| :----------------------------------------------------------- | :----- | :----------------------------------------------- |
| [onafterprint](https://www.w3school.com.cn/tags/event_onafterprint.asp) | script | 文档打印之后运行的脚本。                         |
| [onbeforeprint](https://www.w3school.com.cn/tags/event_onbeforeprint.asp) | script | 文档打印之前运行的脚本。                         |
| onbeforeunload                                               | script | 文档卸载之前运行的脚本。                         |
| onerror                                                      | script | 在错误发生时运行的脚本。                         |
| onhaschange                                                  | script | 当文档已改变时运行的脚本。                       |
| [onload](https://www.w3school.com.cn/tags/event_onload.asp)  | script | 页面结束加载之后触发。                           |
| onmessage                                                    | script | 在消息被触发时运行的脚本。                       |
| onoffline                                                    | script | 当文档离线时运行的脚本。                         |
| ononline                                                     | script | 当文档上线时运行的脚本。                         |
| onpagehide                                                   | script | 当窗口隐藏时运行的脚本。                         |
| onpageshow                                                   | script | 当窗口成为可见时运行的脚本。                     |
| onpopstate                                                   | script | 当窗口历史记录改变时运行的脚本。                 |
| onredo                                                       | script | 当文档执行撤销（redo）时运行的脚本。             |
| [onresize](https://www.w3school.com.cn/tags/event_onresize.asp) | script | 当浏览器窗口被调整大小时触发。                   |
| onstorage                                                    | script | 在 Web Storage 区域更新后运行的脚本。            |
| onundo                                                       | script | 在文档执行 undo 时运行的脚本。                   |
| [onunload](https://www.w3school.com.cn/tags/event_onunload.asp) | script | 一旦页面已下载时触发（或者浏览器窗口已被关闭）。 |

#### Window 对象集合

| 集合     | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| frames[] | 返回窗口中所有命名的框架。该集合是 Window 对象的数组，每个 Window 对象在窗口中含有一个框架或 <iframe>。属性 frames.length 存放数组 frames[] 中含有的元素个数。注意，frames[] 数组中引用的框架可能还包括框架，它们自己也具有 frames[] 数组。 |

#### Window 对象属性位置相关

| 属性                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [innerheight](https://www.w3school.com.cn/jsref/prop_win_innerheight_innerwidth.asp) | 返回窗口的文档显示区的高度。                                 |
| [innerwidth](https://www.w3school.com.cn/jsref/prop_win_innerheight_innerwidth.asp) | 返回窗口的文档显示区的宽度。                                 |
| length                                                       | 设置或返回窗口中的框架数量。                                 |
| [outerheight](https://www.w3school.com.cn/jsref/prop_win_outerheight.asp) | 返回窗口的外部高度。                                         |
| [outerwidth](https://www.w3school.com.cn/jsref/prop_win_outerwidth.asp) | 返回窗口的外部宽度。                                         |
| pageXOffset                                                  | 设置或返回当前页面相对于窗口显示区左上角的 X 位置。          |
| pageYOffset                                                  | 设置或返回当前页面相对于窗口显示区左上角的 Y 位置。          |
| screenLeftscreenTopscreenXscreenY                            | 只读整数。声明了窗口的左上角在屏幕上的的 x 坐标和 y 坐标。IE、Safari 和 Opera 支持 screenLeft 和 screenTop，而 Firefox 和 Safari 支持 screenX 和 screenY。 |

#### Window 对象方法

| 方法                                                         | 描述                                               |
| :----------------------------------------------------------- | :------------------------------------------------- |
| [clearInterval()](https://www.w3school.com.cn/jsref/met_win_clearinterval.asp) | 取消由 setInterval() 设置的 timeout。              |
| [clearTimeout()](https://www.w3school.com.cn/jsref/met_win_cleartimeout.asp) | 取消由 setTimeout() 方法设置的 timeout。           |
| [open()](https://www.w3school.com.cn/jsref/met_win_open.asp) | 打开一个新的浏览器窗口或查找一个已命名的窗口。     |
| [resizeBy()](https://www.w3school.com.cn/jsref/met_win_resizeby.asp) | 按照指定的像素调整窗口的大小。                     |
| [resizeTo()](https://www.w3school.com.cn/jsref/met_win_resizeto.asp) | 把窗口的大小调整到指定的宽度和高度。               |
| [scrollBy()](https://www.w3school.com.cn/jsref/met_win_scrollby.asp) | 按照指定的像素值来滚动内容。                       |
| [scrollTo()](https://www.w3school.com.cn/jsref/met_win_scrollto.asp) | 把内容滚动到指定的坐标。                           |
| [setInterval()](https://www.w3school.com.cn/jsref/met_win_setinterval.asp) | 按照指定的周期（以毫秒计）来调用函数或计算表达式。 |
| [setTimeout()](https://www.w3school.com.cn/jsref/met_win_settimeout.asp) | 在指定的毫秒数后调用函数或计算表达式。             |

除此之外，window对象还可以访问 Navigator   Screen   History  Location 这几个BOM相关的对象

```
window.navigator  window.screen  window.history  window.location
```

### 2.BOM-Location

| 属性                                                         | 描述                                          |
| :----------------------------------------------------------- | :-------------------------------------------- |
| [hash](https://www.w3school.com.cn/jsref/prop_loc_hash.asp)  | 设置或返回从井号 (#) 开始的 URL（锚）。       |
| [host](https://www.w3school.com.cn/jsref/prop_loc_host.asp)  | 设置或返回主机名和当前 URL 的端口号。         |
| [hostname](https://www.w3school.com.cn/jsref/prop_loc_hostname.asp) | 设置或返回当前 URL 的主机名。                 |
| [href](https://www.w3school.com.cn/jsref/prop_loc_href.asp)  | 设置或返回完整的 URL。                        |
| [pathname](https://www.w3school.com.cn/jsref/prop_loc_pathname.asp) | 设置或返回当前 URL 的路径部分。               |
| [port](https://www.w3school.com.cn/jsref/prop_loc_port.asp)  | 设置或返回当前 URL 的端口号。                 |
| [protocol](https://www.w3school.com.cn/jsref/prop_loc_protocol.asp) | 设置或返回当前 URL 的协议。                   |
| [search](https://www.w3school.com.cn/jsref/prop_loc_search.asp) | 设置或返回从问号 (?) 开始的 URL（查询部分）。 |

Location 对象方法

| 属性                                                         | 描述                     |
| :----------------------------------------------------------- | :----------------------- |
| [assign()](https://www.w3school.com.cn/jsref/met_loc_assign.asp) | 加载新的文档。           |
| [reload()](https://www.w3school.com.cn/jsref/met_loc_reload.asp) | 重新加载当前文档。       |
| [replace()](https://www.w3school.com.cn/jsref/met_loc_replace.asp) | 用新的文档替换当前文档。 |

### 3.BOM-History

| 属性                                                         | 描述                              |
| :----------------------------------------------------------- | :-------------------------------- |
| [length](https://www.w3school.com.cn/jsref/prop_his_length.asp) | 返回浏览器历史列表中的 URL 数量。 |

History 对象方法

| 方法                                                         | 描述                                |
| :----------------------------------------------------------- | :---------------------------------- |
| [back()](https://www.w3school.com.cn/jsref/met_his_back.asp) | 加载 history 列表中的前一个 URL。   |
| [forward()](https://www.w3school.com.cn/jsref/met_his_forward.asp) | 加载 history 列表中的下一个 URL。   |
| [go()](https://www.w3school.com.cn/jsref/met_his_go.asp)     | 加载 history 列表中的某个具体页面。 |
| [pushState()](https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method) | 会向历史记录中增加一条记录          |
| replace()                                                    | 会替换历史记录中的那条记录          |

### 4.BOM-Navigator 对象属性

| 属性                                                         | 描述                                           |
| :----------------------------------------------------------- | :--------------------------------------------- |
| [appCodeName](https://www.w3school.com.cn/jsref/prop_nav_appcodename.asp) | 返回浏览器的代码名。                           |
| [appMinorVersion](https://www.w3school.com.cn/jsref/prop_nav_appminorversion.asp) | 返回浏览器的次级版本。                         |
| [appName](https://www.w3school.com.cn/jsref/prop_nav_appname.asp) | 返回浏览器的名称。                             |
| [appVersion](https://www.w3school.com.cn/jsref/prop_nav_appversion.asp) | 返回浏览器的平台和版本信息。                   |
| [browserLanguage](https://www.w3school.com.cn/jsref/prop_nav_browserlanguage.asp) | 返回当前浏览器的语言。                         |
| [cookieEnabled](https://www.w3school.com.cn/jsref/prop_nav_cookieenabled.asp) | 返回指明浏览器中是否启用 cookie 的布尔值。     |
| [cpuClass](https://www.w3school.com.cn/jsref/prop_nav_cpuclass.asp) | 返回浏览器系统的 CPU 等级。                    |
| [onLine](https://www.w3school.com.cn/jsref/prop_nav_online.asp) | 返回指明系统是否处于脱机模式的布尔值。         |
| [platform](https://www.w3school.com.cn/jsref/prop_nav_platform.asp) | 返回运行浏览器的操作系统平台。                 |
| [systemLanguage](https://www.w3school.com.cn/jsref/prop_nav_systemlanguage.asp) | 返回 OS 使用的默认语言。                       |
| [userAgent](https://www.w3school.com.cn/jsref/prop_nav_useragent.asp) | 返回由客户机发送服务器的 user-agent 头部的值。 |
| [userLanguage](https://www.w3school.com.cn/jsref/prop_nav_userlanguage.asp) | 返回 OS 的自然语言设置。                       |