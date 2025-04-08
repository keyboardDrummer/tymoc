# Tymoc
Tymoc stands for **ty**ped **mo**dular **c**ompiler. It leverages TypeScript's advanced type system to define type-level functions that enable transforming AST types. These functions allow adding or removing fields to particular node types, and adding or removing elements from a particular union type.

Tymoc also comes with a syntax and semantics library. The syntax library enables defining parsers, printers, formatters, syntax highlighters and syntactic code completion. The semantic library enables defining an interpreter, a debugger and semantic IDE features such as code navigation and assisted renaming. Both the libraries are designed to enable definitions to be transformed, enabling modular compiler development.

Example of transforming AST types using Tymoc:

```ts
// Initial AST type
type Expression = 
  | { kind: 'literal'; value: number }
  | { kind: 'variable'; name: string }
  | { kind: 'binary'; left: Expression; right: Expression; op: '+' | '-' }

// Two separately defined AST extensions
type CallExpression = { 
    kind: 'call', 
    callee: string, 
    args: Expression[] 
}

type UnaryExpression = { 
    kind: 'unary'; 
    op: '-'; 
    expr: Expression 
}

// ReplaceType handles updating all the recursive references
type ExtendedExpression1 = ReplaceType<Expression | CallExpression, Expression, Expression | CallExpression>
type ExtendedExpression2 = ReplaceType<ExtendedExpression1 | UnaryExpression, ExtendedExpression1, ExtendedExpression1 | UnaryExpression>

const expr: ExtendedExpression2 = {
  kind: 'unary',
  op: '-',
  expr: {
    kind: 'call',
    callee: 'foo',
    args: [{ kind: 'literal', value: 42 }]
  }
}
```
