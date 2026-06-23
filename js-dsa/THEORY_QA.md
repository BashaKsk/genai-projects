# JS / TS / React — Theory Q&A

> For Amazon Support Engineer screening. Read the question, answer out loud in 30–60 seconds, then check. The interviewer wants concise, structured answers — not a lecture.

**Answer format that scores well:** *one-line definition → key detail → tiny example or contrast.*

---

# JavaScript

## 1. `var` vs `let` vs `const`

- **`var`** — function-scoped, hoisted and initialized as `undefined`, can be redeclared.
- **`let`** — block-scoped, hoisted but in the **Temporal Dead Zone** until the declaration line.
- **`const`** — block-scoped, must be initialized, can't be reassigned (but objects/arrays it points to are still mutable).

```js
console.log(x); // undefined (hoisted)
var x = 5;

console.log(y); // ReferenceError — TDZ
let y = 5;
```

---

## 2. What is hoisting?

JavaScript moves **declarations** (not initializations) to the top of their scope at compile time. `var` declarations are hoisted and initialized to `undefined`. Function declarations are fully hoisted (you can call them before they appear). `let`/`const` are hoisted but in the TDZ.

---

## 3. Explain closures

A closure is a function that **remembers variables from its lexical scope** even when called outside that scope.

```js
function counter() {
    let count = 0;
    return () => ++count;
}
const inc = counter();
inc(); // 1
inc(); // 2
```

**Real-world uses:** private state, function factories, memoization, event handler state.

---

## 4. `==` vs `===`

- `==` does **type coercion** before comparing (`0 == '0'` → true, `null == undefined` → true).
- `===` checks **type and value** without coercion.

**Always use `===`** unless you specifically want coercion (`x == null` to check both null and undefined is one common exception).

---

## 5. Explain the event loop

JS is single-threaded with a non-blocking concurrency model:

1. **Call stack** — executes synchronous code.
2. **Web APIs / browser** — handle async ops (timers, fetch, DOM events).
3. **Microtask queue** — Promises, `queueMicrotask`, `MutationObserver`. **Higher priority.**
4. **Macrotask queue** — `setTimeout`, `setInterval`, I/O, UI events.

