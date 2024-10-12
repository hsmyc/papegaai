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
function renderElement(el, style, content, children, variables) {
  for (const [key, value] of Object.entries(style)) {
    if (key in el.style) {
      el.style.setProperty(key, value);
    }
  }
  if (variables && content) {
    for (const [key, value] of Object.entries(variables)) {
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

// core/main.ts
function SendMessagetoWorker() {
  worker.postMessage("Hi Worker");
  console.log("Main script: Message posted to worker");
  worker.onmessage = function(e) {
    s(e.data);
  };
}
function UpdateData() {
  if (dEL)
    renderElement(dEL, style, `${g()} {{ name }}`, cEl, variables);
}
var worker;
if (window.Worker) {
  worker = new Worker("worker.js");
} else {
  console.log("Web Worker not supported");
}
var [g, s, sb] = createState("Hello World");
var dEL = document.getElementById("data");
var bEl = document.getElementById("btn");
var cEl = document.createElement("div");
cEl.textContent = "Child Element";
var style = {
  color: "pink",
  "background-color": "black",
  "max-width": "200px"
};
var variables = {
  name: "osman"
};
if (bEl)
  bEl.addEventListener("click", SendMessagetoWorker);
sb(UpdateData);
