/* global describe test expect */
const {
  newRule, update
} = require('..')

const chord = (type, dur) => ({ type: 'NT', symbol: type, param: dur })
const sequential = (arr) => () => arr.shift()

describe('PTGG', () => {
  test('update a sentence', () => {
    const rules = [
      newRule(0.5, 'I', (dur) => [ chord('I', 0.75 * dur), chord('V', 0.25 * dur) ]),
      newRule(0.5, 'I', (dur) => [ chord('I', 0.5 * dur), chord('I', 0.5 * dur) ])
    ]
    const fakeRnd = sequential([0.1, 0.6])
    const initial = [{ type: 'NT', symbol: 'I', param: 8 }]
    const iter1 = update(rules, fakeRnd, initial)
    expect(iter1).toEqual([ chord('I', 6), chord('V', 2) ])
    const iter2 = update(rules, fakeRnd, iter1)
    expect(iter2).toEqual([ chord('I', 3), chord('I', 3), chord('V', 2) ])
  })
})
