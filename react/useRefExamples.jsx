// ============================================================
//  useRef — TWO MAIN USE CASES
// ------------------------------------------------------------
//  useRef returns a mutable object: { current: initialValue }
//   • persists across renders
//   • changing .current does NOT trigger a re-render
//
//  Use case 1: access a real DOM element
//  Use case 2: store a mutable value the UI does NOT display
// ============================================================

import { useState, useRef } from "react";

// ============================================================
//  1️⃣  ACCESS A DOM ELEMENT
// ------------------------------------------------------------
//  Attach ref={inputRef} -> inputRef.current becomes the node.
//  Used for: focus, scroll, measuring, media, 3rd-party libs.
// ============================================================
function FocusInput() {
  const inputRef = useRef(null); // null until the element mounts

  const focusIt = () => {
    inputRef.current.focus(); // reach into the real DOM node
  };

  return (
    <div>
      <h3>1) DOM access</h3>
      <input ref={inputRef} placeholder="click the button →" />
      <button onClick={focusIt}>Focus the input</button>
    </div>
  );
}

// ============================================================
//  2️⃣  PERSIST A VALUE WITHOUT RE-RENDERING
// ------------------------------------------------------------
//  The interval ID must survive renders so stop() can clear it,
//  but storing it should NOT cause a re-render -> useRef.
//  (seconds IS shown on screen, so that stays in useState.)
// ============================================================
function Timer() {
  const [seconds, setSeconds] = useState(0); // affects UI -> state
  const intervalRef = useRef(null);          // hidden value -> ref

  const start = () => {
    if (intervalRef.current) return; // already running, ignore
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current); // read the ref to clear it
    intervalRef.current = null;
  };

  return (
    <div>
      <h3>2) Persist value (timer id) without re-render</h3>
      <p>Seconds: {seconds}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

// ============================================================
//  BONUS: useRef vs useState side by side
// ------------------------------------------------------------
//  Changing the REF does NOT re-render -> the screen won't
//  update even though refValue.current is increasing.
//  Changing STATE re-renders -> screen updates.
// ============================================================
function RefVsState() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);

  return (
    <div>
      <h3>3) useRef vs useState</h3>
      <p>state count (re-renders): {stateCount}</p>
      <p>ref count (no re-render): {refCount.current}</p>

      <button onClick={() => setStateCount((p) => p + 1)}>
        +1 state (UI updates)
      </button>

      <button
        onClick={() => {
          refCount.current += 1;
          console.log("ref is now", refCount.current); // updates in console...
          // ...but the <p> above does NOT update until a re-render happens
        }}
      >
        +1 ref (UI does NOT update)
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <FocusInput />
      <Timer />
      <RefVsState />
    </div>
  );
}

// ============================================================
//  🧠 INTERVIEW DECISION RULE:
//     value should update the screen?  -> useState
//     value should persist but NOT     -> useRef
//        re-render (DOM node, timer id, previous value)?
//
//     useRef  = persistent .current box, NO re-render
//     useState = persistent value, TRIGGERS re-render
// ============================================================
