const path = require("path");

const getMyFolder = () => {
  const my = path.resolve(__dirname, "../");
  return my;
};

const getProjectFolder = () => {
  const project = process.cwd();
  return project;
};

const getSourceFolder = () => {
  const project = getProjectFolder();
  const src = path.join(project, "./src");
  return src;
};

const getDistFolder = () => {
  const project = getProjectFolder();
  return path.join(project, "./dist");
};

const getStorybookFolder = () => {
  const project = getProjectFolder();
  return path.join(project, "./storybook");
};

const getExampleFolder = () => {
  return path.join(getProjectFolder(), "./example");
};

module.exports = {
  getMyFolder,

  getProjectFolder,
  getSourceFolder,
  getDistFolder,
  getExampleFolder,
  getStorybookFolder
};