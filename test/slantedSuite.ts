import { slanted } from '../index'

describe('Function slanted', function () {
  this.timeout(60000)

  it('Should generate Slate HTML', async () => {
    await slanted({
      filepath: './test/test.md',
      includes: './test/includes',
      output: '.slanted/test/'
    })
  })

  it('Should generate Slate HTML', async () => {
    await slanted({
      filepath: './test/test.md',
      includes: './test/includes',
      inline: true,
      output: '.slanted/test2/'
    })
  })
})
