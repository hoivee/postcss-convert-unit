module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem'
      },
      declConvertRules: [
        {
          // @keyframes 不会生成新的选择器
          withNewSelector: /* istanbul ignore next */ selector => `[test]${selector}`,
          value: value => value
        }
      ]
    }
  ]
}
