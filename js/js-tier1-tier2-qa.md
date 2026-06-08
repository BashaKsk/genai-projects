# JavaScript Interview Q&A — Tier 1 & Tier 2

Curated for Amazon Support Engineer style interviews. Each question has a short answer + runnable code example.

---

# TIER 1 — Must Know Cold

## 1. `var` vs `let` vs `const` + hoisting + TDZ

**Answer:**
- `var` — function-scoped, hoisted and initialized to `undefined`, can be re-declared.
- `let` — block-scoped, hoisted but **not initialized** (Temporal Dead Zone until declaration).
- `const` — block-scoped, must be initialized, the *binding* is immutable (the value can still mutate if it's an object).

```javascript
console.log(a); // undefined  (var is hoisted + initialized)
var a = 1;

console.log(b); // ReferenceError — TDZ
let b = 2;

const obj = { x: 1 };
obj.x = 2;        // OK — mutating the object
// obj = {};      // TypeError — can't reassign the binding
```

---

## 2. Closures

**Answer:** A closure is a function that "remembers" variables from the scope where it was created, even after that outer scope has finished executing.

```javascript
function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
// `count` lives on because the inner function still references it.
```

**Classic bug — `var` in a loop:**

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2  (each iteration gets its own i)
}
```

**Use case — private state:**

```javascript
function createBankAccount(initial) {
  let balance = initial;
  return {
    deposit: (amt) => (balance += amt),
    getBalance: () => balance,
  };
}
const acc = createBankAccount(100);
acc.deposit(50);
acc.getBalance(); // 150
// `balance` is not directly accessible from outside — true privacy.
```

---

## 3. `this` binding rules

**Answer:** `this` is determined by **how a function is called**, not where it's defined. Four rules, in order of priority:

1. **`new` binding** — `new Fn()` → `this` = newly created object
2. **Explicit** — `fn.call(obj)` / `fn.apply(obj)` / `fn.bind(obj)`
3. **Implicit** — `obj.fn()` → `this` = `obj`
4. **Default** — standalone call → `this` = `undefined` (strict) or `globalThis` (sloppy)

**Arrow functions ignore all of this** — they inherit `this` from the enclosing lexical scope.

```javascript
const obj = {
  name: "Basha",
  regular() { return this.name; },
  arrow: () => this?.name,
};

obj.regular();              // "Basha" (implicit)
obj.arrow();                // undefined (arrow uses outer `this`)

const fn = obj.regular;
fn();                       // undefined in strict mode (default)

obj.regular.call({ name: "X" }); // "X" (explicit)
```

**Common gotcha — losing `this` in a callback:**

```javascript
class Timer {
  constructor() { this.seconds = 0; }
  start() {
    // setInterval(function () { this.seconds++; }, 1000);  // BROKEN: this = undefined
    setInterval(() => { this.seconds++; }, 1000);            // FIXED: arrow keeps `this`
  }
}
```

---

## 4. `call` / `apply` / `bind`

**Answer:** All three let you set `this` explicitly.
- `call(ctx, a, b)` — invokes immediately, args comma-separated.
- `apply(ctx, [a, b])` — invokes immediately, args as array.
- `bind(ctx, a)` — returns a new function with `this` (and optionally args) locked in.

```javascript
function greet(greeting, punc) {
  return `${greeting}, ${this.name}${punc}`;
}
const user = { name: "Basha" };

greet.call(user, "Hi", "!");          // "Hi, Basha!"
greet.apply(user, ["Hello", "."]);    // "Hello, Basha."
const bound = greet.bind(user, "Hey");
bound("?");                            // "Hey, Basha?"
```

**Implement `bind` from scratch:**

```javascript
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return function (...later) {
    return fn.apply(ctx, [...preset, ...later]);
  };
};
```

**Borrow array methods on array-like objects:**

```javascript
function toArray() {
  return Array.prototype.slice.call(arguments);
}
toArray(1, 2, 3); // [1, 2, 3]
```

---

## 5. Prototype & prototypal inheritance

**Answer:** Every object has a hidden `[[Prototype]]` link (`__proto__`). Property lookup walks up the chain until found or `null`. Functions also have a `prototype` property — the object that becomes `__proto__` for instances built with `new`.

```javascript
function Dog(name) { this.name = name; }
Dog.prototype.bark = function () { return `${this.name}: woof`; };

