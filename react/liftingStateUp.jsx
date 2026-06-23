// ============================================================
//  LIFTING STATE UP
// ------------------------------------------------------------
//  Definition: When two (or more) components need the SAME data,
//  move the state to their CLOSEST COMMON PARENT and pass it
//  down as props. The parent becomes the "single source of truth".
//
//  Data flows DOWN as props.  Changes flow UP via callbacks.
// ============================================================

import { useState } from "react";

// ============================================================
//  ❌ THE PROBLEM (why we need to lift state up)
// ------------------------------------------------------------
//  Imagine an <Input> child that owns its own `name` state, and
//  a separate <Greeting> sibling that wants to SHOW that name.
//  The sibling cannot see the Input's state — siblings can't
//  read each other's state. They are isolated.
//
//      <App>
//        <Input />      <-- name lives here (trapped!)
//        <Greeting />   <-- needs `name` but can't reach it ❌
//      </App>
// ============================================================


// ============================================================
//  ✅ THE SOLUTION — lift `name` UP to the common parent <App>
// ------------------------------------------------------------
//  Now both children receive what they need from the parent.
// ============================================================

// --- CHILD 1: the input box -----------------------------------
// It does NOT own the state. It receives:
//   - `name`     (current value)        -> data DOWN
//   - `onChange` (a setter callback)    -> changes UP
function NameInput({ name, onChange }) {
  return (
    <input
      type="text"
      value={name}                         // controlled by parent's state
      placeholder="Type your name..."
      onChange={(e) => onChange(e.target.value)} // tell parent to update ⬆️
    />
  );
}

// --- CHILD 2: the display -------------------------------------
// A sibling that just reads the same `name` via props.
function Greeting({ name }) {
  return <h1>{name ? `Hello, ${name} 👋` : "Hello, stranger"}</h1>;
}

// --- PARENT: owns the state (single source of truth) ----------
export default function App() {

  // ⬆️ State LIFTED UP to the closest common parent of both children

  const [name, setName] = useState("");

  return (
    <div>
      {/* Pass state DOWN as props to both children */}
      <NameInput name={name} onChange={setName} />
      <Greeting name={name} />
      {/*
        Flow:
        1. User types in NameInput
        2. onChange -> setName updates App's state   (change flows UP)
        3. App re-renders and passes new `name` DOWN to BOTH children
        4. Input and Greeting always stay in sync ✅
      */}
    </div>
  );
}

// ============================================================
//  🧠 INTERVIEW ONE-LINER:
//  "Lifting state up = move shared state to the nearest common
//   parent so it's the single source of truth. Data flows down
//   via props, changes flow up via callbacks."
// ============================================================
