/* global describe test expect */
const {
  Rule
} = require('..')

describe('PTGG', () => {
  test('apply rules', () => {
    const rules = [
      Rule(0.5, 'I', (dur) => [{ symbol: 'I', param: dur }])
    ]
  })
})
