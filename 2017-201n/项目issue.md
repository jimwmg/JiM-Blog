## React移动端项目

1 搜索之后无法请求下级数据。（后台待优化）

2 搜索的时候的参数data的引用已经递归传递了，所以要保证搜索数据参数的唯一性。（已解决）

3 层级太多没有下划线 (已解决)

4 数据如果太长，超出屏幕大小，Header会被隐藏(已解决)

5 请求第三级数据的时候，如果其子级只有一个，那么就会附带子级也请求回来，如果有多个则不是。(已解决)

6  屏幕像素的理解：如果dpr = 物理像素／设备独立像素（css像素） = 1 ，此时物理像素就是css像素，

比如retina屏幕，dpr会比较高，此时对于相同的物理像素点，起能够展示的css像素就越高

7 图片的放大和缩小的功能可以依靠window.innerHeight进行放大和缩小的处理

px（像素）：屏幕上的点。
in（英寸）：长度单位。
mm（毫米）：长度单位。
pt（磅）：1/72英寸。
dp（与密度无关的像素）：一种基于屏幕密度的抽象单位。在每英寸160点的显示器上，1dp = 1px。
dip：与dp相同，多用于android/ophone示例中。
sp（与刻度无关的像素）：与dp类似，但是可以根据用户的字体大小首选项进行缩放。



搜索功能后台数据有问题：父节点本来不可选，搜索之后父节点又可选了。

## Ecs PC端项目bug解决

31074 ： text-align：center解决字体居中问题；bizDetailDefined 200行  ——已解决（redmine更新为完成）

31063 ： 问题不大，样式都一样，——已解决（redmine更新为完成）

31060 ： detach函数的主要作用，单元格状态不便于维持，——暂缓解决。

29912 ：触发字段没有触发按钮，——已解决（redmine更新为完成）

29869 ：先点第一项的时候，不会出现覆盖问题，先点第一项之外的，在点其他的，则会覆盖；问题判断是高度的计算有误导致的。找不到问题，

29917 ： 常字段配置不应该有箭头——已找到问题，待解决。common.js —init()方法（redmine状态已更新）

```
this.win = new dhtmlXWindows({
                    image_path: this.conf.images_path,
                    skin: this.conf.skin,
                    viewport: this.conf.viewport
                });
this.cell = this.win.createWindow(this.conf.win);
this代表common对象
```

—dhtmlxWindows方法—创建windows对象—然后

		var billNumEditor = billNumWin.cell.attachForm();
		billNumEditor.load(structConf.billNumDialogStruct);

生成窗体，

30225 ： 张媛，小数点位数不正常;目前不能填单，无法修改bug；已解决；

暂时定位问题出在每个单元格的type类型不对，应该是edn.

31492 : _dragRoutine函数 region.userData.rangType = “行浮动”，情况下，designerPage.js文件那里可以找到；已解决



管理中心—>业务建模—>1.业务领域->新增业务域—>新增依赖关系->2.业务环节->新增—>再次回到业务领域—>3.新增依赖关系—>4.单据—>新增—>5.业务中心—>单据—>填单（没有页面，所以需要进行配置）6.业务建模—>配置—>页面模版—>新增模版

设计器对比

1 bdp的designer和ecs的designer文件夹内区别

2 点击页面模版：单据模版billTemplate.html，作为入口文件 

3 ssheet哪里来的？

4 designerLayout就是设计器布局区域，包括左中右的布局以及工具栏。

5 designerObj = new BDP.designer.view({readonly: true}) 其实就是将view对象给到了designerLayout

initToolBar初始化工具栏，initTemp初始化左边栏，

designer.js初始化的时候，是在designerTemplate.js文件里面初始化view的，传入的base参数在designerTemplate.js里面

initTemp初始化表格结构，接受参数是temCell>_initContext，主要作用是初始化表格数据数据源，接受的参数是tempCell.attachTabBar({}).cells；也就是标签之类的被拖拽的单元格；

 _initDesigner里面这行代码

    this.des_cont = desCont.cell.childNodes[desCont.conf.idx.cont];//因为布局由上下两部分组成，这个代表取到第二个元素（layout.cells('b')的一个元素是div-header,第二个元素是div-body)
    this.des_cont.style.overflow = "auto";
    this.des_base = document.createElement("div");
    this.des_base.style.cssText = "position:relative;width:" + (this.des_cont.offsetWidth - 40) + "px;height:100%;left:" + this.conf.regionHeaderWidth + "px;";
    this.des_cont.appendChild(this.des_base);
    //设计器主体
addRegion 添加区域，fTableName == tableName 通过这个判断原来区域设置的表名和所选择的表名是否一致，region.userData.hIndex 代表用户所选择区域的第一行的index值，region.userData.fIndex 代表用户所选择的最后一行的index ;tExtra代表什么？代表拖拽元素所拖放的目标单元格的行和列，应该是第一列不允许拖拽，dhtmlxUndo哪里来的？

