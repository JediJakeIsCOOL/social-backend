var express = require("express");
var router = express.Router();

var db = require('../database');

var con = db.con


router.post('/login', async (req, res) =>{

	
	console.log(req.body)
	// let sqlEmailCheck = `SELECT Count(user_id) AS ResultCount FROM user_data WHERE user_email = "${req.body.email}" AND user_pass = "${req.body.password}"` ;
	// console.log(sqlEmailCheck)
	// con.query(sqlEmailCheck, function (err, result) {
	// 	if(result[0].ResultCount === 1){

	// 		console.log('found')
	// 		// set up login session and what not
	// 	} else {
	// 		res.send('err1')
	// 	}
	// })
	
})

module.exports = router;