const rex = new Dog("Rex");
rex.bark();                          // "Rex: woof"
rex.__proto__ === Dog.prototype;     // true
```

**What `new` does, step by step:**
1. Creates a new empty object.
2. Links its `__proto__` to `Constructor.prototype`.
3. Calls the constructor with `this` = new object.
4. Returns the object (unless the constructor returns its own object).

**ES6 class is sugar over the same machinery:**

```javascript
class Animal {
  constructor(name) { this.name = name; }
  eat() { return `${this.name} eats`; }
}
class Dog extends Animal {
  bark() { return `${this.name} barks`; }
}
const d = new Dog("Rex");
d.eat();   // "Rex eats"   — found on Animal.prototype
d.bark();  // "Rex barks"  — found on Dog.prototype
```

**Lookup chain:** `d → Dog.prototype → Animal.prototype → Object.prototype → null`

---

## 6. Event loop — call stack, macrotasks, microtasks

**Answer:** JS runs on a single thread. Async callbacks wait in two queues:
- **Microtasks** — `Promise.then`, `queueMicrotask`, `MutationObserver`. Drained fully after each task.
- **Macrotasks** — `setTimeout`, `setInterval`, I/O, UI events.

After every synchronous block, **all microtasks run before the next macrotask**.

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");

// Output: 1, 4, 3, 2
// Reason: sync first, then microtask (Promise) drains before macrotask (setTimeout).
```

**Trickier one:**

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => {
  console.log("C");
  Promise.resolve().then(() => console.log("D"));
});
console.log("E");
// Output: A, E, C, D, B
// Microtask queue drains fully (C → D) before macrotask B.
```

---

## 7. Promises + async/await

**Answer:** A Promise is an object representing a future value. States: `pending` → `fulfilled` or `rejected`. `async/await` is syntactic sugar over `.then()`.

```javascript
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      id > 0 ? resolve({ id, name: "Basha" }) : reject(new Error("bad id"));
    }, 100);
  });
}

// .then style
fetchUser(1)
  .then(u => u.name)
  .then(console.log)
  .catch(console.error);

// async/await style
async function run() {
  try {
    const u = await fetchUser(1);
    console.log(u.name);
  } catch (e) {
    console.error(e);
  }
}
run();
```

**Combinators:**

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.reject("oops");

await Promise.all([p1, p2]);          // [1, 2]      — all resolve OR first rejection
await Promise.allSettled([p1, p3]);   // [{status:"fulfilled",value:1}, {status:"rejected",reason:"oops"}]
await Promise.race([p1, p3]);         // 1           — first to settle (resolve OR reject)
await Promise.any([p3, p1]);          // 1           — first to FULFILL
```

**Sequential vs parallel (common pitfall):**

```javascript
// SLOW — sequential, 300ms total
const a = await fetchUser(1);
const b = await fetchUser(2);
const c = await fetchUser(3);

// FAST — parallel, ~100ms total
const [a, b, c] = await Promise.all([fetchUser(1), fetchUser(2), fetchUser(3)]);
```

---

# TIER 2 — Strong Signal

## 8. Higher-order functions, `map` / `filter` / `reduce`

**Answer:** Higher-order functions take or return functions. `map`/`filter`/`reduce` are the canonical examples.

```javascript
const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);                 // [2, 4, 6, 8, 10]
nums.filter(n => n % 2 === 0);        // [2, 4]
nums.reduce((acc, n) => acc + n, 0);  // 15
```

**Implement `map` from scratch:**

```javascript
Array.prototype.myMap = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) out.push(cb(this[i], i, this));
  return out;
};
[1, 2, 3].myMap(x => x * 10); // [10, 20, 30]
```

---

## 9. Currying + partial application

**Answer:** Currying transforms `f(a, b, c)` into `f(a)(b)(c)`. Useful for reuse and composition.

```javascript
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6

// Generic curry
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...next) => curried(...args, ...next);
  };
}
const sum = curry((a, b, c) => a + b + c);
sum(1)(2)(3);     // 6
sum(1, 2)(3);     // 6
sum(1)(2, 3);     // 6
```

---

## 10. Debounce & throttle

**Answer:**
- **Debounce** — delay calls until the user stops triggering for `wait` ms. (Search input.)
- **Throttle** — fire at most once every `wait` ms. (Scroll, resize handlers.)

