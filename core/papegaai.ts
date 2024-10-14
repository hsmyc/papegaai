/**
 * A primitive value that can be directly inserted into the DOM as text content.
 * @typedef {string | number | boolean} Primitive
 */
type Primitive = string | number | boolean;

/**
 * Represents a child node which can be appended to a parent node.
 * It can be a primitive, a Node, a function returning a Node, or an array of such children.
 * @typedef {Primitive | Node | (() => Node) | ChildArray} Child
 */
type Child = Primitive | Node | (() => Node) | ChildArray;

/**
 * An array of Child elements.
 * @typedef {Array<Child>} ChildArray
 */
interface ChildArray extends Array<Child> {}

/**
 * An object representing CSS styles to be applied to an element.
 * @typedef {Partial<CSSStyleDeclaration>} StyleObject
 * @example
 * const styles = {
 *   color: 'red',
 *   fontSize: '16px',
 *   backgroundColor: 'blue',
 * };
 */
type StyleObject = Partial<CSSStyleDeclaration>;

/**
 * An event handler for DOM events.
 * @typedef {EventListenerOrEventListenerObject} EventHandler
 * @example
 * const handleClick = (event) => {
 *   console.log('Element clicked!', event);
 * };
 */
type EventHandler = EventListenerOrEventListenerObject;

/**
 * An object representing attributes to be applied to a DOM element.
 * Supports style, dataset, attributes, class, id, and event handlers.
 * @typedef {Object} Attributes
 * @property {StyleObject} [style] - CSS styles to apply.
 * @property {DOMStringMap} [dataset] - Data attributes (data-*) to apply.
 * @property {{ [key: string]: string }} [attributes] - Additional attributes to set.
 * @property {string} [class] - Class names to add to the element.
 * @property {string} [id] - ID to assign to the element.
 * @property {EventHandler} [onEventName] - Event handlers (e.g., onClick, onMouseEnter).
 * @property {any} [key: string] - Any other attributes to set directly on the element.
 * @example
 * const attrs = {
 *   id: 'my-element',
 *   class: 'btn primary',
 *   style: { color: 'white', backgroundColor: 'blue' },
 *   onClick: (e) => alert('Clicked!'),
 *   dataset: { action: 'submit' },
 *   attributes: { role: 'button' },
 * };
 */
interface Attributes {
  style?: StyleObject;
  dataset?: DOMStringMap;
  attributes?: { [key: string]: string };
  class?: string;
  id?: string;
  [key: `on${string}`]: EventHandler;
  [key: string]: any;
}

/**
 * Represents an argument passed to the P function.
 * It can be a Child or an Attributes object.
 * @typedef {Child | Attributes} Arg
 */
type Arg = Child | Attributes;

/**
 * A component function that takes props and returns an HTMLElement or DocumentFragment.
 * @template P
 * @typedef {(props: P & { children?: any }) => HTMLElement | DocumentFragment} ComponentFunction
 * @example
 * const MyComponent = (props) => {
 *   return P('div', { class: 'my-component' }, props.children);
 * };
 */
type ComponentFunction<P = any> = (
  props: P & { children?: any }
) => HTMLElement | DocumentFragment;

/**
 * The P function interface.
 * It can create elements or invoke component functions.
 * @interface PFunction
 * @template P
 * @param {string | ComponentFunction<P>} tag - The tag name or component function.
 * @param {...Arg} args - Children and/or attributes.
 * @returns {HTMLElement | DocumentFragment} - The created DOM element or fragment.
 * @example
 * -- Create a simple div element with text content
 * const div = P('div', 'Hello, World!');
 * document.body.appendChild(div);
 *
 * -- Create a paragraph with an ID, class, and style
 * const p = P('p#intro.text-large', { style: { color: 'blue' } }, 'Introduction text');
 * document.body.appendChild(p);
 *
 * -- Create a button with a click event handler
 * const button = P('button', { onClick: () => alert('Clicked!') }, 'Click me');
 * document.body.appendChild(button);
 *
 * -- Create a list with items
 * const list = P('ul',
 *   P('li', 'Item 1'),
 *   P('li', 'Item 2'),
 *   P('li', 'Item 3')
 * );
 * document.body.appendChild(list);
 *
 * -- Define a component function
 * const MyComponent = ({ title, children }) => P('div',
 *   P('h1', title),
 *   P('div', ...children)
 * );
 *
 * -- Use the component
 * const element = P(MyComponent, { title: 'My Component' },
 *   P('p', 'This is a paragraph inside the component.')
 * );
 * document.body.appendChild(element);
 *
 * -- Use P.Fragment to group elements without extra DOM nodes
 * const fragment = P.Fragment({ children: [
 *   P('span', 'First part, '),
 *   P('span', 'Second part.')
 * ]});
 * document.body.appendChild(fragment);
 */
