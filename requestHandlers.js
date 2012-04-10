var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),
	im = require("imagemagick"),
	util = require("util");

function start(response) {
	console.log("Request handler 'start' was called !!!");
	var body = '<html>'+
	    '<head>'+
	    '<meta http-equiv="Content-Type" '+
	    'content="text/html; charset=UTF-8" />'+
	    '</head>'+
	    '<body>'+
	    '<form action="/upload" enctype="multipart/form-data" '+
	    'method="post">'+
	    '<input type="file" name="upload">'+
	    '<input type="submit" value="Upload file" />'+
	    '</form>'+
	    '</body>'+
	    '</html>';

	response.writeHead(200, {"Content-Type" : "text/html"});    
	response.write(body);
	response.end();
}

function upload(response, request) {
	console.log("Request handler 'upload' was called !!!");

	var form = new formidable.IncomingForm();
	var curDir = process.cwd();
	form.uploadDir = curDir + '/tmp';
	console.log(form.uploadDir);
	form.parse(request, function(error, fields, files) {
		console.log(files.upload.path);

		fs.rename(files.upload.path, curDir + "/tmp/test.jpg", function(err) {
			if(err) {
				fs.unlink(curDir + "/tmp/test.jpg");
				fs.rename(files.upload.path, curDir + "/tmp/test.jpg");
			}
		});

	});
	response.writeHead(200, {"Content-Type":"text/html"});
	response.write("Received image:<br/>");
	fs.stat(__dirname + '/tmp/test.jpg', function(err, stats) {
		if(err) throw err
		console.log(util.inspect(stats));
		response.write("File size:" + stats.size);
	});
	im.readMetadata(__dirname + '/tmp/test.jpg', function(err, metadata) {
		if(err) throw err
		// console.log(metadata);
		response.write("<br/>Created on:" + metadata.exif.dateTimeOriginal);
		response.write("<br/>Camera model:" + metadata.exif.model);
		response.write('<p/> Done');
		response.end();
	});
	response.write("<img src='/show' />");
	response.write("<p/> ");

}


function show(response, request) {
	console.log("Request handler 'show' was called.");

	fs.readFile( __dirname + "/tmp/test.jpg", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type" : "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type" : "image/jpg"});
			response.write(file, "binary");
			response.end();
		}
	})
}

exports.start = start;
exports.upload = upload;
exports.show = show;