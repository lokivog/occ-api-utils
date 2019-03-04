const occ = require("./occ.js");
const targetconfig = require('./target-host.json');
const sourceconfig = require('./source-host.json');
var argv = require('minimist')(process.argv.slice(2));

console.dir(argv);
//var args = process.argv.slice(2);
console.log(argv.f);

var data = {};

//-g name of product type
if (argv.g || argv.grab || argv.x || argv.transfer) {
	//-t template
	if (argv.template === "getProductType") {
		var tmpData = {
			"id": argv.productType
		}
		var template = occ.transformJson("templates/getProductType.json", tmpData, "get");
		console.log("template: " + JSON.stringify(template));
		//console.log(sourceconfig);
		data = occ.executeRequest(sourceconfig, template);
		console.log("source data: " + JSON.stringify(data));
		const fs = require('fs');
/*
		fs.writeFile("input/" + argv.productType, "Hey there!", function(err) {
			if (err) {
				return console.log(err);
			}

			console.log("The file was saved!");
		});*/
	}
}

if (false) {
	if (argv.t || argv.put || argv.x || argv.transfer) {
		//-j json fileName - when creating or updating product types with existing files
		if (argv.t || argv.put) {
			console.log("data: " + argv.j)
			try {
				let rawdata = fs.readFileSync(argv.j, 'utf8');
				data = JSON.parse(rawdata);
			} catch (e) {
				console.log("Error", e.stack);
			}
		}
		if (argv.targetTemplate) {
			var fileName = "templates/" + argv.targetTemplate + ".json";
			console.log("fileName: " + fileName);
			var template = occ.transformJson(fileName, data, 'post');
			console.log("targetTemplate: " + template);
			occ.executeRequest(targetconfig, template);
		}
	}
}

//var template = occ.transformJson("templates/productType.json", args[0]);
//occ.executeRequest(config, template);



//var template = occ.transformJson("templates/productType.json", args[0]);
//console.log("template: " + template);
//occ.executeRequest(config, template);