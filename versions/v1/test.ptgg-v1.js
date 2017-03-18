/* global describe test expect */
var { i, ii, updater, Rule, Seq } = require('..')

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
    expect(Seq([ i(1), ii(2) ])).toEqual({
      type: 'Seq',
      terms: [
        { type: 'NT', chord: { cType: 'I', dur: 1 } },
        { type: 'NT', chord: { cType: 'II', dur: 2 } }
      ]
    })
  })

  test('Update a term', () => {
    const update = updater([
      Rule('I', 1, (d) => Seq([i(d / 2), ii(d / 2)]))
    ])
    const initial = i(8)
    const iter1 = update(initial)
    expect(iter1).toEqual(Seq([ i(4), ii(4) ]))
    const iter2 = update(iter1)
    expect(iter2).toEqual(Seq([ Seq([ i(2), ii(2) ]), ii(4) ]))
  })
})
