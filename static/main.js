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
var RE = (el, id, className, style, content, children, variables) => {
  el.id = id;
  if (className)
    el.className = className;
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
    const appendChild = (child) => el.appendChild(child);
    Array.isArray(children) ? children.forEach(appendChild) : appendChild(children);
  }
  return el;
};
var renderer_default = RE;

// core/main.ts
function Button(hElement, variables) {
  const button = renderer_default(document.createElement("button"), "pf-b", undefined, {
    padding: "0.5rem 1rem",
    border: "1px solid #333",
    borderRadius: "0.25rem",
    backgroundColor: "pink",
    color: "#333",
    cursor: "pointer"
  }, "Click me {{ name }}", hElement, variables);
  button.onclick = () => {
    worker.postMessage("Hello Worker!");
  };
  return button;
}
function Container(hElement) {
  return renderer_default(document.createElement("div"), "pf-c", undefined, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    backgroundColor: "#f4f"
  }, undefined, hElement);
}
function main() {
  const [g, s, sb] = createState("Hello World");
  if (!app) {
    throw new Error("App element not found");
  }
  worker.onmessage = (e) => {
    s(e.data.payload);
  };
  sb(() => {
    app.innerHTML = "";
    const container = Container([Button(undefined, { name: g() })]);
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
main();
