billPage.js==>initBill函数==>

```javascript
var billWebModel = requestStructData(param);
```

请求到所有的数据，包括

```javascript
"RequestBill"
billModelUUID
:
"beca6d6c-9d08-49e2-b9ec-6c0cd5da81ca"
billName
:
"ZY_申请单"
dataModel
:
{id: "0", item: Array(1), canAdd: false, canDel: false, temp: false}
dataModelUUID
:
"3baf4336-013e-47ad-8345-1227fbdb8781"
modelType
:
"单据模型"
templtModels
:
[{…}]
webPlugDatas
:
(5) [
```



initBill.  var billWebModel = requestStructData(param);这里面可以请求到所有的数据，包括插件，

==>new BDP.bill.view()==>view.prototype.initObj(data)==>view.prototype.init ==>

```javascript
window.dhx4._enableDataLoading(this, "_initObj", "_xmlToJson", "bill", { struct: true });
//执行loadStruct该函数的时候，就会执行到——view.prototype.initObj
b.loadStruct({
  billInfo: param,
  templtModel: billWebModel.templtModels[0],
  dataModel: billWebModel.dataModel,
  webPlugDatas: billWebModel.webPlugDatas
});
//该函数执行的时候会将billWebModel所有的属性给到view的userData里面；
view.prototype._initObj = function (data) {
  for (var target in data) {
    this.userData[target] = data[target];
  }
  this._init();
};
//当有了所有的数据之后，可以进行模型，框架，插件，等的初始化；
view.prototype._init = function () {
  //前端数据模型初始化
  this._initModel();
  //前端页面框架初始化
  this._initFrame();
  //初始化web插件
  this._initPlugin();
  //初始化web插件
  this._initAction();
  this.callEvent("afterInit", [this.userData.billInfo, this.model]);
};
view.prototype._initModel = function () {
  //模型初始化
  this.model = new BDP.bill.model({ dataModel: this.userData.dataModel, date_format: this.conf.date_format });
  this.model.init();
  this.model.view = this;
};
model.prototype.init = function () {
  if (!this.conf.dataModel)
    return;
  //主表
  var mainObj = this.conf.dataModel.item[0];
  this.addDataStore(mainObj, null);
};
//这个就是递归的将数据存到dataStores上，这个是model上初始化的一个空数组；具体数据在桌面有截图；
//同时设置的必读字段在dataModel里面会有字段设置出来；objData {sysFiled:ture}，不对；
model.prototype.addDataStore = function (obj, pObj) {
  if (!obj || typeof obj != "object")
    return;
  var ds = new dhtmlXDataStore();
  //主表dataStore赋值
  if (!pObj)
    this.mainDataStore = ds;
  else
    ds.pIdent = pObj.id;
  //ds增加表名和模型数据属性
  ds.ident = obj.id;
  //业务唯一标识
  ds.uuid = obj.uuid;
  ds.model = this;
  //存储
  this.dataStores.push(ds);
  //存在子表，遍历新增绑定
  if (obj.item && obj.item.length > 0) {
    var count = obj.item.length;
    for (var i = 0; i < count; i++) {
      var cObj = obj.item[i];
      this.addDataStore(cObj, obj);
    }
  }
  this._attachDsEvents(ds);
};
```

上面loadstruct函数的参数对象就是initObj函数参数的data;然后可以给到view.userData中；

```javascript
view.prototype._init = function () {
  //前端数据模型初始化
  this._initModel();
  //前端页面框架初始化
  this._initFrame();
  //初始化web插件
  this._initPlugin();
  //初始化web插件
  this._initAction();
  this.callEvent("afterInit", [this.userData.billInfo, this.model]);
};
```

this._initPlugin( ) 同步动态加载js；将plugin中的js文件全部加载下来，并且给到view或者model的属性；

