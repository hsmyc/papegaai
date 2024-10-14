/// <reference lib="dom" />
import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";
import P from "./papegaai"; // Adjust the import path according to your project structure

describe("P Utility Function", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    // @ts-ignore
    container = null;
  });

  it("should create a div element with text content", () => {
    const div = P("div", "Hello, World!");
    expect(div.tagName).toBe("DIV");
    expect(div.textContent).toBe("Hello, World!");
    container.appendChild(div);
  });

  it("should create an element with classes and id", () => {
    const element = P("p#intro.text-large", "Introduction text");
    expect(element.tagName).toBe("P");
    expect(element.id).toBe("intro");
    expect(element.classList.contains("text-large")).toBe(true);
    expect(element.textContent).toBe("Introduction text");
    container.appendChild(element);
  });

  it("should apply styles from the style attribute", () => {
    const styles = { color: "red", fontSize: "20px" };
    const element = P("div", { style: styles }, "Styled text");
    expect(element.style.color).toBe("red");
    expect(element.style.fontSize).toBe("20px");
    container.appendChild(element);
  });

  it("should handle event handlers", () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };
    const button = P("button", { onClick: handleClick }, "Click me");
    container.appendChild(button);
    expect(clicked).toBe(false);
    button.click();
    expect(clicked).toBe(true);
  });

  it("should handle data attributes via dataset", () => {
    const element = P("div", { dataset: { testId: "123" } });
    expect(element.dataset.testId).toBe("123");
    container.appendChild(element);
  });

  it("should set additional attributes", () => {
    const element = P("input", {
      attributes: { type: "text", placeholder: "Enter text" },
    });
    expect(element.getAttribute("type")).toBe("text");
    expect(element.getAttribute("placeholder")).toBe("Enter text");
    container.appendChild(element);
  });

  it("should handle multiple children elements", () => {
    const list = P(
      "ul",
      P("li", "Item 1"),
      P("li", "Item 2"),
      P("li", "Item 3")
    );
    expect(list.childNodes.length).toBe(3);
    expect(list.childNodes[0].textContent).toBe("Item 1");
    container.appendChild(list);
  });

  it("should support nested arrays of children", () => {
    const items = ["Item A", "Item B", "Item C"];
    const list = P(
      "ul",
      items.map((item) => P("li", item))
    );
    expect(list.childNodes.length).toBe(3);
    expect(list.childNodes[1].textContent).toBe("Item B");
    container.appendChild(list);
  });

  it("should handle component functions", () => {
    const MyComponent = ({
      title,
      children,
    }: {
      title: string;
      children?: any;
    }) => P("div", P("h1", title), P("div", children));
    const element = P(
      MyComponent,
      { title: "My Component" },
      P("p", "This is a paragraph inside the component.")
    );
    if (element instanceof HTMLElement) {
      const h1 = element.querySelector("h1")!;
      const p = element.querySelector("p")!;
      expect(h1.textContent).toBe("My Component");
      expect(p.textContent).toBe("This is a paragraph inside the component.");
      container.appendChild(element);
    } else {
      throw new Error("Expected an HTMLElement");
    }
  });

  it("should handle functional children", () => {
    const functionalChild = () => P("span", "Functional Child");
    const div = P("div", functionalChild);
    const span = div.querySelector("span")!;
    expect(span.textContent).toBe("Functional Child");
    container.appendChild(div);
  });

  it("should support the Fragment component", () => {
    const fragment = P.Fragment({
      children: [P("span", "First part, "), P("span", "Second part.")],
    });
    expect(fragment.childNodes.length).toBe(2);
    expect(fragment.childNodes[0].textContent).toBe("First part, ");
    container.appendChild(fragment);
  });
  it("should throw an error when an invalid tag type is provided", () => {
    expect(() => P(123 as any)).toThrow("Invalid tag type");
  });
});
