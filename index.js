#!/usr/bin/env node
const myPackageJson = require("./package.json");

process.on('unhandledRejection', err => {
  console.error("❌ create-react-prototype encountered an error. You can likely find some details above this message. Below is mainly an internal stacktrace for us to debug this error.");
  throw err;
});

const app = require("vorpal")();
const initCommand = require("./commands/init");
const buildCommand = require("./commands/build");
const watchCommand = require("./commands/watch");
const testCommand = require("./commands/test");
const publishCommand = require("./commands/publish");
const packCommand = require("./commands/pack");

const separator = myPackageJson.description.replace(/./g, "*");
console.log(separator);
console.log(myPackageJson.name + " v" + myPackageJson.version);
console.log(myPackageJson.repository.url ? myPackageJson.repository.url : myPackageJson.repository);
console.log(myPackageJson.description);
console.log(separator);

initCommand.bootstrap(app);
buildCommand.bootstrap(app);
watchCommand.bootstrap(app);
testCommand.bootstrap(app);
publishCommand.bootstrap(app);
packCommand.bootstrap(app);

app
  .parse(process.argv)
  .delimiter(myPackageJson.name + "$")
  .show();
