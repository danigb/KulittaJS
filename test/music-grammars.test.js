/* global describe test expect */
const {
  defaultMP, isMaj, h, q2, qo4
} = require('..')

describe('Music Grammar', () => {
  test('isMajor', () => {
    expect(isMaj(defaultMP)).toBe(true)
  })
  test('duration modifiers', () => {
    expect(h(defaultMP)).toEqual({
      'dur': 0.5, 'key': 0, 'mode': 'Major', 'onset': 0, 'seqDur': 1
    })
  })
  test('onset modifiers', () => {
    expect(q2(defaultMP)).toEqual({
      'dur': 1, 'key': 0, 'mode': 'Major', 'onset': 0.25, 'seqDur': 1
    })
  })
  test('duration and offset modifiers', () => {
    expect(qo4(defaultMP)).toEqual({
      'dur': 0.25, 'key': 0, 'mode': 'Major', 'onset': 0.75, 'seqDur': 1
    })
  })
})
