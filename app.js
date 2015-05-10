var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var allowCrossDomain = function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept", "Access-Control-Allow-Origin");
	res.header("Allow-Credentials", true);
	res.header("Access-Control-Allow-Credentials", true)
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");

	next();
};
app.use(allowCrossDomain);

var port = process.env.PORT || 3000;
console.log("Express server running on " + port);
app.listen(process.env.PORT || port);