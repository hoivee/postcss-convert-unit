module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem'
      },
      declConvertRules: [
        {
          withNewSelector: selector => `[test]${selector}`,
          value: value => value
        }
      ]
    }
  ]
}
