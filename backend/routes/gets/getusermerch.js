var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getusermerch/:userid', (req, res) => {

	let retreiveProfileInfo = `SELECT * FROM gamelink_usermerchandise WHERE gamelink_userid = "${req.params.userid}"`
	
	con.query(retreiveProfileInfo, function (err, result) {
	
        res.send(result)
        console.log(result)
        // set up login session and what not
	
 	})
	
})


module.exports = router;