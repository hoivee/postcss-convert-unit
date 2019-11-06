module.exports = {
  convertConfig: [
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'rem'
      },
      declConvertRules: [
        {
          value: value => value / 10
        }
      ]
    },
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'px',
        afterDeclComment: 'no'
      },
      declConvertRules: [
        {
          value: value => value
        }
      ]
    },
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'px',
        afterDeclComment: 'px'
      },
      declConvertRules: [
        {
          withNewSelector: selector => `[data-px-2]${selector}`,
          value: value => value * 2
        },
        {
          withNewSelector: selector => `[data-px-10]${selector}`,
          value: value => value * 10
        }
      ]
    },
    {
      declMatcher: {
        sourceUnit: 'px',
        targetUnit: 'px',
        afterDeclComment: 'dpr'
      },
      declConvertRules: [
        {
          withNewSelector: selector => `[data-dpr-1]${selector}`,
          value: value => value * 1
        },
        {
          withNewSelector: selector => `[data-dpr-2]${selector}`,
          value: value => value * 2
        },
        {
          withNewSelector: selector => `[data-dpr-3]${selector}`,
          value: value => value * 3
        }
      ]
    }
  ]
}
