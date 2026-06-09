import { useState } from "react";

// Import the study demos (they live in the react/ root, one level up)
import LiftingStateUp from "../liftingStateUp.jsx";
import LifecycleDemo from "../useEffectDependencyArray.jsx";
import RefExamples from "../useRefExamples.jsx";
import PerformanceTrio from "../performanceTrio.jsx";
import UseReducerDemo from "../useReducerDemo.jsx";

const DEMOS = [
  {
    key: "lift",
    label: "Q4 · Lifting State Up",
    hint: "Type your name — two siblings stay in sync via the parent.",
    Component: LiftingStateUp,
  },
  {
    key: "effect",
    label: "Q7 · useEffect Lifecycle",
    hint: "Open the console (F12) and watch which effects fire. Click +1 vs typing.",
    Component: LifecycleDemo,
  },
  {
    key: "ref",
    label: "Q10 · useRef",
    hint: "Notice: +1 ref logs to console but the screen does NOT update.",
    Component: RefExamples,
  },
  {
    key: "perf",
    label: "Q12 · Performance Trio",
    hint: "Open the console. Toggle theme → calc is skipped & child doesn't re-render.",
    Component: PerformanceTrio,
  },
  {
    key: "reducer",
    label: "Q14 · useReducer",
    hint: "Your turn — implement the reducer + dispatch buttons in useReducerDemo.jsx.",
    Component: UseReducerDemo,
  },
];

export default function App() {
  const [active, setActive] = useState("lift");
  const current = DEMOS.find((d) => d.key === active);
  const Current = current.Component;

  return (
    <div className="app">
      <header>
        <h1>⚛️ React</h1>
        <p className="sub"> live playground</p>
      </header>

      <nav className="tabs">
        {DEMOS.map((d) => (
          <button
            key={d.key}
            className={d.key === active ? "tab active" : "tab"}
            onClick={() => setActive(d.key)}
          >
            {d.label}
          </button>
        ))}
      </nav>

      <p className="hint">💡 {current.hint}</p>

      <main className="demo">
        <Current />
      </main>
    </div>
  );
}
