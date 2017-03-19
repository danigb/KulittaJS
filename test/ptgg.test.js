/* global describe test expect */
const {
  newRule, update, gen
} = require('..')

const NT = (type, dur) => ({ type: 'NT', symbol: type, param: dur })
const loop = (arr) => {
  let i = 0
  return () => arr[i++ % arr.length]
}

describe('PTGG', () => {
  test('update a sentence', () => {
    const rules = [
      newRule('I', 0.5, (dur) => [ NT('I', 0.75 * dur), NT('V', 0.25 * dur) ]),
      newRule('I', 0.5, (dur) => [ NT('I', 0.5 * dur), NT('I', 0.5 * dur) ])
    ]
    const fakeRnd = loop([0.1, 0.6])
    const initial = [NT('I', 8)]
    const iter1 = update(rules, fakeRnd, initial)
    expect(iter1).toEqual([ NT('I', 6), NT('V', 2) ])
    const iter2 = update(rules, fakeRnd, iter1)
    expect(iter2).toEqual([ NT('I', 3), NT('I', 3), NT('V', 2) ])
  })
  test('generate', () => {
    const h = 1 / 2
    const t = 1 / 3
    const rules = [
      newRule('I', 0.5, (d) => [ NT('I', h * d), NT('I', h * d) ]),
      newRule('I', 0.5, (d) => [ NT('I', t * d), NT('I', t * d), NT('I', t * d) ])
    ]
    const fakeRnd = loop([0.1, 0.6])
    const initial = [NT('I', 720)]
    const result = gen(rules, fakeRnd, 3, initial)
    expect(result.map((nt) => nt.param).join()).toBe('40,40,40,60,60,40,40,40,90,90,60,60,60')
  })
})
