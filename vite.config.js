export default {
  root: "src",
  publicDir: "public",
  outDir: "/docs",
  server: {
    open: true,
  },
  plugins: [
    {
      name: "reload",
      configureServer(server) {
        // To reload slides
        // ask the server to reload
        // if a markdown file changes
        const { ws, watcher } = server;
        watcher.on("change", (file) => {
          if (file.endsWith(".md")) {
            ws.send({
              type: "full-reload",
            });
          }
        });
      },
    },
  ],
};