```javascript
for (var i = 0; i < this.userData.webPlugDatas.length; i++) {
  var plugin = this.userData.webPlugDatas[i];
  var name = plugin.plugFile;
  var data = plugin.plugData;
  this._getScriptFile(name, "plugin", data);
}
view.prototype._initPlugin = function () {
  var _this = this;
  if (!this.userData.webPlugDatas)
    return;
  //同步加载配置
  $.ajaxSettings.async = false;
  //缓存动态js
  $.ajaxSetup({ cache: true });
  //以下插件的加载，将所有的插件加载到bill对象上；
  //现将plugin文件夹下面的五个文件加载下来；
  for (var i = 0; i < this.userData.webPlugDatas.length; i++) {
    var plugin = this.userData.webPlugDatas[i];
    var name = plugin.plugFile;
    var data = plugin.plugData;
    this._getScriptFile(name, "plugin", data);
  }
  //然后在加载plugin/system下面的厄插件系统；加载系统默认插件，从配置文件读取，同步请求
  var baseBizModel = this.getUserData("baseBizModel"); //基础业务模型
  var allConfigData = null;
  $.getJSON(_this.conf.filePath + "plugin/system/config.json", function (data) {
    allConfigData = data;//systems文件下的config.json
  });
  $.getJSON(this.conf.filePath + "plugin/billplugin/billPlugin.json", function (billPlugin) {
    if (billPlugin && billPlugin.length > 0) { //billPlugin.json
      for (var i = 0; i < billPlugin.length; i++) {
        if (!billPlugin[i].name)
          continue;
        var path = billPlugin[i].path;
        var fileData = billPlugin[i].data;
        if (!path || !fileData)
          continue;
        $.getJSON(_this.conf.filePath + "plugin/billplugin/" + path + "/" + fileData, function (subData) {
          if (subData && subData.length > 0) {
            for (var j = 0; j < subData.length; j++) {
              var subName = subData[j].name;
              if (!subName || subName.toUpperCase() != baseBizModel.toUpperCase())
                continue;
              var plugins = subData[j].data;
              if (plugins && plugins.length > 0) {
                for (var k = 0; k < plugins.length; k++) {
                  var itemName = plugins[k];
                  if (allConfigData && allConfigData.length > 0) {
                    for (var m = 0; m < allConfigData.length; m++) {
                      var name = allConfigData[m].name;
                      if (!name || itemName.toUpperCase() != name.toUpperCase())
                        continue;
                      _this._getScriptFile(name + ".js", "plugin/system", allConfigData[m].data);
                    }
                  }
                }
              }
            }
          }
        });
      }
    }
  });
  $.ajaxSettings.async = true;
};
//循环加载插件
```

view.prototype._getScriptFile  每次循环加载插件的时候，js文件是立即执行的；插件加载执行的过程中，会给view或者model通过dhtmlx事件系统绑定一些事attachEvent件，绑定之后，在bill.js文件中，view对象上会有save submit等toolbar事件的callEvent；触发之前绑定的对应的事件；

```javascript
view.prototype._getScriptFile = function (name, type, data) {
  if (!name)
    return;
  var _this = this;
  //这个是jquery请求后台数据
  /*这里的回调函数会传入返回的 JavaScript 文件。这通常不怎么有用，因为那时脚本已经运行了。
载入的脚本在全局环境中执行，因此能够引用其他变量，并使用 jQuery 函数。*/
  $.getScript(_this.conf.filePath + type + '/' + name, function () {
    var plugin = name.replace(/.js/g, "");
    if (BDP.bill[plugin] && BDP.bill[plugin].init) {
      //如果bill对象上存在相应的插件，并且存在init函数，那么久初始化该函数；
      var pluginObject = BDP.bill[plugin].init(_this.model, data);
      //插件作为model的属性
      _this[type] = _this[type] || {};
      _this[type][plugin] = pluginObject;
    }
  });
};
//在model上提供一个借口，setRequired，供webrule.js调用；
model.prototype.setRequired = function (dataObj, key, isRequired) {
  var cells = this.getCells(dataObj, key);
  for (var i = 0; i < cells.length; i++) {
    var oldRule = cells[i].getAttribute("validate");
    var newRule = "";
    newRule = isRequired ? ((oldRule ? oldRule + "," : "") + "isNotEmpty") : (oldRule.replace(/isNotEmpty/g, "").replace(/^,|,&/g, ""));
    cells[i].setAttribute("validate", newRule);
  }
}
```

对应的工具栏事件如下函数绑定

