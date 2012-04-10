var http = require("http");
var url = require("url");

function start(route, handle) {
	function onRequest(request, response) {
		var pathName = url.parse(request.url).pathname;
		console.log("Request for " + pathName + " received !!!");
		route(handle, pathName, response, request);
	}

	http.createServer(onRequest).listen(8888);
	console.log("Server has started!!!");
}

exports.start = start;