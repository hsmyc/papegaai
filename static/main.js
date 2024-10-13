// node_modules/@yucedev/kraai/app/core/statemanager.js
function scheduleProcessing() {
  if (!isProcessingPending) {
    isProcessingPending = true;
    Promise.resolve().then(processPendingStates);
  }
}
function processPendingStates() {
  isProcessingPending = false;
  const processedStates = new Set;
  while (pendingStates.size > 0) {
    const statesToProcess = new Set(pendingStates);
    pendingStates.clear();
    for (const state of statesToProcess) {
      if (processedStates.has(state)) {
        continue;
      }
      if ("recompute" in state) {
        processedStates.add(state);
        state.recompute();
        const value = state.get();
        const internalState = state;
        for (const subscriber of internalState.subscribers) {
          subscriber(value);
        }
      }
    }
    for (const state of statesToProcess) {
      if (processedStates.has(state)) {
        continue;
      }
      if (!("recompute" in state)) {
        processedStates.add(state);
        const internalState = state;
        const value = state.get();
        for (const subscriber of internalState.subscribers) {
          subscriber(value);
        }
      }
    }
    for (const state of processedStates) {
      const internalState = state;
      for (const dependent of internalState.dependents) {
        if (!processedStates.has(dependent)) {
          pendingStates.add(dependent);
        }
      }
    }
  }
}
function dispose(subscribers, dependents, state) {
  subscribers.clear();
  for (const dependent of dependents) {
    dependent.removeDependency(state);
  }
  dependents.clear();
}
function addDependent(dependents, dependent) {
  dependents.add(dependent);
}
function createState(initialValue) {
  let _value = structuredClone(initialValue);
  const subscribers = new Set;
  const dependents = new Set;
  const state = {
    get() {
      if (currentlyComputing) {
        currentlyComputing.addDependency(state);
        addDependent(dependents, currentlyComputing);
      }
      return _value;
    },
    set(newValue) {
      if (_value !== newValue) {
        _value = structuredClone(newValue);
        pendingStates.add(state);
        scheduleProcessing();
      }
    },
    subscribe(fn) {
      subscribers.add(fn);
      fn(_value);
      return () => {
        subscribers.delete(fn);
        if (subscribers.size === 0 && dependents.size === 0) {
          dispose(subscribers, dependents, state);
        }
      };
    },
    subscribers,
    dependents,
    addDependency(dep) {
      dependents.add(dep);
    },
    removeDependency(dep) {
      dependents.delete(dep);
    }
  };
  return [
    state.get,
    state.set,
    state.subscribe
  ];
}
var currentlyComputing = null;
var pendingStates = new Set;
var isProcessingPending = false;

// core/renderer.ts
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var CE = (tag, {
  id,
  className,
  style,
  content,
  children,
  variables,
  events,
  attributes
} = {}) => {
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
    const appendChild = (child) => el.appendChild(child);
    Array.isArray(children) ? children.forEach(appendChild) : appendChild(children);
  }
  if (events) {
    for (const [key, value] of Object.entries(events)) {
      el.addEventListener(key, value);
    }
  }
  if (attributes) {
    for (const [attrName, attrValue] of Object.entries(attributes)) {
      el.setAttribute(attrName, attrValue);
    }
  }
  return el;
};
var renderer_default = CE;

// core/main.ts
function Button(hElement, variables) {
  const button = renderer_default("button", {
    id: "button",
    className: "pf-m-primary",
    content: "{{ name }}",
    children: hElement,
    variables,
    events: {
      click(event) {
        worker.postMessage("Hello Worker!");
        console.log(this.id);
        console.log(event);
      }
    }
  });
  return button;
}
function Title() {
  const title = renderer_default("h1", { id: "title", content: "Hello Titty" });
  return title;
}
function Container(hElement) {
  const [c, s, sub] = createState(0);
  const inButton = renderer_default("button", {
    id: "inButton",
    events: {
      click(event) {
        console.log(c());
        s(c() + 1);
      }
    },
    content: "{{c}}",
    variables: { c: c() }
  });
  const childrens = [
    inButton,
    ...Array.isArray(hElement) ? hElement : [hElement]
  ];
  return renderer_default("div", {
    id: "container",
    children: childrens,
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "1rem"
    }
  });
}
function main() {
  const [g, s, sb] = createState("Hello World");
  if (!app) {
    throw new Error("App element not found");
  }
  worker.onmessage = (e) => {
    s(e.data.payload);
  };
  const title = doc.getElementById("title");
  sb(() => {
    app.innerHTML = "";
    const container = Container([Title(), Button(undefined, { name: g() })]);
    if (title)
      container.insertBefore(title, container.children[1]);
    const t = container.querySelector("h1");
    app.appendChild(container);
  });
}
var worker;
if (window.Worker) {
  worker = new Worker("worker.js");
} else {
  console.log("Web Worker not supported");
}
var app = document.getElementById("app");
var parser = new DOMParser;
var doc = parser.parseFromString(`  <div id="new">
    <h1 id="title">Hello World</h1>
  </div>
  `, "text/html");
main();
