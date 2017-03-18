/* @flow */

// Roman numerals represent chords built on scale degrees.
type CType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'X'

// Key changes, or modulations, in our grammar also take place according to scale degrees.
type MType = 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7'

type duration = number

type Chord = { cType: CType, dur: duration }
const chord = (cType : CType, dur: duration) : Chord => ({ cType, dur })

// non-terminal (NT) chord
type NT = { type: 'NT', chord: Chord }
// sequence (S) of terms
type Seq = { type: 'S', terms: Array<Term> }
// a term modulated to another key
type Mod = { type: 'Mod', mType: MType, term: Term }
// let-in expression (Let) to capture repetition
type Let = { type: 'Let', name: string, value: Term, expr: Term }
// or a variable (Var) to indicate instances of a particular phrase
type Var = { type: 'Var', name: string }

type Term = NT | Seq | Mod | Let | Var

// We also introduce abbreviations for single-chord Term values.
const ntchord = (cType : CType) => (dur: duration) : NT => ({ type: 'NT', chord: chord(cType, dur)})
export const i = ntchord('I')
export const ii = (dur: duration) : NT => ({ type: 'NT', chord: chord('II', dur) })
const iii = (dur: duration) : NT => ({ type: 'NT', chord: chord('III', dur) })
const iv = (dur: duration) : NT => ({ type: 'NT', chord: chord('IV', dur) })
const v = (dur: duration) : NT => ({ type: 'NT', chord: chord('V', dur) })
const vi = (dur: duration) : NT => ({ type: 'NT', chord: chord('VI', dur) })
const vii = (dur: duration) : NT => ({ type: 'NT', chord: chord('VII', dur) })

type Rule = { cType: CType, prob: number, ruleFn : Function }

function applyRule (rules: Array<Rule>, chord: Chord, rand: Function) {
}

function update (rules: Array<Rule>, term: Term, rand: Function) {
  if (term.type === 'NT') applyRule(rules, term.chord, rand)
}
