module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem'
      },
      declConvertRules: [
        {
          withNewSelector: selector => selector,
          value: value => value
        },
        {
          value: value => value * 2,
          withNewSelector: selector => `[data-test]${selector}`
        }
      ]
    }
  ]
}
