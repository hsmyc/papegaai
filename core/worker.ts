let i = 0;

onmessage = function (e) {
  i++;
  const result = e.data;
  if (result) {
    const wresult = "Osman" + i;
    console.log("Posting message back to main script");
    postMessage({ type: "update", payload: wresult });
  }
};
