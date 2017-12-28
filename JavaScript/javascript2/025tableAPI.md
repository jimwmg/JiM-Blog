```
var _cCount = 5 ;
var e = document.createElement("DIV");
var c = ["<table><tr>"];
for (var a = 0; a < _cCount; a++) {
c.push("<td></td>")
}
c.push("</tr></table>");
e.innerHTML = c.join("");
console.dir(e.firstChild);
console.dir(e.firstChild.rows[0]);
console.dir(e.firstChild.rows[0].cells);
document.body.appendChild(e);
var cloneE = e.cloneNode(true);
document.body.appendChild(cloneE);
```

====table对象有一个rows接口，可以获取到所有的tr对象

====tr对象有一个cells接口，可以获取所有的td对象

====cloneNode() 方法创建节点的拷贝，并返回该副本。

cloneNode() 方法克隆所有属性以及它们的值。

如果您需要克隆所有后代，请把 deep 参数设置 true，否则设置为 false。