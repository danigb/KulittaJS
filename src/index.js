// # PTGG
// _Probabilistic Temporal Graph Grammars_
/* @flow */

// Few algorithms for automated music composition are able to address the combination of harmonic structure, metrical structure, and repetition in a generalized way.

// We present a new class of generative grammars called Probabilistic Temporal Graph Grammars, or PTGG’s, that handle all of these features in music while allowing an elegant and concise
// implementation in ~~Haskell~~ Javascript+[Flow](https://flowtype.org/).

// ## Chords, Progressions, and Modulations

// A chord is a chord type and a duration
type Chord = { cType: CType, dur: duration }

// Roman numerals represent chords built on scale degrees.
type CType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'X'

// Key changes, or modulations, in our grammar also take place according to scale degrees.
type MType = 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7'

type duration = number

// We now define a data structure to capture the sentential forms of PTGG, called Term. This data type has a tree structure to model the nested nature of chord progression features like modulations and repetition.

// Chord progressions are represented as a Term.
type Term =
  // A Term can either be a non-terminal (NT) chord,
  { type: 'NT', chord: Chord }
  // a sequence (S) of terms,
  | { type: 'Seq', terms: Array<Term> }
  // a term modulated to another key,
  | { type: 'Mod', mType: MType, term: Term }
  // a let-in expression (Let) to capture repetition,
  | { type: 'Let', name: string, value: Term, expr: Term }
  // or a variable (Var) to indicate instances of a particular phrase
  | { type: 'Var', name: string }

// We provide some Term constructors:
export const NT = (cType: CType) => (dur: duration) => ({ type: 'NT', chord: { cType, dur} })
export const Seq = (...terms: Array<Term>) : Term => ({ type: 'Seq', terms })

// We also introduce abbreviations for single-chord Term values:
export const i = NT('I')
export const ii = NT('II')
export const iii = NT('III')
export const iv = NT('IV')
export const v = NT('V')
export const vi = NT('VI')
export const vii = NT('VII')

type RuleFn = (dur: duration) => Term

type ARule = { cType: CType, prob: number, fn: RuleFn }

// Create a Rule
export function Rule (cType: CType, prob: number, fn: RuleFn) : ARule {
  return { cType, prob, fn }
}

// A random number function generator
type RandFn = () => number

export function applyRule (rules: Array<ARule>, chord: Chord, rand: RandFn ) : Term {
  var matches = rules.filter((rule) => rule.cType === chord.cType)
  var rule = matches[0]
  return rule.fn(chord.dur)
}

export function update (rules: Array<ARule>, term: Term, rand: RandFn) : Term {
  switch (term.type) {
    case 'NT':
      return applyRule(rules, term.chord, rand)
    case 'Seq':
      const terms = term.terms.map(term => update(rules, term, rand))
      return { type: 'Seq', terms }
    default:
      return i(0)
  }
}
