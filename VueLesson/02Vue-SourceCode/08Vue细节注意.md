---
title:  Vue细节注意
date: 2017-12-21 
categories: vue
---

* DOM挂载完毕之后，执行mounted函数，如果要在DOM上挂载事件，注意其中的this指向

```html
<div id="box">
  <div id='dv'>test</div>
  <div id='dv1'>test1</div>
</div>

<script>
  var vm = new Vue({
    el: '#box',
    data: {
      bSign: true
    },
    components:{
      'aaa':Aaa
    },
    mounted(){
      document.getElementById('dv').onclick = function(){
        console.log(this);//div元素
      }
      document.getElementById('dv1').onclick = ()=>{
        console.log(this);//vm实例对象
      }
    },

  });

</script>

```

