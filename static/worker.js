// core/worker.ts
var i = 0;
onmessage = function(e) {
  i++;
  const result = e.data;
  if (result) {
    const wresult = "Hi Main Script! " + i;
    console.log("Posting message back to main script");
    postMessage(wresult);
  }
};
