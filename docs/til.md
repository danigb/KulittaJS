# TIL

## @flow

#### 1. Flow is awesome

The power of types!

#### 2. Flow disjoint unions

```js
type Tree = { type: 'Leaf', value: string }
  | { type: 'Node', left: Tree, right: Tree }

switch (tree.type) {
  case 'Leaf':
    leafOperation(tree)
    break
  case 'Node':
    nodeOperation(tree)
    break
}
```

#### 3. Use your atom, luke

- https://atom.io/packages/flow-ide

> Flow IDE is a lightweight package that provides IDE features for FlowType for Atom Editor. It's pretty lightweight and robust.

#### 4. Parameterized types

Bounded polymorphism: https://flowtype.org/blog/2015/03/12/Bounded-Polymorphism.html

Initial attempt (doesn't work):

```
function clone<T>(obj: T) : T {
  return Object.assign({}, obj)
}
```

Better:
```
const clone = (p : MP) : MP => Object.assign({}, p)
```

#### 5. Import type

https://flowtype.org/blog/2015/02/18/Import-Types.html


```js
import type Rule from './ptgg'
```

#### 6. null annotation

https://flowtype.org/docs/nullable-types.html#type-annotating-null

```js
function select(list: Array<T>) : ?T {
  return null
}
```

#### 7. This type is incompatible with the expected param type of some incompatible instantiation of

Problematic code:

```js
export function updater<S,P> (rules: Array<Rule<S,P>>, rand: RandFn) { // : Updater<S,P> {
  return function update<S,P> (sentence: Sentence<S,P>) : Sentence<S,P> {
    let result : Sentence<S,P> = []
    sentence.forEach((term: Term<S,P>) => {
      switch(term.type) {
        case 'NT':
          const nt : NT<S,P> = term
          const applied = applyRule(rules, nt.symbol, nt.param, rand)
          break;
      }
    })
    return result
  }
}
```

https://github.com/facebook/flow/issues/3386#issuecomment-279929684:

> The problem is that type variables in a function signature (in this case, in the signature of makeGetter) are not in scope in the function body. So we cannot refer to the type T in inner function types, or in variable types in the body of makeGetter.

http://sitr.us/2015/05/31/advanced-features-in-flow.html#existential-types

#### 8. Beware the arrows

`() => () =>` is not always clear...


## Haskell (and fp)

#### 1. Pattern matching + recursion

The power duo!

#### 2. Function signatures overview

Trying to understand this: `> showDur :: (Show a) => (a,MP) -> String`

Basic signtures:

```
name :: Param1 -> Param2 -> Param3 -> ReturnValue
```

With _higher order functions_ (parameterized):

```
map :: (a -> b) -> ([a] -> [b])
```

## Kulitta

## D3

#### 1. Nested selections

https://bost.ocks.org/mike/nest/
