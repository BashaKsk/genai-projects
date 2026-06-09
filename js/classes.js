// ============================================================
//  JAVASCRIPT CLASSES  (run: node js/classes.js)
// ------------------------------------------------------------
//  KEY TRUTH: classes are SYNTACTIC SUGAR over prototypes.
//  Everything here could be written with prototypes (see
//  prototype.js) — class just makes it cleaner. The methods
//  still live on the prototype under the hood.
// ============================================================


// ============================================================
//  1) BASIC CLASS — constructor, fields, methods
// ============================================================
class Person {
  // public field (instance property)
  species = "human";

  // constructor: runs when you do `new Person(...)`
  constructor(name, age) {
    this.name = name; // `this` = the new instance being created
    this.age = age;
  }

  // a method — lives on Person.prototype (shared by all instances)
  greet() {
    return `Hi, I'm ${this.name}, age ${this.age}`;
  }
}

const basha = new Person("Basha", 25);
console.log("1)", basha.greet());            // Hi, I'm Basha, age 25
console.log("   species:", basha.species);   // human

// PROOF that methods live on the prototype (ties to prototype.js):
console.log("   greet on instance?  ", basha.hasOwnProperty("greet"));        // false
console.log("   greet on prototype? ", Person.prototype.hasOwnProperty("greet")); // true


// ============================================================
//  2) STATIC members — belong to the CLASS, not instances
// ============================================================
class MathHelper {
  static PI = 3.14159;              // static property
  static square(n) { return n * n; } // static method
}
console.log("\n2) static:", MathHelper.square(5), MathHelper.PI); // 25 3.14159
// You call them on the CLASS, not an instance:
// new MathHelper().square(5)  ❌  would be undefined


// ============================================================
//  3) GETTERS & SETTERS — look like properties, run like methods
// ============================================================
class Temperature {
  constructor(celsius) { this._celsius = celsius; }

  get fahrenheit() { return this._celsius * 9 / 5 + 32; } // read like a prop
  set fahrenheit(f) { this._celsius = (f - 32) * 5 / 9; } // write like a prop
}
const t = new Temperature(25);
console.log("\n3) getter:", t.fahrenheit); // 77  (no parentheses!)
t.fahrenheit = 212;                          // calls the setter
console.log("   after set, celsius:", t._celsius); // 100


// ============================================================
//  4) INHERITANCE — extends + super
// ============================================================
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}

class Dog extends Animal {        // Dog inherits from Animal
  constructor(name, breed) {
    super(name);                  // MUST call super() before using `this`
    this.breed = breed;
  }
  // override the parent method
  speak() {
    return `${super.speak()} — woof! (${this.breed})`; // super.method() calls parent
  }
}

const d = new Dog("Rex", "Lab");
console.log("\n4) inheritance:", d.speak()); // Rex makes a sound — woof! (Lab)
console.log("   is a Dog?   ", d instanceof Dog);    // true
console.log("   is an Animal?", d instanceof Animal); // true (inheritance chain)


// ============================================================
//  5) PRIVATE FIELDS — '#' truly private (not accessible outside)
// ============================================================
class BankAccount {
  #balance = 0;                 // private — cannot be read/written outside
  deposit(amount) { this.#balance += amount; return this.#balance; }
  get balance() { return this.#balance; }
}
const acc = new BankAccount();
acc.deposit(100);
console.log("\n5) private:", acc.balance); // 100
// console.log(acc.#balance); ❌ SyntaxError — truly private


// ============================================================
//  6) THE `this` TRAP — why class methods can "lose" this
// ------------------------------------------------------------
//  This is EXACTLY the React class-component pain. A normal
//  method loses its `this` when detached (e.g. passed as a
//  callback). Arrow-function fields fix it by binding `this`.
// ============================================================
class Counter {
  count = 0;

  // ❌ normal method — `this` depends on HOW it's called
  incrementBroken() { this.count++; }

  // ✅ arrow field — `this` is locked to the instance forever
  incrementSafe = () => { this.count++; };
}

const c = new Counter();
const detached = c.incrementSafe; // detach it (like passing to onClick)
detached();                        // still works — `this` is bound ✅
console.log("\n6) this-safe arrow:", c.count); // 1

// const broken = c.incrementBroken;
// broken(); // ❌ would throw: Cannot read 'count' of undefined (this is lost)

// ============================================================
//  🧠 INTERVIEW SUMMARY:
//   • class = sugar over prototypes; methods live on .prototype
//   • constructor runs on `new`; `this` = the new instance
//   • static = on the class, not instances
//   • get/set = property-like accessors
//   • extends + super = inheritance (call super() first!)
//   • #field = truly private
//   • arrow-function fields bind `this` (fixes the detach trap —
//     same reason old React class components needed .bind(this))
// ============================================================
