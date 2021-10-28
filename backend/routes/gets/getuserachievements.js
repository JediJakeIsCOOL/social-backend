var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getuserachievements/:userid', (req, res) => {

	let retreiveProfileInfo = `SELECT * FROM gamelink_userachievements WHERE gamelink_userid = "${req.params.userid}"`
	
	con.query(retreiveProfileInfo, function (err, result) {
	
        res.send(result)
        // set up login session and what not
	
 	})
	
})


module.exports = router;