The event loop: when the call stack is empty, drain **all microtasks**, then take **one macrotask**, repeat.

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
```

---

## 6. Promise vs callback vs async/await

- **Callback** — function passed to be called later. Leads to "callback hell" when nested.
- **Promise** — object representing future value. States: pending, fulfilled, rejected. Chainable with `.then`/`.catch`/`.finally`.
- **async/await** — syntactic sugar over Promises. `async` functions always return a Promise; `await` pauses execution until the Promise resolves.

```js
async function getData() {
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (err) {
        // handles both fetch and json() errors
    }
}
```

---

## 7. `Promise.all` vs `Promise.allSettled` vs `Promise.race` vs `Promise.any`

- **`all`** — resolves when *all* resolve; rejects if *any* rejects (fail-fast).
- **`allSettled`** — waits for all, never rejects, returns array of `{status, value/reason}`.
- **`race`** — settles with the **first** to settle (resolve or reject).
- **`any`** — resolves with the first to **resolve**; rejects only if all reject.

---

## 8. How does `this` work?

`this` is determined by **how a function is called**, not where it's defined:

- **Method call** `obj.fn()` → `this = obj`
- **Function call** `fn()` → `undefined` (strict) or `globalThis`
- **Constructor** `new Fn()` → new object
- **Explicit** `fn.call(ctx)` / `fn.apply(ctx)` / `fn.bind(ctx)` → `ctx`
- **Arrow function** → `this` from the **enclosing lexical scope** (cannot be reassigned, even with `.call`)

```js
const obj = {
    name: 'A',
    regular() { return this.name; },     // 'A'
    arrow: () => this.name               // undefined — this is the outer scope
};
```

---

## 9. `call` vs `apply` vs `bind`

All three set `this`:

- **`call(ctx, arg1, arg2)`** — invokes immediately with args spread.
- **`apply(ctx, [args])`** — invokes immediately with args as array.
- **`bind(ctx, arg1, ...)`** — returns a **new function** with `this` permanently bound (and optionally partially applied args).

```js
fn.call(obj, 1, 2);
fn.apply(obj, [1, 2]);
const bound = fn.bind(obj, 1); bound(2);
```

---

## 10. Shallow copy vs deep copy

- **Shallow** copies top-level properties; nested objects are still references. Done with `{...obj}`, `Object.assign({}, obj)`, `arr.slice()`.
- **Deep** copies recursively. `structuredClone(obj)` (modern, native), or `JSON.parse(JSON.stringify(obj))` (loses functions, Dates become strings, can't handle cycles).

---

## 11. Pass by value or reference?

JavaScript is always **pass by value** — but for objects, the value being passed is a **reference**. So you can mutate the object's properties from inside the function, but reassigning the parameter doesn't affect the caller.

```js
function f(o) {
    o.x = 1;       // visible outside
    o = {x: 99};   // NOT visible outside
}
```

---

## 12. Explain prototypal inheritance

Every JS object has an internal `[[Prototype]]` link (accessible via `Object.getPrototypeOf`). When you access a property, JS walks the prototype chain until it finds it or hits `null`.

```js
class Animal { speak() { return 'sound'; } }
class Dog extends Animal { bark() { return 'woof'; } }
const d = new Dog();
d.bark();  // own class
d.speak(); // via prototype chain
```

`class` is syntactic sugar over the prototype chain.

---

## 13. Debounce vs throttle

- **Debounce** — wait until the user *stops* triggering for X ms, then fire. Useful for search-as-you-type.
- **Throttle** — fire at most once per X ms, regardless of how many triggers. Useful for scroll/resize handlers.

```js
function debounce(fn, ms) {
    let id;
    return (...args) => {
        clearTimeout(id);
        id = setTimeout(() => fn(...args), ms);
    };
}
function throttle(fn, ms) {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last >= ms) { last = now; fn(...args); }
    };
}
```

---

## 14. What is currying?

Transforming `f(a, b, c)` into `f(a)(b)(c)` — returning successive functions until all args are collected. Useful for partial application.

```js
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6
```

---

## 15. Event delegation

Attach **one event listener on a parent**, use `event.target` to identify which child triggered it. Saves memory, works with dynamically added children.

```js
list.addEventListener('click', e => {
    if (e.target.matches('li.item')) {
        // handle click on item
    }
});
```

---

## 16. Difference between `null` and `undefined`

- **`undefined`** — variable declared but no value assigned; missing function arg; missing object property.
- **`null`** — intentional "no value" assigned by you.

`typeof undefined === 'undefined'`, `typeof null === 'object'` (legacy bug).

---

## 17. What is the spread operator? Rest parameters?

Same syntax `...`, different roles:

- **Spread** — expands an iterable: `[...arr]`, `{...obj}`, `fn(...args)`.
- **Rest** — collects remaining args into an array: `function f(...args)`, `const [a, ...rest] = arr`.

---

## 18. Map vs Object

- **Object** — string/Symbol keys, has prototype chain (key collisions possible like `toString`), no built-in size.
- **Map** — any value as key (including objects), preserves insertion order, has `.size`, faster for frequent add/remove.

Use Map when keys aren't strings or when you need ordered iteration / size.

---

## 19. `Array.forEach` vs `.map` vs `.reduce` vs `.filter`

- **`forEach`** — iterates, returns `undefined`. Side effects.
- **`map`** — returns new array, same length, transformed.
- **`filter`** — returns new array with elements where predicate is true.
- **`reduce`** — accumulates into single value.

`forEach` can't be broken out of (no `break`); use `for...of` if you need early exit.

---

## 20. What is a generator?

A function (declared with `function*`) that can pause and resume, yielding values lazily.

```js
function* counter() {
    let i = 0;
    while (true) yield i++;
}
const g = counter();
g.next().value; // 0
g.next().value; // 1
```

Used for lazy sequences, async iteration, and (older) coroutines.

---

## 21. What is the difference between `Object.freeze` and `const`?

- **`const`** prevents reassignment of the variable.
- **`Object.freeze(obj)`** prevents adding/removing/modifying properties of the object (shallow — nested objects still mutable).

```js
const o = {x: 1};
o.x = 2;       // OK — const doesn't freeze contents
Object.freeze(o);
o.x = 3;       // silently fails (throws in strict mode)
```

---

# TypeScript

## 1. `interface` vs `type`

Both define shapes. Key differences:

- **`interface`** — extendable via `extends`, can be **merged** (declaration merging — multiple `interface Foo {}` in same scope combine).
- **`type`** — supports unions (`type A = B | C`), intersections, primitives, tuples, mapped types. **Cannot be re-opened.**

**Rule of thumb:** use `interface` for object shapes you might extend; use `type` for unions, primitives, or computed types.

---

## 2. `any` vs `unknown` vs `never`

- **`any`** — disables type checking entirely. Avoid.
- **`unknown`** — top type. Anything assignable to it, but you must **narrow** before using.
- **`never`** — bottom type. Function that never returns (throws or infinite loop), or impossible branch.

```ts
function fail(msg: string): never { throw new Error(msg); }

