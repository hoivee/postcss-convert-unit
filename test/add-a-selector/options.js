module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem'
      },
      declConvertRules: [
        {
          value: value => value * 2,
          withNewSelector: selector => `[data-test]${selector}`
        }
      ]
    }
  ]
}
