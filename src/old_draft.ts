// Helper type to get nested property type
type GetNested<T, Path extends string[]> = Path extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends string[]
      ? GetNested<T[First], Rest>
      : never
    : never
  : T;

// Helper type to set nested property type
type SetNested<T, Path extends string[], NewType> = 
Path extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends string[]
      ? {
          [K in keyof T]: K extends First
            ? SetNested<T[First], Rest, NewType>
            : T[K]
        }
      : never
    : never
  : NewType;

type RemoveNestedField<T, Path extends string[]> = Path extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends []
      ? Omit<T, First>
      : Rest extends string[]
        ? { 
          [K in keyof T]: K extends First
            ? RemoveNestedField<T[First], Rest>
            : T[K]
          }
        : never
    : never
  : never;

type PathNode<Root, Path extends string[]>;

function transform()

function removeNestedField<T extends Node, Path extends string[]>(node: T): RemoveNestedField<T, Path> {
  return node;
}

interface Node {
  
}

// Example usage:
interface Deep {
  a: {
    b: {
      c: number;
      d: string;
    }
  }
}

// Removes the 'c' field from b
type Result1 = RemoveNestedField2<Deep, ['a', 'b', 'c']>;
type Result2 = RemoveNestedField2<Deep, ['a', 'b']>;
function foo(r: Result1, r2: Result2) {
  var d = r.a.b.d;
  var a = r2.a;
}

// Result1 = {
//   a: {
//     b: {
//       d: string;
//     }
//   }
// }

// Removes the 'b' field from a
// Result2 = {
//   a: {}
// }

// The type we want to remove from the union
type ExcludeType<T, U> = T extends U ? never : T;

// Example union type
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number }
  | { kind: "rectangle"; width: number; height: number };

const someShape: Shape = {
  kind: 'circle',

  get radius() {
    return 3;
  }
};


// Remove the circle case
type ShapeWithoutCircle = ExcludeType<Shape, { kind: "circle", radius: number }>;
// Result:
// {
//   kind: "square";
//   sideLength: number;
// } | {
//   kind: "rectangle";
//   width: number;
//   height: number;
// }

// Or more simply, using TypeScript's built-in Exclude utility type:
type ShapeWithoutCircle2 = Exclude<Shape, { kind: "circle", radius: number }>;

function getArea(shape: ShapeWithoutCircle2): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      return assertNever(shape); // Type error if we're missing any case
  }
}

function assertNever(x: never): never {
  throw new Error("Didn't expect to get here");
}

// Base AST
type Expression = 
  | { kind: 'literal'; value: number }
  | { kind: 'variable'; name: string }
  | { kind: 'binary'; left: Expression; right: Expression; op: '+' | '-' }

// Type-level extension operation
type AddCallExpression<T> = T | { kind: 'call'; callee: string; args: Expression[] }
type AddUnaryExpression<T> = T | { kind: 'unary'; op: '-'; expr: Expression }

type ExtendedExpression = AddUnaryExpression<AddCallExpression<Expression>>

// Example usage
const expr: ExtendedExpression = {
  kind: 'unary',
  op: '-',
  expr: {
    kind: 'call',
    callee: 'foo',
    args: [{ kind: 'literal', value: 42 }]
  }
}