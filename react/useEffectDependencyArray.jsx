// ============================================================
//  useEffect: DEPENDENCY ARRAY  ↔  CLASS LIFECYCLE METHODS
// ------------------------------------------------------------
//  The dependency array (2nd argument) controls WHEN the effect
//  runs. Each variation maps to an old class lifecycle method.
//
//      [ ]        -> componentDidMount      (run once)
//      [dep]      -> componentDidUpdate     (run when dep changes)
//      (omitted)  -> runs after EVERY render
//      return ()  -> componentWillUnmount   (cleanup)
// ============================================================

import { useState, useEffect } from "react";

function LifecycleDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // ----------------------------------------------------------
  // 1️⃣  EMPTY ARRAY  []   ->  componentDidMount
  //     Runs ONCE, after the first render. Perfect for:
  //     initial data fetch, setting up subscriptions.
  // ----------------------------------------------------------
  useEffect(() => {
    console.log("✅ MOUNT: runs once (componentDidMount)");
    // e.g. fetchUserData();
  }, []); // <-- empty deps = run a single time

  // ----------------------------------------------------------
  // 2️⃣  WITH DEPENDENCY  [count]  ->  componentDidUpdate
  //     Runs after first render AND every time `count` changes.
  //     Ignores changes to `name` (not in the array).
  // ----------------------------------------------------------
  useEffect(() => {
    console.log(`🔄 UPDATE: count changed to ${count} (componentDidUpdate)`);
    // e.g. document.title = `Count: ${count}`;
  }, [count]); // <-- re-runs only when `count` changes

  // ----------------------------------------------------------
  // 3️⃣  NO ARRAY  (omitted)  ->  runs after EVERY render
  //     Fires on mount and on every single re-render
  //     (count OR name change). Rarely what you want ⚠️
  // ----------------------------------------------------------
  useEffect(() => {
    console.log("⚠️  EVERY RENDER: fires on any state change");
  }); // <-- no array = every render

  // ----------------------------------------------------------
  // 4️⃣  CLEANUP (the returned function) -> componentWillUnmount
  //     Here with [] so setup runs once and cleanup runs when
  //     the component unmounts. With deps, cleanup also runs
  //     BEFORE each re-run of the effect.
  // ----------------------------------------------------------
  useEffect(() => {
    const id = setInterval(() => {
      console.log("⏰ tick (timer running)");
    }, 1000);

    return () => {
      // 🧹 runs on unmount (and before re-run if deps change)
      clearInterval(id);
      console.log("🧹 CLEANUP: timer cleared (componentWillUnmount)");
    };
  }, []); // setup once, clean up on unmount

  return (
    <div>
      <h2>useEffect Lifecycle Demo</h2>
      <p>Count: {count}</p>
      {/* Changing count -> triggers effect #2 and #3 */}
      <button onClick={() => setCount((prev) => prev + 1)}>+1 count</button>

      {/* Changing name -> triggers ONLY effect #3 (every render),
          NOT effect #2, because `name` is not in [count] */}
      <input
        value={name}
        placeholder="type name"
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}

export default LifecycleDemo;

// ============================================================
//  📋 EXPECTED CONSOLE ORDER
// ------------------------------------------------------------
//  First render (mount):
//     ✅ MOUNT
//     🔄 UPDATE: count changed to 0
//     ⚠️  EVERY RENDER
//     ⏰ tick... (every second)
//
//  Click "+1 count":
//     🔄 UPDATE: count changed to 1   (effect #2 — count in deps)
//     ⚠️  EVERY RENDER                 (effect #3 — every render)
//     (✅ MOUNT does NOT run again — [] only runs once)
//
//  Type in the input (name changes):
//     ⚠️  EVERY RENDER   (only effect #3 — name not in [count])
//
//  Component unmounts:
//     🧹 CLEANUP: timer cleared
// ============================================================

// ============================================================
//  🧠 INTERVIEW MAP — memorize this table:
//
//     useEffect(fn, [])      = componentDidMount   (once)
//     useEffect(fn, [dep])   = componentDidUpdate  (on dep change)
//     useEffect(fn)          = every render
//     return () => {...}     = componentWillUnmount (cleanup)
// ============================================================
