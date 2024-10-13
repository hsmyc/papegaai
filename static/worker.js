// core/worker.ts
var i = 0;
onmessage = function(e) {
  i++;
  const result = e.data;
  if (result) {
    const wresult = "Osman" + i;
    postMessage({ type: "update", payload: wresult });
  }
};
