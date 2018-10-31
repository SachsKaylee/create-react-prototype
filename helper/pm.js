const run = require("./run");
const paths = require("./paths");
const path = require("path");
const fs = require("fs-extra");

/**
 * Reads the package.json as a JSON object. Returns "null" if not found.
 */
const package = async () => {
  const jsonPath = path.join(paths.getProjectFolder(), "./package.json");
  if (!await fs.exists(jsonPath)) {
    return null;
  }
  const packageJsonBuffer = await fs.readFile(jsonPath);
  const packageJson = JSON.parse(packageJsonBuffer.toString("utf8"));
  return packageJson;
}

/**
 * Gets the package manager defined in the package.json of the user.
 */
const get = async (defaultPm = "npm") => {
  const pkg = await package();
  // The files does not yet exist during the create-react-prototype init command.
  if (!pkg || !pkg.packageManager) {
    return defaultPm;
  }
  return pkg.packageManager;
}

/**
 * Runs the package manager specific command to install all dependencies for the given directory.
 */
const install = async ({ dir = paths.getProjectFolder() } = {}, packageManager = get()) => {
  packageManager = await packageManager;
  switch (packageManager) {
    case "npm": return await run('npm', ["install"], { stdio: "inherit", cwd: dir });
    case "yarn": return await run('yarn', { stdio: "inherit", cwd: dir });
    default: throw new Error("Unknown package manager " + packageManager);
  }
};

/**
 * Initializes a new project using the package manager of the user.
 */
const init = async ({ yes = false } = {}, packageManager = get()) => {
  packageManager = await packageManager;
  switch (packageManager) {
    case "npm": return await run('npm', yes ? ["init", "--yes"] : ["init"]);
    case "yarn": return await run('yarn', yes ? ["init", "--yes"] : ["init"]);
    default: throw new Error("Unknown package manager " + packageManager);
  }
};

/**
 * Runs the command to publish the given directory to the NPM registry.
 */
const publish = async ({ dir = paths.getDistFolder() } = {}, packageManager = get()) => {
  packageManager = await packageManager;
  switch (packageManager) {
    case "npm": {
      return await run('npm', ["publish", dir]);
    };
    case "yarn": {
      const pkg = await package();
      if (!pkg || !pkg.version) {
        throw new Error("No version specified in package.json.");
      }
      return await run('yarn', ["publish", dir, "--new-version", pkg.version]);
    };
    default: throw new Error("Unknown package manager " + packageManager);
  }
};

/**
 * Packs the given command into a .tgz file.
 */
const pack = async ({ 
  dir = paths.getDistFolder(), 
  outputDir = paths.getProjectFolder(), 
  pkg = package() 
} = {}, packageManager = get()) => {
  packageManager = await packageManager;
  pkg = await pkg;

  const filename = path.join(outputDir, pkg.name + "-" + pkg.version + ".tgz");
  switch (packageManager) {
    case "npm": {
      await run("npm", ["pack", dir], { stdio: "inherit", cwd: outputDir });
      return filename;
    }
    case "yarn": {
      await run("yarn", ["pack", "--filename", filename], { stdio: "inherit", cwd: dir });
      return filename;
    }
    default: throw new Error("Unknown package manager " + packageManager);
  }
};

/**
 * Creates a string for the package.json to link another package as a symlink.
 * Installing a "file:" links on NPM, but copies on yarn. We thus need a "link:" on yarn.
 */
const linkString = async ({ dir = paths.getMyFolder() } = {}, packageManager = get()) => {
  packageManager = await packageManager;
  switch (packageManager) {
    case "npm": return "file:" + dir;
    case "yarn": return "link:" + dir;
    default: throw new Error("Unknown package manager " + packageManager);
  }
}

module.exports = {
  get,
  package,

  install,
  init,
  publish,
  pack,
  linkString
};
