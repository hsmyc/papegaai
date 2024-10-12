export default function renderElement(
  el: HTMLElement,
  style: Partial<CSSStyleDeclaration>,
  content?: string,
  children?: HTMLElement | HTMLElement[],
  variables?: Record<string, string>
): HTMLElement {
  for (const [key, value] of Object.entries(style)) {
    if (key in el.style) {
      el.style.setProperty(key, value as string);
    }
  }

  if (variables && content) {
    for (const [key, value] of Object.entries(variables)) {
      // Match {{key}} with optional spaces around the key
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      content = content.replace(regex, value);
    }
  }

  if (content && !children) {
    el.innerHTML = content;
  }

  if (children) {
    if (Array.isArray(children)) {
      for (const child of children) {
        el.appendChild(child);
      }
    } else {
      el.appendChild(children);
    }
  }

  return el;
}
