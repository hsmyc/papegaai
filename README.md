# Papegaai - A Minimalistic DOM Creation Utility

**Papegaai** is a lightweight JavaScript/TypeScript utility for creating and managing DOM elements with a clean and expressive syntax. Inspired by JSX and functional programming paradigms, **Papegaai** simplifies DOM manipulation by allowing you to construct elements, set attributes, handle events, and compose components with ease.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Creating Elements](#creating-elements)
  - [Setting Attributes](#setting-attributes)
  - [Event Handling](#event-handling)
  - [Nested Elements and Children](#nested-elements-and-children)
  - [Components](#components)
  - [Fragments](#fragments)
- [TypeScript Support](#typescript-support)
- [API Reference](#api-reference)
  - [P Function](#p-function)
  - [P.Fragment](#pfragment)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Expressive Syntax**: Create elements using a simple and intuitive API.
- **Lightweight**: Minimal overhead, focusing on core functionality without unnecessary bloat.
- **TypeScript Support**: Fully typed for better developer experience and reliability.
- **Functional Components**: Build reusable components with ease.
- **Event Handling**: Attach event listeners directly when creating elements.
- **Fragments**: Group multiple elements without introducing additional DOM nodes.

## Installation

You can install **P** via bun:

```bash
bunx jsr add @yucedev/papegaai
```

Or using npm:

```bash
npx jsr add @yucedev/papegaai
```

Or using yarn:

```bash
yarn jsr add @yucedev/papegaai
```

Or using deno:

```bash
deno add jsr:@yucedev/papegaai
```

Replace `@your-username/p` with the actual package name when published.

## Usage

### Importing the Module

```javascript
import P from "@yucedev/papegaai"; // Adjust the import path based on your setup
```

### Creating Elements

Create DOM elements by specifying the tag name and optional content:

```javascript
const div = P("div", "Hello, World!");
document.body.appendChild(div);
```

### Setting Attributes

You can set attributes by passing an object before the children:

```javascript
const input = P("input", { type: "text", placeholder: "Enter your name" });
document.body.appendChild(input);
```

### Event Handling

Attach event listeners directly using the `onEventName` syntax:

```javascript
const button = P("button", { onClick: () => alert("Clicked!") }, "Click me");
document.body.appendChild(button);
```

### Nested Elements and Children

Nest elements by passing other `P` calls as children:

```javascript
const list = P("ul", P("li", "Item 1"), P("li", "Item 2"), P("li", "Item 3"));
document.body.appendChild(list);
```

### Components

Create reusable components as functions:

```javascript
const MyComponent = ({ title, children }) =>
  P("div", P("h2", title), P("div", children));

const element = P(
  MyComponent,
  { title: "Welcome" },
  P("p", "This is a custom component.")
);
document.body.appendChild(element);
```

### Fragments

Group multiple elements without adding extra nodes to the DOM using `P.Fragment`:

```javascript
const fragment = P.Fragment({
  children: [P("span", "Part 1, "), P("span", "Part 2.")],
});
document.body.appendChild(fragment);
```

## TypeScript Support

**P** is written in TypeScript and provides full type definitions out of the box, enhancing the developer experience with autocomplete and type checking.

```typescript
import P from "@your-username/p";

const div: HTMLElement = P("div", "TypeScript is supported!");
```

## API Reference

### P Function

The `P` function is the core of the utility. It can create elements or invoke component functions.

#### Syntax

```typescript
P(tag: string | ComponentFunction, ...args: Arg[]): HTMLElement | DocumentFragment
```

#### Parameters

- `tag`: A string representing the tag name or a component function.
- `args`: An array of arguments which can be attributes, children, or both.

#### Function Usage

- **Creating Elements**

  ```javascript
  const div = P("div", "Content");
  ```

- **Using Classes and IDs in Tags**

  ```javascript
  const element = P("p#intro.text-large", "Introduction text");
  ```

- **Passing Attributes**

  ```javascript
  const input = P("input", { type: "email", required: true });
  ```

- **Event Handlers**

  ```javascript
  const button = P("button", { onClick: handleClick }, "Click me");
  ```

### P.Fragment

`P.Fragment` allows grouping multiple children without adding extra DOM nodes.

#### P.Fragment Syntax

```typescript
P.Fragment(props: { children: ChildArray }): DocumentFragment
```

#### P.Fragment Parameters

- `props`: An object with a `children` property containing an array of child elements.

#### P.Fragment Usage

```javascript
const fragment = P.Fragment({
  children: [P("span", "First part, "), P("span", "Second part.")],
});
```

## Examples

### Complete Example

```javascript
import P from "@yucedev/papegaai";

// Define a reusable component
const Card = ({ title, content }) =>
  P("div.card", P("h3", title), P("p", content));

// Create elements using the component
const app = P(
  "div#app",
  P("h1", "My App"),
  Card({ title: "Card 1", content: "This is the first card." }),
  Card({ title: "Card 2", content: "This is the second card." }),
  P("button", { onClick: () => alert("Button clicked!") }, "Click Me")
);

document.body.appendChild(app);
```

### Handling Events and Styling

```javascript
const handleSubmit = (event) => {
  event.preventDefault();
  const name = event.target.elements.name.value;
  alert(`Hello, ${name}!`);
};

const form = P(
  "form",
  { onSubmit: handleSubmit },
  P("input", { name: "name", type: "text", placeholder: "Your Name" }),
  P("button", { type: "submit" }, "Greet")
);

document.body.appendChild(form);
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

1. Fork the repository.

```bash
git clone https://github.com/hsmyc/papegaai.git
```

2. Create a new branch for your feature or bugfix.
3. Commit your changes with clear messages.
4. Push to your fork and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

_Happy coding with **P**! Simplify your DOM manipulation and enjoy a cleaner, more functional approach to building web interfaces._
