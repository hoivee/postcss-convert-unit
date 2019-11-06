module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'rem',
        targetUnit: 'px'
      },
      declConvertRules: [{
        value: value => value * 16
      }]
    },
    {
      declMatcher: {
        sourceUnit: 'em',
        targetUnit: 'px'
      },
      declConvertRules: [{
        value: value => value * 16
      }]
    }
  ]
}