```javascript
view.prototype._initToolbar = function (cell) {
  var _this = this;
  if (this.toolbar)
    return;
  if (!this.userData.templtModel || !this.userData.templtModel.toolbars || this.userData.templtModel.toolbars.length == 0)
    return;
  var toolbarConfs = this.userData.templtModel.toolbars;
  this.toolbar = cell.attachToolbar({
    icons_path: this.conf.toolbar_icons_path,
    items: toolbarConfs
  });
  this.toolbar.attachEvent("onClick", function (id) {
    _this._doActionHandle(id);
  });
};
view.prototype._doActionHandle = function (id) {
  var _this = this;
  //结束edit状态
```

点击保存或者提交的时候

```javascript
view.prototype.save = function (actionId, showSuccessMsg) {
  var res = false;
  var beforeSaveStartTime = new Date().getTime();
  if (this.callEvent("beforeSave", [actionId, systemRequest.save, this.model])) {
    console.log("前端保存前处理beforeSave，时间为" + (new Date().getTime() - beforeSaveStartTime) + "毫秒");
    var rqRes = this.doRequest(actionId, systemRequest.save, requestType.full, showSuccessMsg);
    if (rqRes) {
      if (rqRes.data) {
        this.loadData(rqRes.data);
        this.setState("isChanged", false);
      }
      if (rqRes.result) {
        var afterSaveStartTime = new Date().getTime();
        this.callEvent("afterSave", [actionId, systemRequest.save, this.model]);
        console.log("前端保存后处理afterSave，时间为" + (new Date().getTime() - afterSaveStartTime) + "毫秒");
        res = true;
      }
    }
  }
  return res;
};
//默认保存results是false,需要经过规则校验，也就是beforeBillSave函数进行对dataSet和listRules进行比对校验，如果beforeBillSave执行成功，那么result值为true,可以向后台进行保存操作；返回results;否则抛出异常；
//如果校验过程中可以返回true就可以了；证明校验通过，如果无法改变results的值，则返回false，证明校验不通过；
this.bc.view.attachEvent("beforeSave", function (actionId, requestId, model) {
  debugger;
  var result = false;
  try {
    result = _this.beforeBillSave(model);
  } catch (e) {
    message.alert(e.message);
    return false;
  }
  //在executeRule函数里面改变了requiredMsg的值，如果校验通过，则为空字符串，如果校验不通过，则为字符串；执行message.alert函数；
  //所以需要增加一个属性，判断是否需要进行提示；
  //以下代码注释掉
  if (requiredMsg) {
    message.alert(requiredMsg);
    requiredMsg = "";
    return false;
  }
  return result;
});
ruleProcess.prototype.beforeBillSave = function (model) {
  var ruleList = this.getBillRulesByEvent(BEFORE_BILL_SAVE);
  if (ruleList) { //如果设置了规则，那么需要校验必填规则，否则，直接返回true，则可以保存；
    var mainDataset = model.mainDataStore.dataSet;
    if (!mainDataset) {
      return true;
    }
    return this.executeBillRules(ruleList, mainDataset);
  }
  return true;
};
```

校验函数如下;包括excuteBillRules和executeRule两个函数；

