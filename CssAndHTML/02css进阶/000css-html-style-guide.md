---
title: CSS-HTML-style-guide
---

### 1 HTML篇

#### 1.1 命名

* `class` 必须单词全字母小写，单词间以 `-` 分隔。
* `class` 必须代表相应模块或部件的内容或功能，不得以样式信息进行命名。
* 元素 `id` 必须保证页面唯一。

#### 1.2 标签

* 标签名必须使用小写字母。
* 对于无需自闭合的标签，不允许自闭合。常见无需自闭合标签有 `input`、`br`、`img`、`hr` 等。
* 标签使用必须符合标签嵌套规则。
* 标签的使用应尽量简洁，减少不必要的标签。

#### 1.3 属性

* 属性名必须使用小写字母。
* 属性值必须用双引号包围。
* 自定义属性建议以 `xxx-` 为前缀，推荐使用 `data-`。
* 布尔类型的属性，建议不添加属性值。

#### 1.4 通用

* 在 `html` 标签上设置正确的 `lang` 属性。有助于提高页面的可访问性，如：让语音合成工具确定其所应该采用的发音，令翻译工具确定其翻译语言等。
* 页面必须使用精简形式，明确指定字符编码。指定字符编码的 `meta` 必须是 `head` 的第一个直接子元素。
* 页面必须包含title元素，`title` 必须作为 `head` 的直接子元素，并紧随 `charset` 声明之后。
* 禁止 `img` 的 `src` 取值为空。延迟加载的图片也要增加默认的 `src`。
*  避免为 `img` 添加不必要的 `title` 属性。为重要图片添加 `alt` 属性。
* 添加 `width` 和 `height` 属性，以避免页面抖动。
* 有下载需求的图片采用 `img` 标签实现，无下载需求的图片采用 CSS 背景图实现。

### 2 CSS 篇

#### 2.1 选择器

* 当一个 rule 包含多个 selector 时，每个选择器声明必须独占一行。

```css
/* good */
.post,
.page,
.comment {
    line-height: 1.5;
}

/* bad */
.post, .page, .comment {
    line-height: 1.5;
}
```

* [强制] `>`、`+`、`~` 选择器的两边各保留一个空格。

```css
/* good */
main > nav {
    padding: 10px;
}

label + input {
    margin-left: 5px;
}

input:checked ~ button {
    background-color: #69C;
}

/* bad */
main>nav {
    padding: 10px;
}

label+input {
    margin-left: 5px;
}

input:checked~button {
    background-color: #69C;
}
```

* 属性选择器中的值必须用双引号包围。

```css
/* good */
article[character="juliet"] {
    voice-family: "Vivien Leigh", victoria, female
}

/* bad */
article[character='juliet'] {
    voice-family: "Vivien Leigh", victoria, female
}
```

#### 2.2 属性

* 属性书写顺序

同一 rule set 下的属性在书写时，应按功能进行分组，并以 **Formatting Model（布局方式、位置） > Box Model（尺寸） > Typographic（文本相关） > Visual（视觉效果）** 的顺序书写，以提高代码的可读性。

1. Formatting Model 相关属性包括：`position` / `top` / `right` / `bottom` / `left` / `float` / `display` / `overflow`
2. Box Model 相关属性包括：`border` / `margin` / `padding` / `width` / `height` 等
3. Typographic 相关属性包括：`font` / `line-height` / `text-align` / `word-wrap` 等
4. Visual 相关属性包括：`background` / `color` / `transition` / `list-style` 等

```css
.sidebar {
    /* formatting model: positioning schemes / offsets / z-indexes / display / ...  */
    position: absolute;
    top: 50px;
    left: 0;
    overflow-x: hidden;

    /* box model: sizes / margins / paddings / borders / ...  */
    width: 200px;
    padding: 5px;
    border: 1px solid #ddd;

    /* typographic: font / aligns / text styles / ... */
    font-size: 14px;
    line-height: 20px;

    /* visual: colors / shadows / gradients / ... */
    background: #f5f5f5;
    color: #333;
    -webkit-transition: color 1s;
       -moz-transition: color 1s;
            transition: color 1s;
}
```





 