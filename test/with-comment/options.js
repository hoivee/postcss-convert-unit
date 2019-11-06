module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem',
        afterDeclComment: 'rem'
      },
      declConvertRules: [
        {
          value: value => value,
          withNewSelector: selector => selector
        }
      ]
    }
  ]
}
