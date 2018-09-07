const paths = require("../../helper/paths");
const prune = require("../../helper/prune");
const path = require("path");
const babel = require("@babel/core");
const fs = require("fs-extra");
const eslint = require("eslint");
const eslintConfig = require.resolve("eslint-config-react-app");
const formatEsLintMessages = require('react-dev-utils/eslintFormatter');
const toSlugCase = require('to-slug-case');

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
  const dist = paths.getDistFolder();
  await fs.emptyDir(dist);
  console.log("Cleaned:", dist);
}

const runFullBuild = async () => {
  console.log("📚 Cleaning previous build output ...");
  await cleanPreviousBuildOutput();

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
    copyFile(path.join(paths.getProjectFolder(), "./README.md"), path.join(paths.getDistFolder(), "./README.md")),
    copyFile(path.join(paths.getProjectFolder(), "./CHANGELOG.md"), path.join(paths.getDistFolder(), "./CHANGELOG.md")),
    copyFile(path.join(paths.getProjectFolder(), "./LICENSE"), path.join(paths.getDistFolder(), "./LICENSE"))
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

const createPackageJson = async (canPublish = true) => {
  const { scripts, devDependencies, ...packageJson } = await readPackageJson();
  const newPackageJson = {
    ...packageJson,
    main: "./index.js",
    private: canPublish ? false : true,
    generator: "create-react-prototype"
  };
  const distPath = path.join(paths.getDistFolder(), "./package.json");

  await fs.writeFile(distPath, JSON.stringify(newPackageJson, null, 2), "utf8");
  console.log("Created package.json");

  return newPackageJson;
};

const shouldCompileFile = (name, stat) => {
  if (!stat.isFile()) {
    return false;
  }
  if (!name.endsWith(".js")) {
    return false;
  }
  if (name.endsWith(".test.js")) {
    return false;
  }
  // This is placeholder. I'd love see a future in which we just write .story.js files 
  // and automatically have a storybook. No second project or anything else.
  // If you think you are the one to make this happen - I need you! 😃
  if (name.endsWith(".story.js")) {
    return false;
  }
  const basename = path.basename(name);
  if (basename[0] === ".") {
    return false;
  }
  return true;
};

const shouldCompileDirectory = (name, stat) => {
  if (!stat.isDirectory()) {
    return false;
  }
  const basename = path.basename(name);
  if (basename[0] === ".") {
    return false;
  }
  return true;
};

const shouldCopyFile = (name, stat) => {
  if (!stat.isFile()) {
    return false;
  }
  if (name.endsWith(".js")) {
    return false;
  }
  const basename = path.basename(name);
  if (basename[0] === ".") {
    return false;
  }
  return true;
}

const options = () => {
  const options = {
    cwd: process.cwd(),
    code: true,
    plugins: prune([
      require.resolve("@babel/plugin-proposal-object-rest-spread"),
      require.resolve("@babel/plugin-transform-object-assign"),
      [require.resolve("@babel/plugin-transform-runtime"), { helpers: true, useESModules: false }],
      process.env.NODE_ENV === "production" && require.resolve("babel-plugin-transform-react-constant-elements")
    ]),
    presets: prune([
      require.resolve("@babel/preset-react"),
      [require.resolve("@babel/preset-env"), {
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

const compileEntry = async (from, to, options) => {
  const stat = await fs.stat(from);
  if (shouldCompileDirectory(from, stat)) {
    await compileDirectory(from, to, options);
  } else if (shouldCompileFile(from, stat)) {
    await compileFile(from, to, options);
  } else if (shouldCopyFile(from, stat)) {
    await copyFile(from, to);
  }
}

const compileDirectory = async (from, to, options) => {
  const dir = await fs.readdir(from);
  await fs.ensureDir(to);
  await Promise.all(dir.map(async item => {
    const fullFromItem = path.resolve(from, item);
    const fullToItem = path.resolve(to, item);
    await compileEntry(fullFromItem, fullToItem, options);
  }));
};

const compileFile = async (from, to, options) => {
  const messages = [];
  try {
    await fs.ensureDir(path.dirname(to));
    const text = (await fs.readFile(from)).toString();
    const lintResult = await lint(text, from);
    lintResult.results.forEach(r => {
      r.filePath = from;
    });
    messages.push.apply(messages, lintResult.results);
    // todo: Babel automatically console.logs all errors. We don't want that.
    const { code, map, ast } = await babel.transformAsync(text, { filename: from, ...options });
    // todo: Run these three in parallel
    if (code) {
      await fs.writeFile(to, code);
      if (await fs.exists(withoutJsExtension(from) + ".d.ts")) {
        await fs.copy(withoutJsExtension(from) + ".d.ts", withoutJsExtension(to) + ".d.ts");
      }
    }
    if (map) {
      await fs.writeFile(to + ".map", map);
    }
    if (ast) {
      await fs.writeFile(to + ".ast.json", JSON.stringify(ast, null, 2));
    }
  } catch (error) {
    messages.push({
      filePath: from,
      messages: [{
        column: (error.loc && error.loc.column) || 0,
        line: (error.loc && error.loc.line) || 0,
        message: error.message.replace(from + ": ", ""),
        ruleId: toSlugCase(error.name),
        nodeType: error.code || error.name,
        severity: 2,
        source: null
      }],
      errorCount: 1,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0
    })
  }
  console.log("Compiled:", from);
  const totalWarningsAndErrors = messages.reduce((acc, r) => acc + r.errorCount + r.warningCount, 0);
  if (totalWarningsAndErrors) {
    console.log(formatEsLintMessages(messages).split("\n").filter(l => l.trim()).join("\n"));
  }
};

const copyFile = async (from, to) => {
  if (await fs.exists(from)) {
    await fs.copy(from, to);
    console.log("Copied:", from);
  }
};

const withoutJsExtension = str => {
  if (str.endsWith(".js")) {
    return str.substring(0, str.length - 3);
  }
  return str;
}

const linter = new eslint.CLIEngine({
  useEslintrc: false,
  ignore: false, // ?
  baseConfig: {
    extends: [eslintConfig]
  }
});

const lint = (text, filename) => linter.executeOnText(text, filename, true);

module.exports = {
  bootstrap,
  cleanPreviousBuildOutput,
  createPackageJson,
  runFullBuild,

  compile,
  shouldCompileFile,
  compileFile,
  shouldCompileDirectory,
  compileDirectory,
  options
};