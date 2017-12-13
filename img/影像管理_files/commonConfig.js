/**
 * 创建人：杨玉峰
 * 创建时间： 2017/12/6
 * 描述：通用js、css配置管理
 */
seajs.config({
    vars: {
        "commonVersion": "v1.1",
        "commonJs": ".js",
        "commonCss": ".css"
    },
    alias: {
        //------------------------------------- dhtmlx -----------------------------------------
        'dhtmlxJs': 'dhtmlx/codebase/dhtmlx.js?{commonVersion}',
        "dhtmlxDeprecated": "dhtmlx/codebase/dhtmlx_deprecated{commonJs}?{commonVersion}",
        "dhtmlxCss": "dhtmlx/skins/bdp/dhtmlx.css?{commonVersion}",
        //--------------------------------- common ------------------------------------
        "commomCss": "common{commonCss}?{commonVersion}", // 公共样式
        "json2": "common/json2{commonJs}?{commonVersion}",//json对象和字符串对象之间的相互转换
        "i18next": "i18next/i18next-1.11.0{commonJs}?{commonVersion}",
        "normalize": "normalize{commonCss}?{commonVersion}",//通用屏蔽浏览器兼容问题css
        "maskJs": "common/mask{commonJs}?{commonVersion}",// 蒙版
        "ajax": "common/ajax{commonJs}?{commonVersion}",//ajax操作的封装
        "message": "common/message{commonJs}?{commonVersion}",//页面弹出信息提示框
//      "dialog": "./../common/dialog{commonJs}?{commonVersion}",//打开或者关闭窗体
        "uuid": "common/uuid{commonJs}?{commonVersion}",//生成uuid
       
    }
});