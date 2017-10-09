---
title: javascript语言精粹
date: 2017-09-18
categories: javascript
tags: 
---

1 巧用 && 执行代码，简化逻辑

```javascript
function revertCellType (c1,c2){
  var flag = false ;
  if(c1)
    if(c1.cell._cellType == 'img'){
      delete c1.cell._cellType ;
      flag = true ;
    };
  if(c2)
    if(c2.cell._cellType == 'img'){
      delete c1.cell._cellType ;
      flag = true ;
    };
  return flag ;
}
```

