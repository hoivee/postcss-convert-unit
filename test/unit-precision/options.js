module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem'
      },
      precision: 9,
      declConvertRules: [
        {
          value: value => value / 3 * 2
        }
      ]
    }
  ]
}