function check(x: unknown) {
    // x.toUpperCase(); // error — must narrow first
    if (typeof x === 'string') x.toUpperCase(); // OK
}
```

---

## 3. Explain generics

Parametric types — write code that works over multiple types without losing type safety.

```ts
function identity<T>(x: T): T { return x; }
identity<string>('a'); // typed as string
identity(42);          // T inferred as number
```

Constrain generics with `extends`:
```ts
function getLength<T extends { length: number }>(x: T) { return x.length; }
```

---

## 4. Common utility types

- **`Partial<T>`** — all props optional.
- **`Required<T>`** — all props required.
- **`Readonly<T>`** — all props readonly.
- **`Pick<T, K>`** — keep only keys in `K`.
- **`Omit<T, K>`** — remove keys in `K`.
- **`Record<K, V>`** — object with keys of type K, values of type V.
- **`Exclude<T, U>`** — remove `U` from union `T`.
- **`Extract<T, U>`** — keep only `U` from union `T`.
- **`ReturnType<T>`** — return type of function.
- **`Parameters<T>`** — tuple of parameter types.
- **`Awaited<T>`** — unwraps a Promise.

```ts
type User = { id: number; name: string; email: string };
type UserPreview = Pick<User, 'id' | 'name'>;
type UserUpdate = Partial<User>;
type UserMap = Record<string, User>;
```

---

## 5. Union vs intersection

- **Union `A | B`** — value is *either* A or B. Must narrow to access non-shared properties.
- **Intersection `A & B`** — value is *both* A and B (combines properties).

```ts
type Cat = { meow: () => void };
type Dog = { bark: () => void };
type Either = Cat | Dog;     // has neither method available directly
type Both = Cat & Dog;       // has both methods
```

---

## 6. What is type narrowing? Give examples.

Refining a broader type to a more specific one based on runtime checks:

- **`typeof`** — for primitives: `if (typeof x === 'string')`
- **`instanceof`** — for classes: `if (x instanceof Date)`
- **`in`** — property check: `if ('bark' in animal)`
- **Equality** — `if (x === null)`
- **User-defined type guard** — `function isUser(x: unknown): x is User { ... }`

---

## 7. Discriminated unions

A union where each member has a **literal discriminant property**, allowing exhaustive narrowing.

```ts
type Shape =
    | { kind: 'circle'; radius: number }
    | { kind: 'square'; side: number };

function area(s: Shape) {
    switch (s.kind) {
        case 'circle': return Math.PI * s.radius ** 2;
        case 'square': return s.side ** 2;
    }
}
```

Add a `never` default for exhaustiveness checking:
```ts
default: const _exhaustive: never = s;
```

---

## 8. `enum` vs union of string literals

- **`enum`** — generates runtime code, adds bundle size, has reverse mapping (numeric enums).
- **Union of literals** — purely compile-time, zero runtime cost, generally preferred.

```ts
// Prefer:
type Status = 'pending' | 'active' | 'done';

