import P from "../core/papegaai";

const app = document.getElementById("app");
// Creating an element with shorthand syntax and properties
const element = P(
  "div#myId.myClass",
  { style: { color: "red" } },
  "Hello World"
);
app!.appendChild(element);

// Creating nested elements with children
const element2 = P(
  "div",
  { class: "container" },
  P("h1", "Title"),
  P("p", "This is a paragraph."),
  P("ul", [P("li", "Item 1"), P("li", "Item 2")])
);
app!.appendChild(element2);

// Defining and using a component
const MyComponent = (props: { children: any }) => {
  return P("div", { class: "my-component" }, props.children);
};

const element3 = P(
  MyComponent,
  { someProp: "value" },
  "This is inside the component."
);

app!.appendChild(element3);

// Using Fragment to group elements
const fragment = P.Fragment({
  children: [P("p", "Paragraph 1"), P("p", "Paragraph 2")],
});

app!.appendChild(fragment);

const element5 = P(
  "div#container.myClass",
  { style: { backgroundColor: "lightblue" } },
  { onClick: () => alert("Clicked!") },
  { attributes: { "data-role": "content" } },
  "Hello, ",
  "world!",
  [P("span", "This is a child span.")],
  () => P("p", "This is a paragraph created by a function.")
);

app!.appendChild(element5);
