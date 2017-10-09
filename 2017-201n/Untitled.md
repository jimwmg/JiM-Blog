```javascript
model.prototype.init = function () {
  if (!this.conf.dataModel)
    return;
  //主表
  var mainObj = this.conf.dataModel.item[0];
  this.addDataStore(mainObj, null);
};
//这个就是递归的将数据存到dataStores上，这个是model上初始化的一个空数组；具体数据在桌面有截图；
//同时设置的必读字段在dataModel里面会有字段设置出来；objData {sysFiled:ture}
```

业务规则数据设置必填字段的信息在model.dataStores里面存储；这里可以得到设置的规则信息，将model传进去之后，下一步就需要找到前端所填写 的信息在哪里，然后进行递归对比；ok;

点击添加行的时候：

```javascript
dhtmlXGridObject.prototype._addRow = function (new_id, text, ind) {
  if (ind == -1 || typeof ind == "undefined")
    ind = this.rowsBuffer.length;
  if (typeof text == "string") text = text.split(this.delim);
  var row = this._prepareRow(new_id);
  row._attrs = {};

  this.rowsAr[row.idd] = row;
  if (this._h2) this._h2.get[row.idd].buff = row;	//treegrid specific
  this._fillRow(row, text);
  this._postRowProcessing(row);
  if (this._skipInsert) {
    this._skipInsert = false;
    return this.rowsAr[row.idd] = row;
  }

  if (this.pagingOn) {
    this.rowsBuffer._dhx_insertAt(ind, row);
    this.rowsAr[row.idd] = row;
    return row;
  }

  if (this._fillers) {
    this.rowsCol._dhx_insertAt(ind, null);
    this.rowsBuffer._dhx_insertAt(ind, row);
    if (this._fake) this._fake.rowsCol._dhx_insertAt(ind, null);
    this.rowsAr[row.idd] = row;
    var found = false;

    for (var i = 0; i < this._fillers.length; i++) {
      var f = this._fillers[i];

      if (f && f[0] <= ind && (f[0] + f[1]) >= ind) {
        f[1] = f[1] + 1;
        var nh = f[2].firstChild.style.height = parseInt(f[2].firstChild.style.height) + this._srdh + "px";
        found = true;
        if (this._fake) {
          this._fake._fillers[i][1]++;
          this._fake._fillers[i][2].firstChild.style.height = nh;
        }
      }

      if (f && f[0] > ind) {
        f[0] = f[0] + 1;
        if (this._fake) this._fake._fillers[i][0]++;
      }
    }

    if (!found)
      this._fillers.push(this._add_filler(ind, 1, (ind == 0 ? {
        parentNode: this.obj.rows[0].parentNode,
        nextSibling: (this.rowsCol[1])
      } : this.rowsCol[ind - 1])));

    return row;
  }
  this.rowsBuffer._dhx_insertAt(ind, row);
  return this._insertRowAt(row, ind);
};
```

当行轮廓出来之后，遍历每个单元格，添加背景图片；这个就是实现的思路；

```javascript
dhtmlXGridObject.prototype.attachCellButton = function (cell, imgUrl, size, pos, func) {
  var _this = this;
  if (!cell || !cell.tagName) return;
  //拆分background样式，阻止和单据setStyle接口自定义样式冲突
  var bg = "background-image:url(img_url);background-repeat:no-repeat;background-position:pos_horizon;background-origin:padding-box;padding-right:size";
  pos = pos || "center";
  bg = bg.replace(/img_url/, imgUrl).replace(/pos_horizon/, pos).replace(/size/, size + "px");
  cell.style.cssText += bg;
  //先清除其他事件
  if (cell.clickEvId) {
    dhtmlx.eventRemove(cell.clickEvId);
    cell.clickEvId = null;
  }
  //事件管理：存储点击事件Id, 清除事件
  cell.clickEvId = dhtmlx.event(cell, "click", function (e) {
    e = e || window.event;
    //停止冒泡
    if (e.stopPropagation)
      e.stopPropagation();
    else
      e.cancelBubble = false;
    var posX = e.offsetX || e.layerX;
    var cellWidth = cell.offsetWidth || this.getColWidth(cell.cellIndex);
    var imgR = (cellWidth + size) / 2;
    if (pos == "left")
      imgR = size;
    else if (pos == "right")
      imgR = cellWidth;

    var imgL = imgR - size;
    //点击图片区域触发事件
    if (posX >= imgL && posX <= imgR && typeof func == "function") {
      //执行点击操作函数
      func.apply(cell);
    }
  });
};
```

每一个表记录对应一个dataStore,比如主表，明细表，结算表等；dataStore下面有dataSet对象，dataSet下面有dataObjs里面有dataObj，dataObj里面有data数据，里面存放着每一行的数据集；每次点击+好，dataObjs就多一条记录；

上面的函数是通过以下函数进入的

```javascript
//设置字段图标及操作
setAssit(dataObj:iDataObj, key:string, callBack:Object);
```

