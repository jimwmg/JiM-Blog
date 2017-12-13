seajs.config({
    vars: {
        "commonVersion": "v1.1",
        "commonJs": ".js",
        "commonCss": ".css"
    },
    alias: {
        'imageEditingJs': './js/imageEditing.js?{commonVersion}',
        'imageEditingCss': './css/imageEditing.css?{commonVersion}',
        'treeJS':'../tree/js/tree.js?{commonVersion}'
    }
});