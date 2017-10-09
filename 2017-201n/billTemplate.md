init====dhtmlxLayoutObject=====dhtmlCellTop(获取body同时添加样式，添加div等)

|      |                |      |
| ---- | -------------- | ---- |
| 9.11 | 理顺设计器保存行高和输出行高 |      |
| 9.12 | 完善行高保存和输出代码    |      |
| 9.13 | 理顺区域重定位        |      |
| 9.13 | 理顺区域重定位        |      |
| 9.13 | 完善区域重定位代码      |      |

view函数 展示gridModel数据的view层.进行view层的视图加载，designer.js

```javascript
view.prototype._initObj = function (data) {
  //同一环境切换，只需要修改数据，而不更改结构
  var gridModel = window.dhx4._copyObj(this.initData.gridModel);
  //拷贝初始化默认数据
  this.userData = window.dhx4._copyObj(this.initData);
  //传入数据扩展默认
  this.userData = dhtmlx.extend(this.userData, data);
  this.userData.gridModel = dhtmlx.extend(gridModel, data.gridModel);
  //服务器load，更替数据库默认
  if (this.conf.serverLoading)
    this.defaultData = window.dhx4._copyObj(this.userData);
  if (this.getCurrentInfo("state") == "construct") {
    this.init();
  }
  else {
    //清除
    this.spreadsheet.grid.clearAll(true);
    this.spreadsheet.settings.styles = [];
    delete this.spreadsheet.grid._cellRowIndexes;
  }
  //状态更新
  this.spreadsheet.settings.rows = this.userData.gridModel.rows; //默认行数
  this.spreadsheet.settings.cols = this.userData.gridModel.cols; //默认列数
  this.setCurrentInfo("selectRegion", null);
  this.setCurrentInfo("isChange", false);
  //清除区域信息
  this.clearRegions();
  //装载设计器表格信息
  this.loadGridModel();
  //初始化区域信息
  this.initRegions();
  //装载多语言标签数据
  if (data.multiLangs)
    this.multiLangDS.parse(data.multiLangs, "json");
  //设计器时机状态
  this.setCurrentInfo("state", "load");
};
现在这里打个断点：view.prototype.loadGridModel = 进行设计器数据的加载  == > 进入到dhtmlGridExt.js
然后在这里打个断点：dhtmlXGridObject.prototype._postRowProcessing = 函数执行解析；
```

dhtmlxSpreadSheet.js。cellClear

region函数展示blocks数据的view层

====输出：dhtmlxSpreadSheet -serializeRow方法，重写输出字符串，该方法是grid的原型的方法;myGrid.setRowTextStyle可以改变行的样式；也就是说可以直接根据此改变行高；

```javascript
dhtmlxSpreedSheetExt.js
save: function () {
  this.designer.save();
},
  billTemplate.js中点击保存的功能
designerObj.attachEvent("onSave", function (data) {
  var canSave = false;
  data.templateId = templateDS.getCursor();
  //修改：字体样式引号问题引发保存到数据库中字符串取出来不能读取问题
  data.gridModel.datas = data.gridModel.datas.replace(/font-family: 'Times New Roman';/g, "font-family: Times New Roman;");
  ajax.postJsonJquery("/billDesigner/saveBillDesigner", data, function (result) {
    if (result.result) {
      message.alert(languageData.msg.m3);  //保存成功
      canSave = true;
    } else {
      message.alert(result.msg); //保存失败！
    }
  }, function (e) {
    message.alert(e.responseText);
  });
  return canSave;
});
}
```

将变化的样式写入row就可以；row-h : 

  zxVal = zx[this._agetm]();  会执行dhtmlxGridExt中eXcell_img对象中的getValue方法，获取图片的路径；这就是为什么路径重复的原因；

====输入：写给grid的this.xml.row_attrs属性行高值；给到row: out.push(" style='" + sytleText + "' ");

```javascript
//billTemplate.js
function loadTempData() {
    	// ajax请求单据数据
        var parame = {};
        parame.billuuid = globalParams.billuuid;
        parame.templateType = "模板";
        ajax.asyncPostJquery("/billDesigner/getBillTemplates", parame, function (billTemplates) {
            if (billTemplates && billTemplates.length > 0) {
                templateDS.parse(billTemplates, "json");
                templateGrid.selectRow(0, true, true, true);//默认点击所有模版中的第一个模版，然后执行加载第一个模版文件；
            }
        }, function (e) {
            message.alert(e.responseText);
        });
    }
loadData可以看到具体的某个模版请求回来的xml字符串信息
```

