var mysql = require('mysql');


exports.con = mysql.createConnection({
	username : "doadmin",
	password : "L8xd9QdhCzZmRfvQ",
	host : "db-mysql-nyc3-28502-do-user-8887882-0.b.db.ondigitalocean.com",
	port : "25060",
	database : "maindatabase"
});

exports.con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!" );
})
