const paths = require("../../helper/paths");
const run = require("../../helper/run");
const flatten = require("../../helper/flatten");
const prune = require("../../helper/prune");
const path = require("path");
const babel = require("@babel/core");
const fs = require("fs-extra");

const bootstrap = (app) => {
  app
    .command("build", "Builds your library, ready for distribution.")
    .action(async (args, callback) => {
      process.env.NODE_ENV = process.env.NODE_ENV || "production";

      console.log("📚 Building your library ...");
      await runFullBuild();

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

const runFullBuild = async () => {
  console.log("📚 Cleaning previous build output ...");
  await cleanPreviousBuildOutput();

  // todo: maybe remove es output

  console.log("📚 Building modules ...");
  await runSingleBuild();

  console.log("📚 Copying files ...");
  await createPackageJson();
};

const runSingleBuild = async () => {
  console.log("Compiling source path:", paths.getSourceFolder());
  await compile();

  const packageJson = await readPackageJson();
  console.log("Adding license information:", packageJson.name + " (v" + packageJson.version + "), " + packageJson.license + " License");
  const indexJsPath = path.join(paths.getDistFolder(), "./index.js");
  await prependLicense(indexJsPath, packageJson);

  console.log("Copying README.md, CHANGELOG.md & LICENSE files to build output");
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

const shouldCompileFile = (name, stat) => {
  if (!name.endsWith(".js")) {
    return false;
  }
  if (name.endsWith(".test.js")) {
    return false;
  }
  return true;
};

const shouldCompileDirectory = (name, stat) => {
  return true;
};

const options = () => {
  const options = {
    cwd: process.cwd(),
    code: true,
    plugins: prune([
      require("@babel/plugin-proposal-object-rest-spread"),
      require("@babel/plugin-transform-object-assign"),
      [require("@babel/plugin-transform-runtime"), { helpers: true, useESModules: false }],
      process.env.NODE_ENV === "production" && require("babel-plugin-transform-react-constant-elements")
    ]),
    presets: prune([
      require("@babel/preset-react"),
      [require("@babel/preset-env"), {
        targets: {
          ie: 11,
          edge: 14,
          firefox: 45,
          chrome: 49,
          safari: 10,
          node: '6.11',
        },
        modules: "commonjs",
      }]
    ])
  };
  return options;
};

const compile = async () => {
  await compileDirectory(paths.getSourceFolder(), paths.getDistFolder(), options());
};

const compileDirectory = async (from, to, options) => {
  const dir = await fs.readdir(from);
  await fs.ensureDir(to);
  await Promise.all(dir.map(async item => {
    const fullFromItem = path.resolve(from, item);
    const fullToItem = path.resolve(to, item);
    const stat = await fs.stat(fullFromItem);
    // todo: Make compatible with symlinks! (Symlinks can also be files)
    if (stat.isDirectory() && shouldCompileDirectory(fullFromItem, stat)) {
      await compileDirectory(fullFromItem, fullToItem, options);
    } else if (stat.isFile() && shouldCompileFile(fullFromItem, stat)) {
      await compileFile(fullFromItem, fullToItem, options);
    }
  }));
};
fs.pat
const compileFile = async (from, to, options) => {
  options = {
    filename: from,
    // todo: This option exists according to the documention, but throws an option of actually used.
    /*caller: {
      name: "create-react-prototype"
    },*/
    ...options
  };
  await fs.ensureDir(path.dirname(to));
  const { code, map, ast } = await babel.transformFileAsync(from, options);
  console.log("Compiled:", from);
  // todo: Run these three in parallel
  if (code) {
    await fs.writeFile(to, code);
    if (await fs.exists(from + ".d.ts")) {
      await fs.copy(from + ".d.ts", to + ".d.ts");
    }
  }
  if (map) {
    await fs.writeFile(to + ".map", map);
  }
  if (ast) {
    await fs.writeFile(to + ".ast.json", JSON.stringify(ast, null, 2));
  }
};

module.exports = {
  bootstrap,
  cleanPreviousBuildOutput,
  createPackageJson,
  runFullBuild,

  compile,
  compileFile,
  compileDirectory,
  options
};