import { createState } from "@yucedev/kraai";
import renderElement from "./renderer";
let worker: Worker;
if (window.Worker) {
  worker = new Worker("worker.js");
} else {
  console.log("Web Worker not supported");
}
const app = document.getElementById("app");
const [g, s, sb] = createState("Hello World");
function main() {
  if (!app) {
    throw new Error("App element not found");
  }
  const button = renderElement(
    document.createElement("button"),
    { padding: "10px", cursor: "pointer" },
    "Click me",
    undefined,
    { text: g() }
  );
  button.addEventListener("click", () => {
    worker.postMessage({ type: "update", payload: g() });
  });
  const p = renderElement(document.createElement("p"), { color: "blue" }, g());
  const w = renderElement(
    document.createElement("p"),
    { color: "blue" },
    undefined,
    [p, button]
  );
  app.appendChild(w);
  worker.onmessage = (e) => {
    if (e.data.type === "update") {
      s(e.data.payload);
    }
  };

  sb((v) => {
    p.textContent = v;
    button.textContent = `Click me`;
  });
}

main();