this.context是cell.attachTree();userData是用户设置区域的时候所选择的填入的数据

31489:dhtmlxSpreadExt.js 渲染编辑toolBar；已解决

29919: 在页面模版中删掉的标签数据依然显示：无法复现，还需要测试。designer.js中的BDP.dhtmlxSpreadsheetExt初始化编辑单元格的toolbar文件。dhtmlxSpreadSheet.prototype.toolbarClick里面函数定义了toolbar里面每个函数的执行。dhtmlxSpreadsheetExt.doItemClick 对象里面定义了所有的单元格操作命令。定义的方法中又一个cellClear方法为单元格清空 的方法，改方法可以；----无法复现，已解决；

=====8/28

31989 ：

31783:模板设计器在选中多个单元格时滚动条不跟随鼠标；已解决；

31208：模板设计器精简表格没有精简掉曾经拖入过字段或标签后来又删除字段或标签的行列 

dhtmlxSpreadsheetExt.doItemClick中定义了按钮的方法

```javascript
dhtmlx.toArray = function (a) {
  return dhtmlx.extend((a || []), dhtmlx.PowerArray)
};
dhtmlx.PowerArray = {
  removeAt: function (c, a) {
    if (c >= 0) {
      this.splice(c, (a || 1))
    }
  }, remove: function (a) {
    this.removeAt(this.find(a))
  }, insertAt: function (c, e) {
    if (!e && e !== 0) {
      this.push(c)
    } else {
      var a = this.splice(e, (this.length - e));
      this[e] = c;
      this.push.apply(this, a)
    }
  }, find: function (a) {
    for (i = 0; i < this.length; i++) {
      if (a == this[i]) {
        return i
      }
    }
    return -1
  }, each: function (a, e) {
    for (var c = 0; c < this.length; c++) {
      a.call((e || this), this[c])
    }
  }, map: function (a, e) {
    for (var c = 0; c < this.length; c++) {
      this[c] = a.call((e || this), this[c])
    }
    return this
  }
};
window.dhtmlx = {
  extend: function (e, c) {
    for (var g in c) {
      if (!e[g]) {
        e[g] = c[g]
      }
    }
    return e
  }, 
  //以下方法在点击精简表哥的时候会执行
  dhtmlxSpreadSheet.prototype.toolbarClick = function (id) {
  var block = this.grid.getSelectedBlock();
  if (typeof BDP.dhtmlxSpreadsheetExt.doItemClick[id] == "function") {
  BDP.dhtmlxSpreadsheetExt.doItemClick[id].apply(this, [block]);
}
else {
  if (block === null) return;
  if (this.isLocked(block.LeftTopRow, block.LeftTopCol)) return false;
  this.setCellsStyle(id);
}
return true;
};
//找到里面的removeRC函数
removeRC: function () {
  //这里面的this通过apply指向了spreedsheet对象
  var regions = this.designer.regions;//这里面的regions就是上面合并的数组dhtmlx.PowerArray
  var _cIdx = this.designer.userData.gridModel.cutColIdx;
  var _rIdx = this.designer.userData.gridModel.cutRowIdx;
  //更新切除行位置
  for (var i = 0; i < regions.length; i++) {
    var userData = regions[i].userData;
    _rIdx = userData.fIndex < _rIdx ? _rIdx : userData.fIndex;
  }
  // 先删列 再删行
  while (this.settings.cols > _cIdx) {
    if (this.grid._cellRowIndexes && this.grid._cellRowIndexes[this.settings.cols])
      this.grid._cellRowIndexes.splice(this.settings.cols, 1);
    this.grid.deleteColumn(this.settings.cols);
    this.settings.cols--;
  }
  while (this.settings.rows > _rIdx) {
    this.grid.deleteRow(this.settings.rows);
    for (var i = 1; i <= this.settings.cols; i++) {
      if (this.grid._cellRowIndexes && this.grid._cellRowIndexes[i]) {
        this.grid._cellRowIndexes[i].pop();
      }
    }
    this.settings.rows--;
  }
  this.designer.setSizes();
},

  dhtmlxSpreadSheet.prototype = {

    init: function() {
      this.toolbarInit();
      this.mathInit();
      this.setSizes();
      if (!this.grid)
        this.grid = new dhtmlXGridObject(this.settings.parent.grid);
      this.grid.ssheet = this;
    }
```

_dragRoutine改变了拖拽的边界值，清除单元格内容的话，需要改变回来。

实现继承BDP

```javascript
var __extends = this.__extends || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }

        __.prototype = b.prototype;
        d.prototype = new __();
    };
```



32154：

```javascript
eXcell.prototype = new dhtmlXGridCellObject;
```

