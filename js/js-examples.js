// =============================================================
// JS Interview — runnable examples, section by section.
// Mirrors js-interview-prep.md. Run:  node js/js-examples.js
// Read each block, predict the output, THEN check the comment.
// =============================================================

const line = (s) => console.log("\n========== " + s + " ==========");

// =============================================================
line("1. SCOPE & HOISTING");
// =============================================================

// var is hoisted as undefined; let is in the TDZ (would throw)
console.log(typeof hoistedVar); // "undefined"  (declared below, hoisted)
var hoistedVar = 10;
// console.log(notYet); let notYet = 1;  // ReferenceError (TDZ) -- try uncommenting

// var vs let in a loop with async callbacks
for (var i = 0; i < 3; i++) setTimeout(() => process.stdout.write("var:" + i + " "), 0);
for (let j = 0; j < 3; j++) setTimeout(() => process.stdout.write("let:" + j + " "), 0);
// after the sync code finishes:  var:3 var:3 var:3   let:0 let:1 let:2
setTimeout(() => console.log(""), 5);

// block scope
{
  let blockScoped = "inside";
  var functionScoped = "leaks out";
}
console.log(functionScoped); // "leaks out"  (var ignores the block)
// console.log(blockScoped);  // ReferenceError


// =============================================================
line("2. TYPES & COERCION");
// =============================================================

console.log(typeof null);        // "object"   (historical bug)
console.log(typeof undefined);   // "undefined"
console.log(typeof NaN);         // "number"
console.log(typeof []);          // "object"
console.log(typeof function(){});// "function"

console.log(5 + "5");            // "55"   (number -> string, concat)
console.log("5" - 2);            // 3      (string -> number)
console.log(true + 1);           // 2      (true -> 1)
console.log(0.1 + 0.2);          // 0.30000000000000004  (IEEE-754)
console.log(0.1 + 0.2 === 0.3);  // false

console.log(null == undefined);  // true   (loose: special-cased equal)
console.log(null === undefined); // false  (strict: different types)
console.log(NaN === NaN);        // false  -> use Number.isNaN()
console.log(Number.isNaN(NaN));  // true


// =============================================================
line("3. CLOSURES");
// =============================================================

function makeCounter() {
  let count = 0;                 // private; survives after makeCounter returns
  return {
    inc: () => ++count,
    dec: () => --count,
    value: () => count,
  };
}
const counter = makeCounter();
counter.inc();
counter.inc();
console.log("counter:", counter.value()); // 2  (state preserved across calls)

// Each call to makeAdder closes over its OWN x
function makeAdder(x) {
  return (y) => x + y;
}
const add5 = makeAdder(5);
const add10 = makeAdder(10);
console.log(add5(2), add10(2)); // 7 12  (independent closures)


// =============================================================
line("4. THIS, CALL / APPLY / BIND");
// =============================================================

const person = {
  name: "Asha",
  greet() { return "Hi, " + this.name; },
};
console.log(person.greet()); // "Hi, Asha"  (implicit binding -> person)

const detached = person.greet;
// console.log(detached());  // would throw / undefined: `this` is now undefined

const other = { name: "Bilal" };
console.log(person.greet.call(other));    // "Hi, Bilal"  (explicit)
console.log(person.greet.apply(other));   // "Hi, Bilal"  (args as array)
const bound = person.greet.bind(other);
console.log(bound());                     // "Hi, Bilal"  (permanently bound)
person.greet()
console.log(`post permenanty bounded: ${bound()}`)

// arrow function captures `this` lexically
const timerObj = {
  name: "Timer",
  startBroken() { setTimeout(function () { /* this.name undefined */ }, 0); },
  startFixed() { setTimeout(() => console.log("arrow this.name:", this.name), 0); },
};
timerObj.startFixed(); // "arrow this.name: Timer"


// =============================================================
line("5. PROTOTYPES & INHERITANCE");
// =============================================================

function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name + " makes a sound"; };

class Dog extends Animal {        // class is sugar over prototypes
  speak() { return this.name + " barks"; }
}
const a = new Animal("Generic");
const d = new Dog("Rex");
console.log(a.speak());           // "Generic makes a sound"
console.log(d.speak());           // "Rex barks"   (override)
console.log(d instanceof Animal); // true  (Animal.prototype is in d's chain)
console.log(Object.getPrototypeOf(d) === Dog.prototype); // true