```javascript
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

const log = (...a) => console.log("called", a);
const dLog = debounce(log, 300);
const tLog = throttle(log, 300);
```

---

## 11. Deep clone

**Answer:** A deep clone copies an object recursively. Native `structuredClone` (Node 17+/modern browsers) handles cycles, Dates, Maps, Sets — prefer it. `JSON.parse(JSON.stringify(x))` is a one-liner but drops functions, `undefined`, dates, and breaks on cycles.

```javascript
// Modern, preferred
const copy = structuredClone(original);

// Manual implementation (interview-friendly, handles cycles)
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) return new Date(value);
  if (value instanceof Map) {
    const out = new Map(); seen.set(value, out);
    for (const [k, v] of value) out.set(deepClone(k, seen), deepClone(v, seen));
    return out;
  }
  if (Array.isArray(value)) {
    const out = []; seen.set(value, out);
    value.forEach((v, i) => (out[i] = deepClone(v, seen)));
    return out;
  }
  const out = {}; seen.set(value, out);
  for (const k of Object.keys(value)) out[k] = deepClone(value[k], seen);
  return out;
}
```

---

## 12. Polyfills — `Promise.all`

**Answer:** Resolves with an array of all results in order, or rejects with the first rejection.

```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        val => {
          results[i] = val;
          done++;
          if (done === promises.length) resolve(results);
        },
        reject
      );
    });
  });
}

promiseAll([Promise.resolve(1), 2, Promise.resolve(3)]).then(console.log); // [1, 2, 3]
```

---

## 13. ES6+ — destructuring, spread/rest, optional chaining, nullish coalescing

```javascript
// Destructuring with defaults + rename
const { name: userName = "anon", age = 0 } = { name: "Basha" };
// userName="Basha", age=0

// Array destructuring with rest
const [first, ...rest] = [1, 2, 3, 4];   // first=1, rest=[2,3,4]

// Spread — clone + merge
const a = { x: 1 };
const b = { ...a, y: 2 };                // { x:1, y:2 }

// Optional chaining
const user = { profile: null };
user?.profile?.name;                      // undefined  (no error)

// Nullish coalescing — only falls back on null/undefined (NOT 0 or "")
0 || "fallback";                          // "fallback"
0 ?? "fallback";                          // 0
```

---

## 14. Modules — ESM vs CommonJS

**Answer:**
- **CommonJS** (Node legacy) — `require()`, `module.exports`. Synchronous, runtime-resolved.
- **ESM** (modern standard) — `import`/`export`. Static, asynchronous, supports tree-shaking.

```javascript
// CommonJS
const fs = require("fs");
module.exports = { greet: () => "hi" };

// ESM
import fs from "fs";
export const greet = () => "hi";           // named
export default function () { return "hi"; } // default
```

In package.json: `"type": "module"` to use ESM by default.

---

## 15. Type coercion — `==` vs `===`, truthy/falsy, `NaN`

**Answer:**
- `==` coerces types; `===` does not. Always use `===` unless you have a reason.
- **Falsy values:** `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Everything else is truthy (including `[]` and `{}`).
- `NaN` is the only value not equal to itself. Use `Number.isNaN(x)`.

```javascript
0 == "0";          // true   (coerced)
0 === "0";         // false
null == undefined; // true   (special case)
null === undefined;// false
[] == false;       // true   (both coerce to 0)
NaN === NaN;       // false
Number.isNaN(NaN); // true

Boolean([]);       // true
Boolean({});       // true
Boolean("0");      // true   (non-empty string)
```

---

## Quick output-prediction warm-ups

Predict the output before scrolling:

```javascript
// Q1
console.log(typeof null);                // "object"  (historical bug)
console.log(typeof undefined);           // "undefined"
console.log(typeof NaN);                 // "number"

// Q2
const x = [1, 2, 3];
const y = x;
y.push(4);
console.log(x);                          // [1, 2, 3, 4]  (same reference)

// Q3
async function f() { return 1; }
console.log(f());                        // Promise { 1 }
f().then(console.log);                   // 1

// Q4
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3

// Q5
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1, 4, 3, 2
```

---

## Suggested practice plan

1. Read one section. Close the file.
2. Open a scratch file, re-write the example **from memory**.
3. Run it with `node js/<file>.js`.
4. Tweak one thing (change a value, swap arrow for regular function) — predict, then verify.
5. Move on only after the prediction matches reality.
