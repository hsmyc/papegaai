await Bun.build({
  entrypoints: ["./core/main.ts", "./core/worker.ts"],
  outdir: "./static",
});

Bun.serve({
  static: {
    "/": new Response(await Bun.file("./static/index.html").bytes(), {
      headers: { "Content-Type": "text/html" },
    }),
    "/main.js": new Response(await Bun.file("./static/main.js").bytes(), {
      headers: { "Content-Type": "application/javascript" },
    }),
    "/worker.js": new Response(await Bun.file("./static/worker.js").bytes(), {
      headers: { "Content-Type": "application/javascript" },
    }),
  },
  fetch(req) {
    return new Response("404!");
  },
});
