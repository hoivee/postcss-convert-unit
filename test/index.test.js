const fs = require('fs')
const glob = require('glob')
const postcss = require('postcss')
const plugin = require('../index')

function getOutputCss (input, options) {
  return postcss([plugin(options)]).process(input, { from: undefined })
}

function run ({
  title = '',
  options = {},
  cssInput = '',
  cssExpect = ''
}) {
  test(title, async () => {
    const result = await getOutputCss(cssInput, options)
    try {
      expect(result.css).toBe(cssExpect)
    } catch (e) {
      fs.writeFileSync(`./${title}-output.css`, result.css)
      fs.writeFileSync(`./${title}-input.css`, cssInput)
      fs.writeFileSync(`./${title}-expect.css`, cssExpect)
      throw e
    }
  })
}

function getTestItemList () {
  const testItemList = []
  const testItemPathList = glob.sync('./test/*/')
  testItemPathList.forEach((testItemPath) => {
    const options = require(`${testItemPath.replace('/test', '')}options`)
    const testItem = {
      title: testItemPath.split('/')[2],
      options,
      cssInput: fs.readFileSync(`${testItemPath}input.css`, 'utf8'),
      cssExpect: fs.readFileSync(`${testItemPath}expect.css`, 'utf8')
    }
    testItemList.push(testItem)
  })
  return testItemList
}

const testItemList = getTestItemList()

testItemList.forEach((testItem) => {
  run(testItem)
})
