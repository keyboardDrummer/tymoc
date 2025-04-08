// Transitively replace occurrences of Old with New, in type Root
type ReplaceType<Root, Old, New> = Root extends Old
  ? New  // Direct Expression reference
  : Root extends Array<infer U> 
      ? Array<ReplaceType<U, Old, New>>  // Arrays
      : Root extends object 
          ? { [K in keyof Root]: ReplaceType<Root[K], Old, New> }  // Objects
          : Root  // Primitives

// Example AST transformations
type Expression = 
  | { kind: 'literal'; value: number }
  | { kind: 'variable'; name: string }
  | { kind: 'binary'; left: Expression; right: Expression; op: '+' | '-' }

// Extension variants defined standalone
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