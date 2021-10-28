var mysql = require('mysql');


exports.con = mysql.createConnection({
	host: "db-test-whispe-do-user-8887882-0.b.db.ondigitalocean.com",
	user: "doadmin",
	port: '25060',
	password: "ei78gzwck8vzbez3",
	database: 'gamelink_dev_db'
});

exports.con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!" );
})


