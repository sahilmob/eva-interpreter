const Eva = require("../Eva");
const Environment = require("../environment");

const tests = [
  require("./self-eval.test"),
  require("./math.test"),
  require("./vars.test"),
  require("./block.test"),
  require("./if.test"),
  require("./while.test"),
  require("./built-in-functions.test"),
  require("./user-defined-functions.test"),
  require("./lambda-functions.test"),
  require("./switch.test"),
  require("./class.test"),
];

const eva = new Eva();

tests.forEach((test) => test(eva));
eva.eval(["print", '"Hello"', '"World!"']);
console.log("All assertions passed!");
