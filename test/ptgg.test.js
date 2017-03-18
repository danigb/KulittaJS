/* global describe test expect */
const {
  Rule
} = require('..')

describe('PTGG', () => {
  test('Create a Rule', () => {
    expect(Rule(0.5, 'I', (dur) => [{ symbol: 'I', param: dur }])).toEqual()
  })
})
