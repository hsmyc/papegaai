import { createState } from "@yucedev/kraai";
import renderElement from "./renderer";
let worker: Worker;
if (window.Worker) {
  worker = new Worker("worker.js");
} else {
  console.log("Web Worker not supported");
}

const [g, s, sb] = createState("Hello World");

const dEL = document.getElementById("data");
const bEl = document.getElementById("btn");
const cEl = document.createElement("div");
cEl.textContent = "Child Element";

function SendMessagetoWorker() {
  worker.postMessage("Hi Worker");
  console.log("Main script: Message posted to worker");
  worker.onmessage = function (e) {
    s(e.data);
  };
}
const style = {
  color: "pink",
  "background-color": "black",
  "max-width": "200px",
};
let variables = {
  name: "osman",
};

function UpdateData() {
  if (dEL) renderElement(dEL, style, `${g()} {{ name }}`, cEl, variables);
}
if (bEl) bEl.addEventListener("click", SendMessagetoWorker);

sb(UpdateData);
