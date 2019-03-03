const occ = require("./occ.js");
const config = require('./target-host.json');

var args = process.argv.slice(2);
console.log(args[0]);

var template = occ.buildRequests("templates/productType.json", args[0]);
//console.log("template: " + template);
occ.executeRequest(config, template);
