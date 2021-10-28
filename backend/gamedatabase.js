var mysql = require('mysql');


exports.con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: 'nfttableyay'
});

exports.con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!" );
})