// Over:
enum Status { Pending = 'pending', Active = 'active', Done = 'done' }
```

`const enum` is inlined at compile time — better, but disallowed in some build setups (`isolatedModules`).

---

## 9. `as` (type assertion) vs type casting

TypeScript has no runtime casting — `as` is a compile-time **assertion** telling the compiler "trust me, this is type X." It doesn't actually convert anything.

```ts
const el = document.getElementById('btn') as HTMLButtonElement;
```

Misuse hides bugs. Prefer type guards when possible.

---

## 10. What are mapped types?

Create a new type by transforming each property of another type.

```ts
type Optional<T> = { [K in keyof T]?: T[K] };
type Stringify<T> = { [K in keyof T]: string };
```

With modifiers:
```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
```

---

## 11. `readonly` modifier

Marks a property as immutable (compile-time only).

```ts
interface User { readonly id: number; name: string; }
const u: User = { id: 1, name: 'A' };
u.id = 2; // error
u.name = 'B'; // OK
```

For arrays: `readonly T[]` or `ReadonlyArray<T>`.

---

## 12. What is `as const`?

Asserts a value as deeply readonly with literal types instead of widened types.

```ts
const config = { env: 'prod', port: 3000 };
// type: { env: string; port: number }

const config2 = { env: 'prod', port: 3000 } as const;
// type: { readonly env: 'prod'; readonly port: 3000 }
```

Useful for action-type constants and lookup objects.

---

## 13. `void` vs `undefined` as return type

- **`void`** — caller shouldn't use the return value (allows functions returning anything to be assigned where `void` is expected).
- **`undefined`** — function explicitly returns `undefined`.

```ts
const fns: (() => void)[] = [];
fns.push(() => 42); // OK — return value ignored
```

---

## 14. Index signatures

Allow arbitrary keys of a given type.

```ts
interface Dict { [key: string]: number; }
const d: Dict = { a: 1, b: 2 };
```

Modern preference: `Record<string, number>`.

---

## 15. `keyof` and `typeof` operators

- **`keyof T`** — union of T's property names.
- **`typeof x`** (in type position) — extracts the type of a runtime value.

```ts
const obj = { a: 1, b: 'x' };
type Keys = keyof typeof obj; // 'a' | 'b'
```

---

# React

## 1. Virtual DOM and reconciliation

The Virtual DOM is an in-memory representation of the UI. On state change, React:

1. Builds a new VDOM tree.
2. **Diffs** it against the previous tree.
3. Computes minimal real DOM mutations.
4. Applies them.

This is faster than re-rendering the actual DOM each time. Reconciliation uses heuristics: same type → update props; different type → unmount + remount.

---

## 2. Why are keys important in lists?

Keys help React identify which items changed, were added, or removed across renders. **Without stable keys, React falls back to index-based diffing**, which causes wrong updates when items are reordered/inserted (state attached to the wrong element, animations break, focus jumps).

**Rules:**
- Stable across renders (don't use `Math.random()`).
- Unique among siblings.
- Avoid array index as key when list can reorder.

---

## 3. Functional vs class components

- **Class** — `class X extends React.Component`, uses `state`, lifecycle methods (`componentDidMount`, etc.).
- **Functional** — plain function, uses **Hooks** for state and side effects.

Functional + Hooks is the modern standard. Less boilerplate, easier composition, no `this` headaches.

---

## 4. Rules of Hooks

1. **Only call at the top level.** Not inside loops, conditions, or nested functions.
2. **Only call from React functions** (components or custom hooks).

**Why:** React tracks hook state by call order. Conditional calls break the index → wrong state mapping.

---

## 5. `useState` — does it merge or replace?

It **replaces**, unlike class `setState` which merged.

```js
const [user, setUser] = useState({ name: 'A', age: 30 });
setUser({ name: 'B' }); // age is gone!
setUser(prev => ({ ...prev, name: 'B' })); // correct
```

Also: pass a **function to setState** when the new state depends on the previous — avoids stale closures.

---

## 6. `useEffect` — explain the dependency array

- **No array** — runs after every render.
- **Empty array `[]`** — runs once after mount (and cleanup on unmount).
- **`[a, b]`** — runs when `a` or `b` changes (referential equality, not deep).

The return function is the **cleanup** — runs before the next effect AND on unmount. Use it for unsubscribing, clearing timers, aborting fetches.

```js
useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
}, []);
```

---

## 7. `useMemo` vs `useCallback`

- **`useMemo(fn, deps)`** — caches the **result** of `fn`. Use for expensive computations.
- **`useCallback(fn, deps)`** — caches the **function reference**. Use when passing callbacks to memoized children.

```js
const sorted = useMemo(() => list.sort(), [list]);
const handleClick = useCallback(() => doSomething(id), [id]);
```

**Don't over-memoize** — these have a cost too. Only when there's a measured benefit.

---

## 8. `useRef` — what are the use cases?

1. **Access DOM nodes** — `const ref = useRef(null); <input ref={ref} />` → `ref.current`.
2. **Persist mutable values across renders without re-rendering** — like a "box" outside React's state system. Good for timer IDs, previous value tracking, instance variables.

```js
const renderCount = useRef(0);
useEffect(() => { renderCount.current++; });
```

---

## 9. Context API — when to use, when to avoid

**Good for:** auth, theme, locale — values that rarely change and are needed deep in the tree.

**Avoid for:** frequently changing values — every consumer re-renders when the context value changes. For app state, prefer Zustand/Redux/Jotai/etc.

```js
const ThemeContext = createContext('light');
// Provider
<ThemeContext.Provider value="dark">...</ThemeContext.Provider>
// Consumer
const theme = useContext(ThemeContext);
```

---

## 10. Controlled vs uncontrolled components

- **Controlled** — React state is the source of truth. Form value comes from `useState`, updates via `onChange`.
- **Uncontrolled** — DOM is the source of truth. Read via `ref` (`inputRef.current.value`). Use `defaultValue` for initial.

Controlled gives you validation/transformation on every keystroke; uncontrolled is lighter for simple forms.

---

## 11. Class lifecycle vs Hooks mapping

| Class                       | Hook equivalent                              |
|-----------------------------|----------------------------------------------|
| `constructor`               | `useState(initial)`                          |
| `componentDidMount`         | `useEffect(() => {...}, [])`                 |
| `componentDidUpdate`        | `useEffect(() => {...}, [deps])`             |
| `componentWillUnmount`      | cleanup function returned from `useEffect`   |
| `shouldComponentUpdate`     | `React.memo` + `useMemo`/`useCallback`       |
| `getDerivedStateFromProps`  | derive in render, or `useState` + `useEffect`|

---

## 12. `React.memo`

Higher-order component that memoizes a component's rendered output. Re-renders only when props change (shallow compare).

```js
const Child = React.memo(({ value }) => <div>{value}</div>);
```

**Pitfall:** if you pass new object/array/function literals as props, shallow compare always says "changed." That's why `useCallback`/`useMemo` pair with `React.memo`.

---

## 13. State lifting

When two siblings need to share state, move the state to their **closest common parent** and pass it down via props. This is "single source of truth."

---

## 14. `React.lazy` and Suspense (code splitting)

```js
const Heavy = React.lazy(() => import('./Heavy'));
<Suspense fallback={<Spinner />}>
    <Heavy />
