(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

// A _Term_ can either be a non-terminal (NT) chord,
                                                         
// a let-in expression (Let) to capture repetition,
                                                                                               
// or a variable (Var) to indicate instances of a particular phrase
                                                    

                                                     

// The Term data structure has three constructors:
// 1. NT - a nonterminal that has a symbol and a parameter.
const newNT =      (symbol   , param   )           =>
  ({ type: 'NT', symbol, param });
// 2. Let - a means of capturing variable instantiation in a Term.
const newLet =      (name        , value               , expr               )            =>
  ({ type: 'Let', name, value, expr });
// 3. Var - a variable
const newVar =      (name        )            =>
  ({ type: 'Var', name });

// A Sentence is a list of Terms.
                                            

// ## Rules

// A rule has a left and righthand side. The lefthand side has an
// un-parameterized symbol and a probability for application of the rule. The
// righthand side is a function from a parameter to a Sentence.
                  
                                       
                                                                  

// A Rule constructor
function newRule       (symbol   , prob      , fn              )              {
  return { prob, symbol, fn }
}

// ## Generate terms

// Our strategy for applying a PTGG generatively is to begin with a start symbol
// and choose a rule randomly, but biased by the associated probability.

// ### Random generator

                          

// The most basic random generator
const random          = () => Math.random();

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
const update =       (rules                  , rand        , sentence               )                 => {
  // Instead of the recursive approach of the original Haskell source code,
  // and since Javascript doesn't fit well to that (no tail optimization, no lazy)
  // we use a more imperative approach (but probably there's a better way):
  let result                 = [];
  sentence.forEach((term           ) => {
    switch(term.type) {
      case 'NT':
        result = result.concat(applyRule(rules, rand, term));
        break;
    }
  });
  return result
};

// ### Applying Rules

// A function to update a single non-terinal term:
const applyRule =      (rules                  , rand        , term         )                 => {
  const { symbol, param }  = term;
  const matches = rules.filter((rule) => rule.symbol === symbol);
  if (matches.length) {
    const rule = choose(matches, rand());
    return rule.fn(param)
  } else {
    return [term]
  }
};

// TODO: remove recursion
const choose =      (rules                  , random        )             => {
  const head = rules[0];
  if (rules.length === 1 || random < head.prob) return head
  else return choose(rules.slice(1), random - head.prob)
};

// ### User level generation

const gen =      (rules                  , rand        , iterations        , sentence               )                 => {
  while(iterations--) sentence = update(rules, rand, sentence);
  return sentence
};

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
                                                                     
                                                

// TODO: Find a method to add a scale to Custom mode ['Custom', Array<AbsPitch>]

// A default MP value is one measure long (in 4/4) in the key of C-major.
const defaultMP      = { dur: 1, mode: 'Major', key: 0, onset: 0, seqDur: 1 };

// It is also useful to have tests for MP values and modifiers for them.
const isMaj = (param    )           => param.mode === 'Major';
const isMin = (param    )           => param.mode === 'Minor';

// ## Modifiers

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

// ## Rules

                                                
// The following alter Rules to do a duration test. Each has a
// "rejection condition" that will be the condition for an ID rule.

// The rejection condition in this case tests the left-hand-side
// symbol's duration.

function toRelDuration (isValidDur                       , rule                 )                   {
  const { prob, symbol, fn } = rule;
  return newRule(symbol, prob, (param    ) => fn(param))
}

// TODO: complete this section

// # Mode/key changes

const Major = 'Major';
const Minor = 'Minor';
const majModes = [Major, Minor, Minor, Major, Major, Minor, Minor];
const minModes = [Minor, Minor, Major, Minor, Minor, Major, Major];

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
};

const getScale = (mode      )                   => {
  const scale = Scales[mode];
  if (!scale) throw Error('Scale not defined for mode ' + mode)
  return scale
};
const majScale = getScale('Major');
const minScale = getScale('Minor');

const modMajMin = (i        ) => (param    )      => {
  // clone the param
  const mod = Object.assign({}, param);
  if (param.mode === 'Major') {
    mod.mode = majModes[i];
    mod.key = (param.key + majScale[i]) % 12;
  } else {
    mod.mode = minModes[i];
    mod.key = (param.key + minScale[i]) % 12;
  }
  return mod
};

