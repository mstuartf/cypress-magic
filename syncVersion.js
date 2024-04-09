const fs = require("fs");
const manifestJson = "./public/manifest.json";
const packageJson = "./package.json";

const manifestObj = require(manifestJson);
const packageObj = require(packageJson);

manifestObj.version = packageObj.version;

fs.writeFile(
  manifestJson,
  JSON.stringify(manifestObj, null, 2),
  function writeJSON(err) {
    if (err) return console.log(err);
    console.log("writing to " + manifestJson);
  }
);