31782

window.listenerEvent = require("listenerEvent"); 所有面板的切换都将走这个函数，因为listenerEvent是个模块，定义了切换事件，[jQuery()](http://www.css88.com/jqapi-1.9/jQuery/)

返回匹配的元素集合 无论是通过 在DOM的基础上传递的参数还是创建一个HTML字符串。$("`<p>hello</p>`").appendTo(body)



view.prototype.isChangeState 判断设计器中的数据是否更改，也即是region中的数据，主要根据两个指标去判断是否有数据更改，第一个是region数量，第二个是gridModel对象

关于userData；billTemplate.js中new BDP.designer.view 的时候，通过new调用该函数，里面的this指向生成的对象；

    designerObj = new BDP.designer.view({readonly: true, defaultLayer: false, layout: designerLayout, multiLangSturct: multiLangSturct});
    designerObj.init();

new该构造函数的时候，

```javascript
//获取默认业务数据
this.defaultData = this._getDefaultData(); 
{blocks:[],gridModel:{rows: 30, cols: 15, cutRowIdx: 0, cutColIdx: 0, datas: "<?xml version='1.0' encoding='UTF-8'?> <rows><head…owidx='30' colidx='15' istitle='0'/></row></rows>"}
},templateId:''}
//初始化数据拷贝默认
this.initData = window.dhx4._copyObj(this.defaultData);
//初始化区域列表
this.regions = dhtmlx.toArray();//复制了dhtmlx.powerArray上面的功能,默认是一个数组；
```

在view.prototype._initDesigner函数中

```javascript
this.spreadsheet.init();//之后spreedsheet对象中才有grid对象，this.grid.ssheet = this;并且在init函数中将dhtmlxspreedsheet实例化对象绑在了ssheet属性上；
this.spreadsheet.designer = this; //也就是酱view对象绑定到spreedsheet对象上的designer属性上
```

```javascript
 dhtmlxSpreadsheetExt.doItemClick 中改变区域的大小
```

```javascript
window.top.listenerEvent.addBeforeMenuChangeListener({
  confirm:function(){
    try {
      if(designerObj.isChangeState()){
        return {
          result:false,
          msg: languageData.msg.m15
        };
      }else{
        return {result:true}
      }
    } catch (e) {
      return {result:true}
    }
  },
  okCallback:function(){
  }
});
//只有点击进入页面模版之后，才会有该事件绑定到top对象上
```



优化数据是否变更，

第一：如果拖拽之后，边界值没有变化，区域也没有变化，但是字段是变化了的不会触发保存；

28483:影像被标记的图片放大缩小后，标记消失

31406:控制标准编制界面的策略类型显示成了英文而且无法修改



bill.html

请求一个单据的时候,param初始值，init

```javascript
billModelId:"1"
requestId:"createNewRequest"
scenario:"NEW"
userData:app:"undefined"id:"1504506833911"parentId:"undefined"title:"申请单"
```

然后initBill接受param参数，再次请求

```javascript
param.billModelUUID = billWebModel.billModelUUID;
param.dataModelUUID = billWebModel.dataModelUUID;
param.userData.billName = billWebModel.billName;
param.userData.baseBizModel = billWebModel.baseBizModel;
param.userData.modelType = billWebModel.modelType
```

```javascript
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
    loadTemplateData方法是用来开始进行的壮哉数据的方法，包括请求后段模版数据
```

```javascript
dhtmlxSpreadSheet.prototype.addContext = function () {  ......
该方法实现右键单击Grid表格之后的弹出框
```



实现行高可调功能

dhtmlxGrid.js中this.startColResize该函数执行的时候，开始调整列宽，doColResize执行列 的宽度调整；

SpreadSheetHeaderEditor，

实现思路：给第一列绑定事件onmouseover，改变鼠标样式，拖动之后，改变tr行的样式，dhtmlX.js

```
if ((!_isOpera)||(_OperaRv > 8.5)){
   this.hdr.onmousemove=function(e){
      this.grid.changeCursorState(e||window.event);
   };
   this.hdr.onmousedown=function(e){
      return this.grid.startColResize(e||window.event);
   };    
}
在hdr上设置的函数
```

当点击第一列onmousedown的时候，获取父元素tr的style高度，然后动态的加上鼠标移动的距离，同时获取到当前列，写入实时的属性值

当onmouseup的时候，



区域实线和虚线的实现

getRowPositionY获取对应的行的距离des_cont的距离；

============

bug. 初始化之后的区域边线会因为头部的图片而位置不对；手动出发鼠标事件即可；

bill解析浮动区域头的时候，不能解析图片；

图片保存几次之后不显示，原因是序列化的时候zxVal取值有问题，也就是eXcell_img的getValue方法有问题；

dataset函数存在死循环，需要优化；