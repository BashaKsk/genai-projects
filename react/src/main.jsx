import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// NOTE: StrictMode is intentionally NOT used here.
// In dev, StrictMode double-invokes effects (mount runs twice) on purpose
// to surface bugs — but that would make the useEffect demo's console output
// not match the comments in the file. Left off for clear teaching output.
createRoot(document.getElementById("root")).render(<App />);
