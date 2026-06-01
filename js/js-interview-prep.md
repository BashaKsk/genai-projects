# JavaScript Interview Prep — Section-Wise (Standard Definitions)

Deep JS prep for the Amazon Support Engineer loop. Each concept opens with a **formal,
technical definition** suitable for recitation, followed by elaboration, likely questions,
and gotchas. Coding patterns at the end.

> How to use a definition in an interview: state the **formal definition first** (shows
> precision), then give a **one-line example** (shows you actually understand it).

---

## 1. Variables, Scope & Hoisting

**Hoisting** is a behavior in JavaScript where the interpreter, during the creation phase
of an execution context, allocates memory for variable, function, and class declarations
before any code is executed. Declarations are processed first; only assignments remain in
place at runtime.

- **`var`** declarations are hoisted and initialized with `undefined`, so they are readable
  (as `undefined`) before their line of code.
- **`let`** and **`const`** declarations are hoisted but **not initialized**; they remain in
  the **Temporal Dead Zone (TDZ)** — the region from the start of the scope until the
  declaration is evaluated — and accessing them there throws a `ReferenceError`.
- **Function declarations** are fully hoisted (name *and* body), so they are callable before
  their definition. **Function expressions** are not.

**Scope** is the region of a program in which a given binding (variable) is accessible.
JavaScript uses **lexical (static) scoping**: a binding's accessibility is determined by its
physical location in the source code. `var` is **function-scoped**; `let`/`const` are
**block-scoped** (confined to the nearest `{ }`).

**Likely questions**
- Difference between `var`, `let`, and `const`?
- Define hoisting and the Temporal Dead Zone.
- Output of `console.log(x); var x = 5;` (→ `undefined`) vs `let x` (→ `ReferenceError`).
- The `setTimeout` loop: `var` → `3 3 3` (one shared binding); `let` → `0 1 2` (per-iteration binding).

---

## 2. Data Types & Type Coercion

A **data type** is a classification that specifies the kind of value a variable holds and the
operations permitted on it. JavaScript is **dynamically typed** (types are associated with
values at runtime) and **weakly typed** (it performs implicit type conversion).

JavaScript defines **seven primitive types** — `string`, `number`, `bigint`, `boolean`,
`undefined`, `symbol`, and `null` — which are **immutable** and compared **by value**.
All other values are **objects**, compared **by reference**.

**Type coercion** is the **automatic or implicit conversion** of a value from one data type
to another (e.g., string to number) performed by the engine during an operation. **Type
conversion** (or casting) is the same conversion performed **explicitly** by the developer.

- **Strict equality (`===`)** compares value and type with **no coercion**.
  **Loose equality (`==`)** performs type coercion before comparison.
- **Falsy values** (coerce to `false`): `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`,
  `NaN`. Every other value is **truthy**.

**Likely questions**
- List the primitive types. Why is `typeof null === "object"`?
- Define type coercion vs type conversion.
- Why is `0.1 + 0.2 !== 0.3`? (IEEE-754 double-precision floating point cannot represent
  these decimals exactly.)
- `"5" + 3` → `"53"`; `"5" - 3` → `2` — explain the operator-driven coercion.

---

## 3. Functions, Closures & Scope

A **closure** is the combination of a function and the **lexical environment** within which
that function was declared. It gives the inner function access to the variables of its outer
(enclosing) scope **even after the outer function has returned**. In JavaScript, closures are
created **every time a function is created**, at function-creation time.

- The closure retains a **reference** to its outer variables, not a copy — so it observes
  their latest values.
- Primary uses: **data privacy / encapsulation**, **stateful functions** (counters, memoization),
  and **callbacks** that need access to their defining scope.

A **first-class function** is a function treated as a first-class citizen: it can be assigned
to variables, passed as an argument, and returned from other functions. A **higher-order
function** is a function that takes a function as an argument and/or returns a function.

**Likely questions**
- Define a closure and give a real-world use.
- Function declaration vs expression vs arrow function.
- Explain the `setTimeout`-in-a-loop output using closures.

```js
function makeCounter() {
  let count = 0;                 // private to the closure
  return () => ++count;          // closes over `count`
}
const next = makeCounter();
next(); next();                  // 1, 2
```

---

## 4. The `this` Keyword & Explicit Binding

**`this`** is a keyword that refers to the **execution context** of the currently running
function — specifically, the object on which the function was invoked. Its value is
determined by the **call site** (how the function is called), not by where it is defined,
with the exception of arrow functions.

