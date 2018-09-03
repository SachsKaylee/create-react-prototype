const run = require("../../helper/run");
const path = require("path");
const build = require("../build");

const bootstrap = (app) => {
  app
    .command("pack", "Packs your library into a .tgz file that you can install locally for testing.")
    .action(async (args, callback) => {
      process.env.NODE_ENV = process.env.NODE_ENV || "production";

      console.log("📚 Creating a full build before packing ...");
      await build.runFullBuild();

      console.log("📚 Packing your library ...")
      await runPack();

      console.log("✨ Success! Your library has been packed into a .tgz file.");

      callback();
    });
};

const runPack = async () => {
  const cwd = process.cwd();
  const dist = path.join(cwd, "./dist");
  console.log("Distribution Path:", dist);
  await run("npm", ["pack", dist]);
};

module.exports = {
  bootstrap,
  runPack
};