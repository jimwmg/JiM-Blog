---
title:  DOM-Node-API
date: 2018-05-08 12:36:00
categories: html
---

### 1 Node 属性

* nodeValue
* nodeType
* nodeName
* childrenNodes
* textContent
* nextSibling
* previousSibling



### 2 Node 方法

* contains( ) : method returns a [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) value indicating whether a node is a descendant of a given node, i.e. the node itself, one of its direct children ([`childNodes`](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes)), one of the children's direct children, and so on.
* appendChild( ) : The `**Node.appendChild()**` method adds a node to the end of the list of children of a specified parent node. If the given child is a reference to an existing node in the document, `appendChild()` moves it from its current position to the new position (there is no requirement to remove the node from its parent node before appending it to some other node).