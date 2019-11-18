# postcss-convert-unit

[![npm](https://img.shields.io/npm/v/postcss-convert-unit)](https://www.npmjs.com/package/postcss-convert-unit)
[![Actions Status](https://github.com/hoivee/postcss-convert-unit/workflows/build/badge.svg)](https://github.com/hoivee/postcss-convert-unit)
[![coverage](https://img.shields.io/coveralls/github/hoivee/postcss-convert-unit)](https://coveralls.io/github/hoivee/postcss-convert-unit)
[![license](https://img.shields.io/github/license/hoivee/postcss-convert-unit)](https://github.com/hoivee/postcss-convert-unit/blob/master/LICENSE)

对 css 中的值与单位通过自定义转换规则进行转换。能为转换后的属性生成新的选择器。

## Install

```npm
npm install postcss-convert-unit --save-dev
```

## Usage

#### 简单示例

---

postcss 配置：

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-convert-units": {
      convertConfig: [
        {
          declMatcher: {
            sourceUnit: 'px',
            targetUnit: 'rem'
          },
          declConvertRules: [{
            value: value => value
          }]
        }
      ]
    }
  }
};
```

input:

```css
.div {
  padding: 20px 0 10px 5em;
}
```

output:

```css
.div {
  padding: 20rem 0 10rem 5em;
}
```

#### px2rem

---
postcss配置：

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-convert-units": {
      convertConfig: [
        {
          declMatcher: {
            sourceUnit: 'px',
            targetUnit: 'rem'
          },
          declConvertRules: [
            {
              value: value => value / 75
            }
          ]
        },
        {
          declMatcher: {
            sourceUnit: 'px',
            targetUnit: 'px',
            afterDeclComment: 'px'
          },
          removeMatchDecl: true,
          declConvertRules: [
            {
              withNewSelector: selector => `[data-dpr="1"] ${selector}`,
              value: value => value / 2
            },
            {
              withNewSelector: selector => `[data-dpr="2"] ${selector}`,
              value: value => value
            },
            {
              withNewSelector: selector => `[data-dpr="3"] ${selector}`,
              value: value => value / 2 * 3
            }
          ]
        }
      ]
    }
  }
};
```

input:

```css
.selector {
  height: 64px; /*px*/
  font-size: 28px; /*px*/
  border: 1px solid #ddd; /*no*/
  width: 150px;
}

```

output:

```css
.selector {
  border: 1px solid #ddd; /*no*/
  width: 2rem;
}
[data-dpr="1"] .selector {
  height: 32px;
  font-size: 14px;
}
[data-dpr="2"] .selector {
  height: 64px;
  font-size: 28px;
}
[data-dpr="3"] .selector {
  height: 96px;
  font-size: 42px;
}

```

### Options
```javascript
{
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem',
        afterDeclComment: 'rem'
      },
      precision: 5,
      removeMatchDecl: false,
      declConvertRules: [
        {
          value: value => value,
          withNewSelector: selector => selector
        }
      ]
    }
  ]
}
```

| 选项 | 说明 | 类型 | 默认值 | 必填 |
| :---:| :---: | :---: | :---: | :---: |
| convertConfig | 插件配置项 | convertItem[] | [] | 是|

- convertItem


| 选项 | 说明 | 类型 | 默认值 | 必填 |
| :---:| :---: | :---: | :---: | :---: |
| declMatcher | 匹配要转换的属性声明 | string | - | 是 |
| declConvertRules | 转换规则项 | convertRule[] | - | 是 |
| precision | 单位值的精度 | number | 5 | 否 |

- declMatcher

| 选项 | 说明 | 类型 | 默认值 | 必填 |
| :---:| :---: | :---: | :---: | :---: |
| sourceUnit | 被转换单位 | string | - | 是 |
| targetUnit | 转换后的单位 | string | - | 是 |
| afterDeclComment | 属性定义后跟的注释文本 | string | - | 否 |

- convertRule

**注意：** 如果配置 ```withNewSelector``` 将生产新的选择器；如果未配置
```withNewSelector``` 将在源定义处进行单位转换。 对 @keyframes ，将直接在源定义处进行单位转换，如果配置了多个```convertRule```，最后配置的才会生效，因为后配置的会覆盖先配置的。

| 选项 | 说明 | 类型 | 默认值 | 必填 |
| :---:| :---: | :---: | :--- | :---: |
| value | 匹配项值的转换规则 | function(value)，```value``` 为匹配到的值，需要实现值的转换规则，并返回转换后的值 | - | 是 |
| withNewSelector | 匹配项选择器的转换规则 | function(selector)， ```selector```为匹配到的选择器，需要实现转换规则，并返回转换后的选择器。| - | 否 |
