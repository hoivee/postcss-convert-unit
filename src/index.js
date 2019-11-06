const postcss = require('postcss')

class PostcssConvertUnits {
  constructor (convertConfig) {
    this.regNameKeyframes = /keyframes/
    this.convertFuncList = PostcssConvertUnits.getConvertFuncList(convertConfig)
  }

  static generateConvertUnitFunc ({
    declMatcher: {
      sourceUnit,
      targetUnit,
      afterDeclComment
    },
    precision = 5,
    removeMatchDecl = false,
    declConvertRules
  }) {
    const regSourceUnit = new RegExp(`\\b(\\d+(\\.\\d+)?)${sourceUnit}\\b`, 'g')
    let regUnitPrecision
    if (typeof precision === 'number') {
      regUnitPrecision = new RegExp(`\\d*.\\d{${precision}}`)
    }
    return function processDeclaration (ruleParent, rule, declaration) {
      if (declaration._newDeclaration) {
        return false
      }
      const isMatched = regSourceUnit.test(declaration.value)
      regSourceUnit.lastIndex = 0 // reset lastIndex
      if (!isMatched) {
        return false
      }

      let isNeedConvertUnit = false // 标记是否需要转换单位

      // 根据匹配注释判断是否需要转换单位逻辑
      const next = declaration.next()

      if (!afterDeclComment) {
        isNeedConvertUnit = next === undefined ? true : next.type !== 'comment'
      } else {
        isNeedConvertUnit = next && next.type === 'comment' && next.text === afterDeclComment.trim()
      }

      if (!isNeedConvertUnit) {
        return false
      }

      const selector = rule.selector || ''
      const selectors = selector.split(',')
      const originalValue = declaration.value

      declConvertRules.forEach((item) => {
        if (declaration._newDeclaration) {
          return false
        }
        const generateValue = item.value
        const generateSelector = item.withNewSelector

        const targetValue = originalValue.replace(regSourceUnit, (match, $1) => {
          let value = generateValue(Number($1))
          if (regUnitPrecision && regUnitPrecision.test(value)) {
            value = Number(value).toFixed(precision)
          }
          return value + targetUnit
        })

        if (generateSelector && rule.type !== 'atrule') {
          const newDeclaration = declaration.clone()
          newDeclaration.value = targetValue
          const newSelector = selectors
            .map((s) => {
              let wrap = ''
              let string = s
              while (string[0] === '\n') {
                string = string.slice(1)
                wrap += '\n'
              }
              while (string[0] === ' ') {
                string = string.slice(1)
                wrap += ' '
              }
              return wrap + generateSelector(string)
            })
            .join(',')
          if (!rule.newRuleContainer) {
            rule.newRuleContainer = {}
          }
          if (!rule.newRuleContainer[newSelector]) {
            rule.newRuleContainer[newSelector] = postcss.rule({
              selector: newSelector
            })
          }
          const newRule = rule.newRuleContainer[newSelector]
          newRule.append(newDeclaration)
          newRule._base = rule

          let insertAfterRule = rule
          do {
            const nextRule = insertAfterRule.next()
            if (nextRule && nextRule._base === rule) {
              insertAfterRule = nextRule
            } else {
              break
            }
          } while (insertAfterRule._base === rule)
          if (!newRule._isInsert) {
            ruleParent.insertAfter(insertAfterRule, newRule)
            newRule._isInsert = true
          }
          newDeclaration._newDeclaration = true
        } else {
          declaration.value = targetValue
        }
      })
      if (removeMatchDecl) {
        declaration.remove()
      }
      if (afterDeclComment && removeMatchDecl) {
        next.remove()
      }
      return isNeedConvertUnit
    }
  }

  static getConvertFuncList (convertConfig) {
    const funcList = []

    convertConfig.forEach((item) => {
      funcList.push(PostcssConvertUnits.generateConvertUnitFunc(item))
    })

    return funcList
  }

  // 处理rule里的Decl
  processDecls (ruleParent, rule) {
    rule.walkDecls((decl) => {
      this.convertFuncList.forEach((transFun) => {
        transFun(ruleParent, rule, decl)
      })
    })
  }

  processRule (ruleParent, rule) {
    switch (rule.type) {
      case 'atrule':
        if (rule.name.match(this.regNameKeyframes)) {
          this.processDecls(ruleParent, rule)
        } else {
          rule.each((subRule) => {
            this.processRule(rule, subRule)
          })
        }
        break
      case 'rule':
        this.processDecls(ruleParent, rule)
        break
      default:
    }
  }

  getResult (root) {
    root.each((rule) => {
      this.processRule(root, rule)
    })
  }
}

module.exports = postcss.plugin('postcss-convert-units', (options) => {
  const { convertConfig } = options
  const postcssConvertUnits = new PostcssConvertUnits(convertConfig)
  return function processCssUnitsConvert (root, result) {
    postcssConvertUnits.getResult(root)
    result.root = root
  }
})
