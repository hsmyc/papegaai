import { createState } from "@yucedev/kraai";
import renderElement from "./renderer";
let worker: Worker;
if (window.Worker) {
  worker = new Worker("worker.js");
} else {
  console.log("Web Worker not supported");
}
const app = document.getElementById("app");

function Button(
  hElement?: HTMLElement | HTMLElement[],
  variables?: Record<string, string>
) {
  const button = renderElement(
    document.createElement("button"),
    "pf-b",
    undefined,
    {
      padding: "0.5rem 1rem",
      border: "1px solid #333",
      borderRadius: "0.25rem",
      backgroundColor: "pink",
      color: "#333",
      cursor: "pointer",
    },
    "Click me {{ name }}",
    hElement,
    variables
  );
  button.onclick = () => {
    worker.postMessage("Hello Worker!");
  };
  return button;
}

function Container(hElement?: HTMLElement | HTMLElement[]) {
  return renderElement(
    document.createElement("div"),
    "pf-c",
    undefined,
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      backgroundColor: "#f4f",
    },
    undefined,
    hElement
  );
}

function main() {
  const [g, s, sb] = createState("Hello World");
  if (!app) {
    throw new Error("App element not found");
  }
  worker.onmessage = (e) => {
    s(e.data.payload);
  };

  sb(() => {
    app.innerHTML = "";
    const container = Container([Button(undefined, { name: g() })]);
    app.appendChild(container);
  });
}

main();
