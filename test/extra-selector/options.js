module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem'
      },
      declConvertRules: [{
        value: value => value,
        withNewSelector: selector => selector
      }]
    }
  ]
}
