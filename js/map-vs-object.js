// =============================================================
// Map vs Object — the differences that actually bite you.
// Run:  node js/map-vs-object.js
// =============================================================

// -------------------------------------------------------------
// DIFF 1: Object keys are ALWAYS strings. Map keeps the real type.
// -------------------------------------------------------------
const obj = {};
obj[1] = "number one";
obj["1"] = "string one";          // SAME key! 1 got coerced to "1"
console.log("obj[1] =", obj[1]);  // "string one"  <- overwritten!

const map = new Map();
map.set(1, "number one");
map.set("1", "string one");       // two DIFFERENT keys
console.log("map.get(1) =", map.get(1));     // "number one"
console.log('map.get("1") =', map.get("1")); // "string one"

// -------------------------------------------------------------
// DIFF 2: Map can use ANY value as a key. Objects can't.
// -------------------------------------------------------------
const userA = { name: "Asha" };
const userB = { name: "Bilal" };

const lastSeen = new Map();
lastSeen.set(userA, "10:00").set(userB, "10:05");   // objects as keys!
console.log("lastSeen userA:", lastSeen.get(userA)); // "10:00"

const broken = {};
broken[userA] = "10:00";
broken[userB] = "10:05";          // both keys become "[object Object]" -> collision!
console.log("broken object keys:", Object.keys(broken)); // ["[object Object]"]

// -------------------------------------------------------------
// DIFF 3: Objects inherit keys from the prototype. Maps start empty.
// -------------------------------------------------------------
const o = {};
console.log('"toString" in o =', "toString" in o);          // true (inherited!)
const cleanMap = new Map();
console.log("cleanMap.has('toString') =", cleanMap.has("toString")); // false

// -------------------------------------------------------------
// DIFF 4: size + iteration are first-class on Map.
// -------------------------------------------------------------
console.log("map size:", map.size);                  // direct property
console.log("obj size:", Object.keys(obj).length);   // have to compute it

for (const [k, v] of map) {                          // Map iterates directly
  console.log(`  ${k} => ${v}`);
}
