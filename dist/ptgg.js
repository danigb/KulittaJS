(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.PTGG = global.PTGG || {})));
}(this, (function (exports) { 'use strict';

// # PTGG
// _Probabilistic Temporal Graph Grammars_
/*       */

// Few algorithms for automated music composition are able to address the combination of harmonic structure, metrical structure, and repetition in a generalized way.

// We present a new class of generative grammars called Probabilistic Temporal Graph Grammars, or PTGG’s, that handle all of these features in music while allowing an elegant and concise
// implementation in ~~Haskell~~ Javascript+[Flow](https://flowtype.org/).

// ## Chords, Progressions, and Modulations

// A chord is a chord type and a duration
                                            

// Roman numerals represent chords built on scale degrees.
                                                                 

// Key changes, or modulations, in our grammar also take place according to scale degrees.
                                                    

                      

// We now define a data structure to capture the sentential forms of PTGG, called Term. This data type has a tree structure to model the nested nature of chord progression features like modulations and repetition.

// Chord progressions are represented as a Term.
           
                                                    
                              
                             
                                       
                                     
                                             
                                                     
                                                          
                                                                     
                                 

// We provide some Term constructors:
const NT = (cType       ) => (dur          ) => ({ type: 'NT', chord: { cType, dur} });
const Seq = (...terms             )        => ({ type: 'Seq', terms });

// We also introduce abbreviations for single-chord Term values:
const i = NT('I');
const ii = NT('II');
const iii = NT('III');
const iv = NT('IV');
const v = NT('V');
const vi = NT('VI');
const vii = NT('VII');

                                     

                                                       

// Create a Rule
function Rule (cType       , prob        , fn        )         {
  return { cType, prob, fn }
}

// A random number function generator
                          

function applyRule (rules              , chord       , rand         )        {
  var matches = rules.filter((rule) => rule.cType === chord.cType);
  var rule = matches[0];
  return rule.fn(chord.dur)
}

function update (rules              , term      , rand        )        {
  switch (term.type) {
    case 'NT':
      return applyRule(rules, term.chord, rand)
    case 'Seq':
      const terms = term.terms.map(term => update(rules, term, rand));
      return { type: 'Seq', terms }
    default:
      return i(0)
  }
}

exports.NT = NT;
exports.Seq = Seq;
exports.i = i;
exports.ii = ii;
exports.iii = iii;
exports.iv = iv;
exports.v = v;
exports.vi = vi;
exports.vii = vii;
exports.Rule = Rule;
exports.applyRule = applyRule;
exports.update = update;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ptgg.js.map
