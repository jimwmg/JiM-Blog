```javascript
function dhtmlXCellObject(e, a) {
    this.cell = document.createElement("DIV");
    this.cell.className = "dhx_cell" + (a || "");
  ...
}
```

cell对象就是一个div对象