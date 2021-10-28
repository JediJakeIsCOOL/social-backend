var express = require("express");
var router = express.Router();

var db = require('../../database');

var con = db.con;


router.get('/getprofilefeed/:userid/:feedtype', (req, res) => {

	if(req.params.feedtype === '0'){
		var retreiveProfileInfo = 
		`SELECT gamelink_feedposts.*, gamelink_users.gamelink_username, gamelink_users.gamelink_userpic, games.game_title, platforms.name AS platform_name, game_ratings.game_review, game_ratings.rating, IFNULL(t2.commentCount, 0) AS commentCount
		FROM gamelink_dev_db.gamelink_feedposts
		JOIN gamelink_dev_db.gamelink_users ON gamelink_users.gamelink_userid = gamelink_feedposts.gamelink_userid
		left join gamelink_dev_db.gamelink_usersgames ON gamelink_usersgames.gamelink_gameid = gamelink_feedposts.gamelink_gameid
		left JOIN ( SELECT gamelink_feedpostcomments.gamelink_feedpostid, count(gamelink_feedpostcomments.gamelink_feedpostcomment_id) AS commentCount from gamelink_dev_db.gamelink_feedpostcomments group by gamelink_feedpostcomments.gamelink_feedpostid) t2 ON t2.gamelink_feedpostid = gamelink_feedposts.gamelink_feedpostid
		LEFT JOIN thegamesdb_db.games ON gamelink_feedposts.gamelink_gameid = games.id
		LEFT JOIN thegamesdb_db.platforms ON games.platform = platforms.id
		LEFT JOIN thegamesdb_db.game_ratings ON gamelink_feedposts.gamelink_gameid = game_ratings.game_id AND gamelink_feedposts.gamelink_userid = game_ratings.game_userid
		where gamelink_users.gamelink_userid = ${req.params.userid} ORDER BY gamelink_feedposts.gamelink_feedpostid DESC`
	} else if(req.params.feedtype === '1') {
		var retreiveProfileInfo = 
		`SELECT gamelink_feedposts.*, gamelink_users.gamelink_username, gamelink_users.gamelink_userpic, games.game_title, platforms.name AS platform_name, game_ratings.game_review, game_ratings.rating, IFNULL(t2.commentCount, 0) AS commentCount
		FROM gamelink_dev_db.gamelink_feedposts
		JOIN gamelink_dev_db.gamelink_users ON gamelink_users.gamelink_userid = gamelink_feedposts.gamelink_userid
		left join gamelink_dev_db.gamelink_usersgames ON gamelink_usersgames.gamelink_gameid = gamelink_feedposts.gamelink_gameid
		left JOIN ( SELECT gamelink_feedpostcomments.gamelink_feedpostid, count(gamelink_feedpostcomments.gamelink_feedpostcomment_id) AS commentCount from gamelink_dev_db.gamelink_feedpostcomments group by gamelink_feedpostcomments.gamelink_feedpostid) t2 ON t2.gamelink_feedpostid = gamelink_feedposts.gamelink_feedpostid
		LEFT JOIN thegamesdb_db.games ON gamelink_feedposts.gamelink_gameid = games.id
		LEFT JOIN thegamesdb_db.platforms ON games.platform = platforms.id
		LEFT JOIN thegamesdb_db.game_ratings ON gamelink_feedposts.gamelink_gameid = game_ratings.game_id AND gamelink_feedposts.gamelink_userid = game_ratings.game_userid
		where gamelink_users.gamelink_userid = ${req.params.userid} ORDER BY gamelink_feedposts.gamelink_feedpostpoints DESC`
	} else if(req.params.feedtype === '2'){
		var retreiveProfileInfo = 
		`SELECT gamelink_feedposts.*, gamelink_users.gamelink_username, gamelink_users.gamelink_userpic, games.game_title, platforms.name AS platform_name, game_ratings.game_review, game_ratings.rating, IFNULL(t2.commentCount, 0) AS commentCount
		FROM gamelink_dev_db.gamelink_feedposts
		JOIN gamelink_dev_db.gamelink_users ON gamelink_users.gamelink_userid = gamelink_feedposts.gamelink_userid
		left join gamelink_dev_db.gamelink_usersgames ON gamelink_usersgames.gamelink_gameid = gamelink_feedposts.gamelink_gameid
		left JOIN ( SELECT gamelink_feedpostcomments.gamelink_feedpostid, count(gamelink_feedpostcomments.gamelink_feedpostcomment_id) AS commentCount from gamelink_dev_db.gamelink_feedpostcomments group by gamelink_feedpostcomments.gamelink_feedpostid) t2 ON t2.gamelink_feedpostid = gamelink_feedposts.gamelink_feedpostid
		LEFT JOIN thegamesdb_db.games ON gamelink_feedposts.gamelink_gameid = games.id
		LEFT JOIN thegamesdb_db.platforms ON games.platform = platforms.id
		LEFT JOIN thegamesdb_db.game_ratings ON gamelink_feedposts.gamelink_gameid = game_ratings.game_id AND gamelink_feedposts.gamelink_userid = game_ratings.game_userid
		where gamelink_users.gamelink_userid = '${req.params.userid}' and gamelink_feedposts.gamelink_isreview = 1 ORDER BY gamelink_feedposts.gamelink_feedpostid DESC `
	} else if(req.params.feedtype === '3'){
		var retreiveProfileInfo = 
		`SELECT gamelink_feedpostcomments.*, gamelink_users.gamelink_username, gamelink_users.gamelink_userpic, gamelink_feedposts.gamelink_isreview,
		 gamelink_feedposts.gamelink_topgame, gamelink_feedposts.gamelink_currentlyplaying,games.game_title, platforms.name AS platform_name
		FROM gamelink_dev_db.gamelink_feedpostcomments
		JOIN gamelink_dev_db.gamelink_feedposts ON gamelink_feedpostcomments.gamelink_feedpostid = gamelink_feedposts.gamelink_feedpostid
		JOIN gamelink_dev_db.gamelink_users ON gamelink_users.gamelink_userid = gamelink_feedposts.gamelink_userid
		LEFT JOIN thegamesdb_db.games ON gamelink_feedposts.gamelink_gameid = games.id
		left join gamelink_dev_db.gamelink_usersgames ON gamelink_usersgames.gamelink_gameid = gamelink_feedposts.gamelink_gameid
		LEFT JOIN thegamesdb_db.platforms ON games.platform = platforms.id
		where gamelink_feedpostcomments.gamelink_userid_comment = '${req.params.userid}' 
		ORDER BY gamelink_feedpostcomments.gamelink_feedpostcomment_id DESC `
	}
	
	if(req.params.userid){
		con.query(retreiveProfileInfo, function (err, result1) {
			if(err){
				console.log(err)
				return
			}
			if(result1.length){
				result1[0].userVoteIds = ''
			}
			if(result1.length){
				var checkForLoggedInPostVotes = `SELECT gamelink_feedpostid from gamelink_dev_db.gamelink_userpostvotes WHERE gamelink_userid = ${req.params.userid}`
				var userVotePostIds = []
				con.query(checkForLoggedInPostVotes, function (err, result) {
					if(err){
						console.log(err)
						return
					}
					for(var x = 0; x < result.length; x++){
						userVotePostIds.push(parseInt(result[x].gamelink_feedpostid))
					}
					if(result1.length){
						result1[0]['userVoteIds'] = userVotePostIds
						res.send(result1)	
					}
				})
				
			} else {
				res.send(result1)
			} 
			
		})
	}

})


module.exports = router;