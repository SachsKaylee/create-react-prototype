#!/usr/bin/env node

process.on('unhandledRejection', err => {
  console.error("❌ create-react-prototype encountered an error. You can likely find some details above this message. Below is mainly an internal stacktrace for us to debug this error.");
  throw err;
});

const vorpal = require("vorpal");
const initCommand = require("./commands/init");
const buildCommand = require("./commands/build");
const watchCommand = require("./commands/watch");
const testCommand = require("./commands/test");
const publishCommand = require("./commands/publish");
const packCommand = require("./commands/pack");

const app = vorpal();

initCommand.bootstrap(app);
buildCommand.bootstrap(app);
watchCommand.bootstrap(app);
testCommand.bootstrap(app);
publishCommand.bootstrap(app);
packCommand.bootstrap(app);

app
  .delimiter("create-react-prototype$")
  .show()
  .parse(process.argv);