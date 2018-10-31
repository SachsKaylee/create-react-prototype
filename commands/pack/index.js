const paths = require("../../helper/paths");
const logger = require("../../helper/logger");
const pm = require("../../helper/pm");
const build = require("../build");

const bootstrap = (app) => {
  app
    .command("pack", "Packs your library into a .tgz file that you can install locally for testing.")
    .option("--debug", "Activates debug output for this command")
    .action(async (args, callback) => {
      process.env.NODE_ENV = process.env.NODE_ENV || "production";
      args.options.debug = !!args.options.debug;
      logger.setDebug(args.options.debug);
      
      logger(logger.DEBUG, "NODE_ENV:", process.env.NODE_ENV);
      logger(logger.DEBUG, "Options:", args.options);

      logger(logger.INFO, "Creating a full build before packing ...");
      await build.runFullBuild();

      logger(logger.INFO, "Packing your library ...");
      logger(logger.DEBUG, "Distribution Path:", paths.getDistFolder());
      const file = await pm.pack();

      logger(logger.SUCCESS, "Success! Your library has been packed into a .tgz file - " + file);

      callback();
    });
};

module.exports = {
  bootstrap
};