</Suspense>
```

`lazy` returns a component that loads on first render. `Suspense` shows the fallback while loading. Reduces initial bundle size.

---

## 15. Error boundaries

A class component (no hook equivalent yet) that catches errors in its child tree and shows a fallback UI. Implement `componentDidCatch` and `static getDerivedStateFromError`.

**Doesn't catch:** event handlers, async code, SSR, errors in the boundary itself.

---

## 16. HOC vs Custom Hook vs Render Prop

Three patterns for sharing logic:

- **HOC** — `withAuth(Component)`. Wraps a component. Older pattern, can cause "wrapper hell."
- **Render prop** — `<Mouse>{({x, y}) => ...}</Mouse>`. Flexible but verbose.
- **Custom hook** — `useAuth()`. Modern preferred way. Cleaner composition, no extra components.

```js
function useFetch(url) {
    const [data, setData] = useState(null);
    useEffect(() => { fetch(url).then(r => r.json()).then(setData); }, [url]);
    return data;
}
```

---

## 17. `useState` vs `useReducer`

- **`useState`** — simple, independent state values.
- **`useReducer`** — when next state depends on previous in complex ways, or when several values change together. Same pattern as Redux but local.

```js
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'INCREMENT' });
```

---

## 18. What does `StrictMode` do?

A dev-only wrapper that helps catch bugs. It:

- Intentionally **double-invokes** functional components, `useState` initializers, effects (so impure code or missing cleanups surface).
- Warns about deprecated APIs.
- No effect in production.

---

## 19. React 18 — what changed?

- **Automatic batching** — state updates inside Promises, timeouts, native handlers are now batched (previously only React events were).
- **`useTransition`** — mark updates as non-urgent (e.g., search-result filtering). Keeps UI responsive.
- **`useDeferredValue`** — defer rendering of a value until urgent updates settle.
- **Suspense for data fetching** — works with frameworks.
- **Concurrent rendering** — React can interrupt and resume renders.

---

## 20. What happens when you call `setState`?

1. React schedules a re-render (doesn't render immediately).
2. Multiple `setState` calls in the same handler are **batched** into one render (React 18: across all contexts).
3. React calls your component function again with the new state.
4. The new VDOM is diffed against the old.
5. Real DOM is updated minimally.
6. Effects with changed deps run after the DOM is updated.

---

## 21. Why is state in React immutable?

React uses `Object.is` to compare prev/next state. Mutating the existing object means **the reference is the same** → React skips the update.

```js
// WRONG — same reference, no re-render
const [items, setItems] = useState([]);
items.push(newItem);
setItems(items);

