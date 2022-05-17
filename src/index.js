import ReactDOM from "react-dom/client";
import "./styles.css";
import { SuspenseGrid } from "./SuspenseGrid";

function App() {
  return <SuspenseGrid />;
}

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(<App />);
