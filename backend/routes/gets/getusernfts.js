var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getusernfts/:userid/:currentlyplaying', (req, res) => {

	let getusernfts = `
		SELECT usersnfts.*, ROUND(AVG(nft_ratings.nft_rating), 2) AS rating, feedposts.feedpostid
		FROM maindatabase.usersnfts
		LEFT JOIN maindatabase.nft_ratings ON usersnfts.nftid = nft_ratings.nft_id AND usersnfts.userid = nft_ratings.nft_ratinguserid
		left join maindatabase.feedposts ON feedposts.userid = usersnfts.userid AND feedposts.nftid = usersnfts.nftid
		WHERE usersnfts.userid = ${req.params.userid} AND usersnfts.currentlytrading = ${req.params.currentlyplaying}
		GROUP BY usersnfts.nftid
	`
	//gets nfts attached to a user
	con.query(getusernfts, function (err, result) {
		if(err){
			console.log(err)
			return
		}
		res.send(result)
		// set up login session and what not
	 })
})


module.exports = router;
