module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem'
      },
      declConvertRules: [
        {
          value: value => value / 75
        }
      ]
    },
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'px',
        afterDeclComment: 'px'
      },
      removeMatchDecl: true,
      declConvertRules: [
        {
          withNewSelector: selector => `[data-dpr="1"] ${selector}`,
          value: value => value / 2
        },
        {
          withNewSelector: selector => `[data-dpr="2"] ${selector}`,
          value: value => value
        },
        {
          withNewSelector: selector => `[data-dpr="3"] ${selector}`,
          value: value => value / 2 * 3
        }
      ]
    }
  ]
}