```javascript
ruleProcess.prototype.executeBillRules = function (ruleList, dataset) {
  var results = true;//默认校验是true;校验不通过返回false；return 终止函数的执行；
  var _this = this;
  //以下包括两层循环，第一层循环是循环ruleList,第二层循环是循环dataObjs
  for (var i = 0; i < ruleList.length; i++) {
    if (ruleList[i].tn.toLowerCase() != dataset.ident.toLowerCase())
      continue;
    if (!dataset) {
      return true;
    }
    //dataset.dataCount()  返回的是dataObjs的length;
    for (var j = 0; j < dataset.dataCount(); j++) {
      //      dataset.getDataObj(j)获取对应的dataObjs中的index某个；
      var ret = this.executeRule(ruleList[i], dataset.getDataObj(j));
      if (!ret) {
        if (ruleList[i].type != REQUIRED_TYPE) {
          message.alert(this.generateMessage().message);
          return false;
        }

      }
    }
  }
  // 递归
  for (var k = 0; k < dataset.dataCount(); k++) {
    var dObj = dataset.dataObjs[k];
    for (var m = 0; m < dObj.getSubCount(); m++) {
      //如果递归校验不通过，那么第一次递归的resuts值赋值为false,表示校验不通过；
      if(!_this.executeBillRules(ruleList, dObj.subDataSets[m])){
        results = false;
      }
    }
  }
  return results;
};
//excuteRule接受rule和dataObj
ruleProcess.prototype.executeRule = function (rule, dataObj){ //如果前端没有填写相应的字段，那么该字段的信息不会出现在dataobj对象中，根据这个对象中是否有对应字段和rule中是否有必填字段进行判断，
  //注意excuteResult字段就是必填字段是否填上了的判断；
  var executeResult = true;
  // 查找目标字段所影响的行记录
  var list = [];
  this.findTargetDataObjs(rule.tn, dataObj, list);//这个函数将dataSet中所有表名和rule规则一样的存进list数组；
  //.....
  for (var int = 0; int < list.length; int++) {
    var targetDataObj = list[int];//targetDataObj中包含前端是否填了对应的单元格；
    var result;
    controldetail = null;
    if (rule.type != FILTER_TYPE) {
      result = this.executeRuleFunction(rule, targetDataObj, "ExcuteError");
    }
    if (result == "ExcuteError") {
      executeResult = false;
      this.messageList.push(languageData.webrule.excuteError + rule.message);
      continue;
    }
    switch (rule.type) {
      case CHECK_TYPE:
        if (!result) {
          if (rule.alertType == WARNING_TYPE) {
            dhtmlx.message({
              type: "error",
              text: 'warning:' + rule.message + ';',//"自动保存成功！"
              expire: 1500
            });
          } else {
            this.messageList.push('error:' + rule.message + ';');
            executeResult = false;
          }
        }
        break;
      case ASSIGNMENT_TYPE:
      case DEFAULTVALUE_TYPE:
        var fieldObj = this.bc.view.findBizModelField(targetDataObj.dataSet.ident, 'id', rule.fid.toUpperCase());
        if (fieldObj && fieldObj.objData && fieldObj.objData.columnType == 'Foreign') {
          var fkTableuuid = fieldObj.objData.fkTableUuid;
          var memberObj = this.getMemberVo(result, rule.fid, fkTableuuid);
          this.bc.setValue(targetDataObj, rule.fid, memberObj);
        } else {
          this.bc.setValue(targetDataObj, rule.fid, result);
        }
        break;
      case READONLY_TYPE:
        this.bc.setReadOnly(targetDataObj, rule.fid, result);
        break;
      case REQUIRED_TYPE:
        //this.bc.setRequired(targetDataObj, rule.fid, result);
        if (result) {
          if (!this.bc.getValue(targetDataObj, rule.fid)) {
            executeResult = false;
            var fieldObj = this.bc.view.findBizModelField(rule.tn, "id", (rule.fid.toUpperCase()));
            var order = 0;
            if (targetDataObj.dataSet.dataObjs.length > 1) {
              for (var index = 0; index < targetDataObj.dataSet.dataObjs.length; index++) {
                if (targetDataObj.rowId == targetDataObj.dataSet.dataObjs[index].rowId) {
                  order = index + 1;
                }
              }
            }
            if (targetDataObj.dataSet.dataObjs.length > 1) {
              requiredMsg += (languageData.webrule.notEmpty2.replace("1%", order).replace("2%", rule.tn + '-' + fieldObj.text) + "; \n ");
            } else {
              requiredMsg += (languageData.webrule.notEmpty.replace("%", rule.tn + '-' + fieldObj.text) + "; \n ");
            }

          } else {
            executeResult = true;
          }
        }
        break;
      case FILTER_TYPE:
        this.bc.setValue(targetDataObj, rule.fid, null);
        break;
      case EXECUTE_TYPE:
        break;
      case BACKGROUND_TYPE:
        break;
      case BIZDETAIL_TYPE:
        this.bc.setValue(dataObj, "ISEXCESSIVE", result);
      
        break;
    }
  }
  return executeResult;
};

}
ruleProcess.prototype.findTargetDataObjs = function (tableName, dataObj, list)  ；
//然后进入到model中
model.prototype.getValue = function (dataObj, key) {
  var item = dataObj.data;//这是单据填完之后的结果数据
  key = key ? key.toUpperCase() : "";
  return item && item[key] ? item[key] : "";
};
```

sysField:true 这个字段是设置了必填项的不一样之处，其值为true；

billRelation.js中是一些校验的函数；

dataset数据集

dataset==>dataObjs(数组)==>subDataSets(数组)

