const e = require("express");
var express = require("express");var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getfeedpost/:feedpostid/:userid', (req, res) => {
   
	let getUserGames = `
		SELECT gamelink_feedposts.*, gamelink_users.*, ROUND(AVG(game_ratings.rating), 2) AS rating, game_ratings.game_review, games.game_title, platforms.name
		FROM gamelink_dev_db.gamelink_feedposts
        left join gamelink_dev_db.gamelink_usersgames ON gamelink_usersgames.gamelink_gameid = gamelink_feedposts.gamelink_gameid
		LEFT JOIN thegamesdb_db.game_ratings ON gamelink_feedposts.gamelink_gameid = game_ratings.game_id AND gamelink_feedposts.gamelink_userid = game_ratings.game_userid
		left JOIN thegamesdb_db.games ON gamelink_feedposts.gamelink_gameid = games.id
        left JOIN thegamesdb_db.platforms ON games.platform = platforms.id
        join gamelink_dev_db.gamelink_users ON gamelink_feedposts.gamelink_userid = gamelink_users.gamelink_userid
        WHERE gamelink_feedposts.gamelink_feedpostid = ${req.params.feedpostid}
		GROUP BY gamelink_feedposts.gamelink_gameid
    `
    
    
	
	con.query(getUserGames, function (err, result1) {
		if(err){
			console.log(err)
			return
        }

    
        if(req.params.userid !== '0'){
            result1[0]['loggedInId'] =  req.params.userid
            let getUserVotes = `SELECT gamelink_feedpostid FROM gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_feedpostid = ${req.params.feedpostid} AND gamelink_userid = ${req.params.userid} AND gamelink_feedpostcomment_id IS NULL`

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
        } else {
            res.send(result1)
        }
        })
        
	 
	
})


module.exports = router;