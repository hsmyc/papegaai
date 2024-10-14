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
  const button = renderElement("button", {
    id: "button",
    className: "pf-m-primary",
    content: "{{ name }}",
    children: hElement,
    variables,
    events: {
      click(this, event) {
        worker.postMessage("Hello Worker!");
      },
    },
  });

  return button;
}

function Title() {
  const title = renderElement("h1", { id: "title", content: "Hello Titty" });
  return title;
}
function Container(hElement?: HTMLElement | HTMLElement[]) {
  const [c, s, sub] = createState(32);
  let variables = { c: c(), p: "osman" };
  const inButton = renderElement("button", {
    id: "inButton",
    events: {
      click(this, event) {
        s(c() + 1);
      },
    },
    content: "{{c}} {{p}}",
    variables,
  });
  sub(() => {
    const cSpan = inButton.querySelector('[data-variable="c"]');
    if (cSpan) {
      cSpan.textContent = c().toString();
    }
  });
  const childrens = [
    inButton,
    ...(Array.isArray(hElement) ? hElement : [hElement]),
  ];

  return renderElement("div", {
    id: "container",
    children: childrens as HTMLElement[],
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

  sb(() => {
    app.innerHTML = "";
    const container = Container([Title(), Button(undefined, { name: g() })]);
    const t = container.querySelector("h1");
    app.appendChild(container);
  });
}

main();
