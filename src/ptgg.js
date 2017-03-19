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

// A _Term_ can either be a non-terminal (NT) chord,
export type NT<S,P> = { type: 'NT', symbol: S, param: P }
// a let-in expression (Let) to capture repetition,
export type Let<S,P> = { type: 'Let', name: string, value: Sentence<S,P>, expr: Sentence<S,P> }
// or a variable (Var) to indicate instances of a particular phrase
export type Var<S,P> = { type: 'Var', name: string }

export type Term<S,P> = NT<S,P> | Let<S,P> | Var<S,P>

// The Term data structure has three constructors:
// 1. NT - a nonterminal that has a symbol and a parameter.
export const newNT = <S,P>(symbol: S, param: P) : NT<S,P> =>
  ({ type: 'NT', symbol, param })
// 2. Let - a means of capturing variable instantiation in a Term.
export const newLet = <S,P>(name: string, value: Sentence<S,P>, expr: Sentence<S,P>) : Let<S,P> =>
  ({ type: 'Let', name, value, expr })
// 3. Var - a variable
export const newVar = <S,P>(name: string) : Var<S,P> =>
  ({ type: 'Var', name })

// A Sentence is a list of Terms.
export type Sentence<S,P> = Array<Term<S,P>>

// ## Rules

// A rule has a left and righthand side. The lefthand side has an
// un-parameterized symbol and a probability for application of the rule. The
// righthand side is a function from a parameter to a Sentence.
type Prob = number
type RuleFn<S,P> = (P) => Sentence<S,P>
export type Rule<S,P> = { prob: Prob, symbol: S, fn: RuleFn<S,P> }

// A Rule constructor
export function newRule<S, P> (symbol: S, prob: Prob, fn: RuleFn<S, P>) : Rule<S, P> {
  return { prob, symbol, fn }
}

// ## Generate terms

// Our strategy for applying a PTGG generatively is to begin with a start symbol
// and choose a rule randomly, but biased by the associated probability.

// ### Random generator

type RandFn = () => number

// The most basic random generator
export const random : RandFn = () => Math.random()

// ### Parallel Production

// In a single iteration of the generative algorithm, a _Term_ is updated in a
// depth-first manner to update the leaves (the NT values representing chords)
// from left to right.

// For Let expressions of the form let x = t1 in t2, the terms t1 and t2 are
// updated independently, but instances of x are not instantiated with their
// values at this stage.

// An function to rewrite one Sentence to another using an
// L-System-like approach to generation where all symbols are updated from left
// to right.
export const update = <S,P> (rules: Array<Rule<S,P>>, rand: RandFn, sentence: Sentence<S,P>) : Sentence<S,P> => {
  // Instead of the recursive approach of the original Haskell source code,
  // and since Javascript doesn't fit well to that (no tail optimization, no lazy)
  // we use a more imperative approach (but probably there's a better way):
  let result : Sentence<S,P> = []
  sentence.forEach((term: Term<S,P>) => {
    switch(term.type) {
      case 'NT':
        result = result.concat(applyRule(rules, rand, term))
        break;
    }
  })
  return result
}

// ### Applying Rules

// A function to update a single non-terinal term:
const applyRule = <S,P>(rules: Array<Rule<S,P>>, rand: RandFn, term: NT<S,P>) : Sentence<S,P> => {
  const { symbol, param }  = term
  const matches = rules.filter((rule) => rule.symbol === symbol)
  if (matches.length) {
    const rule = choose(matches, rand())
    return rule.fn(param)
  } else {
    return [term]
  }
}

// TODO: remove recursion
const choose = <S,P>(rules: Array<Rule<S,P>>, random: number) : Rule<S,P> => {
  const head = rules[0]
  if (rules.length === 1 || random < head.prob) return head
  else return choose(rules.slice(1), random - head.prob)
}

// ### User level generation

export const gen = <S,P>(rules: Array<Rule<S,P>>, rand: RandFn, iterations: number, sentence: Sentence<S,P>) : Sentence<S,P> => {
  while(iterations--) sentence = update(rules, rand, sentence)
  return sentence
}
