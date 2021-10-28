const e = require("express");
var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getComments/:feedpostid/:userauthid', (req, res) => {
	let getUserGames = `
		SELECT gamelink_feedpostcomments.*, gamelink_users.*
		FROM gamelink_dev_db.gamelink_feedpostcomments
        join gamelink_dev_db.gamelink_users ON gamelink_feedpostcomments.gamelink_userid_comment = gamelink_users.gamelink_userid
        LEFT JOIN gamelink_dev_db.gamelink_blockusers ON gamelink_users.gamelink_userid = gamelink_blockusers.gamelink_userid
        left join gamelink_dev_db.gamelink_hidecomments on gamelink_feedpostcomments.gamelink_feedpostcomment_id = gamelink_hidecomments.gamelink_feedpostcomment_id
        WHERE gamelink_feedpostcomments.gamelink_feedpostid = ${req.params.feedpostid} AND gamelink_blockusers.gamelink_userid IS NULL AND gamelink_hidecomments.gamelink_userid IS NULL
        ORDER BY gamelink_feedpostcomments.gamelink_feedpostcomment_id
    `


    
    con.query(getUserGames, function (err, result1) {
        var userVotePostIds = []
		if(err){
			console.log(err)
			return
        }
        if(result1.length){
            if(req.params.userauthid !== '0'){
                let getLoggedInUserId = `SELECT gamelink_userid from gamelink_dev_db.gamelink_users WHERE gamelink_userauthid = '${req.params.userauthid}'`

                con.query(getLoggedInUserId, function (err, result) {
                 
                    if(err){
                        console.log(err)
                        return
                    }
                    if(result.length){
                        result1[0]['loggedInId'] = result[0].gamelink_userid
                    } else {
                        result1[0]['loggedInId'] = 0
                    }

                    // we need votes that loggedinuserid has made , on a specific comment id
                  
                    let getUserVotes = `SELECT gamelink_feedpostcomment_id FROM gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_feedpostid = ${req.params.feedpostid} AND gamelink_userid = ${result[0].gamelink_userid} AND gamelink_feedpostcomment_id IS NOT NULL`
                 
                    con.query(getUserVotes, function (err, result) {
                        if(err){
                            console.log(err)
                            return
                        }
                    
                        for(var x = 0; x < result.length; x++){
                            userVotePostIds.push(parseInt(result[x].gamelink_feedpostcomment_id))
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