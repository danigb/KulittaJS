(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.PTGG = global.PTGG || {})));
}(this, (function (exports) { 'use strict';

// # PTGG
// _Probabilistic Temporal Graph Grammars_

// [Original source code](https://github.com/donya/Kulitta/blob/master/Kulitta/PTGG.lhs)
// by Donya Quick

// Port to Javascript+Flow by danigb
/*       */

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

                
                                                      
                                     
                                                     
                                                                              
                                                                     
                                 

// The Term data structure has three constructors:
// 1. NT - a nonterminal that has a symbol and a parameter.
const NT =      (symbol   ) => (param   )             => ({ type: 'NT', symbol, param });

// 2. Let - a means of capturing variable instantiation in a Term.
// 3. Var - a variable

// A Sentence is a list of Terms.
                                     

// ## Rules

// A rule has a left and righthand side. The lefthand side has an
// un-parameterized symbol and a probability for application of the rule. The
// righthand side is a function from a parameter to a Sentence.
                  
                                       
                                                            

// A Rule constructor
function Rule       (prob      , symbol   , fn              )               {
  return { prob, symbol, fn }
}





// ### Parallel Production

// In a single iteration of the generative algorithm, a _Term_ is updated in a
// depth-first manner to update the leaves (the NT values representing chords)
// from left to right.
                                                  

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

// # Musical Grammar
// [Original source code](https://github.com/donya/Kulitta/blob/master/Kulitta/Grammars/MusicGrammars.lhs)
// by Donya Quick
/*       */

// ## Type synonyms & constants

// Duration is represented with a float (in relative units)
                 

// Abstract pitch represented as a number (midi note number)
                      

// Some duration definitions
const wn       = 1;
const hn       = 1/2;
const qn       = 1/4;
const en       = 1/8;
const sn       = 1/16;
const tn       = 1/32;

// ## Alphabets for base symbols

// Alphabet 1: Roman numeral for abstract chords
                                                                 

// ## Alphabets for parameters

// Many finite base symbol alphabets can use the same potentially infinite alphabet of parameter symbols. Here we define a general "music parameter" or MP for many tonal applications. It will store the current duration of a symbol, and the symbol's tonal context as a mode and scale root.
// Finally, there is allowance for keeping track of the onset of the symbol as well as the total duration of the sentence to which it belongs. This allows for checking things like whether the symbols is the LAST in a sentence, at the midpoint, etc.

// The "Music Parameter" definition
                                                                        

// _Modes_ include the seven usual derivatives of the C-major scale along with chromatic and custom options. Note that Major=Ionian and Minor=Aeoloean.
                                                                     
                                                                   

// A default MP value is one measure long (in 4/4) in the key of C-major.
const defaultMP      = { dur: 1, mode: 'Major', key: 0, onset: 0, seqDur: 1 };

const isMaj = (param    )           => param.mode === 'Major';

// Modifier is a function to perform music parameter updtes
                                 

// Modifiers on duration can be used to succinctly write transformations.
// For example, to halve the duration of a parameter `param: MP`, one need only
// write `h(param)`
const durFactor = (factor        )            => (param    )      =>
  Object.assign({}, param, { dur: param.dur * factor });

const h = durFactor(0.5);
const q = durFactor(0.25);
const e = durFactor(0.125);

// Similarly, we have some shorthands for adjusting the onsets and
// durations at the same time. NOTE: offsets should be changed
// before the duration is changed.
const onsetOffsetFactor = (factor        )            => (param    )      =>
  Object.assign({}, param, { onset: param.onset + param.dur * factor });

const q2 = onsetOffsetFactor(1/4);
const q3 = onsetOffsetFactor(2/4);
const q4 = onsetOffsetFactor(3/4);

// We can also do shorthands that do both things.
const compose = (a           , b          )            => (p    )      => a(b(p));
const ho = compose(h, q3);
const qo2 = compose(q, q2);
const qo3 = compose(q, q3);
const qo4 = compose(q, q4);

// # KulittaJS
// This is a port of some parts of [Kulitta](https://github.com/donya/Kulitta) to Javascript (with the help of [flow](https://flowtype.org))

// [Original source code](https://github.com/donya/Kulitta/blob/master/Kulitta.lhs) by Donya Kick and Paul Hudak

// Port to Javascript by danigb

/*       */

// ## Modules

// #### PTGG
// _Probabilistic Temporal Graph Grammars_

// [source code](ptgg.html)

exports.NT = NT;
exports.Rule = Rule;
exports.wn = wn;
exports.hn = hn;
exports.qn = qn;
exports.en = en;
exports.sn = sn;
exports.tn = tn;
exports.defaultMP = defaultMP;
exports.isMaj = isMaj;
exports.h = h;
exports.q = q;
exports.e = e;
exports.q2 = q2;
exports.q3 = q3;
exports.q4 = q4;
exports.ho = ho;
exports.qo2 = qo2;
exports.qo3 = qo3;
exports.qo4 = qo4;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=kulitta.js.map
