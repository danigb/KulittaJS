(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.PTGG = global.PTGG || {})));
}(this, (function (exports) { 'use strict';

/*       */

// Roman numerals represent chords built on scale degrees.
                                                                 

// Key changes, or modulations, in our grammar also take place according to scale degrees.
                                                    

                      

                                            
const chord = (cType        , dur          )         => ({ cType, dur });

// non-terminal (NT) chord
                                      
// sequence (S) of terms
                                            
// a term modulated to another key
                                                    
// let-in expression (Let) to capture repetition
                                                                 
// or a variable (Var) to indicate instances of a particular phrase
                                        

                                      

// We also introduce abbreviations for single-chord Term values.
const ntchord = (cType        ) => (dur          )      => ({ type: 'NT', chord: chord(cType, dur)});
const i = ntchord('I');
const ii = (dur          )      => ({ type: 'NT', chord: chord('II', dur) });

exports.i = i;
exports.ii = ii;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ptgg.js.map