// =============================================================
line("6. EVENT LOOP & ASYNC");
// =============================================================

console.log("A (sync)");
setTimeout(() => console.log("D (macrotask)"), 0);
Promise.resolve().then(() => console.log("C (microtask)"));
console.log("B (sync)");
// Order:  A, B, C, D   (sync -> microtasks -> macrotasks)

// Promise combinators
async function demoCombinators() {
  const p = (v, ms) => new Promise((res) => setTimeout(() => res(v), ms));
  const all = await Promise.all([p(1, 5), p(2, 5)]);
  console.log("Promise.all:", all);          // [1, 2]
  const first = await Promise.race([p("fast", 5), p("slow", 20)]);
  console.log("Promise.race:", first);       // "fast"
}
demoCombinators();

// async/await error handling
async function risky() {
  try {
    await Promise.reject(new Error("boom"));
  } catch (e) {
    console.log("caught:", e.message);       // "caught: boom"
  }
}
risky();


// =============================================================
line("7. OBJECTS, ARRAYS & COPYING");
// =============================================================

const nums = [1, 2, 3, 4, 5];
console.log("map:", nums.map((n) => n * 2));        // [2,4,6,8,10]
console.log("filter:", nums.filter((n) => n % 2));  // [1,3,5]
console.log("reduce:", nums.reduce((a, b) => a + b, 0)); // 15
console.log("find:", nums.find((n) => n > 3));      // 4
console.log("some:", nums.some((n) => n > 4));      // true
console.log("every:", nums.every((n) => n > 0));    // true

// sort gotcha
console.log([10, 2, 1].sort());                     // [1, 10, 2]  (lexicographic!)
console.log([10, 2, 1].sort((x, y) => x - y));      // [1, 2, 10]  (numeric)

// shallow vs deep copy
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 99;
console.log("shared nested:", original.nested.b);   // 99  (shallow shares the ref!)

const deep = structuredClone({ a: 1, nested: { b: 2 } });
deep.nested.b = 99;
console.log("deep stays:", 2);                       // original unaffected


// =============================================================
line("8. ES6+ FEATURES");
// =============================================================

const [first, ...others] = [1, 2, 3, 4];            // destructuring + rest
console.log(first, others);                          // 1 [2,3,4]

const { name = "default", age } = { age: 30 };       // destructuring + default
console.log(name, age);                              // "default" 30

const merged = { ...{ a: 1 }, ...{ b: 2 } };         // spread merge
console.log(merged);                                 // { a:1, b:2 }

const user = { profile: null };
console.log(user.profile?.email ?? "no email");      // "no email" (?. and ??)

function* idGen() { let id = 1; while (true) yield id++; } // generator
const gen = idGen();
console.log(gen.next().value, gen.next().value);     // 1 2


// =============================================================
line("9. ERROR HANDLING");
// =============================================================

class ValidationError extends Error {
  constructor(message) { super(message); this.name = "ValidationError"; }
}
try {
  throw new ValidationError("invalid input");
} catch (e) {
  console.log(`${e.name}: ${e.message}`);            // "ValidationError: invalid input"
} finally {
  console.log("finally always runs");
}

// try/catch does NOT catch async errors thrown in a later callback:
try {
  setTimeout(() => { /* throw new Error("x") would NOT be caught here */ }, 0);
} catch (e) {
  console.log("never reached");
}


// =============================================================
line("11. CODING PATTERNS");
// =============================================================

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
const logDebounced = debounce((x) => console.log("debounced:", x), 10);
logDebounced(1); logDebounced(2); logDebounced(3); // only "debounced: 3" fires

function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
const slowSquare = (n) => n * n;
const fastSquare = memoize(slowSquare);
console.log("memoize:", fastSquare(4), fastSquare(4)); // 16 16 (2nd from cache)

function flatten(arr) {
  return arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), []);
}
console.log("flatten:", flatten([1, [2, [3, [4]]], 5])); // [1,2,3,4,5]

const curry = (fn) =>
  function curried(...args) {
    return args.length >= fn.length
      ? fn.apply(this, args)
      : (...rest) => curried.apply(this, [...args, ...rest]);
  };
const sum3 = curry((a, b, c) => a + b + c);
console.log("curry:", sum3(1)(2)(3), sum3(1, 2)(3), sum3(1, 2, 3)); // 6 6 6
