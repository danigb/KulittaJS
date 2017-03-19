// # Musical Grammar
// [Original source code](https://github.com/donya/Kulitta/blob/master/Kulitta/Grammars/MusicGrammars.lhs)
// by Donya Quick
/* @flow */

// ## Type synonyms & constants

// Duration is represented with a float (in relative units)
type Dur = number

// Abstract pitch represented as a number (midi note number)
type AbsPitch = number

// Some duration definitions
export const wn : Dur = 1
export const hn : Dur = 1/2
export const qn : Dur = 1/4
export const en : Dur = 1/8
export const sn : Dur = 1/16
export const tn : Dur = 1/32

// ## Alphabets for base symbols

// Alphabet 1: Roman numeral for abstract chords
type CType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'X'

// ## Alphabets for parameters

// Many finite base symbol alphabets can use the same potentially infinite alphabet of parameter symbols. Here we define a general "music parameter" or MP for many tonal applications. It will store the current duration of a symbol, and the symbol's tonal context as a mode and scale root.
// Finally, there is allowance for keeping track of the onset of the symbol as well as the total duration of the sentence to which it belongs. This allows for checking things like whether the symbols is the LAST in a sentence, at the midpoint, etc.

// The "Music Parameter" definition
type MP = { dur: Dur, mode: Mode, key: number, onset: Dur, seqDur: Dur }

// _Modes_ include the seven usual derivatives of the C-major scale along with chromatic and custom options. Note that Major=Ionian and Minor=Aeoloean.
type Mode = 'Major' | 'Dorian' | 'Phrygian' | 'Lydian' | 'Mixolydian'
  | 'Minor' | 'Locrian' | 'Chromatic' | 'Custom'

// TODO: Find a method to add a scale to Custom mode ['Custom', Array<AbsPitch>]

// A default MP value is one measure long (in 4/4) in the key of C-major.
export const defaultMP : MP = { dur: 1, mode: 'Major', key: 0, onset: 0, seqDur: 1 }

// It is also useful to have tests for MP values and modifiers for them.
export const isMaj = (param: MP) : boolean => param.mode === 'Major'
export const isMin = (param: MP) : boolean => param.mode === 'Minor'

// ## Modifiers

// Modifier is a function to perform music parameter updtes
type Modifier = (param: MP) => MP

// Modifiers on duration can be used to succinctly write transformations.
// For example, to halve the duration of a parameter `param: MP`, one need only
// write `h(param)`
const durFactor = (factor: number) : Modifier => (param: MP) : MP =>
  Object.assign({}, param, { dur: param.dur * factor })

export const h = durFactor(0.5)
export const q = durFactor(0.25)
export const e = durFactor(0.125)

// Similarly, we have some shorthands for adjusting the onsets and
// durations at the same time. NOTE: offsets should be changed
// before the duration is changed.
const onsetOffsetFactor = (factor: number) : Modifier => (param: MP) : MP =>
  Object.assign({}, param, { onset: param.onset + param.dur * factor })

export const q2 = onsetOffsetFactor(1/4)
export const q3 = onsetOffsetFactor(2/4)
export const q4 = onsetOffsetFactor(3/4)

// We can also do shorthands that do both things.
const compose = (a : Modifier, b: Modifier) : Modifier => (p: MP) : MP => a(b(p))
export const ho = compose(h, q3)
export const qo2 = compose(q, q2)
export const qo3 = compose(q, q3)
export const qo4 = compose(q, q4)

// ## Rules

import type { Rule, Sentence, NT } from './ptgg'
import { newRule, newNT } from './ptgg'

// The following alter Rules to do a duration test. Each has a
// "rejection condition" that will be the condition for an ID rule.

// The rejection condition in this case tests the left-hand-side
// symbol's duration.

export function toRelDuration (isValidDur: (dur: Dur) => boolean, rule: Rule<CType, MP>) : Rule<CType, MP> {
  const { prob, symbol, fn } = rule
  return newRule(symbol, prob, (param: MP) => fn(param))
}

// TODO: complete this section

// # Mode/key changes

const Major = 'Major'
const Minor = 'Minor'
const majModes = [Major, Minor, Minor, Major, Major, Minor, Minor]
const minModes = [Minor, Minor, Major, Minor, Minor, Major, Major]

const Scales = {
  Major: [0,2,4,5,7,9,11],
  Minor: [0,2,3,5,7,8,10],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  Phrygian: [0, 1, 3, 5, 7, 8, 10],
  Lydian: [0, 2, 4, 6, 7, 9, 11],
  Mixolydian: [0, 2, 4, 5, 7, 9, 10],
  Locrian: [0, 1, 3, 5, 6, 8, 10],
  Chromatic: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  Custom: null
}

const getScale = (mode: Mode) : Array<AbsPitch> => {
  const scale = Scales[mode]
  if (!scale) throw Error('Scale not defined for mode ' + mode)
  return scale
}
const majScale = getScale('Major')
const minScale = getScale('Minor')

const modMajMin = (i: number) => (param: MP) : MP => {
  // clone the param
  const mod = Object.assign({}, param)
  if (param.mode === 'Major') {
    mod.mode = majModes[i]
    mod.key = (param.key + majScale[i]) % 12
  } else {
    mod.mode = minModes[i]
    mod.key = (param.key + minScale[i]) % 12
  }
  return mod
}

// Basic modulations on scale degrees for Major and Minor systems
export const m2 = modMajMin(1)
export const m3 = modMajMin(2)
export const m4 = modMajMin(3)
export const m5 = modMajMin(4)
export const m6 = modMajMin(5)
export const m7 = modMajMin(6)

// # Progression symbols

// P = {piece, P}
// R = {TR, SR, DR} functional region symbols
// K = {Cmaj, Cmin, ...} key symbols
// F = {t, s, d, tp, sp, dp, tcp} functional term symbols
// S = {I, II, ...} scale degree chord representations
// O = {Cmaj, ...} surface chord symbols (e.g. I in K=Cmaj)

export type RTerm = 'Piece' | 'P' | 'TR' | 'DR' | 'SR' | 'T' | 'D' | 'S' | 'TP' | 'TCP' | 'SP' | 'DP'
  | 'C I' | 'C II' | 'C III' | 'C IV' | 'C V' | 'C VI' | 'C VI'

// ## TSD Grammar base

export const T = (p : MP) : NT<RTerm, MP> => newNT('T', p)
export const S = (p : MP) : NT<RTerm, MP> => newNT('S', p)
export const D = (p : MP) : NT<RTerm, MP> => newNT('D', p)

export const tdsRules : Array<Rule<RTerm, MP>> = [
  newRule('T', 0.25, (p) => [ T(p) ]),
  newRule('T', 0.25, (p) => [ T(h(p)), T(h(p)) ]),
  newRule('T', 0.25, (p) => [ T(h(p)), D(h(p)) ]),
  newRule('T', 0.25, (p) => [ D(h(p)), T(h(p)) ]),
  newRule('D', 0.33, (p) => [ D(p) ]),
  newRule('D', 0.33, (p) => [ D(h(p)), D(h(p)) ]),
  newRule('D', 0.34, (p) => [ S(h(p)), D(h(p)) ]),
  newRule('S', 0.5, (p) => [ S(p) ]),
  newRule('S', 0.5, (p) => [ S(h(p)), S(h(p)) ])
]
