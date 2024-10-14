await Bun.build({
  entrypoints: ["./examples/main.ts"],
  outdir: "./examples",
});
Bun.serve({
  static: {
    "/": new Response(await Bun.file("./examples/index.html").bytes(), {
      headers: { "Content-Type": "text/html" },
    }),
    "/main.js": new Response(await Bun.file("./examples/main.js").bytes(), {
      headers: { "Content-Type": "application/javascript" },
    }),
  },
  fetch(req) {
    return new Response("404!");
  },
});
