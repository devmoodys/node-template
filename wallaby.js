module.exports = function(wallaby) {
  return {
    files: [
      "src/**/*.js",
      "package.json",
      "tests/support/*.js",
      "build/manifest.json"
    ],

    tests: ["tests/**/*.test.js"],

    env: {
      type: "node",
      runner: "node"
    },

    testFramework: "jest",

    compilers: {
      "**/*.js": wallaby.compilers.babel()
    },

    setup: function(wallaby) {
      const jestConfig = require("./package.json").jest;
      jestConfig.globals = { __DEV__: true };
      wallaby.testFramework.configure(jestConfig);
    }
  };
};