interface PFunction {
  (tag: string, ...args: Arg[]): HTMLElement;
  (tag: typeof P.Fragment, props: { children: ChildArray }): DocumentFragment;
  <P = any>(tag: ComponentFunction<P>, ...args: Arg[]):
    | HTMLElement
    | DocumentFragment;
  /**
   * A Fragment component that can wrap multiple children without adding extra nodes to the DOM.
   * @param {{ children: ChildArray }} props - The children to include in the fragment.
   * @returns {DocumentFragment} - The DocumentFragment containing the children.
   * @example
   * const fragment = P.Fragment({ children: [
   *   P('span', 'First'),
   *   P('span', 'Second')
   * ]});
   * document.body.appendChild(fragment);
   */
  Fragment: (props: { children: ChildArray }) => DocumentFragment;
}

/**
 * Appends a child to a parent Node.
 * Handles primitives, Nodes, functions returning Nodes, and arrays of such children.
 * @param {Node} parent - The parent node to append to.
 * @param {Child} child - The child to append.
 * @example
 * const parent = document.createElement('div');
 * appendChild(parent, 'Text content');
 * appendChild(parent, P('span', 'Child element'));
 */
function appendChild(parent: Node, child: Child) {
  if (child == null) {
    return;
  } else if (
    typeof child === "string" ||
    typeof child === "number" ||
    typeof child === "boolean"
  ) {
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

/**
 * Processes and applies attributes to a given HTMLElement or DocumentFragment.
 * Supports style, event handlers, attributes, dataset, class, id, and other properties.
 * @param {HTMLElement | DocumentFragment} element - The element to apply attributes to.
 * @param {Attributes} attributes - The attributes to apply.
 * @example
 * const div = document.createElement('div');
 * processAttributes(div, {
 *   id: 'my-div',
 *   class: 'container',
 *   style: { color: 'green' },
 *   onClick: () => console.log('Clicked'),
 * });
 */
function processAttributes(
  element: HTMLElement | DocumentFragment,
  attributes: Attributes
) {
  if (element instanceof HTMLElement) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else if (key.startsWith("on") && typeof value === "function") {
        const eventType = key.substring(2).toLowerCase();
        element.addEventListener(eventType, value as EventHandler);
      } else if (
        key === "attributes" &&
        typeof value === "object" &&
        value !== null
      ) {
        Object.entries(value).forEach(([attr, val]) => {
          element.setAttribute(attr, String(val));
        });
      } else if (
        key === "dataset" &&
        typeof value === "object" &&
        value !== null
      ) {
        Object.assign(element.dataset, value);
      } else if (key === "class" && typeof value === "string") {
        element.classList.add(...value.split(" "));
      } else if (key === "id" && typeof value === "string") {
        element.id = value;
      } else {
        (element as any)[key] = value;
      }
    });
  } else {
    console.warn("Attributes cannot be applied to DocumentFragment");
  }
}

/**
 * Creates a DOM element or invokes a component function.
 * Supports robust syntax for defining elements, components, and their children.
 * @template P
 * @param {string | ComponentFunction<P>} tag - The tag name or component function.
 * @param {...Arg} args - Children and/or attributes.
 * @returns {HTMLElement | DocumentFragment} - The created DOM element or fragment.
 */
const P = ((tag: any, ...args: any[]): HTMLElement | DocumentFragment => {
  let element: HTMLElement | DocumentFragment;

  if (typeof tag === "function") {
    let props: any = {};
    if (
      args.length &&
      typeof args[0] === "object" &&
      !Array.isArray(args[0]) &&
      !(args[0] instanceof Node)
    ) {
      props = args.shift();
    }
    props.children = args.length > 1 ? args : args[0];
    element = tag(props);
  } else if (typeof tag === "string") {
    let tagName = "div";
    let id = "";
    let classNames: string[] = [];
    const regex = /([.#]?[^.#]+)/g;
    let match;
    while ((match = regex.exec(tag))) {
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
    } else if (
      typeof arg === "string" ||
      typeof arg === "number" ||
      typeof arg === "boolean"
    ) {
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

  return element!;
}) as PFunction;

/**
 * A Fragment component that groups multiple children without adding extra nodes to the DOM.
 * @param {{ children: ChildArray }} props - The children to include in the fragment.
 * @returns {DocumentFragment} - The DocumentFragment containing the children.
 */
P.Fragment = ({ children }: { children: ChildArray }): DocumentFragment => {
  const fragment = document.createDocumentFragment();
  children.forEach((child) => appendChild(fragment, child));
  return fragment;
};

export default P;
