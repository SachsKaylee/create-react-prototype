const run = require("../../helper/run");
const path = require("path");

const bootstrap = (app) => {
  app
    .command("pack", "Packs your library into a .tgz file that you can install locally for testing.")
    .action(async (args, callback) => {

      console.log("📚 Packing your library ...")
      await runPack();

      console.log("✨ Success! Your library has been packed into a .tgz file. You can now use 'npm i path/yo-your/tgz-file.tgz' in another project to install it.");

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