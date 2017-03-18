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
