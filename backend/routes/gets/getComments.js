const e = require("express");
var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getComments/:feedpostid/:userauthid', (req, res) => {
		let getusercomments = `
			SELECT feedpostcomments.*, users.*
			FROM maindatabase.feedpostcomments
	    join maindatabase.users ON feedpostcomments.userid_comment = users.userid
	    LEFT JOIN maindatabase.blockusers ON users.userid = blockusers.userid
	    left join maindatabase.hidecomments on feedpostcomments.feedpostcomment_id = hidecomments.feedpostcomment_id
	    WHERE feedpostcomments.feedpostid = ${req.params.feedpostid} AND blockusers.userid IS NULL AND hidecomments.userid IS NULL
			ORDER BY feedpostcomments.commentpostpoints DESC
    `
    con.query(getusercomments, function (err, result1) {
    	var userVotePostIds = []

			if(err){
				console.log(err)
				return
	        }
	        if(result1.length){
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
	                    // we need votes that loggedinuserid has made , on a specific comment id
	                    let getUserVotes = `SELECT feedpostcomment_id FROM maindatabase.userpostvotes WHERE feedpostid = ${req.params.feedpostid} AND userid = ${result[0].userid} AND feedpostcomment_id IS NOT NULL`

	                    con.query(getUserVotes, function (err, result) {
	                        if(err){
	                            console.log(err)
	                            return
	                        }
	                        for(var x = 0; x < result.length; x++){
	                            userVotePostIds.push(parseInt(result[x].feedpostcomment_id))
	                        }
	                        result1[0].userVoteIds = userVotePostIds
	                        res.send(result1)
	                    })
	                })
	            } else {
	                if(result1.length){
	                    result1[0].userVoteIds = userVotePostIds
	                }
	                 res.send(result1)
	            }
	        } else {
	            res.send(result1)
	        }
	    })

})


module.exports = router;
