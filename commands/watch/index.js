const build = require("../build");
const fs = require("fs-extra");
const path = require("path");
const paths = require("../../helper/paths");
const logger = require("../../helper/logger");
const nodewatch = require("node-watch");

const bootstrap = (app) => {
  app
    .command("watch", "Watches your library code and keeps building a development version.")
    .option("--debug", "Activates debug output for this command")
    .action(async (args, callback) => {
      process.env.NODE_ENV = process.env.NODE_ENV || "development";
      args.options.debug = !!args.options.debug;
      logger.setDebug(args.options.debug);

      logger(logger.DEBUG, "NODE_ENV:", process.env.NODE_ENV);
      logger(logger.DEBUG, "Options:", args.options);

      logger(logger.INFO, "Creating a full build before watching ...");
      await build.runFullBuild();

      logger(logger.INFO, "Watching your code ...");
      await watch();

      logger(logger.SUCCESS, "Success! We finished watching.");

      callback();
    });
};

const watch = () => {
  return new Promise((res, rej) => {
    nodewatch(paths.getSourceFolder(), { recursive: true }, async (e, file) => {
      logger(logger.DEBUG, "File changed:", file);
      const fileFull = file;
      const distFileFull = path.join(paths.getDistFolder(), path.relative(paths.getSourceFolder(), file));
      try {
        if (await fs.exists(fileFull)) {
          logger(logger.DEBUG, "File exists:", file);
          const stats = await fs.stat(fileFull);
          if (build.shouldCompileDirectory(fileFull, stats)) {
            logger(logger.DEBUG, "File will be compiled as directory");
            await build.compileDirectory(fileFull, distFileFull, build.options());
          } else if (build.shouldCompileFile(fileFull, stats)) {
            logger(logger.DEBUG, "File will be compiled as file");
            await build.compileFile(fileFull, distFileFull, build.options());
          }
        } else {
          logger(logger.DEBUG, "File was deleted:", file);
          logger(logger.TRACE, "Deleted:", distFileFull);
          await fs.remove(distFileFull);
        }
      } catch (e) {
        logger(logger.WARNING, "Error in file watcher ... ignoring", e);
      }
    }).once("close", res).once("error", rej);
  });
}

module.exports = {
  bootstrap
};
