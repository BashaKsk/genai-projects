// ============================================================
//  HOW useState "REMEMBERS" — IT'S JUST A CLOSURE
// ------------------------------------------------------------
//  Plain JS (run with: node react/useStateUnderTheHood.js)
//  No React needed — we BUILD a mini version of useState to
//  reveal the trick: the value is stored OUTSIDE the component
//  function, captured by a CLOSURE.
// ============================================================


// ============================================================
//  ❌ THE BROKEN MENTAL MODEL (why it SHOULD reset)
// ------------------------------------------------------------
//  A component is just a function. Every render = call it again.
//  If state lived INSIDE the function, it would reset every time.
// ============================================================
function BrokenCounter() {
  let count = 0;          // re-created from scratch on EVERY call
  count = count + 1;
  return count;
}

console.log("--- Broken (state inside the function) ---");
console.log(BrokenCounter()); // 1
console.log(BrokenCounter()); // 1  <-- never remembers! resets every call ❌
console.log(BrokenCounter()); // 1


// ============================================================
//  ✅ THE FIX — store state OUTSIDE, capture it with a CLOSURE
// ------------------------------------------------------------
//  This is a simplified version of what React actually does.
//  `state` lives in React's scope (here: createReact's scope),
//  NOT inside the component. The returned useState/setState
//  functions "close over" it — that's the closure.
// ============================================================
function createReact() {
  let state;                 // 🔒 lives HERE, survives across renders
  let isInitialized = false;
  let Component;             // the component function React will re-run

  // --- our mini useState ---
  function useState(initialValue) {
    if (!isInitialized) {    // only set on the very first render
      state = initialValue;
      isInitialized = true;
    }

    function setState(newValue) {
      state = newValue;      // update the value held in the closure ⬆️
      render();              // ...then re-run the component (re-render)
    }

    return [state, setState]; // same shape React gives you: [value, setter]
  }

  // --- re-run the component, like React does on each render ---
  function render() {
    const output = Component();
    console.log("🔄 render ->", output);
  }

  // --- register a component and do the first render ---
  function mount(componentFn) {
    Component = componentFn;
    render();
  }

  return { useState, mount };
}


// ============================================================
//  USING OUR MINI REACT
// ------------------------------------------------------------
//  Notice: `count` is re-declared every render (like the broken
//  version!) — BUT useState hands back the value preserved in
//  the closure, so it REMEMBERS. That's the whole secret.
// ============================================================
const React = createReact();

function Counter() {
  const [count, setCount] = React.useState(0);

  // Schedule one increment per render so we can watch it grow.
  // (In real React this would be an onClick handler.)
  if (count < 3) {
    setTimeout(() => setCount(count + 1), 0);
  }

  return `count is ${count}`;
}

console.log("\n--- Fixed (state stored in closure) ---");
React.mount(Counter);
// 🔄 render -> count is 0
// 🔄 render -> count is 1
// 🔄 render -> count is 2
// 🔄 render -> count is 3   <-- it REMEMBERS across renders ✅


// ============================================================
//  🧠 THE POINT:
//  The component function re-runs every render and `count` is
//  re-declared each time — but useState returns the value that
//  React kept alive in an OUTER scope (a closure). The closure
//  is the "memory" between renders.
//
//  Real React stores these in an array (one slot per hook),
//  which is exactly WHY hooks must be called in the same order
//  every render — but the core idea is this closure.
// ============================================================