**Binding rules**, in precedence order:
1. **`new` binding** — `new Fn()` → `this` is the newly created instance.
2. **Explicit binding** — `fn.call/apply/bind(obj)` → `this` is `obj`.
3. **Implicit binding** — `obj.fn()` → `this` is `obj`.
4. **Default binding** — a plain call → `this` is `undefined` (strict mode) or the global object.
5. **Arrow functions** have no own `this`; they capture `this` **lexically** from the
   enclosing scope.

- **`call(thisArg, ...args)`** — invokes the function immediately with a given `this` and
  arguments passed individually.
- **`apply(thisArg, argsArray)`** — same, but arguments are passed as an array.
- **`bind(thisArg, ...args)`** — returns a **new function** with `this` (and optionally
  leading arguments) permanently bound; does not invoke immediately.

**Likely questions**
- How is the value of `this` determined?
- Difference between `call`, `apply`, and `bind`?
- Why does `this` become `undefined` inside a `setTimeout` callback, and how do arrow
  functions resolve it?

---

## 5. Prototypes, the Prototype Chain & Inheritance

**Prototypal inheritance** is a mechanism by which an object can inherit properties and
methods from another object. Every JavaScript object has an internal property,
`[[Prototype]]` (accessible via `Object.getPrototypeOf` / the legacy `__proto__`), which is
a reference to another object called its **prototype**.

The **prototype chain** is the series of linked prototype objects traversed during property
resolution: when a property is accessed, the engine searches the object itself, then its
prototype, then that object's prototype, and so on until the property is found or the chain
terminates at `null` (returning `undefined`).

- **`prototype`** is a property of **constructor functions**; it becomes the `[[Prototype]]`
  of instances created with `new`.
- **`__proto__`** is the accessor on an **instance** that exposes its `[[Prototype]]`.
- A **`class`** is **syntactic sugar** over constructor functions and prototypal inheritance;
  it does not introduce a new object-oriented model.

