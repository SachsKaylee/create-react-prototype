const build = require("../build");
const fs = require("fs-extra");
const path = require("path");
const paths = require("../../helper/paths");

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
    // todo: recursive does not work on linux according to the docs
    // todo: Batch changes, windows emits 2 change events for a single change x.x
    fs.watch(paths.getSourceFolder(), { recursive: true }, async (e, file) => {
      const fileFull = path.join(paths.getSourceFolder(), file);
      console.log("Change detected:", e, file);
      if (await fs.exists(fileFull)) {
        const stats = await fs.stat(fileFull);
        // todo: Support symlink in watch command
        if (stats.isDirectory()) {
          /*process.env.NODE_ENV = "development";
          await build.compileDirectory(file, paths.getDistFolder(), build.options());*/
        } else if (stats.isFile()) {
          await build.compileFile(
            fileFull,
            path.join(paths.getDistFolder(), file),
            build.options());
        }
      } else {

      }
    }).once("close", res).once("error", rej);
  });
}

module.exports = {
  bootstrap
};