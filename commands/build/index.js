const paths = require("../../helper/paths");
const run = require("../../helper/run");
const flatten = require("../../helper/flatten");
const prune = require("../../helper/prune");
const path = require("path");
const fs = require("fs-extra");

const bootstrap = (app) => {
  app
    .command("build", "Builds your library, ready for distribution.")
    .action(async (args, callback) => {

      console.log("📚 Cleaning previous build output ...");
      await cleanPreviousBuildOutput();

      console.log("📚 Building the CommonJS modules ...");
      process.env.NODE_ENV = "production";
      process.env.BABEL_ENV = "commonjs";
      await runBuild();

      console.log("📚 Building the ES modules ...");
      process.env.NODE_ENV = "production";
      process.env.BABEL_ENV = "es";
      await runBuild();
      
      console.log("📚 Copying files ...");
      process.env.NODE_ENV = "production";
      process.env.BABEL_ENV = "commonjs";
      await createPackageJson();

      console.log("✨ Success! Your library has been compiled. You can find the output in the /dist directory.");

      callback();
    });
};

const cleanPreviousBuildOutput = async () => {
  const cwd = process.cwd();
  const dist = path.join(cwd, "./dist");
  await fs.emptyDir(dist);
  console.log("Cleaned:", dist);
}

const runBuild = async (watch = false) => {
  const cfgFile = path.join(__dirname, "./babel.config.js");
  const babelLocation = path.join(__dirname, "../../node_modules/.bin/babel");
  console.log("Source Path:", paths.getSourceFolder());
  await run(babelLocation, flatten(prune([
    paths.getSourceFolder(),
    watch && "--watch",
    ["--out-dir", paths.getDistFolder()],
    ["--ignore", "*.test.js"],
    ["--config-file", cfgFile]
  ])));

  const packageJson = await readPackageJson();
  console.log("Adding license information:", packageJson.name + " (v" + packageJson.version + ") is licensed under the " + packageJson.license + " License");
  const indexJsPath = path.join(paths.getDistFolder(), "./index.js");
  await prependLicense(indexJsPath, packageJson);

  console.log("Copying relevant files to build output");
  await Promise.all([
    copyFile("./README.md"),
    copyFile("./CHANGELOG.md"),
    copyFile("./LICENSE")
  ]);
};

const prependLicense = async (to, { name, version, license }) => {
  const text = `/** @license ${name} v${version}
 *
 * This source code is licensed under the ${license} license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;
  await prepend(to, text);
};

const readPackageJson = async () => {
  const cwd = process.cwd();
  const pathJson = path.join(cwd, "./package.json");
  return JSON.parse(await fs.readFile(pathJson));
};

const prepend = async (file, string) => {
  const data = await fs.readFile(file, 'utf8');
  await fs.writeFile(file, string + data, 'utf8');
};

const copyTypescript = async () => {

};

const createPackageJson = async (canPublish = true) => {
  const { scripts, devDependencies, ...packageJson } = await readPackageJson();
  const newPackageJson = {
    ...packageJson,
    main: "./index.js",
    module: "./es/index.js",
    private: canPublish ? false : true,
    generator: "create-react-prototype"
  };
  const distPath = path.join(paths.getDistFolder(), "./package.json");

  await fs.writeFile(distPath, JSON.stringify(packageJson, null, 2), "utf8");
  console.log("Created package.json");

  return newPackageJson;
};

const copyFile = async (file) => {
  const cwd = process.cwd();
  const distPath = path.join(paths.getDistFolder(), file);
  const srcPath = path.join(cwd, file);
  await fs.copy(srcPath, distPath);
  console.log(`Copied ${file}`);
};

module.exports = {
  bootstrap,
  runBuild,
  cleanPreviousBuildOutput,
  createPackageJson
};