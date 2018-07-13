---
title:Css Animation
---

###1 transition实现 

```css
.rightSlide{
    background-color: #F6F7FB;
    border-left:@border;
    transition:width .3s ease-in
}
.rightSlideActive{
    width:300px;
}
.rightSlideUnActive {
    width:50px;
}
```

```html
<div class="rightSlide rightSlideActive" id='el'>
    
</div>
<button id='btn'>
    
</button>
```

```javascript
document.getElementById('btn').onclick = function(){
    document.getElementById('el').className = 'rightSlide rightSlideUnActive'
}
```

