// ============================================================
//  Q14 · useReducer DEMO  —  YOUR turn to implement 💪
// ------------------------------------------------------------
//  Goal: a counter managed with useReducer (not useState).
//  Fill in the 3 pieces below. Hints are in the comments.
// ============================================================

import { useReducer } from "react";

// ------------------------------------------------------------
// 1️⃣ initial state
// ------------------------------------------------------------
// TODO: define the starting state, e.g. { count: 0 }
const initialState = {
  count: 0
};

// ------------------------------------------------------------
// 2️⃣ the reducer: a PURE function (state, action) => newState
// ------------------------------------------------------------
// TODO: switch on action.type and RETURN a NEW state object.
//       Remember: never mutate state — return { ...state, ... }.
//       Suggested actions: "increment", "decrement", "reset"
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + 1 };

    case "decrement":
      return { ...state, count: state.count - 1 };
 
    case "reset":

      return { ...state, count: 0 };

    default:
      return state;
  }
}

// ------------------------------------------------------------
// 3️⃣ the component: wire up useReducer and dispatch actions
// ------------------------------------------------------------
export default function UseReducerDemo() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <h2>useReducer Demo</h2>

      {/* TODO: show state.count and add buttons that dispatch actions */}
    <button onClick={() => dispatch({ type: "increment" })}>+</button> 

    <button onClick={() => dispatch({ type: "decrement" })}>-</button> 

    <button onClick={() => dispatch({ type: "reset" })}>Reset</button> 


{state.count}

      <p>✏️ Implement me — dispatch actions to the reducer.</p>
    </div>
  );
}

// ============================================================
//  🧠 Remember the flow:
//     dispatch({ type: "increment" })
//        -> reducer(state, action) runs
//           -> returns NEW state
//              -> component re-renders
// ============================================================
