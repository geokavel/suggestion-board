var http = require('http');
var formidable = require('formidable');
var fs = require('fs'); 

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/json', 'Access-Control-Allow-Origin' : '*', 'Access-Control-Allow-Headers': 'Content-Type'});
	 var form = new formidable.IncomingForm();
		form.parse(req,  function (err, fields, files) {
			if(fields.user == undefined || fields.pass == undefined) {res.end();return;}
			fs.readFile("passes.json",function(err,passes) {
				passes = JSON.parse(passes.toString());
				if(passes[fields.user]==fields.pass) {
					fs.readFile("suggestions.json", function(err,data) {
					if(req.url=="/login") {
					res.end(data);
					}
					else if(req.url=='/append') {
						data = JSON.parse(data.toString());
				var record = {};
				record.name = fields.name;
				record.subject = fields.subject;
				record.msg = fields.msg;
				record.date = new Date().toLocaleString();
				record.wasRead = "Unread";
				record.status = "Pending";
				record.comment = "";
				record.readDate = "";
				record.decisionDate = "";
				record.index = data.length;
				data.push(record);
				data = JSON.stringify(data);
				fs.writeFile("suggestions.json", data, function(err) {
					if(err) throw(err);
					res.end(data);
				});
					}
					else if(req.url=="/admin" && fields.user=="admin") {
					data = JSON.parse(data.toString());
					var record = data[fields.index];
					if(fields.wasRead=="Read" && record.wasRead!=fields.wasRead) record.readDate = new Date().toLocaleString();
					if(fields.status!="Pending" && record.status!=fields.status) record.decisionDate = new Date().toLocaleString();
					record.wasRead = fields.wasRead;
					record.status = fields.status;
					record.comment = fields.comment;
					data = JSON.stringify(data);
					fs.writeFile("suggestions.json", data, function(err) {
						if(err) throw(err);
						res.end(data);
					});
					}
					});
				}
				else {
				res.end("invalid");
			}
			});
		});
}).listen(8080); 