// Basic modulations on scale degrees for Major and Minor systems
const m2 = modMajMin(1);
const m3 = modMajMin(2);
const m4 = modMajMin(3);
const m5 = modMajMin(4);
const m6 = modMajMin(5);
const m7 = modMajMin(6);

// # Progression symbols

// P = {piece, P}
// R = {TR, SR, DR} functional region symbols
// K = {Cmaj, Cmin, ...} key symbols
// F = {t, s, d, tp, sp, dp, tcp} functional term symbols
// S = {I, II, ...} scale degree chord representations
// O = {Cmaj, ...} surface chord symbols (e.g. I in K=Cmaj)

                                                                                                     
                                                               

// ## TSD Grammar base

const T = (p     )                 => newNT('T', p);
const S = (p     )                 => newNT('S', p);
const D = (p     )                 => newNT('D', p);

const tdsRules                          = [
  newRule('T', 0.25, (p) => [ T(p) ]),
  newRule('T', 0.25, (p) => [ T(h(p)), T(h(p)) ]),
  newRule('T', 0.25, (p) => [ T(h(p)), D(h(p)) ]),
  newRule('T', 0.25, (p) => [ D(h(p)), T(h(p)) ]),
  newRule('D', 0.33, (p) => [ D(p) ]),
  newRule('D', 0.33, (p) => [ D(h(p)), D(h(p)) ]),
  newRule('D', 0.34, (p) => [ S(h(p)), D(h(p)) ]),
  newRule('S', 0.5, (p) => [ S(p) ]),
  newRule('S', 0.5, (p) => [ S(h(p)), S(h(p)) ])
];

// ## Roman Numeral Grammar Base

const rn = (ct       ) => (p    )                 => newNT(ct, p);
const I = rn('I');
const II = rn('II');
const III = rn('III');
const IV = rn('IV');
const V = rn('V');
const VI = rn('VI');
const VII = rn('VII');

// Grammar from dissertation chapter 4, table 4.2 with optional let
// statements added.

// given a p, map the chords from the array to that p
const seq = (mods, ctypes, p) => ctypes.map((ctype, i) => ctype(mods[i % mods.length](p)));

