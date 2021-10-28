var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getuservideos/:userid', (req, res) => {

	let retreiveProfileInfo = `SELECT feedpostmedia, feedpostid FROM maindatabase.feedposts WHERE userid = ${req.params.userid} and feedpostmedia <> '' and mediatype = 'video/quicktime' AND isreview <> 1 order by feeddate DESC`
	
	con.query(retreiveProfileInfo, function (err, result) {
		if(err){
			console.log(err)
			return
		}
		res.send(result)

			// set up login session and what not
	
 	})
	
})


module.exports = router;