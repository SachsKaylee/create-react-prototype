const path = require("path");
const prune = require("../../helper/prune");
const flatten = require("../../helper/flatten");
const logger = require("../../helper/logger");
const jest = require("jest");

const bootstrap = (app) => {
  app
    .command("test", "Runs the full test suite of your library.")
    .option("-W --watch", "Watches the unit tests (git mode)")
    .option("-WA --watchAll", "Watches the unit tests (no git mode)")
    .option("--debug", "Runs jest in debug mode")
    .action(async (args, callback) => {
      process.env.NODE_ENV = "test";
      args.options.debug = !!args.options.debug;
      logger.setDebug(args.options.debug);

      logger(logger.DEBUG, "NODE_ENV:", process.env.NODE_ENV);
      logger(logger.DEBUG, "Options:", args.options);

      logger(logger.INFO, "Running unit tests ...");
      await runTests(args.options);

      logger(logger.SUCCESS, "Success! Your library has been tested.");

      callback();
    });
};

const runTests = async (args) => {
  const cfgFile = path.join(__dirname, "./jest.config.js");
  const cfg = flatten(prune([
    ["--config", cfgFile],
    args.watch && ["--watch"],
    args.watchAll && ["--watchAll"],
    args.debug && ["--debug"]
  ]));
  logger(logger.DEBUG, "Running jest with:", cfg);
  await jest.run(cfg);
};

module.exports = {
  bootstrap
};