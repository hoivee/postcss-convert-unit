# postcss-convert-unit

[![npm](https://img.shields.io/npm/v/postcss-convert-unit)](https://www.npmjs.com/package/postcss-convert-unit)
[![Actions Status](https://github.com/hoivee/postcss-convert-unit/workflows/build/badge.svg)](https://github.com/hoivee/postcss-convert-unit)
[![coverage](https://img.shields.io/coveralls/github/hoivee/postcss-convert-unit)](https://coveralls.io/github/hoivee/postcss-convert-unit)
[![license](https://img.shields.io/github/license/hoivee/postcss-convert-unit)](https://github.com/hoivee/postcss-convert-unit/blob/master/LICENSE)


[中文](https://github.com/hoivee/postcss-convert-unit/blob/master/README.zh.md)

Convert values and units in css through custom conversion rules. A new selector can be generated for the converted property.

## Install

```npm
npm install postcss-convert-unit --save-dev
```

## Usage

#### simple

---

postcss config：

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
postcss config：

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

## Options
```javascript
// example
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

| Attribute | Description | Type | Default | Required |
| :---:| :---: | :---: | :---: | :---: |
| convertConfig | convert config list | convertItem[] | [] | yes|
- convertItem

| Attribute | Description | Type | Default | Required |
| :---:| :---: | :---: | :---: | :---: |
| declMatcher | match declaration | string | - | yes |
| declConvertRules | declaration convert rules | convertRule[] | - | yes |
| precision | value precision | number | 5 | no |

- declMatcher

| Attribute | Description | Type | Default | Required |
| :---:| :---: | :---: | :---: | :---: |
| sourceUnit | source unit | string | - | yes |
| targetUnit | target unit | string | - | yes |
| afterDeclComment | comment after declaration | string | - | no |

- convertRule

**notice：** If set ```withNewSelector```, a new selector will be generated for the converted declaration；if not set ```withNewSelector```, values and units will converted in origin declaration。 for @keyframes ，it will converted in origin declaration。If multiple ```convertRules``` are configured，the last configuration will take effect, because the post configuration will override the first configuration.。

| Attribute | Description | Type | Default | Required |
| :---:| :---: | :---: | :--- | :---: |
| value | value convert rule | function(value)，```value``` is matched value，you need implement convert rule，and return converted value| - | yes |
| withNewSelector | new selector generated rule  | function(selector)， ```selector```is matched selector，you need implement convert rule，and return new selector| - | no |
