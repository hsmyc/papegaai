// core/renderer.ts
function appendChild(parent, child) {
  if (child == null) {
    return;
  } else if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") {
    parent.appendChild(document.createTextNode(String(child)));
  } else if (Array.isArray(child)) {
    child.forEach((nestedChild) => appendChild(parent, nestedChild));
  } else if (child instanceof Node) {
    parent.appendChild(child);
  } else if (typeof child === "function") {
    const result = child();
    if (result instanceof Node) {
      parent.appendChild(result);
    }
  }
}
function processAttributes(element, attributes) {
  if (element instanceof HTMLElement) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else if (key.startsWith("on") && typeof value === "function") {
        const eventType = key.substring(2).toLowerCase();
        element.addEventListener(eventType, value);
      } else if (key === "attributes" && typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([attr, val]) => {
          element.setAttribute(attr, String(val));
        });
      } else if (key === "dataset" && typeof value === "object" && value !== null) {
        Object.assign(element.dataset, value);
      } else if (key === "class" && typeof value === "string") {
        element.classList.add(...value.split(" "));
      } else if (key === "id" && typeof value === "string") {
        element.id = value;
      } else {
        element[key] = value;
      }
    });
  } else {
    console.warn("Attributes cannot be applied to DocumentFragment");
  }
}
var P = (tag, ...args) => {
  let element;
  if (typeof tag === "function") {
    let props = {};
    if (args.length && typeof args[0] === "object" && !Array.isArray(args[0]) && !(args[0] instanceof Node)) {
      props = args.shift();
    }
    props.children = args.length > 1 ? args : args[0];
    element = tag(props);
  } else if (typeof tag === "string") {
    let tagName = "div";
    let id = "";
    let classNames = [];
    const regex = /([.#]?[^.#]+)/g;
    let match;
    while (match = regex.exec(tag)) {
      const part = match[0];
      if (part.startsWith("#")) {
        id = part.substring(1);
      } else if (part.startsWith(".")) {
        classNames.push(part.substring(1));
      } else {
        tagName = part;
      }
    }
    const el = document.createElement(tagName);
    if (id) {
      el.id = id;
    }
    if (classNames.length) {
      el.classList.add(...classNames);
    }
    element = el;
  } else {
    throw new Error("Invalid tag type");
  }
  args.forEach((arg) => {
    if (arg == null) {
      return;
    } else if (typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean") {
      element.appendChild(document.createTextNode(String(arg)));
    } else if (Array.isArray(arg)) {
      arg.forEach((child) => appendChild(element, child));
    } else if (arg instanceof Node) {
      element.appendChild(arg);
    } else if (typeof arg === "object") {
      processAttributes(element, arg);
    } else if (typeof arg === "function") {
      const result = arg();
      if (result instanceof Node) {
        element.appendChild(result);
      }
    }
  });
  return element;
};
P.Fragment = ({ children }) => {
  const fragment = document.createDocumentFragment();
  children.forEach((child) => appendChild(fragment, child));
  return fragment;
};
var renderer_default = P;

// examples/main.ts
var app = document.getElementById("app");
var element = renderer_default("div#myId.myClass", { style: { color: "red" } }, "Hello World");
app.appendChild(element);
var element2 = renderer_default("div", { class: "container" }, renderer_default("h1", "Title"), renderer_default("p", "This is a paragraph."), renderer_default("ul", [renderer_default("li", "Item 1"), renderer_default("li", "Item 2")]));
app.appendChild(element2);
var MyComponent = (props) => {
  return renderer_default("div", { class: "my-component" }, props.children);
};
var element3 = renderer_default(MyComponent, { someProp: "value" }, "This is inside the component.");
app.appendChild(element3);
var fragment = renderer_default.Fragment({
  children: [renderer_default("p", "Paragraph 1"), renderer_default("p", "Paragraph 2")]
});
app.appendChild(fragment);
var element5 = renderer_default("div#container.myClass", { style: { backgroundColor: "lightblue" } }, { onClick: () => alert("Clicked!") }, { attributes: { "data-role": "content" } }, "Hello, ", "world!", [renderer_default("span", "This is a child span.")], () => renderer_default("p", "This is a paragraph created by a function."));
app.appendChild(element5);
