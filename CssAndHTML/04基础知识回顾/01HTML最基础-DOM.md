---
HTML最基础
---

## DOM（Document Object Model）

### 1.DOM-Document

#### Document 对象集合

| 集合                                                         | 描述                                     |
| :----------------------------------------------------------- | :--------------------------------------- |
| [all[\]](https://www.w3school.com.cn/jsref/coll_doc_all.asp) | 提供对文档中所有 HTML 元素的访问。       |
| [anchors[\]](https://www.w3school.com.cn/jsref/coll_doc_anchors.asp) | 返回对文档中所有 Anchor 对象的引用。     |
| applets                                                      | 返回对文档中所有 Applet 对象的引用。     |
| [forms[\]](https://www.w3school.com.cn/jsref/coll_doc_forms.asp) | 返回对文档中所有 Form 对象引用。         |
| [images[\]](https://www.w3school.com.cn/jsref/coll_doc_images.asp) | 返回对文档中所有 Image 对象引用。        |
| [links[\]](https://www.w3school.com.cn/jsref/coll_doc_links.asp) | 返回对文档中所有 Area 和 Link 对象引用。 |

```
document.images   document.links   document.all  等
```

#### Document 对象属性

| 属性                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| body                                                         | 提供对 <body> 元素的直接访问。对于定义了框架集的文档，该属性引用最外层的 <frameset>。 |
| [cookie](https://www.w3school.com.cn/jsref/prop_doc_cookie.asp) | 设置或返回与当前文档有关的所有 cookie。                      |
| [domain](https://www.w3school.com.cn/jsref/prop_doc_domain.asp) | 返回当前文档的域名。                                         |
| [lastModified](https://www.w3school.com.cn/jsref/prop_doc_lastmodified.asp) | 返回文档被最后修改的日期和时间。                             |
| [referrer](https://www.w3school.com.cn/jsref/prop_doc_referrer.asp) | 返回载入当前文档的文档的 URL。                               |
| [title](https://www.w3school.com.cn/jsref/prop_doc_title.asp) | 返回当前文档的标题。                                         |
| [URL](https://www.w3school.com.cn/jsref/prop_doc_url.asp)    | 返回当前文档的 URL。                                         |

#### Document 对象方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [close()](https://www.w3school.com.cn/jsref/met_doc_close.asp) | 关闭用 document.open() 方法打开的输出流，并显示选定的数据。  |
| [getElementById()](https://www.w3school.com.cn/jsref/met_doc_getelementbyid.asp) | 返回对拥有指定 id 的第一个对象的引用。                       |
| [getElementsByName()](https://www.w3school.com.cn/jsref/met_doc_getelementsbyname.asp) | 返回带有指定名称的对象集合。                                 |
| [getElementsByTagName()](https://www.w3school.com.cn/jsref/met_doc_getelementsbytagname.asp) | 返回带有指定标签名的对象集合。                               |
| [open()](https://www.w3school.com.cn/jsref/met_doc_open.asp) | 打开一个流，以收集来自任何 document.write() 或 document.writeln() 方法的输出。 |
| [write()](https://www.w3school.com.cn/jsref/met_doc_write.asp) | 向文档写 HTML 表达式 或 JavaScript 代码。                    |
| [writeln()](https://www.w3school.com.cn/jsref/met_doc_writeln.asp) | 等同于 write() 方法，不同的是在每个表达式之后写一个换行符。  |

### 2.DOM-Element

#### Element 对象属性

| 属性 / 方法                                                  | 描述                               |
| :----------------------------------------------------------- | :--------------------------------- |
| [element.attributes](https://www.w3school.com.cn/jsref/prop_node_attributes.asp) | 返回元素属性的 NamedNodeMap。      |
| [element.className](https://www.w3school.com.cn/jsref/prop_html_classname.asp) | 设置或返回元素的 class 属性。      |
| [element.id](https://www.w3school.com.cn/jsref/prop_html_id.asp) | 设置或返回元素的 id。              |
| [element.innerHTML](https://www.w3school.com.cn/jsref/prop_html_innerhtml.asp) | 设置或返回元素的内容。             |
| [element.nodeName](https://www.w3school.com.cn/jsref/prop_node_nodename.asp) | 返回元素的名称。                   |
| [element.nodeType](https://www.w3school.com.cn/jsref/prop_node_nodetype.asp) | 返回元素的节点类型。               |
| [element.nodeValue](https://www.w3school.com.cn/jsref/prop_node_nodevalue.asp) | 设置或返回元素值。                 |
| element.style                                                | 设置或返回元素的 style 属性。      |
| [element.tagName](https://www.w3school.com.cn/jsref/prop_element_tagname.asp) | 返回元素的标签名。                 |
| [element.textContent](https://www.w3school.com.cn/jsref/prop_node_textcontent.asp) | 设置或返回节点及其后代的文本内容。 |
| [element.title](https://www.w3school.com.cn/jsref/prop_html_title.asp) | 设置或返回元素的 title 属性。      |

#### 位置相关属性

| 属性 / 方法          | 描述                             |
| :------------------- | :------------------------------- |
| element.clientHeight | 返回元素的可见高度。             |
| element.clientWidth  | 返回元素的可见宽度。             |
| element.offsetHeight | 返回元素的高度。                 |
| element.offsetWidth  | 返回元素的宽度。                 |
| element.offsetLeft   | 返回元素的水平偏移位置。         |
| element.offsetParent | 返回元素的偏移容器。             |
| element.offsetTop    | 返回元素的垂直偏移位置。         |
| element.scrollHeight | 返回元素的整体高度。             |
| element.scrollLeft   | 返回元素左边缘与视图之间的距离。 |
| element.scrollTop    | 返回元素上边缘与视图之间的距离。 |
| element.scrollWidth  | 返回元素的整体宽度。             |

#### 元素操作相关

| 属性 / 方法                                                  | 描述                                               |
| :----------------------------------------------------------- | :------------------------------------------------- |
| [element.appendChild()](https://www.w3school.com.cn/jsref/met_node_appendchild.asp) | 向元素添加新的子节点，作为最后一个子节点。         |
| [element.childNodes](https://www.w3school.com.cn/jsref/prop_node_childnodes.asp) | 返回元素子节点的 NodeList。                        |
| [element.cloneNode()](https://www.w3school.com.cn/jsref/met_node_clonenode.asp) | 克隆元素。                                         |
| [element.getAttribute()](https://www.w3school.com.cn/jsref/met_element_getattribute.asp) | 返回元素节点的指定属性值。                         |
| [element.getAttributeNode()](https://www.w3school.com.cn/jsref/met_element_getattributenode.asp) | 返回指定的属性节点。                               |
| [element.getElementsByTagName()](https://www.w3school.com.cn/jsref/met_element_getelementsbytagname.asp) | 返回拥有指定标签名的所有子元素的集合。             |
| [element.hasAttribute()](https://www.w3school.com.cn/jsref/met_element_hasattribute.asp) | 如果元素拥有指定属性，则返回true，否则返回 false。 |
| [element.hasAttributes()](https://www.w3school.com.cn/jsref/met_node_hasattributes.asp) | 如果元素拥有属性，则返回 true，否则返回 false。    |
| [element.hasChildNodes()](https://www.w3school.com.cn/jsref/met_node_haschildnodes.asp) | 如果元素拥有子节点，则返回 true，否则 false。      |
| [element.insertBefore()](https://www.w3school.com.cn/jsref/met_node_insertbefore.asp) | 在指定的已有的子节点之前插入新节点。               |
| [element.isEqualNode()](https://www.w3school.com.cn/jsref/met_node_isequalnode.asp) | 检查两个元素是否相等。                             |
| [element.isSameNode()](https://www.w3school.com.cn/jsref/met_node_issamenode.asp) | 检查两个元素是否是相同的节点。                     |
| [element.lastChild](https://www.w3school.com.cn/jsref/prop_node_lastchild.asp) | 返回元素的最后一个子元素。                         |
| [element.nextSibling](https://www.w3school.com.cn/jsref/prop_node_nextsibling.asp) | 返回位于相同节点树层级的下一个节点。               |
| [element.parentNode](https://www.w3school.com.cn/jsref/prop_node_parentnode.asp) | 返回元素的父节点。                                 |
| [element.previousSibling](https://www.w3school.com.cn/jsref/prop_node_previoussibling.asp) | 返回位于相同节点树层级的前一个元素。               |
| [element.removeAttribute()](https://www.w3school.com.cn/jsref/met_element_removeattribute.asp) | 从元素中移除指定属性。                             |
| [element.removeAttributeNode()](https://www.w3school.com.cn/jsref/met_element_removeattributenode.asp) | 移除指定的属性节点，并返回被移除的节点。           |
| [element.removeChild()](https://www.w3school.com.cn/jsref/met_node_removechild.asp) | 从元素中移除子节点。                               |
| [element.replaceChild()](https://www.w3school.com.cn/jsref/met_node_replacechild.asp) | 替换元素中的子节点。                               |
| [element.setAttribute()](https://www.w3school.com.cn/jsref/met_element_setattribute.asp) | 把指定属性设置或更改为指定值。                     |
| [element.setAttributeNode()](https://www.w3school.com.cn/jsref/met_element_setattributenode.asp) | 设置或更改指定属性节点。                           |

### 3.DOM-EVENT

#### 如何绑定事件

```
<button onclick="alert('Hello world!')">
```

```
// Assuming myButton is a button element
myButton.onclick = function(event){alert('Hello world');};
```

```
myButton.addEventListener('click', function(){alert('Hello world');}, false);
```

#### 事件对象参数-标准事件 [Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)

| 属性                                                         | 描述                                           |
| :----------------------------------------------------------- | :--------------------------------------------- |
| [bubbles](https://www.w3school.com.cn/jsref/event_bubbles.asp) | 返回布尔值，指示事件是否是起泡事件类型。       |
| [cancelable](https://www.w3school.com.cn/jsref/event_cancelable.asp) | 返回布尔值，指示事件是否可拥可取消的默认动作。 |
| [currentTarget](https://www.w3school.com.cn/jsref/event_currenttarget.asp) | 返回其事件监听器触发该事件的元素。             |
| [eventPhase](https://www.w3school.com.cn/jsref/event_eventphase.asp) | 返回事件传播的当前阶段。                       |
| [target](https://www.w3school.com.cn/jsref/event_target.asp) | 返回触发此事件的元素（事件的目标节点）。       |
| [timeStamp](https://www.w3school.com.cn/jsref/event_timestamp.asp) | 返回事件生成的日期和时间。                     |
| [type](https://www.w3school.com.cn/jsref/event_type.asp)     | 返回当前 Event 对象表示的事件的名称。          |

| 方法                                                         | 描述                                     |
| :----------------------------------------------------------- | :--------------------------------------- |
| [initEvent()](https://www.w3school.com.cn/jsref/event_initevent.asp) | 初始化新创建的 Event 对象的属性。        |
| [preventDefault()](https://www.w3school.com.cn/jsref/event_preventdefault.asp) | 通知浏览器不要执行与事件关联的默认动作。 |
| [stopPropagation()](https://www.w3school.com.cn/jsref/event_stoppropagation.asp) | 不再派发事件。                           |

#### 事件对象参数-其他事件 

#### MouseEvent (DragEvent、WheelEvent )

onclick  ondrag  ondragstart  ondragend ondragover ondrageave ondragenter onmousedown  onmouseup  onmousemove onmousewheel  

#### KeybordEvent 

onkeyup   onkeydown  onkeypress

#### TouchEvent 

ontouchstart  ontouchend   ontouchmove  ontouchcancel

对于这些事件，事件对象参数都是基于基础事件扩展的，有很多对应该事件的属性和方法，具体参考[Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)





