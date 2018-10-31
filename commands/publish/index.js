const paths = require("../../helper/paths");
const pm = require("../../helper/pm");
const logger = require("../../helper/logger");
const build = require("../build");

const bootstrap = (app) => {
  app
    .command("publish", "Publishes your library to NPM! Things are about to get serious!")
    .option("--debug", "Activates debug output for this command")
    .action(async (args, callback) => {
      process.env.NODE_ENV = process.env.NODE_ENV || "production";
      args.options.debug = !!args.options.debug;
      logger.setDebug(args.options.debug);

      logger(logger.DEBUG, "NODE_ENV:", process.env.NODE_ENV);
      logger(logger.DEBUG, "Options:", args.options);

      logger(logger.INFO, "Creating a full build before publishing ...");
      await build.runFullBuild();

      logger(logger.INFO, "Publishing your library ...");
      logger(logger.DEBUG, "Distribution Path:", paths.getDistFolder());
      await pm.publish();

      logger(logger.SUCCESS, "Success! Your library has published to NPM.");

      callback();
    });
};

module.exports = {
  bootstrap
};