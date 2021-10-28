const e = require("express");
var express = require("express");
var router = express.Router();

var db = require('../../database');
var con = db.con;

router.get('/getfeedpost/:feedpostid/:userauthid', (req, res) => {

	let getusernfts = `
		SELECT feedposts.*, users.*, ROUND(AVG(nft_ratings.nft_rating), 2) AS rating
		FROM maindatabase.feedposts
    left join maindatabase.usersnfts ON usersnfts.nftid = feedposts.nftid
		LEFT JOIN maindatabase.nft_ratings ON feedposts.nftid = nft_ratings.nft_id AND feedposts.userid = nft_ratings.nft_ratinguserid
    join maindatabase.users ON feedposts.userid = users.userid
    WHERE feedposts.feedpostid = ${req.params.feedpostid}
		GROUP BY feedposts.nftid
    `
	con.query(getusernfts, function (err, result1) {
		if(err){
			console.log(err)
			return
        }
        if(req.params.userauthid !== '0'){
            let getLoggedInUserId = `SELECT userid from maindatabase.users WHERE userauthid = '${req.params.userauthid}'`
            con.query(getLoggedInUserId, function (err, result) {
                if(err){
                    console.log(err)
                    return
                }
                if(result.length){
                    result1[0]['loggedInId'] = result[0].userid
                } else {
                    result1[0]['loggedInId'] = 0
                }

                let getUserVotes = `SELECT feedpostid FROM maindatabase.userpostvotes WHERE feedpostid = ${req.params.feedpostid}
								AND userid = ${result[0].userid} AND feedpostcomment_id IS NULL`

                con.query(getUserVotes, function (err, result) {
                    if(err){
                        console.log(err)
                        return
                    }
                    if(result.length){
                        result1[0]['isVotedFor'] = 1
                        res.send(result1)
                    }
                    else {
                        result1[0]['isVotedFor'] = 0
                        res.send(result1)
                    }
                })
            })
        } else {
            res.send(result1)
        }
    })
})


module.exports = router;
