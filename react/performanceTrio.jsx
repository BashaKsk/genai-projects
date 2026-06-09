// ============================================================
//  PERFORMANCE TRIO:  useMemo · useCallback · React.memo
// ------------------------------------------------------------
//  Open the browser console (F12) AND watch the on-screen
//  render counters to SEE what re-runs and what gets skipped.
//
//    useMemo     -> cache a VALUE      (skip expensive recompute)
//    useCallback -> cache a FUNCTION   (stable reference)
//    React.memo  -> cache a COMPONENT  (skip re-render if props same)
// ============================================================

import { useState, useMemo, useCallback, memo, useRef } from "react";

// ------------------------------------------------------------
//  A pretend "expensive" calculation. We log every time it
//  runs so you can tell when it actually executes vs when
//  useMemo serves a cached result.
// ------------------------------------------------------------
function slowSquare(n) {
  console.log("🐌 EXPENSIVE calc ran for n =", n);
  let total = 0;
  for (let i = 0; i < 5_000_000; i++) total += 1; // artificial delay
  return n * n;
}

// ------------------------------------------------------------
//  A MEMOIZED child. It logs + shows how many times it has
//  rendered. With React.memo it only re-renders when its
//  props actually change (shallow compare).
// ------------------------------------------------------------
const MemoChild = memo(function MemoChild({ onClick }) {
  const renders = useRef(0);
  renders.current++; // count this render
  console.log("🔵 <MemoChild> RENDERED. total renders:", renders.current);

  return (
    <div style={{ marginTop: 8 }}>
      <p>
        🔵 Memoized child render count: <b>{renders.current}</b>
      </p>
      <button onClick={onClick}>child button (stable onClick)</button>
    </div>
  );
});

export default function PerformanceTrio() {
  const [count, setCount] = useState(1);
  const [theme, setTheme] = useState("light"); // unrelated state

  // 1️⃣ useMemo — recompute ONLY when `count` changes.
  //    Toggling the theme re-renders this component, but the
  //    expensive calc is SKIPPED (you won't see the 🐌 log).
  const squared = useMemo(() => slowSquare(count), [count]);

  // 2️⃣ useCallback — keep the SAME function reference across
  //    renders so React.memo on <MemoChild> actually works.
  //    Try changing [] to NOTHING (remove useCallback) and the
  //    child will re-render on every theme toggle.
  const handleChildClick = useCallback(() => {
    console.log("child button clicked");
  }, []); // no deps -> reference never changes

  console.log("⚪ <PerformanceTrio> rendered. theme:", theme);

  return (
    <div style={{ background: theme === "dark" ? "#222" : "#fff", color: theme === "dark" ? "#fff" : "#000", padding: 16, borderRadius: 8 }}>
      <h2>Performance Trio</h2>

      {/* --- useMemo section --- */}
      <section>
        <h3>1) useMemo</h3>
        <p>
          count = <b>{count}</b> &nbsp; squared (memoized) = <b>{squared}</b>
        </p>
        <button onClick={() => setCount((c) => c + 1)}>
          +1 count (🐌 calc RUNS — count is a dependency)
        </button>
        <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
          toggle theme (calc is SKIPPED ✅ — not a dependency)
        </button>
      </section>

      {/* --- useCallback + React.memo section --- */}
      <section style={{ marginTop: 16 }}>
        <h3>2) React.memo + useCallback</h3>
        <p>
          Toggle the theme above and watch the child's render count.
          Because <code>onClick</code> is wrapped in useCallback and the
          child is wrapped in React.memo, the child does <b>NOT</b> re-render.
        </p>
        <MemoChild onClick={handleChildClick} />
      </section>
    </div>
  );
}

// ============================================================
//  🧪 EXPERIMENTS TO TRY:
//
//  A) Click "+1 count"  -> 🐌 calc log appears (count changed).
//  B) Click "toggle theme" -> NO 🐌 log (useMemo cached it),
//     and the 🔵 child render count does NOT increase
//     (React.memo + useCallback skipped it).
//
//  C) Break it on purpose: remove useCallback (use a plain
//     arrow function for handleChildClick). Now toggling the
//     theme gives the child a NEW function reference every
//     render, so React.memo sees "changed props" and the
//     child re-renders every time. -> proves WHY useCallback
//     is needed with React.memo.
//
//  D) Remove useMemo (call slowSquare(count) directly). Now
//     the 🐌 calc runs on EVERY render, including theme toggles.
// ============================================================

// ============================================================
//  🧠 INTERVIEW SUMMARY:
//     useMemo     = cache a value      (expensive compute)
//     useCallback = cache a function   (stable ref for memo'd kids)
//     React.memo  = cache a render      (skip if props unchanged)
//     useCallback(fn, d) === useMemo(() => fn, d)
//     ⚠️ Only use for REAL/measured perf problems — not by default.
// ============================================================
