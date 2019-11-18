module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem'
      },
      declConvertRules: [
        {
          /* istanbul ignore next */
          withNewSelector: selector => `[test]${selector}`, // @keyframes 不会生成新的选择器
          value: value => value
        }
      ]
    }
  ]
}
