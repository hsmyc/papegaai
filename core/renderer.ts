// create type of renderElement function

type RenderElement = (
  el: HTMLElement,
  style?: Partial<CSSStyleDeclaration>,
  content?: string,
  children?: HTMLElement | HTMLElement[],
  variables?: Record<string, string>
) => HTMLElement;

const RE: RenderElement = (el, style, content, children, variables) => {
  Object.assign(el.style, style);

  if (variables && content) {
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      content = content.replace(regex, value);
    }
  }

  if (content) {
    const pElement = document.createElement("p");
    pElement.textContent = content;
    el.appendChild(pElement);
  }

  if (children) {
    const appendChild = (child: HTMLElement) => el.appendChild(child);

    Array.isArray(children)
      ? children.forEach(appendChild)
      : appendChild(children);
  }

  return el;
};

export default RE;
