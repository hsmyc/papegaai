import { createState } from "@yucedev/kraai";
import renderElement from "./renderer";
let worker: Worker;
if (window.Worker) {
  worker = new Worker("worker.js");
} else {
  console.log("Web Worker not supported");
}
const app = document.getElementById("app");
const parser = new DOMParser();
const doc = parser.parseFromString(
  `  <div id="new">
    <h1 id="title">Hello World</h1>
  </div>
  `,
  "text/html"
);

function Button(
  hElement?: HTMLElement | HTMLElement[],
  variables?: Record<string, string>
) {
  const button = renderElement("button", {
    id: "button",
    className: "pf-m-primary",
    content: "{{ name }}",
    children: hElement,
    variables,
    events: {
      click(this, event) {
        worker.postMessage("Hello Worker!");
        console.log(this.id);
        console.log(event);
      },
    },
  });

  return button;
}

function Container(hElement?: HTMLElement | HTMLElement[]) {
  return renderElement("div", {
    id: "container",
    children: hElement,
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "1rem",
    },
  });
}

function main() {
  const [g, s, sb] = createState("Hello World");
  if (!app) {
    throw new Error("App element not found");
  }
  worker.onmessage = (e) => {
    s(e.data.payload);
  };
  const title = doc.getElementById("title");
  sb(() => {
    app.innerHTML = "";
    const container = Container([Button(undefined, { name: g() })]);
    if (title) container.insertBefore(title, container.firstChild);
    const t = container.querySelector("h1");
    app.appendChild(container);
  });
}

main();
