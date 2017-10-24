---
title: box-sizing  
date: 2016-01-18 
categories: css
comments : true 
updated : 
layout : 
---

怪异盒模型:box-sizing

box-sizing:content-box  ||  border-box ;

* content-box： padding和border不被包含在定义的width和height之内。对象的实际宽度等于设置的width值和border、padding之和，即 ( Element width = width + border + padding ) 

此属性表现为标准模式下的盒模型。 

* border-box： padding和border被包含在定义的width和height之内。对象的实际宽度就等于设置的width值，即使定义有border和padding也不会改变对象的实际宽度，即 ( Element width = width ) 

浏览器对盒模型的解释是IE6之前的版本下相同，此时内容的宽高可以由定义的 width height 减去相应方向上的padding和border;
此属性表现为怪异模式下的盒模型。 





