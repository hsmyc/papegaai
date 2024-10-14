type EventMap<K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap> =
  {
    [key in K]?: (this: HTMLElement, ev: HTMLElementEventMap[key]) => void;
  };

type CreateElement = (
  tag: keyof HTMLElementTagNameMap,
  options?: {
    id?: string;
    className?: string;
    style?: Partial<CSSStyleDeclaration>;
    attributes?: Record<string, string>;
    content?: string | HTMLElement | Array<HTMLElement | string>;
    children?: HTMLElement | HTMLElement[];
    variables?: Record<string, string | number | boolean>;
    events?: Partial<EventMap>;
    dataset?: DOMStringMap;
  }
) => HTMLElement;

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function escapeHTML(str: string): string {
  return str.replace(/[&<>"']/g, (char) => {
    const escapeChars: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return escapeChars[char];
  });
}

const CE: CreateElement = (
  tag,
  {
    id,
    className,
    style,
    attributes,
    content,
    children,
    variables,
    events,
    dataset,
  } = {}
) => {
  const el = document.createElement(tag);
  if (!tag) {
    throw new Error("Tag name is required to create an element.");
  }

  if (variables && typeof content !== "string") {
    console.warn(
      "Variables provided but content is not a string. Variables will be ignored."
    );
  }

  if (id) {
    el.id = id;
  }

  if (className) {
    el.className = className;
  }

  if (style) {
    Object.assign(el.style, style);
  }

  if (variables && typeof content === "string") {
    for (const [key, value] of Object.entries(variables)) {
      const escapedKey = escapeRegExp(key);
      const regex = new RegExp(`{{\\s*${escapedKey}\\s*}}`, "g");
      content = content.replace(
        regex,
        `<span data-variable="${key}">${escapeHTML(String(value))}</span>`
      );
    }
  }

  if (content) {
    if (typeof content === "string") {
      el.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      const appendContent = (item: string | HTMLElement) => {
        if (typeof item === "string") {
          el.appendChild(document.createTextNode(item));
        } else {
          el.appendChild(item);
        }
      };

      if (Array.isArray(content)) {
        content.forEach(appendContent);
      } else {
        appendContent(content);
      }
    }
  }

  if (children) {
    const fragment = document.createDocumentFragment();
    const appendChild = (child: HTMLElement) => fragment.appendChild(child);
    if (Array.isArray(children)) {
      children.forEach(appendChild);
    } else {
      appendChild(children);
    }
    el.appendChild(fragment);
  }

  if (events) {
    for (const [eventName, eventHandler] of Object.entries(events) as [
      keyof HTMLElementEventMap,
      EventListenerOrEventListenerObject
    ][]) {
      if (eventHandler) {
        el.addEventListener(eventName, eventHandler);
      }
    }
  }
  if (attributes) {
    for (const [attr, value] of Object.entries(attributes)) {
      el.setAttribute(attr, value);
    }
  }

  if (dataset) {
    Object.assign(el.dataset, dataset);
  }

  return el;
};

export default CE;
