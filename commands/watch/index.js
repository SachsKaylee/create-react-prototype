const build = require("../build");
const fs = require("fs-extra");
const path = require("path");
const paths = require("../../helper/paths");
const nodewatch = require("node-watch");

const bootstrap = (app) => {
  app
    .command("watch", "Watches your library code and keeps building a development version.")
    .action(async (args, callback) => {
      process.env.NODE_ENV = process.env.NODE_ENV || "production";

      console.log("📚 Creating a full build before watching ...");
      await build.runFullBuild();

      console.log("📚 Watching your code ...");
      await watch();

      console.log("✨ Success! We finished watching.");

      callback();
    });
};

const watch = () => {
  process.env.NODE_ENV = "development";
  return new Promise((res, rej) => {
    nodewatch(paths.getSourceFolder(), { recursive: true }, async (e, file) => {
      const fileFull = file;
      const distFileFull = path.join(paths.getDistFolder(), path.relative(paths.getSourceFolder(), file));
      try {
        if (await fs.exists(fileFull)) {
          const stats = await fs.stat(fileFull);
          if (build.shouldCompileDirectory(fileFull, stats)) {
            await build.compileDirectory(fileFull, distFileFull, build.options());
          } else if (build.shouldCompileFile(fileFull, stats)) {
            await build.compileFile(fileFull, distFileFull, build.options());
          }
        } else {
          console.log("Deleted:", distFileFull);
          await fs.remove(distFileFull);
        }
      } catch (e) {
        console.warn("Error in file watcher ... ignoring", e);
      }
    }).once("close", res).once("error", rej);
  });
}

module.exports = {
  bootstrap
};