```javascript
使得this 中有dhtmlx的装载系统；
//绑定数据装载函数而已，不执行——initObj函数
window.dhx4._enableDataLoading(this, "_initObj", "_xmlToJson", "model", { data: true });
//绑定dhx事件处理函数;使得this中有dhtmlx的事件系统
window.dhx4._eventable(this);
//这两行代码基本上所有的组件都会用到，因为要绑定dhtmlx的事件系统和装载系统
```

```javascript
//以下就是给this绑定dhtmlx的事件体系；
if (typeof(window.dhx4._eventable) == "undefined") {
  window.dhx4._eventable = function (a, c) {
    if (c == "clear") {
      a.detachAllEvents();
      a.dhxevs = null;
      a.attachEvent = null;
      a.detachEvent = null;
      a.checkEvent = null;
      a.callEvent = null;
      a.detachAllEvents = null;
      a = null;
      return
    }
    a.dhxevs = {data: {}};
    a.attachEvent = function (e, h) {
      e = String(e).toLowerCase();
      if (!this.dhxevs.data[e]) {
        this.dhxevs.data[e] = {}
      }
      var g = window.dhx4.newId();
      this.dhxevs.data[e][g] = h;
      return g
    };
    a.detachEvent = function (l) {
      for (var g in this.dhxevs.data) {
        var h = 0;
        for (var e in this.dhxevs.data[g]) {
          if (e == l) {
            this.dhxevs.data[g][e] = null;
            delete this.dhxevs.data[g][e]
          } else {
            h++
          }
        }
        if (h == 0) {
          this.dhxevs.data[g] = null;
          delete this.dhxevs.data[g]
        }
      }
    };
    a.checkEvent = function (e) {
      e = String(e).toLowerCase();
      return (this.dhxevs.data[e] != null)
    };
    a.callEvent = function (g, l) {
      g = String(g).toLowerCase();
      if (this.dhxevs.data[g] == null) {
        return true
      }
      var h = true;
      for (var e in this.dhxevs.data[g]) {
        h = this.dhxevs.data[g][e].apply(this, l) && h
      }
      return h
    };
    a.detachAllEvents = function () {
      for (var g in this.dhxevs.data) {
        for (var e in this.dhxevs.data[g]) {
          this.dhxevs.data[g][e] = null;
          delete this.dhxevs.data[g][e]
        }
        this.dhxevs.data[g] = null;
        delete this.dhxevs.data[g]
      }
    };
    a = null ;//优化内存；
  };
  dhx4._eventable(dhx4)
}
```

这里面准备每一行的属性值，dhtmlxBillExt.js

_cellType: "comboExt"  "masterData" 

```javascript
dhtmlXGridObject.prototype._prepareRow = function (new_id) {
  if (!this._master_row)
    this._build_master_row();

  //cloneNode不能复制节点属性
  var r = this._master_row.cloneNode(true);
  //增加行存在列合并，需要拷贝_childIndexes
  if (this._master_row._childIndexes) r._childIndexes = this._master_row._childIndexes;
  for (var i = 0; i < r.childNodes.length; i++) {
    //序号复制
    r.childNodes[i]._cellIndex = this._master_row.childNodes[i]._cellIndex || i;
    //撤销对属性的清除
    if (!r.childNodes[i]._attrs) {
      r.childNodes[i]._attrs = {};
    }
    //expend 属性赋值 by LiLiang
    if (this._master_row.childNodes[i]._attrs)
      r.childNodes[i]._attrs = dhx.copy(this._master_row.childNodes[i]._attrs);
    //expend combo cell dhtmlxCombo 对象拷贝
    if (this._master_row.childNodes[i]._brval)
      r.childNodes[i]._brval = this._master_row.childNodes[i]._brval;
    //只读拷贝
    if (this._master_row.childNodes[i]._disabled)
      r.childNodes[i]._disabled = this._master_row.childNodes[i]._disabled;
    r.childNodes[i]._cellType = this._master_row.childNodes[i]._cellType;
    //复制 combo _combo属性
    if (this._master_row.childNodes[i]._combo)
      r.childNodes[i]._combo = this._master_row.childNodes[i]._combo;
    if (this._enbCid) r.childNodes[i].id = "c_" + new_id + "_" + i;
    if (this.dragAndDropOff)
      this.dragger.addDraggableItem(r.childNodes[i], this);
  }
  r.idd = new_id;
  r.grid = this;

  return r;
};
```