loadTempData===>回调xhr触发==>templateGrid.selectRow(0, true, true, true);==触发==templateGrid.attachEvent("onRowSelect")==>触发==>loadData(id);==>view.prototype._initObj==>view.prototype.initRegions==>view.prototype.addRegion ==>region.loadStruct(conf);==>region.prototype._initObj

=====获取行高，获取鼠标移动距离，设置行高，

###区域自适应



    view.prototype.initRegions = function () {
      var regionList = this.userData.blocks; this值得是view对象
      for (var i = 0; i < regionList.length; i++) {
      var region = regionList[i];
      this.addRegion(region, "load");
      }
    };
```javascript
view.prototype.addRegion = function (conf, mode) {
  var _this = this;
  if (!mode)
    mode = "load";
  var region = new BDP.designer.region({
    view: this,
    grid: this.spreadsheet.grid,
    icons_path: this.conf.icons_path,
    image_path: this.conf.image_path,
    state: mode
  });
  //这里的conf就是regions中的每一个region
  region.loadStruct(conf);
  //对象放入当前设计器中
  region.attachEvent("onAfterDelete", function () {
    _this.deleteRegion(this);
  });
  this.regions.push(region);
  //非装载时，则必然是手动新增region，状态修改
  if (mode != "load")
    this.setCurrentInfo("isChange", true);
  return region;
};
```

loadStruct函数执行进入 _ initObj;

```javascript
//目的是初始化userData对象；也就是每一个region对象；
region.prototype._initObj = function (data) { //data就是conf
  this.userData = dhtmlx.extend(this.userData, data);
  this.init();
};
```

_init函数进行区域的初始化

```javascript
region.prototype.init = function () {
  //计算配置信息
  this._calcSetting();
  //初始化区域编辑器
  if (this.conf.state != "load")
    this._initEditor();
  //初始化工具栏
  this._initToolBar();
  //初始化区域边线
  this._addRegionLine();
  //事件绑定
  this._bindEvents();
};
```

addRegionLine添加了区域的线以及区域的蒙版

```javascript
region.prototype._addRegionLine = function () {
  var _this = this;
  var des_cont = this.view.getCanvasContainer();
  if (!this.grid)
    return;
  //区域外区线样式
  var outLineCssStr = "border-bottom:solid 1px #ACDAF0;";
  var outLineLeftCssStr = "border-left:solid 1px #ACDAF0;";
  //区域内区线样式
  var inLineCssStr = "border-bottom:dashed 1px #ACDAF0;";
  //区域操作蒙版样式
  var regionBaseCssStr = "";
  //区域边界
  this.blocks.header = this._addLine(this.conf.topLineHeight, this.conf.offsetLeft - this.conf.headerWidth, this.conf.headerWidth, this.conf.clientHeight);
  this.blocks.header.className = "designer_block_header";
  this.lines.top = this._addLine(this.conf.topLineHeight, this.conf.offsetLeft, null, 0, outLineCssStr);
  this.lines.bottom = this._addLine(this.conf.bottomLineHeight, this.conf.offsetLeft, null, 0, outLineCssStr);
  this.blocks.footer = this._addLine(this.conf.topLineHeight, this.conf.offsetLeft + this.conf.clientWidth, 0, null, outLineLeftCssStr);
  //设定标题
  var headerText = document.createElement("div");
  headerText.style.maxHeight = (this.conf.clientHeight - 6) + "px";
  headerText.style.width = (this.conf.headerWidth - 4) + "px";
  this.blocks.header.appendChild(headerText);
  this.setTiltle(this.userData.regionName);
  if (this.userData.headerCount > 0) {
    //区域表头高度值
    var headerLineHeight = this.userData.hIndex + this.userData.headerCount - 1;
    headerLineHeight = this.grid.getRowPositionY(headerLineHeight, des_cont);
    this.lines.header = this._addLine(headerLineHeight, this.conf.offsetLeft, null, 0, inLineCssStr);
  }
  if (this.userData.footerCount > 0) {
    //区域表尾高度值
    var footerLineHeight = this.userData.fIndex - this.userData.footerCount;
    footerLineHeight = this.grid.getRowPositionY(footerLineHeight, des_cont);
    this.lines.footer = this._addLine(footerLineHeight, this.conf.offsetLeft, null, 0, inLineCssStr);
  }
  //区域操作蒙版
  this.blocks.base = this._addLine(this.conf.topLineHeight, this.conf.offsetLeft, null, this.conf.clientHeight, regionBaseCssStr);
  this.blocks.base.className = "designer_block_base";
  if (this._toolbarBase) {
    var scurrentHeight = parseInt(this._toolbarBase.style.height);
    this._toolbarBase.style.top = ((this.conf.clientHeight - scurrentHeight) / 2) + "px";
    this.blocks.base.appendChild(this._toolbarBase);
  }
  //根据区域是否选择处理base
  this.setSelected(this.isSelected());
  dhtmlxEvent(this.blocks.header, "click", function () {
    _this.view.selectRegion(_this);
  });
};
```

