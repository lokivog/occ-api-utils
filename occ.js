const ST = require('stjs');
const request = require("request");
const fs = require('fs');


module.exports = {

	/** Transforms json data to a json template using the stjs library **/
	transformJson: function(templateFileName, data, method) {


		try {
			let rawdata = fs.readFileSync(templateFileName, 'utf8');
			var template = JSON.parse(rawdata);
		} catch (e) {
			console.log("Error", e.stack);
		}


		var sel = ST.select(data).transformWith(template);

		//console.log(JSON.stringify(sel));
		var objects = sel.values();

		var apis = [];
		objects.forEach(function(object) {

			if (typeof object.payload !== 'undefined') {
				//if (object.payload.length > 0) {
				object.payload.forEach(function(item) {
					var api = {
						"endpoint": object.endpoint,
						"method": method,
						"payload": item
					}
					apis.push(api)
				});
				//}
			}
		});
		return apis;
	},

	executeRequest: function(config, json) {

		var loginPromise = login(config);

		return new Promise(function(resolve, reject) {
			loginPromise
				.then(function(access_token) {
					if (access_token) {
						var promise = makeGetRequest(config, access_token, json);
						promise.then(function(data) {
							console.log("new data: " + JSON.stringify(data));
							resolve(data);
						})
						//console.log("promise: " + promise);
						//return promise;
					}
				}, errHandler)
				.then(function(data) {
					console.log("then 2: " + data);
				})
			//console.log("result: " + result);
		})
	}
}


function login(config) {

	var options = {
		method: 'POST',
		url: config.host + '/ccadmin/v1/login',
		body: "grant_type=client_credentials",
		headers: {
			'cache-control': 'no-cache',
			Authorization: 'Bearer ' + config.api_key,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: false
	};


	console.log("Request URL: " + options.url);
	return new Promise(function(resolve, reject) {
		request(options, function(error, response, body) {
			if (error) {
				console.log(error);
				reject(error)
			} else {
				console.log("Status Code: " + response.statusCode);
				if (response.statusCode === 200) {
					access_token = (JSON.parse(body)).access_token;
					resolve(access_token);
				} else {
					reject(JSON.stringify(response));
				}
			}
		});
	});
}


var errHandler = function(err) {
	console.error("request error: " + err);
}


function makeRequest(config, access_token, apis) {

	if (apis.length > 0) {
		var api = apis.shift();
		var options = {
			method: api.method,
			url: config.host + api.endpoint,
			headers: {
				'cache-control': 'no-cache',
				'Authorization': 'Bearer ' + access_token,
				'X-CCAsset-Language': 'en',
				'Content-Type': 'application/json'
			},
			body: api.payload,
			json: true
		};

		console.log("Request URL: " + options.url);
		request(options, function(error, response, body) {
			console.log("Status Code: " + response.statusCode);
			if (error) {
				console.log(error + "\n" + options);
			}
			console.log(JSON.stringify(body));
			console.log("\n\n");
			if (apis.length > 0) {
				return makeRequest(config, access_token, apis);
			} else {
				console.log("returning body: " + JSON.stringify(body));
				return body;
			}
		});


	}
}

function makeGetRequest(config, access_token, apis) {

	if (apis.length > 0) {
		var api = apis.shift();
		var options = {
			method: api.method,
			url: config.host + api.endpoint,
			headers: {
				'cache-control': 'no-cache',
				'Authorization': 'Bearer ' + access_token,
				'X-CCAsset-Language': 'en',
				'Content-Type': 'application/json'
			},
			body: api.payload,
			json: true
		};

		console.log("Request URL: " + options.url);
		return new Promise(function(resolve, reject) {
			request(options, function(error, response, body) {
				console.log("Status Code: " + response.statusCode);
				if (error) {
					console.log(error + "\n" + options);
					reject(error);
				}
				resolve(body)
			});
		});


	}
}