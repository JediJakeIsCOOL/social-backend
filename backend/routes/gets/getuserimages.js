var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getuserimages/:userid', (req, res) => {
	console.log(req.params.userid)

	let retreiveProfileInfo = `SELECT gamelink_feedpostmedia, gamelink_feedpostid FROM gamelink_dev_db.gamelink_feedposts WHERE gamelink_userid = ${req.params.userid} and gamelink_feedpostmedia <> '' and gamelink_mediatype <> 'video/quicktime' AND gamelink_isreview <> 1 order by gamelink_feeddate DESC`
	
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