// =============================================================
// JavaScript Map — playground.  Run:  node js/map-playground.js
// Read top to bottom, then change things and re-run.
// =============================================================

// ---- Create ----
const m = new Map();
const fromPairs = new Map([["a", 1], ["b", 2]]);
console.log("created from pairs:", fromPairs);

// ---- set (returns the Map -> chainable) ----
m.set("apple", 3).set("banana", 5).set("cherry", 2);

console.log(m);

console.log("after sets, size:", m.size);          // 3   (property, NO parens!)

// ---- get / has ----
console.log("get apple:", m.get("apple"));         // 3
console.log("get missing:", m.get("grape"));       // undefined
console.log("has banana:", m.has("banana"));       // true
console.log("has grape:", m.has("grape"));         // false

// ---- the counting idiom you used in firstUniqChar ----
const counts = new Map();
for (const ch of "banana") {
  counts.set(ch, (counts.get(ch) ?? 0) + 1);
}
console.log("letter counts:", counts);             // b:1, a:3, n:2

// ---- delete / clear ----
m.delete("cherry");
console.log("after delete cherry, size:", m.size); // 2

// ---- iterate (insertion order preserved) ----
console.log("keys:", [...m.keys()]);
console.log("values:", [...m.values()]);
console.log("entries:", [...m.entries()]);

for (const [key, value] of m) {                    // Map is directly iterable
  console.log(`  ${key} => ${value}`);
}

m.forEach((value, key) => {                         // NOTE: value first, key second!
  console.log(`  forEach ${key}: ${value}`);
});

// ---- keys can be ANY type (objects, not just strings) ----
const objKey = { id: 1 };
const weird = new Map();
weird.set(objKey, "tagged").set(42, "num").set(true, "bool");
console.log("object as key:", weird.get(objKey));   // "tagged"

// ---- convert to plain object / array ----
console.log("as object:", Object.fromEntries(m));   // { apple: 3, banana: 5 }
console.log("spread to array:", [...m]);            // [["apple",3],["banana",5]]