// CORRECT — new reference
setItems([...items, newItem]);
```

---

## 22. What is prop drilling? Solutions?

Passing props through many layers just so a deep child can use them. Solutions:

1. **Context** — for app-wide config-like values.
2. **State management** — Redux, Zustand, Jotai.
3. **Component composition** — pass children instead of props (sometimes simpler).
4. **Co-locate state** — maybe the state doesn't need to live so high up.

---

## 23. CSR vs SSR vs SSG

- **CSR (Client-Side Rendering)** — empty HTML, JS renders. Slower first paint, simpler.
- **SSR (Server-Side Rendering)** — server renders HTML per request. Faster first paint, SEO-friendly, more server load.
- **SSG (Static Site Generation)** — HTML built at build time. Fastest, but content is static.

Next.js supports all three per-page.

---

# Quick rapid-fire (answer in 10 seconds each)

1. **Difference between `slice` and `splice`?** → `slice` returns a new array, doesn't mutate. `splice` mutates and returns removed elements.
2. **What does `Object.freeze` not do?** → Doesn't freeze nested objects (it's shallow).
3. **What's the difference between `for...in` and `for...of`?** → `for...in` iterates keys (including inherited). `for...of` iterates values of iterables.
4. **Is JS single-threaded?** → Yes, one main thread + event loop. Web Workers add separate threads.
5. **What's `JSON.stringify` limit?** → Can't handle circular refs, functions, undefined, BigInt, Symbol.
6. **What's a memory leak in React?** → Common: not cleaning up subscriptions/timers in `useEffect`, refs holding large objects, closures capturing stale state.
7. **What's hydration in SSR?** → Attaching React event handlers to server-rendered HTML on the client.
8. **What's a pure component?** → Same props → same output, no side effects.
9. **What's reconciliation key for keyed lists do?** → Tells React which old element corresponds to which new element.
10. **`null` vs `undefined` in TS — assignable to each other?** → Not by default (strict mode). Each is its own type unless `--strictNullChecks` is off.

---

# What to do day-of the interview

- **Talk first.** State approach in plain English before going technical.
- **Compare and contrast.** Interviewers love hearing trade-offs ("X is faster but uses more memory; Y is simpler but...").
- **Admit gaps cleanly.** "I haven't used X in production, but I understand it as..." is better than guessing.
- **Tie to experience.** Where you can, ground answers in real work — "we used useMemo for a heavy filter computation in a 5000-row table."
