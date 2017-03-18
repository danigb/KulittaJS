// # PTGG
// _Probabilistic Temporal Graph Grammars_
/* @flow */

// #### Attribution
// Not only the ideas, but also most of the text of this annotated source code is taken from:
// "Grammar-Based Automated Music Composition in Haskell" by Donya Quick and Paul Hudak.
// Thanks!!

// ## Introduction

// Few algorithms for automated music composition are able to address the combination of harmonic structure, metrical structure, and repetition in a generalized way.

// We present a new class of generative grammars called Probabilistic Temporal Graph Grammars, or PTGG’s, that handle all of these features in music while allowing an elegant and concise
// implementation in ~~Haskell~~ Javascript+[Flow](https://flowtype.org/).


// ## Chords, Progressions, and Modulations

// A chord is a chord type and a duration
type Chord = { cType: CType, dur: duration }

// Roman numerals represent chords built on scale degrees.
type CType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'X'
type duration = number

// Key changes, or modulations, in our grammar also take place according to scale degrees.
type MType = 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7'


// We now define a data structure to capture the sentential forms of PTGG, called _Term_. This data type has a tree structure to model the nested nature of chord progression features like modulations and repetition.

// **Chord progressions** are represented as a _Term_.
type Term =
  // A _Term_ can either be a non-terminal (NT) chord,
  { type: 'NT', chord: Chord }
  // a sequence (S) of terms,
  | { type: 'Seq', terms: Array<Term> }
  // a term modulated to another key,
  | { type: 'Mod', mType: MType, term: Term }
  // a let-in expression (Let) to capture repetition,
  | { type: 'Let', name: string, value: Term, expr: Term }
  // or a variable (Var) to indicate instances of a particular phrase
  | { type: 'Var', name: string }

// We provide some _Term_ constructors:
export const NT = (cType: CType) => (dur: duration) : Term =>
  ({ type: 'NT', chord: { cType, dur} })
export const Seq = (terms: Array<Term>) : Term =>
  ({ type: 'Seq', terms })
export const Mod = (mType: MType, term: Term) : Term =>
  ({ type: 'Mod', mType, term })
export const Let = (name: string, value: Term, expr: Term) : Term =>
  ({ type: 'Let', name, value, expr })


// We also introduce abbreviations for single-chord _Term_ values:
export const i = NT('I')
export const ii = NT('II')
export const iii = NT('III')
export const iv = NT('IV')
export const v = NT('V')
export const vi = NT('VI')
export const vii = NT('VII')

// ## Rules

// A rule is a function from duration-parameterized chords to a chord progression:
type RuleFn = (dur: duration) => Term

// Because more than one rule may exist for a particular Roman numeral, each rule also has a probability associated with it:
type ARule = { cType: CType, prob: number, fn: RuleFn }

// For example, the rule It → Vt/2 It/2 with probability p would be written:
// ```js
// const rule = Rule('I', 0.5, (dur) => Seq([ v(dur/2), i(dur/2) ]))`
// ```
export function Rule (cType: CType, prob: number, fn: RuleFn) : ARule {
  return { cType, prob, fn }
}

// ## Generating Chord Progressions

// Our strategy for applying a PTGG generatively is to begin with a start symbol and choose a rule randomly, but biased by the associated probability.

// A random number function generator
type RandFn = () => number

// we define a single “domain specific” operation to generate a new random number
function random () {
}

// ### Applying Rules

// A chord, Xt ∈ N, can be replaced using any rule where X appears on the left-hand side. Since there may be more than one such rule, the applyRule function stochastically selects a rule to apply according to the probabilities assigned to the rules.
function applyRule (rules: Array<ARule>, chord: Chord, rand: RandFn ) : Term {
  var matches = rules.filter((rule) => rule.cType === chord.cType)
  if (matches.length) {
    var rule = matches[0]
    return rule.fn(chord.dur)
  } else {
    return { type: 'NT', chord }
  }
}

// ### Parallel Production

// In a single iteration of the generative algorithm, a _Term_ is updated in a depth-first manner to update the leaves (the NT values representing chords) from left to right.
type UpdateFn = (term: Term) => Term
// For Let expressions of the form let x = t1 in t2, the terms t1 and t2 are updated independently, but instances of x are not instantiated with their values at this stage.

export function updater (rules: Array<ARule>, rand: RandFn) : UpdateFn {
  return function update (term: Term) : Term {
    switch (term.type) {
      case 'NT':
        return applyRule(rules, term.chord, rand)
      case 'Seq':
        return Seq(term.terms.map(update))
      case 'Mod':
        return Mod(term.mType, update(term.term))
      case 'Let':
        return Let(term.name, update(term.value), update(term.expr))
      case 'Var':
        return term
      default:
        return i(0)
    }
  }
}

// Finally, we define a function gen that iteratively performs the updates:
export function generate (iter: number, term: Term, rules: Array<ARule>, rand: RandFn) : Term {
  const update = updater(rules, rand)
  while (iter--) term = update(term)
  return term
}

// ## Musical Interpretation

// A _Term_ is a tree data structure with many abstract musical features that must be interpreted in the context in which they appear. Chords must be interpreted within a key, and the key is dependent on the modulation structure of the branch. Variables refer to instances of a specific chord progression, which may have nested Let expressions.

// To produce a sequence of chords that can be interpreted musically, the structure of Let statements must be _expanded_ by replacing variables with the progressions they represent. This is important be- cause the interpretation of a variable’s chords hinges on the context in which the variable appears.

// When Let expressions appear in rules, the variable names in a generated progression are not guaranteed to be unique.
// We use lexical scop- ing to handle these situations
// The _expand_ function accomplishes this behavior, replacing in- stances of variables with their values under lexical scope, by main- taining an environment of variable definitions.
