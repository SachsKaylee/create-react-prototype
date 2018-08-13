#!/usr/bin/env node

process.on('unhandledRejection', err => {
  console.error("❌ create-react-prototype encountered an error. You can likely find some details above this message. Below is mainly an internal stacktrace for us to debug this error.");
  throw err;
});

const vorpal = require("vorpal");
const initCommand = require("./commands/init");
const buildCommand = require("./commands/build");
const testCommand = require("./commands/test");
const releaseCommand = require("./commands/release");
const packCommand = require("./commands/pack");
const aboutCommand = require("./commands/about");

const app = vorpal();

initCommand.bootstrap(app);
buildCommand.bootstrap(app);
testCommand.bootstrap(app);
releaseCommand.bootstrap(app);
packCommand.bootstrap(app);
aboutCommand.bootstrap(app);

app
  .delimiter("create-react-prototype$")
  .show()
  .parse(process.argv);