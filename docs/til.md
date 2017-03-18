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

## Haskell (and fp)

#### 1. Pattern matching + recursion

The power duo!

## Kulitta
