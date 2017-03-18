// # PTGG
// _Probabilistic Temporal Graph Grammars_

// [Original source code](https://github.com/donya/Kulitta/blob/master/Kulitta/PTGG.lhs)
// by Donya Quick

// Port to Javascript+Flow by danigb
/* @flow */

// ## Introduction

// Few algorithms for automated music composition are able to address the combination of harmonic structure, metrical structure, and repetition in a generalized way.

// We present a new class of generative grammars called Probabilistic Temporal Graph Grammars, or PTGG’s, that handle all of these features in music while allowing an elegant and concise
// implementation in ~~Haskell~~ Javascript+[Flow](https://flowtype.org/).

// ## Terms

// We define a data structure to capture the sentential forms of PTGG, called
// _Term_. This data type has a tree structure to model the nested nature of
// chord progression features like modulations and repetition.

// See [music-grammar](music-grammar.html) to see how a Term<Chord, MusicParam>
// can represent chord progressions

type Term<S,P> =
  // A _Term_ can either be a non-terminal (NT) chord,
  { type: 'NT', symbol: S, param: P }
  // a let-in expression (Let) to capture repetition,
  | { type: 'Let', name: string, value: Sentence<P, S>, expr: Sentence<P, S> }
  // or a variable (Var) to indicate instances of a particular phrase
  | { type: 'Var', name: string }

// The Term data structure has three constructors:
// 1. NT - a nonterminal that has a symbol and a parameter.
export const NT = <S,P>(symbol: S) => (param: P) : Term<S,P> => ({ type: 'NT', symbol, param })

// 2. Let - a means of capturing variable instantiation in a Term.
// 3. Var - a variable

// A Sentence is a list of Terms.
type Sentence<S,P> = Array<Term<S,P>>

// ## Rules

// A rule has a left and righthand side. The lefthand side has an
// un-parameterized symbol and a probability for application of the rule. The
// righthand side is a function from a parameter to a Sentence.
type Prob = number
type RuleFn<S,P> = (P) => Sentence<S,P>
type ARule<S,P> = { prob: Prob, symbol: S, fn: RuleFn<S,P> }

// A Rule constructor
export function Rule<S, P> (prob: Prob, symbol: S, fn: RuleFn<S, P>) : ARule<S, P> {
  return { prob, symbol, fn }
}

// ## Generate terms

// Our strategy for applying a PTGG generatively is to begin with a start symbol
// and choose a rule randomly, but biased by the associated probability.

// ### Random generator

type RandFn = () => number

// ### Applying Rules
function applyRule<S,P> (rules: Array<ARule<S,P>>, symbol: S, param: P, rand: RandFn ) : Sentence<S,P> {
  var matches = rules.filter((rule) => rule.symbol === symbol)
  if (matches.length) {
    var rule = matches[0]
    return rule.fn(param)
  } else {
    return [{ type: 'NT', symbol, param }]
  }
}



// ### Parallel Production

// In a single iteration of the generative algorithm, a _Term_ is updated in a
// depth-first manner to update the leaves (the NT values representing chords)
// from left to right.
type Updater<S,P> = (term: Term<S,P>) => Term<S,P>

// For Let expressions of the form let x = t1 in t2, the terms t1 and t2 are
// updated independently, but instances of x are not instantiated with their
// values at this stage.

// A function to rewrite one Sentence to another using an L-System-like approach
// to generation where all symbols are updated from left to right.

/*
export function updater<S,P> (rules: Array<Rule<S,P>>, rand: RandFn) : Updater<S,P> {
  return function update<S,P> (sentence: Sentence<S,P>) : Sentence<S,P> {
    return sentence.map((term : Term<S,P>) => {
      switch(term.type) {
        default: return null
      }
    })
  }
}
*/