// > rRules1 :: Dur -> Bool -> [Rule CType MP]
// > rRules1 minDur useLets = normalize $ map (toRelDur2 (<minDur)) ([
const rRules = [
  // -- Rules for I --
  // (I, 0.187) :-> \p -> [(if isMaj p then ii else iv) (q p), v (q p), i (h p)],
  newRule('I', 0.187, p => seq([q, q, h], [ isMaj(p) ? II : IV, V, I ], p)),
  // (I, 0.187) :-> \p -> map ($ q p) [i, iv, v, i],
  newRule('I', 0.187, p => seq([q], [ I, IV, V, I ], p)),
  // (I, 0.187) :-> \p -> [v (h p), i (h p)],
  newRule('I', 0.187, p => seq([h], [ V, I ], p)),
  // (I, 0.187) :-> \p -> map ($ q p) $ [i, if isMaj p then ii else iv, v, i],
  newRule('I', 0.187, p => seq([q], [ I, isMaj(p) ? II : IV, V, I ], p)),
  // (I, 0.252) :-> \p -> [i p],
  newRule('I', 0.252, p => [ I(p) ]),
  // -- Rules for II --
  // (II, 0.40) :-> \p -> if isMaj p then [ii p] else [iv p],
  newRule('II', 0.40, p => [ isMaj(p) ? II(p) : IV(p) ]),
  // (II, 0.40) :-> \p -> if isMaj p then (if dur p > qn then [ii p] else [i (m2 p)]) else [ii p],
  // newRule('II', 0.40, p => isMap(p) ? [ p.dur > qn ? II(p) : I(m2(p) ] : [ II(p) ]))
  // (II, 0.20) :-> \p -> map ($ h p) $ if isMaj p then [vi, ii] else [vi, iv],
  // -- Rules for III--
  // (III, 0.90) :-> \p -> [iii p],
  // (III, 0.10) :-> \p -> [i $ m3 p],
  // -- Rules for IV --
  // (IV, 0.90) :-> \p -> [iv p],
  // (IV, 0.10) :-> \p -> [i $ m4 p],
  // -- Rules for V --
  // (V, 0.10) :-> \p -> [v p],
  // (V, 0.15) :-> \p -> [iv (h p), v (h p)],
  // (V, 0.10) :-> \p -> [iii (h p), vi (h p)],
  // (V, 0.10) :-> \p -> map ($ q p) [i, iii, vi, v],
  // (V, 0.10) :-> \p -> map ($ q p) [v, vi, vii, v],
  // (V, 0.10) :-> \p -> [v (h p), vi (h p)],
  // (V, 0.10) :-> \p -> [iii p],
  // (V, 0.05) :-> \p -> [v (h p), v (h p)],
  // (V, 0.10) :-> \p -> [vii (h p), v (h p)],
  // (V, 0.10) :-> \p -> [i $ m5 p],
  // -- Rules for VI --
  // (VI, 0.70) :-> \p -> [vi p],
  // (VI, 0.30) :-> \p -> [i $ m6 p],
  // -- Rules for VII --
  // (VII, 0.50) :-> \p -> if dur p > qn then [vii p] else [i $ m7 p],
  // (VII, 0.50) :-> \p -> [i (h p), iii (h p)]
  // ] ++ if useLets then letRules else []) where
  // letRules = concatMap (\ct -> [letRule1 ct, letRule2 ct]) (enumFrom I)
  // letRule1 ct = (ct, 0.1) :-> \p -> [Let "x" [NT(ct, h p)] [Var "x", Var "x"]]
  // letRule2 ct = (ct, 0.1) :-> \p -> [Let "x" [NT(ct, q p)] [Var "x", v (h p), Var "x"]]
];

// # KulittaJS
// This is a port of some parts of [Kulitta](https://github.com/donya/Kulitta) to Javascript (with the help of [flow](https://flowtype.org))

// [Original source code](https://github.com/donya/Kulitta/blob/master/Kulitta.lhs) by Donya Kick and Paul Hudak

// Port to Javascript by danigb

/*       */

// ## Modules

// #### PTGG
// _Probabilistic Temporal Graph Grammars_

// [source code](ptgg.html)

exports.newNT = newNT;
exports.newLet = newLet;
exports.newVar = newVar;
exports.newRule = newRule;
exports.random = random;
exports.update = update;
exports.gen = gen;
exports.wn = wn;
exports.hn = hn;
exports.qn = qn;
exports.en = en;
exports.sn = sn;
exports.tn = tn;
exports.defaultMP = defaultMP;
exports.isMaj = isMaj;
exports.isMin = isMin;
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
exports.toRelDuration = toRelDuration;
exports.m2 = m2;
exports.m3 = m3;
exports.m4 = m4;
exports.m5 = m5;
exports.m6 = m6;
exports.m7 = m7;
exports.T = T;
exports.S = S;
exports.D = D;
exports.tdsRules = tdsRules;
exports.I = I;
exports.II = II;
exports.III = III;
exports.IV = IV;
exports.V = V;
exports.VI = VI;
exports.VII = VII;
exports.rRules = rRules;

Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],2:[function(require,module,exports){
/* global d3 */
const { update, random, defaultMP, I, rRules } = require('../')

const initial = [ I(defaultMP) ]
const model = [ initial ]

console.log(initial, rRules)
const generate = () => {
  const last = model[model.length - 1]
  const next = update(rRules, random, last)
  model.push(next)
}

const paint = () => {
  d3.select('#sequences')
    .selectAll('div')
    .data(model)
    .enter().append('div')
      .classed('Sequence', true)
      .selectAll('span')
      .data((d) => d)
      .enter().append('span')
        .attr('class', d => 'term term-' + d.symbol)
        .style('width', d => '' + 100 * d.param.dur + '%')
        .text(d => d.symbol)
}

window.onclick = () => {
  generate()
  paint()
}

paint()

},{"../":1}]},{},[2]);
