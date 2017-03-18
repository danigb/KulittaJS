/* global describe test expect */
var { i, ii, applyRule, Rule, Seq } = require('..')

describe('PTGG', () => {
  test('Create non-terminal chords', () => {
    expect(i(0.5)).toEqual({
      type: 'NT',
      chord: { cType: 'I', dur: 0.5 }
    })
    expect(ii(1.7)).toEqual({
      type: 'NT',
      chord: { cType: 'II', dur: 1.7 }
    })
  })

  test('Create sequences', () => {
    expect(Seq(i(1), ii(2))).toEqual({
      type: 'Seq',
      terms: [
        { type: 'NT', chord: { cType: 'I', dur: 1 } },
        { type: 'NT', chord: { cType: 'II', dur: 2 } }
      ]
    })
  })

  test('Apply rule', () => {
    const rules = [ Rule('I', 1, (d) => Seq(i(d / 2), ii(d / 2))) ]
    const term = applyRule(rules, { cType: 'I', dur: 10 }, () => 1)
    expect(term).toEqual(Seq(i(5), ii(5)))
  })
})
