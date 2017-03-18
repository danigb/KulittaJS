/* global describe test expect */
var { i, ii } = require('..')

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
})
