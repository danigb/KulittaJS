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
  | 'Minor' | 'Locrian' | 'Chormatic' | ['Custom', Array<AbsPitch>]

// A default MP value is one measure long (in 4/4) in the key of C-major.
export const defaultMP : MP = { dur: 1, mode: 'Major', key: 0, onset: 0, seqDur: 1 }

export const isMaj = (param: MP) : boolean => param.mode === 'Major'

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