然后给区域绑定事件,

```javascript
region.prototype._bindEvents = function () {
  var _this = this;
  if (!this.grid)
    return;
  //表格大小更新触发当前区域大小更新
  this._sizeEvent = this.grid.attachEvent("onResizeEnd", function () {
    if (!_this._sizeEvent)
      return;
    _this.setSizes();
  });
  //滚动触发界面区域位置更改
  this._scrollEvent = dhtmlx.event(this.view.getCanvasContainer(), "scroll", function () {
    if (!_this._scrollEvent)
      return;
    _this.updatePosition();
  });
};
```

设计器图片清空之后，改变该单元格的属性，设计器上的一些功能点击事件

```
var doToolBarClick
```




bill.js. 

```javascript
billPage.js
b.loadStruct({
  billInfo: param,
  templtModel: billWebModel.templtModels[0],
  dataModel: billWebModel.dataModel,
  webPlugDatas: billWebModel.webPlugDatas
});
//会执行到bill.js里面的
view.prototype._initObj
然后执行到initIfram的时候，会显示view层页面
initToolbar. 初始化工具栏
initRegion 初始化区域
然后根据具体是浮动区域还是固定区域，进行对应区域的初始化，
var region = new (regionInfo.billRang.rangType == regionType.float ? floatRegion : fixedRegion)({
  view: this,
  parent: cont,
  regionInfo: regionInfo,
  date_format: this.conf.date_format,
  readOnly: this.isReadOnly(),
  canAdd: this.conf.canAdd
});
region.init();
```

```javascript
region.prototype.init = function () {
  var dataGrid = new dhtmlXGridObject(this.cont);
  //取消自动换行功能，固定行高
  //dataGrid.enableMultiline(false);
  dataGrid.setSerializationLevel(true, true, false, true, false, false); // 序列化设置
  dataGrid.enableMultiselect(false);
  dataGrid.enableRowspan(true); // 允许行合并
  dataGrid.enableColSpan(true); // 允许列合并
  dataGrid.enableAutoWidth(true);
  dataGrid.enableAutoHeight(true);
  dataGrid.enableValidation(true);
  dataGrid.setEditable(!this.isReadOnly());
  //单击执行录入
  dataGrid.enableLightMouseNavigation(true);
  //键盘输入
  dataGrid.enableBDPKeyMap();
  if (this.conf.rangData)
    dataGrid.loadXMLString(this.conf.rangData);//这个加载数据，也是执行dhtmlGridExt里面processRow函数，
  this.grid = dataGrid;
  this.initGridSetting();
  this.attachGridEvent();
  var afterInitRegionStartTime = new Date().getTime();
  this.view.callEvent("afterInitRegion", [this.conf.regionInfo]);
  //console.log("单据区域初始化后afterInitRegion，时间为" + (new Date().getTime() - afterInitRegionStartTime) + "毫秒");
};
```

bill单据会对所有的单元格的类型进行判断；

```javascript
view.prototype.bindField = function (cell) {
  if (!cell)
    return;
  var tableName = cell.getAttribute("pident");
  var ident = cell.getAttribute("ident");
  if (tableName || ident == "CODEBAR") {
    var ds = this.model.getDataStore(tableName) || this.model.mainDataStore;
    var bindUI = this.model.getBindUI(ds);
    //字段绑定dataStore
    cell.bind(ds);
    //保存cell对象
    cell.cell.bindCell = cell;
    //绑定关系存取
    bindUI.fields.push(cell);
  }
};
```
dhtmlGridExt.js. 图片大小的改变

```javascript
function eXcell_img(cell){
  try{
    this.cell=cell;
    this.grid=this.cell.parentNode.grid;
  }
  catch (er){}
  this.getValue=function(){
    var isRequest = this.cell._attrs.isRequest;
    if (this.cell.firstChild.tagName == "IMG")
      return isRequest?this.cell._brval:(this.cell.firstChild.src+(this.cell.titFl != null
                                                                   ? "^"+this.cell._brval
                                                                   : ""));
    else if (this.cell.firstChild.tagName == "A"){
      var out = this.cell.firstChild.firstChild.src+(this.cell.titFl != null ? "^"+this.cell._brval : "");
      out+="^"+this.cell.lnk;

      if (this.cell.trg)
        out+="^"+this.cell.trg;
      return out;
    }
  };
  this.isDisabled=function(){
    return true;
  }
}
```