**Likely questions**
- Explain prototypal inheritance and the prototype chain.
- Difference between `prototype` and `__proto__`.
- How does `instanceof` work? (It tests whether a constructor's `prototype` appears anywhere
  in the object's prototype chain.)

---

## 6. The Event Loop & Asynchronous Execution ★

JavaScript is a **single-threaded**, **non-blocking**, **asynchronous**, **concurrent**
language that uses a **single call stack**.

The **event loop** is a runtime mechanism that continuously monitors the **call stack** and
the **task queues**. When the call stack is empty, it dequeues the next available callback
and pushes it onto the stack for execution, enabling non-blocking concurrency on a single
thread.

- **Call stack** — a LIFO structure tracking the currently executing function frames.
- **Macrotask (task) queue** — callbacks from `setTimeout`, `setInterval`, I/O, UI events.
- **Microtask queue** — callbacks from resolved Promises (`.then/.catch/.finally`),
  `queueMicrotask`, `MutationObserver`.
- **Ordering rule:** after each macrotask (and after the initial synchronous run), the engine
  **drains the entire microtask queue** before rendering or processing the next macrotask.
  Therefore **microtasks always run before the next macrotask**.

A **Promise** is an object representing the eventual completion (**fulfillment**) or failure
(**rejection**) of an asynchronous operation and its resulting value. Its lifecycle states
are **pending → fulfilled** or **pending → rejected** (collectively, *settled*).

**`async`/`await`** is **syntactic sugar over Promises**: an `async` function always returns a
Promise, and `await` suspends the function's execution until the awaited Promise settles,
without blocking the main thread.

**Likely questions**
- Explain the event loop, call stack, microtask vs macrotask queue.
- Predict the output:
  ```js
  console.log(1);
  setTimeout(() => console.log(2), 0);
  Promise.resolve().then(() => console.log(3));
  console.log(4);
  // 1, 4, 3, 2
  ```
- `Promise.all` vs `allSettled` vs `race` vs `any`.
- Error handling: `try/catch` with `await` vs `.catch()` on the chain.

---

## 7. Objects, Arrays & Copying

**Shallow copy**: a copy whose top-level properties are duplicated, but whose nested
object/array values remain **shared references** to the originals (e.g. spread `{...o}`,
`Object.assign`, `Array.prototype.slice`).

**Deep copy**: a copy in which the object and **all nested objects** are recursively
duplicated, sharing no references with the original (e.g. `structuredClone`, recursive copy,
or the lossy `JSON.parse(JSON.stringify(...))`).

**Array methods** — know which **return** a value vs **mutate** in place:

| Method | Returns | Mutates? |
|--------|---------|----------|
| `map` | new transformed array | no |
| `filter` | new filtered array | no |
| `reduce` | single accumulated value | no |
| `forEach` | `undefined` | no |
| `find` / `findIndex` | first match / its index | no |
| `some` / `every` | boolean | no |
| `slice` | shallow copy of a range | no |
| `splice` | array of removed items | **yes** |
| `sort` | the (same) sorted array | **yes** |

**Likely questions**
- Difference between `map` and `forEach`; `slice` vs `splice`.
- Define shallow vs deep copy; demonstrate a shared-reference bug.
- `[10, 2, 1].sort()` → `[1, 10, 2]` — why? (default comparator converts to strings and
  compares lexicographically; supply a numeric comparator).

---

## 8. ES6+ Features (summary)

**ECMAScript 2015 (ES6)** and later editions added block-scoped declarations (`let`/`const`),
arrow functions, template literals, destructuring, spread/rest syntax, default parameters,
classes, modules (`import`/`export`), Promises, `Map`/`Set`/`WeakMap`/`WeakSet`, `Symbol`,
generators/iterators, optional chaining (`?.`), and nullish coalescing (`??`).

A **`Map`** is a keyed collection in which keys may be of **any type** and **insertion order**
is preserved. A **`Set`** is a collection of **unique values**. (See the dedicated Map docs.)

A **generator** is a function (`function*`) that can be **paused and resumed**, producing a
sequence of values lazily via the `yield` keyword and returning an iterator.

---

## 9. Error Handling

An **exception** is a runtime event that disrupts the normal flow of execution. The
**`try...catch...finally`** statement marks a block to attempt (`try`), a handler for any
thrown exception (`catch`), and a block that always executes regardless of outcome
(`finally`).

- A `try/catch` only catches errors thrown **synchronously within its block** (or awaited).
  It does **not** catch errors thrown later inside an asynchronous callback (e.g. a
  `setTimeout` callback), because that callback runs on a separate, empty call stack.
- An **unhandled promise rejection** is a rejected Promise with no rejection handler; it
  triggers an `unhandledrejection` event and is considered a bug.

---

## 10. Tricky Output Questions (rapid-fire)

```js
[1,2,3] + [4,5,6]        // "1,2,34,5,6"  — arrays coerce to strings, then concatenate
typeof NaN               // "number"      — NaN is of type number
0.1 + 0.2 === 0.3        // false         — IEEE-754 rounding
[] == ![]                // true          — ![] -> false -> 0; [] -> "" -> 0
[1,2,3].map(parseInt)    // [1, NaN, NaN] — parseInt receives (value, index) as radix
```
Be able to **explain the underlying rule** (coercion, floating point, closure) for each.

---

## 11. Must-Know Coding Patterns (implement from scratch)

### Debounce — postpone execution until calls have stopped for `delay` ms
```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### Throttle — allow at most one execution per `limit` ms
```js
function throttle(fn, limit) {
  let waiting = false;
  return function (...args) {
    if (waiting) return;
    fn.apply(this, args);
    waiting = true;
    setTimeout(() => (waiting = false), limit);
  };
}
```

### Deep clone (recursive)
```js
function deepClone(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(deepClone);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, deepClone(v)])
  );
}
```

### Memoize — cache results keyed by arguments
```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### Currying
```js
const curry = (fn) =>
  function curried(...args) {
    return args.length >= fn.length
      ? fn.apply(this, args)
      : (...rest) => curried.apply(this, [...args, ...rest]);
  };
```

### Flatten a nested array
```js
function flatten(arr) {
  return arr.reduce(
    (acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x),
    []
  );
}
```

### Implement Promise.all
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        if (++completed === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

---

## 12. Study Order (highest ROI first)

1. **Closures** (§3) — the most-asked single concept.
2. **Event loop & async** (§6) — output-ordering is near-guaranteed.
3. **`this` + bind/call/apply** (§4).
4. **`var`/`let`/`const`, hoisting, TDZ** (§1).
5. **Array methods, shallow vs deep copy** (§7).
6. **Prototypes** (§5) and **coercion** (§2, §10).
7. **Patterns** (§11) — debounce/throttle/deepClone as live-coding.

> Standard to follow in answers: **formal definition → one-line example → "why it matters."**
> Amazon asks *why*, not just *what*.
