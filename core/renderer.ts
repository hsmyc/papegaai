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
    content?: string | HTMLElement;
    children?: HTMLElement | HTMLElement[];
    variables?: Record<string, string | number | boolean>;
    events?: Partial<EventMap>;
    attributes?: Record<string, string>;
  }
) => HTMLElement;

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const CE: CreateElement = (
  tag,
  {
    id,
    className,
    style,
    content,
    children,
    variables,
    events,
    attributes,
  } = {}
) => {
  const el = document.createElement(tag);

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
      content = content.replace(regex, value);
    }
  }

  if (content) {
    if (typeof content === "string") {
      el.textContent = content;
    } else if (content instanceof HTMLElement) {
      el.appendChild(content);
    }
  }

  if (children) {
    const appendChild = (child: HTMLElement) => el.appendChild(child);
    Array.isArray(children)
      ? children.forEach(appendChild)
      : appendChild(children);
  }

  if (events) {
    for (const [key, value] of Object.entries(events)) {
      el.addEventListener(key, value as EventListener);
    }
  }

  if (attributes) {
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      el.setAttribute(attrName, attrValue);
    }
  }

  return el;
};

export default CE;
