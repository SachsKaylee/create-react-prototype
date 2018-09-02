const paths = require("../../helper/paths");
const path = require("path");

const modulePaths = [
  path.join(paths.getProjectFolder(), "./node_modules"),
  path.join(paths.getMyFolder(), "./node_modules")
];

module.exports = {
  verbose: true,
  modulePathIgnorePatterns: [
    paths.getDistFolder()
  ],
  transform: {
    "^.+\\.js$": path.join(__dirname, "./jest.transform.js")
  },
  moduleDirectories: modulePaths,
  modulePaths: modulePaths,
  moduleFileExtensions: ["js", "jsx"],
  rootDir: paths.getProjectFolder(),
  roots: [paths.getProjectFolder()],
  testURL: "http://localhost",
  setupFiles: [
    path.join(__dirname, "./jest.setup.js")
  ]
};